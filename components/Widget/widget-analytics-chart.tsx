'use client'

import { Area, AreaChart, ResponsiveContainer, XAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { AnalyticsChartProps } from './types'

export default function WidgetAnalyticsChart({ total, percent, list }: AnalyticsChartProps) {
  return (
    <li className="col-span-2">
      <Card className="rounded-3xl border-border py-0 shadow-sm">
        <CardHeader className="px-5 pt-5 xl:px-6 xl:pt-6">
          <p className="text-sm text-muted-foreground">총 방문자 수</p>
          <div className="flex items-baseline gap-3">
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
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                interval="preserveStartEnd"
              />
              <Area
                type="monotone"
                dataKey="방문자 수"
                stroke="hsl(var(--primary))"
                fill="url(#colorVisitors)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </li>
  )
}
