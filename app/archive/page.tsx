import type { Metadata } from 'next'

import ArchivePage from '@/components/Archive'

const TITLE = '코드 아카이브 | Kidow'
const DESCRIPTION =
  '자주 참고하는 코드 스니펫과 구현 패턴을 카테고리별로 정리한 코드 아카이브입니다.'
const BASE_URL = 'https://dongwook.kim/archive'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['archive', 'snippet', 'code', 'mdx'],
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
  return <ArchivePage />
}
