import type { Metadata } from 'next'
import { Fragment, type ReactNode } from 'react'
import { Client } from '@notionhq/client'
import type {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  GetPageResponse,
  Heading3BlockObjectResponse,
  PageObjectResponse,
  ParagraphBlockObjectResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints'

import { getNotionEnv } from '@/utils/env'

const TITLE = '이력서'
const BASE_URL = 'https://dongwook.kim/resume'
const FALLBACK_RESUME_PAGE_ID = '81617e74c35e4a98956c89717ace443b'

const FALLBACK_UPDATED_AT = '2026-02-15'

const FALLBACK_BLOCKS: BlockObjectResponse[] = [
  {
    object: 'block',
    id: 'fallback-heading-summary',
    parent: { type: 'page_id', page_id: FALLBACK_RESUME_PAGE_ID },
    created_time: '',
    last_edited_time: '',
    created_by: { object: 'user', id: '' },
    last_edited_by: { object: 'user', id: '' },
    has_children: false,
    archived: false,
    in_trash: false,
    type: 'heading_2',
    heading_2: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'Summary', link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text: 'Summary',
          href: null
        }
      ],
      is_toggleable: false,
      color: 'default'
    }
  } as BlockObjectResponse,
  {
    object: 'block',
    id: 'fallback-summary-1',
    parent: { type: 'page_id', page_id: FALLBACK_RESUME_PAGE_ID },
    created_time: '',
    last_edited_time: '',
    created_by: { object: 'user', id: '' },
    last_edited_by: { object: 'user', id: '' },
    has_children: false,
    archived: false,
    in_trash: false,
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content:
              'Next.js 기반 서비스 UI를 설계하고 컴포넌트 시스템을 운영해온 프론트엔드 개발자입니다.',
            link: null
          },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default'
          },
          plain_text:
            'Next.js 기반 서비스 UI를 설계하고 컴포넌트 시스템을 운영해온 프론트엔드 개발자입니다.',
          href: null
        }
      ],
      color: 'default'
    }
  } as BlockObjectResponse
]

export const metadata: Metadata = {
  title: TITLE,
  keywords: ['resume'],
  alternates: {
    canonical: BASE_URL
  },
  openGraph: {
    title: TITLE,
    url: BASE_URL
  },
  twitter: {
    title: TITLE
  },
  metadataBase: new URL(BASE_URL)
}

export const revalidate = 604800

function formatUpdatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
    .format(date)
    .replace(/\.$/, '')
}

function renderRichText(items: RichTextItemResponse[]): ReactNode {
  return items.map((item, index) => {
    const key = `${item.plain_text}-${index}`
    let node: ReactNode = item.plain_text

    if (item.annotations.code) {
      node = <code>{node}</code>
    }
    if (item.annotations.bold) {
      node = <strong>{node}</strong>
    }
    if (item.annotations.italic) {
      node = <em>{node}</em>
    }
    if (item.annotations.strikethrough) {
      node = <s>{node}</s>
    }
    if (item.annotations.underline) {
      node = <u>{node}</u>
    }

    const link =
      item.href ?? (item.type === 'text' ? item.text.link?.url : null)
    if (link) {
      node = (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {node}
        </a>
      )
    }

    return <Fragment key={key}>{node}</Fragment>
  })
}

