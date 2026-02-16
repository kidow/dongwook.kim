'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { LABEL_COLORS } from './constants'

import type { KanbanCard } from './types'

interface KanbanCardProps {
  card: KanbanCard
  onEdit: (card: KanbanCard) => void
  onDelete: () => void
}

export default function KanbanCardItem({
  card,
  onEdit,
  onDelete
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab rounded-lg border border-border bg-white shadow-sm transition-opacity active:cursor-grabbing',
        isDragging && 'opacity-50'
      )}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation()
          onEdit(card)
        }
      }}
    >
      {card.label && (
        <div
          className={cn(
            'h-1.5 rounded-t-lg',
            LABEL_COLORS[card.label].bg
          )}
        />
      )}
      <div className="p-3">
        <div className="text-sm font-medium">{card.title}</div>
        {card.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {card.description}
          </p>
        )}
      </div>
    </div>
  )
}
