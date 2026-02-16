import type { Metadata } from 'next'
import { Suspense } from 'react'

import ImageConverter from '@/components/ImageConverter'

const TITLE = '이미지 변환기 | Kidow'
const DESCRIPTION =
  '브라우저에서 이미지 파일 포맷을 JPEG, PNG, WebP, AVIF로 변환할 수 있는 도구입니다.'
const BASE_URL = 'https://dongwook.kim/image-converter'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'image converter',
    'jpeg',
    'png',
    'webp',
    'avif',
    'canvas api'
  ],
  alternates: {
    canonical: BASE_URL
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_URL
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION
  },
  metadataBase: new URL(BASE_URL)
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-stone-400">
          이미지 변환기를 불러오는 중...
        </div>
      }
    >
      <ImageConverter />
    </Suspense>
  )
}
