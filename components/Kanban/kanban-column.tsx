'use client'

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVerticalIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import KanbanCardItem from './kanban-card'

import type { KanbanCard, KanbanColumn, KanbanId } from './types'

interface KanbanColumnProps {
  column: KanbanColumn
  cards: KanbanCard[]
  onAddCard: (columnId: KanbanId) => void
  onEditCard: (card: KanbanCard) => void
  onDeleteCard: (cardId: KanbanId, columnId: KanbanId) => void
  onEditColumn: (column: KanbanColumn) => void
  onDeleteColumn: (columnId: KanbanId) => void
}

export default function KanbanColumnItem({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onEditColumn,
  onDeleteColumn
}: KanbanColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-xl border border-border bg-neutral-50 p-3',
        isDragging && 'opacity-50'
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon className="size-4" />
        </button>
        <h3 className="flex-1 text-sm font-semibold">{column.title}</h3>
        <Badge variant="secondary" className="text-xs">
          {cards.length}
        </Badge>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-1" align="end">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-100"
              onClick={() => onEditColumn(column)}
            >
              <PencilIcon className="size-3.5" />
              편집
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-red-50"
              onClick={() => onDeleteColumn(column.id)}
            >
              <TrashIcon className="size-3.5" />
              삭제
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex min-h-[100px] flex-1 flex-col gap-2">
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCardItem
              key={card.id}
              card={card}
              onEdit={onEditCard}
              onDelete={() => onDeleteCard(card.id, column.id)}
            />
          ))}
        </SortableContext>
      </div>

      <Button
        variant="ghost"
        className="mt-2 w-full justify-start text-muted-foreground"
        onClick={() => onAddCard(column.id)}
      >
        <PlusIcon className="mr-1 size-4" />
        카드 추가
      </Button>
    </div>
  )
}
