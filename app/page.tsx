import Image from 'next/image'
import { FileTextIcon, MailIcon } from 'lucide-react'

import Skills from '@/components/Skills'
import Tools from '@/components/Tools'
import WidgetGithub from '@/components/Widget/widget-github'
import * as Icon from '@/components/icons'
import { WidgetLink, WidgetMap, WidgetQuote } from '@/components/Widget'

function CardIcon({ label }: { label: string }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border bg-white text-xs font-semibold">
      {label}
    </span>
  )
}

function PlaceholderWidget({
  title,
  description,
  label,
  className,
  size,
  bgClassName
}: {
  title: string
  description: string
  label: string
  className: string
  size: string
  bgClassName: string
}) {
  return (
    <WidgetLink
      className={className}
      size={`${size} ${bgClassName}`}
      href="#"
      icon={<CardIcon label={label} />}
      title={title}
      description={description}
    />
  )
}

export default function Home() {
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
          <button className="rounded-md border border-neutral-200 bg-slate-50 px-[21px] py-[7px] text-xs font-bold text-neutral-600">
            Follow
          </button>
        }
      >
        <WidgetGithub />
      </WidgetLink>

      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="/resume"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-neutral-200 bg-white">
            <FileTextIcon className="h-5 w-5" />
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
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-neutral-200 bg-white">
            <MailIcon className="h-5 w-5" />
          </span>
        }
        title="Gmail"
        description="wcgo2ling@gmail.com"
      />

      <WidgetMap />
      <li className="row-span-2 h-[178px] w-[178px] overflow-hidden rounded-3xl border border-neutral-200 shadow-sm xl:col-span-2 xl:h-[390px] xl:w-[390px]">
        <iframe
          src="https://giphy.com/embed/fWrDTtdw9nDVWmWrlq"
          className="giphy-embed h-full w-full"
          allowFullScreen
        />
        <p>
          <a href="https://giphy.com/gifs/BoschGlobal-coding-home-office-remote-working-fWrDTtdw9nDVWmWrlq">
            via GIPHY
          </a>
        </p>
      </li>
      <WidgetLink
        className="xl:col-span-2 xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[390px] hover:bg-neutral-50"
        href="/blog"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-neutral-200 bg-white p-1">
            <Image src="/blog.png" alt="blog" width={20} height={20} />
          </span>
        }
        title="Blog"
        description="/blog"
      />

      <li className="col-span-2 rounded-3xl border p-6 shadow-sm xl:col-span-2">
        <h3 className="mb-4 px-2 font-semibold uppercase">Skills ✨</h3>
        <Skills />
      </li>

      <li className="col-span-2 rounded-3xl border p-6 shadow-sm xl:col-span-4">
        <h3 className="mb-4 px-2 font-semibold uppercase">Favorite Tools 🎉</h3>
        <Tools />
      </li>

      <WidgetLink
        className="xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] bg-[#F5FAFE] hover:bg-[#F0F7FD]"
        href="https://twitter.com/__kidow__"
        icon={<Icon.Twitter />}
        target="_blank"
        title="Twitter"
        description="@__kidow__"
      />

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

      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="https://www.producthunt.com/@kidow"
        icon={<Icon.ProductHunt />}
        target="_blank"
        title="ProductHunt"
        description="@kidow"
      />

      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="https://wcgo2ling.tistory.com"
        icon={<CardIcon label="T" />}
        target="_blank"
        title="Tistory"
        description="wcgo2ling"
      />

      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="https://disquiet.io/@kidow"
        icon={<CardIcon label="DQ" />}
        target="_blank"
        title="Disquiet"
        description="@kidow"
      />

      <PlaceholderWidget
        className="xl:col-span-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[390px]"
        bgClassName="bg-emerald-50 hover:bg-emerald-100"
        label="♪"
        title="Spotify"
        description="플레이리스트 위젯은 다음 단계에서 연결됩니다"
      />

      <PlaceholderWidget
        className="xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px]"
        bgClassName="bg-slate-50 hover:bg-slate-100"
        label="GA"
        title="Analytics"
        description="트래픽 통계 위젯은 placeholder 상태입니다"
      />

      <PlaceholderWidget
        className="xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px]"
        bgClassName="bg-blue-50 hover:bg-blue-100"
        label="SC"
        title="Scheduling"
        description="미팅 예약 위젯은 placeholder 상태입니다"
      />

      <PlaceholderWidget
        className="xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px]"
        bgClassName="bg-orange-50 hover:bg-orange-100"
        label="MAP"
        title="Map"
        description="위치 위젯은 placeholder 상태입니다"
      />
    </ul>
  )
}
