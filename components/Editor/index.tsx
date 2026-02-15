'use client'

import { useEffect, useRef, useState } from 'react'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { EditorContent, useEditor, type Content } from '@tiptap/react'
import { useDebouncedCallback } from 'use-debounce'
import { cn } from '@/lib/utils'
import { toast } from '@/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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
  const initialDoc: Content = {
    type: 'doc',
    content: [{ type: 'paragraph' }]
  }
  const [content, setContent, storageReady] = useLocalStorage<Content>(
    'content',
    initialDoc
  )
  const [saveStatus, setSaveStatus] = useState('저장됨')
  const initialContentAppliedRef = useRef(false)
  const isHydratingRef = useRef(true)

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
      if (!storageReady || isHydratingRef.current) {
        return
      }
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
    if (editor && storageReady && content && !initialContentAppliedRef.current) {
      initialContentAppliedRef.current = true
      isHydratingRef.current = true
      editor.commands.setContent(content)
      isHydratingRef.current = false
    }
  }, [editor, storageReady, content])

  const statusLabel = storageReady ? saveStatus : '불러오는 중...'
  const isEditorReady = Boolean(editor) && storageReady

  return (
    <div className={cn('relative pb-24', cal.variable, inter.variable)}>
      <Card className="gap-0 overflow-hidden border-0">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="font-display text-2xl">메모</CardTitle>
          <CardAction>
            <Badge variant="secondary">{statusLabel}</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="relative px-0">
          {editor && <EditorBubbleMenu editor={editor} />}
          <div className="min-h-[500px] px-6 py-5">
            <EditorContent editor={editor} />
          </div>
        </CardContent>
        <CardFooter className="border-t border-border py-4">
          <div className="flex items-center gap-2 text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={onShareLink}
              disabled={!isEditorReady}
            >
              링크 공유
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor?.commands.clearContent()}
              disabled={!isEditorReady}
            >
              비우기
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
