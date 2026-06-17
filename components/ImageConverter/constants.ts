import type { FormatConfig, OutputFormat } from './types'

export const DEFAULT_FORMAT: OutputFormat = 'webp'
export const DEFAULT_QUALITY = 80
export const MAX_FILE_SIZE = 20 * 1024 * 1024
export const MAX_WEBP_TO_MP4_FILE_SIZE = 50 * 1024 * 1024
export const MAX_FILE_COUNT = 20
export const ACCEPTED_INPUT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/bmp'
]

export const SUPPORTED_FORMATS: FormatConfig[] = [
  {
    id: 'jpeg',
    label: 'JPEG',
    mimeType: 'image/jpeg',
    supportsQuality: true,
    extension: '.jpg'
  },
  {
    id: 'png',
    label: 'PNG',
    mimeType: 'image/png',
    supportsQuality: false,
    extension: '.png'
  },
  {
    id: 'webp',
    label: 'WebP',
    mimeType: 'image/webp',
    supportsQuality: true,
    extension: '.webp'
  },
  {
    id: 'avif',
    label: 'AVIF',
    mimeType: 'image/avif',
    supportsQuality: true,
    extension: '.avif'
  },
  {
    id: 'mp4',
    label: 'MP4',
    mimeType: 'video/mp4',
    supportsQuality: false,
    extension: '.mp4'
  }
]
