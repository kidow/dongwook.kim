/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('components/Theme/theme-mode-controller.tsx', () => {
  it('defers localStorage theme reads until after the initial render', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'components/Theme/theme-mode-controller.tsx'),
      'utf8'
    )

    expect(source).toContain("useState<ThemeMode>('system')")
    expect(source).toContain('useEffect(() => {')
    expect(source).toContain('window.localStorage.getItem(STORAGE_KEY)')
  })
})
