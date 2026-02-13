'use client'

import { useState } from 'react'

const STORAGE_KEY = 'memo-content-v1'

const getInitialContent = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? ''
}

export default function MemoEditor() {
  const [content, setContent] = useState(getInitialContent)
  const [saveStatus, setSaveStatus] = useState(() =>
    getInitialContent() ? '저장된 메모를 불러왔습니다' : '로컬 저장 대기'
  )

  const onChange = (value: string) => {
    setContent(value)
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, value)
    setSaveStatus('로컬 저장됨')
  }

  return (
    <section className="w-full">
      <h1 className="mb-2 text-2xl font-bold text-stone-800">메모</h1>
      <p className="mb-4 text-sm text-stone-500">로컬 저장 기반 임시 메모장</p>
      <textarea
        className="memo-editor min-h-[360px] w-full resize-y rounded-xl border border-stone-300 p-4 text-stone-800 outline-none focus:border-stone-400"
        placeholder="메모를 입력하세요. 새로고침 후에도 유지됩니다."
        value={content}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
        <span>{saveStatus}</span>
        <button
          type="button"
          className="rounded-md border border-stone-300 px-2 py-1 hover:bg-stone-100"
          onClick={() => {
            setContent('')
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem(STORAGE_KEY)
            }
            setSaveStatus('초기화됨')
          }}
        >
          비우기
        </button>
      </div>
    </section>
  )
}
