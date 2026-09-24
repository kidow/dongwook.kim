'use client'

import Image from 'next/image'
import { useReducedMotion } from 'motion/react'
import Atropos from 'atropos/react'

export default function Avatar() {
  // Atropos has no reduced-motion handling of its own.
  const reduceMotion = useReducedMotion()

  return (
    <Atropos
      className="size-20 shrink-0 sm:size-[88px]"
      innerClassName="rounded-[14px]"
      rotate={!reduceMotion}
      highlight={!reduceMotion}
      rotateXMax={12}
      rotateYMax={12}
      rotateTouch="scroll-y"
    >
      <Image
        src="/logo.jpg"
        alt="kidow profile photo"
        width={88}
        height={88}
        priority
        className="size-full object-cover"
      />
    </Atropos>
  )
}
