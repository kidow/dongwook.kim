'use client'

import * as React from 'react'
import { ResponsiveContainer, Tooltip } from 'recharts'

import { cn } from '@/lib/utils'

export type ChartConfig = Record<
  string,
  {
    label?: string
    color?: string
  }
>

interface ChartContainerProps extends React.ComponentProps<'div'> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({
  config,
  children,
  className,
  style,
  ...props
}: ChartContainerProps) {
  const chartStyle = {
    ...Object.fromEntries(
      Object.entries(config).map(([key, value]) => [
        `--color-${key}`,
        value.color ?? 'currentColor'
      ])
    ),
    ...style
  } as React.CSSProperties

  return (
    <div
      data-slot="chart"
      className={cn(
        'text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke="#fff"]]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-reference-line_[stroke="#ccc"]]:stroke-border [&_.recharts-surface]:overflow-visible',
        className
      )}
      style={chartStyle}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export const ChartTooltip = Tooltip
