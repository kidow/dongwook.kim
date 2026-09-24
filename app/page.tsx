import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRightIcon,
  AtSignIcon,
  BrainIcon,
  MailIcon,
  StickyNoteIcon
} from 'lucide-react'

import Container from '@/components/Container'
import GithubContributions from '@/components/Home/github-contributions'
import { GithubIcon, InstagramIcon } from '@/components/Home/social-icons'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/kidow',
    label: 'GitHub',
    icon: <GithubIcon className="size-4" />
  },
  {
    href: 'https://www.instagram.com/__kidow__/',
    label: 'Instagram',
    icon: <InstagramIcon className="size-4" />
  },
  {
    href: 'https://www.threads.com/@__kidow__',
    label: 'Threads',
    // ponytail: 공식 Threads 글리프가 필요하면 simple-icons path로 교체
    icon: <AtSignIcon className="size-4" />
  },
  {
    href: 'https://brain.dongwook.kim',
    label: 'Brain',
    icon: <BrainIcon className="size-4" />
  }
] as const

const PROJECTS = [
  {
    href: '/memo',
    title: 'MEMO',
    description: '내용이 사라지지 않는',
    icon: StickyNoteIcon
  }
] as const

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
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {title}
        </h2>
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
            alt="kidow 프로필 사진"
            width={88}
            height={88}
            priority
            className="size-20 shrink-0 rounded-[14px] object-cover sm:size-[88px]"
          />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              kidow
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              비즈니스에 관심이 많은 웹 개발자
            </p>
          </div>
        </Section>

        <Section index={1} className="mt-6 flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="mailto:wcgo2ling@gmail.com">
              <MailIcon />
              Contact
            </a>
          </Button>
          <TooltipProvider>
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline" size="icon-sm">
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                    >
                      {icon}
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>{label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </Section>

        <Section index={2} className="mt-10">
          <p className="leading-7 text-muted-foreground">
            하남에 사는 웹 개발자입니다. 코드보다 그 코드가 만드는 비즈니스에 더
            관심이 많습니다. 2024년부터 Feedle에서 일하고 있고, 쓰고 싶은 도구가
            없으면 직접 만들어 씁니다. 아래 Projects가 그렇게 만든 것들입니다.
          </p>
        </Section>

        <Section index={3} title="GitHub">
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
            className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
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
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              2024 — Now
            </span>
          </a>
        </Section>

        <Section index={5} title="Projects">
          <ul>
            {PROJECTS.map(({ href, title, description, icon: Icon }) => (
              <li
                key={href}
                className="border-b border-dashed border-border last:border-b-0"
              >
                <Link
                  href={href}
                  className="group flex items-center gap-3 px-1 py-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors group-hover:text-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span className="shrink-0 font-medium">{title}</span>
                  <span className="truncate text-sm text-muted-foreground">
                    {description}
                  </span>
                  <ArrowUpRightIcon className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <footer
        className="animate-enter flex items-center justify-between pb-10 font-mono text-xs text-muted-foreground"
        style={{ animationDelay: `${6 * ENTER_STEP_MS}ms` }}
      >
        <span>© {new Date().getFullYear()} kidow</span>
        <span>Hanam, KR</span>
      </footer>
    </Container>
  )
}
