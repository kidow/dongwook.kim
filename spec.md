# dongwook.kim 코드베이스 최신화 스펙

이 문서는 `dongwook.kim` 프로젝트를 최신 기술 스택으로 현대화하는 작업을 관리하기 위한 단일 기준 문서입니다.

## 목표

- **shadcn/ui 기반 컴포넌트 시스템 구축**: 현재 레거시 컴포넌트들을 shadcn/ui 패턴으로 전환
- **일관된 디자인 시스템 확립**: Tailwind CSS v4 + shadcn/ui를 활용한 통일된 UI/UX
- **재사용 가능한 컴포넌트 라이브러리**: 타입 안전성과 접근성을 갖춘 모던 컴포넌트 구조
- **점진적 마이그레이션**: 기존 기능을 유지하면서 단계적으로 전환
- **프로젝트 구조 정리**: `shared` 폴더 제거, `components`와 `utils` 폴더로 통합

## 현재 상태

### 기존 컴포넌트 구조

1. **shared/ui**: 공통 UI 컴포넌트 → **components로 이전 예정**
   - `Tooltip`, `Spinner`, `BackTop`, `Toast`

2. **shared/utils**: 공통 유틸리티 함수 → **utils 폴더로 이전 예정**
   - `cn`, `event-listener`, `toast`, `env`, `api/notion`

3. **components**: 페이지/기능별 컴포넌트
   - `Header`, `Footer`, `Tools`, `Skills`
   - `Widget/*`: 다양한 위젯 컴포넌트
   - `Editor/*`: Tiptap 기반 에디터 컴포넌트
   - `MemoEditor`: 메모 에디터

4. **기술 스택**
   - Next.js 16.1.6
   - React 19.2.3
   - Tailwind CSS v4
   - TypeScript 5
   - 의존성: @tremor/react, lucide-react, class-variance-authority, clsx, tailwind-merge

### shadcn/ui 미설치 상태

- `components/ui` 디렉토리 없음
- `components.json` 설정 파일 없음

## 작업 계획 (단계별)

### Phase 0: 프로젝트 구조 정리 (P0)

#### 0-1. 유틸리티 함수 이전
- [ ] `utils` 폴더 생성
- [ ] `shared/utils/index.ts` → `utils/cn.ts` (cn 함수)
- [ ] `shared/utils/event-listener.ts` → `utils/event-listener.ts`
- [ ] `shared/utils/env.ts` → `utils/env.ts`
- [ ] `shared/utils/api/notion.ts` → `utils/api/notion.ts`
- [ ] 모든 import 경로 업데이트

#### 0-2. shared 폴더 제거 준비
- [ ] `shared/ui` 컴포넌트들의 사용처 파악
- [ ] 마이그레이션 계획 수립

### Phase 1: shadcn/ui 기반 환경 구축 (P0)

#### 1-1. shadcn/ui 초기 설정
- [ ] `components.json` 설정 파일 생성
  - Tailwind CSS v4 호환 설정
  - `components/ui` 경로 지정
  - 별칭 설정: `@/components`, `@/utils`
- [ ] `lib/utils.ts` 생성 (cn 함수)
  - `utils/cn.ts`와 통합 또는 재사용

#### 1-2. 기본 컴포넌트 설치
- [ ] Button 컴포넌트 설치 및 검증
- [ ] Card 컴포넌트 설치 및 검증
- [ ] Badge 컴포넌트 설치 및 검증
- [ ] Tooltip 컴포넌트 설치 및 검증
- [ ] Spinner/Loading 컴포넌트 설치 및 검증

### Phase 2: 공통 UI 컴포넌트 마이그레이션 (P0)

#### 2-1. shared/ui 컴포넌트 전환 (components로 이전)
- [ ] `shared/ui/tooltip.tsx` → `components/ui/tooltip.tsx` (shadcn)
  - 기존 사용처 마이그레이션
  - 레거시 컴포넌트 제거

- [ ] `shared/ui/spinner.tsx` → `components/ui/spinner.tsx` (shadcn 기반 커스텀)
  - 로딩 상태 표시 통일

