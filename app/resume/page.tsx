import type { Metadata } from 'next'

const experiences = [
  {
    company: 'Freelance / Side Project',
    role: 'Frontend Engineer',
    period: '2024 - Present',
    summary:
      'Next.js 기반 제품 UI를 설계하고, 공통 컴포넌트와 디자인 시스템 규칙을 정리했습니다.'
  },
  {
    company: 'Product Team A',
    role: 'Web Developer',
    period: '2022 - 2024',
    summary:
      '운영 서비스의 기능 개선과 성능 최적화, 실험 기반 UI 개선을 반복적으로 수행했습니다.'
  }
]

const skillGroups = [
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
  },
  {
    title: 'Backend / Infra',
    items: ['Node.js', 'PostgreSQL', 'Vercel', 'Supabase']
  },
  {
    title: 'Collaboration',
    items: ['Figma', 'Notion', 'Slack', 'GitHub']
  }
]

export const metadata: Metadata = {
  title: 'Résumé | Dongwook Kim',
  description: '동적 데이터 연결 전 단계의 정적 이력서 UI 스켈레톤입니다.'
}

export default function ResumePage() {
  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm xl:p-8">
        <p className="text-xs uppercase tracking-wide text-neutral-400">Résumé Skeleton</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight xl:text-4xl">Dongwook Kim</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 xl:text-base">
          비즈니스 문제를 기술로 해결하는 웹 개발자입니다. 현재는 Link-in-bio 프로젝트를 기반으로 UI
          중심 마이그레이션을 단계적으로 진행하고 있습니다.
        </p>
      </header>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm xl:p-8">
        <h2 className="text-xl font-semibold">Experience</h2>
        <ul className="mt-5 space-y-4">
          {experiences.map((item) => (
            <li key={`${item.company}-${item.period}`} className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-neutral-900">{item.role}</h3>
                <span className="text-xs text-neutral-500">{item.period}</span>
              </div>
              <p className="mt-1 text-sm text-neutral-500">{item.company}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{item.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm xl:p-8">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {skillGroups.map((group) => (
            <article key={group.title} className="rounded-2xl border border-neutral-200 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">{group.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
