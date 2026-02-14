'use client'

import { AreaChart, BadgeDelta, Card, Flex, Metric, Text } from '@tremor/react'

type Props = {
  total: number
  percent: number
  list: { date: string; '방문자 수': string }[]
}

export default function WidgetAnalyticsChart({ total, percent, list }: Props) {
  return (
    <li className="col-span-2">
      <Card className="rounded-3xl shadow-none ring-neutral-200">
        <Text>총 방문자 수</Text>
        <Flex className="space-x-3 truncate" justifyContent="start" alignItems="baseline">
          <Metric>{total.toLocaleString()}</Metric>
          <BadgeDelta deltaType={percent > 0 ? 'moderateIncrease' : 'moderateDecrease'}>
            {percent}%
          </BadgeDelta>
        </Flex>
        <AreaChart
          className="mt-6 h-28"
          data={list}
          index="date"
          categories={['방문자 수']}
          colors={['blue']}
          showXAxis
          showGridLines={false}
          startEndOnly
          showYAxis={false}
          showLegend={false}
        />
      </Card>
    </li>
  )
}
