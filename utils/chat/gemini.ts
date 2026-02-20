import type { ChatMessageInput } from '@/utils/chat/types'

interface GeminiFailure {
  ok: false
  reason: 'missing_key' | 'upstream_error'
  message: string
}

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'

function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY?.trim()
  return key && key.length > 0 ? key : null
}

function getModel(name: 'chat' | 'embed') {
  if (name === 'chat') {
    return process.env.GEMINI_CHAT_MODEL?.trim() || 'gemini-2.5-flash-lite'
  }

  return process.env.GEMINI_EMBED_MODEL?.trim() || 'text-embedding-004'
}

export async function embedText(text: string): Promise<
  | { ok: true; vector: number[] }
  | GeminiFailure
> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    return {
      ok: false,
      reason: 'missing_key',
      message: 'Missing GEMINI_API_KEY'
    }
  }

  const model = getModel('embed')

  try {
    const response = await fetch(
      `${BASE_URL}/models/${encodeURIComponent(model)}:embedContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: {
            parts: [{ text }]
          }
        }),
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      return {
        ok: false,
        reason: 'upstream_error',
        message: `Embedding request failed: ${response.status}`
      }
    }

    const data = (await response.json()) as {
      embedding?: { values?: number[] }
    }

    const vector = data.embedding?.values
    if (!Array.isArray(vector) || vector.length === 0) {
      return {
        ok: false,
        reason: 'upstream_error',
        message: 'Embedding vector is missing in Gemini response'
      }
    }

    return {
      ok: true,
      vector
    }
  } catch (error) {
    return {
      ok: false,
      reason: 'upstream_error',
      message:
        error instanceof Error
          ? `Embedding request failed: ${error.message}`
          : 'Embedding request failed'
    }
  }
}

export async function generateAnswer(params: {
  systemInstruction: string
  prompt: string
  history: ChatMessageInput[]
}): Promise<
  | { ok: true; text: string }
  | { ok: false; reason: 'missing_key' | 'upstream_error'; message: string }
> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    return {
      ok: false,
      reason: 'missing_key',
      message: 'Missing GEMINI_API_KEY'
    }
  }

  const model = getModel('chat')

  const history = params.history
    .slice(-8)
    .map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }]
    }))

  try {
    const response = await fetch(
      `${BASE_URL}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            role: 'system',
            parts: [{ text: params.systemInstruction }]
          },
          contents: [
            ...history,
            {
              role: 'user',
              parts: [{ text: params.prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            maxOutputTokens: 700
          }
        }),
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      return {
        ok: false,
        reason: 'upstream_error',
        message: `Chat request failed: ${response.status}`
      }
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>
        }
      }>
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text?.trim() ?? '')
        .filter(Boolean)
        .join('\n') ?? ''

    if (!text) {
      return {
        ok: false,
        reason: 'upstream_error',
        message: 'Gemini returned an empty response'
      }
    }

    return {
      ok: true,
      text
    }
  } catch (error) {
    return {
      ok: false,
      reason: 'upstream_error',
      message:
        error instanceof Error
          ? `Chat request failed: ${error.message}`
          : 'Chat request failed'
    }
  }
}
