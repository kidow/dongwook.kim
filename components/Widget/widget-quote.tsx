'use client'

import { QuoteIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

const QUOTE_TEXT =
  '더 게으르기 위해, 더 열심히 공부하는 것을 모토로 삼고 있습니다.'

export default function WidgetQuote() {
  return (
    <li className="rows-span-2 col-span-2 overflow-hidden xl:col-span-4 xl:row-span-1">
      <Card className="h-[175px] w-full rounded-3xl border-border py-0 shadow-sm">
        <CardContent className="p-5 xl:p-6">
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border">
              <QuoteIcon className="size-5 scale-[-1] text-muted-foreground" />
            </span>
          </div>
          <blockquote className="mt-3 text-xl font-normal italic text-muted-foreground">
            {QUOTE_TEXT}
          </blockquote>
        </CardContent>
      </Card>
    </li>
  )
}
