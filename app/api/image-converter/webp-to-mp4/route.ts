import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { execa } from 'execa'
import sharp from 'sharp'
import {
  WEBP_TO_MP4_TIMEOUT_MS,
  isAnimatedWebp,
  validateWebpUpload
} from '@/lib/image-converter/webp-to-mp4'

const require = createRequire(join(process.cwd(), 'dummy.js'))
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
  const outputPath = join(dir, 'output.mp4')

  try {
    const meta = await sharp(bytes, { animated: true }).metadata()
    const pages = meta.pages ?? 1
    const delays = meta.delay ?? []
    const avgDelay = delays.length
      ? delays.reduce((a, b) => a + b, 0) / delays.length
      : 100
    const fps = Math.round(1000 / avgDelay)

    for (let i = 0; i < pages; i++) {
      const frameBuf = await sharp(bytes, { page: i }).png().toBuffer()
      const framePath = join(dir, `frame${String(i).padStart(4, '0')}.png`)
      await writeFile(framePath, frameBuf)
    }

    const framePattern = join(dir, 'frame%04d.png')
    await execa(
      ffmpegPath,
      [
        '-y',
        '-framerate', String(fps),
        '-i', framePattern,
        '-movflags', '+faststart',
        '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-an',
        outputPath
      ],
      { timeout: WEBP_TO_MP4_TIMEOUT_MS }
    )

    const output = await readFile(outputPath)

    return new Response(output, {
      headers: {
        'Content-Disposition': 'attachment; filename="converted.mp4"',
        'Content-Length': String(output.byteLength),
        'Content-Type': 'video/mp4'
      }
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[webp-to-mp4] error:', message)
    return Response.json(
      {
        error: 'MP4 변환에 실패했습니다. 파일 길이를 줄인 뒤 다시 시도해 주세요.',
        debug: message
      },
      { status: 422 }
    )
  } finally {
    await rm(dir, { force: true, recursive: true })
  }
}
