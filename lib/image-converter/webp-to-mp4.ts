export const MAX_WEBP_TO_MP4_FILE_SIZE = 50 * 1024 * 1024
export const WEBP_TO_MP4_TIMEOUT_MS = 60_000

interface UploadLike {
  name: string
  size: number
  type: string
}

type ValidationResult = { ok: true } | { ok: false; message: string }

export function validateWebpUpload(file: UploadLike): ValidationResult {
  const isWebp =
    file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp')

  if (!isWebp) {
    return {
      ok: false,
      message: 'animated WebP 파일만 MP4로 변환할 수 있습니다.'
    }
  }

  if (file.size > MAX_WEBP_TO_MP4_FILE_SIZE) {
    return {
      ok: false,
      message: 'MP4 변환은 50 MB 이하의 WebP 파일만 지원합니다.'
    }
  }

  return { ok: true }
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.slice(start, end))
}

function includesAscii(bytes: Uint8Array, value: string): boolean {
  const pattern = Array.from(value, (char) => char.charCodeAt(0))

  for (let i = 0; i <= bytes.length - pattern.length; i++) {
    if (pattern.every((byte, index) => bytes[i + index] === byte)) {
      return true
    }
  }

  return false
}

function indexOfAscii(bytes: Uint8Array, value: string): number {
  const pattern = Array.from(value, (char) => char.charCodeAt(0))

  for (let i = 0; i <= bytes.length - pattern.length; i++) {
    if (pattern.every((byte, index) => bytes[i + index] === byte)) {
      return i
    }
  }

  return -1
}

export function isAnimatedWebp(bytes: Uint8Array): boolean {
  if (
    bytes.length < 16 ||
    ascii(bytes, 0, 4) !== 'RIFF' ||
    ascii(bytes, 8, 12) !== 'WEBP'
  ) {
    return false
  }

  if (includesAscii(bytes, 'ANIM') || includesAscii(bytes, 'ANMF')) {
    return true
  }

  const vp8xIndex = indexOfAscii(bytes, 'VP8X')
  if (vp8xIndex < 0 || bytes.length <= vp8xIndex + 8) {
    return false
  }

  return (bytes[vp8xIndex + 8] & 0b0000_0010) !== 0
}

export function buildWebpToMp4Args(inputPath: string, outputPath: string) {
  return [
    '-y',
    '-i',
    inputPath,
    '-movflags',
    '+faststart',
    '-vf',
    'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-an',
    outputPath
  ]
}
