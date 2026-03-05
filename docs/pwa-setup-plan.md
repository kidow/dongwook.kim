# PWA 세팅 상세 계획

## 1. 목표와 범위

이 문서는 현재 Next.js App Router 기반 프로젝트에 **점진적으로 PWA를 도입**하기 위한 실행 계획입니다.

### 목표

- 오프라인/저속 네트워크에서 핵심 화면의 기본 접근성 확보
- 설치 가능한 웹앱(Installable Web App) 구성
- 캐시 전략을 통해 재방문 성능 개선
- 기존 외부 연동(Notion/Spotify/GA 등) 실패 fallback 동작은 유지

### 범위

- `manifest.webmanifest` 구성
- 앱 아이콘/스크린샷 등 PWA 에셋 추가
- Service Worker 등록 및 캐시 전략 수립
- 오프라인 페이지(`offline`) 및 기본 fallback UX 제공
- Lighthouse/PWA 체크리스트 기반 검증

### 비범위(초기 단계)

- 푸시 알림(Web Push)
- 백그라운드 동기화(Background Sync)
- 모든 라우트의 완전 오프라인 보장

---

## 2. 현재 상태 점검 (as-is)

- Next.js App Router 구조, `app/layout.tsx`에서 전역 메타데이터를 사용 중
- PWA 관련 설정 파일(`manifest.webmanifest`, SW 파일, 등록 로직)은 현재 없음
- `next.config.ts`에는 MDX/이미지 설정만 존재
- `public/`에는 이미지 리소스는 있으나 PWA 전용 아이콘 세트(192/512 등) 표준화 필요

---

## 3. 구현 전략 (to-be)

초기 안정성을 위해 **3단계 rollout**을 권장합니다.

1. **기초 세팅**: manifest + 아이콘 + 메타데이터 연결
2. **오프라인 대응**: Service Worker 등록 + 정적 자산/핵심 경로 캐시
3. **운영 고도화**: 런타임 캐시 세분화 + 버전 관리 + 모니터링

---

## 4. 단계별 실행 계획

## Phase 1) Manifest/메타데이터/에셋 준비

### 작업 항목

- `public/manifest.webmanifest` 생성
- 앱 아이콘 생성
  - 필수: `192x192`, `512x512` PNG
  - 권장: maskable 아이콘 추가
- 설치 UI 품질 향상을 위한 screenshot 항목(선택) 추가
- `app/layout.tsx`의 metadata에 manifest/아이콘/테마색 연결

### 산출물

- `public/manifest.webmanifest`
- `public/icons/*` (예: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`)
- `app/layout.tsx` metadata 업데이트

### 완료 기준

- Chrome DevTools > Application > Manifest에서 오류 없음
- “앱 설치 가능” 조건 충족(기본)

---

## Phase 2) Service Worker + 오프라인 fallback

### 작업 항목

- SW 도입 방식 선택
  - 옵션 A: `next-pwa` 사용 (구현 속도 유리)
  - 옵션 B: 커스텀 SW (`public/sw.js`) + 수동 등록 (세밀 제어 유리)
- `app` 클라이언트 엔트리(예: `components` 내 전역 클라이언트 컴포넌트)에서 SW 등록
- 오프라인 fallback 페이지 구성
  - 예: `app/offline/page.tsx`
- 캐시 전략 정의
  - App Shell/정적 리소스: Cache First
  - API/동적 데이터: Network First + 실패 시 fallback

### 산출물

- `public/sw.js` 또는 `next-pwa` 설정 반영된 빌드 산출
- SW 등록용 클라이언트 코드 (예: `components/pwa/register-sw.tsx`)
- `app/offline/page.tsx`

### 완료 기준

- 네트워크 offline 시 최소 1개 핵심 라우트가 fallback 렌더링
- 새 배포 후 SW 업데이트가 정상 반영(구버전 고착 없음)

---

## Phase 3) 캐시 정책 고도화 + 운영 안정화

### 작업 항목

- 라우트/리소스 성격별 런타임 캐시 분리
  - 정적 이미지
  - 외부 API 응답(필요시 TTL 적용)
- 캐시 버전 전략 수립
  - `CACHE_VERSION` 기반 invalidation
- 장애/회귀 대응 문서화
  - SW 비활성화/롤백 절차

### 산출물

- 캐시 전략 주석/문서화
- 운영 체크리스트(배포 전/후)

### 완료 기준

- Lighthouse PWA 주요 항목 pass
- 릴리즈 후 캐시 관련 사용자 이슈(오래된 번들 노출) 최소화

---

## 5. 필요한 파일/정보 목록

아래 항목이 준비되어야 구현을 빠르게 진행할 수 있습니다.

## A) 필수 파일

- `public/manifest.webmanifest`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- (권장) `public/icons/icon-maskable-512.png`
- SW 파일(선택한 전략에 따라)
  - `public/sw.js` **또는** `next-pwa` 관련 설정 파일

## B) 수정 대상 파일(예상)

- `app/layout.tsx` (metadata에 manifest/icons/themeColor 반영)
- `next.config.ts` (`next-pwa` 선택 시 플러그인 설정)
- SW 등록용 클라이언트 컴포넌트 파일 신규 추가
- `app/offline/page.tsx` 신규 추가

## C) 의사결정에 필요한 정보

- 앱 이름/짧은 이름(국문/영문)
- 기본 테마 색상, 배경 색상
- 홈 시작 URL 및 scope
- 아이콘 원본 파일(SVG/PNG) 제공 여부
- 오프라인 우선 지원 라우트 우선순위
  - 예: `/`, `/blog`, `/memo` 등

## D) 운영/보안 관련 정보

- 배포 환경(Vercel) 기준 헤더 정책(CSP 등) 영향 여부
- 외부 API 캐시 허용 범위(개인화 데이터 제외 여부)

---

## 6. 권장 Manifest 초안 스펙

```json
{
  "name": "dongwook.kim",
  "short_name": "kidow",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0b1020",
  "theme_color": "#4f46e5",
  "lang": "ko-KR",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

> 색상 값은 실제 디자인 토큰에 맞춰 최종 조정이 필요합니다.

---

## 7. 검증 계획

## 로컬 검증

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm dev
```

브라우저 확인:

- Application > Manifest 오류 여부
- Application > Service Workers 등록/업데이트 동작
- Network > Offline 상태에서 fallback 페이지 동작

## 품질 지표

- Lighthouse(PWA, Best Practices, Performance) 비교
- 재방문 시 LCP/TTFB 개선 여부(체감 + 계측)

---

## 8. 리스크와 대응

- **리스크:** SW 캐시로 인해 구버전 JS가 잔존
  - **대응:** 버전 키 기반 캐시 무효화 + activate 단계 정리
- **리스크:** 외부 API 응답 캐시로 데이터 신선도 저하
  - **대응:** 동적 API는 Network First + 짧은 TTL
- **리스크:** 특정 라우트에서 오프라인 시 UX 붕괴
  - **대응:** 라우트별 최소 fallback 컴포넌트 정의

---

## 9. 일정 제안

- Day 1: Phase 1 완료(manifest/아이콘/metadata)
- Day 2: Phase 2 완료(SW + offline fallback)
- Day 3: Phase 3 완료(캐시 고도화 + 검증/문서화)

총 2~3일 내 MVP 수준 PWA 적용 가능.

---

## 10. 완료 정의 (DoD)

- 설치 가능한 PWA 조건 충족
- 핵심 라우트 오프라인 fallback 제공
- lint/type-check/build 통과
- 운영 문서(본 문서 + 롤백 절차) 최신화
