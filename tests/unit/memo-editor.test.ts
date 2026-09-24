/**
 * @jest-environment node
 */

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const read = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), 'utf8')

describe('home memo editor', () => {
  it('renders the editor inside the home Memo section', () => {
    const homeSource = read('app/page.tsx')

    expect(homeSource).toContain('<Section index={5} title="Memo">')
    expect(homeSource).toContain('<Editor />')
    expect(existsSync(path.join(process.cwd(), 'app/memo/page.tsx'))).toBe(
      false
    )
  })

  it('drops link sharing and the ?c= content import', () => {
    const editorSource = read('components/Editor/index.tsx')
    const storageSource = read('components/Editor/use-local-storage.ts')

    expect(editorSource).not.toContain('onShareLink')
    expect(editorSource).toContain('Clear')
    expect(storageSource).not.toContain("get('c')")
  })

  it('redirects the legacy /memo path to home', () => {
    const configSource = read('next.config.ts')

    expect(configSource).toContain(
      "{ source: '/memo', destination: '/', permanent: true }"
    )
  })
})
