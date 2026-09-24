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
- **아이콘**: lucide-react
- **음악**: Spotify Web API (OAuth 기반 재생)
- **패키지 매니저**: pnpm
- **테마**: 다크 고정 (zinc 계열 토큰, 배경 `#09090b`) — `app/globals.css` `:root`
- **폰트**: Geist / Geist Mono (`next/font/google`), 한글은 시스템 폰트 폴백
- **개발 도구**: Agentation(`components/DevTools.tsx`), react-grab 모두 development에서만 로드

## Project Structure

```
app/                            # Next.js App Router (라우트)
├── layout.tsx                  # 루트 레이아웃 (폰트, 배경, Toast, Agentation, Analytics)
├── page.tsx                    # 홈 — 섹션형 1단 (Profile, About, GitHub, Work at, Memo, Footer)
├── globals.css                 # 글로벌 스타일, 테마 토큰, 애니메이션
├── api/posts/route.ts          # Blog API 엔드포인트
├── blog/[id]/                  # 블로그 목록/상세 (Fumadocs MDX)
├── image-converter/            # [Phase 5] 이미지 형식 변환 (Canvas API)
└── spotify/                    # [Phase 12] Spotify Web Playback (OAuth + WebAPI)

components/
├── ui/                         # shadcn/ui 프리미티브 (자동 생성)
├── Container.tsx               # 가운데 정렬 컨테이너 (max-w-2xl)
├── Home/                       # 홈 전용 (GitHub 잔디, 소셜 아이콘)
├── Editor/                     # Tiptap 리치텍스트 에디터 (홈 Memo 섹션)
├── ImageConverter/             # 이미지 변환 컴포넌트
├── toolbars/                   # ToolbarProvider (에디터 상태)
└── brand-icons.tsx

utils/                          # 비즈니스 로직, API 래퍼
├── env.ts                      # 환경변수 파싱/검증
├── event-listener.ts           # 커스텀 이벤트 시스템 (토스트)
├── cn.ts                       # cn() wrapper
└── index.ts                    # toast, cn, copyText 등 re-export

lib/utils.ts                    # cn() — clsx + tailwind-merge
types/                          # 글로벌 타입 선언 (.d.ts)
├── global.d.ts                 # ReactProps, 전역 타입
├── highlightjs-languages.d.ts  # highlight.js 언어 타입
└── index.d.ts
```

## Architecture Patterns

### Server vs Client Components

- **서버 컴포넌트 (기본값)**: `app/layout.tsx`, `app/page.tsx`, 데이터 페칭 (`Home/github-contributions.tsx`)
- **클라이언트 컴포넌트** (`'use client'`): 상태/훅 사용 시 — `Home/github-activity.tsx`, `Editor/`

### Data Fetching

- **Blog Content**: `content/blog/*.mdx` + `lib/blog.ts` — 정적 MDX 기반 블로그 데이터 로딩
- **GitHub GraphQL API**: 컨트리뷰션 캘린더. AbortController 5초 타임아웃

### State Management

- **localStorage**: 메모 에디터 (`Editor/use-local-storage.ts`, 키 `content`)
- **이벤트 시스템**: `utils/event-listener.ts` — 전역 토스트 알림
- **Context API**: `ToolbarProvider` — 에디터 툴바 상태

### Home Layout

홈(`app/page.tsx`)은 `Container`(672px 가운데 정렬) 안에 섹션을 세로로 쌓는 구조. 각 섹션은 `Section`(`animate-enter` + 순차 `animationDelay`)으로 감싸 로드 시 순차 페이드. 하위 경로는 아직 `Container`를 적용하지 않음 (다음 단계).

### Side Projects

- 홈 Memo 섹션 — Tiptap 메모 에디터 (`components/Editor`, localStorage). 예전 `/memo`는 `next.config.ts`에서 `/`로 영구 리다이렉트
- `/image-converter` — 이미지 형식 변환 (홈에 링크 없음)
- `/spotify` — Spotify Web Playback 플레이어 (OAuth)

## Code Conventions

### Formatting (Prettier)

- 싱글쿼트, 세미콜론 없음, 탭 대신 스페이스 2칸, trailing comma 없음, 80자 줄바꿈

### Import Order

1. React / Next.js 모듈
2. 외부 라이브러리
3. `@/` 내부 절대 경로
4. 타입 import (`import type`)

### Naming

- **컴포넌트 파일**: PascalCase (`Container.tsx`) 또는 kebab-case (`github-activity.tsx`)
- **유틸리티/훅**: camelCase (`use-local-storage.ts`, `event-listener.ts`)
- **타입**: PascalCase interface (`SectionProps`, `BlogPost`)

### TypeScript

