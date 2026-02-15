import type { Metadata } from 'next'

const TITLE = '점심 뭐 먹지? | Dongwook Kim'

export const metadata: Metadata = {
  title: TITLE,
  description: '현재 위치 기반으로 점심 메뉴를 탐색하는 페이지입니다.',
  openGraph: {
    title: TITLE
  },
  twitter: {
    title: TITLE
  }
}

export default function LunchLayout({ children }: ReactProps) {
  return <>{children}</>
}
