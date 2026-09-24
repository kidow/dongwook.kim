import dynamic from 'next/dynamic'

export type GithubContributionMap = Record<string, number>

const GithubCalendar = dynamic(() => import('./github-calendar'))

async function getGithubContributions(): Promise<GithubContributionMap | null> {
  try {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      console.error('[GithubContributions] Missing GITHUB_TOKEN')
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
        '[GithubContributions] GitHub API error',
        response.status,
        message.slice(0, 200)
      )
      return null
    }

    const json = await response.json()
    if (Array.isArray(json?.errors) && json.errors.length > 0) {
      console.error(
        '[GithubContributions] GitHub GraphQL errors',
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
    console.error('[GithubContributions] Unexpected error', error)
    return null
  }
}

export default async function GithubContributions() {
  const values = await getGithubContributions()
  if (!values) {
    return (
      <p className="text-sm text-muted-foreground">
        Contribution data is unavailable.
      </p>
    )
  }

  return <GithubCalendar values={values} />
}
