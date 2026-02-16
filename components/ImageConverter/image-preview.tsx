'use client'

import { DownloadIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatFileSize } from './convert'

import type { ConvertedFile, ImageFile } from './types'

interface ImagePreviewProps {
  source: ImageFile
  result: ConvertedFile | undefined
  onDownload: (result: ConvertedFile) => void
  onRemove: (sourceId: string) => void
}

export default function ImagePreview({
  source,
  result,
  onDownload,
  onRemove
}: ImagePreviewProps) {
  const sizeDiff = result
    ? ((result.size - source.size) / source.size) * 100
    : null

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border p-3">
      <img
        src={source.previewUrl}
        alt={source.name}
        className="size-16 shrink-0 rounded-md border border-border object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{source.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-xs">
            {source.type.split('/')[1]?.toUpperCase()}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatFileSize(source.size)}
          </span>
          <span className="text-xs text-muted-foreground">
            {source.width}&times;{source.height}
          </span>
          {result && (
            <>
              <span className="text-xs text-muted-foreground">&rarr;</span>
              <Badge variant="outline" className="text-xs">
                {result.format.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatFileSize(result.size)}
              </span>
              {sizeDiff !== null && (
                <span
                  className={`text-xs font-medium ${sizeDiff < 0 ? 'text-green-600' : 'text-red-500'}`}
                >
                  {sizeDiff > 0 ? '+' : ''}
                  {sizeDiff.toFixed(1)}%
                </span>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
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
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onRemove(source.id)}
          title="삭제"
        >
          <XIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
