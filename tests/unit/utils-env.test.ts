import { getChatEnv, requireEnv } from '@/utils/env'

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

  it('reads and trims chat env values', () => {
    process.env.GEMINI_API_KEY = '  key  '
    process.env.GEMINI_CHAT_MODEL = '  model-chat  '
    process.env.GEMINI_EMBED_MODEL = ''

    expect(getChatEnv()).toEqual({
      apiKey: 'key',
      chatModel: 'model-chat',
      embedModel: undefined
    })
  })
})
