'use client'

import { BotIcon, SparklesIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { WidgetLink } from '@/components/Widget'

export default function WidgetChatbot() {
  return (
    <WidgetLink
      className="col-span-2 xl:hover:rotate-1"
      size="h-[178px] w-full hover:bg-neutral-50"
      href="/chat"
      icon={
        <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
          <BotIcon className="size-5" />
        </span>
      }
      title="AI Chatbot"
      description="General assistant · Gemini 2.5 Flash-Lite"
      button={
        <Badge className="mt-2 bg-[#EEF6FF] text-[#1D4ED8] hover:bg-[#EEF6FF]">
          <SparklesIcon className="mr-1 size-3.5" />
          Preview
        </Badge>
      }
    >
      <div className="space-y-2 pt-1">
        <div className="rounded-lg border border-border bg-white/80 px-3 py-2 text-xs text-muted-foreground">
          AI: 궁금한 내용을 물어보세요.
        </div>
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          You: /chat에서 대화를 시작해보세요.
        </div>
      </div>
    </WidgetLink>
  )
}
