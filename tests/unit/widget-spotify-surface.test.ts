/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('components/Widget/widget-spotify-player-client.tsx', () => {
  it('keeps the light theme spotify card surface on the previous neutral palette', () => {
    const source = readFileSync(
      path.join(
        process.cwd(),
        'components/Widget/widget-spotify-player-client.tsx'
      ),
      'utf8'
    )

    expect(source).toContain('border-neutral-200 bg-emerald-50')
    expect(source).toContain("text-neutral-400")
    expect(source).toContain("text-black/40")
    expect(source).not.toContain('border-emerald-100 bg-emerald-50')
    expect(source).not.toContain('text-emerald-950')
  })
})