- [ ] `shared/ui/toast.tsx` → `components/ui/toast.tsx` + Sonner 또는 shadcn toast
  - 토스트 알림 시스템 현대화

- [ ] `shared/ui/back-top.tsx` → `components/ui/back-to-top.tsx` (shadcn Button 활용)

#### 2-2. 공통 컴포넌트 추가 설치
- [ ] Input 컴포넌트 (폼 입력용)
- [ ] Select/Dropdown 컴포넌트
- [ ] Dialog/Modal 컴포넌트
- [ ] Sheet 컴포넌트 (사이드 패널)

#### 2-3. shared 폴더 제거
- [ ] `shared/ui` 폴더 제거
- [ ] `shared/utils` 폴더 제거
- [ ] `shared` 폴더 완전 제거

### Phase 3: 레이아웃 컴포넌트 리팩토링 (P1)

#### 3-1. Header 컴포넌트 현대화
- [ ] `components/Header.tsx` shadcn 기반 재작성
  - Button, Badge 컴포넌트 활용
  - 반응형 네비게이션 개선
  - 타입 안전성 강화

#### 3-2. Footer 컴포넌트 현대화
- [ ] `components/Footer.tsx` shadcn 기반 재작성
  - 링크 스타일 통일
  - 아이콘 처리 개선

### Phase 4: Widget 컴포넌트 리팩토링 (P1)

#### 4-1. 기본 Widget 컴포넌트 전환
- [ ] `widget-link.tsx` → shadcn Card + Button 기반
- [ ] `widget-quote.tsx` → shadcn Card + Blockquote 스타일
- [ ] Widget 공통 타입 및 인터페이스 정의

#### 4-2. 동적 Widget 컴포넌트 전환
- [ ] `widget-github.tsx` → shadcn Card 기반
- [ ] `widget-github-calendar.tsx` → shadcn Card 기반
- [ ] `widget-analytics.tsx` → shadcn Card + Chart (Tremor 대체 고려)
- [ ] `widget-analytics-chart.tsx` → 차트 라이브러리 통합
- [ ] `widget-scheduling.tsx` → shadcn Card 기반
- [ ] `widget-map.tsx` → shadcn Card 기반

### Phase 5: 페이지 특화 컴포넌트 리팩토링 (P2)

#### 5-1. ~~Tools & Skills 컴포넌트~~ (삭제됨 - 미사용)

#### 5-2. Editor 컴포넌트 현대화 (shadcn-tiptap 활용)
- [ ] shadcn-tiptap 설치 및 설정
  - `npx shadcn add https://tiptap.niazmorshed.dev/r/toolbar-provider.json`
  - ToolbarProvider 컴포넌트 통합
  - 에디터 스타일 globals.css에 추가
- [ ] `Editor/index.tsx` → shadcn-tiptap 기반 재작성
  - ToolbarProvider 적용
  - shadcn/ui 컴포넌트 활용
- [ ] `Editor/bubble-menu.tsx` → shadcn-tiptap BubbleMenu
- [ ] `Editor/node-selector.tsx` → shadcn-tiptap NodeSelector 또는 shadcn Select
- [ ] `Editor/color-selector.tsx` → shadcn-tiptap ColorSelector 또는 shadcn Popover
- [ ] `Editor/link-selector.tsx` → shadcn-tiptap LinkSelector 또는 shadcn Popover + Input
- [ ] `Editor/slash-command.tsx` → shadcn Command 컴포넌트

### Phase 6: 최종 정리 및 최적화 (P2)

#### 6-1. 레거시 코드 정리
- [ ] 중복 컴포넌트 제거
- [ ] 미사용 의존성 정리 (@tremor/react 사용 여부 확인)
- [ ] import 경로 최종 점검

#### 6-2. 문서화 및 테스트
- [ ] Storybook 또는 컴포넌트 문서 작성 (선택사항)
- [ ] 컴포넌트 사용 가이드 작성
- [ ] 접근성 검증 (a11y)
- [ ] 타입 안전성 최종 검증 (`pnpm type-check`)

#### 6-3. 성능 최적화
- [ ] 컴포넌트 번들 사이즈 분석
- [ ] 불필요한 리렌더링 최적화
- [ ] 코드 스플리팅 적용