- `Result<T>` 패턴: `{ ok: true; data: T } | { ok: false; error: string; source: string }`
- 컴포넌트 props는 `interface` 선언 후 destructuring
- 경로 별칭: `@/*` → 루트, `utils` → `./utils`

### Styling

- Tailwind 유틸리티 클래스 인라인 사용
- 동적 클래스: `cn()` 유틸리티 (`lib/utils.ts`)
- shadcn 디자인 토큰: `text-muted-foreground`, `border-border`, `bg-primary` 등
- 반응형: 모바일 우선 + `sm:` 브레이크포인트 (홈)

## Git Conventions

**Conventional Commits**: `type(scope): message`

- `feat(scope):` — 새 기능
- `fix(scope):` — 버그 수정
- `refactor(scope):` — 리팩토링
- `style(scope):` — 스타일 변경
- `chore(scope):` — 유지보수
- `docs(scope):` — 문서

스코프 예: `blog`, `home`, `spec`, `deps`

### 작업 완료 시 커밋 메시지 출력

매 작업 완료 시 마지막에 Conventional Commits 규칙에 따른 한 줄 커밋 메시지를 제안한다.
예: `feat(memo): add markdown export to editor toolbar`

## Environment Variables

| 변수                            | 용도                 | Phase    |
| ------------------------------- | -------------------- | -------- |
| `GITHUB_TOKEN`                  | GitHub GraphQL API   | Core     |
| `GOOGLE_ANALYTICS_PROPERTY_ID`  | GA4 속성             | Core     |
| `GOOGLE_ANALYTICS_CLIENT_EMAIL` | GCP 서비스 계정      | Core     |
| `GOOGLE_ANALYTICS_PRIVATE_KEY`  | GCP 서비스 계정 키   | Core     |
| `NEXT_PUBLIC_BASE_URL`          | 공개 베이스 URL      | Core     |
| `NEXT_PUBLIC_CRISP_WEBSITE_ID`  | Crisp 채팅 위젯 ID   | Home     |
| `SPOTIFY_CLIENT_ID`             | Spotify OAuth ID     | Phase 12 |
| `SPOTIFY_CLIENT_SECRET`         | Spotify OAuth Secret | Phase 12 |
| `SPOTIFY_REFRESH_TOKEN`         | Spotify 갱신 토큰    | Phase 12 |

`.env.example` 참조. 환경변수 누락 시 `utils/env.ts`의 `requireEnv()`가 fallback UI를 위한 에러 결과를 반환.

## 주요 의존성

| 라이브러리                     | 버전  | 용도                 | Phase   |
| ------------------------------ | ----- | -------------------- | ------- |
| `@excalidraw/excalidraw`       | 0.18  | 화이트보드           | 6       |
| `@tiptap/*`                    | 3.19  | 리치텍스트 에디터    | Core    |
| `fumadocs-core`, `fumadocs-ui` | 16.6  | 코드 아카이브 (MDX)  | 2       |
| `highlight.js`                 | 11.11 | 코드 구문 강조       | Core    |
| `lowlight`                     | 3.3   | Tiptap 코드블럭 강조 | Core    |
| `next-auth` (optional)         | 5.x   | Spotify OAuth 인증   | 12      |

## 공통 유틸리티 및 패턴

### 토스트 알림 시스템

- `utils/event-listener.ts`: 커스텀 이벤트 기반 전역 토스트
- 사용법: `window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }))`

### 커스텀 훅

- `components/Editor/use-local-storage.ts` — 메모 에디터 localStorage

### 타입 패턴

```typescript
// Result 패턴 (에러 처리)
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; source: string }

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
const Heavy = dynamic(() => import('heavy-library'), { ssr: false })
```

## 작업 단위 커밋 규칙

**Conventional Commits**: `type(scope): message`

### 예시

- `feat(memo): add debounced auto-save to localStorage`
- `fix(image-converter): select H.264 level by resolution`
- `refactor(home): extract section component`
- `chore(deps): update @xyflow/react to v12.10`

## Key Files

- [spec.md](spec.md) — Side Projects 확장 작업 계획 및 Phase 진행 상황
- [components.json](components.json) — shadcn/ui 설정
- [app/globals.css](app/globals.css) — CSS 변수, 테마 토큰, 애니메이션
- [app/page.tsx](app/page.tsx) — 홈페이지 (섹션형 1단)
- [components/Container.tsx](components/Container.tsx) — 가운데 정렬 컨테이너
- [components/Editor/index.tsx](components/Editor/index.tsx) — Tiptap 리치텍스트 에디터
- [app/spotify/page.tsx](app/spotify/page.tsx) — Spotify Web Playback 플레이어
