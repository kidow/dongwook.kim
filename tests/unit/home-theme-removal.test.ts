/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('app/page.tsx', () => {
  it('removes the home appearance and i18n widgets plus obsolete social cards', () => {
    const source = readFileSync(path.join(process.cwd(), 'app/page.tsx'), 'utf8')

    expect(source).not.toContain('ThemeModeController')
    expect(source).not.toContain('WidgetI18n')
    expect(source).not.toContain('LinkedIn')
    expect(source).not.toContain('https://www.linkedin.com/in/kidow/')
    expect(source).not.toContain('Appearance')
    expect(source).not.toContain('dark:')
  })

  it('moves the quote widget into the former i18n slot and the blog card into the former linkedin slot', () => {
    const source = readFileSync(path.join(process.cwd(), 'app/page.tsx'), 'utf8')

    const videoIndex = source.indexOf('<video')
    const quoteIndex = source.indexOf('<WidgetQuote />')
    const xIndex = source.indexOf('title="X"')
    const instagramIndex = source.indexOf('title="Instagram"')
    const blogIndex = source.indexOf('title="Blog"')
    const threadsIndex = source.indexOf('title="Threads"')
    const analyticsIndex = source.indexOf('<WidgetAnalytics />')

    expect(quoteIndex).toBeGreaterThan(videoIndex)
    expect(quoteIndex).toBeLessThan(xIndex)
    expect(blogIndex).toBeGreaterThan(instagramIndex)
    expect(blogIndex).toBeLessThan(threadsIndex)
    expect(blogIndex).toBeLessThan(analyticsIndex)
  })
})
