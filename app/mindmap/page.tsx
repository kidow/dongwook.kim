'use client'

import { ReactFlowProvider } from '@xyflow/react'
import MindmapEditor from './MindmapEditor'

export default function MindmapPage() {
  return (
    <ReactFlowProvider>
      <MindmapEditor />
    </ReactFlowProvider>
  )
}
