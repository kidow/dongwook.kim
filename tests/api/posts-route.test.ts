/**
 * @jest-environment node
 */

import { GET } from '@/app/api/posts/route'
import { getNotionBlogPosts } from '@/utils/api/notion'

jest.mock('@/utils/api/notion', () => ({
  getNotionBlogPosts: jest.fn()
}))

const mockedGetNotionBlogPosts = jest.mocked(getNotionBlogPosts)

describe('app/api/posts/route', () => {
  it('returns success payload as json', async () => {
    mockedGetNotionBlogPosts.mockResolvedValueOnce({
      ok: true,
      data: []
    })

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({
      ok: true,
      data: []
    })
  })

  it('returns fallback payload with status 200 when notion call fails', async () => {
    mockedGetNotionBlogPosts.mockResolvedValueOnce({
      ok: false,
      source: 'notion',
      error: 'Missing required env: NOTION_SECRET_KEY'
    })

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({
      ok: false,
      source: 'notion',
      error: 'Missing required env: NOTION_SECRET_KEY'
    })
  })
})
