/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('components/Mindmap/MindmapNode.tsx', () => {
  it('saves edited labels when the input loses focus', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'components/Mindmap/MindmapNode.tsx'),
      'utf8'
    )

    expect(source).toContain('onBlur={handleSave}')
  })
})
