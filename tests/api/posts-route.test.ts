/**
 * @jest-environment node
 */

import { GET } from '@/app/api/posts/route'

describe('app/api/posts/route', () => {
  it('returns published mdx blog posts as json', async () => {
    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toMatchObject({
      ok: true,
      data: expect.any(Array)
    })
    expect(json.data[0]).toMatchObject({
      slug: 'migrate-link-in-bio-ui',
      title: 'Link-in-bio UI 마이그레이션 회고'
    })
    expect(json.data[0]).not.toHaveProperty('thumbnail')
    expect(json.data[0]).not.toHaveProperty('tags')
  })
})
