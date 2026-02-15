'use client'

import type { ReactNode, HTMLAttributeAnchorTarget } from 'react'
import Link from 'next/link'

import { cn } from '@/utils'

interface WidgetLinkProps {
  href: string
  icon: ReactNode
  title: string
  description?: string
  button?: ReactNode
  children?: ReactNode
  className?: string
  size?: string
  target?: HTMLAttributeAnchorTarget
}

export default function WidgetLink({
  href,
  icon,
  title,
  button,
  children,
  className,
  description,
  size,
  target
}: WidgetLinkProps) {
  return (
    <li className={cn('overflow-hidden transition-all duration-150', className)}>
      <Link
        href={href}
        target={target}
        rel="noopener noreferrer"
        draggable={false}
        className={cn(
          'flex rounded-3xl border border-neutral-200 p-5 shadow-sm transition-all duration-150 xl:p-6',
          size
        )}
      >
        <div className="flex flex-col items-start">
          {icon}
          <div className="mt-3 flex-1">
            <div className="text-sm uppercase">{title}</div>
            {!!description && (
              <p className="mt-1 line-clamp-1 text-xs text-neutral-400 xl:mt-0">
                {description}
              </p>
            )}
          </div>
          {button}
        </div>
        <div className="ml-6 flex-1">{children}</div>
      </Link>
    </li>
  )
}
