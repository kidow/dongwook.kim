import { Suspense } from 'react'
import Image from 'next/image'
import {
  ArchiveIcon,
  CodeXmlIcon,
  DatabaseIcon,
  ImageIcon,
  KanbanIcon,
  MailIcon,
  NetworkIcon,
  PenToolIcon,
  QrCodeIcon,
  ReceiptIcon,
  SendIcon,
  StickyNoteIcon,
  UtensilsCrossedIcon
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import WidgetGithub from '@/components/Widget/widget-github'
import * as Icon from '@/components/icons'
import { WidgetLink, WidgetMap, WidgetQuote } from '@/components/Widget'
import WidgetAnalytics from '@/components/Widget/widget-analytics'
import WidgetChatbot from '@/components/Widget/widget-chatbot'
import WidgetSpotifyPlayer from '@/components/Widget/widget-spotify-player'
import ThemeModeController from '@/components/Theme/theme-mode-controller'
import WidgetI18n from '@/components/Widget/widget-i18n'

const SIDE_PROJECTS = [
  {
    href: '/memo',
    title: 'MEMO',
    description: '내용이 사라지지 않는',
    icon: <StickyNoteIcon className="size-5" />
  },
  {
    href: '/lunch',
    title: 'Lunch',
    description: '점심 뭐 먹지?',
    icon: <UtensilsCrossedIcon className="size-5" />
  },
  {
    href: '/kanban',
    title: 'Kanban',
    description: '칸반 보드',
    icon: <KanbanIcon className="size-5" />
  },
  {
    href: '/archive',
    title: 'Archive',
    description: '코드 아카이브',
    icon: <ArchiveIcon className="size-5" />
  },
  {
    href: '/code-editor',
    title: 'Code Editor',
    description: '코드 실행기',
    icon: <CodeXmlIcon className="size-5" />
  },
  {
    href: '/api-client',
    title: 'API Client',
    description: 'API 테스트 도구',
    icon: <SendIcon className="size-5" />
  },
  {
    href: '/image-converter',
    title: 'Image Converter',
    description: '이미지 포맷 변환',
    icon: <ImageIcon className="size-5" />
  },
  {
    href: '/qrcode-generator',
    title: 'QR Code',
    description: 'QR코드 생성기',
    icon: <QrCodeIcon className="size-5" />
  },
  {
    href: '/canvas',
    title: 'Canvas',
    description: '가상 화이트보드',
    icon: <PenToolIcon className="size-5" />
  },
  {
    href: '/invoice-generator',
    title: 'Invoice',
    description: '인보이스 생성기',
    icon: <ReceiptIcon className="size-5" />
  },
  {
    href: '/mindmap',
    title: 'Mindmap',
    description: '마인드맵 생성기',
    icon: <NetworkIcon className="size-5" />
  },
  {
    href: '/erd-editor',
    title: 'ERD Editor',
    description: 'ERD 다이어그램 편집기',
    icon: <DatabaseIcon className="size-5" />
  }
] as const

function SideProjectIcon({ children }: ReactProps) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
      {children}
    </span>
  )
}

export default async function Home() {
  return (
    <ul className="duration-400 grid grid-cols-2 gap-6 lg:gap-8 xl:grid-cols-4 xl:gap-10">
      <WidgetLink
        className="col-span-2 xl:col-span-4 xl:hover:rotate-1"
        size="h-[178px] w-full hover:bg-neutral-50 xl:h-[175px] xl:w-[820px]"
        href="https://github.com/kidow"
        target="_blank"
        icon={<Icon.Github />}
        title="Github"
        button={
          <Button
            variant="outline"
            size="sm"
            className="pointer-events-none text-xs font-bold"
          >
            Follow
          </Button>
        }
      >
        <WidgetGithub />
      </WidgetLink>

      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="https://www.feedle.me"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
            <img src="/feedle.png" alt="Feedle" width={20} height={20} />
          </span>
        }
        title="Feedle"
        description="Working since 2024"
        target="_blank"
      />
      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="mailto:wcgo2ling@gmail.com"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
            <MailIcon className="size-5" />
          </span>
        }
        title="Gmail"
        description="wcgo2ling@gmail.com"
      />

      <WidgetMap />
      <li className="row-span-2 h-[178px] w-[178px] overflow-hidden xl:col-span-2 xl:h-[390px] xl:w-[390px]">
        <Card className="h-full w-full overflow-hidden rounded-3xl border-border py-0 shadow-sm">
          <video
            src="/piyong.mov"
            className="h-full w-full object-cover"
            title="Piyong video"
            autoPlay
            loop
            muted
            playsInline
          />
        </Card>
      </li>
      <WidgetI18n />
      <ThemeModeController />

      <WidgetLink
        className="xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] bg-[#F5FAFE] hover:bg-[#F0F7FD]"
        href="https://x.com/__kidow__"
        icon={<Icon.X />}
        target="_blank"
        title="X"
        description="@__kidow__"
      />
      <WidgetSpotifyPlayer />

      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="https://www.instagram.com/__kidow__/"
        icon={<Icon.Instagram />}
        target="_blank"
        title="Instagram"
        description="@__kidow__"
      />

      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] bg-[#F0F6F9] xl:w-[175px] hover:bg-[#E9F4FA]"
        href="https://www.linkedin.com/in/kidow/"
        icon={<Icon.LinkedIn />}
        target="_blank"
        title="LinkedIn"
        description="/in/kidow"
      />

      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="https://www.threads.com/@__kidow__"
        icon={<Icon.Threads />}
        target="_blank"
        title="Threads"
        description="@__kidow__"
      />

      <WidgetQuote />
      <WidgetLink
        className="xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="/blog"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white p-1">
            <Image src="/blog.png" alt="blog" width={20} height={20} />
          </span>
        }
        title="Blog"
        description="/blog"
      />
      <Suspense fallback={<li className="col-span-2" />}>
        <WidgetAnalytics />
      </Suspense>
      <WidgetChatbot />

      <li className="col-span-2 px-2 xl:col-span-4">
        <h3 className="font-semibold uppercase">Side Projects 👨🏻‍💻</h3>
      </li>

      {SIDE_PROJECTS.map((project) => (
        <WidgetLink
          key={project.href}
          className="xl:hover:rotate-2"
          size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
          href={project.href}
          icon={<SideProjectIcon>{project.icon}</SideProjectIcon>}
          title={project.title}
          description={project.description}
        />
      ))}
    </ul>
  )
}
