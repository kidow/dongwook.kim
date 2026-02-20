import type { RetrievedChunk } from '@/utils/chat/types'

interface BuildPromptParams {
  lang: 'ko' | 'en'
  query: string
  chunks: RetrievedChunk[]
  maxSentences: number
}

export function buildSystemInstruction(maxSentences: number): string {
  return [
    'You are a strict resume assistant for dongwook.kim.',
    'Only answer using the provided context snippets.',
    'Do not invent facts outside the context.',
    'If context is insufficient, say you do not know.',
    'Refuse out-of-scope questions about general topics.',
    `Keep answers concise, at most ${maxSentences} sentences.`
  ].join(' ')
}

export function buildUserPrompt({
  lang,
  query,
  chunks,
  maxSentences
}: BuildPromptParams): string {
  const contextBlock = chunks
    .map(
      (chunk) =>
        `[${chunk.chunkId}] title=${chunk.metadata.title} section=${chunk.metadata.section} score=${chunk.score.toFixed(4)}\n${chunk.text}`
    )
    .join('\n\n')

  if (lang === 'en') {
    return [
      'Answer in English.',
      `Use only the context below. Maximum ${maxSentences} sentences.`,
      '',
      'Context:',
      contextBlock,
      '',
      `Question: ${query}`
    ].join('\n')
  }

  return [
    '한국어로 답변하세요.',
    `아래 컨텍스트만 사용하고 최대 ${maxSentences}문장으로 답변하세요.`,
    '',
    '컨텍스트:',
    contextBlock,
    '',
    `질문: ${query}`
  ].join('\n')
}
