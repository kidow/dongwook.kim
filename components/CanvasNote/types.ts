export interface CanvasNoteData {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
  text: string
  zIndex: number
}

export interface CanvasViewport {
  x: number
  y: number
  zoom: number
}
