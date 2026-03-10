/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('app/page.tsx', () => {
  it('removes the home appearance widget and page-level dark utility overrides', () => {
    const source = readFileSync(path.join(process.cwd(), 'app/page.tsx'), 'utf8')

    expect(source).not.toContain('ThemeModeController')
    expect(source).not.toContain('Appearance')
    expect(source).not.toContain('dark:')
  })
})
