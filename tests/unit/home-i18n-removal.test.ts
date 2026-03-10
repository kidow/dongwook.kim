/**
 * @jest-environment node
 */

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

describe('home i18n removal', () => {
  it('deletes the dedicated i18n widget implementation and its storage logic', () => {
    const widgetPath = path.join(
      process.cwd(),
      'components/Widget/widget-i18n.tsx'
    )
    const homeSource = readFileSync(path.join(process.cwd(), 'app/page.tsx'), 'utf8')

    expect(existsSync(widgetPath)).toBe(false)
    expect(homeSource).not.toContain('widget-i18n')
    expect(homeSource).not.toContain('WidgetI18n')
    expect(homeSource).not.toContain('site-language-mode')
  })
})
