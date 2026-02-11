# Link-in-bio 마이그레이션 진행 스펙

이 문서는 `temp/kidorepo/apps/link-in-bio`를 `dongwook.kim`으로 이식하는 현재 진행 상황과 남은 작업을 관리하기 위한 단일 기준 문서입니다.

## 목표
- 동적 로직보다 **UI 이식 우선**으로 페이지를 단계적으로 마이그레이션한다.
- 한 번에 전체 이전하지 않고, 작은 커밋 단위로 안전하게 진행한다.
- 바이너리 파일로 인한 PR 도구 문제를 피하기 위해 필요 시 텍스트 기반 자산(SVG/코드) 우선 전략을 사용한다.

## 현재 진행 상황

### 완료됨
1. **공통 기반 레이어 구성**
   - `shared/utils` 생성 (`cn`, event-listener, toast 등)
   - `shared/ui` 생성 (`Tooltip.v1`, `Spinner.v1`, `BackTop.v1`, `Toast.v2`)
   - 타입 선언 추가 (`types/index.d.ts`)

2. **앱 공통 레이아웃 전환**
   - 기본 Next starter 레이아웃에서 link-in-bio 스타일 레이아웃으로 교체
   - `Header`, `Footer` 추가

3. **홈 화면 1차 이식**
   - 홈 그리드 UI 도입
   - `Tools`, `Skills` 섹션 추가
   - 공통 카드 컴포넌트 `WidgetLink`, `WidgetQuote` 도입 및 일부 카드 전환

4. **PR 호환성 보완**
   - 바이너리 avatar(`png`) 대신 텍스트 기반 `public/avatar.svg` 사용

5. **홈 정적 카드 2차 이식 + 동적 카드 placeholder 추가**
   - 정적 외부 링크 카드(Gumroad/LinkedIn/Dev.to/ProductHunt/Tistory/Disquiet) 반영
   - 동적 위젯(Spotify/Analytics/Scheduling/Map)은 placeholder 카드로 우선 대체

6. **Tools/Skills 아이콘형 UI 개선**
   - 텍스트 약어 배지에서 색상 아이콘 배지로 전환
   - 바이너리 이미지 없이 텍스트 기반 렌더링 컴포넌트로 구성

7. **블로그 페이지 정적 UI 스켈레톤 시작**
   - `/blog` 목록 페이지와 `/blog/[id]` 상세 페이지의 정적 레이아웃 추가
   - 동적 데이터/본문 렌더러 연결 전, 샘플 데이터 기반 구조를 먼저 반영

8. **이력서(`/resume`) 페이지 정적 UI 스켈레톤 시작**
   - 소개/경력/스킬 섹션 중심의 정적 레이아웃 반영
   - 데이터 연동 없이 샘플 데이터 기반으로 구조 확정

9. **블로그 상세 UI placeholder 보강**
   - `/blog/[id]`에 heading/list/code block placeholder 반영
   - Share/Comments 비활성 placeholder 섹션 추가

10. **Widget 규약 문서화 + 홈 placeholder 카드 세분화**
   - `components/Widget/README.md`에 `WidgetLink` props/패턴 초안 문서화
   - 홈의 동적 placeholder를 Spotify/Analytics/Scheduling/Map 개별 카드로 분리

## 현재 남은 작업 (우선순위 순)

### P0 (다음 작업)
1. **동적 로직 단계적 활성화 준비**
   - Notion/Github/Spotify/Analytics/Meeting API 순차 연동을 위한 인터페이스 정리
   - 환경변수 스키마/실패 fallback 정책 문서화

### P2
2. **동적 로직 단계적 활성화**
   - Notion, Github, Spotify, Analytics, Meeting API 순으로 활성화
   - 환경변수/외부 의존 검증은 마지막 단계에서 집중 수행

## 작업 원칙
- 매 작업은 작은 범위(컴포넌트/페이지 단위)로 진행한다.
- 각 단계마다 eslint/tsc 확인 후 커밋한다.
- UI 변경이 있는 경우 가능한 한 스크린샷을 남긴다.
- 이 문서(`spec.md`)를 매 작업마다 갱신한다.

## 다음 작업 체크리스트 (지속 갱신용)
> 작업이 끝날 때마다 아래 체크리스트 상태를 즉시 갱신한다.

- [x] `/resume` 페이지 정적 UI 스켈레톤 시작
- [x] `/blog/[id]` 본문 스타일 placeholder 확장 (heading/list/code)
- [x] `/blog/[id]` 공유/댓글 placeholder 섹션 추가
- [x] `Widget` 공통 props 규약 초안 문서화
- [x] 홈 동적 placeholder 카드 4종(Spotify/Analytics/Scheduling/Map) 분리

- [ ] 동적 API 연동 설계 문서(환경변수/실패 fallback) 작성
