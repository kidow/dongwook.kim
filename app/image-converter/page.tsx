import type { Metadata } from 'next'
import { Suspense } from 'react'

import ImageConverter from '@/components/ImageConverter'

const TITLE = 'Image Converter'
const DESCRIPTION =
  'Convert images to JPEG, PNG, WebP, or AVIF, and turn animated WebP into MP4.'
const BASE_URL = 'https://dongwook.kim/image-converter'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['image converter', 'jpeg', 'png', 'webp', 'avif', 'mp4'],
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
        <div className="text-sm text-stone-400">Loading image converter...</div>
      }
    >
      <ImageConverter />
    </Suspense>
  )
}
