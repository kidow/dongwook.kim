'use client'

import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import type { WidgetLinkProps } from './types'

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
  const isExternal = target === '_blank'

  return (
    <li className={cn('overflow-hidden transition-all duration-150', className)}>
      <Link
        href={href}
        target={target}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        draggable={false}
        aria-label={`${title}${description ? ` - ${description}` : ''}`}
        className={cn(
          'flex transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-3xl',
          size
        )}
      >
        <Card className="w-full rounded-3xl border-border py-0 shadow-sm">
          <CardContent className="flex h-full p-5 xl:p-6">
            <div className="flex flex-col items-start">
              {icon}
              <div className="mt-3 flex-1">
                <div className="text-sm uppercase">{title}</div>
                {!!description && (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground xl:mt-0">
                    {description}
                  </p>
                )}
              </div>
              {button}
            </div>
            {children && <div className="ml-6 flex-1">{children}</div>}
          </CardContent>
        </Card>
      </Link>
    </li>
  )
}
