import type { Metadata } from 'next'
import { Suspense } from 'react'

import CanvasBoard from '@/components/Canvas'

const TITLE = '캔버스 화이트보드 | Kidow'
const DESCRIPTION =
  '브라우저에서 자유롭게 그릴 수 있는 캔버스 화이트보드입니다. 자동 저장과 PNG/SVG 내보내기를 지원합니다.'
const BASE_URL = 'https://dongwook.kim/canvas'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['canvas', 'whiteboard', 'drawing', 'png', 'svg'],
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
          캔버스를 불러오는 중...
        </div>
      }
    >
      <CanvasBoard />
    </Suspense>
  )
}
