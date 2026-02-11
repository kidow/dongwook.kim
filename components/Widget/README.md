# Widget 컴포넌트 규약 (초안)

이 문서는 `components/Widget` 내 공통 카드 위젯을 사용할 때의 props/스타일 규칙 초안입니다.

## WidgetLink

`WidgetLink`는 홈/블로그 등에서 재사용하는 기본 카드 링크 컴포넌트입니다.

### Props

- `href: string` (필수)
  - 카드 클릭 시 이동할 링크
- `icon: ReactNode` (필수)
  - 좌측 상단 아이콘 영역
- `title: string` (필수)
  - 카드 제목 (uppercase 스타일 적용)
- `description?: string`
  - 카드 보조 설명 (line-clamp 1)
- `button?: ReactNode`
  - 아이콘/설명 하단에 배치되는 CTA 영역
- `children?: ReactNode`
  - 우측 확장 영역(동적 위젯 내용 또는 메타 정보)
- `className?: string`
  - 바깥 `<li>`에 적용되는 레이아웃/애니메이션 클래스
- `size?: string`
  - 내부 링크 `<a>`에 적용되는 크기/배경/hover 클래스
- `target?: HTMLAttributeAnchorTarget`
  - 외부 링크 이동 옵션 (`_blank` 등)

### 사용 패턴

1. **정적 카드**
   - `title/description/icon` 중심
   - `children` 없이 사용
2. **동적 카드**
   - `children` 영역에 데이터 결과(또는 Skeleton)를 렌더링
3. **placeholder 카드**
   - 아직 연동되지 않은 기능은 별도 제목/설명으로 명확히 표시
   - 배경색으로 상태를 구분하되, 동일한 카드 규격 유지

## 스타일 가이드

- 카드 기본 외형: `rounded-3xl border border-neutral-200 shadow-sm`
- hover/rotation 효과는 **페이지 레벨 클래스(`className`)** 로 제어
- 카드 크기/배경은 **`size` props** 에서 관리
- 새 카드 추가 시 가능한 `WidgetLink` 우선, 특수 레이아웃만 별도 위젯으로 분리
