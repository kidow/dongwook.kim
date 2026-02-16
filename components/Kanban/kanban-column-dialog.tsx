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

import type { KanbanColumn } from './types'

interface KanbanColumnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  column: KanbanColumn | null
  onSave: (title: string, columnId?: string) => void
}

function KanbanColumnDialogContent({
  column,
  onOpenChange,
  onSave
}: Omit<KanbanColumnDialogProps, 'open'>) {
  const [title, setTitle] = useState(column?.title ?? '')

  const handleSave = () => {
    if (!title.trim()) return
    onSave(title.trim(), column?.id)
    onOpenChange(false)
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {column ? '컬럼 편집' : '컬럼 추가'}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-2">
        <label className="text-sm font-medium">컬럼 이름</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="컬럼 이름을 입력하세요"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
          }}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          {column ? '저장' : '추가'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default function KanbanColumnDialog({
  open,
  onOpenChange,
  column,
  onSave
}: KanbanColumnDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <KanbanColumnDialogContent
          column={column}
          onOpenChange={onOpenChange}
          onSave={onSave}
        />
      )}
    </Dialog>
  )
}
