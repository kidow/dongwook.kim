'use client'

import dynamic from 'next/dynamic'

// Constant-folded at build time, so production bundles drop the import entirely.
const Agentation =
  process.env.NODE_ENV === 'development'
    ? dynamic(() => import('agentation').then((m) => m.Agentation), {
        ssr: false
      })
    : () => null

export default function DevTools() {
  return <Agentation />
}
