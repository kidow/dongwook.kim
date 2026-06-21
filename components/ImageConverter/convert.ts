export function checkFormatSupport(mimeType: string): boolean {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const dataUrl = canvas.toDataURL(mimeType)
  return dataUrl.startsWith(`data:${mimeType}`)
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`이미지를 불러올 수 없습니다: ${file.name}`))
    }
    img.src = url
  })
}

export function convertImage(
  img: HTMLImageElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Canvas 2D 컨텍스트를 생성할 수 없습니다.'))
      return
    }
    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.drawImage(img, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('이미지 변환에 실패했습니다.'))
          return
        }
        resolve(blob)
      },
      mimeType,
      quality / 100
    )
  })
}

export async function convertAnimatedWebpToMp4(file: File): Promise<Blob> {
  if (typeof ImageDecoder === 'undefined' || typeof VideoEncoder === 'undefined') {
    throw new Error(
      'MP4 변환은 Chrome 94 이상에서 지원됩니다. 브라우저를 업데이트해 주세요.'
    )
  }

  const { getWebpFrameDelays } = await import('@/lib/image-converter/webp-to-mp4')
  const { Muxer, ArrayBufferTarget } = await import('mp4-muxer')

  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  const delays = getWebpFrameDelays(bytes)
  if (delays.length === 0) {
    throw new Error('animated WebP 파일만 MP4로 변환할 수 있습니다.')
  }

  const decoder = new ImageDecoder({ data: arrayBuffer, type: 'image/webp' })
  await decoder.tracks.ready
  const track = decoder.tracks.selectedTrack
  if (!track?.animated) {
    throw new Error('animated WebP 파일만 MP4로 변환할 수 있습니다.')
  }

  const frameCount = Math.min(track.frameCount, delays.length)
  const { image: first } = await decoder.decode({ frameIndex: 0 })
  const rawW = first.displayWidth
  const rawH = first.displayHeight
  first.close()
  const width = rawW % 2 === 0 ? rawW : rawW - 1
  const height = rawH % 2 === 0 ? rawH : rawH - 1
  const needsCrop = rawW !== width || rawH !== height

  const avgDelay = delays.reduce((a, b) => a + b, 0) / delays.length
  const fps = Math.max(1, Math.round(1000 / avgDelay))

  // Pick H.264 level by macroblock count (each MB = 16×16 px)
  const mbs = Math.ceil(width / 16) * Math.ceil(height / 16)
  const codec =
    mbs <= 3600
      ? 'avc1.42001f' // Baseline L3.1 — ≤921,600 px
      : mbs <= 8192
        ? 'avc1.640028' // High L4.0 — ≤2,097,152 px
        : 'avc1.640032' // High L5.0 — larger

  const bitrate = Math.max(2_000_000, Math.min(8_000_000, width * height * 2))

  const target = new ArrayBufferTarget()
  const muxer = new Muxer({
    target,
    video: { codec: 'avc', width, height },
    fastStart: 'in-memory'
  })

  let encodeError: Error | null = null
  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => {
      encodeError = e
    }
  })

  encoder.configure({ codec, width, height, bitrate, framerate: fps })

  let timestamp = 0
  for (let i = 0; i < frameCount; i++) {
    if (encodeError || encoder.state !== 'configured') break
    const { image } = await decoder.decode({ frameIndex: i })
    const delay = delays[i] ?? avgDelay
    const duration = Math.round(delay * 1000)

    // Re-check after async decode — error callback may have fired during await
    if (encodeError || encoder.state !== 'configured') {
      image.close()
      break
    }

    let frame: VideoFrame
    if (needsCrop) {
      const canvas = new OffscreenCanvas(width, height)
      canvas.getContext('2d')!.drawImage(image as unknown as CanvasImageSource, 0, 0)
      frame = new VideoFrame(canvas, { timestamp, duration })
    } else {
      frame = new VideoFrame(image as unknown as CanvasImageSource, { timestamp, duration })
    }
    image.close()
    encoder.encode(frame, { keyFrame: i % 60 === 0 })
    frame.close()
    timestamp += duration
  }

  if (encoder.state === 'configured') await encoder.flush()
  decoder.close()

  if (encodeError) throw new Error(`MP4 인코딩 실패: ${(encodeError as Error).message}`)

  muxer.finalize()
  return new Blob([target.buffer], { type: 'video/mp4' })
}

export function getOutputFilename(
  originalName: string,
  extension: string
): string {
  const dotIndex = originalName.lastIndexOf('.')
  const baseName = dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName
  return `${baseName}${extension}`
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}
