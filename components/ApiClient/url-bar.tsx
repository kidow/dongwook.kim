import { LoaderIcon, SendIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { HTTP_METHODS } from './constants'

import type { HttpMethod } from './types'

interface UrlBarProps {
  method: HttpMethod
  url: string
  isLoading: boolean
  onMethodChange: (method: HttpMethod) => void
  onUrlChange: (url: string) => void
  onSend: () => void
}

export default function UrlBar({
  method,
  url,
  isLoading,
  onMethodChange,
  onUrlChange,
  onSend
}: UrlBarProps) {
  const methodColor =
    HTTP_METHODS.find((m) => m.value === method)?.color ?? ''

  return (
    <div className="flex items-center gap-2">
      <Select
        value={method}
        onValueChange={(v) => onMethodChange(v as HttpMethod)}
      >
        <SelectTrigger className={cn('w-[130px] font-semibold', methodColor)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {HTTP_METHODS.map((m) => (
            <SelectItem
              key={m.value}
              value={m.value}
              className={cn('font-semibold', m.color)}
            >
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        className="flex-1 font-mono text-sm"
        placeholder="https://api.example.com/endpoint"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isLoading) onSend()
        }}
      />

      <Button onClick={onSend} disabled={isLoading}>
        {isLoading ? (
          <LoaderIcon className="size-4 animate-spin" />
        ) : (
          <SendIcon className="size-4" />
        )}
        Send
      </Button>
    </div>
  )
}
