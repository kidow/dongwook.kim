import { NextResponse } from 'next/server'

import { buildSystemInstruction, buildUserPrompt } from '@/utils/chat/prompt'
import {
  detectLanguage,
  getFallbackMessage,
  getRagPolicy,
  getRefusalMessage,
  isInDomainQuestion
} from '@/utils/chat/policy'
import { embedText, generateAnswer } from '@/utils/chat/gemini'
import { loadRagIndex } from '@/utils/chat/rag/load-index'
import { retrieveTopChunks } from '@/utils/chat/rag/retrieve'
import type { ChatMessageInput } from '@/utils/chat/types'

type StreamEvent =
  | { type: 'delta'; text: string }
  | {
      type: 'done'
      citations: string[]
      matchedChunks: number
      reason?: 'out_of_scope' | 'upstream_error' | 'missing_key' | 'index_missing'
    }

function streamEvents(events: StreamEvent[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
      }
      controller.close()
    }
  })
}

function streamText(text: string, meta: Omit<Extract<StreamEvent, { type: 'done' }>, 'type'>): ReadableStream<Uint8Array> {
  const words = text.split(/\s+/).filter(Boolean)
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(
          encoder.encode(
            `${JSON.stringify({ type: 'delta', text: `${word} ` })}\n`
          )
        )
        await new Promise((resolve) => setTimeout(resolve, 8))
      }

      controller.enqueue(
        encoder.encode(
          `${JSON.stringify({ type: 'done', ...meta })}\n`
        )
      )
      controller.close()
    }
  })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    messages?: ChatMessageInput[]
  } | null

  const messages = Array.isArray(body?.messages)
    ? body.messages.filter(
        (item): item is ChatMessageInput =>
          Boolean(item) &&
          (item.role === 'user' || item.role === 'assistant') &&
          typeof item.content === 'string'
      )
    : []

  if (messages.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'messages is required' },
      { status: 400 }
    )
  }

  const latestUser = [...messages].reverse().find((item) => item.role === 'user')
  if (!latestUser) {
    return NextResponse.json(
      { ok: false, error: 'at least one user message is required' },
      { status: 400 }
    )
  }

  const policy = getRagPolicy()
  const lang = detectLanguage(latestUser.content)

  if (!isInDomainQuestion(latestUser.content, policy)) {
    return new Response(
      streamEvents([
        { type: 'delta', text: getRefusalMessage(lang, policy) },
        {
          type: 'done',
          citations: [],
          matchedChunks: 0,
          reason: 'out_of_scope'
        }
      ]),
      {
        headers: {
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      }
    )
  }

  const index = await loadRagIndex()
  if (!index || index.chunks.length === 0) {
    const message =
      lang === 'en'
        ? 'RAG index is not ready. Run pnpm rag:build and try again.'
        : 'RAG 인덱스가 준비되지 않았습니다. pnpm rag:build 실행 후 다시 시도해 주세요.'

    return new Response(
      streamEvents([
        { type: 'delta', text: message },
        {
          type: 'done',
          citations: [],
          matchedChunks: 0,
          reason: 'index_missing'
        }
      ]),
      {
        headers: {
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      }
    )
  }

  const queryEmbedding = await embedText(latestUser.content)
  if (!queryEmbedding.ok) {
    return new Response(
      streamEvents([
        { type: 'delta', text: getFallbackMessage(lang, policy) },
        {
          type: 'done',
          citations: [],
          matchedChunks: 0,
          reason: queryEmbedding.reason
        }
      ]),
      {
        headers: {
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      }
    )
  }

  const topChunks = retrieveTopChunks(
    index.chunks,
    queryEmbedding.vector,
    policy.retrieval.topK
  )

  const maxScore = topChunks[0]?.score ?? -1
  if (maxScore < policy.retrieval.scoreThreshold) {
    return new Response(
      streamEvents([
        { type: 'delta', text: getRefusalMessage(lang, policy) },
        {
          type: 'done',
          citations: [],
          matchedChunks: topChunks.length,
          reason: 'out_of_scope'
        }
      ]),
      {
        headers: {
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      }
    )
  }

  const systemInstruction = buildSystemInstruction(policy.style.maxSentences)
  const prompt = buildUserPrompt({
    lang,
    query: latestUser.content,
    chunks: topChunks,
    maxSentences: policy.style.maxSentences
  })

  const generated = await generateAnswer({
    systemInstruction,
    prompt,
    history: messages
  })

  if (!generated.ok) {
    return new Response(
      streamEvents([
        { type: 'delta', text: getFallbackMessage(lang, policy) },
        {
          type: 'done',
          citations: [],
          matchedChunks: topChunks.length,
          reason: generated.reason
        }
      ]),
      {
        headers: {
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      }
    )
  }

  const citations = topChunks.map((chunk) => chunk.chunkId)

  return new Response(
    streamText(generated.text, {
      citations,
      matchedChunks: topChunks.length
    }),
    {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    }
  )
}

export const dynamic = 'force-dynamic'
