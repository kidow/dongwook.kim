/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('components/Widget/widget-quote.tsx', () => {
  it('uses a two-column desktop span instead of the previous three-column layout', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-quote.tsx'),
      'utf8'
    )

    expect(source).toContain('xl:col-span-2')
    expect(source).not.toContain('xl:col-span-3')
  })
})
