'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_VIEWPORT,
  STORAGE_KEY,
  STORAGE_VERSION
} from '@/components/CanvasNote/constants'
import type { CanvasNoteData, CanvasViewport } from '@/components/CanvasNote/types'

interface CanvasNoteStorageData {
  version: number
  notes: CanvasNoteData[]
  viewport: CanvasViewport
}

const getDefaultData = (): CanvasNoteStorageData => ({
  version: STORAGE_VERSION,
  notes: [],
  viewport: DEFAULT_VIEWPORT
})

export const useCanvasNoteStorage = () => {
  const [data, setData] = useState<CanvasNoteStorageData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.version === STORAGE_VERSION) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setData(parsed)
          } else {
            setData(getDefaultData())
          }
        } else {
          setData(getDefaultData())
        }
      } catch {
        setData(getDefaultData())
      }

      setIsLoaded(true)
    }
  }, [])

  const save = useCallback(
    (notes: CanvasNoteData[], viewport: CanvasViewport) => {
      if (typeof window !== 'undefined') {
        try {
          const payload: CanvasNoteStorageData = {
            version: STORAGE_VERSION,
            notes,
            viewport
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
          setData(payload)
        } catch (err) {
          console.error('Failed to save canvas note data:', err)
        }
      }
    },
    []
  )

  const reset = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      setData(getDefaultData())
    }
  }, [])

  return { data, isLoaded, save, reset }
}
