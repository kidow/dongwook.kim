'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  // @ts-ignore
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow,
  MiniMap
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { nanoid } from 'nanoid'
import { Button } from '@/components/ui/button'
import { useMindmapStorage } from '@/utils/hooks/use-mindmap-storage'
import { MindmapNode } from '@/components/Mindmap/MindmapNode'
import { Download, RotateCcw } from 'lucide-react'
import html2canvas from 'html2canvas'
import type { MindMapNode } from '@/types/mindmap'

const nodeTypes = {
  mindmapNode: MindmapNode
}

export default function MindmapEditor() {
  const { data: storageData, isLoaded, save, reset: resetStorage } = useMindmapStorage()
  const { fitView } = useReactFlow()
  const [nodes, setNodesState, onNodesChange] = useNodesState<MindMapNode>([])
  const [edges, setEdgesState, onEdgesChange] = useEdgesState<any>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Initialize nodes and edges from storage data (only on first load)
  useEffect(() => {
    if (isLoaded && storageData && nodes.length === 0) {
      const nodesToSet = storageData.nodes.map((node: any) => ({
        id: node.id,
        type: 'mindmapNode',
        data: node.data,
        position: node.position
      }))
      setNodesState(nodesToSet)
      setEdgesState(storageData.edges)
      setTimeout(() => fitView(), 100)
    }
  }, [isLoaded, storageData, nodes.length, setNodesState, setEdgesState, fitView])

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdgesState((eds) => addEdge(connection, eds))
    },
    [setEdgesState]
  )

  const handleAddChild = useCallback(
    (parentId: string) => {
      const parentNode = nodes.find((n) => n.id === parentId)
      if (!parentNode) return

      const newNodeId = nanoid()
      const newNode: MindMapNode = {
        id: newNodeId,
        type: 'mindmapNode',
        data: { label: 'New Node', color: 'rgb(59, 130, 246)' },
        position: {
          x: parentNode.position.x + 250,
          y: parentNode.position.y + 100
        }
      }

      setNodesState((nds) => [...nds, newNode])
      setEdgesState((eds: any) => [
        ...eds,
        {
          id: `e-${parentId}-${newNodeId}`,
          source: parentId,
          target: newNodeId
        }
      ])
    },
    [nodes, setNodesState, setEdgesState]
  )

  const handleExport = useCallback(async () => {
    const element = document.querySelector('.react-flow__renderer')
    if (!element) return

    try {
      const canvas = await html2canvas(element as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2
      })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `mindmap-${Date.now()}.png`
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    }
  }, [])

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset the mindmap?')) {
      resetStorage()
      setNodesState([
        {
          id: '1',
          type: 'mindmapNode',
          data: { label: 'Central Idea', color: 'rgb(59, 130, 246)' },
          position: { x: 0, y: 0 }
        }
      ])
      setEdgesState([])
    }
  }, [resetStorage, setNodesState, setEdgesState])

  const handleFitView = useCallback(() => {
    fitView()
  }, [fitView])

  // Auto-save whenever nodes or edges change (debounced)
  useEffect(() => {
    if (isLoaded && nodes.length > 0) {
      const timer = setTimeout(() => {
        save(nodes, edges)
      }, 500) // Debounce save by 500ms to avoid too frequent saves
      return () => clearTimeout(timer)
    }
  }, [nodes, edges, isLoaded, save])

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b border-border bg-card p-4 flex gap-2 items-center">
        <div className="text-sm text-muted-foreground">자동 저장됨</div>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export PNG
        </Button>
        <Button
          onClick={() => handleAddChild(selectedNode || '1')}
          variant="outline"
          size="sm"
          disabled={!nodes.length}
        >
          Add Node
        </Button>
        <Button onClick={handleFitView} variant="outline" size="sm">
          Fit View
        </Button>
        <Button onClick={handleReset} variant="destructive" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_event: any, node: any) => setSelectedNode(node.id)}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  )
}
