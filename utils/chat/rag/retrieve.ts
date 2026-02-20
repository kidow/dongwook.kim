import type { RagIndexChunk, RetrievedChunk } from '@/utils/chat/types'

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return -1
  }

  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i += 1) {
    const av = a[i] ?? 0
    const bv = b[i] ?? 0
    dot += av * bv
    normA += av * av
    normB += bv * bv
  }

  if (normA === 0 || normB === 0) {
    return -1
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export function retrieveTopChunks(
  chunks: RagIndexChunk[],
  queryVector: number[],
  topK: number
): RetrievedChunk[] {
  return chunks
    .map((chunk) => {
      const similarity = cosineSimilarity(chunk.vector, queryVector)
      const weighted = similarity + chunk.metadata.priority * 0.02

      return {
        ...chunk,
        score: weighted
      }
    })
    .filter((chunk) => Number.isFinite(chunk.score) && chunk.score > -1)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}
