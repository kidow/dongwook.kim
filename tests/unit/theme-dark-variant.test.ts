/**
 * @jest-environment node
 */

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

describe('global theme configuration', () => {
  it('removes the dedicated theme mode controller and dark variant selectors', () => {
    const globalsSource = readFileSync(
      path.join(process.cwd(), 'app/globals.css'),
      'utf8'
    )
    const themeControllerPath = path.join(
      process.cwd(),
      'components/Theme/theme-mode-controller.tsx'
    )

    expect(existsSync(themeControllerPath)).toBe(false)
    expect(globalsSource).not.toContain('@custom-variant dark')
    expect(globalsSource).not.toContain("html[data-theme='dark']")
    expect(globalsSource).not.toContain("html[data-theme='light']")
  })
})
