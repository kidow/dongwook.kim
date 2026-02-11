'use client'

import { memo } from 'react'

function BackTopV1() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border"
      aria-label="Back to top"
      type="button"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  )
}

export default memo(BackTopV1)
