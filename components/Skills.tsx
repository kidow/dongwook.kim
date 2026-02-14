'use client'

import { useMemo } from 'react'
import Image from 'next/image'

import { Tooltip } from '@/shared/ui'

export default function Skills() {
  const list: string[] = useMemo(
    () => [
      'react',
      'nextjs',
      'typescript',
      'tailwindcss',
      'zustand',
      'nodejs',
      'postgresql',
      'chrome extension',
      'pnpm'
    ],
    []
  )

  return (
    <ul className="flex flex-wrap gap-4">
      {list.map((item, key) => (
        <Tooltip.v1 key={key} content={item} className="capitalize">
          <li className="flex h-10 w-10 items-center justify-center rounded-[10px] border p-1">
            <Image
              src={`/skills/${item}.png`}
              alt={item}
              draggable={false}
              width={40}
              height={40}
              className="select-none"
            />
          </li>
        </Tooltip.v1>
      ))}
    </ul>
  )
}
