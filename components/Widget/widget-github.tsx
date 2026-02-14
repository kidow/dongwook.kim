import dynamic from 'next/dynamic'

type GithubContributionMap = Record<string, number>

const GithubCalendarClient = dynamic(() =>
  import('./widget-github-calendar').then((m) => m.default)
)

async function getGithubContributions(): Promise<GithubContributionMap | null> {
  try {
    const token = process.env.GITHUB_TOKEN
    if (!token) return null

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${token}`
      }),
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
      next: { revalidate: 60 * 60 * 6 }
    })

    if (!response.ok) return null

    const json = await response.json()
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
  } catch {
    return null
  }
}

export default async function WidgetGithub() {
  const values = await getGithubContributions()
  if (!values) return null

  return <GithubCalendarClient values={values} />
}
