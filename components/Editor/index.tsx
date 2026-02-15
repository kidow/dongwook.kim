'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { EditorContent, useEditor, type Content } from '@tiptap/react'
import { useDebouncedCallback } from 'use-debounce'
import { cn } from '@/lib/utils'
import { toast } from '@/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EditorBubbleMenu } from './bubble-menu'
import { TiptapExtensions } from './extensions'
import { TiptapEditorProps } from './props'
import { useLocalStorage } from './use-local-storage'

const cal = localFont({
  src: './CalSans-SemiBold.otf',
  variable: '--font-display'
})

const inter = Inter({
  variable: '--font-default',
  subsets: ['latin']
})

export default function Editor() {
  const [content, setContent] = useLocalStorage<Content>('content', {
    type: 'doc',
    content: [{ type: 'paragraph' }]
  })
  const [saveStatus, setSaveStatus] = useState('저장됨')
  const [hydrated, setHydrated] = useState(false)

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON()
    setSaveStatus('저장 중...')
    setContent(json)
    setTimeout(() => {
      setSaveStatus('저장됨')
    }, 500)
  }, 750)

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    immediatelyRender: false,
    onUpdate: (e) => {
      setSaveStatus('작성 중...')
      debouncedUpdates(e)
    },
    autofocus: 'end'
  })

  const onShareLink = async () => {
    const param = btoa(encodeURIComponent(JSON.stringify(content)))
    if (typeof window.navigator !== 'undefined') {
      await window.navigator.clipboard.writeText(
        `https://dongwook.kim/memo?c=${param}`
      )
      toast.success('복사되었습니다.')
    }
  }

  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content)
      setHydrated(true)
    }
  }, [editor, content, hydrated])
  return (
    <div
      className={cn(
        'prose relative min-h-[500px] pb-80',
        cal.variable,
        inter.variable
      )}
    >
      <h1>메모</h1>
      {editor && <EditorBubbleMenu editor={editor} />}
      <div className="prose-lg prose-stone prose-headings:font-display font-default focus:outline-none max-w-full">
        <EditorContent editor={editor} />
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <Badge variant="secondary">{saveStatus}</Badge>
        <Button variant="outline" size="sm" onClick={onShareLink}>
          링크 공유
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor?.commands.clearContent()}
          disabled={!editor}
        >
          비우기
        </Button>
      </div>
    </div>
  )
}
