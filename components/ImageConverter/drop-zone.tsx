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
  currentFileCount: number
}

export default function DropZone({
  onFilesSelected,
  disabled,
  maxFileCount,
  maxFileSize,
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
      for (let i = 0; i < fileList.length && valid.length < remaining; i++) {
        const file = fileList[i]
        if (!ACCEPTED_INPUT_TYPES.includes(file.type)) {
          toast.error(`지원하지 않는 파일 형식입니다: ${file.name}`)
          continue
        }
        if (file.size > maxFileSize) {
          toast.error(
            `파일 크기가 ${formatFileSize(maxFileSize)}를 초과합니다: ${file.name}`
          )
          continue
        }
        valid.push(file)
      }

      if (
        fileList.length > remaining + (fileList.length - valid.length) &&
        valid.length === remaining
      ) {
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
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors',
        isDragOver
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-muted-foreground',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <UploadCloudIcon className="size-10 text-muted-foreground" />
      <p className="text-sm font-medium">
        이미지를 드래그하거나 클릭하여 업로드
      </p>
      <p className="text-xs text-muted-foreground">
        JPEG, PNG, WebP, AVIF, GIF, BMP &middot; 최대{' '}
        {formatFileSize(maxFileSize)} &middot; {maxFileCount}개까지
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}
