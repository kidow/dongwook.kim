'use client'

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { AnalyticsChartProps } from './types'

interface AnalyticsTooltipProps {
  active?: boolean
  payload?: Array<{
    value?: string | number
  }>
  label?: string
}

function AnalyticsTooltip({ active, payload, label }: AnalyticsTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  const value = Number(payload[0]?.value ?? 0)

  return (
    <div className="min-w-[108px] rounded-lg border border-border bg-card shadow-sm">
      <div className="px-3 py-2 text-lg font-semibold tracking-tight text-foreground">{label}</div>
      <div className="flex items-center gap-1.5 border-t border-border px-3 py-2 text-foreground">
        <span className="size-3 rounded-full border border-white bg-[#3B82F6] shadow-sm" aria-hidden />
        <span className="text-base leading-none text-muted-foreground">방문자 수</span>
        <span className="ml-auto text-xl leading-none font-semibold">{value.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function WidgetAnalyticsChart({ total, percent, list }: AnalyticsChartProps) {
  const edgeTicks = list.length > 1 ? [list[0]?.date, list[list.length - 1]?.date] : list.map((item) => item.date)

  return (
    <li className="col-span-2">
      <Card className="rounded-3xl border-border py-0 shadow-sm">
        <CardHeader className="px-5 pt-5 xl:px-6 xl:pt-6">
          <p className="text-sm text-muted-foreground">총 방문자 수</p>
          <div className="flex items-center gap-3">
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {total.toLocaleString()}
            </CardTitle>
            <Badge variant={percent > 0 ? 'default' : 'secondary'}>
              {percent > 0 ? '↑' : '↓'} {Math.abs(percent)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 xl:px-6 xl:pb-6">
          <ResponsiveContainer width="100%" height={112}>
            <AreaChart data={list}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                ticks={edgeTicks}
                interval={0}
                tickLine={false}
                axisLine={false}
                tick={(props) => {
                  const { x, y, payload, index } = props
                  const isFirst = index === 0
                  const isLast = index === edgeTicks.length - 1
                  const yPos = typeof y === 'number' ? y : Number(y)

                  return (
                    <text
                      x={x}
                      y={yPos + 12}
                      fill="hsl(var(--muted-foreground))"
                      fontSize={12}
                      textAnchor={isFirst ? 'start' : isLast ? 'end' : 'middle'}
                    >
                      {payload.value}
                    </text>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="방문자 수"
                stroke="hsl(var(--primary))"
                fill="url(#colorVisitors)"
                strokeWidth={2}
              />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                content={<AnalyticsTooltip />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </li>
  )
}
