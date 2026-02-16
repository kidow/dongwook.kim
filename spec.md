# dongwook.kim Side Projects 확장 스펙

이 문서는 `dongwook.kim` 프로젝트에 11개의 새로운 Side Project 도구를 추가하는 작업을 관리하기 위한 단일 기준 문서입니다.

## 목표

- **Side Projects 섹션에 11개의 유틸리티 도구 추가**: 각 도구는 독립된 라우트(`/kanban`, `/archive`, `/url-shortner`, `/code-editor`, `/image-converter`, `/canvas`, `/qrcode-generator`, `/invoice-generator`, `/api-client`, `/mindmap`, `/erd-editor`)로 제공
- **일관된 UI/UX**: shadcn/ui 기반 컴포넌트 시스템 유지
- **홈페이지 위젯 연동**: 각 도구는 `app/page.tsx`의 Side Projects 섹션에 `WidgetLink` 위젯으로 노출
- **점진적 개발**: 라우트 단위로 독립적으로 개발 및 배포 가능

## 현재 상태

### 기술 스택

- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui (New York 스타일)
- pnpm

### Side Projects 현황

- `/memo`: Tiptap 기반 메모 에디터 (localStorage 저장)
- `/lunch`: Kakao Maps 기반 점심 메뉴 추천

---

## 작업 계획

### Phase 1: `/kanban` — 칸반 보드

Trello 스타일 칸반 보드. 드래그 앤 드롭으로 카드를 이동하며, localStorage에 데이터를 저장하여 새로고침에도 유지.

#### 1-1. 프로젝트 셋업

- [ ] `app/kanban/page.tsx` 생성
- [ ] 칸반 관련 타입 정의 (`Board`, `Column`, `Card`)
- [ ] localStorage 훅 구현 (기존 `use-local-storage.ts` 활용 또는 확장)

#### 1-2. 핵심 UI 구현

- [ ] 보드 레이아웃 (수평 스크롤 가능한 컬럼 리스트)
- [ ] 컬럼 컴포넌트 (제목, 카드 수, 추가 버튼)
- [ ] 카드 컴포넌트 (제목, 설명, 라벨/색상)
- [ ] 카드 추가/편집 Dialog (shadcn Dialog + Input + Textarea)
- [ ] 컬럼 추가/편집/삭제 기능

#### 1-3. 드래그 앤 드롭

- [ ] `@dnd-kit/core` + `@dnd-kit/sortable` 설치
- [ ] 카드 간 드래그 앤 드롭 (같은 컬럼 내, 다른 컬럼 간)
- [ ] 컬럼 순서 변경 드래그 앤 드롭

#### 1-4. 위젯 등록

- [x] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [ ] 적절한 아이콘 선정 (lucide-react `KanbanIcon` 등)

#### 1-5. 마무리

- [ ] `pnpm lint` / `pnpm type-check` 통과
- [ ] 반응형 레이아웃 검증

**참고 라이브러리**: `@dnd-kit/core`, `@dnd-kit/sortable`

---

### Phase 2: `/archive` — 코드 아카이브

Fumadocs 프레임워크 기반 코드 스니펫/문서 보관소. 사전 검토 필요.

#### 2-1. Fumadocs 호환성 조사

