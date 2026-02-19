import type { Metadata } from 'next'
import { Suspense } from 'react'

import KanbanBoard from '@/components/Kanban'

const TITLE = '칸반 보드'
const DESCRIPTION =
  'Trello 스타일 칸반 보드. 드래그 앤 드롭으로 카드를 관리하세요.'
const BASE_URL = 'https://dongwook.kim/kanban'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['kanban', 'board', 'todo', 'drag and drop'],
  alternates: {
    canonical: BASE_URL
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_URL
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION
  },
  metadataBase: new URL(BASE_URL)
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-stone-400">
          보드를 불러오는 중...
        </div>
      }
    >
      <KanbanBoard />
    </Suspense>
  )
}
