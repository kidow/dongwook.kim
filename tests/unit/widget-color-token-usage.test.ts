/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('widget color token usage', () => {
  it('uses CSS variables directly for SVG and chart token colors', () => {
    const githubCalendarSource = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-github-calendar.tsx'),
      'utf8'
    )
    const analyticsChartSource = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-analytics-chart.tsx'),
      'utf8'
    )
    const swimmingSource = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-swimming-client.tsx'),
      'utf8'
    )

    expect(githubCalendarSource).toContain("fill: 'var(--muted-foreground)'")
    expect(githubCalendarSource).toContain("fontSize: '10px'")
    expect(githubCalendarSource).not.toContain('hsl(var(--muted-foreground))')

    expect(analyticsChartSource).toContain('fill="var(--muted-foreground)"')
    expect(analyticsChartSource).toContain('fontSize={10}')
    expect(analyticsChartSource).toContain("stroke: 'var(--border)'")
    expect(analyticsChartSource).not.toContain('hsl(var(--muted-foreground))')
    expect(analyticsChartSource).not.toContain("stroke: 'hsl(var(--border))'")

    expect(swimmingSource).toContain("stroke: 'var(--border)'")
    expect(swimmingSource).not.toContain("stroke: 'hsl(var(--border))'")
  })
})
