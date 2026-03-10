/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('components/Widget/widget-analytics-chart.tsx', () => {
  it('keeps width-constrained chart wrappers from collapsing in the grid layout', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-analytics-chart.tsx'),
      'utf8'
    )

    expect(source).toContain("<li className=\"col-span-2 min-w-0\">")
    expect(source).toContain(
      '<Card className="w-full min-w-0 rounded-3xl border-border py-0 shadow-sm">'
    )
    expect(source).toContain(
      '<CardContent className="min-w-0 px-5 pb-5 xl:px-6 xl:pb-6">'
    )
  })
})
