'use client'

import React, { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Extension, type Editor, type Range } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  TableIcon,
  Text,
  TextQuote,
  WrapTextIcon
} from 'lucide-react'
import tippy, { type Instance, type Props as TippyProps } from 'tippy.js'

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'

interface CommandProps {
  editor: Editor
  range: Range
}

interface SuggestionItem {
  title: string
  description: string
  searchTerms?: string[]
  icon: ReactNode
  command: (props: CommandProps) => void
}

interface SuggestionRenderProps {
  editor: Editor
  clientRect?: DOMRect | null
  items: SuggestionItem[]
  command: (item: SuggestionItem) => void
  range: Range
}

const SlashCommandExtension = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({
          editor,
          range,
          props
        }: {
          editor: Editor
          range: Range
          props: SuggestionItem
        }) => {
          props.command({ editor, range })
        }
      }
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ]
  }
})

const getSuggestionItems = ({ query }: { query: string }): SuggestionItem[] => {
  const items: SuggestionItem[] = [
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      searchTerms: ['p', 'paragraph'],
      icon: <Text size={18} />,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode('paragraph', 'paragraph')
          .run()
      }
    },
    {
      title: 'To-do List',
      description: 'Track tasks with a to-do list.',
      searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
      icon: <CheckSquare size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run()
      }
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      searchTerms: ['title', 'big', 'large'],
      icon: <Heading1 size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
      }
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      searchTerms: ['subtitle', 'medium'],
      icon: <Heading2 size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
      }
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      searchTerms: ['subtitle', 'small'],
      icon: <Heading3 size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
      }
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      searchTerms: ['unordered', 'point'],
      icon: <List size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run()
      }
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      searchTerms: ['ordered'],
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run()
      }
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      searchTerms: ['blockquote'],
      icon: <TextQuote size={18} />,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode('paragraph', 'paragraph')
          .toggleBlockquote()
          .run()
      }
    },
    {
      title: 'Code',
      description: 'Capture a code snippet.',
      searchTerms: ['codeblock'],
      icon: <Code size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
      }
    },
    {
      title: 'Image',
      description: 'Upload an image from your computer.',
      searchTerms: ['photo', 'picture', 'media'],
      icon: <ImageIcon size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run()
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async () => {
          if (input.files?.length) {
            // image upload logic can be wired here in a follow-up step
          }
        }
        input.click()
      }
    },
    {
      title: 'Table',
      description: 'Create a simple table.',
      searchTerms: ['table'],
      icon: <TableIcon size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).insertTable().run()
      }
    },
    {
      title: 'Hard Break',
      description: 'Forcibly moves out and to the next line.',
      searchTerms: ['hard break'],
      icon: <WrapTextIcon size={18} />,
      command: ({ editor }) => {
        editor.commands.setHardBreak()
      }
    }
  ]

  if (!query) {
    return items
  }

  const search = query.toLowerCase()
  return items.filter((item) => {
    return (
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.searchTerms?.some((term) => term.includes(search))
    )
  })
}

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight
  const itemHeight = item.offsetHeight
  const top = item.offsetTop
  const bottom = top + itemHeight

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5
  }
}

const CommandListView = ({ items, command }: SuggestionRenderProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const commandListContainer = useRef<HTMLDivElement>(null)
  const activeIndex = items.length > 0 ? Math.min(selectedIndex, items.length - 1) : 0

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    },
    [command, items]
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
        return
      }

      event.preventDefault()

      if (event.key === 'ArrowUp') {
        if (items.length === 0) {
          return
        }
        setSelectedIndex((prev) => (prev + items.length - 1) % items.length)
        return
      }

      if (event.key === 'ArrowDown') {
        if (items.length === 0) {
          return
        }
        setSelectedIndex((prev) => (prev + 1) % items.length)
        return
      }

      if (event.key === 'Enter') {
        selectItem(activeIndex)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, items, selectItem])

  useLayoutEffect(() => {
    const container = commandListContainer.current
    const item = container?.children[activeIndex] as HTMLElement | undefined
    if (container && item) {
      updateScrollView(container, item)
    }
  }, [activeIndex])

  return (
    <Command
      id="slash-command"
      className="z-50 w-80 rounded-md border border-border shadow-md"
    >
      <CommandList ref={commandListContainer} className="max-h-[330px] p-1">
        {items.length === 0 ? (
          <CommandEmpty className="text-muted-foreground">No command found.</CommandEmpty>
        ) : (
          <CommandGroup>
            {items.map((item, index) => (
              <CommandItem
                key={item.title}
                data-selected={index === activeIndex}
                onClick={() => selectItem(index)}
                className="h-auto items-start gap-2 px-2 py-2 text-left"
              >
                <div className="bg-background mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-foreground font-medium">{item.title}</p>
                  <p className="text-muted-foreground text-xs leading-5">{item.description}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}

const renderItems = () => {
  let component: ReactRenderer | null = null
  let popup: Instance<TippyProps>[] | null = null

  return {
    onStart: (props: SuggestionRenderProps) => {
      if (!props.clientRect) {
        return
      }

      component = new ReactRenderer(CommandListView, {
        props,
        editor: props.editor
      })

      popup = tippy('body', {
        getReferenceClientRect: () => props.clientRect ?? new DOMRect(),
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start'
      })
    },
    onUpdate: (props: SuggestionRenderProps) => {
      component?.updateProps(props)

      if (!props.clientRect || !popup) {
        return
      }

      popup[0].setProps({
        getReferenceClientRect: () => props.clientRect ?? new DOMRect()
      })
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === 'Escape') {
        popup?.[0].hide()
        return true
      }

      return false
    },
    onExit: () => {
      popup?.[0].destroy()
      component?.destroy()
    }
  }
}

const SlashCommand = SlashCommandExtension.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems
  }
})

export default SlashCommand
