/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('components/Editor/index.tsx', () => {
  it('renders the memo card with a flat container style', () => {
    const editorSource = readFileSync(
      path.join(process.cwd(), 'components/Editor/index.tsx'),
      'utf8'
    )

    expect(editorSource).toContain(
      '<Card className="gap-0 overflow-hidden border-0 shadow-none">'
    )
    expect(editorSource).not.toContain('CardHeader className="border-b')
    expect(editorSource).not.toContain('CardFooter className="border-t')
  })
})
