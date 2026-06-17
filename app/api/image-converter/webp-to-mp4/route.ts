import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { execa } from 'execa'
import {
  WEBP_TO_MP4_TIMEOUT_MS,
  buildWebpToMp4Args,
  isAnimatedWebp,
  validateWebpUpload
} from '@/lib/image-converter/webp-to-mp4'

const require = createRequire(import.meta.url)
const ffmpegPath = require('ffmpeg-static') as string | null

export const maxDuration = 60

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return Response.json(
      { error: '변환할 WebP 파일을 선택해 주세요.' },
      { status: 400 }
    )
  }

  const validation = validateWebpUpload(file)
  if (!validation.ok) {
    return Response.json({ error: validation.message }, { status: 400 })
  }

  if (!ffmpegPath) {
    return Response.json(
      { error: '서버에서 FFmpeg 실행 파일을 찾을 수 없습니다.' },
      { status: 500 }
    )
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  if (!isAnimatedWebp(bytes)) {
    return Response.json(
      { error: 'animated WebP 파일만 MP4로 변환할 수 있습니다.' },
      { status: 400 }
    )
  }

  const dir = await mkdtemp(join(tmpdir(), 'webp-to-mp4-'))
  const inputPath = join(dir, 'input.webp')
  const outputPath = join(dir, 'output.mp4')

  try {
    await writeFile(inputPath, bytes)
    await execa(ffmpegPath, buildWebpToMp4Args(inputPath, outputPath), {
      timeout: WEBP_TO_MP4_TIMEOUT_MS
    })
    const output = await readFile(outputPath)

    return new Response(output, {
      headers: {
        'Content-Disposition': 'attachment; filename="converted.mp4"',
        'Content-Length': String(output.byteLength),
        'Content-Type': 'video/mp4'
      }
    })
  } catch {
    return Response.json(
      {
        error:
          'MP4 변환에 실패했습니다. 파일 길이를 줄인 뒤 다시 시도해 주세요.'
      },
      { status: 422 }
    )
  } finally {
    await rm(dir, { force: true, recursive: true })
  }
}
