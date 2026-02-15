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
- **아이콘**: lucide-react
- **패키지 매니저**: pnpm

## Project Structure

```
app/                        # Next.js App Router (라우트)
├── layout.tsx              # 루트 레이아웃 (Header, Footer)
├── page.tsx                # 홈 — Widget 그리드
├── api/posts/route.ts      # Blog API 엔드포인트
├── blog/[id]/              # 블로그 목록/상세 (Notion 연동)
├── memo/                   # 메모 에디터 (Tiptap + localStorage)
├── lunch/                  # 점심 추천 (Kakao Maps)
└── resume/                 # 이력서 (Notion 연동)

components/
├── ui/                     # shadcn/ui 프리미티브 (자동 생성)
├── Widget/                 # 위젯 컴포넌트 (types.ts에 타입 정의)
├── Editor/                 # Tiptap 리치텍스트 에디터
├── Header.tsx, Footer.tsx
└── icons.tsx, brand-icons.tsx

utils/                      # 비즈니스 로직, API 래퍼
├── env.ts                  # 환경변수 파싱/검증
├── api/notion.ts           # Notion API 통합
├── event-listener.ts       # 커스텀 이벤트 시스템 (토스트 등)
└── index.ts                # toast, cn, copyText 등 re-export

lib/utils.ts                # cn() — clsx + tailwind-merge
types/                      # 글로벌 타입 선언 (.d.ts)
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

## Environment Variables

| 변수 | 용도 |
|------|------|
| `GITHUB_TOKEN` | GitHub GraphQL API |
| `NOTION_SECRET_KEY` | Notion 연동 |
| `NOTION_DATABASE_ID` | 블로그 DB |
| `GOOGLE_ANALYTICS_PROPERTY_ID` | GA4 속성 |
| `GOOGLE_ANALYTICS_CLIENT_EMAIL` | GCP 서비스 계정 |
| `GOOGLE_ANALYTICS_PRIVATE_KEY` | GCP 서비스 계정 키 |
| `NEXT_PUBLIC_KAKAO_MAP_API_KEY` | Kakao Maps |
| `NEXT_PUBLIC_BASE_URL` | 공개 베이스 URL |

`.env.example` 참조. 환경변수 누락 시 `utils/env.ts`의 `requireEnv()`가 fallback UI를 위한 에러 결과를 반환.

## Key Files

- [spec.md](spec.md) — Side Projects 확장 작업 계획
- [components.json](components.json) — shadcn/ui 설정
- [app/globals.css](app/globals.css) — CSS 변수, 테마 토큰, 애니메이션
- [components/Widget/types.ts](components/Widget/types.ts) — 위젯 타입 정의
- [utils/api/notion.ts](utils/api/notion.ts) — Notion API 통합 로직
