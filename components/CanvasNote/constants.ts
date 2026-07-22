import type { CanvasNoteData, CanvasViewport } from './types'

export const STORAGE_KEY = 'canvas_note_data'
export const STORAGE_VERSION = 1

export const NOTE_COLORS = ['#fef3c7', '#e0e7ff', '#ffe4e6', '#dcfce7'] as const

export const DEFAULT_NOTE_WIDTH = 200
export const DEFAULT_NOTE_HEIGHT = 160
export const MIN_NOTE_WIDTH = 140
export const MIN_NOTE_HEIGHT = 100

export const ZOOM_MIN = 0.25
export const ZOOM_MAX = 2
export const ZOOM_STEP = 0.1

export const DEFAULT_VIEWPORT: CanvasViewport = { x: 0, y: 0, zoom: 1 }

export function createDefaultNote(
  id: string,
  x: number,
  y: number,
  color: string,
  zIndex: number
): CanvasNoteData {
  return {
    id,
    x,
    y,
    width: DEFAULT_NOTE_WIDTH,
    height: DEFAULT_NOTE_HEIGHT,
    color,
    text: '',
    zIndex
  }
}
