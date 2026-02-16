'use client'

import { useState } from 'react'
import { AlertTriangleIcon, ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export default function CorsNotice() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 text-sm text-yellow-800">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-4 py-2.5"
        onClick={() => setOpen((v) => !v)}
      >
        <AlertTriangleIcon className="size-4 shrink-0" />
        <span className="font-medium">CORS 안내</span>
        <ChevronDownIcon
          className={cn(
            'ml-auto size-4 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-1 border-t border-yellow-200 px-4 py-3">
          <p>
            브라우저의 CORS 정책으로 인해 일부 API는 응답을 받을 수 없을 수
            있습니다.
          </p>
          <p>
            CORS가 허용된 API(예: JSONPlaceholder, httpbin.org) 또는 본인의
            API로 테스트해 주세요.
          </p>
        </div>
      )}
    </div>
  )
}
