import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('Google Analytics layout integration', () => {
  it('loads the selected GA4 measurement ID in the root layout', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'app/layout.tsx'),
      'utf8'
    )

    expect(source).toContain(
      "import { GoogleAnalytics } from '@next/third-parties/google'"
    )
    expect(source).toContain('<GoogleAnalytics gaId="G-QBXY1NY7BL" />')
  })
})
