'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { LABEL_COLORS } from './constants'

import type { KanbanCard, LabelColor } from './types'

interface KanbanCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card: KanbanCard | null
  onSave: (data: {
    id?: string
    title: string
    description: string
    label: LabelColor | null
  }) => void
}

function KanbanCardDialogContent({
  card,
  onOpenChange,
  onSave
}: Omit<KanbanCardDialogProps, 'open'>) {
  const [title, setTitle] = useState(card?.title ?? '')
  const [description, setDescription] = useState(card?.description ?? '')
  const [label, setLabel] = useState<LabelColor | null>(card?.label ?? null)

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      id: card?.id,
      title: title.trim(),
      description: description.trim(),
      label
    })
    onOpenChange(false)
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{card ? '카드 편집' : '카드 추가'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">제목</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="카드 제목을 입력하세요"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
            }}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">설명</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="카드 설명 (선택)"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">라벨</label>
          <div className="flex gap-2">
            {(
              Object.entries(LABEL_COLORS) as [
                LabelColor,
                (typeof LABEL_COLORS)[LabelColor]
              ][]
            ).map(([color, config]) => (
              <button
                key={color}
                type="button"
                title={config.name}
                className={cn(
                  'h-6 w-6 rounded-full transition-all',
                  config.bg,
                  label === color
                    ? 'ring-2 ring-offset-2 ring-neutral-400'
                    : 'hover:scale-110'
                )}
                onClick={() => setLabel(label === color ? null : color)}
              />
            ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          {card ? '저장' : '추가'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default function KanbanCardDialog({
  open,
  onOpenChange,
  card,
  onSave
}: KanbanCardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <KanbanCardDialogContent
          card={card}
          onOpenChange={onOpenChange}
          onSave={onSave}
        />
      )}
    </Dialog>
  )
}
