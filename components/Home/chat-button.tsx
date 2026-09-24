'use client'

import { useEffect, useRef } from 'react'
import { MessageCircleIcon } from '@animateicons/react/lucide'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring
} from 'motion/react'

import { Button } from '@/components/ui/button'
import { CRISP_WEBSITE_ID, openCrisp, preloadCrispWhenIdle } from './crisp'
import { useIconAnimation } from './use-icon-animation'

// How far outside the button the pull starts, and how strongly it follows.
const MAGNET_RADIUS = 60
const MAGNET_STRENGTH = 0.24
const SPRING = { stiffness: 250, damping: 18, mass: 0.4 }

/** Pulls the element toward the pointer while it is nearby (fine pointers only). */
function useMagnet() {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const x = useSpring(useMotionValue(0), SPRING)
  const y = useSpring(useMotionValue(0), SPRING)

  useEffect(() => {
    if (reduceMotion || !matchMedia('(pointer: fine)').matches) return

    const onMove = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const reach = Math.max(r.width, r.height) / 2 + MAGNET_RADIUS
      const k = Math.max(0, 1 - Math.hypot(dx, dy) / reach)
      x.set(dx * MAGNET_STRENGTH * k)
      y.set(dy * MAGNET_STRENGTH * k)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduceMotion, x, y])

  return { ref, style: { x, y } }
}

export default function ChatButton() {
  const { ref: iconRef, handlers } = useIconAnimation()
  const magnet = useMagnet()

  useEffect(() => {
    preloadCrispWhenIdle()
  }, [])

  if (!CRISP_WEBSITE_ID) return null

  return (
    <motion.span ref={magnet.ref} style={magnet.style} className="inline-flex">
      <Button
        variant="outline"
        size="sm"
        className="pointer-coarse:h-11"
        onClick={openCrisp}
        {...handlers}
      >
        <MessageCircleIcon ref={iconRef} size={16} aria-hidden />
        Chat
      </Button>
    </motion.span>
  )
}
