export type ChatRole = 'user' | 'assistant'

export interface ChatMessageInput {
  role: ChatRole
  content: string
}

export interface RagDocument {
  id: string
  title: string
  section:
    | 'summary'
    | 'experience'
    | 'project'
    | 'skill'
    | 'education'
    | 'contact'
    | 'policy'
  text: string
  tags: string[]
  lang: 'ko' | 'en'
  priority: number
}

export interface RagPolicy {
  allowedTopics: {
    ko: string[]
    en: string[]
  }
  refusal: {
    ko: string
    en: string
  }
  fallback: {
    ko: string
    en: string
  }
  style: {
    maxSentences: number
    tone: string
    forbidden: string[]
  }
  retrieval: {
    scoreThreshold: number
    topK: number
  }
}

export interface RagIndexChunk {
  chunkId: string
  docId: string
  text: string
  tokensApprox: number
  vector: number[]
  metadata: {
    title: string
    section: RagDocument['section']
    tags: string[]
    lang: RagDocument['lang']
    priority: number
  }
}

export interface RagIndexFile {
  version: number
  embeddingModel: string
  createdAt: string
  chunks: RagIndexChunk[]
}

export interface RetrievedChunk extends RagIndexChunk {
  score: number
}
