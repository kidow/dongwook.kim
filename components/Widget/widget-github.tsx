import dynamic from 'next/dynamic'

type GithubContributionMap = Record<string, number>

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
      cache: 'no-store'
    })

    if (!response.ok) {
      const message = await response.text()
      console.error('[WidgetGithub] GitHub API error', response.status, message.slice(0, 200))
      return null
    }

    const json = await response.json()
    if (Array.isArray(json?.errors) && json.errors.length > 0) {
      console.error('[WidgetGithub] GitHub GraphQL errors', json.errors[0]?.message)
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
      <div className="text-xs text-neutral-400">
        Contribution data is unavailable.
      </div>
    )
  }

  return <GithubCalendarClient values={values} />
}
