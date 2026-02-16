import { Trash2Icon, XIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getMethodColor, getRelativeTime } from './utils'

import type { HistoryEntry } from './types'

interface HistoryPanelProps {
  history: HistoryEntry[]
  onLoad: (entry: HistoryEntry) => void
  onDelete: (id: string) => void
  onClear: () => void
}

export default function HistoryPanel({
  history,
  onLoad,
  onDelete,
  onClear
}: HistoryPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">요청 히스토리</h3>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={onClear}
          >
            <Trash2Icon className="size-3.5" />
            전체 삭제
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          요청 기록이 없습니다.
        </p>
      ) : (
        <div className="flex max-h-[300px] flex-col gap-1 overflow-y-auto">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
              onClick={() => onLoad(entry)}
            >
              <Badge
                variant="outline"
                className={cn(
                  'shrink-0 font-mono text-xs',
                  getMethodColor(entry.request.method)
                )}
              >
                {entry.request.method}
              </Badge>
              <span className="min-w-0 flex-1 truncate font-mono text-xs">
                {entry.request.url}
              </span>
              <span
                className={cn(
                  'shrink-0 font-mono text-xs',
                  entry.response.status >= 400
                    ? 'text-red-600'
                    : 'text-green-600'
                )}
              >
                {entry.response.status}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {getRelativeTime(entry.timestamp)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(entry.id)
                }}
              >
                <XIcon className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
