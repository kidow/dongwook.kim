'use client'

import type { FC } from 'react'
import { Editor } from '@tiptap/core'
import { Check, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export interface BubbleColorMenuItem {
  name: string
  color: string
}

interface ColorSelectorProps {
  editor: Editor
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  { name: 'Default', color: '#000000' },
  { name: 'Purple', color: '#9333EA' },
  { name: 'Red', color: '#E00000' },
  { name: 'Yellow', color: '#EAB308' },
  { name: 'Blue', color: '#2563EB' },
  { name: 'Green', color: '#008A00' },
  { name: 'Orange', color: '#FFA500' },
  { name: 'Pink', color: '#BA4081' },
  { name: 'Gray', color: '#A8A29E' }
]

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  { name: 'Default', color: '#ffffff' },
  { name: 'Purple', color: '#f6f3f8' },
  { name: 'Red', color: '#fdebeb' },
  { name: 'Yellow', color: '#fbf4a2' },
  { name: 'Blue', color: '#c1ecf9' },
  { name: 'Green', color: '#acf79f' },
  { name: 'Orange', color: '#faebdd' },
  { name: 'Pink', color: '#faf1f5' },
  { name: 'Gray', color: '#f1f1ef' }
]

export const ColorSelector: FC<ColorSelectorProps> = ({
  editor,
  isOpen,
  onOpenChange
}) => {
  const activeColorItem = TEXT_COLORS.find(({ color }) =>
    editor.isActive('textStyle', { color })
  )

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
    editor.isActive('highlight', { color })
  )

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 rounded-none font-medium"
          aria-label="Select text and highlight colors"
        >
          <span
            className="rounded-sm px-1"
            style={{
              color: activeColorItem?.color,
              backgroundColor: activeHighlightItem?.color
            }}
          >
            A
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-48 p-1"
        onOpenAutoFocus={(event: Event) => event.preventDefault()}
      >
        <div className="my-1 px-2 text-sm text-muted-foreground">Color</div>
        {TEXT_COLORS.map(({ name, color }) => (
          <button
            key={`text-${name}`}
            onClick={() => {
              editor.commands.unsetColor()
              if (name !== 'Default') {
                editor.chain().focus().setColor(color).run()
              }
              onOpenChange(false)
            }}
            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-sm px-2 py-1 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2">
              <div
                className="rounded-sm border border-border px-1 py-px font-medium"
                style={{ color }}
              >
                A
              </div>
              <span>{name}</span>
            </div>
            {editor.isActive('textStyle', { color }) && (
              <Check className="h-4 w-4" />
            )}
          </button>
        ))}

        <div className="mb-1 mt-2 px-2 text-sm text-muted-foreground">
          Background
        </div>

        {HIGHLIGHT_COLORS.map(({ name, color }) => (
          <button
            key={`highlight-${name}`}
            onClick={() => {
              editor.commands.unsetHighlight()
              if (name !== 'Default') {
                editor.commands.setHighlight({ color })
              }
              onOpenChange(false)
            }}
            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-sm px-2 py-1 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2">
              <div
                className="rounded-sm border border-border px-1 py-px font-medium"
                style={{ backgroundColor: color }}
              >
                A
              </div>
              <span>{name}</span>
            </div>
            {editor.isActive('highlight', { color }) && (
              <Check className="h-4 w-4" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
