/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('blog route source', () => {
  it('removes notion dependencies from blog routes', () => {
    const blogListSource = readFileSync(
      path.join(process.cwd(), 'app/blog/page.tsx'),
      'utf8'
    )
    const blogDetailSource = readFileSync(
      path.join(process.cwd(), 'app/blog/[id]/page.tsx'),
      'utf8'
    )

    expect(blogListSource).not.toContain('@/utils/api/notion')
    expect(blogDetailSource).not.toContain('@/utils/api/notion')
    expect(blogListSource).toContain("@/lib/blog")
    expect(blogDetailSource).toContain("@/lib/blog")
  })

  it('does not depend on blog tag or thumbnail metadata in routes', () => {
    const blogListSource = readFileSync(
      path.join(process.cwd(), 'app/blog/page.tsx'),
      'utf8'
    )
    const blogDetailSource = readFileSync(
      path.join(process.cwd(), 'app/blog/[id]/page.tsx'),
      'utf8'
    )

    expect(blogListSource).not.toContain('.tags')
    expect(blogDetailSource).not.toContain('.tags')
    expect(blogListSource).not.toContain('.thumbnail')
    expect(blogDetailSource).not.toContain('.thumbnail')
  })

  it('renders the blog index as a flat list without thumbnails', () => {
    const blogListSource = readFileSync(
      path.join(process.cwd(), 'app/blog/page.tsx'),
      'utf8'
    )

    expect(blogListSource).toContain('className="space-y-7 sm:space-y-4"')
    expect(blogListSource).not.toContain('className="grid gap-6 xl:grid-cols-2 xl:gap-10"')
    expect(blogListSource).not.toContain('<Image')
  })

  it('renders the blog detail page with a flat container instead of a card shell', () => {
    const blogDetailSource = readFileSync(
      path.join(process.cwd(), 'app/blog/[id]/page.tsx'),
      'utf8'
    )

    expect(blogDetailSource).toContain(
      'className="mx-auto space-y-6"'
    )
  })
})
