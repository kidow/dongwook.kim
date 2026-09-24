import { Suspense } from 'react'
import Image from 'next/image'

import Container from '@/components/Container'
import GithubContributions from '@/components/Home/github-contributions'
import Memo from '@/components/Home/memo'
import SocialLinks from '@/components/Home/social-links'
import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'

const ENTER_STEP_MS = 80

interface SectionProps {
  index: number
  title?: string
  className?: string
  children: ReactNode
}

function Section({ index, title, className, children }: SectionProps) {
  return (
    <section
      className={cn('animate-enter', className ?? 'mt-12')}
      style={{ animationDelay: `${index * ENTER_STEP_MS}ms` }}
    >
      {title && (
        <h2 className="mb-4 text-xl font-semibold tracking-tight">{title}</h2>
      )}
      {children}
    </section>
  )
}

export default function Home() {
  return (
    <Container>
      <main className="pb-16 pt-16 sm:pt-24">
        <Section index={0} className="flex items-center gap-4">
          <Image
            src="/logo.jpg"
            alt="kidow profile photo"
            width={88}
            height={88}
            priority
            className="size-20 shrink-0 rounded-[14px] object-cover sm:size-[88px]"
          />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              kidow
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Dongwook Kim</p>
          </div>
        </Section>

        <Section index={1} className="mt-6 flex flex-wrap items-center gap-2">
          <SocialLinks />
        </Section>

        <Section index={2} className="mt-10">
          <p className="max-w-[65ch] text-pretty leading-7 text-muted-foreground">
            I&apos;m a web developer based in Hanam, Korea. I care more about
            the business that code creates than the code itself. I&apos;ve been
            working at Feedle since 2024, and when the tool I want doesn&apos;t
            exist, I build it myself.
          </p>
        </Section>

        <Section index={3}>
          <Suspense
            fallback={<div className="aspect-[7/1] w-full" aria-hidden />}
          >
            <GithubContributions />
          </Suspense>
        </Section>

        <Section index={4} title="Work at">
          <a
            href="https://www.feedle.me"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border p-3 outline-none transition-colors hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white">
              <Image src="/feedle.png" alt="" width={20} height={20} />
            </span>
            <span className="flex flex-col">
              <span className="font-medium">Feedle</span>
              <span className="text-sm text-muted-foreground">
                Web Developer
              </span>
            </span>
            <span className="ml-auto text-sm tabular-nums text-muted-foreground">
              Since 2024
            </span>
          </a>
        </Section>

        <Section index={5} title="Memo">
          <Memo />
        </Section>
      </main>
      <footer
        className="animate-enter flex items-center justify-between pb-10 text-sm text-muted-foreground"
        style={{ animationDelay: `${6 * ENTER_STEP_MS}ms` }}
      >
        <span>© {new Date().getFullYear()} kidow</span>
        <span>Hanam, KR</span>
      </footer>
    </Container>
  )
}
