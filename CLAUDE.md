# CLAUDE.md

## Quick Reference

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint
pnpm type-check   # TypeScript 타입 검사 (tsc --noEmit --skipLibCheck)
```

## Tech Stack

- **Next.js 16.1.6** (App Router) + **React 19.2.3** + **TypeScript 5**
- **Tailwind CSS v4** + **shadcn/ui** (New York 스타일, `components.json`)
- **React Compiler** 활성화 (`next.config.ts`: `reactCompiler: true`)
- **MDX 지원**: Fumadocs MDX (`fumadocs-mdx`, `fumadocs-core`, `fumadocs-ui`)
- **리치텍스트**: Tiptap v3.19 + tiptap-markdown
- **코드 에디터**: Sandpack v2.20 (CodeSandbox 임베드)
- **캔버스**: Excalidraw v0.18 (무한 화이트보드)
- **그래프**: React Flow v12.10 + Dagre (마인드맵 자동 레이아웃)
- **드래그앤드롭**: @dnd-kit (칸반 보드)
- **차트**: Recharts v3.7 (Google Analytics 시각화)
- **아이콘**: lucide-react
- **지도**: react-kakao-maps-sdk (점심 추천)
- **QR코드**: qrcode.react v4.2
- **포맷**: dayjs (날짜), html2canvas (캔버스 캡처)
- **패키지 매니저**: pnpm

## Project Structure

```
app/                            # Next.js App Router (라우트)
├── layout.tsx                  # 루트 레이아웃 (Header, Footer, Toast, Agentation)
├── page.tsx                    # 홈 — Widget 그리드 (13개 Side Project 위젯)
├── globals.css                 # 글로벌 스타일, 테마 토큰, 애니메이션
├── api/posts/route.ts          # Blog API 엔드포인트
├── blog/[id]/                  # 블로그 목록/상세 (Notion 연동)
├── memo/                       # 메모 에디터 (Tiptap + localStorage)
├── lunch/                      # 점심 추천 (Kakao Maps)
├── resume/                     # 이력서 (Notion 연동)
├── kanban/                     # [Phase 1] 칸반 보드 (@dnd-kit 드래그앤드롭)
├── archive/                    # [Phase 2] 코드 아카이브 (Fumadocs MDX)
├── code-editor/                # [Phase 4] 코드 에디터 (Sandpack 실행)
├── image-converter/            # [Phase 5] 이미지 형식 변환 (Canvas API)
├── canvas/                     # [Phase 6] 화이트보드 (Excalidraw)
├── qrcode-generator/           # [Phase 7] QR코드 생성기
├── invoice-generator/          # [Phase 8] 인보이스 생성기
├── api-client/                 # [Phase 9] HTTP API 테스트 클라이언트 (Postman 스타일)
└── mindmap/                    # [Phase 10] 마인드맵 생성기 (React Flow)

components/
├── ui/                         # shadcn/ui 프리미티브 (자동 생성)
├── Widget/                     # 위젯 컴포넌트 (types.ts에 타입 정의)
├── Editor/                     # Tiptap 리치텍스트 에디터 (메모 페이지용)
├── ApiClient/                  # API 클라이언트 컴포넌트
├── CodeEditor/                 # 코드 에디터 컴포넌트 (Sandpack 래퍼)
├── ImageConverter/             # 이미지 변환 컴포넌트
├── Canvas/                     # Excalidraw 화이트보드 래퍼
├── InvoiceGenerator/           # 인보이스 생성 폼/미리보기
├── Kanban/                     # 칸반 보드 컴포넌트
├── Mindmap/                    # React Flow 마인드맵 노드
├── QrCodeGenerator/            # QR코드 생성 컴포넌트
├── Archive/                    # Fumadocs 아카이브 래퍼
├── toolbars/                   # ToolbarProvider (에디터 상태)
├── Header.tsx, Footer.tsx
└── icons.tsx, brand-icons.tsx

utils/                          # 비즈니스 로직, API 래퍼
├── env.ts                      # 환경변수 파싱/검증
├── api/notion.ts               # Notion API 통합
├── event-listener.ts           # 커스텀 이벤트 시스템 (토스트)
├── hooks/                      # 커스텀 훅
│   └── use-mindmap-storage.ts  # 마인드맵 localStorage 저장/복원
├── cn.ts                       # cn() wrapper
└── index.ts                    # toast, cn, copyText 등 re-export

