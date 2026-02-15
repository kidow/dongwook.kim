'use client'

import { useState, type FC } from 'react'
import type { Editor } from '@tiptap/core'
import { BubbleMenu, type BubbleMenuProps } from '@tiptap/react/menus'
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { ColorSelector } from './color-selector'
import { LinkSelector } from './link-selector'
import { NodeSelector } from './node-selector'

export interface BubbleMenuItem {
  name: string
  isActive: () => boolean
  command: () => void
  icon: typeof BoldIcon
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'>
type EditorBubbleMenuComponentProps = Omit<EditorBubbleMenuProps, 'editor'> & {
  editor: Editor
}

export const EditorBubbleMenu: FC<EditorBubbleMenuComponentProps> = (props) => {
  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => props.editor.isActive('bold'),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: BoldIcon
    },
    {
      name: 'italic',
      isActive: () => props.editor.isActive('italic'),
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon
    },
    {
      name: 'underline',
      isActive: () => props.editor.isActive('underline'),
      command: () => props.editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon
    },
    {
      name: 'strike',
      isActive: () => props.editor.isActive('strike'),
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon
    },
    {
      name: 'code',
      isActive: () => props.editor.isActive('code'),
      command: () => props.editor.chain().focus().toggleCode().run(),
      icon: CodeIcon
    }
  ]

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      if (editor.isActive('image')) {
        return false
      }
      return editor.view.state.selection.content().size > 0
    }
  }

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false)
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false)
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false)

  const handleNodeOpenChange = (open: boolean) => {
    setIsNodeSelectorOpen(open)
    if (open) {
      setIsColorSelectorOpen(false)
      setIsLinkSelectorOpen(false)
    }
  }

  const handleLinkOpenChange = (open: boolean) => {
    setIsLinkSelectorOpen(open)
    if (open) {
      setIsColorSelectorOpen(false)
      setIsNodeSelectorOpen(false)
    }
  }

  const handleColorOpenChange = (open: boolean) => {
    setIsColorSelectorOpen(open)
    if (open) {
      setIsNodeSelectorOpen(false)
      setIsLinkSelectorOpen(false)
    }
  }

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="bg-popover not-prose flex w-fit divide-x divide-border rounded-md border border-border shadow-md"
    >
      <NodeSelector
        editor={props.editor}
        isOpen={isNodeSelectorOpen}
        onOpenChange={handleNodeOpenChange}
      />
      <LinkSelector
        editor={props.editor}
        isOpen={isLinkSelectorOpen}
        onOpenChange={handleLinkOpenChange}
      />
      <div className="flex">
        {items.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            size="icon"
            onClick={item.command}
            className="h-8 w-8 rounded-none"
            aria-label={`Toggle ${item.name}`}
          >
            <item.icon
              className={cn('h-4 w-4', {
                'text-primary': item.isActive()
              })}
            />
          </Button>
        ))}
      </div>
      <ColorSelector
        editor={props.editor}
        isOpen={isColorSelectorOpen}
        onOpenChange={handleColorOpenChange}
      />
    </BubbleMenu>
  )
}
