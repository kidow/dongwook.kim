import { Suspense } from 'react'
import Image from 'next/image'

import Container from '@/components/Container'
import GithubContributions from '@/components/Home/github-contributions'
import Memo from '@/components/Home/memo'
import SocialLinks from '@/components/Home/social-links'
import Swimming from '@/components/Home/swimming'
import { CometCard } from '@/components/ui/comet-card'
import { SparklesText } from '@/components/ui/sparkles-text'
import { TextShimmer } from '@/components/ui/text-shimmer'
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
          <CometCard translateDepth={4} className="shrink-0">
            <Image
              src="/logo.jpg"
              alt="kidow profile photo"
              width={88}
              height={88}
              priority
              className="size-20 rounded-[14px] object-cover sm:size-[88px]"
            />
          </CometCard>
          <div>
            <SparklesText
              as="h1"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
              colors={{ first: '#60a5fa', second: '#dbeafe' }}
              sparklesCount={6}
              scaleRange={[0.2, 0.6]}
              pauseRange={[2, 5]}
            >
              kidow
            </SparklesText>
            <TextShimmer className="mt-1 text-sm" duration={2} repeatDelay={4}>
              Dongwook Kim, web developer
            </TextShimmer>
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

        <Section index={4} title="Swimming">
          <Suspense fallback={<div className="h-[248px] w-full" aria-hidden />}>
            <Swimming />
          </Suspense>
        </Section>

        <Section index={5} title="Work at">
          <a
            href="https://www.feedle.me"
            target="_blank"
            rel="noreferrer"
            className="group -mx-2 flex items-center gap-3.5 rounded-xl p-2 outline-none transition-colors hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[10px] bg-[#fdfff1] p-1">
              {/* Pooding & Kingddulami, Feedle Character Guide cover (keep ratio, never flip) */}
              <Image
                src="/feedle-characters.svg"
                alt=""
                width={48}
                height={33}
                className="h-auto w-full group-hover:animate-wiggle group-focus-visible:animate-wiggle motion-reduce:animate-none"
              />
            </span>
            <span className="flex flex-col">
              <span className="font-medium">Feedle</span>
              <span className="text-sm text-muted-foreground">
                Reptile marketplace
              </span>
            </span>
            <span className="ml-auto shrink-0 whitespace-nowrap text-sm tabular-nums text-muted-foreground">
              Since 2024
            </span>
          </a>
        </Section>

        <Section index={6} title="Memo">
          <Memo />
        </Section>
      </main>
      <footer
        className="animate-enter flex items-center justify-between pb-10 text-sm text-muted-foreground"
        style={{ animationDelay: `${7 * ENTER_STEP_MS}ms` }}
      >
        <span>© {new Date().getFullYear()} kidow</span>
        <span>Hanam, KR</span>
      </footer>
    </Container>
  )
}
