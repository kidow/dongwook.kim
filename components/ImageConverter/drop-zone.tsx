'use client'

import { useCallback, useRef, useState } from 'react'
import { UploadCloudIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/utils'
import { formatFileSize } from './convert'
import { ACCEPTED_INPUT_TYPES } from './constants'

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  maxFileCount: number
  maxFileSize: number
  acceptedFormatsLabel?: string
  accept?: string
  currentFileCount: number
}

export default function DropZone({
  onFilesSelected,
  disabled,
  maxFileCount,
  maxFileSize,
  acceptedFormatsLabel = 'JPEG, PNG, WebP, AVIF, GIF, BMP',
  accept = 'image/*',
  currentFileCount
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndEmit = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return
      const remaining = maxFileCount - currentFileCount
      if (remaining <= 0) {
        toast.warn(`최대 ${maxFileCount}개 파일만 업로드할 수 있습니다.`)
        return
      }

      const valid: File[] = []
      let invalidType = 0
      let invalidSize = 0
      // Check at most remaining*5 files to avoid iterating thousands
      const limit = Math.min(fileList.length, remaining * 5)

      for (let i = 0; i < limit && valid.length < remaining; i++) {
        const file = fileList[i]
        if (!ACCEPTED_INPUT_TYPES.includes(file.type)) {
          invalidType++
          continue
        }
        if (file.size > maxFileSize) {
          invalidSize++
          continue
        }
        valid.push(file)
      }

      if (invalidType > 0) {
        toast.error(`지원하지 않는 파일 형식 ${invalidType}개 건너뜀`)
      }
      if (invalidSize > 0) {
        toast.error(
          `${formatFileSize(maxFileSize)} 초과 파일 ${invalidSize}개 건너뜀`
        )
      }
      if (valid.length === maxFileCount && fileList.length > limit) {
        toast.warn(`최대 ${maxFileCount}개까지만 업로드됩니다.`)
      }

      if (valid.length > 0) onFilesSelected(valid)
    },
    [maxFileCount, maxFileSize, currentFileCount, onFilesSelected]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (disabled) return
      validateAndEmit(e.dataTransfer.files)
    },
    [disabled, validateAndEmit]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) setIsDragOver(true)
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateAndEmit(e.target.files)
      if (inputRef.current) inputRef.current.value = ''
    },
    [validateAndEmit]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick()
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-6 py-7 text-center transition-colors',
        isDragOver
          ? 'border-primary/50 bg-primary/5'
          : 'border-border hover:border-border/80 hover:bg-muted/30',
        disabled && 'cursor-not-allowed opacity-40'
      )}
    >
      <UploadCloudIcon
        className={cn(
          'size-8 transition-colors',
          isDragOver ? 'text-primary' : 'text-muted-foreground/60'
        )}
      />
      <p className="text-sm font-medium text-foreground/80">
        드래그하거나 클릭해서 업로드
      </p>
      <p className="text-xs text-muted-foreground">
        {acceptedFormatsLabel} &middot; 최대 {formatFileSize(maxFileSize)}
        {isFinite(maxFileCount) && <> &middot; {maxFileCount}개까지</>}
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}
