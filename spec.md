# Roadmap Spec

이 문서는 앞으로 순차적으로 진행할 작업의 상위 계획을 정리합니다.
세부 기능 정의는 각 항목 작업 시작 시점에 별도로 확정합니다.

## Planned Tasks

1. AI 챗봇 위젯 추가
   - 목표: 홈 대시보드에 AI 챗봇 위젯을 추가하고, `/chat` 전용 페이지에서 대화형 UI 제공
   - 모델: `gemini-2.5-flash-lite` (Google Gemini API)
   - UI 컴포넌트 기준: `https://elements.ai-sdk.dev/`
   - 컴포넌트 정책:
     - `/chat` UI는 AI Elements에서 제공하는 컴포넌트만 사용
     - 사용 범위는 Chatbot 관련 컴포넌트로 한정 (`conversation`, `message`, `prompt-input`, `reasoning`, `sources`, `suggestion` 등)
     - 비허용: Code/IDE 계열 컴포넌트(`code-block`, `file-tree`, `terminal`, `checkpoint`, `plan` 등)
     - 비허용: Voice/Audio 계열 컴포넌트(`voice`, `audio`, waveform/recording 관련 컴포넌트 전반)
     - 초기 단계에서는 첨부/파일 업로드 UI도 제외하고 텍스트 채팅 중심으로 구성
   - 봇 역할/톤: 일반 비서형
   - 범위:
     - 홈 위젯(`WidgetLink` 또는 유사 카드)에서 `/chat`로 진입 가능
     - 홈 위젯에 미리보기 정보 포함 (최근 대화 1건 또는 상태 메시지)
     - `/chat` 페이지에 채팅 UI(대화 목록, 입력창, 전송 버튼, 스트리밍 상태) 구현
     - `app/api/chat/route.ts`(신규)에서 Gemini API 스트리밍 프록시 처리
     - 환경 변수 추가: `GEMINI_API_KEY`
     - 대화 히스토리를 `localStorage`에 임시 저장 (클라이언트 단)
     - API 실패/쿼터 초과/키 누락 시 fallback 메시지 표시
     - 서비스 주제와 무관한 질문에는 고정 응답 반환: "주제와 맞지 않는 질문에는 답변할 수 없습니다."
   - 비범위(초기 단계 제외):
     - 멀티모달(이미지/파일) 업로드
     - 대화 히스토리 DB 저장
   - 완료 기준(DoD):
     - 로컬에서 `/chat` 접근 및 스트리밍 응답 정상 동작
     - 새로고침 후에도 `localStorage`의 임시 대화 히스토리 복원 동작
     - 주제 외 질문에 대해 고정 응답 정책 일관 적용
     - 키 누락/에러 상황에서 UI가 깨지지 않고 안내 문구 표시
     - `pnpm lint`, `pnpm type-check` 통과
   - 구현 메모 (2026-02-20):
     - 로컬 프로필 문서(`content/profile/rag-documents.json`) + 정책(`content/profile/rag-policy.json`) 기반 RAG 구조 적용
     - `scripts/chat/build-rag-index.mjs`로 Gemini 임베딩 인덱스(`content/profile/rag-index.json`) 생성
     - `/api/chat`에서 in-domain 판정, 벡터 검색(topK), strict refuse, NDJSON 스트리밍 응답 처리
     - `/chat`에서 API 연동, 스트리밍 렌더링, citations 배지, out-of-scope/오류 상태 분기, `chat-history-v1` 복원 적용
2. Jest/Playwright 등 테스팅 프레임워크 추가 (Done: 2026-02-20)
   - 범위: Core routes (Chat + Posts API + 홈→/chat 진입)
   - 단위/API 테스트: Jest
   - E2E 테스트: Playwright (Chromium, `/api/chat` mock 고정)
   - 자동화: 로컬 스크립트만 적용 (CI 제외)
3. 다크 모드 추가
4. i18n 추가
   - 목표: 다국어 라우팅 기반으로 콘텐츠 접근성을 높이고, 현재 MDX 기반 블로그를 언어별 콘텐츠 구조로 확장
   - 배경:
     - 현재 `/blog` 하위 경로는 저장소 내 `content/blog/*.mdx`와 Fumadocs 기반으로 글 목록/상세를 구성
     - 언어별 디렉터리 구조를 도입해 동일 슬러그의 번역 콘텐츠를 함께 관리할 필요가 있음
   - 콘텐츠 전략:
     - 언어별 디렉터리 구조를 사용해 동일 슬러그의 번역 콘텐츠를 관리
       - 예시: `content/blog/ko/*.mdx`, `content/blog/en/*.mdx`
     - 기본 언어(ko) + 보조 언어(en) 2개 로케일부터 시작하고, 확장 가능한 구조 유지
   - 라우팅/렌더링 범위:
     - i18n 라우트 세그먼트 도입: `/{locale}/blog`, `/{locale}/blog/[slug]`
     - 기존 `/blog` 진입 시 기본 로케일로 리다이렉트 또는 rewrite 정책 적용
     - 목록/상세 페이지에서 locale 기반으로 MDX 파일을 조회하고 fallback(미번역 시 기본 언어 대체) 처리
   - 메타데이터/SEO:
     - locale별 `title`, `description`, `og` 메타데이터 분기
     - `hreflang`/canonical 정책 명시
     - 포스트 단위 다국어 alternate 링크 생성
   - 구현 원칙:
     - 기존 정적 렌더링 흐름은 유지하되 locale 기준 콘텐츠 조회 레이어만 확장
     - 타입 안전성을 위해 frontmatter 스키마(예: `title`, `description`, `date`, `draft`)를 명확히 정의
   - 단계별 작업(초안):
     - Phase 1) i18n 설정 추가(지원 locale, 기본 locale, locale 유틸)
     - Phase 2) MDX 블로그 컬렉션/파서 구성 및 frontmatter 타입 정의
     - Phase 3) `/blog` 목록/상세를 locale + MDX 기반으로 교체
     - Phase 4) locale fallback 정책 및 관련 문서 업데이트
   - 완료 기준(DoD):
     - `/ko/blog`, `/en/blog` 및 각 상세 페이지가 MDX 기반으로 정상 렌더링
     - 번역 누락 콘텐츠에서 기본 언어 fallback 동작 확인
     - `pnpm lint`, `pnpm type-check` 통과
     - `spec.md` 및 관련 문서에 i18n + MDX 운영 규칙 반영
5. 미니게임 추가
6. 수영 데이터 추가
   - 개요: 아이폰 건강 앱에 기록되는 수영 데이터를 단축어 앱을 이용하여 받아와서 SwimmingWidget으로 렌더링
