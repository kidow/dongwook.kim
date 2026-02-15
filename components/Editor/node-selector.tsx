'use client'

import { Dispatch, FC, SetStateAction } from 'react'
import { Editor } from '@tiptap/core'
import {
  Check,
  CheckSquare,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  TextIcon,
  TextQuote
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { BubbleMenuItem } from './bubble-menu'

interface NodeSelectorProps {
  editor: Editor
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const NodeSelector: FC<NodeSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen
}) => {
  const items: BubbleMenuItem[] = [
    {
      name: 'Text',
      icon: TextIcon,
      command: () =>
        editor.chain().focus().toggleNode('paragraph', 'paragraph').run(),
      isActive: () =>
        editor.isActive('paragraph') &&
        !editor.isActive('bulletList') &&
        !editor.isActive('orderedList')
    },
    {
      name: 'Heading 1',
      icon: Heading1,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 })
    },
    {
      name: 'Heading 2',
      icon: Heading2,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 })
    },
    {
      name: 'Heading 3',
      icon: Heading3,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 })
    },
    {
      name: 'To-do List',
      icon: CheckSquare,
      command: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive('taskItem')
    },
    {
      name: 'Bullet List',
      icon: ListOrdered,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList')
    },
    {
      name: 'Numbered List',
      icon: ListOrdered,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList')
    },
    {
      name: 'Quote',
      icon: TextQuote,
      command: () =>
        editor
          .chain()
          .focus()
          .toggleNode('paragraph', 'paragraph')
          .toggleBlockquote()
          .run(),
      isActive: () => editor.isActive('blockquote')
    },
    {
      name: 'Code',
      icon: Code,
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock')
    }
  ]

  const activeItem = items.filter((item) => item.isActive()).pop() ?? {
    name: 'Multiple'
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 rounded-none font-medium"
        >
          <span>{activeItem?.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-48 p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.command()
              setIsOpen(false)
            }}
            className="flex w-full items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border border-stone-200 p-1">
                <item.icon className="h-3 w-3" />
              </div>
              <span>{item.name}</span>
            </div>
            {activeItem.name === item.name && <Check className="h-4 w-4" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
