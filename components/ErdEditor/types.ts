export type ColumnType =
  | 'INT'
  | 'BIGINT'
  | 'SERIAL'
  | 'BIGSERIAL'
  | 'VARCHAR'
  | 'TEXT'
  | 'BOOLEAN'
  | 'DATE'
  | 'DATETIME'
  | 'TIMESTAMP'
  | 'FLOAT'
  | 'DECIMAL'
  | 'UUID'
  | 'JSON'

export interface ErdColumn {
  id: string
  name: string
  type: ColumnType
  nullable: boolean
  isPrimaryKey: boolean
  isForeignKey: boolean
}

export interface ErdTableData extends Record<string, unknown> {
  name: string
  color: string
  columns: ErdColumn[]
}

export type RelationshipType = '1:1' | '1:N'

export interface ErdRelationshipData extends Record<string, unknown> {
  relationshipType: RelationshipType
  sourceColumnId: string
  targetColumnId: string
}
