import type { Metadata } from 'next'
import Link from 'next/link'

import { getNotionBlogPosts, type BlogPostSummary } from '@/shared/utils/api/notion'

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
  description: 'Notion 데이터 연동 블로그 목록입니다. 실패 시 정적 fallback을 표시합니다.'
}

export default async function BlogPage() {
  const postsResult = await getNotionBlogPosts()
  const posts = postsResult.ok ? postsResult.data : fallbackPosts

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">블로그</h1>
        <p className="text-sm text-neutral-500 xl:text-base">
          {postsResult.ok
            ? 'Notion 데이터로 렌더링된 목록입니다.'
            : 'Notion 연동이 비활성화되어 정적 fallback 목록을 표시하고 있습니다.'}
        </p>
      </header>

      <hr className="border-neutral-200" />

      <ul className="grid gap-4 xl:grid-cols-2 xl:gap-6">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <time className="text-xs text-neutral-400">{post.date}</time>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-neutral-200 px-2 py-1 text-[10px] font-medium uppercase text-neutral-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="text-lg font-semibold text-neutral-900">{post.title}</h2>
              <p className="mt-2 text-sm text-neutral-500">{post.description}</p>
              <div className="mt-5 text-sm font-medium text-neutral-700">Read article →</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
