import { Client } from '@notionhq/client'
import type {
  BlockObjectResponse,
  PageObjectResponse,
  PropertyItemObjectResponse,
  QueryDataSourceResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints'

import { getNotionEnv, requireEnv, type Result } from '@/utils/env'

const RESUME_FALLBACK_PAGE_ID = '81617e74c35e4a98956c89717ace443b'

export type ApiResult<T> = Result<T>

export interface BlogPostSummary {
  id: string
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  notionPageId: string
  thumbnailUrl?: string
}

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading_2'; text: string }
  | { type: 'heading_3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'bulleted_list_item'; text: string }
  | { type: 'code'; text: string; language: string }

export interface BlogPostDetail extends BlogPostSummary {
  blocks: BlogBlock[]
}

export interface ResumeSection {
  title: string
  items: string[]
}

export interface ResumeData {
  title: string
  description: string
  updatedAt: string
  sections: ResumeSection[]
}

function getClient(): ApiResult<Client> {
  const notionEnv = getNotionEnv()
  const envResult = requireEnv(
    {
      NOTION_SECRET_KEY: notionEnv.secretKey
    },
    'notion'
  )

  if (!envResult.ok) {
    return envResult
  }

  return {
    ok: true,
    data: new Client({ auth: envResult.data.NOTION_SECRET_KEY })
  }
}

function getDataSourceIdFromDatabaseResponse(database: unknown): string | null {
  if (!database || typeof database !== 'object') {
    return null
  }

  const dataSources = (database as { data_sources?: Array<{ id?: string }> })
    .data_sources
  if (!Array.isArray(dataSources) || dataSources.length === 0) {
    return null
  }

  const firstId = dataSources[0]?.id
  return typeof firstId === 'string' && firstId.length > 0 ? firstId : null
}

async function getDataSourceId(client: Client): Promise<ApiResult<string>> {
  const notionEnv = getNotionEnv()
  console.log('[Notion] NOTION_DATABASE_ID:', notionEnv.databaseId)
  console.log('[Notion] NOTION_DATA_SOURCE_ID:', notionEnv.dataSourceId)

  if (notionEnv.dataSourceId) {
    return {
      ok: true,
      data: notionEnv.dataSourceId
    }
  }

  if (!notionEnv.databaseId) {
    return {
      ok: false,
      source: 'notion',
      error: 'Missing required env: NOTION_DATA_SOURCE_ID or NOTION_DATABASE_ID'
    }
  }

  const databaseOrDataSourceId = notionEnv.databaseId

  // If NOTION_DATABASE_ID is already a data source ID, this query succeeds.
  try {
    await client.dataSources.query({
      data_source_id: databaseOrDataSourceId,
      page_size: 1
    })

    return {
      ok: true,
      data: databaseOrDataSourceId
    }
  } catch {
    // Otherwise treat it as a database ID and resolve the first data source ID.
  }

  try {
    const database = await client.databases.retrieve({
      database_id: databaseOrDataSourceId
    })

    const dataSourceId = getDataSourceIdFromDatabaseResponse(database)
    if (!dataSourceId) {
      return {
        ok: false,
        source: 'notion',
        error: 'Failed to resolve data source ID from NOTION_DATABASE_ID'
      }
    }

    return {
      ok: true,
      data: dataSourceId
    }
  } catch (error) {
    return {
      ok: false,
      source: 'notion',
      error:
        error instanceof Error
          ? `Failed to resolve data source from NOTION_DATABASE_ID: ${error.message}`
          : 'Failed to resolve data source from NOTION_DATABASE_ID'
    }
  }
}

function getResumePageId(): string {
  return getNotionEnv().resumePageId ?? RESUME_FALLBACK_PAGE_ID
}

function asText(richText: RichTextItemResponse[] = []): string {
  return richText
    .map((item) => item.plain_text)
    .join('')
    .trim()
}

function isFullPage(
  page: QueryDataSourceResponse['results'][number]
): page is PageObjectResponse {
  return page.object === 'page' && 'properties' in page
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getTitleProperty(
  properties: PageObjectResponse['properties']
): string {
  const preferredKeys = ['이름', 'Name', 'title', '제목', 'Title']

  for (const key of preferredKeys) {
    const property = properties[key]
    if (property?.type === 'title') {
      const text = asText(property.title)
      if (text) {
        return text
      }
    }
  }

  const firstTitleProperty = Object.values(properties).find(
    (property) => property.type === 'title'
  )

  if (firstTitleProperty && firstTitleProperty.type === 'title') {
    return asText(firstTitleProperty.title)
  }

  return 'Untitled'
}

function getRichTextProperty(
  properties: PageObjectResponse['properties'],
  keys: string[]
): string {
  for (const key of keys) {
    const property = properties[key]
    if (property?.type === 'rich_text') {
      const text = asText(property.rich_text)
      if (text) {
        return text
      }
    }
  }

  return ''
}

function getDateProperty(
  page: PageObjectResponse,
  properties: PageObjectResponse['properties']
): string {
  const preferredKeys = ['생성일', '게시일', 'Date', 'date', 'Published']

  for (const key of preferredKeys) {
    const property = properties[key]
    if (property?.type === 'date' && property.date?.start) {
      return property.date.start.slice(0, 10)
    }
  }

  const firstDateProperty = Object.values(properties).find(
    (property) => property.type === 'date' && Boolean(property.date?.start)
  )

  if (firstDateProperty?.type === 'date' && firstDateProperty.date?.start) {
    return firstDateProperty.date.start.slice(0, 10)
  }

  return page.created_time.slice(0, 10)
}

function getTagProperty(
  properties: PageObjectResponse['properties']
): string[] {
  const preferredKeys = ['태그', 'Tags', 'Tag']

  for (const key of preferredKeys) {
    const property = properties[key]
    if (property?.type === 'multi_select') {
      return property.multi_select.map((item) => item.name)
    }
  }

  const firstTagProperty = Object.values(properties).find(
    (property) => property.type === 'multi_select'
  )

  if (firstTagProperty?.type === 'multi_select') {
    return firstTagProperty.multi_select.map((item) => item.name)
  }

  return []
}

function getCoverUrl(page: PageObjectResponse): string | undefined {
  if (!page.cover) {
    return undefined
  }

  if (page.cover.type === 'external') {
    return page.cover.external.url
  }

  if (page.cover.type === 'file') {
    return page.cover.file.url
  }

  return undefined
}

function getSlugProperty(
  page: PageObjectResponse,
  properties: PageObjectResponse['properties']
): string {
  const preferredKeys = ['slug', 'Slug', '아이디', 'id']

  for (const key of preferredKeys) {
    const property = properties[key]
    if (!property) {
      continue
    }

    if (property.type === 'rich_text') {
      const text = asText(property.rich_text)
      if (text) {
        return normalizeSlug(text)
      }
    }

    if (property.type === 'title') {
      const text = asText(property.title)
      if (text) {
        return normalizeSlug(text)
      }
    }

    if (property.type === 'select' && property.select?.name) {
      return normalizeSlug(property.select.name)
    }

    if (property.type === 'url' && property.url) {
      return normalizeSlug(property.url.split('/').pop() ?? property.url)
    }
  }

  const titleSlug = normalizeSlug(getTitleProperty(properties))
  if (titleSlug) {
    return titleSlug
  }

  return page.id.replace(/-/g, '').slice(0, 12)
}

function isPublished(properties: PageObjectResponse['properties']): boolean {
  const keys = ['배포', 'published', 'Published', '공개']

  for (const key of keys) {
    const property = properties[key]
    if (property?.type === 'checkbox') {
      return property.checkbox
    }
  }

  return true
}

function mapPostSummary(page: PageObjectResponse): BlogPostSummary {
  const properties = page.properties
  const title = getTitleProperty(properties)

  return {
    id: page.id,
    notionPageId: page.id,
    slug: getSlugProperty(page, properties),
    title,
    description:
      getRichTextProperty(properties, [
        '설명',
        'Description',
        '요약',
        'Summary'
      ]) || `${title} 포스트`,
    date: getDateProperty(page, properties),
    tags: getTagProperty(properties),
    thumbnailUrl: getCoverUrl(page)
  }
}

async function getAllBlocks(
  client: Client,
  blockId: string
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined

  do {
    const response = await client.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor
    })

    for (const block of response.results) {
      if ('type' in block) {
        blocks.push(block as BlockObjectResponse)
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return blocks
}

function mapBlocks(blocks: BlockObjectResponse[]): BlogBlock[] {
  const mapped: BlogBlock[] = []

  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const text = asText(block.paragraph.rich_text)
      if (text) {
        mapped.push({ type: 'paragraph', text })
      }
      continue
    }

    if (block.type === 'heading_2') {
      const text = asText(block.heading_2.rich_text)
      if (text) {
        mapped.push({ type: 'heading_2', text })
      }
      continue
    }

    if (block.type === 'heading_3') {
      const text = asText(block.heading_3.rich_text)
      if (text) {
        mapped.push({ type: 'heading_3', text })
      }
      continue
    }

    if (block.type === 'quote') {
      const text = asText(block.quote.rich_text)
      if (text) {
        mapped.push({ type: 'quote', text })
      }
      continue
    }

    if (block.type === 'bulleted_list_item') {
      const text = asText(block.bulleted_list_item.rich_text)
      if (text) {
        mapped.push({ type: 'bulleted_list_item', text })
      }
      continue
    }

    if (block.type === 'code') {
      const text = asText(block.code.rich_text)
      if (text) {
        mapped.push({
          type: 'code',
          text,
          language: block.code.language
        })
      }
    }
  }

  return mapped
}

function mapResumeSections(blocks: BlockObjectResponse[]): ResumeSection[] {
  const sections: ResumeSection[] = []
  let currentTitle = 'Summary'

  const ensureCurrentSection = () => {
    const existing = sections.find((section) => section.title === currentTitle)
    if (existing) {
      return existing
    }

    const section: ResumeSection = {
      title: currentTitle,
      items: []
    }
    sections.push(section)
    return section
  }

  for (const block of blocks) {
    if (block.type === 'heading_2') {
      const title = asText(block.heading_2.rich_text)
      if (title) {
        currentTitle = title
        ensureCurrentSection()
      }
      continue
    }

    if (block.type === 'heading_3') {
      const title = asText(block.heading_3.rich_text)
      if (title) {
        currentTitle = title
        ensureCurrentSection()
      }
      continue
    }

    if (block.type === 'paragraph') {
      const text = asText(block.paragraph.rich_text)
      if (text) {
        ensureCurrentSection().items.push(text)
      }
      continue
    }

    if (block.type === 'bulleted_list_item') {
      const text = asText(block.bulleted_list_item.rich_text)
      if (text) {
        ensureCurrentSection().items.push(text)
      }
    }
  }

  return sections.filter((section) => section.items.length > 0)
}

function getPageTitleFromRetrieveResult(
  data: PropertyItemObjectResponse | PageObjectResponse
): string {
  if ('properties' in data) {
    return getTitleProperty(data.properties)
  }

  return 'Résumé'
}

export async function getNotionBlogPosts(
  limit = 20
): Promise<ApiResult<BlogPostSummary[]>> {
  const clientResult = getClient()
  if (!clientResult.ok) {
    return clientResult
  }

  const dataSourceResult = await getDataSourceId(clientResult.data)
  if (!dataSourceResult.ok) {
    return dataSourceResult
  }

  try {
    const response = await clientResult.data.dataSources.query({
      data_source_id: dataSourceResult.data,
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: limit
    })

    const posts = response.results
      .filter(isFullPage)
      .filter((page) => isPublished(page.properties))
      .map(mapPostSummary)

    return {
      ok: true,
      data: posts
    }
  } catch (error) {
    return {
      ok: false,
      source: 'notion',
      error:
        error instanceof Error ? error.message : 'Failed to fetch Notion posts'
    }
  }
}

export async function getNotionBlogPostBySlug(
  slug: string
): Promise<ApiResult<BlogPostDetail>> {
  const postsResult = await getNotionBlogPosts(100)
  if (!postsResult.ok) {
    return postsResult
  }

  const normalizedSlug = normalizeSlug(slug)
  const post = postsResult.data.find((item) => {
    const normalizedItemSlug = normalizeSlug(item.slug)
    const notionId = item.notionPageId.replace(/-/g, '')
    return (
      normalizedItemSlug === normalizedSlug ||
      notionId === normalizedSlug.replace(/-/g, '')
    )
  })

  if (!post) {
    return {
      ok: false,
      source: 'notion',
      error: `Post not found for slug: ${slug}`
    }
  }

  const clientResult = getClient()
  if (!clientResult.ok) {
    return clientResult
  }

  try {
    const blocks = await getAllBlocks(clientResult.data, post.notionPageId)

    return {
      ok: true,
      data: {
        ...post,
        blocks: mapBlocks(blocks)
      }
    }
  } catch (error) {
    return {
      ok: false,
      source: 'notion',
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch Notion post detail'
    }
  }
}

export async function getNotionResumeData(): Promise<ApiResult<ResumeData>> {
  const clientResult = getClient()
  if (!clientResult.ok) {
    return clientResult
  }

  const pageId = getResumePageId()

  try {
    const [pageResponse, blocks] = await Promise.all([
      clientResult.data.pages.retrieve({ page_id: pageId }),
      getAllBlocks(clientResult.data, pageId)
    ])

    const sections = mapResumeSections(blocks)
    const description =
      sections.find((section) => section.title === 'Summary')?.items[0] ?? ''

    return {
      ok: true,
      data: {
        title: getPageTitleFromRetrieveResult(
          pageResponse as PropertyItemObjectResponse | PageObjectResponse
        ),
        description,
        updatedAt:
          'last_edited_time' in pageResponse
            ? pageResponse.last_edited_time.slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        sections
      }
    }
  } catch (error) {
    return {
      ok: false,
      source: 'notion',
      error:
        error instanceof Error ? error.message : 'Failed to fetch Notion resume'
    }
  }
}
