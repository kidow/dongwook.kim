import type { Node, Edge } from '@xyflow/react'
import type {
  ErdTableData,
  ErdRelationshipData
} from '@/components/ErdEditor/types'

export type ErdTableNode = Node<ErdTableData>
export type ErdRelationshipEdge = Edge<ErdRelationshipData>
