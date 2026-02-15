'use client'

import {
  useEffect,
  useRef,
  type Dispatch,
  type FC,
  type SetStateAction
} from 'react'
import { Editor } from '@tiptap/core'
import { Check, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

interface LinkSelectorProps {
  editor: Editor
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const LinkSelector: FC<LinkSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-none font-medium"
        >
          <p className="text-base">↗</p>
          <p
            className={cn('underline decoration-stone-400 underline-offset-4', {
              'text-blue-500': editor.isActive('link')
            })}
          >
            Link
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-60 p-1"
        onOpenAutoFocus={(event: Event) => event.preventDefault()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.target[0] as HTMLInputElement
            editor.chain().focus().setLink({ href: input.value }).run()
            setIsOpen(false)
          }}
          className="flex items-center"
        >
          <Input
            ref={inputRef}
            type="url"
            placeholder="Paste a link"
            className="h-8 flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
            defaultValue={editor.getAttributes('link').href || ''}
          />
          {editor.getAttributes('link').href ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:bg-red-100"
              onClick={() => {
                editor.chain().focus().unsetLink().run()
                setIsOpen(false)
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  )
}
