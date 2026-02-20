'use client'

import { FormEvent, useMemo, useState } from 'react'
import { BotIcon, SendHorizontalIcon, UserIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

const STARTER_MESSAGES: ChatMessage[] = [
  {
    id: 'assistant-1',
    role: 'assistant',
    content:
      '안녕하세요! 기본 챗 UI가 준비되었습니다. 원하는 기능을 말해주시면 다음 단계로 확장할 수 있어요.'
  }
]

const SUGGESTIONS = [
  '포트폴리오 개선 아이디어 알려줘',
  '오늘 작업 우선순위 정리해줘',
  'Next.js 성능 점검 체크리스트 보여줘'
]

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER_MESSAGES)
  const [input, setInput] = useState('')
  const [isResponding, setIsResponding] = useState(false)

  const canSubmit = useMemo(() => input.trim().length > 0 && !isResponding, [input, isResponding])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = input.trim()
    if (!value || isResponding) {
      return
    }

    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        role: 'user',
        content: value
      }
    ])
    setInput('')
    setIsResponding(true)

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: 'assistant',
          content:
            '현재는 디자인 중심의 기본 세팅 단계입니다. 다음 작업에서 API 연동과 스트리밍 응답을 연결할 수 있습니다.'
        }
      ])
      setIsResponding(false)
    }, 700)
  }

  const applySuggestion = (value: string) => {
    if (isResponding) return
    setInput(value)
  }

  return (
    <section className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-4xl flex-col gap-4 px-4 pb-6 pt-4 md:px-6">
      <header className="space-y-2">
        <Badge className="bg-[#EEF6FF] text-[#1D4ED8] hover:bg-[#EEF6FF]">Chat Preview</Badge>
        <h1 className="text-2xl font-semibold tracking-tight">Assistant Chat</h1>
        <p className="text-sm text-muted-foreground">
          텍스트 기반 대화 UI 기본 세팅입니다. 현재는 로컬 상태 기반으로 동작합니다.
        </p>
      </header>

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-border bg-white">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-5">
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
                {message.content}
              </div>

              {message.role === 'user' && (
                <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground">
                  <UserIcon className="size-3.5" />
                </span>
              )}
            </article>
          ))}

          {isResponding && (
            <article className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground">
                <BotIcon className="size-3.5" />
              </span>
              <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                답변 작성 중...
              </div>
            </article>
          )}
        </div>

        <div className="border-t border-border p-4 md:p-5">
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
              placeholder="메시지를 입력하세요"
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
