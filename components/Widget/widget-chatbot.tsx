'use client'

import { BotIcon, SparklesIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { WidgetLink } from '@/components/Widget'

export default function WidgetChatbot() {
  return (
    <WidgetLink
      className="col-span-2 xl:hover:rotate-1"
      size="h-full w-full hover:bg-neutral-50 [&>div]:h-full [&>div>div]:h-full"
      href="/chat"
      icon={
        <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-white">
          <BotIcon className="size-5" />
        </span>
      }
      title="AI Chatbot"
      button={
        <Badge className="mt-2 bg-[#EEF6FF] text-[#1D4ED8] hover:bg-[#EEF6FF]">
          <SparklesIcon className="mr-1 size-3.5" />
          Preview
        </Badge>
      }
    />
  )
}