lib/utils.ts                    # cn() — clsx + tailwind-merge
types/                          # 글로벌 타입 선언 (.d.ts)
├── global.d.ts                 # ReactProps, 전역 타입
├── mindmap.d.ts                # 마인드맵 라이브러리 타입
├── highlightjs-languages.d.ts  # highlight.js 언어 타입
└── index.d.ts
```

## Architecture Patterns

### Server vs Client Components

- **서버 컴포넌트 (기본값)**: `app/layout.tsx`, `app/page.tsx`, 데이터 페칭 위젯 (`widget-github.tsx`, `widget-analytics.tsx`)
- **클라이언트 컴포넌트** (`'use client'`): 상태/훅 사용 시 — `Header.tsx`, `Editor/`, `widget-link.tsx`

### Data Fetching

- **Notion API**: `utils/api/notion.ts` — 블로그/이력서 데이터. `next: { revalidate: 3600 }` 캐싱. 실패 시 fallback 데이터 제공
- **GitHub GraphQL API**: 컨트리뷰션 캘린더. AbortController 5초 타임아웃
- **Google Analytics API**: `@google-analytics/data` — 페이지뷰 통계

### State Management

- **localStorage**: 메모 에디터 (`Editor/use-local-storage.ts`). URL 파라미터 공유 지원 (`?c=base64json`)
- **이벤트 시스템**: `utils/event-listener.ts` — 전역 토스트 알림
- **Context API**: `ToolbarProvider` — 에디터 툴바 상태

### Widget Pattern

위젯은 `components/Widget/types.ts`에 정의된 `WidgetLinkProps` 인터페이스를 따름. `WidgetLink` 컴포넌트는 shadcn Card + Next.js Link로 구성. 홈페이지 `app/page.tsx`의 그리드에 `<li>` 요소로 배치.

### Side Projects 구성 (13개 위젯)

**Core Widgets** (데이터 페칭):
- `widget-github.tsx` — GitHub 컨트리뷰션 캘린더
- `widget-github-calendar.tsx` — GitHub 활동 통계
- `widget-analytics.tsx` + `widget-analytics-chart.tsx` — Google Analytics 페이지뷰
- `widget-quote.tsx` — 랜덤 인용구
- `widget-map.tsx` — Kakao Maps 지도

**Interactive Tools** (클라이언트 사이드):
- `widget-link.tsx` — 외부 링크 (GitHub, LinkedIn 등)
- `/memo` — Tiptap 메모 에디터 (localStorage)
- `/lunch` — 점심 추천 (Kakao Maps)
- `/kanban` — 칸반 보드 (@dnd-kit)
- `/archive` — 코드 아카이브 (Fumadocs MDX)
- `/code-editor` — 코드 실행 (Sandpack)
- `/image-converter` — 이미지 형식 변환
- `/canvas` — 화이트보드 (Excalidraw)
- `/qrcode-generator` — QR코드 생성
- `/invoice-generator` — 인보이스 생성
- `/api-client` — API 테스트 클라이언트
- `/mindmap` — 마인드맵 (React Flow)

## Code Conventions

### Formatting (Prettier)

- 싱글쿼트, 세미콜론 없음, 탭 대신 스페이스 2칸, trailing comma 없음, 80자 줄바꿈

### Import Order

1. React / Next.js 모듈
2. 외부 라이브러리
3. `@/` 내부 절대 경로
4. 타입 import (`import type`)

### Naming

- **컴포넌트 파일**: PascalCase (`Header.tsx`) 또는 kebab-case prefix (`widget-github.tsx`)
- **유틸리티/훅**: camelCase (`use-local-storage.ts`, `event-listener.ts`)
- **타입**: PascalCase interface (`WidgetLinkProps`, `BlogPost`)

### TypeScript

- `Result<T>` 패턴: `{ ok: true; data: T } | { ok: false; error: string; source: string }`
- 컴포넌트 props는 `interface` 선언 후 destructuring
- 경로 별칭: `@/*` → 루트, `utils` → `./utils`

### Styling

- Tailwind 유틸리티 클래스 인라인 사용
- 동적 클래스: `cn()` 유틸리티 (`lib/utils.ts`)
- shadcn 디자인 토큰: `text-muted-foreground`, `border-border`, `bg-primary` 등
- 반응형: 모바일 우선 + `xl:` 브레이크포인트

## Git Conventions

**Conventional Commits**: `type(scope): message`

- `feat(scope):` — 새 기능
- `fix(scope):` — 버그 수정
- `refactor(scope):` — 리팩토링
- `style(scope):` — 스타일 변경
- `chore(scope):` — 유지보수
- `docs(scope):` — 문서

스코프 예: `blog`, `notion`, `widget`, `resume`, `spec`

### 작업 완료 시 커밋 메시지 출력

매 작업 완료 시 마지막에 Conventional Commits 규칙에 따른 한 줄 커밋 메시지를 제안한다.
예: `feat(code-editor): add run button and refresh control to sandbox output panel`

## Environment Variables

| 변수                            | 용도               | Phase |
| ------------------------------- | ------------------ | ----- |
| `GITHUB_TOKEN`                  | GitHub GraphQL API | Core  |
| `NOTION_SECRET_KEY`             | Notion 연동        | Core  |
| `NOTION_DATABASE_ID`            | 블로그 DB          | Core  |
| `GOOGLE_ANALYTICS_PROPERTY_ID`  | GA4 속성           | Core  |
| `GOOGLE_ANALYTICS_CLIENT_EMAIL` | GCP 서비스 계정    | Core  |
| `GOOGLE_ANALYTICS_PRIVATE_KEY`  | GCP 서비스 계정 키 | Core  |
| `NEXT_PUBLIC_KAKAO_MAP_API_KEY` | Kakao Maps         | Core  |
| `NEXT_PUBLIC_BASE_URL`          | 공개 베이스 URL    | Core  |

`.env.example` 참조. 환경변수 누락 시 `utils/env.ts`의 `requireEnv()`가 fallback UI를 위한 에러 결과를 반환.

## 주요 의존성

| 라이브러리                     | 버전  | 용도                     | Phase |
| ----------------------------- | ----- | ----------------------- | ----- |
| `@xyflow/react`              | 12.10 | 마인드맵, ERD 에디터     | 10    |
| `@dnd-kit/core`, `sortable`  | 6.3   | 칸반 드래그앤드롭        | 1     |
| `@codesandbox/sandpack-react`| 2.20  | 코드 에디터/실행         | 4     |
| `@excalidraw/excalidraw`     | 0.18  | 화이트보드               | 6     |
| `@tiptap/*`                  | 3.19  | 리치텍스트 에디터        | Core  |
| `fumadocs-core`, `fumadocs-ui`| 16.6 | 코드 아카이브 (MDX)      | 2     |
| `@google-analytics/data`     | 5.2   | GA4 데이터 페칭          | Core  |
| `@notionhq/client`           | 5.9   | Notion API               | Core  |
| `recharts`                   | 3.7   | 차트 시각화              | Core  |
| `qrcode.react`               | 4.2   | QR코드 생성              | 7     |
| `html2canvas`                | 1.4   | 캔버스 이미지 캡처       | 6,10  |
| `dayjs`                      | 1.11  | 날짜 포맷팅              | Multi |
| `highlight.js`               | 11.11 | 코드 구문 강조           | 2,4   |
| `lowlight`                   | 3.3   | Tiptap 코드블럭 강조     | Core  |
| `nanoid`                     | 5.1   | ID 생성                  | Multi |

## 공통 유틸리티 및 패턴

### 토스트 알림 시스템
- `utils/event-listener.ts`: 커스텀 이벤트 기반 전역 토스트
- 사용법: `window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }))`

### 커스텀 훅
- `utils/hooks/use-mindmap-storage.ts` — 마인드맵 localStorage 저장/복원
- `components/Editor/use-local-storage.ts` — 메모 에디터 localStorage (URL 파라미터 공유)

### 타입 패턴
```typescript
// Result 패턴 (에러 처리)
type Result<T> = { ok: true; data: T } | { ok: false; error: string; source: string }

// Reaction Props 제네릭
interface ReactProps {
  children?: React.ReactNode
  className?: string
  [key: string]: any
}
```

### 동적 Import 패턴
대형 라이브러리는 동적 로딩:
```typescript
const Excalidraw = dynamic(() => import('@excalidraw/excalidraw'), { ssr: false })
const Sandpack = dynamic(() => import('@codesandbox/sandpack-react'), { ssr: false })
```

## 작업 단위 커밋 규칙

**Conventional Commits**: `type(scope): message`

### 예시
- `feat(mindmap): add debounced auto-save to localStorage`
- `fix(code-editor): resolve Sandpack bundle error on Firefox`
- `refactor(api-client): extract request validation to utils`
- `style(invoice): adjust page break for PDF print layout`
- `chore(deps): update @xyflow/react to v12.10`

## Key Files

- [spec.md](spec.md) — Side Projects 확장 작업 계획 및 Phase 진행 상황
- [components.json](components.json) — shadcn/ui 설정
- [app/globals.css](app/globals.css) — CSS 변수, 테마 토큰, 애니메이션
- [components/Widget/types.ts](components/Widget/types.ts) — 위젯 타입 정의
- [utils/api/notion.ts](utils/api/notion.ts) — Notion API 통합 로직
- [app/page.tsx](app/page.tsx) — 홈페이지 (13개 위젯 그리드)
- [components/Editor/index.tsx](components/Editor/index.tsx) — Tiptap 리치텍스트 에디터
- [components/ApiClient/index.tsx](components/ApiClient/index.tsx) — HTTP 요청 테스터
- [components/CodeEditor/index.tsx](components/CodeEditor/index.tsx) — Sandpack 코드 에디터
- [app/mindmap/MindmapEditor.tsx](app/mindmap/MindmapEditor.tsx) — React Flow 마인드맵
- [utils/hooks/use-mindmap-storage.ts](utils/hooks/use-mindmap-storage.ts) — 마인드맵 저장소 훅
