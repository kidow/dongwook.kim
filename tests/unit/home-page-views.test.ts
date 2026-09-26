/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

const read = (file: string) =>
  readFileSync(path.join(process.cwd(), file), 'utf8')

describe('home footer page views', () => {
  it('renders Vercel page views in the home footer', () => {
    const homeSource = read('app/page.tsx')

    expect(homeSource).toContain("from '@/components/Home/page-views'")
    expect(homeSource).toContain('<PageViews />')
  })

  it('reads the token from env and stays within the Hobby reporting window', () => {
    const source = read('components/Home/page-views.tsx')

    expect(source).toContain('process.env.VERCEL_TOKEN')
    expect(source).toContain('/v1/query/web-analytics/visits')
    expect(source).toContain('const DAYS = 30')
  })
})
