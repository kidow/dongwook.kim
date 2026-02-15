import type { ReactNode, HTMLAttributeAnchorTarget } from 'react'

/** WidgetLink 컴포넌트 공통 Props */
export interface WidgetLinkProps {
  /** 카드 클릭 시 이동할 링크 */
  href: string
  /** 좌측 상단 아이콘 영역 */
  icon: ReactNode
  /** 카드 제목 (uppercase 스타일 적용) */
  title: string
  /** 카드 보조 설명 (line-clamp 1) */
  description?: string
  /** 아이콘/설명 하단에 배치되는 CTA 영역 */
  button?: ReactNode
  /** 우측 확장 영역 (동적 위젯 내용 또는 메타 정보) */
  children?: ReactNode
  /** 바깥 <li>에 적용되는 레이아웃/애니메이션 클래스 */
  className?: string
  /** 내부 링크 <a>에 적용되는 크기/배경/hover 클래스 */
  size?: string
  /** 외부 링크 이동 옵션 (_blank 등) */
  target?: HTMLAttributeAnchorTarget
}

/** Widget 카드 공통 래퍼 Props */
export interface WidgetCardProps {
  /** 바깥 <li>에 적용되는 클래스 */
  className?: string
  children?: ReactNode
}

/** GitHub 기여도 데이터 타입 */
export type GithubContributionMap = Record<string, number>

/** Analytics 차트 데이터 항목 */
export interface AnalyticsChartItem {
  date: string
  '방문자 수': string
}

/** Analytics 차트 Props */
export interface AnalyticsChartProps {
  total: number
  percent: number
  list: AnalyticsChartItem[]
}