async function listChildren(
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

async function listChildBullets(
  client: Client,
  blockId: string
): Promise<BulletedListItemBlockObjectResponse[]> {
  const blocks = await listChildren(client, blockId)
  return blocks.filter(
    (block): block is BulletedListItemBlockObjectResponse =>
      block.type === 'bulleted_list_item'
  )
}

async function getResumeData(): Promise<{
  title: string
  updatedAt: string
  blocks: BlockObjectResponse[]
  client: Client | null
}> {
  const notionEnv = getNotionEnv()

  if (!notionEnv.secretKey) {
    return {
      title: '이력서',
      updatedAt: FALLBACK_UPDATED_AT,
      blocks: FALLBACK_BLOCKS,
      client: null
    }
  }

  const pageId = notionEnv.resumePageId ?? FALLBACK_RESUME_PAGE_ID
  const client = new Client({
    auth: notionEnv.secretKey,
    timeoutMs: 5000
  })

  try {
    const [page, blocks] = await Promise.all([
      client.pages.retrieve({ page_id: pageId }),
      listChildren(client, pageId)
    ])

    const fullPage = isPageObjectResponse(page) ? page : null

    return {
      title: fullPage
        ? (
            Object.values(fullPage.properties).find(
              (property) => property.type === 'title'
            ) as { type: 'title'; title: RichTextItemResponse[] } | undefined
          )?.title
            ?.map((item) => item.plain_text)
            .join('') || '이력서'
        : '이력서',
      updatedAt: fullPage?.last_edited_time ?? FALLBACK_UPDATED_AT,
      blocks,
      client
    }
  } catch {
    return {
      title: '이력서',
      updatedAt: FALLBACK_UPDATED_AT,
      blocks: FALLBACK_BLOCKS,
      client: null
    }
  }
}

function isPageObjectResponse(
  page: GetPageResponse
): page is PageObjectResponse {
  return page.object === 'page' && 'properties' in page
}

async function renderResumeBlocks(
  blocks: BlockObjectResponse[],
  client: Client | null
): Promise<ReactNode[]> {
  const items: ReactNode[] = []

  for (const block of blocks) {
    if (block.type === 'column_list' && block.has_children && client) {
      const columns = await listChildren(client, block.id)
      const columnBlocks = await Promise.all(
        columns.map((column) => listChildren(client, column.id))
      )

      if (columnBlocks.length === 3) {
        items.push(
          <section className="flex gap-6" key={block.id}>
            {columnBlocks.map((results, index) => {
              const heading = results[0] as
                | Heading3BlockObjectResponse
                | undefined
              const bullets = results.slice(
                1
              ) as BulletedListItemBlockObjectResponse[]

              return (
                <section className="flex-1" key={`${block.id}-${index}`}>
                  <h3 className="!mt-0">
                    {heading?.type === 'heading_3'
                      ? renderRichText(heading.heading_3.rich_text)
                      : null}
                  </h3>
                  <ul>
                    {bullets.map((bullet) => (
                      <li key={bullet.id}>
                        {renderRichText(bullet.bulleted_list_item.rich_text)}
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </section>
        )
        continue
      }

      if (columnBlocks.length === 2) {
        const periodColumn = columnBlocks[0] as ParagraphBlockObjectResponse[]
        const contentColumn = columnBlocks[1]
        const contentItems: ReactNode[] = []
        let bulletBuffer: ReactNode[] = []

        const flushBulletBuffer = () => {
          if (!bulletBuffer.length) {
            return
          }

          contentItems.push(
            <ul key={`bullets-${contentItems.length}`}>{bulletBuffer}</ul>
          )
          bulletBuffer = []
        }

        for (const subBlock of contentColumn) {
          if (subBlock.type === 'heading_2') {
            flushBulletBuffer()
            contentItems.push(
              <h2 className="!mt-0" key={subBlock.id}>
                {renderRichText(subBlock.heading_2.rich_text)}
              </h2>
            )
            continue
          }

          if (subBlock.type === 'heading_3') {
            flushBulletBuffer()
            contentItems.push(
              <h3 key={subBlock.id}>
                {renderRichText(subBlock.heading_3.rich_text)}
              </h3>
            )
            continue
          }

          if (subBlock.type === 'paragraph') {
            flushBulletBuffer()
            contentItems.push(
              <p key={subBlock.id}>
                {renderRichText(subBlock.paragraph.rich_text)}
              </p>
            )
            continue
          }

          if (subBlock.type === 'bulleted_list_item') {
            if (subBlock.has_children) {
              const children = await listChildBullets(client, subBlock.id)
              bulletBuffer.push(
                <li key={subBlock.id}>
                  {renderRichText(subBlock.bulleted_list_item.rich_text)}
                  {children.length ? (
                    <ul>
                      {children.map((child) => (
                        <li key={child.id}>
                          {renderRichText(child.bulleted_list_item.rich_text)}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            } else {
              bulletBuffer.push(
                <li key={subBlock.id}>
                  {renderRichText(subBlock.bulleted_list_item.rich_text)}
                </li>
              )
            }
            continue
          }

          // table 블록(스킬 툴팁 이미지)은 요청에 따라 렌더하지 않음
        }

        flushBulletBuffer()

        items.push(
          <section className="mb-10 gap-10 xl:flex" key={block.id}>
            <div className="mb-2 min-w-[140px] text-neutral-700 xl:text-neutral-400">
              {periodColumn.map((period) => (
                <div key={period.id}>
                  {renderRichText(period.paragraph.rich_text)}
                </div>
              ))}
            </div>
            <div className="flex-1">{contentItems}</div>
          </section>
        )
      }

      continue
    }

    if (block.type === 'paragraph') {
      items.push(
        <p key={block.id}>{renderRichText(block.paragraph.rich_text)}</p>
      )
      continue
    }

    if (block.type === 'heading_2') {
      items.push(
        <h2 key={block.id}>{renderRichText(block.heading_2.rich_text)}</h2>
      )
      continue
    }

    if (block.type === 'heading_3') {
      items.push(
        <h3 key={block.id}>{renderRichText(block.heading_3.rich_text)}</h3>
      )
    }
  }

  return items
}

export default async function ResumePage() {
  const { title, updatedAt, blocks, client } = await getResumeData()
  let renderedBlocks: ReactNode[]

  try {
    renderedBlocks = await renderResumeBlocks(blocks, client)
  } catch {
    renderedBlocks = await renderResumeBlocks(FALLBACK_BLOCKS, null)
  }

  return (
    <div className="prose-sm prose-neutral !max-w-none xl:prose">
      <p className="text-sm italic text-neutral-400">
        {formatUpdatedAt(updatedAt)} 업데이트됨.
      </p>
      <h1>{title}</h1>
      {renderedBlocks}
    </div>
  )
}
