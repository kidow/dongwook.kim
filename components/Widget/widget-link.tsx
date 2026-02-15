'use client'

import type { ReactNode, HTMLAttributeAnchorTarget } from 'react'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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
          'flex transition-all duration-150',
          size
        )}
      >
        <Card className="w-full rounded-3xl border-neutral-200 py-0 shadow-sm">
          <CardContent className="flex h-full p-5 xl:p-6">
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
          </CardContent>
        </Card>
      </Link>
    </li>
  )
}
