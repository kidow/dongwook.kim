'use client'

import { useCallback, useRef, useState } from 'react'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { DownloadIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from 'utils'

type ExportFormat = 'png' | 'svg'

export default function QrCodeGenerator() {
  const [url, setUrl] = useState('https://dongwook.kim')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [format, setFormat] = useState<ExportFormat>('png')
  const canvasRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<HTMLDivElement>(null)

  const downloadPng = useCallback(() => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
    toast.success('PNG 다운로드 완료')
  }, [])

  const downloadSvg = useCallback(() => {
    const svg = svgRef.current?.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svg)
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const link = document.createElement('a')
    link.download = 'qrcode.svg'
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
    toast.success('SVG 다운로드 완료')
  }, [])

  const handleDownload = useCallback(() => {
    if (format === 'png') downloadPng()
    else downloadSvg()
  }, [format, downloadPng, downloadSvg])

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">QR Code Generator</h1>
        <p className="text-sm text-muted-foreground">
          URL을 입력하면 QR코드를 실시간으로 생성합니다.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Controls */}
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              크기: {size}px
            </label>
            <Slider
              value={[size]}
              onValueChange={([v]) => setSize(v)}
              min={128}
              max={512}
              step={8}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium">전경색</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded-md border border-input p-0.5"
                />
                <Input
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium">배경색</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded-md border border-input p-0.5"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium">다운로드 포맷</label>
              <Select
                value={format}
                onValueChange={(v) => setFormat(v as ExportFormat)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleDownload} disabled={!url.trim()}>
              <DownloadIcon />
              다운로드
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-xl border border-border bg-white p-4">
            {/* Canvas for PNG download */}
            <div ref={canvasRef} className={format === 'png' ? '' : 'hidden'}>
              <QRCodeCanvas
                value={url || ' '}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level="M"
                marginSize={2}
              />
            </div>
            {/* SVG for SVG download + preview */}
            <div ref={svgRef} className={format === 'svg' ? '' : 'hidden'}>
              <QRCodeSVG
                value={url || ' '}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level="M"
                marginSize={2}
              />
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {size} x {size}px
          </span>
        </div>
      </div>
    </div>
  )
}
