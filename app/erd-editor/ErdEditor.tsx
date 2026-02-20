'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  // @ts-ignore
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow
} from '@xyflow/react'
import type { Connection } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { nanoid } from 'nanoid'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  ArrowLeftIcon,
  Download,
  RotateCcw,
  Plus,
  Maximize
} from 'lucide-react'
import html2canvas from 'html2canvas'
import { useErdStorage } from '@/utils/hooks/use-erd-storage'
import { TableNode } from '@/components/ErdEditor/table-node'
import { RelationshipEdge } from '@/components/ErdEditor/relationship-edge'
import { TableSidebar } from '@/components/ErdEditor/table-sidebar'
import {
  createDefaultTable,
  TABLE_COLORS
} from '@/components/ErdEditor/constants'
import type { ErdTableNode, ErdRelationshipEdge } from '@/types/erd'
import type {
  ErdTableData,
  RelationshipType
} from '@/components/ErdEditor/types'

const nodeTypes = {
  tableNode: TableNode
}

const edgeTypes = {
  relationship: RelationshipEdge
}

function ErdEditorInner() {
  const {
    data: storageData,
    isLoaded,
    save,
    reset: resetStorage
  } = useErdStorage()
  const { fitView } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState<ErdTableNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<ErdRelationshipEdge>(
    []
  )
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [relationshipType, setRelationshipType] =
    useState<RelationshipType>('1:N')

  // Initialize from storage
  useEffect(() => {
    if (
      isLoaded &&
      storageData &&
      nodes.length === 0 &&
      storageData.nodes.length > 0
    ) {
      const restoredNodes = storageData.nodes.map((node: any) => ({
        id: node.id,
        type: 'tableNode',
        data: node.data,
        position: node.position
      }))
      setNodes(restoredNodes)
      setEdges(
        storageData.edges.map((edge: any) => ({
          ...edge,
          type: 'relationship'
        }))
      )
      setTimeout(() => fitView(), 100)
    }
  }, [isLoaded, storageData, nodes.length, setNodes, setEdges, fitView])

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.sourceHandle || !connection.targetHandle) return

      const sourceParts = connection.sourceHandle.split('-')
      const targetParts = connection.targetHandle.split('-')
      const sourceColumnId = sourceParts.slice(1, -1).join('-')
      const targetColumnId = targetParts.slice(1, -1).join('-')

      const newEdge = {
        id: `e-${nanoid()}`,
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: 'relationship' as const,
        data: {
          relationshipType,
          sourceColumnId,
          targetColumnId
        }
      }

      setEdges((eds) => [...eds, newEdge])
    },
    [relationshipType, setEdges]
  )

  const handleAddTable = useCallback(() => {
    const newNodeId = nanoid()
    const colId = nanoid()
    const tableData = createDefaultTable(colId)
    tableData.color = TABLE_COLORS[nodes.length % TABLE_COLORS.length]

    const newNode: ErdTableNode = {
      id: newNodeId,
      type: 'tableNode',
      data: tableData,
      position: {
        x: 100 + (nodes.length % 4) * 320,
        y: 100 + Math.floor(nodes.length / 4) * 300
      }
    }

    setNodes((nds) => [...nds, newNode])
  }, [nodes.length, setNodes])

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
      link.download = `erd-${Date.now()}.png`
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    }
  }, [])

  const handleReset = useCallback(() => {
    if (confirm('모든 테이블과 관계를 삭제하시겠습니까?')) {
      resetStorage()
      setNodes([])
      setEdges([])
      setSelectedNodeId(null)
    }
  }, [resetStorage, setNodes, setEdges])

  const handleFitView = useCallback(() => {
    fitView()
  }, [fitView])

  // Auto-save (debounced 500ms)
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        save(nodes, edges)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [nodes, edges, isLoaded, save])

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  return (
    <section className="fixed inset-0 z-50 flex flex-col bg-stone-50">
      <div className="border-b border-border bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeftIcon className="mr-1 size-4" />
              홈으로
            </Link>
          </Button>
          <div className="text-sm font-medium">ERD Editor</div>
          <div className="ml-auto text-xs text-muted-foreground">
            {nodes.length > 0
              ? `${nodes.length} table${nodes.length > 1 ? 's' : ''} | 자동 저장됨`
              : 'Add Table로 시작하세요'}
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 xl:p-4">
        <div className="mx-auto flex h-full w-full max-w-7xl overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="flex flex-1 flex-col">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card p-3">
              <Button onClick={handleAddTable} variant="outline" size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Table
              </Button>

              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  Relationship:
                </span>
                <Select
                  value={relationshipType}
                  onValueChange={(val) =>
                    setRelationshipType(val as RelationshipType)
                  }
                >
                  <SelectTrigger className="h-8 w-[80px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="1:N">1:N</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-4 w-px bg-border" />

              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" />
                Export PNG
              </Button>
              <Button onClick={handleFitView} variant="outline" size="sm">
                <Maximize className="mr-1 h-4 w-4" />
                Fit View
              </Button>
              <Button onClick={handleReset} variant="destructive" size="sm">
                <RotateCcw className="mr-1 h-4 w-4" />
                Reset
              </Button>
            </div>

            {/* Canvas */}
            <div className="relative flex-1">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeClick={(_event: any, node: any) =>
                  setSelectedNodeId(node.id)
                }
                onPaneClick={() => setSelectedNodeId(null)}
                fitView
                defaultEdgeOptions={{
                  type: 'relationship'
                }}
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </div>

          {/* Sidebar */}
          {selectedNode && (
            <TableSidebar
              nodeId={selectedNode.id}
              data={selectedNode.data as ErdTableData}
              onClose={() => setSelectedNodeId(null)}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default function ErdEditor() {
  return (
    <ReactFlowProvider>
      <ErdEditorInner />
    </ReactFlowProvider>
  )
}
