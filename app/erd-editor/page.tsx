import type { Metadata } from 'next'
import ErdEditorClient from './erd-editor-client'

const TITLE = 'ERD Editor'
const DESCRIPTION = '브라우저에서 데이터베이스 ERD를 설계할 수 있는 도구입니다.'
const BASE_URL = 'https://dongwook.kim/erd-editor'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['erd', 'database', 'diagram', 'entity relationship'],
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
  return <ErdEditorClient />
}
