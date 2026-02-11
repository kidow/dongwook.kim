'use client'

import { useMemo } from 'react'

import BrandIcon from '@/components/brand-icons'
import { Tooltip } from '@/shared/ui'

interface ToolItem {
  name: string
  mark: string
  color: string
}

export default function Tools() {
  const list: ToolItem[] = useMemo(
    () => [
      { name: 'supabase', mark: 'SB', color: '#3ECF8E' },
      { name: 'vercel', mark: 'V', color: '#111827' },
      { name: 'notion', mark: 'N', color: '#18181B' },
      { name: 'figma', mark: 'F', color: '#A259FF' },
      { name: 'slack', mark: 'SL', color: '#4A154B' },
      { name: 'trello', mark: 'TR', color: '#0052CC' },
      { name: 'github', mark: 'GH', color: '#0F172A' },
      { name: 'todoist', mark: 'TD', color: '#E44332' }
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
