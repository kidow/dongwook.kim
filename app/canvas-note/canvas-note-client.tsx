'use client'

import dynamic from 'next/dynamic'

const CanvasNote = dynamic(() => import('./CanvasNote'), {
  ssr: false,
  loading: () => (
    <div className="text-sm text-stone-400">캔버스를 불러오는 중...</div>
  )
})

export default function CanvasNoteClient() {
  return <CanvasNote />
}
