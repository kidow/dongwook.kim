'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { BotIcon, SendHorizontalIcon, UserIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { ChatMessageInput } from '@/utils/chat/types'

type StreamReason =
  | 'out_of_scope'
  | 'upstream_error'
  | 'missing_key'
  | 'index_missing'

type ChatMessage = ChatMessageInput & {
  id: string
  citations?: string[]
  reason?: StreamReason
}

const STORAGE_KEY = 'chat-history-v1'
const MAX_MESSAGES = 40

const STARTER_MESSAGES: ChatMessage[] = [
  {
    id: 'assistant-1',
    role: 'assistant',
    content:
      '안녕하세요. 이 챗봇은 김동욱의 이력, 프로젝트, 기술 스택, 사이트 정보에 대해서만 답변합니다.'
  }
]

const SUGGESTIONS = [
  '이 사이트의 기술 스택은 무엇인가요?',
  '사이드 프로젝트 도구에는 어떤 기능이 있나요?',
  '김동욱의 핵심 경력 요약을 알려주세요.'
]

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function capMessages(messages: ChatMessage[]) {
  if (messages.length <= MAX_MESSAGES) {
    return messages
  }

  return messages.slice(messages.length - MAX_MESSAGES)
}

type StreamEvent =
  | { type: 'delta'; text: string }
  | {
      type: 'done'
      citations: string[]
      matchedChunks: number
      reason?: StreamReason
    }

function parseNdjsonChunk(chunk: string): StreamEvent[] {
  return chunk
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as StreamEvent)
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER_MESSAGES)
  const [input, setInput] = useState('')
  const [isResponding, setIsResponding] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw) as ChatMessage[]
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return
      }

      const valid = parsed.filter(
        (item): item is ChatMessage =>
          Boolean(item) &&
          (item.role === 'user' || item.role === 'assistant') &&
          typeof item.content === 'string' &&
          typeof item.id === 'string'
      )

      if (valid.length > 0) {
        setMessages(capMessages(valid))
      }
    } catch {
      // ignore malformed local storage
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(capMessages(messages)))
  }, [messages])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, isResponding])

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !isResponding,
    [input, isResponding]
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = input.trim()
    if (!value || isResponding) {
      return
    }

    setErrorMessage(null)

    const userMessage: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: value
    }

    const assistantMessageId = makeId()
    const nextMessages = capMessages([
      ...messages,
      userMessage,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: ''
      }
    ])

    setMessages(nextMessages)
    setInput('')
    setIsResponding(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content
          }))
        })
      })

      if (!response.ok || !response.body) {
        throw new Error('Chat API request failed')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let isDoneEventReceived = false

      const updateAssistant = (patch: Partial<ChatMessage>) => {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantMessageId
              ? {
                  ...item,
                  ...patch
                }
              : item
          )
        )
      }

      while (true) {
        const { value: chunk, done } = await reader.read()
        if (done) {
          break
        }

        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        const events = parseNdjsonChunk(lines.join('\n'))

        for (const eventItem of events) {
          if (eventItem.type === 'delta') {
            setMessages((prev) =>
              prev.map((item) =>
                item.id === assistantMessageId
                  ? {
                      ...item,
                      content: `${item.content}${eventItem.text}`
                    }
                  : item
              )
            )
          }

          if (eventItem.type === 'done') {
            isDoneEventReceived = true
            updateAssistant({
              citations: eventItem.citations,
              reason: eventItem.reason
            })
          }
        }
      }

      if (!isDoneEventReceived) {
        throw new Error('Chat stream ended without done event')
      }

      setMessages((prev) =>
        capMessages(
          prev.map((item) =>
            item.id === assistantMessageId
              ? {
                  ...item,
                  content: item.content.trim()
                }
              : item
          )
        )
      )
    } catch {
      setErrorMessage('채팅 응답을 처리하는 중 오류가 발생했습니다.')
      setMessages((prev) =>
        prev.map((item) =>
          item.id === assistantMessageId
            ? {
                ...item,
                content:
                  '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
              }
            : item
        )
      )
    } finally {
      setIsResponding(false)
    }
  }

  const applySuggestion = (value: string) => {
    if (isResponding) return
    setInput(value)
  }

  return (
    <section className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-4xl flex-col gap-4 px-4 pb-6 pt-4 md:px-6">
      <header className="space-y-2">
        <Badge className="bg-[#EEF6FF] text-[#1D4ED8] hover:bg-[#EEF6FF]">
          Resume RAG Chat
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight">Assistant Chat</h1>
        <p className="text-sm text-muted-foreground">
          이 챗봇은 이력/프로젝트/기술 스택/사이트 정보 범위에서만 답변합니다.
        </p>
      </header>

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-border bg-white">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 md:p-5">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`flex w-full gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground">
                  <BotIcon className="size-3.5" />
                </span>
              )}

              <div
                className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'border-[#C7E0FF] bg-[#EEF6FF] text-[#0C4A8A]'
                    : 'border-border bg-muted/30 text-foreground'
                }`}
              >
                {message.content || (message.role === 'assistant' ? '답변 작성 중...' : '')}

                {message.role === 'assistant' && message.citations && message.citations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {message.citations.map((citation) => (
                      <Badge
                        key={citation}
                        variant="outline"
                        className="rounded-full px-2 py-0 text-[10px] text-muted-foreground"
                      >
                        {citation}
                      </Badge>
                    ))}
                  </div>
                )}

                {message.role === 'assistant' && message.reason === 'out_of_scope' && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    범위 외 질문으로 분류되어 고정 응답이 반환되었습니다.
                  </p>
                )}
              </div>

              {message.role === 'user' && (
                <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground">
                  <UserIcon className="size-3.5" />
                </span>
              )}
            </article>
          ))}
        </div>

        <div className="border-t border-border p-4 md:p-5">
          {errorMessage && (
            <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full px-3 text-xs"
                onClick={() => applySuggestion(suggestion)}
                disabled={isResponding}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          <form className="flex items-end gap-2" onSubmit={handleSubmit}>
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="이력, 프로젝트, 기술 스택 관련 질문을 입력하세요"
              className="min-h-12 resize-none"
              rows={2}
              disabled={isResponding}
            />
            <Button type="submit" className="h-12 w-12 shrink-0" disabled={!canSubmit}>
              <SendHorizontalIcon className="size-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </Card>
    </section>
  )
}
