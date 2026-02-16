export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif'

export interface FormatConfig {
  id: OutputFormat
  label: string
  mimeType: string
  supportsQuality: boolean
  extension: string
}

export interface ImageFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  previewUrl: string
  width: number
  height: number
}

export interface ConvertedFile {
  sourceId: string
  blob: Blob
  previewUrl: string
  size: number
  format: OutputFormat
  quality: number
}
