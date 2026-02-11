import Image from 'next/image'

import Skills from '@/components/Skills'
import Tools from '@/components/Tools'
import * as Icon from '@/components/icons'
import { WidgetLink, WidgetQuote } from '@/components/Widget'

export default function Home() {
  return (
    <ul className="duration-400 grid grid-cols-2 gap-6 xl:grid-cols-4 xl:gap-10">
      <WidgetLink
        className="col-span-2 xl:col-span-4"
        size="flex h-[178px] w-full items-center justify-between hover:bg-neutral-50 xl:h-[175px] xl:w-[820px]"
        href="https://github.com/kidow"
        target="_blank"
        icon={<Icon.Github />}
        title="Github"
        button={
          <span className="rounded-md border bg-slate-50 px-[21px] py-[7px] text-xs font-bold text-neutral-600">
            Follow
          </span>
        }
      />

      <WidgetLink
        className="xl:hover:rotate-2"
        size="h-[178px] w-full xl:h-[175px] xl:w-[175px] hover:bg-neutral-50"
        href="/resume"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border bg-white">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 18h10" />
              <path d="M7 14h10" />
              <path d="M9 10h6" />
              <path d="M6 4h9l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            </svg>
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
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border bg-white">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>
        }
        title="Gmail"
        description="wcgo2ling@gmail.com"
      />

      <li className="col-span-2 overflow-hidden rounded-3xl border shadow-sm xl:col-span-2 xl:h-[390px] xl:w-[390px]">
        <Image
          src="/avatar.svg"
          alt="Kidow avatar"
          width={600}
          height={600}
          className="h-full w-full object-cover"
        />
      </li>

      <li className="col-span-2 rounded-3xl border p-6 shadow-sm xl:col-span-2">
        <h3 className="mb-4 px-2 font-semibold uppercase">Skills ✨</h3>
        <Skills />
      </li>

      <li className="col-span-2 rounded-3xl border p-6 shadow-sm xl:col-span-4">
        <h3 className="mb-4 px-2 font-semibold uppercase">Favorite Tools 🎉</h3>
        <Tools />
      </li>

      <WidgetLink
        className="xl:col-span-2 xl:hover:rotate-1"
        size="h-[178px] w-full xl:h-[175px] xl:w-[390px] hover:bg-neutral-50"
        href="/blog"
        icon={<Icon.Link />}
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
      />

      <WidgetQuote />
    </ul>
  )
}
