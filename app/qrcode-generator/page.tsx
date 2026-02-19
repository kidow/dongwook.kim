import type { Metadata } from 'next'

import QrCodeGenerator from '@/components/QrCodeGenerator'

const TITLE = 'QR Code Generator'
const DESCRIPTION =
  'URL을 입력하면 QR코드를 실시간으로 생성하고, PNG/SVG로 다운로드할 수 있는 도구입니다.'
const BASE_URL = 'https://dongwook.kim/qrcode-generator'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['qr code', 'qr code generator', 'qrcode', 'png', 'svg'],
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
  return <QrCodeGenerator />
}
