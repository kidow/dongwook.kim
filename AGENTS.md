# AGENTS.md

이 문서는 `/Users/gimdong-ug/Documents/dev/projects/dongwook.kim` 코드베이스에서 작업하는 에이전트를 위한 운영 가이드입니다.

## 1) 프로젝트 개요

- 프로젝트 유형: `Next.js App Router` 기반 개인 사이트/포트폴리오 + Side Projects 툴 허브
- 주 스택: `Next.js 16`, `React 19`, `TypeScript`, `Tailwind CSS v4`, `shadcn/ui`
- 패키지 매니저: `pnpm` (lockfile: `pnpm-lock.yaml`)
- 핵심 기능:
  - 홈 위젯 대시보드 (`app/page.tsx` + `components/Widget/*`)
  - 블로그 목록/상세 + API (`app/blog/page.tsx`, `app/blog/[id]/page.tsx`, `app/api/posts/route.ts`)
  - 메모 에디터 (`app/memo/page.tsx`, `components/Editor/*`)
  - 점심 추천 지도 (`app/lunch/page.tsx`)
  - 코드 아카이브 (`app/archive/layout.tsx`, `app/archive/[[...slug]]/page.tsx`, `content/archive/*`)
  - Side Projects 도구 라우트
    - `app/kanban/page.tsx`
    - `app/code-editor/page.tsx`
    - `app/image-converter/page.tsx`
    - `app/canvas/page.tsx`
    - `app/qrcode-generator/page.tsx`
    - `app/invoice-generator/page.tsx`
    - `app/api-client/page.tsx`
    - `app/mindmap/page.tsx`
    - `app/erd-editor/page.tsx`

## 2) 우선 확인 파일

- 라우팅/레이아웃
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/blog/page.tsx`
  - `app/blog/[id]/page.tsx`
  - `app/memo/page.tsx`
  - `app/lunch/page.tsx`
  - `app/archive/layout.tsx`
  - `app/archive/[[...slug]]/page.tsx`
  - `app/canvas/layout.tsx`
- 데이터/환경
  - `utils/api/notion.ts`
  - `utils/env.ts`
  - `app/api/posts/route.ts`
- UI 규약
  - `components/Widget/README.md`
  - `components/Widget/widget-analytics-chart.tsx`
  - `docs/components-ui-guide.md`
  - `docs/a11y-checklist.md`
  - `spec.md`

## 3) 디렉터리 가이드

- `app/`: App Router 페이지 및 API Route
- `components/`: UI 및 기능 컴포넌트
  - `components/ui/`: shadcn/ui 기반 컴포넌트
  - `components/Widget/`: 홈 카드/위젯
  - `components/Editor/`: 메모 에디터
  - `components/Archive/`, `components/Kanban/`, `components/CodeEditor/`, `components/ImageConverter/`, `components/Canvas/`, `components/QrCodeGenerator/`, `components/InvoiceGenerator/`, `components/ApiClient/`, `components/Mindmap/`, `components/ErdEditor/`: 사이드 프로젝트 도구 UI
- `utils/`: 범용 유틸리티 및 Notion API 연동
- `content/archive/`: Archive 라우트의 MDX 컨텐츠
- `lib/`: 공용 helper (`lib/utils.ts`)
- `types/`: 글로벌 타입
- `docs/`: UI/접근성/성능/통합 관련 작업 문서

## 4) 실행 및 검증 명령

```bash
pnpm dev
pnpm lint
pnpm type-check
pnpm build
```

참고:

- `predev`, `prebuild`, `pretype-check`에서 `fumadocs-mdx`가 자동 실행됩니다.
- 작업 후 최소 `pnpm lint`와 `pnpm type-check`를 확인하고, 라우팅/빌드 영향 변경 시 `pnpm build`까지 확인합니다.

## 5) 환경 변수 규칙

기준 파일: `.env.example`

주요 연동 키:

- Notion: `NOTION_SECRET_KEY`, `NOTION_DATABASE_ID`, `NOTION_DATA_SOURCE_ID`
- GitHub Widget: `GITHUB_TOKEN`
- GA4 Widget: `GOOGLE_ANALYTICS_PROPERTY_ID`, `GOOGLE_ANAYLTICS_PROJECT_ID`, `GOOGLE_ANALYTICS_CLIENT_EMAIL`, `GOOGLE_ANALYTICS_PRIVATE_KEY`
- Slack Widget/연동: `SLACK_WEBHOOK_URL`
- Google Calendar Widget/연동: `GOOGLE_CALENDAR_REFRESH_TOKEN`, `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`
- Spotify Widget/연동: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`
- Client: `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_KAKAO_MAP_API_KEY`

Notion 블로그 조회 우선순위:

- `NOTION_DATA_SOURCE_ID`가 있으면 해당 값을 우선 사용
- 없으면 `NOTION_DATABASE_ID`를 기준으로 Data Source ID를 해석해 조회

연동 키 누락 시 일부 페이지/위젯은 fallback UI 또는 `null` 렌더링이 정상 동작입니다. 누락 자체를 에러로 간주하지 말고, 회귀 여부만 판단합니다.

## 6) 코드 작성 원칙

- 기존 스타일 유지:
  - TypeScript strict 모드 준수
  - 경로 별칭 `@/*` 우선 사용
  - UI는 `components/ui`의 shadcn 컴포넌트 우선 활용
  - 다크 모드 미지원: `dark:` 변형, `.dark` 기반 스타일, 테마 토글 구현을 추가하지 않음
- 변경 범위 최소화:
  - 요청 범위를 벗어난 리팩터링 금지
- 데이터 연동:
  - 서버 컴포넌트/유틸의 실패 경로(fallback) 유지
  - 외부 API 실패 시 사용자 UI가 깨지지 않도록 처리
- 대형 클라이언트 라이브러리:
  - 기존 라우트에서 적용된 dynamic import/클라이언트 경계 전략을 유지

## 7) 작업 완료 기준 (DoD)

- 요청 기능/수정 반영
- 관련 타입/린트 오류 없음
- 기존 fallback 동작 유지
- 필요한 경우 문서(`spec.md`, 컴포넌트 README) 업데이트

## 9) 현재 스펙 문서 상태

- 현재 `spec.md`는 **Side Projects 확장 계획(Phase 1~12)** 기준 문서입니다.
- 문서상 기준 상태: Phase 12 완료, `/url-shortner`는 Deferred 상태로 후순위 진행 예정
- 스펙 업데이트 시 기존 UI 마이그레이션 맥락이 아니라 Side Projects 단계 진행 상태를 기준으로 갱신합니다.

## 8) 커밋 메시지 규칙 (필수)

하나의 작업이 완료될 때마다, **영어 한 줄**로 `Conventional Commits` 형식의 커밋 메시지를 작성합니다.

형식:

```text
<type>(<scope>): <summary>
```

예시:

- `docs(agents): add repository-specific working guide`
- `feat(blog): render notion fallback cards on missing credentials`
- `fix(editor): preserve local content hydration order`
- `refactor(widget): unify widget card token usage`

권장 type: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`.
