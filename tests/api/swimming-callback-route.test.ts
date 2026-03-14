/**
 * @jest-environment node
 */

import { POST } from '@/app/api/callback/swimming/route'
import { revalidateTag } from 'next/cache'

import { createSupabaseServiceRoleClient } from '@/utils/api/supabase'

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn()
}))

jest.mock('@/utils/api/supabase', () => ({
  createSupabaseServiceRoleClient: jest.fn()
}))

const mockedRevalidateTag = jest.mocked(revalidateTag)
const mockedCreateSupabaseServiceRoleClient = jest.mocked(
  createSupabaseServiceRoleClient
)

function createRequest(body: unknown) {
  return new Request('http://localhost/api/callback/swimming', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': 'test-token'
    },
    body: JSON.stringify(body)
  })
}

describe('app/api/callback/swimming/route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.AUTH_TOKEN = 'test-token'

    mockedCreateSupabaseServiceRoleClient.mockReturnValue({
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null })
      })
    } as never)
  })

  it('revalidates the swimming widget cache after a swim session is stored', async () => {
    const response = await POST(
      createRequest({
        date: '2026-03-13',
        distance: 1500,
        source: 'APPLE_WATCH'
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      data: {
        date: '2026-03-13',
        distance: 1500,
        source: 'APPLE_WATCH'
      }
    })
    expect(mockedRevalidateTag).toHaveBeenCalledWith(
      'widget-swimming-sessions',
      'max'
    )
  })

  it('does not revalidate the cache when the request is skipped for zero distance', async () => {
    const response = await POST(
      createRequest({
        date: '2026-03-13',
        distance: 0,
        source: 'APPLE_WATCH'
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      skipped: true
    })
    expect(mockedRevalidateTag).not.toHaveBeenCalled()
  })
})
