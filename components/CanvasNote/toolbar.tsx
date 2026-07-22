'use client'

import { MinusIcon, PlusIcon, RotateCcwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NOTE_COLORS } from './constants'

interface CanvasNoteToolbarProps {
  activeColor: string
  onColorChange: (color: string) => void
  onAddNote: () => void
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onResetCanvas: () => void
}

export function CanvasNoteToolbar({
  activeColor,
  onColorChange,
  onAddNote,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onResetCanvas
}: CanvasNoteToolbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-white/95 p-1.5 shadow-lg backdrop-blur">
      <div className="flex items-center gap-1 px-1">
        {NOTE_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`색상 ${color} 선택`}
            onClick={() => onColorChange(color)}
            className={cn(
              'size-5 rounded-md border transition-transform hover:scale-110',
              activeColor === color
                ? 'border-neutral-900'
                : 'border-black/10'
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="h-5 w-px bg-border" />

      <Button
        type="button"
        size="icon-sm"
        variant="default"
        aria-label="노트 추가"
        onClick={onAddNote}
      >
        <PlusIcon />
      </Button>

      <div className="h-5 w-px bg-border" />

      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="축소"
        onClick={onZoomOut}
      >
        <MinusIcon />
      </Button>
      <button
        type="button"
        onClick={onZoomReset}
        className="w-11 text-center text-xs text-muted-foreground hover:text-foreground"
      >
        {Math.round(zoom * 100)}%
      </button>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="확대"
        onClick={onZoomIn}
      >
        <PlusIcon />
      </Button>

      <div className="h-5 w-px bg-border" />

      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="전체 초기화"
        onClick={onResetCanvas}
      >
        <RotateCcwIcon />
      </Button>
    </div>
  )
}
