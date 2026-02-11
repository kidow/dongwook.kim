'use client'

import { useMemo } from 'react'

import BrandIcon from '@/components/brand-icons'
import { Tooltip } from '@/shared/ui'

interface SkillItem {
  name: string
  mark: string
  color: string
}

export default function Skills() {
  const list: SkillItem[] = useMemo(
    () => [
      { name: 'react', mark: 'R', color: '#149ECA' },
      { name: 'nextjs', mark: 'NX', color: '#111827' },
      { name: 'typescript', mark: 'TS', color: '#3178C6' },
      { name: 'tailwindcss', mark: 'TW', color: '#06B6D4' },
      { name: 'zustand', mark: 'ZS', color: '#8B5CF6' },
      { name: 'nodejs', mark: 'ND', color: '#3C873A' },
      { name: 'postgresql', mark: 'PG', color: '#336791' },
      { name: 'chrome extension', mark: 'CR', color: '#EA4335' },
      { name: 'pnpm', mark: 'PN', color: '#F59E0B' }
    ],
    []
  )

  return (
    <ul className="flex flex-wrap gap-4">
      {list.map((item) => (
        <Tooltip.v1 key={item.name} content={item.name} className="capitalize">
          <li>
            <BrandIcon label={item.mark} bgColor={item.color} />
          </li>
        </Tooltip.v1>
      ))}
    </ul>
  )
}
