import type { Metadata } from 'next'
import Link from 'next/link'

const posts = [
  {
    id: 'migrate-link-in-bio-ui',
    title: 'Link-in-bio UI 마이그레이션 회고',
    description: 'UI 우선 이식 전략과 단계별 커밋 운영 방식을 정리한 글입니다.',
    date: '2026-02-10',
    tags: ['migration', 'nextjs']
  },
  {
    id: 'widget-structure-notes',
    title: 'Widget 구조화 메모',
    description: '정적 위젯과 동적 위젯을 분리해 확장하는 구조를 정리했습니다.',
    date: '2026-02-07',
    tags: ['architecture', 'component']
  },
  {
    id: 'design-token-and-tailwind',
    title: '디자인 토큰과 Tailwind 운영',
    description: '재사용 가능한 UI 토큰을 설계할 때 고려한 기준을 다룹니다.',
    date: '2026-02-04',
    tags: ['tailwind', 'design-system']
  }
]

export const metadata: Metadata = {
  title: '블로그 | Dongwook Kim',
  description: '마이그레이션 중인 블로그 정적 UI 스켈레톤입니다.'
}

export default function BlogPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">블로그</h1>
        <p className="text-sm text-neutral-500 xl:text-base">
          데이터 연동 전 단계의 정적 UI 스켈레톤입니다. 본문은 샘플로 구성되어 있습니다.
        </p>
      </header>

      <hr className="border-neutral-200" />

      <ul className="grid gap-4 xl:grid-cols-2 xl:gap-6">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.id}`}
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
