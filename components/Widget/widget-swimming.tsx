import { createSupabaseServiceRoleClient } from '@/utils/api/supabase'

import WidgetSwimmingClient from './widget-swimming-client'

interface SwimSessionRow {
  date: string
  distance: number | string
}

const FALLBACK_SWIMMING_DATA = [
  { date: '03.04', distance: 1200 },
  { date: '03.05', distance: 1800 },
  { date: '03.06', distance: 2400 },
  { date: '03.07', distance: 2100 },
  { date: '03.08', distance: 2900 },
  { date: '03.09', distance: 3200 },
  { date: '03.10', distance: 3400 }
]

function formatChartDate(value: string) {
  if (/^\d{2}\.\d{2}$/.test(value)) {
    return value
  }

  const [yearMonthDay] = value.split('T')
  const [, month, day] = yearMonthDay.split('-')

  if (!month || !day) {
    return value
  }

  return `${month}.${day}`
}

function toChartSession(session: SwimSessionRow) {
  return {
    date: formatChartDate(session.date),
    distance: Number(session.distance)
  }
}

async function getRecentSwimSessions() {
  try {
    const supabase = createSupabaseServiceRoleClient()
    const { data, error } = await supabase
      .from('swim_sessions')
      .select('date, distance')
      .order('date', { ascending: false })
      .limit(7)

    if (error || !data?.length) {
      return FALLBACK_SWIMMING_DATA
    }

    const sessions = data
      .filter((session): session is SwimSessionRow => {
        return Boolean(session?.date) && session?.distance != null
      })
      .map(toChartSession)

    if (!sessions.length) {
      return FALLBACK_SWIMMING_DATA
    }

    return sessions.slice().reverse()
  } catch {
    return FALLBACK_SWIMMING_DATA
  }
}

export default async function WidgetSwimming() {
  const sessions = await getRecentSwimSessions()

  return <WidgetSwimmingClient sessions={sessions} />
}
