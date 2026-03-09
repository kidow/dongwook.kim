/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('components/Widget/widget-swimming.tsx', () => {
  it('defines a dedicated swimming widget with waves and chart data', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-swimming.tsx'),
      'utf8'
    )
    const styleSource = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-swimming.module.css'),
      'utf8'
    )

    expect(source).toContain('Swimming')
    expect(source).toContain('<svg')
    expect(source).toContain('LineChart')
    expect(source).toContain('SWIMMING_DATA')
    expect(source).toContain("{ date: '03.04', distance: 1200 }")
    expect(source).toContain("{ date: '03.10', distance: 3400 }")
    expect(source).toContain("color: '#0284c7'")
    expect(source).toContain("label: 'Distance (m)'")
    expect(source).toContain('aria-hidden="true"')
    expect(source).toContain('styles.waveSvg')
    expect(source).toContain('group/widget-swimming')
    expect(source).toContain('data-swimming-layer="chart"')
    expect(source).toContain('data-swimming-layer="wave"')
    expect(source).toContain('opacity-70')
    expect(source).toContain('duration-300')
    expect(source).toContain('group-hover/widget-swimming:opacity-100')
    expect(source).toContain('group-hover/widget-swimming:opacity-70')
    expect(source).toContain('group-hover/widget-swimming:z-20')
    expect(source).toContain('dataKey="date"')
    expect(source).toContain('padding={{ left: 18, right: 8 }}')
    expect(source).toContain('{distance.toLocaleString()} m')
    expect(styleSource).toContain('pathAnim')
    expect(styleSource).not.toContain('animation-direction: reverse')
    expect(styleSource).toContain('animation-delay: 1s')
    expect(styleSource).not.toContain('animation-play-state: paused')
  })
})
