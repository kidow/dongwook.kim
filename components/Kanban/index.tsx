'use client'

import { useCallback, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocalStorage } from '@/components/Editor/use-local-storage'
import { cn } from '@/lib/utils'
import { DEFAULT_BOARD, LABEL_COLORS } from './constants'
import KanbanCardDialog from './kanban-card-dialog'
import KanbanColumnDialog from './kanban-column-dialog'
import KanbanColumnItem from './kanban-column'

import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent
} from '@dnd-kit/core'
import type {
  KanbanBoard as KanbanBoardData,
  KanbanCard,
  KanbanColumn,
  KanbanId,
  LabelColor
} from './types'

export default function KanbanBoard() {
  const [board, setBoard] = useLocalStorage<KanbanBoardData>(
    'kanban-board',
    DEFAULT_BOARD
  )

  const [activeId, setActiveId] = useState<KanbanId | null>(null)
  const [activeType, setActiveType] = useState<'card' | 'column' | null>(
    null
  )

  // Card dialog state
  const [cardDialogOpen, setCardDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null)
  const [targetColumnId, setTargetColumnId] = useState<KanbanId | null>(
    null
  )

  // Column dialog state
  const [columnDialogOpen, setColumnDialogOpen] = useState(false)
  const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(
    null
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const findColumnByCardId = useCallback(
    (cardId: KanbanId) => {
      return board.columns.find((col) => col.cardIds.includes(cardId))
    },
    [board.columns]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const id = active.id as string
    setActiveId(id)
    setActiveType(board.cards[id] ? 'card' : 'column')
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || activeType !== 'card') return

    const activeCardId = active.id as string
    const overId = over.id as string

    const sourceColumn = findColumnByCardId(activeCardId)
    if (!sourceColumn) return

    // Determine destination column
    let destColumn: KanbanColumn | undefined
    if (board.cards[overId]) {
      // Hovering over another card
      destColumn = findColumnByCardId(overId)
    } else {
      // Hovering over a column directly
      destColumn = board.columns.find((col) => col.id === overId)
    }

    if (!destColumn || sourceColumn.id === destColumn.id) return

    // Move card to different column
    setBoard((prev) => {
      const newColumns = prev.columns.map((col) => {
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            cardIds: col.cardIds.filter((id) => id !== activeCardId)
          }
        }
        if (col.id === destColumn.id) {
          const overIndex = board.cards[overId]
            ? col.cardIds.indexOf(overId)
            : col.cardIds.length
          const newCardIds = [...col.cardIds]
          newCardIds.splice(
            overIndex >= 0 ? overIndex : newCardIds.length,
            0,
            activeCardId
          )
          return { ...col, cardIds: newCardIds }
        }
        return col
      })
      return { ...prev, columns: newColumns }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setActiveType(null)

    if (!over || active.id === over.id) return

    const activeIdStr = active.id as string
    const overIdStr = over.id as string

    if (activeType === 'column') {
      // Reorder columns
      const oldIndex = board.columns.findIndex(
        (col) => col.id === activeIdStr
      )
      const newIndex = board.columns.findIndex(
        (col) => col.id === overIdStr
      )
      if (oldIndex !== -1 && newIndex !== -1) {
        setBoard((prev) => ({
          ...prev,
          columns: arrayMove(prev.columns, oldIndex, newIndex)
        }))
      }
    } else if (activeType === 'card') {
      // Reorder within same column
      const column = findColumnByCardId(activeIdStr)
      if (!column) return
      const oldIndex = column.cardIds.indexOf(activeIdStr)
      const newIndex = column.cardIds.indexOf(overIdStr)
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setBoard((prev) => ({
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === column.id
              ? {
                  ...col,
                  cardIds: arrayMove(col.cardIds, oldIndex, newIndex)
                }
              : col
          )
        }))
      }
    }
  }

  // Card CRUD
  const handleAddCard = (columnId: KanbanId) => {
    setEditingCard(null)
    setTargetColumnId(columnId)
    setCardDialogOpen(true)
  }

  const handleEditCard = (card: KanbanCard) => {
    setEditingCard(card)
    setTargetColumnId(null)
    setCardDialogOpen(true)
  }

  const handleDeleteCard = (cardId: KanbanId, columnId: KanbanId) => {
    setBoard((prev) => {
      const { [cardId]: _removed, ...remainingCards } = prev.cards
      return {
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cardIds: col.cardIds.filter((id) => id !== cardId)
              }
            : col
        ),
        cards: remainingCards
      }
    })
  }

  const handleSaveCard = (data: {
    id?: string
    title: string
    description: string
    label: LabelColor | null
  }) => {
    if (data.id) {
      // Edit existing card
      setBoard((prev) => ({
        ...prev,
        cards: {
          ...prev.cards,
          [data.id!]: { ...prev.cards[data.id!], ...data }
        }
      }))
    } else {
      // Add new card
      const newId = crypto.randomUUID()
      const newCard: KanbanCard = {
        id: newId,
        title: data.title,
        description: data.description,
        label: data.label,
        createdAt: new Date().toISOString()
      }
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === targetColumnId
            ? { ...col, cardIds: [...col.cardIds, newId] }
            : col
        ),
        cards: { ...prev.cards, [newId]: newCard }
      }))
    }
  }

  // Column CRUD
  const handleAddColumn = () => {
    setEditingColumn(null)
    setColumnDialogOpen(true)
  }

  const handleEditColumn = (column: KanbanColumn) => {
    setEditingColumn(column)
    setColumnDialogOpen(true)
  }

  const handleDeleteColumn = (columnId: KanbanId) => {
    setBoard((prev) => {
      const column = prev.columns.find((col) => col.id === columnId)
      const remainingCards = { ...prev.cards }
      column?.cardIds.forEach((cardId) => {
        delete remainingCards[cardId]
      })
      return {
        ...prev,
        columns: prev.columns.filter((col) => col.id !== columnId),
        cards: remainingCards
      }
    })
  }

  const handleSaveColumn = (title: string, columnId?: string) => {
    if (columnId) {
      // Edit existing column
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnId ? { ...col, title } : col
        )
      }))
    } else {
      // Add new column
      const newColumn: KanbanColumn = {
        id: crypto.randomUUID(),
        title,
        cardIds: []
      }
      setBoard((prev) => ({
        ...prev,
        columns: [...prev.columns, newColumn]
      }))
    }
  }

  // Get active item for DragOverlay
  const activeCard =
    activeId && activeType === 'card' ? board.cards[activeId] : null
  const activeColumn =
    activeId && activeType === 'column'
      ? board.columns.find((col) => col.id === activeId)
      : null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">칸반 보드</h2>
          <p className="text-sm text-muted-foreground">
            카드를 드래그하여 작업을 관리하세요
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleAddColumn}>
          <PlusIcon className="mr-1 size-4" />
          컬럼 추가
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext
            items={board.columns.map((col) => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            {board.columns.map((column) => (
              <KanbanColumnItem
                key={column.id}
                column={column}
                cards={column.cardIds
                  .map((id) => board.cards[id])
                  .filter(Boolean)}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
                onEditColumn={handleEditColumn}
                onDeleteColumn={handleDeleteColumn}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeCard && (
            <div className="rotate-3 shadow-lg">
              <div className="w-64 rounded-lg border border-border bg-white">
                {activeCard.label && (
                  <div
                    className={cn(
                      'h-1.5 rounded-t-lg',
                      LABEL_COLORS[activeCard.label].bg
                    )}
                  />
                )}
                <div className="p-3">
                  <div className="text-sm font-medium">
                    {activeCard.title}
                  </div>
                  {activeCard.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {activeCard.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeColumn && (
            <div className="rotate-3 opacity-80 shadow-lg">
              <div className="w-72 rounded-xl border border-border bg-neutral-50 p-3">
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="flex-1 text-sm font-semibold">
                    {activeColumn.title}
                  </h3>
                </div>
                <div className="min-h-[60px] text-center text-xs text-muted-foreground">
                  {activeColumn.cardIds.length}개의 카드
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <KanbanCardDialog
        open={cardDialogOpen}
        onOpenChange={setCardDialogOpen}
        card={editingCard}
        onSave={handleSaveCard}
      />

      <KanbanColumnDialog
        open={columnDialogOpen}
        onOpenChange={setColumnDialogOpen}
        column={editingColumn}
        onSave={handleSaveColumn}
      />
    </section>
  )
}
