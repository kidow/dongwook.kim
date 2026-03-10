'use client'

import dayjs from 'dayjs'
import Calendar from 'react-github-contribution-calendar'

import type { GithubContributionMap } from './types'

interface Props {
  values: GithubContributionMap
}

export default function GithubCalendarClient({ values }: Props) {
  return (
    <Calendar
      values={values}
      until={dayjs().format('YYYY-MM-DD')}
      weekLabelAttributes={{
        style: { fill: 'var(--muted-foreground)', fontSize: '10px' }
      }}
      monthLabelAttributes={{
        style: { fill: 'var(--muted-foreground)', fontSize: '10px' }
      }}
      panelAttributes={{ style: { backgroundColor: "transparent" } }}
      panelColors={['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']}
    />
  )
}
