// Vercel Web Analytics (https://vercel.com/docs/analytics/web-analytics-api).
// The Hobby plan only serves the latest 31 days of daily data, so the
// sparkline covers 30 days and the total uses the all-time count endpoint.
const API = 'https://api.vercel.com/v1/query/web-analytics/visits'
const TEAM_ID = 'team_uvT6jIboIaN9h8qLLQCu5wBy'
const PROJECT_ID = 'prj_IlFWv2T0ezR61mMtlg86tVtNwJUK'
const DAYS = 30
const DAY_MS = 86_400_000

interface DailyViews {
  date: string
  pageviews: number
}

interface PageViewsData {
  total: number
  daily: DailyViews[]
}

async function query<T>(
  path: string,
  token: string,
  params: Record<string, string> = {}
): Promise<T> {
  const search = new URLSearchParams({
    teamId: TEAM_ID,
    projectId: PROJECT_ID,
    ...params
  })
  const response = await fetch(`${API}${path}?${search}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(5000)
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`${response.status} ${message.slice(0, 200)}`)
  }

  return response.json()
}

async function getPageViews(): Promise<PageViewsData | null> {
  const token = process.env.VERCEL_TOKEN
  if (!token) {
    console.error('[PageViews] Missing VERCEL_TOKEN')
    return null
  }

  const until = new Date().toISOString().slice(0, 10)
  const since = new Date(Date.now() - (DAYS - 1) * DAY_MS)
    .toISOString()
    .slice(0, 10)

  try {
    const [count, aggregate] = await Promise.all([
      query<{ data: { pageviews: number } }>('/count', token),
      query<{ data: { timestamp: string; pageviews: number }[] }>(
        '/aggregate',
        token,
        { since, until, by: 'day' }
      )
    ])

    return {
      total: count.data.pageviews,
      daily: aggregate.data.map((row) => ({
        date: row.timestamp.slice(0, 10),
        pageviews: row.pageviews
      }))
    }
  } catch (error) {
    console.error('[PageViews] Vercel Web Analytics error', error)
    return null
  }
}

const monthDay = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

export default async function PageViews() {
  const data = await getPageViews()
  if (!data) return null

  const { total, daily } = data
  const max = Math.max(...daily.map((d) => d.pageviews), 1)
  const recent = daily.reduce((sum, d) => sum + d.pageviews, 0)

  return (
    <span
      className="inline-flex items-center gap-2 tabular-nums"
      title={`${recent.toLocaleString('en-US')} views in the last ${DAYS} days`}
    >
      <span aria-hidden className="flex h-[18px] items-end gap-px">
        {daily.map((d) => (
          <span
            key={d.date}
            title={`${d.pageviews} views · ${monthDay(d.date)}`}
            className="w-px min-h-px rounded-[1px] bg-[#60a5fa]/80 sm:w-[3px]"
            style={{ height: `${Math.max(6, (d.pageviews / max) * 100)}%` }}
          />
        ))}
      </span>
      <span>
        {total.toLocaleString('en-US')} views
        <span className="sr-only">
          {' '}
          in total, {recent.toLocaleString('en-US')} in the last {DAYS} days
        </span>
      </span>
    </span>
  )
}
