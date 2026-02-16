'use client'

import { useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import {
  Excalidraw,
  exportToBlob,
  exportToSvg,
  serializeAsJSON
} from '@excalidraw/excalidraw'
import { ArrowLeftIcon, DownloadIcon, EraserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils'

import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI
} from '@excalidraw/excalidraw/types'
import type { ComponentProps } from 'react'

const STORAGE_KEY = 'canvas-excalidraw-scene-v1'
type OnChangeElements = Parameters<
  NonNullable<ComponentProps<typeof Excalidraw>['onChange']>
>[0]

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function getExportFilename(extension: 'png' | 'svg') {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
  return `canvas-${stamp}.${extension}`
}

function hasDrawableElements(
  elements: OnChangeElements
) {
  return elements.some((element) => !element.isDeleted)
}

export default function Whiteboard() {
  const excalidrawApiRef = useRef<ExcalidrawImperativeAPI | null>(null)
  const saveTimerRef = useRef<number | null>(null)

  const initialData = useMemo(() => {
    if (typeof window === 'undefined') return null

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [])

  const handleChange = useCallback(
    (
      elements: OnChangeElements,
      appState: AppState,
      files: BinaryFiles
    ) => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current)
      }

      saveTimerRef.current = window.setTimeout(() => {
        const scene = serializeAsJSON(elements, appState, files, 'local')
        window.localStorage.setItem(STORAGE_KEY, scene)
      }, 250)
    },
    []
  )

  const handleClear = useCallback(() => {
    const api = excalidrawApiRef.current
    if (!api) return

    api.updateScene({ elements: [] })
    api.history.clear()
    window.localStorage.removeItem(STORAGE_KEY)
    toast.success('캔버스를 초기화했습니다.')
  }, [])

  const handleExportPng = useCallback(async () => {
    const api = excalidrawApiRef.current
    if (!api) return

    const elements = api.getSceneElements()
    if (!hasDrawableElements(elements)) {
      toast.warn('내보낼 요소가 없습니다.')
      return
    }

    try {
      const blob = await exportToBlob({
        elements,
        appState: {
          ...api.getAppState(),
          exportBackground: true
        },
        files: api.getFiles(),
        mimeType: 'image/png'
      })

      downloadBlob(blob, getExportFilename('png'))
      toast.success('PNG 파일을 저장했습니다.')
    } catch {
      toast.error('PNG 내보내기에 실패했습니다.')
    }
  }, [])

  const handleExportSvg = useCallback(async () => {
    const api = excalidrawApiRef.current
    if (!api) return

    const elements = api.getSceneElements()
    if (!hasDrawableElements(elements)) {
      toast.warn('내보낼 요소가 없습니다.')
      return
    }

    try {
      const svg = await exportToSvg({
        elements,
        appState: {
          ...api.getAppState(),
          exportBackground: true
        },
        files: api.getFiles()
      })

      const serializedSvg = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([serializedSvg], {
        type: 'image/svg+xml;charset=utf-8'
      })

      downloadBlob(blob, getExportFilename('svg'))
      toast.success('SVG 파일을 저장했습니다.')
    } catch {
      toast.error('SVG 내보내기에 실패했습니다.')
    }
  }, [])

  return (
    <section
      data-canvas-page="true"
      className="fixed inset-0 z-50 flex flex-col bg-stone-50"
    >
      <div className="border-b border-border bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeftIcon className="mr-1 size-4" />
              홈으로
            </Link>
          </Button>
          <div className="text-sm font-medium">Canvas (Excalidraw)</div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={handleClear}>
              <EraserIcon className="mr-1 size-4" />
              전체 지우기
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPng}>
              <DownloadIcon className="mr-1 size-4" />
              PNG
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportSvg}>
              <DownloadIcon className="mr-1 size-4" />
              SVG
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 xl:p-4">
        <div className="mx-auto h-full w-full max-w-7xl overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <Excalidraw
            initialData={initialData}
            onChange={handleChange}
            excalidrawAPI={(api) => {
              excalidrawApiRef.current = api
            }}
            theme="light"
            gridModeEnabled
          />
        </div>
      </div>
    </section>
  )
}
