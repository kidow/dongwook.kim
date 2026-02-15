import dynamic from 'next/dynamic'

import { Card, CardContent } from '@/components/ui/card'

import type { GithubContributionMap } from './types'

const GithubCalendarClient = dynamic(() =>
  import('./widget-github-calendar').then((m) => m.default)
)

async function getGithubContributions(): Promise<GithubContributionMap | null> {
  try {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      console.error('[WidgetGithub] Missing GITHUB_TOKEN')
      return null
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'dongwook-kim-site'
      },
      body: JSON.stringify({
        query: `
          query($userName:String!) {
            user(login: $userName) {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { userName: 'kidow' }
      }),
      next: { revalidate: 3600 },
      signal: controller.signal
    }).finally(() => {
      clearTimeout(timeout)
    })

    if (!response.ok) {
      const message = await response.text()
      console.error(
        '[WidgetGithub] GitHub API error',
        response.status,
        message.slice(0, 200)
      )
      return null
    }

    const json = await response.json()
    if (Array.isArray(json?.errors) && json.errors.length > 0) {
      console.error(
        '[WidgetGithub] GitHub GraphQL errors',
        json.errors[0]?.message
      )
      return null
    }

    const weeks =
      json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ??
      []
    const values: GithubContributionMap = {}

    for (const week of weeks) {
      for (const day of week.contributionDays) {
        values[day.date] = day.contributionCount
      }
    }

    return values
  } catch (error) {
    console.error('[WidgetGithub] Unexpected error', error)
    return null
  }
}

export default async function WidgetGithub() {
  const values = await getGithubContributions()
  if (!values) {
    return (
      <Card className="rounded-3xl border-border py-0 shadow-sm">
        <CardContent className="p-5 xl:p-6">
          <p className="text-xs text-muted-foreground">
            Contribution data is unavailable.
          </p>
        </CardContent>
      </Card>
    )
  }

  return <GithubCalendarClient values={values} />
}
