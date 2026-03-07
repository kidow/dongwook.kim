/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

const readSource = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), 'utf8')

describe('Kakao map loader usage', () => {
  it('uses the SDK loader hook in the home widget instead of next/script', () => {
    const source = readSource('components/Widget/widget-map.tsx')

    expect(source).toContain('useKakaoLoader')
    expect(source).not.toContain("from 'next/script'")
    expect(source).not.toContain('<Script')
  })

  it('uses the SDK loader hook in the lunch page instead of next/script', () => {
    const source = readSource('app/lunch/page.tsx')

    expect(source).toContain('useKakaoLoader')
    expect(source).not.toContain("from 'next/script'")
    expect(source).not.toContain('<Script')
  })
})
