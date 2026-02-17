import type { Node, Edge } from '@xyflow/react'

export interface MindMapNodeData extends Record<string, unknown> {
  label: string
  color?: string
}

export type MindMapNode = Node<MindMapNodeData>
export type MindMapEdge = Edge
