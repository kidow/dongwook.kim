/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('components/CodeEditor', () => {
  it('keeps the sandpack editor pinned to the light theme without a toggle', () => {
    const indexSource = readFileSync(
      path.join(process.cwd(), 'components/CodeEditor/index.tsx'),
      'utf8'
    )
    const toolbarSource = readFileSync(
      path.join(process.cwd(), 'components/CodeEditor/code-editor-toolbar.tsx'),
      'utf8'
    )
    const typesSource = readFileSync(
      path.join(process.cwd(), 'components/CodeEditor/types.ts'),
      'utf8'
    )

    expect(indexSource).toContain("theme=\"light\"")
    expect(indexSource).not.toContain('useState<EditorTheme>')
    expect(indexSource).not.toContain('onThemeChange')

    expect(toolbarSource).not.toContain('MoonIcon')
    expect(toolbarSource).not.toContain('SunIcon')
    expect(toolbarSource).not.toContain('onThemeChange')
    expect(toolbarSource).not.toContain('다크 테마로 전환')

    expect(typesSource).not.toContain('EditorTheme')
  })
})
