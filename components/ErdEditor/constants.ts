import type { ColumnType, ErdColumn, ErdTableData } from './types'

export const STORAGE_KEY = 'erd_editor_data'
export const STORAGE_VERSION = 1

export const COLUMN_TYPES: { value: ColumnType; label: string }[] = [
  { value: 'INT', label: 'INT' },
  { value: 'BIGINT', label: 'BIGINT' },
  { value: 'SERIAL', label: 'SERIAL' },
  { value: 'BIGSERIAL', label: 'BIGSERIAL' },
  { value: 'FLOAT', label: 'FLOAT' },
  { value: 'DECIMAL', label: 'DECIMAL' },
  { value: 'VARCHAR', label: 'VARCHAR' },
  { value: 'TEXT', label: 'TEXT' },
  { value: 'BOOLEAN', label: 'BOOLEAN' },
  { value: 'DATE', label: 'DATE' },
  { value: 'DATETIME', label: 'DATETIME' },
  { value: 'TIMESTAMP', label: 'TIMESTAMP' },
  { value: 'UUID', label: 'UUID' },
  { value: 'JSON', label: 'JSON' }
]

export const TABLE_COLORS = [
  '#3b82f6',
  '#22c55e',
  '#a855f7',
  '#ef4444',
  '#f59e0b',
  '#06b6d4',
  '#ec4899',
  '#6366f1'
]

export function createDefaultColumn(id: string): ErdColumn {
  return {
    id,
    name: '',
    type: 'VARCHAR',
    nullable: true,
    isPrimaryKey: false,
    isForeignKey: false
  }
}

export function createDefaultTable(colId: string): ErdTableData {
  return {
    name: 'new_table',
    color: TABLE_COLORS[0],
    columns: [
      {
        id: colId,
        name: 'id',
        type: 'SERIAL',
        nullable: false,
        isPrimaryKey: true,
        isForeignKey: false
      }
    ]
  }
}
