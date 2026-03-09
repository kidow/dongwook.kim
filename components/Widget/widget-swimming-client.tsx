'use client'

import Lottie from 'lottie-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import swimmerAnimation from '@/public/swimmer.json'

import styles from './widget-swimming.module.css'

export interface SwimChartSession {
  date: string
  distance: number
}

interface WidgetSwimmingClientProps {
  sessions: SwimChartSession[]
}

interface SwimmingTooltipProps {
  active?: boolean
  payload?: Array<{
    value?: string | number
  }>
  label?: string
}

const chartConfig = {
  distance: {
    label: 'Distance (m)',
    color: '#0284c7'
  }
} satisfies ChartConfig

function SwimmingTooltip({ active, payload, label }: SwimmingTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  const distance = Number(payload[0]?.value ?? 0)

  return (
    <div className="min-w-[112px] rounded-xl border border-border bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {distance.toLocaleString()} m
      </p>
    </div>
  )
}

export default function WidgetSwimmingClient({
  sessions
}: WidgetSwimmingClientProps) {
  return (
    <li className="col-span-2 h-[178px] xl:col-span-4 xl:w-full">
      <Card className="group/widget-swimming relative h-full overflow-hidden rounded-3xl border-border bg-white py-0 shadow-sm">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(circle_at_top,rgba(186,230,253,0.18),rgba(255,255,255,0)_68%)]" />

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <CardHeader className="gap-0 px-5 pb-2 pt-5 xl:px-6 xl:pt-6">
            <CardTitle className="text-base font-semibold tracking-tight uppercase">
              My Swimming Diary <span className="ml-1">🏊</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative min-h-0 flex-1 px-0 pb-0">
            <div
              data-swimming-layer="chart"
              className="absolute inset-0 z-0 opacity-70 transition-[opacity,z-index] duration-300 group-hover/widget-swimming:z-20 group-hover/widget-swimming:opacity-100"
            >
              <ChartContainer
                config={chartConfig}
                className="h-full w-full px-3 pb-3 pt-2 xl:px-4 xl:pb-4"
              >
                <LineChart
                  accessibilityLayer
                  data={sessions}
                  margin={{ top: 14, right: 14, left: 8, bottom: 8 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    padding={{ left: 18, right: 8 }}
                  />
                  <YAxis hide />
                  <ChartTooltip
                    cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                    content={<SwimmingTooltip />}
                  />
                  <Line
                    type="monotone"
                    dataKey="distance"
                    stroke="var(--color-distance)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: 'var(--color-distance)',
                      stroke: '#ffffff',
                      strokeWidth: 2
                    }}
                  />
                </LineChart>
              </ChartContainer>
            </div>

            <div
              data-swimming-layer="swimmer"
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/6 z-[5] -translate-x-1/2 -translate-y-1/2"
            >
              <Lottie
                animationData={swimmerAnimation}
                loop
                autoplay
                className={styles.swimmerLottie}
              />
            </div>

            <div
              data-swimming-layer="wave"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-100 transition-opacity duration-300 group-hover/widget-swimming:opacity-70"
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(226,232,240,0.18)_22%,rgba(191,219,254,0.58)_100%)]" />
              <svg
                className={`${styles.waveSvg} absolute inset-x-0 bottom-[-10px] h-[112%] w-full`}
                viewBox="0 0 1320 500"
                preserveAspectRatio="none"
              >
                <path
                  fill="rgba(125, 211, 252, 0.24)"
                  d="M0, 192 C220, 100, 440, 100, 660, 192 C880, 290, 1100, 290, 1320, 192 L1320 500 L0 500"
                />
                <path
                  fill="rgba(56, 189, 248, 0.32)"
                  d="M0, 192 C220, 100, 440, 100, 660, 192 C880, 290, 1100, 290, 1320, 192 L1320 500 L0 500"
                />
                <path
                  fill="rgba(14, 165, 233, 0.42)"
                  d="M0, 192 C220, 100, 440, 100, 660, 192 C880, 290, 1100, 290, 1320, 192 L1320 500 L0 500"
                />
                <path
                  fill="rgba(2, 132, 199, 0.85)"
                  d="M0, 192 C220, 100, 440, 100, 660, 192 C880, 290, 1100, 290, 1320, 192 L1320 500 L0 500"
                />
              </svg>
            </div>
          </CardContent>
        </div>
      </Card>
    </li>
  )
}
