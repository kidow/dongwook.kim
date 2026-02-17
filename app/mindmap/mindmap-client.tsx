'use client'

import dynamic from 'next/dynamic'

const MindmapEditor = dynamic(() => import('./MindmapEditor'), {
  ssr: false,
  loading: () => (
    <div className="text-sm text-stone-400">
      마인드맵 에디터를 불러오는 중...
    </div>
  )
})

export default function MindmapClient() {
  return <MindmapEditor />
}
