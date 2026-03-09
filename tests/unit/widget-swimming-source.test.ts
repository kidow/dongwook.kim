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
    expect(styleSource).toContain('pathAnim')
    expect(styleSource).toContain('animation-delay: 1s')
  })
})
