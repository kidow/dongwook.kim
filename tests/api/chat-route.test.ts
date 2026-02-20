/**
 * @jest-environment node
 */

import { POST } from '@/app/api/chat/route'
import { embedText, generateAnswer } from '@/utils/chat/gemini'
import {
  detectLanguage,
  getFallbackMessage,
  getRagPolicy,
  getRefusalMessage,
  isInDomainQuestion
} from '@/utils/chat/policy'
import { buildSystemInstruction, buildUserPrompt } from '@/utils/chat/prompt'
import { loadRagIndex } from '@/utils/chat/rag/load-index'
import { retrieveTopChunks } from '@/utils/chat/rag/retrieve'
import type { RagPolicy, RetrievedChunk } from '@/utils/chat/types'

jest.mock('@/utils/chat/prompt', () => ({
  buildSystemInstruction: jest.fn(),
  buildUserPrompt: jest.fn()
}))

jest.mock('@/utils/chat/policy', () => ({
  detectLanguage: jest.fn(),
  getFallbackMessage: jest.fn(),
  getRagPolicy: jest.fn(),
  getRefusalMessage: jest.fn(),
  isInDomainQuestion: jest.fn()
}))

jest.mock('@/utils/chat/gemini', () => ({
  embedText: jest.fn(),
  generateAnswer: jest.fn()
}))

jest.mock('@/utils/chat/rag/load-index', () => ({
  loadRagIndex: jest.fn()
}))

jest.mock('@/utils/chat/rag/retrieve', () => ({
  retrieveTopChunks: jest.fn()
}))

const mockedBuildSystemInstruction = jest.mocked(buildSystemInstruction)
const mockedBuildUserPrompt = jest.mocked(buildUserPrompt)
const mockedDetectLanguage = jest.mocked(detectLanguage)
const mockedGetFallbackMessage = jest.mocked(getFallbackMessage)
const mockedGetRagPolicy = jest.mocked(getRagPolicy)
const mockedGetRefusalMessage = jest.mocked(getRefusalMessage)
const mockedIsInDomainQuestion = jest.mocked(isInDomainQuestion)
const mockedEmbedText = jest.mocked(embedText)
const mockedGenerateAnswer = jest.mocked(generateAnswer)
const mockedLoadRagIndex = jest.mocked(loadRagIndex)
const mockedRetrieveTopChunks = jest.mocked(retrieveTopChunks)

const policy: RagPolicy = {
  allowedTopics: {
    ko: ['이력'],
    en: ['resume']
  },
  refusal: {
    ko: 'REFUSE_KO',
    en: 'REFUSE_EN'
  },
  fallback: {
    ko: 'FALLBACK_KO',
    en: 'FALLBACK_EN'
  },
  style: {
    maxSentences: 4,
    tone: 'brief',
    forbidden: []
  },
  retrieval: {
    scoreThreshold: 0.4,
    topK: 3
  }
}

const retrievedChunks: RetrievedChunk[] = [
  {
    chunkId: 'chunk-1',
    docId: 'doc-1',
    text: 'context',
    tokensApprox: 12,
    vector: [1, 0],
    metadata: {
      title: 'Title',
      section: 'project',
      tags: ['tag'],
      lang: 'ko',
      priority: 2
    },
    score: 0.9
  }
]

function createRequest(messages: Array<{ role: string; content: string }>): Request {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages })
  })
}

async function parseNdjson(response: Response): Promise<Array<Record<string, unknown>>> {
  const text = await response.text()
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>)
}

