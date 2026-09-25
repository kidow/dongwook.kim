/**
 * @jest-environment node
 */

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const read = (file: string) =>
  readFileSync(path.join(process.cwd(), file), 'utf8')

describe('home swimming section', () => {
  it('renders the Swimming section on the home page', () => {
    const homeSource = read('app/page.tsx')

    expect(homeSource).toContain("from '@/components/Home/swimming'")
    expect(homeSource).toContain('title="Swimming"')
  })

  it('caches swim sessions under the tag the Shortcut callback revalidates', () => {
    const sectionSource = read('components/Home/swimming.tsx')
    const routeSource = read('app/api/callback/swimming/route.ts')

    expect(sectionSource).toContain("tags: ['widget-swimming-sessions']")
    expect(routeSource).toContain("revalidateTag('widget-swimming-sessions'")
  })

  it('loads the swimmer Lottie lazily from public', () => {
    const chartSource = read('components/Home/swimming-chart.tsx')

    expect(existsSync(path.join(process.cwd(), 'public/swimmer.json'))).toBe(
      true
    )
    expect(chartSource).toContain(
      "import('lottie-web/build/player/lottie_light')"
    )
    expect(chartSource).toContain("path: '/swimmer.json'")
  })
})
