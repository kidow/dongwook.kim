'use client'

import { useCallback, useState } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import { Plus, Trash2, Key, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { nanoid } from 'nanoid'
import { COLUMN_TYPES, createDefaultColumn } from './constants'
import type { ErdTableData, ErdColumn, ColumnType } from './types'

interface TableNodeProps {
  id: string
  data: ErdTableData
  selected?: boolean
}

export function TableNode({ id, data, selected }: TableNodeProps) {
  const { setNodes, setEdges } = useReactFlow()
  const [editingName, setEditingName] = useState(false)
  const [tableName, setTableName] = useState(data.name)
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null)

  const handleSaveTableName = useCallback(() => {
    setNodes((nds: any) =>
      nds.map((node: any) =>
        node.id === id
          ? { ...node, data: { ...node.data, name: tableName } }
          : node
      )
    )
    setEditingName(false)
  }, [id, tableName, setNodes])

  const updateColumn = useCallback(
    (columnId: string, updates: Partial<ErdColumn>) => {
      setNodes((nds: any) =>
        nds.map((node: any) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  columns: node.data.columns.map((col: ErdColumn) =>
                    col.id === columnId ? { ...col, ...updates } : col
                  )
                }
              }
            : node
        )
      )
    },
    [id, setNodes]
  )

  const addColumn = useCallback(() => {
    const newCol = createDefaultColumn(nanoid())
    setNodes((nds: any) =>
      nds.map((node: any) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                columns: [...node.data.columns, newCol]
              }
            }
          : node
      )
    )
    setEditingColumnId(newCol.id)
  }, [id, setNodes])

  const deleteColumn = useCallback(
    (columnId: string) => {
      setNodes((nds: any) =>
        nds.map((node: any) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  columns: node.data.columns.filter(
                    (col: ErdColumn) => col.id !== columnId
                  )
                }
              }
            : node
        )
      )
      setEdges((eds: any) =>
        eds.filter(
          (e: any) =>
            e.sourceHandle !== `${id}-${columnId}-right` &&
            e.targetHandle !== `${id}-${columnId}-left`
        )
      )
    },
    [id, setNodes, setEdges]
  )

  const deleteTable = useCallback(() => {
    setNodes((nds: any) => nds.filter((n: any) => n.id !== id))
    setEdges((eds: any) =>
      eds.filter((e: any) => e.source !== id && e.target !== id)
    )
  }, [id, setNodes, setEdges])

  return (
    <div
      className={cn(
        'min-w-[280px] select-none rounded-lg border-2 bg-white shadow-md',
        selected ? 'border-blue-500 shadow-lg' : 'border-border'
      )}
    >
      {/* Table Header */}
      <div
        className="flex items-center justify-between rounded-t-md px-3 py-2"
        style={{
          backgroundColor: data.color + '20',
          borderBottom: `2px solid ${data.color}`
        }}
        onDoubleClick={() => setEditingName(true)}
      >
        {editingName ? (
          <Input
            autoFocus
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTableName()
              if (e.key === 'Escape') {
                setTableName(data.name)
                setEditingName(false)
              }
            }}
            onBlur={handleSaveTableName}
            className="h-6 text-sm font-bold"
          />
        ) : (
          <span className="text-sm font-bold" style={{ color: data.color }}>
            {data.name}
          </span>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:text-red-500"
          onClick={deleteTable}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Columns */}
      <div className="divide-y divide-border">
        {data.columns.map((column) => (
          <ColumnRow
            key={column.id}
            nodeId={id}
            column={column}
            isEditing={editingColumnId === column.id}
            onStartEdit={() => setEditingColumnId(column.id)}
            onStopEdit={() => setEditingColumnId(null)}
            onUpdate={(updates) => updateColumn(column.id, updates)}
            onDelete={() => deleteColumn(column.id)}
          />
        ))}
      </div>

      {/* Add Column Button */}
      <div className="p-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-full text-xs text-muted-foreground"
          onClick={addColumn}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Column
        </Button>
      </div>
    </div>
  )
}

interface ColumnRowProps {
  nodeId: string
  column: ErdColumn
  isEditing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
  onUpdate: (updates: Partial<ErdColumn>) => void
  onDelete: () => void
}

function ColumnRow({
  nodeId,
  column,
  isEditing,
  onStartEdit,
  onStopEdit,
  onUpdate,
  onDelete
}: ColumnRowProps) {
  const [colName, setColName] = useState(column.name)

  const handleSaveName = () => {
    onUpdate({ name: colName })
    onStopEdit()
  }

  return (
    <div className="group relative flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-neutral-50">
      {/* Left handle (target) */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${nodeId}-${column.id}-left`}
        className="!h-2 !w-2 !border-white !bg-neutral-400"
        style={{ left: -4 }}
      />

      {/* PK indicator */}
      {column.isPrimaryKey ? (
        <Key className="h-3 w-3 shrink-0 text-amber-500" />
      ) : (
        <Circle className="h-3 w-3 shrink-0 text-neutral-300" />
      )}

      {/* Column name */}
      {isEditing ? (
        <Input
          autoFocus
          value={colName}
          onChange={(e) => setColName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveName()
            if (e.key === 'Escape') onStopEdit()
          }}
          onBlur={handleSaveName}
          className="h-5 min-w-0 flex-1 text-xs"
        />
      ) : (
        <span
          className="min-w-0 flex-1 cursor-pointer truncate"
          onDoubleClick={onStartEdit}
        >
          {column.name || '(unnamed)'}
        </span>
      )}

      {/* Type dropdown */}
      <Select
        value={column.type}
        onValueChange={(val) => onUpdate({ type: val as ColumnType })}
      >
        <SelectTrigger className="nodrag nopan h-5 w-auto min-w-[70px] border-none bg-neutral-100 px-1.5 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COLUMN_TYPES.map((ct) => (
            <SelectItem key={ct.value} value={ct.value} className="text-xs">
              {ct.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Nullable toggle */}
      <button
        className={cn(
          'nodrag nopan rounded px-1 text-[10px]',
          column.nullable
            ? 'text-neutral-400'
            : 'bg-orange-50 font-bold text-orange-600'
        )}
        onClick={() => onUpdate({ nullable: !column.nullable })}
        title={column.nullable ? 'Nullable' : 'NOT NULL'}
      >
        {column.nullable ? 'NULL' : 'NN'}
      </button>

      {/* PK toggle */}
      <button
        className={cn(
          'nodrag nopan rounded px-1 text-[10px]',
          column.isPrimaryKey
            ? 'bg-amber-50 font-bold text-amber-600'
            : 'text-neutral-300 hover:text-neutral-500'
        )}
        onClick={() => onUpdate({ isPrimaryKey: !column.isPrimaryKey })}
        title="Primary Key"
      >
        PK
      </button>

      {/* Delete column */}
      <Button
        size="sm"
        variant="ghost"
        className="nodrag nopan h-4 w-4 p-0 opacity-0 hover:text-red-500 group-hover:opacity-100"
        onClick={onDelete}
      >
        <Trash2 className="h-2.5 w-2.5" />
      </Button>

      {/* Right handle (source) */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${nodeId}-${column.id}-right`}
        className="!h-2 !w-2 !border-white !bg-neutral-400"
        style={{ right: -4 }}
      />
    </div>
  )
}
