'use client'

import dynamic from 'next/dynamic'

const ErdEditor = dynamic(() => import('./ErdEditor'), {
  ssr: false,
  loading: () => (
    <div className="text-sm text-stone-400">
      에디터를 불러오는 중...
    </div>
  )
})

export default function ErdEditorClient() {
  return <ErdEditor />
}
