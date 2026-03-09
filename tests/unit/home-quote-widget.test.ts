/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('home quote widget layout', () => {
  it('uses the updated quote copy and mounts the swimming widget above side projects', () => {
    const quoteSource = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-quote.tsx'),
      'utf8'
    )
    const homeSource = readFileSync(
      path.join(process.cwd(), 'app/page.tsx'),
      'utf8'
    )

    expect(quoteSource).toContain('더 게으르기 위해, 더 열심히 공부하기')
    expect(quoteSource).toContain('xl:col-span-3')
    expect(homeSource).toContain('WidgetSwimming')
    expect(homeSource).not.toContain('Temporary Widget')
  })
})
