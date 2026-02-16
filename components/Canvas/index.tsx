'use client'

import dynamic from 'next/dynamic'

const Whiteboard = dynamic(() => import('./whiteboard'), {
  ssr: false
})

export default function CanvasBoard() {
  return <Whiteboard />
}
