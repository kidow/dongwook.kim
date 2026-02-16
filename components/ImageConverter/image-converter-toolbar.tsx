'use client'

import {
  DownloadIcon,
  RefreshCwIcon,
  Trash2Icon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { SUPPORTED_FORMATS } from './constants'

import type { OutputFormat } from './types'

interface ImageConverterToolbarProps {
  outputFormat: OutputFormat
  quality: number
  isConverting: boolean
  fileCount: number
  resultCount: number
  avifSupported: boolean
  onFormatChange: (format: OutputFormat) => void
  onQualityChange: (quality: number) => void
  onConvert: () => void
  onDownloadAll: () => void
  onClearAll: () => void
}

export default function ImageConverterToolbar({
  outputFormat,
  quality,
  isConverting,
  fileCount,
  resultCount,
  avifSupported,
  onFormatChange,
  onQualityChange,
  onConvert,
  onDownloadAll,
  onClearAll
}: ImageConverterToolbarProps) {
  const currentFormat = SUPPORTED_FORMATS.find((f) => f.id === outputFormat)
  const qualityDisabled = !currentFormat?.supportsQuality

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={outputFormat} onValueChange={onFormatChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="포맷 선택" />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_FORMATS.map((f) => (
            <SelectItem
              key={f.id}
              value={f.id}
              disabled={f.id === 'avif' && !avifSupported}
            >
              {f.label}
              {f.id === 'avif' && !avifSupported ? ' (미지원)' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">품질</span>
        <Slider
          className="w-24"
          min={1}
          max={100}
          step={1}
          value={[quality]}
          disabled={qualityDisabled}
          onValueChange={(v) => onQualityChange(v[0])}
        />
        <span className="w-8 text-xs tabular-nums text-muted-foreground">
          {qualityDisabled ? '-' : `${quality}%`}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={fileCount === 0 || isConverting}
          onClick={onConvert}
        >
          <RefreshCwIcon className="mr-1 size-4" />
          변환
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={resultCount === 0 || isConverting}
          onClick={onDownloadAll}
        >
          <DownloadIcon className="mr-1 size-4" />
          모두 저장
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-9"
          disabled={fileCount === 0 || isConverting}
          onClick={onClearAll}
          title="전체 삭제"
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
