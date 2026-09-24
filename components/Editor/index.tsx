'use client'

import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor, type Content } from '@tiptap/react'
import { useDebouncedCallback } from 'use-debounce'
import { Trash2Icon } from '@animateicons/react/lucide'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ToolbarProvider } from '@/components/toolbars/toolbar-provider'
import { EditorBubbleMenu } from './bubble-menu'
import { TiptapExtensions } from './extensions'
import { TiptapEditorProps } from './props'
import { useLocalStorage } from './use-local-storage'

const INITIAL_DOC: Content = {
  type: 'doc',
  content: [{ type: 'paragraph' }]
}

export default function Editor() {
  const [content, setContent, storageReady] = useLocalStorage<Content>(
    'content',
    INITIAL_DOC
  )
  const [saveStatus, setSaveStatus] = useState('Saved')
  const initialContentAppliedRef = useRef(false)
  const isHydratingRef = useRef(true)

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON()
    setSaveStatus('Saving...')
    setContent(json)
    setTimeout(() => {
      setSaveStatus('Saved')
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
      setSaveStatus('Editing...')
      debouncedUpdates(e)
    }
  })

  useEffect(() => {
    if (
      editor &&
      storageReady &&
      content &&
      !initialContentAppliedRef.current
    ) {
      initialContentAppliedRef.current = true
      isHydratingRef.current = true
      editor.commands.setContent(content)
      isHydratingRef.current = false
    }
  }, [editor, storageReady, content])

  const clearIconRef = useRef<{
    startAnimation: () => void
    stopAnimation: () => void
  }>(null)
  const startClearIcon = () => clearIconRef.current?.startAnimation()
  const stopClearIcon = () => clearIconRef.current?.stopAnimation()

  const statusLabel = storageReady ? saveStatus : 'Loading...'
  const isEditorReady = Boolean(editor) && storageReady

  return (
    <div className="rounded-lg border border-border transition-colors focus-within:border-muted-foreground">
      <div className="px-5 py-4">
        {editor ? (
          <ToolbarProvider editor={editor}>
            <EditorBubbleMenu editor={editor} />
            <EditorContent editor={editor} />
          </ToolbarProvider>
        ) : (
          <div className="min-h-52" />
        )}
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-border px-3 py-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-xs"
                className="pointer-coarse:size-11"
                aria-label="Clear memo"
                onClick={() => editor?.commands.clearContent(true)}
                onMouseEnter={startClearIcon}
                onMouseLeave={stopClearIcon}
                onFocus={startClearIcon}
                onBlur={stopClearIcon}
                disabled={!isEditorReady}
              >
                <Trash2Icon ref={clearIconRef} size={12} aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>Clear</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-xs text-muted-foreground">{statusLabel}</span>
      </div>
    </div>
  )
}
