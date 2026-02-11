'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { EventListener } from '@/shared/utils'

function ToastV2() {
  const [list, setList] = useState<NToast.Item[]>([])

  const listener = useCallback((event: Event) => {
    const payload = (event as CustomEvent<NToast.Emit>).detail

    if (!payload) {
      return
    }

    setList((prev) => [
      ...prev,
      {
        id: Math.random().toString().slice(2),
        message: payload.message,
        type: payload.type
      }
    ])
  }, [])

  useEffect(() => {
    EventListener.once('toast', listener)
  }, [listener])

  if (!list.length) {
    return null
  }

  return createPortal(
    <div role="alertdialog">
      <ul className="fixed right-4 top-4 z-50 space-y-4">
        {list.map((item, index) => (
          <li
            key={item.id}
            onClick={() =>
              setList((prev) => [
                ...prev.slice(0, index),
                ...prev.slice(index + 1)
              ])
            }
            className="animate-toast-open relative w-80 cursor-pointer select-none rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            role="alert"
          >
            <button className="absolute right-2 top-2" type="button" aria-label="Close toast">
              ×
            </button>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-sm" aria-hidden>
                {item.type === 'success' && '✅'}
                {item.type === 'info' && 'ℹ️'}
                {item.type === 'warn' && '⚠️'}
                {item.type === 'error' && '⛔'}
              </span>
              <p className="flex-1 break-keep pr-4 text-neutral-900 dark:text-neutral-200">
                {item.message}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>,
    document.body
  )
}

export default ToastV2
