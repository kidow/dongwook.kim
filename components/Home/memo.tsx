'use client'

import dynamic from 'next/dynamic'

function MemoSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-black" aria-hidden>
      <div className="min-h-52 px-5 py-4 box-content" />
      <div className="h-10 border-t border-dashed border-border" />
    </div>
  )
}

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: MemoSkeleton
})

export default function Memo() {
  return <Editor />
}
