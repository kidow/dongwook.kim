'use client'

import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { X, Plus, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { COLUMN_TYPES, TABLE_COLORS, createDefaultColumn } from './constants'
import type { ErdTableData, ErdColumn, ColumnType } from './types'

interface TableSidebarProps {
  nodeId: string
  data: ErdTableData
  onClose: () => void
}

export function TableSidebar({ nodeId, data, onClose }: TableSidebarProps) {
  const { setNodes, setEdges } = useReactFlow()

  const updateTableData = useCallback(
    (updates: Partial<ErdTableData>) => {
      setNodes((nds: any) =>
        nds.map((node: any) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      )
    },
    [nodeId, setNodes]
  )

  const updateColumn = useCallback(
    (columnId: string, updates: Partial<ErdColumn>) => {
      setNodes((nds: any) =>
        nds.map((node: any) =>
          node.id === nodeId
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
    [nodeId, setNodes]
  )

  const addColumn = useCallback(() => {
    const newCol = createDefaultColumn(nanoid())
    updateTableData({
      columns: [...data.columns, newCol]
    })
  }, [data.columns, updateTableData])

  const deleteColumn = useCallback(
    (columnId: string) => {
      updateTableData({
        columns: data.columns.filter((c) => c.id !== columnId)
      })
      setEdges((eds: any) =>
        eds.filter(
          (e: any) =>
            e.sourceHandle !== `${nodeId}-${columnId}-right` &&
            e.targetHandle !== `${nodeId}-${columnId}-left`
        )
      )
    },
    [nodeId, data.columns, updateTableData, setEdges]
  )

  return (
    <div className="h-full w-72 overflow-y-auto border-l border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Table Properties</h3>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Table Name */}
      <div className="mb-4 space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Table Name
        </label>
        <Input
          value={data.name}
          onChange={(e) => updateTableData({ name: e.target.value })}
          className="h-8 text-sm"
        />
      </div>

      {/* Color */}
      <div className="mb-4 space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Color
        </label>
        <div className="flex gap-1.5">
          {TABLE_COLORS.map((color) => (
            <button
              key={color}
              className="h-5 w-5 rounded-full border-2"
              style={{
                backgroundColor: color,
                borderColor: data.color === color ? '#000' : '#ddd'
              }}
              onClick={() => updateTableData({ color })}
            />
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">
            Columns
          </label>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs"
            onClick={addColumn}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {data.columns.map((col) => (
            <div
              key={col.id}
              className="space-y-1.5 rounded border border-border p-2"
            >
              <div className="flex items-center gap-1">
                <Input
                  value={col.name}
                  onChange={(e) =>
                    updateColumn(col.id, { name: e.target.value })
                  }
                  className="h-6 flex-1 text-xs"
                  placeholder="Column name"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:text-red-500"
                  onClick={() => deleteColumn(col.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Select
                value={col.type}
                onValueChange={(val) =>
                  updateColumn(col.id, { type: val as ColumnType })
                }
              >
                <SelectTrigger className="h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLUMN_TYPES.map((ct) => (
                    <SelectItem
                      key={ct.value}
                      value={ct.value}
                      className="text-xs"
                    >
                      {ct.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Badge
                  variant={col.isPrimaryKey ? 'default' : 'outline'}
                  className="cursor-pointer text-[10px]"
                  onClick={() =>
                    updateColumn(col.id, {
                      isPrimaryKey: !col.isPrimaryKey
                    })
                  }
                >
                  PK
                </Badge>
                <Badge
                  variant={!col.nullable ? 'secondary' : 'outline'}
                  className="cursor-pointer text-[10px]"
                  onClick={() =>
                    updateColumn(col.id, { nullable: !col.nullable })
                  }
                >
                  {col.nullable ? 'NULL' : 'NOT NULL'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
