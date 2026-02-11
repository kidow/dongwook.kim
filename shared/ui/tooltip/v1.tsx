'use client'

import { cn } from '@/shared/utils'

type Position = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipV1Props extends ReactProps {
  content: string
  className?: string
  position?: Position
  arrow?: boolean
}

const POSITION_CLASS: Record<Position, string> = {
  top: 'before:bottom-[calc(100%+4px)] before:top-auto before:left-1/2 before:-translate-x-1/2',
  right:
    'before:left-[calc(100%+5px)] before:top-1/2 before:-translate-y-1/2 before:right-auto',
  bottom:
    'before:top-[calc(100%+4px)] before:left-1/2 before:-translate-x-1/2 before:right-auto',
  left: 'before:left-auto before:right-[calc(100%+5px)] before:top-1/2 before:-translate-y-1/2'
}

const ARROW_CLASS: Record<Position, string> = {
  top: 'after:bottom-[calc(100%-2px)] after:top-auto after:border-t-neutral-800 dark:after:border-t-neutral-700 after:left-1/2 after:-translate-x-1/2 after:right-auto',
  right:
    'after:left-[calc(100%-1px)] after:border-r-neutral-800 dark:after:border-r-neutral-700 after:right-auto after:top-1/2 after:-translate-y-1/2 after:bottom-auto',
  bottom:
    'after:top-[calc(100%-2px)] after:border-b-neutral-800 dark:after:border-b-neutral-700 after:left-1/2 after:-translate-x-1/2 after:right-auto after:bottom-auto',
  left: 'after:left-auto after:right-[calc(100%-1px)] after:border-l-neutral-800 dark:after:border-l-neutral-700 after:top-1/2 after:-translate-y-1/2 after:bottom-auto'
}

export default function TooltipV1({
  children,
  content,
  className,
  position = 'top',
  arrow = true
}: TooltipV1Props) {
  return (
    <div
      className={cn(
        'relative inline-block text-center before:pointer-events-none before:absolute before:z-[9999] before:w-max before:max-w-xs before:rounded before:bg-neutral-800 before:px-2 before:py-1 before:text-xs before:text-neutral-50 before:opacity-0 before:delay-100 before:duration-200 before:ease-in-out before:content-[attr(data-tip)] hover:before:opacity-100 hover:before:delay-75 dark:before:bg-neutral-700',
        POSITION_CLASS[position],
        arrow
          ? cn(
              'after:absolute after:z-[9999] after:block after:h-0 after:w-0 after:border-[3px] after:border-transparent after:opacity-0 after:delay-100 after:duration-200 after:ease-in-out after:content-[""] hover:after:opacity-100 hover:after:delay-75',
              ARROW_CLASS[position]
            )
          : undefined,
        className
      )}
      data-tip={content}
      role="tooltip"
    >
      {children}
    </div>
  )
}
