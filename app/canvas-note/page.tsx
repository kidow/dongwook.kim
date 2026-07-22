import type { Metadata } from 'next'
import CanvasNoteClient from './canvas-note-client'

const TITLE = 'Canvas Note'
const DESCRIPTION = '무한 캔버스에 자유롭게 메모를 배치하는 도구입니다.'
const BASE_URL = 'https://dongwook.kim/canvas-note'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['canvas', 'note', 'sticky note', 'infinite canvas', 'memo'],
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
  return <CanvasNoteClient />
}