## 새로운 프로젝트 구조

```
dongwook.kim/
├── app/                    # Next.js 앱 라우터
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트 (자동 생성)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── tooltip.tsx
│   │   ├── spinner.tsx
│   │   └── ...
│   ├── Widget/            # 위젯 컴포넌트
│   ├── Editor/            # 에디터 컴포넌트
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── utils/                 # 유틸리티 함수 (shared/utils 이전)
│   ├── cn.ts
│   ├── event-listener.ts
│   ├── env.ts
│   └── api/
│       └── notion.ts
├── lib/                   # shadcn/ui 라이브러리 코드
│   └── utils.ts           # cn 함수 등
├── public/
├── types/
└── ...
```

## 작업 원칙

1. **하나씩 단계적으로**: 한 번에 하나의 컴포넌트 또는 컴포넌트 그룹만 전환
2. **타입 안전성 우선**: 모든 변경 후 `pnpm type-check` 실행
3. **기존 기능 보존**: 마이그레이션 중에도 기능이 동작하도록 유지
4. **작은 커밋**: 각 컴포넌트 전환마다 커밋
5. **문서 업데이트**: 매 작업 후 이 spec.md 갱신
6. **스타일 일관성**: shadcn/ui 디자인 토큰 및 패턴 준수

## 다음 작업 (Next Steps)

### 즉시 시작 (Phase 0)

1. **utils 폴더 생성 및 마이그레이션**
   - `shared/utils/*` → `utils/*`로 이동
   - 모든 import 경로 업데이트

2. **shadcn/ui 초기 설정 (Phase 1)**
   - `npx shadcn@latest init` 실행
   - Tailwind CSS v4 호환 확인
   - 기본 설정 완료

3. **핵심 컴포넌트 5개 설치**
   - Button, Card, Badge, Tooltip, Spinner
   - 각 컴포넌트 동작 검증

4. **첫 번째 마이그레이션 대상**
   - `shared/ui/tooltip.tsx` → `components/ui/tooltip.tsx`
   - 가장 간단하고 의존성이 적은 컴포넌트부터 시작

## 참고 사항

- **temp 폴더 제외**: `temp/` 폴더는 과거 모노레포 아카이브로, 이번 마이그레이션 작업 범위에서 완전히 제외 (tsconfig.json에서도 exclude 처리됨)
- **Tremor React**: 현재 설치되어 있으나, shadcn/ui로 대체 가능 여부 검토 필요
- **Tailwind CSS v4**: 최신 버전이므로 shadcn/ui 호환성 주의
- **React 19**: 최신 React 버전 사용 중 - shadcn/ui 호환 확인됨
- **Lucide React**: 아이콘 라이브러리로 유지 (shadcn/ui 권장)
- **프로젝트 구조**: `shared` 폴더 제거, `utils`와 `components`로 통합
- **shadcn-tiptap**: Tiptap 에디터의 shadcn/ui 통합 라이브러리 활용 가능
  - 저장소: https://github.com/NiazMorshed2007/shadcn-tiptap
  - 문서: https://tiptap.niazmorshed.dev/docs
  - shadcn CLI를 통한 간편한 설치 지원

## 완료 기준 (Definition of Done)

각 Phase 완료 시:
- [ ] 모든 타입 에러 해결 (`pnpm type-check` 통과)
- [ ] ESLint 경고 없음
- [ ] 기존 기능 정상 동작 확인
- [ ] 커밋 메시지 작성 및 푸시
- [ ] spec.md 업데이트

프로젝트 완료 시:
- [ ] 모든 컴포넌트가 shadcn/ui 패턴 준수
- [ ] `shared` 폴더 완전 제거
- [ ] 프로젝트 구조 정리 완료 (`utils`, `components`, `lib`)
- [ ] 문서화 완료
- [ ] 빌드 성공 (`pnpm build`)
- [ ] 성능 이슈 없음

---

**최종 업데이트**: 2026-02-15
**현재 Phase**: Phase 2 완료 (shared 폴더 제거 완료, shadcn/ui 기반 환경 구축 완료)
