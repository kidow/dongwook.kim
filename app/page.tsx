import { Suspense } from 'react'
import Image from 'next/image'
import {
  ArchiveIcon,
  CodeXmlIcon,
  FileTextIcon,
  ImageIcon,
  KanbanIcon,
  MailIcon,
  PenToolIcon,
  StickyNoteIcon,
  UtensilsCrossedIcon
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import WidgetGithub from '@/components/Widget/widget-github'
import * as Icon from '@/components/icons'
import { WidgetLink, WidgetMap, WidgetQuote } from '@/components/Widget'
import WidgetAnalytics from '@/components/Widget/widget-analytics'

export default async function Home() {
  return (
    <ul className="duration-400 grid grid-cols-2 gap-6 xl:grid-cols-4 xl:gap-10">
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
        href="/resume"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
            <FileTextIcon className="size-5" />
          </span>
        }
        title="Résumé"
        description="/resume"
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
          <iframe
            src="https://giphy.com/embed/fWrDTtdw9nDVWmWrlq"
            className="giphy-embed h-full w-full"
            title="Coding GIF"
            allowFullScreen
          />
        </Card>
      </li>
      <WidgetLink
        className="xl:col-span-2 xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[390px] hover:bg-neutral-50"
        href="/blog"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white p-1">
            <Image src="/blog.png" alt="blog" width={20} height={20} />
          </span>
        }
        title="Blog"
        description="/blog"
      />

      <WidgetLink
        className="xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] bg-[#F5FAFE] hover:bg-[#F0F7FD]"
        href="https://twitter.com/__kidow__"
        icon={<Icon.Twitter />}
        target="_blank"
        title="Twitter"
        description="@__kidow__"
        button={
          <Button
            size="sm"
            className="pointer-events-none rounded-full bg-[#55acee] text-xs font-bold text-white hover:bg-[#4698d7]"
          >
            Follow
          </Button>
        }
      />
      <li className="col-span-2 row-span-2">
        <Card className="h-[390px] w-full rounded-3xl border-border bg-emerald-50 py-0 shadow-sm" />
      </li>

      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="https://kidow.gumroad.com"
        icon={<Icon.Gumroad />}
        target="_blank"
        title="Gumroad"
        description="kidow.gumroad.com"
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
        href="https://dev.to/kidow"
        icon={<Icon.DevTo />}
        target="_blank"
        title="Dev.to"
        description="/kidow"
      />

      <WidgetQuote />
      <Suspense fallback={<li className="col-span-2" />}>
        <WidgetAnalytics />
      </Suspense>

      <li className="col-span-2 p-4 xl:col-span-4">
        <h3 className="px-2 font-semibold uppercase">Side Projects 👨🏻‍💻</h3>
      </li>
      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px]"
        href="/memo"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
            <StickyNoteIcon className="size-5" />
          </span>
        }
        title="MEMO"
        description="내용이 사라지지 않는"
      />
      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px]"
        href="/lunch"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
            <UtensilsCrossedIcon className="size-5" />
          </span>
        }
        title="Lunch"
        description="점심 뭐 먹지?"
      />
      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px]"
        href="/kanban"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
            <KanbanIcon className="size-5" />
          </span>
        }
        title="Kanban"
        description="칸반 보드"
      />
      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px]"
        href="/archive"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
            <ArchiveIcon className="size-5" />
          </span>
        }
        title="Archive"
        description="코드 아카이브"
      />
      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px]"
        href="/code-editor"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
            <CodeXmlIcon className="size-5" />
          </span>
        }
        title="Code Editor"
        description="코드 실행기"
      />
      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px]"
        href="/image-converter"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
            <ImageIcon className="size-5" />
          </span>
        }
        title="Image Converter"
        description="이미지 포맷 변환"
      />
      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px]"
        href="/canvas"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
            <PenToolIcon className="size-5" />
          </span>
        }
        title="Canvas"
        description="가상 화이트보드"
      />
    </ul>
  )
}
