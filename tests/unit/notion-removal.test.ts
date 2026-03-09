/**
 * @jest-environment node
 */

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

describe('notion removal', () => {
  it('removes notion runtime code, env entries, and package dependency', () => {
    const packageJson = readFileSync(
      path.join(process.cwd(), 'package.json'),
      'utf8'
    )
    const envExample = readFileSync(
      path.join(process.cwd(), '.env.example'),
      'utf8'
    )
    const envSource = readFileSync(
      path.join(process.cwd(), 'utils/env.ts'),
      'utf8'
    )
    const globalTypes = readFileSync(
      path.join(process.cwd(), 'types/global.d.ts'),
      'utf8'
    )

    expect(
      existsSync(path.join(process.cwd(), 'utils/api/notion.ts'))
    ).toBe(false)
    expect(packageJson).not.toContain('@notionhq/client')
    expect(envExample).not.toContain('NOTION_SECRET_KEY')
    expect(envExample).not.toContain('NOTION_DATABASE_ID')
    expect(envExample).not.toContain('NOTION_DATA_SOURCE_ID')
    expect(envSource).not.toContain('getNotionEnv')
    expect(globalTypes).not.toContain('NOTION_SECRET_KEY')
    expect(globalTypes).not.toContain('NOTION_DATABASE_ID')
    expect(globalTypes).not.toContain('NOTION_DATA_SOURCE_ID')
  })
})
