'use client'

import { DownloadIcon, Loader2Icon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatFileSize } from './convert'

import type { ConvertedFile, ImageFile } from './types'

interface ImagePreviewProps {
  source: ImageFile
  result: ConvertedFile | undefined
  isConverting: boolean
  onDownload: (result: ConvertedFile) => void
  onRemove: (sourceId: string) => void
}

export default function ImagePreview({
  source,
  result,
  isConverting,
  onDownload,
  onRemove
}: ImagePreviewProps) {
  const sizeDiff = result
    ? ((result.size - source.size) / source.size) * 100
    : null

  const isVideo = result?.format === 'mp4'

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors',
        isConverting && 'animate-pulse'
      )}
    >
      <div className="relative size-14 shrink-0">
        {isVideo && result ? (
          <video
            src={result.previewUrl}
            className="size-14 rounded-md border border-border object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={source.previewUrl}
            alt={source.name}
            className="size-14 rounded-md border border-border object-cover"
          />
        )}
        {isConverting && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/70">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-snug">
          {source.name}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {source.type.split('/')[1]}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatFileSize(source.size)}
          </span>
          <span className="text-xs text-muted-foreground">
            {source.width}&times;{source.height}
          </span>

          {result && (
            <>
              <span className="text-xs text-muted-foreground">&rarr;</span>
              <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary-foreground">
                {result.format}
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatFileSize(result.size)}
              </span>
              {sizeDiff !== null && (
                <span
                  className={cn(
                    'text-xs font-semibold tabular-nums',
                    sizeDiff < 0 ? 'text-emerald-600' : 'text-red-500'
                  )}
                >
                  {sizeDiff > 0 ? '+' : ''}
                  {sizeDiff.toFixed(1)}%
                </span>
              )}
            </>
          )}

          {isConverting && (
            <span className="text-xs text-muted-foreground">변환 중...</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {result && (
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onDownload(result)}
            title="다운로드"
          >
            <DownloadIcon className="size-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
          onClick={() => onRemove(source.id)}
          title="삭제"
          disabled={isConverting}
        >
          <XIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
