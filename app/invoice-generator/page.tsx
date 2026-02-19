import type { Metadata } from 'next'

import InvoiceGenerator from '@/components/InvoiceGenerator'

const TITLE = '인보이스 생성기'
const DESCRIPTION =
  '인보이스를 작성하고 PDF로 출력할 수 있는 도구입니다.'
const BASE_URL = 'https://dongwook.kim/invoice-generator'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['invoice', 'invoice generator', 'pdf', '인보이스'],
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
  return <InvoiceGenerator />
}
