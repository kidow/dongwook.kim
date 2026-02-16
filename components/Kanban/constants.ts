import type { KanbanBoard, LabelColor } from './types'

export const LABEL_COLORS: Record<
  LabelColor,
  { bg: string; text: string; name: string }
> = {
  gray: { bg: 'bg-neutral-100', text: 'text-neutral-700', name: '회색' },
  red: { bg: 'bg-red-100', text: 'text-red-700', name: '빨강' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', name: '주황' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', name: '노랑' },
  green: { bg: 'bg-green-100', text: 'text-green-700', name: '초록' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', name: '파랑' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', name: '보라' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', name: '분홍' }
}

export const DEFAULT_BOARD: KanbanBoard = {
  columns: [
    { id: 'col-1', title: 'To Do', cardIds: ['card-1', 'card-2'] },
    { id: 'col-2', title: 'In Progress', cardIds: [] },
    { id: 'col-3', title: 'Done', cardIds: [] }
  ],
  cards: {
    'card-1': {
      id: 'card-1',
      title: '칸반 보드에 오신 것을 환영합니다!',
      description: '카드를 드래그하여 컬럼 간 이동해 보세요.',
      label: 'blue',
      createdAt: new Date().toISOString()
    },
    'card-2': {
      id: 'card-2',
      title: '이 카드를 드래그해 보세요',
      description: '',
      label: null,
      createdAt: new Date().toISOString()
    }
  }
}