- [x] Fumadocs(https://fumadocs.dev)와 기존 Next.js 16 / App Router 호환성 확인
- [x] Fumadocs를 서브 라우트(`/archive`)로 통합하는 방법 조사
- [x] 기존 shadcn/ui 테마와의 충돌 여부 확인
- [x] 호환 불가 시 대안 검토 (MDX 직접 구현, Contentlayer 등)
- 조사 결과 문서: `docs/fumadocs-compatibility-report.md`

#### 2-2. Fumadocs 셋업 (호환 확인 후)

- [x] `fumadocs-core`, `fumadocs-ui` 설치
- [x] `app/archive/` 라우트 구성 (Fumadocs 레이아웃/슬러그 페이지 적용)
- [x] MDX 콘텐츠 디렉토리 구조 설계 (`content/archive/`)
- [x] 코드 하이라이팅 설정 (highlight.js 기반 임시 적용)

#### 2-3. 콘텐츠 구조

- [x] 카테고리별 분류 체계 정의 (React, TypeScript, CSS, Utilities)
- [x] 코드 스니펫 템플릿 MDX 작성
- [x] 검색 기능 연동 (임시 로컬 필터 검색)

#### 2-4. 위젯 등록

- [x] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [x] 적절한 아이콘 선정 (lucide-react `ArchiveIcon`)

#### 2-5. 마무리

- [x] `pnpm lint` / `pnpm type-check` 통과
- [x] 빌드 검증 (`pnpm build`)
- 메모: `pnpm build`는 webpack 모드로 검증 완료

**참고**: https://fumadocs.dev — 호환성 사전 검증 필수

---

### Phase 3: `/url-shortner` — URL 단축기 (Deferred)

Supabase 연동 URL 단축 서비스. 생성된 단축 URL은 24시간 후 자동 만료.

> 우선순위 조정: `/url-shortner`는 가장 마지막(Phase 12 완료 후)으로 연기합니다.

#### 3-1. Supabase 셋업

- [ ] Supabase 프로젝트 연결 (환경변수 설정)
- [ ] `@supabase/supabase-js` 설치
- [ ] `urls` 테이블 스키마 정의 (`id`, `short_code`, `original_url`, `created_at`, `expires_at`)
- [ ] 24시간 만료 로직 (Supabase Edge Function 또는 Row Level Policy + cron)

#### 3-2. API 구현

- [ ] `app/api/shorten/route.ts` — URL 생성 API (POST)
- [ ] `app/api/shorten/[code]/route.ts` — URL 리다이렉트 API (GET)
- [ ] 단축 코드 생성 로직 (nanoid 등)
- [ ] URL 유효성 검증

#### 3-3. UI 구현

- [ ] `app/url-shortner/page.tsx` 생성
- [ ] URL 입력 폼 (shadcn Input + Button)
- [ ] 생성된 단축 URL 표시 및 복사 버튼
- [ ] 최근 생성 목록 (만료 시간 표시)

#### 3-4. 위젯 등록

- [ ] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [ ] 적절한 아이콘 선정 (lucide-react `LinkIcon` 등)

#### 3-5. 마무리

- [ ] `pnpm lint` / `pnpm type-check` 통과
- [ ] Supabase 환경변수 fallback UI 구현

**참고 라이브러리**: `@supabase/supabase-js`, `nanoid`

---

### Phase 4: `/code-editor` — 실행 가능한 코드 에디터

브라우저에서 코드를 작성하고 실행할 수 있는 에디터. Sandpack 또는 Codapi 활용.

#### 4-1. 기술 선택 및 셋업

- [x] Sandpack(https://sandpack.codesandbox.io)과 Codapi(https://codapi.org) 비교 검토
- [x] 선택한 라이브러리 설치 (`@codesandbox/sandpack-react` 또는 Codapi embed)
- [x] 지원 언어 범위 결정 (JavaScript/TypeScript 최우선)
- 선택: Sandpack (`@codesandbox/sandpack-react` v2.20.0) — 클라이언트 사이드 실행, React 네이티브 컴포넌트

#### 4-2. UI 구현

- [x] `app/code-editor/page.tsx` 생성
- [x] 코드 에디터 영역 (구문 강조, 줄 번호)
- [x] 실행 버튼 및 실행 결과 출력 패널
- [x] 언어 선택 드롭다운 (shadcn Select)
- [x] 에디터 테마 설정 (라이트/다크)

#### 4-3. 추가 기능

- [x] 코드 공유 (URL 파라미터 또는 클립보드 복사)
- [x] 코드 템플릿/예제 프리셋

#### 4-4. 위젯 등록

- [x] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [x] 적절한 아이콘 선정 (lucide-react `CodeXmlIcon`)

#### 4-5. 마무리

- [x] `pnpm lint` / `pnpm type-check` 통과
- [x] 반응형 레이아웃 검증
- 메모: `pnpm build`는 webpack 모드로 검증 완료

**참고**: https://sandpack.codesandbox.io

---

### Phase 5: `/image-converter` — 이미지 파일 확장자 변환기

브라우저 내에서 이미지 파일의 확장자를 변환. JPEG, PNG, WebP, AVIF 지원. 서버 없이 클라이언트 사이드 처리.

#### 5-1. 핵심 변환 로직

- [x] Canvas API 기반 이미지 변환 유틸리티 구현
- [x] 지원 포맷: JPEG ↔ PNG ↔ WebP ↔ AVIF
- [x] 품질 설정 옵션 (0-100%)
- [x] AVIF 변환은 브라우저 호환성 확인 필요

#### 5-2. UI 구현

- [x] `app/image-converter/page.tsx` 생성
- [x] 드래그 앤 드롭 파일 업로드 영역
- [x] 이미지 미리보기 (원본/변환 결과 비교)
- [x] 출력 포맷 선택 (shadcn Select)
- [x] 품질 슬라이더 (shadcn Slider)
- [x] 변환 및 다운로드 버튼
- [x] 복수 파일 일괄 변환 지원

#### 5-3. 위젯 등록

- [x] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [x] 적절한 아이콘 선정 (lucide-react `ImageIcon` 등)

#### 5-4. 마무리

- [x] `pnpm lint` / `pnpm type-check` 통과
- [x] 파일 크기 제한 및 에러 핸들링

**참고**: https://floo.app — 클라이언트 사이드 변환, 서버 불필요

---

### Phase 6: `/canvas` — 가상 화이트보드

Excalidraw와 유사한 무한 캔버스 화이트보드.

#### 6-1. 라이브러리 셋업

- [x] `@excalidraw/excalidraw` 설치 및 호환성 확인
- [x] 또는 대안 라이브러리 검토 (tldraw 등)

#### 6-2. UI 구현

- [x] `app/canvas/page.tsx` 생성
- [x] Canvas 화이트보드 컴포넌트 임베드 (dynamic import + SSR 비활성화)
- [x] 전체 화면 레이아웃 (헤더/푸터 최소화 또는 숨김)
- [x] 테마 연동 (shadcn 디자인 토큰 활용)

#### 6-3. 데이터 저장

- [x] localStorage에 캔버스 상태 저장/복원
- [x] PNG/SVG 내보내기 기능

#### 6-4. 위젯 등록

- [x] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [x] 적절한 아이콘 선정 (lucide-react `PenToolIcon` 등)

#### 6-5. 마무리

- [x] `pnpm lint` / `pnpm type-check` 통과
- [x] 번들 사이즈 확인 (Excalidraw 동적 로딩 적용)

**참고**: `@excalidraw/excalidraw` (대안: `tldraw`)

---

### Phase 7: `/qrcode-generator` — QR코드 생성기

URL 문자열을 입력하면 QR코드를 생성하는 도구.

#### 7-1. 셋업

- [x] `qrcode.react` 설치

#### 7-2. UI 구현

- [x] `app/qrcode-generator/page.tsx` 생성
- [x] URL 입력 필드 (shadcn Input)
- [x] QR코드 실시간 미리보기 (`QRCodeSVG` 컴포넌트)
- [x] QR코드 크기 조절 옵션
- [x] 색상 커스터마이징 (전경/배경)
- [x] PNG/SVG 다운로드 버튼

#### 7-3. 위젯 등록

- [x] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [x] 적절한 아이콘 선정 (lucide-react `QrCodeIcon`)

#### 7-4. 마무리

- [x] `pnpm lint` / `pnpm type-check` 통과

**참고**: https://www.npmjs.com/package/qrcode.react

---

### Phase 8: `/invoice-generator` — 인보이스 생성기

인보이스를 작성하고 PDF로 출력하는 도구.

#### 8-1. 셋업

- [ ] PDF 생성 라이브러리 선택 (`@react-pdf/renderer` 또는 브라우저 `window.print()`)
- [ ] 인보이스 데이터 타입 정의 (`Invoice`, `InvoiceItem`, `CompanyInfo`)

#### 8-2. UI 구현

- [ ] `app/invoice-generator/page.tsx` 생성
- [ ] 발신자/수신자 정보 입력 폼
- [ ] 항목 테이블 (품목, 수량, 단가, 금액) — 동적 행 추가/삭제
- [ ] 소계/세금/합계 자동 계산
- [ ] 인보이스 번호, 발행일, 만기일 입력
- [ ] 통화 선택 (KRW, USD 등)

#### 8-3. PDF 출력

- [ ] 인보이스 미리보기 레이아웃
- [ ] PDF 다운로드/인쇄 기능

#### 8-4. 위젯 등록

- [ ] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [ ] 적절한 아이콘 선정 (lucide-react `ReceiptIcon` 등)

#### 8-5. 마무리

- [ ] `pnpm lint` / `pnpm type-check` 통과

**참고**: https://github.com/tuanpham-dev/react-invoice-generator

---

### Phase 9: `/api-client` — API 클라이언트

Postman/Bruno 스타일의 브라우저 내 HTTP API 테스트 도구.

#### 9-1. 핵심 기능 구현

- [ ] HTTP 메서드 지원 (GET, POST, PUT, PATCH, DELETE)
- [ ] 요청 URL 입력
- [ ] 요청 헤더 편집 (키-값 쌍, 동적 추가/삭제)
- [ ] 요청 바디 편집 (JSON, Form Data)
- [ ] `fetch` API를 통한 요청 실행

#### 9-2. UI 구현

- [ ] `app/api-client/page.tsx` 생성
- [ ] 메서드 선택 드롭다운 (shadcn Select) + URL 입력 바
- [ ] 탭 UI: Headers, Body, Params (shadcn Tabs)
- [ ] 응답 뷰어: Status, Headers, Body (JSON 구문 강조)
- [ ] 응답 시간 및 크기 표시

#### 9-3. 추가 기능

- [ ] 요청 히스토리 (localStorage 저장)
- [ ] 요청 컬렉션 저장/불러오기

#### 9-4. 위젯 등록

- [ ] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [ ] 적절한 아이콘 선정 (lucide-react `SendIcon` 등)

#### 9-5. 마무리

- [ ] `pnpm lint` / `pnpm type-check` 통과
- [ ] CORS 제한 사항 안내 UI

**참고**: https://github.com/usebruno/bruno

---

### Phase 10: `/mindmap` — 마인드맵 생성기

노드 기반 마인드맵 에디터. `@xyflow/react`를 활용하며, localStorage에 저장.

#### 10-1. 셋업

- [ ] `@xyflow/react` 설치
- [ ] 마인드맵 데이터 타입 정의 (`MindMapNode`, `MindMapEdge`)
- [ ] localStorage 저장/복원 훅 구현

#### 10-2. 핵심 UI 구현

- [ ] `app/mindmap/page.tsx` 생성
- [ ] React Flow 캔버스 (줌, 팬, 미니맵)
- [ ] 커스텀 노드 컴포넌트 (텍스트 입력, 색상, 크기 조절)
- [ ] 노드 추가/삭제/편집
- [ ] 엣지(연결선) 추가/삭제
- [ ] 자동 레이아웃 정렬 (dagre 또는 elkjs)

#### 10-3. 추가 기능

- [ ] 노드 색상 커스터마이징
- [ ] PNG/SVG 내보내기
- [ ] 키보드 단축키 (노드 추가, 삭제, 포커스 이동)

#### 10-4. 위젯 등록

- [ ] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [ ] 적절한 아이콘 선정 (lucide-react `NetworkIcon` 등)

#### 10-5. 마무리

- [ ] `pnpm lint` / `pnpm type-check` 통과
- [ ] 반응형 레이아웃 검증

**참고**: https://www.npmjs.com/package/@xyflow/react

---

### Phase 11: 홈페이지 위젯 통합 및 최종 정리

#### 11-1. Side Projects 섹션 레이아웃 조정

- [ ] 12개 위젯(기존 2 + 신규 10)에 맞는 그리드 레이아웃 검토
- [ ] 위젯 순서 및 배치 최적화
- [ ] 반응형 그리드 검증 (모바일/태블릿/데스크탑)

#### 11-2. 공통 정리

- [ ] 미사용 의존성 정리
- [ ] 번들 사이즈 분석 및 최적화 (대형 라이브러리: Excalidraw, Sandpack, React Flow)
- [ ] `pnpm build` 전체 빌드 성공 확인
- [ ] 각 라우트 수동 동작 검증

---

### Phase 12: `/erd-editor` — ERD 에디터

drawDB의 기본 사용 경험을 참고하여, 가상 화이트보드 위에서 데이터베이스 다이어그램(ERD)을 그릴 수 있는 편집기.

#### 12-1. 기본 레이아웃 및 캔버스

- [ ] `app/erd-editor/page.tsx` 라우트 추가
- [ ] 툴바/캔버스 2단 구성 레이아웃
- [ ] 테이블 노드 추가/선택/이동 기본 상호작용

#### 12-2. 핵심 ERD 편집 기능 (MVP)

- [ ] 테이블 생성/삭제, 테이블명 수정
- [ ] 컬럼 추가/수정/삭제 (이름, 타입, nullable 최소 지원)
- [ ] 관계선 연결/삭제 (1:1, 1:N 기본 관계)
- [ ] 확대/축소, 팬 이동 등 캔버스 기본 제스처 지원

#### 12-3. 로컬 저장/복원

- [ ] ERD 상태를 `localStorage`에 저장
- [ ] 페이지 재진입 시 저장된 다이어그램 자동 복원
- [ ] 초기화(Reset) 액션 및 저장 스키마 버전 키 관리

#### 12-4. 위젯 등록

- [ ] `app/page.tsx` Side Projects 섹션에 `WidgetLink` 추가
- [ ] 적절한 아이콘 선정 (lucide-react `DatabaseIcon` 등)

#### 12-5. 참고 오픈 소스

- [ ] drawDB의 핵심 UX/동작 흐름 벤치마킹

**참고**: https://github.com/drawdb-io/drawdb

---

## 프로젝트 구조 (예상)

```
app/
├── page.tsx                  # 홈 (Side Projects 위젯 13개)
├── memo/                     # 기존 - 메모 에디터
├── lunch/                    # 기존 - 점심 추천
├── kanban/                   # Phase 1 - 칸반 보드
│   └── page.tsx
├── archive/                  # Phase 2 - 코드 아카이브 (Fumadocs)
│   └── ...
├── url-shortner/             # Phase 3 - URL 단축기
│   └── page.tsx
├── code-editor/              # Phase 4 - 코드 에디터
│   └── page.tsx
├── image-converter/          # Phase 5 - 이미지 변환기
│   └── page.tsx
├── canvas/                   # Phase 6 - 화이트보드
│   └── page.tsx
├── qrcode-generator/         # Phase 7 - QR코드 생성기
│   └── page.tsx
├── invoice-generator/        # Phase 8 - 인보이스 생성기
│   └── page.tsx
├── api-client/               # Phase 9 - API 클라이언트
│   └── page.tsx
├── mindmap/                  # Phase 10 - 마인드맵
│   └── page.tsx
├── erd-editor/               # Phase 12 - ERD 에디터
│   └── page.tsx
└── api/
    └── shorten/              # Phase 3 - URL 단축 API
        ├── route.ts
        └── [code]/
            └── route.ts
```

## 신규 의존성 목록 (예상)

| Phase | 라이브러리                                | 용도                          |
| ----- | ----------------------------------------- | ----------------------------- |
| 1     | `@dnd-kit/core`, `@dnd-kit/sortable`      | 칸반 드래그 앤 드롭           |
| 2     | `fumadocs-core`, `fumadocs-ui`            | 코드 아카이브 문서 프레임워크 |
| 3     | `@supabase/supabase-js`, `nanoid`         | URL 단축 DB, 코드 생성        |
| 4     | `@codesandbox/sandpack-react` 또는 Codapi | 코드 에디터/실행              |
| 5     | (없음 — Canvas API 활용)                  | 이미지 변환                   |
| 6     | `@excalidraw/excalidraw`                  | 화이트보드                    |
| 7     | `qrcode.react`                            | QR코드 생성                   |
| 8     | `@react-pdf/renderer` (선택)              | PDF 생성                      |
| 9     | (없음 — fetch API 활용)                   | API 클라이언트                |
| 10    | `@xyflow/react`, `dagre`                  | 마인드맵                      |
| 12    | (검토) `@xyflow/react` 또는 Canvas 기반 구현 | ERD 편집기                    |

## 작업 원칙

1. **라우트 단위 독립 개발**: 각 Phase는 독립적으로 개발 및 배포 가능
2. **shadcn/ui 패턴 준수**: 모든 UI는 shadcn/ui 컴포넌트 기반
3. **타입 안전성 우선**: 모든 변경 후 `pnpm type-check` 실행
4. **작은 커밋**: Phase 내 작업 단위로 Conventional Commits
5. **문서 업데이트**: 매 Phase 완료 후 이 spec.md 갱신
6. **번들 최적화**: 대형 라이브러리는 dynamic import + lazy loading 적용
7. **클라이언트 우선**: 가능한 한 서버 의존성 최소화 (URL 단축기 제외)
8. **작업 종료 안내**: 각 작업 완료 보고의 마지막 줄에 "다음 작업"을 한 줄로 명시

## 완료 기준 (Definition of Done)

각 Phase 완료 시:

- [ ] `pnpm lint` 통과
- [ ] `pnpm type-check` 통과
- [ ] 기능 정상 동작 확인 (`pnpm dev`)
- [ ] 반응형 레이아웃 검증
- [ ] 홈페이지 위젯 등록 완료
- [ ] Conventional Commit 작성
- [ ] spec.md 갱신

프로젝트 전체 완료 시:

- [ ] 모든 11개 라우트 정상 동작
- [ ] `pnpm build` 성공
- [ ] 번들 사이즈 적정 수준
- [ ] Side Projects 섹션 UI/UX 일관성

---

**최종 업데이트**: 2026-02-17
**현재 Phase**: Phase 7 완료 → Phase 8 진행 예정 (Invoice Generator)
