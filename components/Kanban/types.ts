export type KanbanId = string

export type LabelColor =
  | 'gray'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'

export interface KanbanCard {
  id: KanbanId
  title: string
  description: string
  label: LabelColor | null
  createdAt: string
}

export interface KanbanColumn {
  id: KanbanId
  title: string
  cardIds: KanbanId[]
}

export interface KanbanBoard {
  columns: KanbanColumn[]
  cards: Record<KanbanId, KanbanCard>
}
