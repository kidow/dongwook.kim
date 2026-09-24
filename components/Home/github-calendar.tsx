'use client'

import dayjs from 'dayjs'
import Calendar from 'react-github-contribution-calendar'

import type { GithubContributionMap } from './github-contributions'

interface Props {
  values: GithubContributionMap
}

const PANEL_COLORS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']

export default function GithubCalendar({ values }: Props) {
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
      panelAttributes={{ style: { backgroundColor: 'transparent' } }}
      panelColors={PANEL_COLORS}
    />
  )
}
