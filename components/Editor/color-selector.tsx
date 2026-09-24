'use client'

import type { ComponentProps, FC } from 'react'
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
  onOpenChange: NonNullable<ComponentProps<typeof Popover>['onOpenChange']>
}

// Tuned for the dark theme: text colors clear 7:1 on the page background,
// highlights keep the foreground above 8:1.
const TEXT_COLORS: BubbleColorMenuItem[] = [
  { name: 'Default', color: 'var(--foreground)' },
  { name: 'Purple', color: '#c084fc' },
  { name: 'Red', color: '#f87171' },
  { name: 'Yellow', color: '#facc15' },
  { name: 'Blue', color: '#60a5fa' },
  { name: 'Green', color: '#4ade80' },
  { name: 'Orange', color: '#fb923c' },
  { name: 'Pink', color: '#f472b6' },
  { name: 'Gray', color: '#a1a1aa' }
]

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  { name: 'Default', color: 'transparent' },
  { name: 'Purple', color: '#581c87' },
  { name: 'Red', color: '#7f1d1d' },
  { name: 'Yellow', color: '#713f12' },
  { name: 'Blue', color: '#1e3a8a' },
  { name: 'Green', color: '#14532d' },
  { name: 'Orange', color: '#7c2d12' },
  { name: 'Pink', color: '#831843' },
  { name: 'Gray', color: '#3f3f46' }
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
                className="rounded-sm border border-border px-1 py-px font-medium text-foreground"
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
