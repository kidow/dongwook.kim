/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('components/ui/chart.tsx', () => {
  it('sets a positive initial dimension for percent-based responsive charts', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'components/ui/chart.tsx'),
      'utf8'
    )

    expect(source).toContain('<ResponsiveContainer')
    expect(source).toContain('const DEFAULT_INITIAL_DIMENSION = {')
    expect(source).toContain('width: 320')
    expect(source).toContain('height: 120')
    expect(source).toContain('initialDimension={DEFAULT_INITIAL_DIMENSION}')
  })
})
