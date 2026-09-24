'use client'

import { useEffect, useState } from 'react'
import { MessageCircleIcon } from '@animateicons/react/lucide'

import { Button } from '@/components/ui/button'
import {
  CRISP_WEBSITE_ID,
  openCrisp,
  preloadCrispWhenIdle,
  subscribeAvailability
} from './crisp'
import { useIconAnimation } from './use-icon-animation'

export default function ChatButton() {
  const { ref, handlers } = useIconAnimation()
  const [online, setOnline] = useState(false)

  useEffect(() => {
    preloadCrispWhenIdle()
    return subscribeAvailability(setOnline)
  }, [])

  if (!CRISP_WEBSITE_ID) return null

  return (
    <Button
      variant="outline"
      size="sm"
      className="relative pointer-coarse:h-11 active:scale-[0.97] motion-reduce:active:scale-100"
      onClick={openCrisp}
      {...handlers}
    >
      <MessageCircleIcon ref={ref} size={16} aria-hidden />
      Chat
      {online && (
        <>
          <span
            aria-hidden
            className="absolute -right-1 -top-1 size-2.5 rounded-full bg-green-500 ring-2 ring-background"
          />
          <span className="sr-only"> (online)</span>
        </>
      )}
    </Button>
  )
}
