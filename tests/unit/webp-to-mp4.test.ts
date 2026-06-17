/**
 * @jest-environment node
 */

import {
  MAX_WEBP_TO_MP4_FILE_SIZE,
  buildWebpToMp4Args,
  isAnimatedWebp,
  validateWebpUpload
} from '@/lib/image-converter/webp-to-mp4'

describe('webp-to-mp4 conversion helpers', () => {
  it('accepts animated webp-sized uploads within the server limit', () => {
    expect(
      validateWebpUpload({
        name: 'animation.webp',
        size: MAX_WEBP_TO_MP4_FILE_SIZE,
        type: 'image/webp'
      })
    ).toEqual({ ok: true })
  })

  it('rejects non-webp uploads and files over 50MB', () => {
    expect(
      validateWebpUpload({
        name: 'animation.gif',
        size: 1024,
        type: 'image/gif'
      })
    ).toEqual({
      ok: false,
      message: 'animated WebP 파일만 MP4로 변환할 수 있습니다.'
    })

    expect(
      validateWebpUpload({
        name: 'animation.webp',
        size: MAX_WEBP_TO_MP4_FILE_SIZE + 1,
        type: 'image/webp'
      })
    ).toEqual({
      ok: false,
      message: 'MP4 변환은 50 MB 이하의 WebP 파일만 지원합니다.'
    })
  })

  it('builds ffmpeg args for broadly compatible mp4 output', () => {
    expect(buildWebpToMp4Args('/tmp/input.webp', '/tmp/output.mp4')).toEqual([
      '-y',
      '-i',
      '/tmp/input.webp',
      '-movflags',
      '+faststart',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-an',
      '/tmp/output.mp4'
    ])
  })

  it('detects animated webp bytes before conversion', () => {
    expect(
      isAnimatedWebp(
        new Uint8Array([
          82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80, 65, 78, 73, 77
        ])
      )
    ).toBe(true)

    expect(
      isAnimatedWebp(
        new Uint8Array([
          82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80, 86, 80, 56, 32
        ])
      )
    ).toBe(false)
  })
})
