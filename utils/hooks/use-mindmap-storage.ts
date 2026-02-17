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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const parsed = stored ? JSON.parse(stored) : getDefaultData()
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(parsed)
      } catch {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(getDefaultData())
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoaded(true)
    }
  }, [])

  const save = useCallback((nodes: MindMapNode[], edges: MindMapEdge[]) => {
    if (typeof window !== 'undefined') {
      try {
        // Serialize only essential node properties to avoid storing React Flow internals
        const serializedNodes = nodes.map((node: any) => ({
          id: node.id || '',
          type: node.type || 'mindmapNode',
          data: node.data || { label: '', color: 'rgb(59, 130, 246)' },
          position: node.position || { x: 0, y: 0 }
        }))

        // Serialize only essential edge properties
        const serializedEdges = edges.map((edge: any) => ({
          id: edge.id || '',
          source: edge.source || '',
          target: edge.target || ''
        }))

        const data = { nodes: serializedNodes, edges: serializedEdges }
        const json = JSON.stringify(data)
        localStorage.setItem(STORAGE_KEY, json)
        setData(data)
      } catch (err) {
        console.error('Failed to save mindmap data:', err)
      }
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
