'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ErdTableNode, ErdRelationshipEdge } from '@/types/erd'

const STORAGE_KEY = 'erd_editor_data'
const STORAGE_VERSION = 1

interface ErdData {
  version: number
  nodes: ErdTableNode[]
  edges: ErdRelationshipEdge[]
}

const getDefaultData = (): ErdData => ({
  version: STORAGE_VERSION,
  nodes: [],
  edges: []
})

export const useErdStorage = () => {
  const [data, setData] = useState<ErdData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.version === STORAGE_VERSION) {
            
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
    (nodes: ErdTableNode[], edges: ErdRelationshipEdge[]) => {
      if (typeof window !== 'undefined') {
        try {
          const serializedNodes = nodes.map((node: any) => ({
            id: node.id,
            type: node.type || 'tableNode',
            data: node.data,
            position: node.position || { x: 0, y: 0 }
          }))

          const serializedEdges = edges.map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle || null,
            targetHandle: edge.targetHandle || null,
            type: edge.type || 'relationship',
            data: edge.data || {}
          }))

          const payload: ErdData = {
            version: STORAGE_VERSION,
            nodes: serializedNodes,
            edges: serializedEdges
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
          setData(payload)
        } catch (err) {
          console.error('Failed to save ERD data:', err)
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
