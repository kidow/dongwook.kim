import { unstable_cache } from 'next/cache'

import { createSupabaseServiceRoleClient } from '@/utils/api/supabase'

import SwimmingChart from './swimming-chart'

import type { SwimSession } from './swimming-chart'

const RECENT_COUNT = 12

interface SwimmingSummary {
  recent: SwimSession[]
  totalMeters: number
  count: number
  since: string
}

// Revalidated by /api/callback/swimming whenever the Shortcut posts a swim.
const getSwimmingSummary = unstable_cache(
  async (): Promise<SwimmingSummary | null> => {
    try {
      const supabase = createSupabaseServiceRoleClient()
      const { data, error } = await supabase
        .from('swim_sessions')
        .select('date, distance')
        .order('date', { ascending: true })

      if (error || !data?.length) {
        if (error) console.error('[Swimming] Supabase error', error)
        return null
      }

      const sessions = data.map((row) => ({
        date: String(row.date),
        distance: Number(row.distance)
      }))

      return {
        recent: sessions.slice(-RECENT_COUNT),
        totalMeters: sessions.reduce((sum, s) => sum + s.distance, 0),
        count: sessions.length,
        since: sessions[0].date
      }
    } catch (error) {
      console.error('[Swimming] Failed to load swim sessions', error)
      return null
    }
  },
  ['widget-swimming-sessions'],
  { revalidate: 86400, tags: ['widget-swimming-sessions'] }
)

const monthYear = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  })

const monthDay = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

export default async function Swimming() {
  const summary = await getSwimmingSummary()
  if (!summary) return null

  const { recent, totalMeters, count, since } = summary
  const last = recent[recent.length - 1]

  return (
    <>
      <SwimmingChart sessions={recent} />
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm tabular-nums text-muted-foreground">
        <span>
          Last swim{' '}
          <span className="font-medium text-foreground">
            {last.distance.toLocaleString('en-US')} m
          </span>{' '}
          · {monthDay(last.date)}
        </span>
        <span>
          Total{' '}
          <span className="font-medium text-foreground">
            {(totalMeters / 1000).toFixed(1)} km
          </span>
        </span>
        <span>
          <span className="font-medium text-foreground">{count}</span> swims
          since {monthYear(since)}
        </span>
      </p>
    </>
  )
}
