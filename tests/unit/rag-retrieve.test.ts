import { retrieveTopChunks } from '@/utils/chat/rag/retrieve'
import type { RagIndexChunk } from '@/utils/chat/types'

const baseChunk = {
  docId: 'doc-1',
  text: 'chunk',
  tokensApprox: 10,
  metadata: {
    title: 'title',
    section: 'project' as const,
    tags: ['tag'],
    lang: 'ko' as const,
    priority: 0
  }
}

describe('utils/chat/rag/retrieve', () => {
  it('sorts by weighted score and limits to topK', () => {
    const chunks: RagIndexChunk[] = [
      {
        ...baseChunk,
        chunkId: 'chunk-a',
        vector: [1, 0],
        metadata: { ...baseChunk.metadata, priority: 0 }
      },
      {
        ...baseChunk,
        chunkId: 'chunk-b',
        vector: [0.9, 0.1],
        metadata: { ...baseChunk.metadata, priority: 5 }
      },
      {
        ...baseChunk,
        chunkId: 'chunk-c',
        vector: [0, 1],
        metadata: { ...baseChunk.metadata, priority: 0 }
      }
    ]

    const top = retrieveTopChunks(chunks, [1, 0], 2)

    expect(top).toHaveLength(2)
    expect(top[0]?.chunkId).toBe('chunk-b')
    expect(top[1]?.chunkId).toBe('chunk-a')
  })

  it('filters out invalid vectors', () => {
    const chunks: RagIndexChunk[] = [
      {
        ...baseChunk,
        chunkId: 'valid',
        vector: [1, 0]
      },
      {
        ...baseChunk,
        chunkId: 'invalid-length',
        vector: [1, 0, 0]
      },
      {
        ...baseChunk,
        chunkId: 'invalid-zero',
        vector: [0, 0]
      }
    ]

    const top = retrieveTopChunks(chunks, [1, 0], 5)

    expect(top.map((item) => item.chunkId)).toEqual(['valid'])
  })
})
