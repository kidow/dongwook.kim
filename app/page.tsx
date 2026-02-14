import { Suspense } from 'react'
import Image from 'next/image'
import { FileTextIcon, MailIcon, StickyNoteIcon } from 'lucide-react'

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

      <WidgetLink
        className="xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] bg-[#F5FAFE] hover:bg-[#F0F7FD]"
        href="https://twitter.com/__kidow__"
        icon={<Icon.Twitter />}
        target="_blank"
        title="Twitter"
        description="@__kidow__"
        button={
          <button className="flex items-center justify-center gap-1 rounded-full bg-[#55acee] px-4 py-[7px] text-xs hover:bg-[#4698d7]">
            <span className="font-bold text-white">Follow</span>
          </button>
        }
      />
      <li className="col-span-2 row-span-2">
        <div className="h-[390px] w-full rounded-3xl border border-neutral-200 bg-emerald-50 shadow-sm" />
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
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-neutral-200 bg-white">
            <StickyNoteIcon className="h-5 w-5" />
          </span>
        }
        title="MEMO"
        description="내용이 사라지지 않는"
      />
    </ul>
  )
}
