import type { Metadata } from 'next'
import Link from 'next/link'
import { Client } from '@notionhq/client'
import type { PageObjectResponse, QueryDataSourceResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

interface BlogPostSummary {
  id: string
  notionPageId: string
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
}

const fallbackPosts: BlogPostSummary[] = [
  {
    id: 'fallback-1',
    notionPageId: 'fallback-1',
    slug: 'migrate-link-in-bio-ui',
    title: 'Link-in-bio UI 마이그레이션 회고',
    description: 'UI 우선 이식 전략과 단계별 커밋 운영 방식을 정리한 글입니다.',
    date: '2026-02-10',
    tags: ['migration', 'nextjs']
  },
  {
    id: 'fallback-2',
    notionPageId: 'fallback-2',
    slug: 'widget-structure-notes',
    title: 'Widget 구조화 메모',
    description: '정적 위젯과 동적 위젯을 분리해 확장하는 구조를 정리했습니다.',
    date: '2026-02-07',
    tags: ['architecture', 'component']
  },
  {
    id: 'fallback-3',
    notionPageId: 'fallback-3',
    slug: 'design-token-and-tailwind',
    title: '디자인 토큰과 Tailwind 운영',
    description: '재사용 가능한 UI 토큰을 설계할 때 고려한 기준을 다룹니다.',
    date: '2026-02-04',
    tags: ['tailwind', 'design-system']
  }
]

export const metadata: Metadata = {
  title: '블로그 | Dongwook Kim',
  description: '웹 개발자의 이야기들을 다룹니다.'
}

function asText(richText: RichTextItemResponse[] = []): string {
  return richText.map((item) => item.plain_text).join('').trim()
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getTitle(properties: PageObjectResponse['properties']): string {
  const keys = ['이름', 'Name', 'title', '제목', 'Title']

  for (const key of keys) {
    const property = properties[key]
    if (property?.type === 'title') {
      const text = asText(property.title)
      if (text) {
        return text
      }
    }
  }

  const fallback = Object.values(properties).find((property) => property.type === 'title')
  return fallback?.type === 'title' ? asText(fallback.title) || 'Untitled' : 'Untitled'
}

function getDescription(properties: PageObjectResponse['properties'], title: string): string {
  const keys = ['설명', 'Description', '요약', 'Summary']

  for (const key of keys) {
    const property = properties[key]
    if (property?.type === 'rich_text') {
      const text = asText(property.rich_text)
      if (text) {
        return text
      }
    }
  }

  return `${title} 포스트`
}

function getDate(page: PageObjectResponse, properties: PageObjectResponse['properties']): string {
  const keys = ['생성일', '게시일', 'Date', 'date', 'Published']

  for (const key of keys) {
    const property = properties[key]
    if (property?.type === 'date' && property.date?.start) {
      return property.date.start.slice(0, 10)
    }
  }

  return page.created_time.slice(0, 10)
}

function getTags(properties: PageObjectResponse['properties']): string[] {
  const keys = ['태그', 'Tags', 'Tag']

  for (const key of keys) {
    const property = properties[key]
    if (property?.type === 'multi_select') {
      return property.multi_select.map((item) => item.name)
    }
  }

  return []
}

function getSlug(page: PageObjectResponse, properties: PageObjectResponse['properties']): string {
  const keys = ['slug', 'Slug', '아이디', 'id']

  for (const key of keys) {
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

  const titleSlug = normalizeSlug(getTitle(properties))
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

function mapPageToPost(page: PageObjectResponse): BlogPostSummary {
  const title = getTitle(page.properties)
  return {
    id: page.id,
    notionPageId: page.id,
    slug: getSlug(page, page.properties),
    title,
    description: getDescription(page.properties, title),
    date: getDate(page, page.properties),
    tags: getTags(page.properties)
  }
}

function isFullPage(
  page: QueryDataSourceResponse['results'][number]
): page is PageObjectResponse {
  return page.object === 'page' && 'properties' in page
}

async function getBlogPostsFromNotion(): Promise<BlogPostSummary[]> {
  const secretKey = process.env.NOTION_SECRET_KEY?.trim()
  const databaseId = process.env.NOTION_DATABASE_ID?.trim()

  if (!secretKey || !databaseId) {
    return fallbackPosts
  }

  try {
    const notion = new Client({ auth: secretKey })
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 20
    })

    const posts = response.results
      .filter(isFullPage)
      .filter((page) => isPublished(page.properties))
      .map(mapPageToPost)

    return posts.length > 0 ? posts : fallbackPosts
  } catch {
    return fallbackPosts
  }
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getBlogPostsFromNotion()

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">블로그</h1>
        <Link href="https://legacy.dongwook.kim" target="_blank">
          <span className="text-lg font-medium text-slate-500 hover:underline">이전 블로그</span>
        </Link>
      </div>

      <hr className="my-8 border-neutral-200" />

      <ul className="grid gap-6 xl:grid-cols-2 xl:gap-10">
        {posts.map((post) => (
          <li key={post.id}>
            <article className="group relative overflow-hidden rounded-[10px] border border-neutral-200 bg-white">
              <div className="h-[170px] w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5 xl:h-[200px] xl:p-6">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-slate-200 bg-white/90 px-2 py-1 text-[11px] font-medium uppercase text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2 p-5 xl:p-6">
                <h2 className="overflow-hidden text-2xl font-extrabold text-slate-900 xl:h-16">
                  <span className="after:bg-primary relative block after:absolute after:bottom-1 after:left-0 after:h-1.5 after:w-full after:origin-bottom-right after:-translate-x-full after:opacity-50 after:transition-transform after:duration-150 after:content-[''] after:group-hover:translate-x-0">
                    {post.title}
                  </span>
                </h2>
                <p className="line-clamp-2 text-slate-500">{post.description}</p>
                <time dateTime={post.date} className="text-sm text-slate-400">
                  {post.date}
                </time>
              </div>
              <Link href={`/blog/${post.slug}`} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </>
  )
}
