'use client'

import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react'
import type { Edge, EdgeProps } from '@xyflow/react'
import type { ErdRelationshipData } from './types'

type RelationshipEdgeType = Edge<ErdRelationshipData, 'relationship'>

export function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected
}: EdgeProps<RelationshipEdgeType>) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })

  const relType = data?.relationshipType || '1:N'
  const [sourceLabel, targetLabel] = relType.split(':')

  const sourceLabelX = sourceX + (targetX - sourceX) * 0.15
  const sourceLabelY = sourceY + (targetY - sourceY) * 0.15
  const targetLabelX = sourceX + (targetX - sourceX) * 0.85
  const targetLabelY = sourceY + (targetY - sourceY) * 0.85

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? '#3b82f6' : '#94a3b8',
          strokeWidth: selected ? 2 : 1.5
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-none absolute rounded bg-white px-1 text-[10px] font-bold text-neutral-600"
          style={{
            transform: `translate(-50%, -50%) translate(${sourceLabelX}px, ${sourceLabelY}px)`
          }}
        >
          {sourceLabel}
        </div>
        <div
          className="nodrag nopan pointer-events-none absolute rounded bg-white px-1 text-[10px] font-bold text-neutral-600"
          style={{
            transform: `translate(-50%, -50%) translate(${targetLabelX}px, ${targetLabelY}px)`
          }}
        >
          {targetLabel}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
