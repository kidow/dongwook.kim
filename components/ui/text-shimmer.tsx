'use client'

// From Motion Primitives (https://motion-primitives.com/docs/text-shimmer).
// Local changes: theme tokens instead of `dark:` variants (the site is always
// dark), a pause between sweeps, reduced-motion fallback, and a memoized
// motion component.
import React, { useMemo, type JSX } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

export type TextShimmerProps = {
  children: string
  as?: React.ElementType
  className?: string
  duration?: number
  /** Seconds to wait between sweeps. */
  repeatDelay?: number
  spread?: number
}

function TextShimmerComponent({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  repeatDelay = 0,
  spread = 2
}: TextShimmerProps) {
  const reduceMotion = useReducedMotion()
  const MotionComponent = useMemo(
    () => motion.create(Component as keyof JSX.IntrinsicElements),
    [Component]
  )

  const dynamicSpread = useMemo(() => {
    return children.length * spread
  }, [children, spread])

  if (reduceMotion) {
    return (
      <Component className={cn('text-muted-foreground', className)}>
        {children}
      </Component>
    )
  }

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:var(--muted-foreground)] [--base-gradient-color:var(--foreground)]',
        '[background-repeat:no-repeat,padding-box] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        repeatDelay,
        duration,
        ease: 'linear'
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  )
}

export const TextShimmer = React.memo(TextShimmerComponent)
