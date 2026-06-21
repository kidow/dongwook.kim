'use client'

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from '@/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  isAnimatedWebp,
  validateWebpUpload
} from '@/lib/image-converter/webp-to-mp4'
import ImageConverterToolbar from './image-converter-toolbar'
import DropZone from './drop-zone'
import ImagePreview from './image-preview'
import {
  checkFormatSupport,
  convertAnimatedWebpToMp4,
  convertImage,
  downloadBlob,
  getOutputFilename,
  loadImage
} from './convert'
import {
  DEFAULT_FORMAT,
  DEFAULT_QUALITY,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
  MAX_WEBP_TO_MP4_FILE_SIZE,
  SUPPORTED_FORMATS
} from './constants'

import type { ConvertedFile, ImageFile, OutputFormat } from './types'

export default function ImageConverter() {
  const [files, setFiles] = useState<ImageFile[]>([])
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(DEFAULT_FORMAT)
  const [quality, setQuality] = useState(DEFAULT_QUALITY)
  const [results, setResults] = useState<ConvertedFile[]>([])
  const [convertingIds, setConvertingIds] = useState<Set<string>>(new Set())
  const [avifSupported, setAvifSupported] = useState(false)

  const isConverting = convertingIds.size > 0

  useEffect(() => {
    setAvifSupported(checkFormatSupport('image/avif'))
  }, [])

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl))
      results.forEach((r) => URL.revokeObjectURL(r.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilesSelected = useCallback(
    (newFiles: File[]) => {
      const promises = newFiles.map(
        (file) =>
          new Promise<ImageFile>(async (resolve, reject) => {
            if (outputFormat === 'mp4') {
              const validation = validateWebpUpload(file)
              if (!validation.ok) {
                reject(new Error(validation.message))
                return
              }

              if (!isAnimatedWebp(new Uint8Array(await file.arrayBuffer()))) {
                reject(
                  new Error('animated WebP 파일만 MP4로 변환할 수 있습니다.')
                )
                return
              }
            }

            const url = URL.createObjectURL(file)
            const img = new Image()
            img.onload = () => {
              resolve({
                id: crypto.randomUUID(),
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                previewUrl: url,
                width: img.naturalWidth,
                height: img.naturalHeight
              })
            }
            img.onerror = () => {
              URL.revokeObjectURL(url)
              reject(new Error(`이미지를 불러올 수 없습니다: ${file.name}`))
            }
            img.src = url
          })
      )

      Promise.allSettled(promises).then((settled) => {
        const loaded: ImageFile[] = []
        for (const result of settled) {
          if (result.status === 'fulfilled') {
            loaded.push(result.value)
          } else {
            toast.error(result.reason?.message ?? '이미지 로드 실패')
          }
        }
        if (loaded.length > 0) {
          startTransition(() => {
            setFiles((prev) => [...prev, ...loaded])
          })
        }
      })
    },
    [outputFormat]
  )

  const handleConvert = useCallback(async () => {
    if (files.length === 0) return
    const format = SUPPORTED_FORMATS.find((f) => f.id === outputFormat)
    if (!format) return

    const allIds = new Set(files.map((f) => f.id))
    setConvertingIds(allIds)

    const newResults: ConvertedFile[] = []

    for (const file of files) {
      try {
        const blob =
          outputFormat === 'mp4'
            ? await convertAnimatedWebpToMp4(file.file)
            : await convertImage(
                await loadImage(file.file),
                format.mimeType,
                quality
              )
        const previewUrl = URL.createObjectURL(blob)
        newResults.push({
          sourceId: file.id,
          blob,
          previewUrl,
          size: blob.size,
          format: outputFormat,
          quality
        })
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : `변환 실패: ${file.name}`
        )
      } finally {
        setConvertingIds((prev) => {
          const next = new Set(prev)
          next.delete(file.id)
          return next
        })
      }
    }

    results.forEach((r) => URL.revokeObjectURL(r.previewUrl))
    setResults(newResults)

    if (newResults.length > 0) {
      toast.success(`${newResults.length}개 파일 변환 완료`)
    }
  }, [files, outputFormat, quality, results])

  const handleDownload = useCallback(
    (result: ConvertedFile) => {
      const source = files.find((f) => f.id === result.sourceId)
      if (!source) return
      const format = SUPPORTED_FORMATS.find((f) => f.id === result.format)
      if (!format) return
      const filename = getOutputFilename(source.name, format.extension)
      downloadBlob(result.blob, filename)
    },
    [files]
  )

  const handleDownloadAll = useCallback(async () => {
    if (results.length === 1) {
      handleDownload(results[0])
      return
    }
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    for (const result of results) {
      const source = files.find((f) => f.id === result.sourceId)
      if (!source) continue
      const format = SUPPORTED_FORMATS.find((f) => f.id === result.format)
      if (!format) continue
      const filename = getOutputFilename(source.name, format.extension)
      zip.file(filename, result.blob)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    downloadBlob(blob, 'converted.zip')
  }, [results, files, handleDownload])

  const handleRemove = useCallback(
    (sourceId: string) => {
      const file = files.find((f) => f.id === sourceId)
      if (file) URL.revokeObjectURL(file.previewUrl)
      const result = results.find((r) => r.sourceId === sourceId)
      if (result) URL.revokeObjectURL(result.previewUrl)
      setFiles((prev) => prev.filter((f) => f.id !== sourceId))
      setResults((prev) => prev.filter((r) => r.sourceId !== sourceId))
    },
    [files, results]
  )

  const handleClearAll = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl))
    results.forEach((r) => URL.revokeObjectURL(r.previewUrl))
    setFiles([])
    setResults([])
  }, [files, results])

  const resultMap = useMemo(() => {
    const map = new Map<string, ConvertedFile>()
    for (const r of results) {
      map.set(r.sourceId, r)
    }
    return map
  }, [results])

  return (
    <Card>
      <CardHeader>
        <ImageConverterToolbar
          outputFormat={outputFormat}
          quality={quality}
          isConverting={isConverting}
          fileCount={files.length}
          resultCount={results.length}
          avifSupported={avifSupported}
          onFormatChange={setOutputFormat}
          onQualityChange={setQuality}
          onConvert={handleConvert}
          onDownloadAll={handleDownloadAll}
          onClearAll={handleClearAll}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DropZone
          onFilesSelected={handleFilesSelected}
          disabled={isConverting}
          maxFileCount={MAX_FILE_COUNT}
          maxFileSize={
            outputFormat === 'mp4' ? MAX_WEBP_TO_MP4_FILE_SIZE : MAX_FILE_SIZE
          }
          acceptedFormatsLabel={
            outputFormat === 'mp4' ? 'WebP' : 'JPEG, PNG, WebP, AVIF, GIF, BMP'
          }
          accept={outputFormat === 'mp4' ? 'image/webp,.webp' : 'image/*'}
          currentFileCount={files.length}
        />
        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            {files.map((file) => (
              <ImagePreview
                key={file.id}
                source={file}
                result={resultMap.get(file.id)}
                isConverting={convertingIds.has(file.id)}
                onDownload={handleDownload}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
