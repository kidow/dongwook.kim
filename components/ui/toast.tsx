'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { EventListener } from '@/utils'

export function Toast() {
  const [list, setList] = useState<NToast.Item[]>([])

  useEffect(() => {
    const listener = (event: Event) => {
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
    }

    EventListener.add('toast', listener)

    return () => {
      EventListener.remove('toast', listener)
    }
  }, [])

  if (!list.length) {
    return null
  }

  return createPortal(
    <div role="alertdialog">
      <ul className="fixed top-4 right-4 z-50 space-y-4">
        {list.map((item) => (
          <li
            key={item.id}
            onClick={() =>
              setList((prev) => prev.filter((currentItem) => currentItem.id !== item.id))
            }
            className="animate-toast-open bg-card text-card-foreground relative w-80 cursor-pointer select-none rounded-lg border border-border p-4"
            role="alert"
          >
            <button className="absolute top-2 right-2" type="button" aria-label="Close toast">
              ×
            </button>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-sm" aria-hidden>
                {item.type === 'success' && '✅'}
                {item.type === 'info' && 'ℹ️'}
                {item.type === 'warn' && '⚠️'}
                {item.type === 'error' && '⛔'}
              </span>
              <p className="text-foreground flex-1 break-keep pr-4">{item.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>,
    document.body
  )
}
