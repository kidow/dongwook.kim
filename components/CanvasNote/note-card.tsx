'use client'

import { useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH } from './constants'
import type { CanvasNoteData } from './types'

interface NoteCardProps {
  note: CanvasNoteData
  zoom: number
  onFocus: (id: string) => void
  onTextChange: (id: string, text: string) => void
  onDelete: (id: string) => void
  onResize: (id: string, width: number, height: number) => void
}

export function NoteCard({
  note,
  zoom,
  onFocus,
  onTextChange,
  onDelete,
  onResize
}: NoteCardProps) {
  const resizingRef = useRef<{
    startX: number
    startY: number
    startWidth: number
    startHeight: number
  } | null>(null)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: note.id })

  const dragX = transform ? transform.x / zoom : 0
  const dragY = transform ? transform.y / zoom : 0

  const handleResizePointerDown = (event: React.PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    onFocus(note.id)
    resizingRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: note.width,
      startHeight: note.height
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const start = resizingRef.current
      if (!start) return
      const dx = (moveEvent.clientX - start.startX) / zoom
      const dy = (moveEvent.clientY - start.startY) / zoom
      onResize(
        note.id,
        Math.max(MIN_NOTE_WIDTH, Math.round(start.startWidth + dx)),
        Math.max(MIN_NOTE_HEIGHT, Math.round(start.startHeight + dy))
      )
    }

    const handlePointerUp = () => {
      resizingRef.current = null
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  return (
    <div
      ref={setNodeRef}
      data-canvas-note-card
      className={cn(
        'group pointer-events-auto absolute rounded-[10px] border border-border shadow-sm',
        isDragging && 'cursor-grabbing shadow-md'
      )}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        backgroundColor: note.color,
        zIndex: note.zIndex,
        transform: `translate3d(${dragX}px, ${dragY}px, 0)`
      }}
      {...attributes}
      {...listeners}
      onPointerDown={(event) => {
        event.stopPropagation()
        onFocus(note.id)
        listeners?.onPointerDown?.(event)
      }}
    >
      <button
        type="button"
        aria-label="노트 삭제"
        className="absolute -right-2 -top-2 z-10 hidden h-5 w-5 items-center justify-center rounded-full border border-border bg-white text-neutral-500 shadow-sm hover:text-neutral-900 group-hover:flex"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          onDelete(note.id)
        }}
      >
        <XIcon className="size-3" />
      </button>

      <div className="h-full w-full p-2">
        <textarea
          value={note.text}
          onChange={(event) => onTextChange(note.id, event.target.value)}
          onPointerDown={(event) => {
            event.stopPropagation()
            onFocus(note.id)
          }}
          placeholder="메모를 입력하세요"
          className="h-full w-full resize-none rounded-md bg-transparent px-1 text-sm text-neutral-800 placeholder:text-neutral-800/40 focus:outline-none"
        />
      </div>

      <div
        role="presentation"
        onPointerDown={handleResizePointerDown}
        className="absolute bottom-0.5 right-0.5 h-3 w-3 cursor-nwse-resize rounded-sm border-b-2 border-r-2 border-neutral-800/25"
      />
    </div>
  )
}
