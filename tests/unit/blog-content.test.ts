/**
 * @jest-environment node
 */

import {
  getBlogPostBySlug,
  getBlogPostSummaries
} from '@/lib/blog'

describe('lib/blog', () => {
  it('returns published mdx blog posts sorted by date desc', () => {
    const posts = getBlogPostSummaries()

    expect(posts.map((post) => post.slug)).toEqual([
      'migrate-link-in-bio-ui',
      'widget-structure-notes',
      'design-token-and-tailwind'
    ])
    expect(posts[0]).toMatchObject({
      title: 'Link-in-bio UI 마이그레이션 회고'
    })
    expect(posts[0]).not.toHaveProperty('tags')
    expect(posts[0]).not.toHaveProperty('thumbnail')
  })

  it('returns a published mdx post detail by slug', () => {
    const post = getBlogPostBySlug('widget-structure-notes')

    expect(post).toBeDefined()
    expect(post).toMatchObject({
      slug: 'widget-structure-notes',
      title: 'Widget 구조화 메모',
      description: '정적 위젯과 동적 위젯을 분리해 확장하는 구조를 정리했습니다.'
    })
    expect(post?.url).toBe('/blog/widget-structure-notes')
  })
})