describe('app/api/chat/route', () => {
  beforeEach(() => {
    mockedGetRagPolicy.mockReturnValue(policy)
    mockedDetectLanguage.mockReturnValue('ko')
    mockedGetRefusalMessage.mockReturnValue('REFUSE_KO')
    mockedGetFallbackMessage.mockReturnValue('FALLBACK_KO')
    mockedIsInDomainQuestion.mockReturnValue(true)
    mockedLoadRagIndex.mockResolvedValue({
      version: 1,
      embeddingModel: 'test-model',
      createdAt: new Date().toISOString(),
      chunks: [
        {
          chunkId: 'chunk-1',
          docId: 'doc-1',
          text: 'context',
          tokensApprox: 12,
          vector: [1, 0],
          metadata: {
            title: 'Title',
            section: 'project',
            tags: ['tag'],
            lang: 'ko',
            priority: 2
          }
        }
      ]
    })
    mockedEmbedText.mockResolvedValue({
      ok: true,
      vector: [1, 0]
    })
    mockedRetrieveTopChunks.mockReturnValue(retrievedChunks)
    mockedBuildSystemInstruction.mockReturnValue('SYSTEM')
    mockedBuildUserPrompt.mockReturnValue('PROMPT')
    mockedGenerateAnswer.mockResolvedValue({
      ok: true,
      text: 'Mocked answer'
    })
  })

  it('returns 400 when request body is invalid', async () => {
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{'
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'messages is required'
    })
  })

  it('returns 400 when there is no user message', async () => {
    const response = await POST(
      createRequest([
        {
          role: 'assistant',
          content: 'hello'
        }
      ])
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'at least one user message is required'
    })
  })

  it('returns out_of_scope stream when question is out of domain', async () => {
    mockedIsInDomainQuestion.mockReturnValueOnce(false)

    const response = await POST(
      createRequest([
        {
          role: 'user',
          content: '날씨 알려줘'
        }
      ])
    )
    const events = await parseNdjson(response)

    expect(response.headers.get('Content-Type')).toContain('application/x-ndjson')
    expect(events[0]).toEqual({
      type: 'delta',
      text: 'REFUSE_KO'
    })
    expect(events[1]).toEqual({
      type: 'done',
      citations: [],
      matchedChunks: 0,
      reason: 'out_of_scope'
    })
  })

  it('returns index_missing stream when rag index is unavailable', async () => {
    mockedLoadRagIndex.mockResolvedValueOnce(null)

    const response = await POST(
      createRequest([
        {
          role: 'user',
          content: '이력 알려줘'
        }
      ])
    )
    const events = await parseNdjson(response)
    const done = events.find((event) => event.type === 'done')

    expect(done).toMatchObject({
      type: 'done',
      reason: 'index_missing'
    })
  })

  it('returns fallback stream when embedding fails', async () => {
    mockedEmbedText.mockResolvedValueOnce({
      ok: false,
      reason: 'missing_key',
      message: 'Missing GEMINI_API_KEY'
    })

    const response = await POST(
      createRequest([
        {
          role: 'user',
          content: '이력 알려줘'
        }
      ])
    )
    const events = await parseNdjson(response)

    expect(events[0]).toEqual({
      type: 'delta',
      text: 'FALLBACK_KO'
    })
    expect(events[1]).toEqual({
      type: 'done',
      citations: [],
      matchedChunks: 0,
      reason: 'missing_key'
    })
  })

  it('returns fallback stream when generation fails', async () => {
    mockedGenerateAnswer.mockResolvedValueOnce({
      ok: false,
      reason: 'upstream_error',
      message: 'Chat request failed'
    })

    const response = await POST(
      createRequest([
        {
          role: 'user',
          content: '이력 알려줘'
        }
      ])
    )
    const events = await parseNdjson(response)
    const done = events.find((event) => event.type === 'done')

    expect(events[0]).toEqual({
      type: 'delta',
      text: 'FALLBACK_KO'
    })
    expect(done).toMatchObject({
      type: 'done',
      reason: 'upstream_error'
    })
  })

  it('streams answer and citations on success', async () => {
    const response = await POST(
      createRequest([
        {
          role: 'user',
          content: '이력 알려줘'
        }
      ])
    )
    const events = await parseNdjson(response)
    const done = events.find((event) => event.type === 'done')
    const deltas = events.filter((event) => event.type === 'delta')

    expect(deltas.length).toBeGreaterThan(0)
    expect(done).toEqual({
      type: 'done',
      citations: ['chunk-1'],
      matchedChunks: 1
    })
  })
})
