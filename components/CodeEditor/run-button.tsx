'use client'

import { PlayIcon, RotateCcwIcon } from 'lucide-react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { Button } from '@/components/ui/button'

export default function RunButton() {
  const { dispatch } = useSandpack()

  return (
    <div className="flex items-center gap-1 border-b border-border px-3 py-2">
      <Button
        size="sm"
        className="gap-1.5"
        onClick={() => dispatch({ type: 'start' })}
      >
        <PlayIcon className="size-3.5" />
        실행
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => {
          dispatch({ type: 'refresh' })
        }}
      >
        <RotateCcwIcon className="size-3.5" />
        초기화
      </Button>
    </div>
  )
}
