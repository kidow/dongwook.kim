'use client'

import { useCallback, useEffect, useState } from 'react'
import type { MindMapEdge, MindMapNode } from '@/types/mindmap'

const STORAGE_KEY = 'mindmap_data'

interface MindMapData {
  nodes: MindMapNode[]
  edges: MindMapEdge[]
}

const getDefaultData = (): MindMapData => ({
  nodes: [
    {
      id: '1',
      data: { label: 'Central Idea', color: 'rgb(59, 130, 246)' },
      position: { x: 0, y: 0 }
    }
  ],
  edges: []
})

export const useMindmapStorage = () => {
  const [data, setData] = useState<MindMapData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const parsed = stored ? JSON.parse(stored) : getDefaultData()
        setData(parsed)
      } catch {
        setData(getDefaultData())
      }
      setIsLoaded(true)
    }
  }, [])

  const save = useCallback((nodes: MindMapNode[], edges: MindMapEdge[]) => {
    if (typeof window !== 'undefined') {
      const data = { nodes, edges }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setData(data)
    }
  }, [])

  const reset = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      setData(getDefaultData())
    }
  }, [])

  return {
    data,
    isLoaded,
    save,
    reset
  }
}
