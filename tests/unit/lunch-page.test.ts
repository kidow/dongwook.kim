/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('app/lunch/page.tsx', () => {
  it('removes the border from the results panel card', () => {
    const pageSource = readFileSync(
      path.join(process.cwd(), 'app/lunch/page.tsx'),
      'utf8'
    )

    expect(pageSource).toContain(
      '<Card className="gap-0 rounded-none border-0 py-0 shadow-sm">'
    )
  })
})
