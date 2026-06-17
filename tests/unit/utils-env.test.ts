import { requireEnv } from '@/utils/env'

describe('utils/env', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns missing env error with source', () => {
    const result = requireEnv(
      {
        FOO: 'ok',
        BAR: undefined
      },
      'chat'
    )

    expect(result).toEqual({
      ok: false,
      source: 'chat',
      error: 'Missing required env: BAR'
    })
  })

})
