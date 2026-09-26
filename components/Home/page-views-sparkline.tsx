'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

export interface DailyViews {
  date: string
  pageviews: number
}

interface PageViewsSparklineProps {
  daily: DailyViews[]
}

const monthDay = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

export default function PageViewsSparkline({ daily }: PageViewsSparklineProps) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(...daily.map((d) => d.pageviews), 1)
  const day = active === null ? null : daily[active]

  return (
    // Screen readers get the totals from the sibling sr-only text.
    <span
      aria-hidden
      className="relative flex h-[18px] items-end"
      onPointerLeave={() => setActive(null)}
    >
      {daily.map((d, i) => (
        // Each column is a full-height hit area wider than the thin bar.
        <span
          key={d.date}
          className="flex h-full items-end px-[0.5px] sm:px-px"
          onPointerEnter={() => setActive(i)}
        >
          <span
            className={cn(
              'w-px min-h-px rounded-[1px] bg-[#60a5fa]/70 transition-colors sm:w-[3px]',
              active === i && 'bg-[#93c5fd]'
            )}
            style={{ height: `${Math.max(6, (d.pageviews / max) * 100)}%` }}
          />
        </span>
      ))}

      {day && (
        <span
          className="pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs text-foreground"
          style={{ left: `${((active! + 0.5) / daily.length) * 100}%` }}
        >
          <span className="font-medium">
            {day.pageviews} {day.pageviews === 1 ? 'view' : 'views'}
          </span>
          <span className="ml-1.5 text-muted-foreground">
            {monthDay(day.date)}
          </span>
        </span>
      )}
    </span>
  )
}
