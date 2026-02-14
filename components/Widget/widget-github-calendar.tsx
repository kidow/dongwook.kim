'use client'

import dayjs from 'dayjs'
import Calendar from 'react-github-contribution-calendar'

type GithubContributionMap = Record<string, number>

type Props = {
  values: GithubContributionMap
}

export default function GithubCalendarClient({ values }: Props) {
  return (
    <Calendar
      values={values}
      until={dayjs().format('YYYY-MM-DD')}
      weekLabelAttributes={{}}
      monthLabelAttributes={{}}
      panelAttributes={{}}
      panelColors={['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']}
    />
  )
}
