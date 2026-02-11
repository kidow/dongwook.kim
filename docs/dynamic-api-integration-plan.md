# Dynamic API 연동 설계 문서 (초안)

Link-in-bio의 동적 위젯(Notion, Github, Spotify, Analytics, Meeting API)을 단계적으로 활성화하기 위한 설계 초안입니다.

## 1) 연동 순서

1. **Notion (blog/resume 데이터 소스)**
2. **Github (프로필/활동 요약)**
3. **Spotify (최근 재생/트랙 카드)**
4. **Analytics (방문 지표 카드)**
5. **Meeting API (일정/예약 카드)**

> 원칙: 한 번에 하나의 API만 활성화하고, 각 단계에서 fallback UI + 빌드/런타임 검증을 통과한 뒤 다음 단계로 진행한다.

---

## 2) 공통 인터페이스 규칙

모든 동적 위젯은 아래 계약을 따른다.

- 서버 함수는 `Promise<Result<T>>` 형태를 반환한다.
- 실패 시 throw 대신 `ok: false` 형태를 반환해 UI fallback으로 연결한다.
- UI 컴포넌트는 `ok` 여부로 정상 카드/placeholder를 분기한다.

```ts
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; source: string }
```

### 최소 구현 가이드

- 데이터 fetch 레이어: `app/api` 또는 `shared/utils/api/*`
- UI 레이어: `components/Widget/*`
- 환경변수 파싱/검증: `shared/utils/env.ts` (추후 생성)

---

## 3) 환경변수 스키마 (초안)

### Notion
- `NOTION_SECRET_KEY`
- `NOTION_DATABASE_ID`

### Github
- `GITHUB_TOKEN` (선택: unauthenticated fallback 허용)
- `GITHUB_USERNAME`

### Spotify
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

### Analytics
- `GA_PROPERTY_ID` 또는 내부 analytics source key
- `GA_CLIENT_EMAIL`
- `GA_PRIVATE_KEY`

### Meeting API
- `MEETING_API_KEY`
- `MEETING_API_URL`

### 공통
- 누락/빈 문자열/형식 오류 시 해당 위젯은 즉시 fallback 모드로 전환
- 민감 정보는 서버 전용 경로에서만 접근

---

## 4) 실패 fallback 정책

각 위젯은 3단계 fallback을 갖는다.

1. **Loading fallback**: skeleton card
2. **Error fallback**: 사용자에게 의미 있는 메시지를 가진 placeholder
3. **Hard fallback**: 외부 API가 장시간 실패해도 정적 링크 카드로 유지

### 사용자 메시지 원칙
- 내부 에러를 직접 노출하지 않는다.
- 한국어 한 줄 요약 + 재시도/대체 링크 제공.

예시:
- "현재 Github 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."

---

## 5) API별 완료 기준 (Definition of Done)

각 API 활성화 커밋은 아래 조건을 만족해야 한다.

- [ ] 관련 env 누락 시 빌드/런타임에서 크래시하지 않는다.
- [ ] 정상 데이터 렌더링 + fallback 렌더링 모두 확인한다.
- [ ] `pnpm exec tsc --noEmit` 통과
- [ ] `pnpm build` 통과
- [ ] UI 변경 스크린샷 첨부
- [ ] `spec.md` 체크리스트 상태 갱신

---

## 6) 단계별 실행 체크리스트

- [ ] Step 1: Notion API 래퍼 + blog/resume 데이터 연결
- [ ] Step 2: Github 위젯 실제 데이터 연결
- [ ] Step 3: Spotify 위젯 실제 데이터 연결
- [ ] Step 4: Analytics 위젯 실제 데이터 연결
- [ ] Step 5: Meeting/Scheduling 위젯 실제 데이터 연결

