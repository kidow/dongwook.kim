'use client'

import { useMemo } from 'react'

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
      {list.map((item) => (
        <Tooltip.v1 key={item} content={item} className="capitalize">
          <li className="flex h-10 min-w-10 items-center justify-center rounded-[10px] border px-2 text-xs font-semibold uppercase">
            {item.slice(0, 2)}
          </li>
        </Tooltip.v1>
      ))}
    </ul>
  )
}
