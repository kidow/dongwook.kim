/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('widget link icon surfaces', () => {
  it('uses a single light icon chip surface without theme-specific selectors', () => {
    const homeSource = readFileSync(
      path.join(process.cwd(), 'app/page.tsx'),
      'utf8'
    )
    const chatbotSource = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-chatbot.tsx'),
      'utf8'
    )
    const globalsSource = readFileSync(
      path.join(process.cwd(), 'app/globals.css'),
      'utf8'
    )

    expect(homeSource).toContain('widget-link-icon-chip')

    expect(chatbotSource).toContain('widget-link-icon-chip')

    expect(globalsSource).toContain('.widget-link-icon-chip')
    expect(globalsSource).toContain('background-color: #ffffff;')
    expect(globalsSource).not.toContain("html[data-theme='light'] .widget-link-icon-chip")
    expect(globalsSource).not.toContain("html[data-theme='dark'] .widget-link-icon-chip")
  })
})
