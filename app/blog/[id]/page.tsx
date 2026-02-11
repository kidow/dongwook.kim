import type { Metadata } from 'next'
import Link from 'next/link'

interface BlogDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const sampleSteps = [
  '기존 컴포넌트 구조를 분석하고 정적 이식 범위를 먼저 확정합니다.',
  '동적 의존 위젯은 placeholder로 교체해 레이아웃 변형을 최소화합니다.',
  '작업 단위를 작게 나눠 lint/tsc 통과 후 문서와 체크리스트를 즉시 갱신합니다.'
]

export async function generateMetadata({
  params
}: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params

  return {
    title: `${id} | 블로그 | Dongwook Kim`,
    description: '블로그 상세 페이지 정적 UI 스켈레톤입니다.'
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params

  return (
    <article className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm xl:p-8">
      <Link
        href="/blog"
        className="inline-flex items-center rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
      >
        ← 블로그 목록으로
      </Link>

      <header className="space-y-3">
        <p className="text-xs uppercase text-neutral-400">Static Blog Skeleton</p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{id}</h1>
        <p className="text-sm text-neutral-500">2026-02-11 · 약 5분</p>
      </header>

      <hr className="border-neutral-200" />

      <section className="space-y-4 text-sm leading-7 text-neutral-700">
        <h2 className="text-xl font-semibold text-neutral-900">마이그레이션 개요</h2>
        <p>
          이 페이지는 동적 데이터 바인딩 이전 단계에서 레이아웃과 타이포그래피를 먼저 이식하기 위한
          정적 스켈레톤입니다.
        </p>

        <h3 className="pt-2 text-base font-semibold text-neutral-900">진행 원칙</h3>
        <ul className="list-disc space-y-1 pl-5 text-neutral-700">
          {sampleSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>

        <h3 className="pt-2 text-base font-semibold text-neutral-900">코드 예시 Placeholder</h3>
        <pre className="overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-950 p-4 text-xs leading-6 text-neutral-100">
          <code>{`// TODO: 실제 데이터 소스 연결 후 대체
export async function getPostDetail(id: string) {
  return { id, title: 'Sample title', content: [] }
}`}</code>
        </pre>

        <blockquote className="rounded-xl border-l-4 border-emerald-400 bg-emerald-50 p-4 text-sm text-emerald-900">
          추후 단계에서 Notion/Git 기반 데이터 소스 연결, OG 메타데이터 세분화, 본문 렌더러를 순차적으로
          활성화할 예정입니다.
        </blockquote>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <h4 className="text-sm font-semibold text-neutral-800">Share (Placeholder)</h4>
          <p className="mt-2 text-xs leading-5 text-neutral-500">
            링크 복사, SNS 공유 버튼이 들어갈 영역입니다. 현재는 UI 스켈레톤만 배치되어 있습니다.
          </p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-500">
              Copy Link
            </span>
            <span className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-500">
              Share X
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <h4 className="text-sm font-semibold text-neutral-800">Comments (Placeholder)</h4>
          <p className="mt-2 text-xs leading-5 text-neutral-500">
            댓글 시스템 연동 전 단계입니다. 추후 API 연결 시 입력 폼과 목록이 이 영역으로 대체됩니다.
          </p>
          <div className="mt-3 rounded-md border border-dashed border-neutral-300 bg-white px-3 py-2 text-[11px] text-neutral-400">
            댓글 기능 준비 중입니다.
          </div>
        </div>
      </section>
    </article>
  )
}
