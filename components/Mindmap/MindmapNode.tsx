'use client'

import { useCallback, useState } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import { X, Plus, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { nanoid } from 'nanoid'
import type { MindMapNodeData } from '@/types/mindmap'
import type { MindMapNode } from '@/types/mindmap'

interface MindmapNodeProps {
  id: string
  data: MindMapNodeData
  isConnecting?: boolean
}

const COLORS = [
  'rgb(59, 130, 246)',
  'rgb(34, 197, 94)',
  'rgb(168, 85, 247)',
  'rgb(239, 68, 68)',
  'rgb(245, 158, 11)',
  'rgb(14, 165, 233)',
  'rgb(236, 72, 153)'
]

export function MindmapNode({ id, data }: MindmapNodeProps) {
  const { getNode, setNodes, setEdges } = useReactFlow()
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState(data.label)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleSave = useCallback(() => {
    setNodes((nds: any) =>
      nds.map((node: any) =>
        node.id === id ? { ...node, data: { ...data, label: editLabel } } : node
      )
    )
    setIsEditing(false)
  }, [editLabel, data, id, setNodes])

  const handleColorChange = (color: string) => {
    setNodes((nds: any) =>
      nds.map((node: any) =>
        node.id === id ? { ...node, data: { ...data, color } } : node
      )
    )
    setShowColorPicker(false)
  }

  const handleDelete = useCallback(() => {
    setNodes((nds: any) => nds.filter((n: any) => n.id !== id))
    setEdges((eds: any) =>
      eds.filter((e: any) => e.source !== id && e.target !== id)
    )
  }, [id, setNodes, setEdges])

  const handleAddChild = useCallback(() => {
    const parentNode = getNode(id)
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

    setNodes((nds: any) => [...nds, newNode])
    setEdges((eds: any) => [
      ...eds,
      {
        id: `e-${id}-${newNodeId}`,
        source: id,
        target: newNodeId
      }
    ])
  }, [id, getNode, setNodes, setEdges])

  const bgColor = data.color || 'rgb(59, 130, 246)'

  return (
    <div
      className="relative rounded-lg border-2 p-3 shadow-md bg-white"
      style={{ borderColor: bgColor }}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Handle type="target" position={Position.Top} />

      <div className="flex flex-col gap-2 min-w-[150px]">
        {isEditing ? (
          <div className="flex gap-1">
            <Input
              autoFocus
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              className="h-7 text-sm"
            />
          </div>
        ) : (
          <div
            className="text-sm font-medium cursor-pointer px-2 py-1 rounded"
            style={{ color: bgColor }}
          >
            {data.label}
          </div>
        )}

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={handleAddChild}
            title="Add child node"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Change color"
          >
            <Palette className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:text-red-500"
            onClick={handleDelete}
            title="Delete node"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {showColorPicker && (
          <div className="flex flex-wrap gap-1 mt-1">
            {COLORS.map((color) => (
              <button
                key={color}
                className="w-5 h-5 rounded border-2"
                style={{
                  backgroundColor: color,
                  borderColor: data.color === color ? '#000' : '#ddd'
                }}
                onClick={() => handleColorChange(color)}
                title="Select color"
              />
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
