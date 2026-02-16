import type { Metadata } from 'next'

import ApiClient from '@/components/ApiClient'

const TITLE = 'API Client | Kidow'
const DESCRIPTION =
  'Postman 스타일의 브라우저 내 HTTP API 테스트 도구입니다.'
const BASE_URL = 'https://dongwook.kim/api-client'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['api', 'api client', 'http', 'rest', 'postman'],
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
  return <ApiClient />
}
