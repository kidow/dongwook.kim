'use client'
/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react'

type TiptapLib = {
  EditorContent: React.ComponentType<{ editor: unknown }>
  useEditor: (...args: [{
    extensions: unknown[]
    content: unknown
    editorProps?: {
      attributes?: Record<string, string>
    }
    onUpdate?: (...args: [{ editor: { getJSON: () => unknown } }]) => void
  }]) => {
    commands: {
      setContent: (...args: [unknown]) => void
      clearContent: (...args: [boolean?]) => void
    }
  } | null
  StarterKit: unknown
  Placeholder: {
    configure: (...args: [{ placeholder: string }]) => unknown
  }
}

const STORAGE_KEY = 'memo-content-v1'

const getInitialTextContent = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? ''
}

const getInitialRichContent = () => {
  if (typeof window === 'undefined') {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }]
    }
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }]
    }
  }

  try {
    return JSON.parse(saved)
  } catch {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }]
    }
  }
}

const loadTiptap = async (): Promise<TiptapLib> => {
  const dynamicImport = new Function(
    'u',
    'return import(/* webpackIgnore: true */ u)'
  ) as (...args: [string]) => Promise<unknown>

  const [reactModule, starterKitModule, placeholderModule] = await Promise.all([
    dynamicImport('https://esm.sh/@tiptap/react@2.11.5?external=react,react-dom'),
    dynamicImport('https://esm.sh/@tiptap/starter-kit@2.11.5'),
    dynamicImport('https://esm.sh/@tiptap/extension-placeholder@2.11.5')
  ])

  const reactTyped = reactModule as {
    EditorContent: TiptapLib['EditorContent']
    useEditor: TiptapLib['useEditor']
  }
  const starterTyped = starterKitModule as { default: unknown }
  const placeholderTyped = placeholderModule as { default: TiptapLib['Placeholder'] }

  return {
    EditorContent: reactTyped.EditorContent,
    useEditor: reactTyped.useEditor,
    StarterKit: starterTyped.default,
    Placeholder: placeholderTyped.default
  }
}

function TiptapMemoEditor({
  tiptap,
  setSaveStatus
}: {
  tiptap: TiptapLib
  setSaveStatus: React.Dispatch<React.SetStateAction<string>>
}) {
  const editor = tiptap.useEditor({
    extensions: [
      tiptap.StarterKit,
      tiptap.Placeholder.configure({
        placeholder: '메모를 입력하세요. 새로고침 후에도 유지됩니다.'
      })
    ],
    content: getInitialRichContent(),
    editorProps: {
      attributes: {
        class:
          'ProseMirror min-h-[360px] rounded-xl border border-stone-300 p-4 text-stone-800 outline-none focus:border-stone-400'
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      if (typeof window === 'undefined') {
        return
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentEditor.getJSON()))
      setSaveStatus('로컬 저장됨 (Tiptap)')
    }
  })

  if (!editor) {
    return (
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-500">
        에디터를 불러오는 중입니다...
      </div>
    )
  }

  return (
    <>
      <tiptap.EditorContent editor={editor} />
      <div className="mt-3 flex items-center justify-end text-xs">
        <button
          type="button"
          className="rounded-md border border-stone-300 px-2 py-1 text-stone-500 hover:bg-stone-100"
          onClick={() => {
            editor.commands.clearContent(true)
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem(STORAGE_KEY)
            }
            setSaveStatus('초기화됨')
          }}
        >
          비우기
        </button>
      </div>
    </>
  )
}

export default function MemoEditor() {
  const [textContent, setTextContent] = useState(getInitialTextContent)
  const [saveStatus, setSaveStatus] = useState(() =>
    getInitialTextContent() ? '저장된 메모를 불러왔습니다' : '로컬 저장 대기'
  )
  const [tiptap, setTiptap] = useState<TiptapLib | null>(null)
  const [isTiptapFailed, setIsTiptapFailed] = useState(false)

  useEffect(() => {
    let mounted = true

    loadTiptap()
      .then((loaded) => {
        if (!mounted) {
          return
        }
        setTiptap(loaded)
        setSaveStatus('Tiptap 에디터 준비 완료')
      })
      .catch(() => {
        if (!mounted) {
          return
        }
        setIsTiptapFailed(true)
        setSaveStatus('Tiptap 로드 실패: textarea 모드로 동작 중')
      })

    return () => {
      mounted = false
    }
  }, [])

  const onTextChange = (value: string) => {
    setTextContent(value)
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, value)
    setSaveStatus('로컬 저장됨 (textarea)')
  }

  return (
    <section className="w-full">
      <h1 className="mb-2 text-2xl font-bold text-stone-800">메모</h1>
      <p className="mb-4 text-sm text-stone-500">로컬 저장 기반 메모장 (Tiptap 우선)</p>

      {tiptap ? (
        <TiptapMemoEditor
          tiptap={tiptap}
          setSaveStatus={setSaveStatus}
        />
      ) : (
        <textarea
          className="memo-editor min-h-[360px] w-full resize-y rounded-xl border border-stone-300 p-4 text-stone-800 outline-none focus:border-stone-400"
          placeholder="메모를 입력하세요. 새로고침 후에도 유지됩니다."
          value={textContent}
          onChange={(event) => onTextChange(event.target.value)}
        />
      )}

      {isTiptapFailed && (
        <p className="mt-2 text-xs text-amber-700">
          현재 네트워크 환경에서 Tiptap 모듈을 불러오지 못해 textarea 대체 모드로 동작합니다.
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
        <span>{saveStatus}</span>
        {!tiptap && (
          <button
            type="button"
            className="rounded-md border border-stone-300 px-2 py-1 hover:bg-stone-100"
            onClick={() => {
              setTextContent('')
              if (typeof window !== 'undefined') {
                window.localStorage.removeItem(STORAGE_KEY)
              }
              setSaveStatus('초기화됨')
            }}
          >
            비우기
          </button>
        )}
      </div>
    </section>
  )
}
