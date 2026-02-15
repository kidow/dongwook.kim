import type { Metadata } from 'next'
import Link from 'next/link'

import { getNotionBlogPosts, type BlogPostSummary } from '@/utils/api/notion'

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

export const dynamic = 'force-dynamic'

function getTroubleshootingSteps(errorMessage: string): string[] {
  if (errorMessage.includes('Missing required env')) {
    return [
      '.env.local 파일에 NOTION_SECRET_KEY, NOTION_DATABASE_ID 값을 설정하세요.',
      '서버를 재시작해 환경변수를 다시 로드하세요. (pnpm dev 재실행)',
      'Notion Integration을 대상 데이터베이스에 연결(Share)했는지 확인하세요.'
    ]
  }

  return [
    'NOTION_SECRET_KEY가 유효한 Internal Integration Token인지 확인하세요.',
    'NOTION_DATABASE_ID가 블로그 데이터베이스 ID와 일치하는지 확인하세요.',
    'Notion 데이터베이스에서 게시글의 공개(checkbox) 속성이 의도대로 설정되어 있는지 확인하세요.'
  ]
}

export default async function BlogPage() {
  const postResult = await getNotionBlogPosts(20)
  const posts = postResult.ok && postResult.data.length > 0 ? postResult.data : fallbackPosts
  const showNotice = !postResult.ok

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">블로그</h1>
      {showNotice ? (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Notion API 연동에 실패해 fallback 목록을 표시 중입니다.</p>
          <p className="mt-1 break-all">원인: {postResult.error}</p>
          <ul className="mt-2 list-disc pl-5">
            {getTroubleshootingSteps(postResult.error).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      ) : null}

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
