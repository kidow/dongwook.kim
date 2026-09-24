'use client'

import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Seoul'
})

export default function KstClock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()))
    tick()
    const id = setInterval(tick, 10_000)
    return () => clearInterval(id)
  }, [])

  return (
    <time
      suppressHydrationWarning
      className="shrink-0 rounded-md border border-border px-2 py-1 font-mono text-xs text-muted-foreground tabular-nums"
    >
      KST {time ?? '--:-- --'}
    </time>
  )
}
