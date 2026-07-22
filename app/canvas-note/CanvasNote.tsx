'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { nanoid } from 'nanoid'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCanvasNoteStorage } from '@/utils/hooks/use-canvas-note-storage'
import { NoteCard } from '@/components/CanvasNote/note-card'
import { CanvasNoteToolbar } from '@/components/CanvasNote/toolbar'
import {
  DEFAULT_NOTE_HEIGHT,
  DEFAULT_NOTE_WIDTH,
  DEFAULT_VIEWPORT,
  NOTE_COLORS,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
  createDefaultNote
} from '@/components/CanvasNote/constants'
import type { CanvasNoteData, CanvasViewport } from '@/components/CanvasNote/types'

const clampZoom = (zoom: number) =>
  Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom))

export default function CanvasNote() {
  const { data, isLoaded, save, reset: resetStorage } = useCanvasNoteStorage()
  const [notes, setNotes] = useState<CanvasNoteData[]>([])
  const [viewport, setViewport] = useState<CanvasViewport>(DEFAULT_VIEWPORT)
  const [activeColor, setActiveColor] = useState<string>(NOTE_COLORS[0])
  const initializedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef(viewport)
  viewportRef.current = viewport

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  // Restore from storage once
  useEffect(() => {
    if (isLoaded && data && !initializedRef.current) {
      initializedRef.current = true
      setNotes(data.notes)
      setViewport(data.viewport)
    }
  }, [isLoaded, data])

  // Debounced auto-save
  useEffect(() => {
    if (!isLoaded) return
    const timer = setTimeout(() => {
      save(notes, viewport)
    }, 500)
    return () => clearTimeout(timer)
  }, [notes, viewport, isLoaded, save])

  // Trackpad/wheel pan & pinch-zoom (native listener: preventDefault needs non-passive)
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = element.getBoundingClientRect()
      const anchorX = event.clientX - rect.left
      const anchorY = event.clientY - rect.top

      if (event.ctrlKey) {
        setViewport((prev) => {
          const newZoom = clampZoom(prev.zoom * (1 - event.deltaY * 0.01))
          const worldX = (anchorX - prev.x) / prev.zoom
          const worldY = (anchorY - prev.y) / prev.zoom
          return {
            zoom: newZoom,
            x: anchorX - worldX * newZoom,
            y: anchorY - worldY * newZoom
          }
        })
      } else {
        setViewport((prev) => ({
          ...prev,
          x: prev.x - event.deltaX,
          y: prev.y - event.deltaY
        }))
      }
    }

    element.addEventListener('wheel', handleWheel, { passive: false })
    return () => element.removeEventListener('wheel', handleWheel)
  }, [])

  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const v = viewportRef.current
    return { x: (screenX - v.x) / v.zoom, y: (screenY - v.y) / v.zoom }
  }, [])

  const addNoteAt = useCallback(
    (worldX: number, worldY: number) => {
      setNotes((prev) => {
        const maxZ = prev.reduce((max, n) => Math.max(max, n.zIndex), 0)
        const note = createDefaultNote(
          nanoid(),
          worldX - DEFAULT_NOTE_WIDTH / 2,
          worldY - DEFAULT_NOTE_HEIGHT / 2,
          activeColor,
          maxZ + 1
        )
        return [...prev, note]
      })
    },
    [activeColor]
  )

  const handleAddNoteFromToolbar = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    const centerScreenX = rect ? rect.width / 2 : 0
    const centerScreenY = rect ? rect.height / 2 : 0
    const { x, y } = screenToWorld(centerScreenX, centerScreenY)
    addNoteAt(x, y)
  }, [addNoteAt, screenToWorld])

  const handleBackgroundPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return
      const startX = event.clientX
      const startY = event.clientY
      const startViewport = viewportRef.current

      const handleMove = (moveEvent: PointerEvent) => {
        setViewport({
          ...startViewport,
          x: startViewport.x + (moveEvent.clientX - startX),
          y: startViewport.y + (moveEvent.clientY - startY)
        })
      }
      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }
      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    []
  )

  const handleBackgroundDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement
      if (target.closest('[data-canvas-note-card]')) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const { x, y } = screenToWorld(
        event.clientX - rect.left,
        event.clientY - rect.top
      )
      addNoteAt(x, y)
    },
    [addNoteAt, screenToWorld]
  )

  const handleFocusNote = useCallback((id: string) => {
    setNotes((prev) => {
      const maxZ = prev.reduce((max, n) => Math.max(max, n.zIndex), 0)
      const note = prev.find((n) => n.id === id)
      if (!note || note.zIndex === maxZ) return prev
      return prev.map((n) => (n.id === id ? { ...n, zIndex: maxZ + 1 } : n))
    })
  }, [])

  const handleTextChange = useCallback((id: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)))
  }, [])

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const handleResizeNote = useCallback(
    (id: string, width: number, height: number) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, width, height } : n))
      )
    },
    []
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const zoom = viewportRef.current.zoom
    const dx = event.delta.x / zoom
    const dy = event.delta.y / zoom
    setNotes((prev) =>
      prev.map((n) =>
        n.id === event.active.id ? { ...n, x: n.x + dx, y: n.y + dy } : n
      )
    )
  }, [])

  const handleZoomBy = useCallback((factor: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    const anchorX = rect ? rect.width / 2 : 0
    const anchorY = rect ? rect.height / 2 : 0
    setViewport((prev) => {
      const newZoom = clampZoom(prev.zoom * factor)
      const worldX = (anchorX - prev.x) / prev.zoom
      const worldY = (anchorY - prev.y) / prev.zoom
      return {
        zoom: newZoom,
        x: anchorX - worldX * newZoom,
        y: anchorY - worldY * newZoom
      }
    })
  }, [])

  const handleZoomReset = useCallback(() => {
    setViewport((prev) => ({ ...prev, zoom: 1 }))
  }, [])

  const handleResetCanvas = useCallback(() => {
    if (confirm('모든 노트를 삭제하고 초기화하시겠습니까?')) {
      resetStorage()
      setNotes([])
      setViewport(DEFAULT_VIEWPORT)
    }
  }, [resetStorage])

  return (
    <section className="fixed inset-0 z-50 flex flex-col bg-stone-50">
      <div className="border-b border-border bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeftIcon className="mr-1 size-4" />
              홈으로
            </Link>
          </Button>
          <div className="text-sm font-medium">Canvas Note</div>
          <div className="ml-auto text-xs text-muted-foreground">
            {notes.length > 0
              ? `${notes.length}개 노트 | 자동 저장됨`
              : '더블클릭하거나 + 버튼으로 시작하세요'}
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handleBackgroundPointerDown}
        onDoubleClick={handleBackgroundDoubleClick}
        className="relative flex-1 touch-none overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#e5e5e5 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: `${viewport.x}px ${viewport.y}px`
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
            pointerEvents: 'none'
          }}
        >
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                zoom={viewport.zoom}
                onFocus={handleFocusNote}
                onTextChange={handleTextChange}
                onDelete={handleDeleteNote}
                onResize={handleResizeNote}
              />
            ))}
          </DndContext>
        </div>
      </div>

      <CanvasNoteToolbar
        activeColor={activeColor}
        onColorChange={setActiveColor}
        onAddNote={handleAddNoteFromToolbar}
        zoom={viewport.zoom}
        onZoomIn={() => handleZoomBy(1 + ZOOM_STEP)}
        onZoomOut={() => handleZoomBy(1 - ZOOM_STEP)}
        onZoomReset={handleZoomReset}
        onResetCanvas={handleResetCanvas}
      />
    </section>
  )
}
