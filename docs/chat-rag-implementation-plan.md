# Chat RAG 고도화 상세 계획서

## 1. 문서 목적

이 문서는 `/chat` 챗봇의 현재 구현 상태를 기준으로, **원하는 내용을 안정적으로 반영하기 위한 RAG 운영/개선 계획**을 정리합니다.

핵심 목표는 아래 3가지입니다.

1. 답변 정확도 향상 (질문 의도와 문맥 매칭률 개선)
2. 운영 안정성 확보 (인덱스 누락/키 누락/상위 API 오류 대응 강화)
3. 지식 반영 프로세스 표준화 (새 경력/프로젝트 추가 시 재현 가능한 절차)

---

## 2. 현재 구조 요약

### 2.1 엔드투엔드 흐름

1. 사용자가 `/chat` UI에서 질문 입력
2. 클라이언트가 `/api/chat`에 `messages` 전송
3. 서버가 정책 로드 및 in-domain 판단 수행
4. 서버가 RAG 인덱스 로드 및 쿼리 임베딩 수행
5. 벡터 유사도 기반 topK 청크 선택
6. Gemini에 strict prompt로 생성 요청
7. NDJSON 스트리밍(`delta`/`done`)으로 응답 반환
8. UI가 실시간 렌더링 + citation 배지 표시

### 2.2 지식 소스 구성

- 원본 문서: `content/profile/rag-documents.json`
- 정책 파일: `content/profile/rag-policy.json`
- 인덱스 파일: `content/profile/rag-index.json`
- 인덱스 생성 스크립트: `scripts/chat/build-rag-index.mjs`

### 2.3 현 구현의 중요한 동작 포인트

- out-of-scope 판단이 **키워드 포함 기반**으로 작동
- retrieval score threshold 미만이면 거절 응답으로 처리
- 인덱스 없음 / API 키 없음 / upstream 오류는 fallback 메시지로 처리
- 대화 내역은 `localStorage(chat-history-v1)`에 저장

---

## 3. 문제 정의 (RAG 관점)

### 3.1 “학습”의 실질 의미

현재 구조에서 학습은 모델 파인튜닝이 아니라 다음 작업을 의미합니다.

- 지식 문서 추가/수정
- 정책(허용 주제/거절/스타일) 조정
- 임베딩 재생성(인덱스 빌드)

즉, **문서 품질 + 정책 설계 + 인덱싱 품질**이 답변 품질을 결정합니다.

### 3.2 주요 리스크

1. **임베딩 모델 불일치 리스크**
   - 인덱스 생성 시 사용하는 모델과 런타임 질의 임베딩 모델이 다르면 검색 품질이 급감할 수 있음
2. **키워드 기반 도메인 판정의 한계**
   - 표현이 조금만 달라져도 in-domain 질문이 거절될 수 있음
3. **문서 커버리지 부족**
   - 원하는 내용이 문서에 없으면 strict prompt 특성상 좋은 답변이 어려움
4. **운영 절차 비표준화**
   - 새 내용 반영 시 누락/실수(정책 미수정, 인덱스 미재생성) 발생 가능

---

## 4. 목표 상태 (Target)

### 4.1 답변 품질 목표

- in-domain 질문에 대한 유효 응답률 향상
- out-of-scope 거절 정확도 유지
- citation이 실제 근거 문서와 일치

### 4.2 운영 목표

- 문서 수정 → 인덱스 재생성 → 검증까지 표준 루틴 정착
- 모델/환경 변수 일관성 보장
- 실패 시 사용자 경험 저하 최소화

---

## 5. 실행 계획

## Phase 1. 지식베이스 확장 설계

### 5.1 문서 설계 원칙

- 한 문서에는 한 주제를 담는다 (경력 1개, 프로젝트 1개 단위)
- 사실 중심 문장으로 작성한다 (수치, 역할, 결과)
- 중복 문장을 줄이고 검색 키워드를 자연스럽게 포함한다
- `tags`, `priority`, `lang`를 의도적으로 관리한다

### 5.2 문서 템플릿(권장)

```json
{
  "id": "project-<slug>-ko",
  "title": "프로젝트명",
  "section": "project",
  "text": "문제 배경, 내가 한 일, 결과(정량/정성), 사용 기술",
  "tags": ["project", "react", "next.js", "performance"],
  "lang": "ko",
  "priority": 0.95
}
```

### 5.3 즉시 반영 권장 데이터

- 핵심 경력 요약 (기간/역할/성과)
- 대표 프로젝트별 상세 (문제-해결-성과)
- 기술 스택별 강점/사용 맥락
- 협업/운영/문제해결 사례

---

## Phase 2. 정책 정교화

### 6.1 allowedTopics 확장

사용자가 실제로 묻는 표현을 `ko/en`에 추가합니다.

예시(ko):

- 강점, 성과, 문제해결, 협업, 아키텍처, 성능, 최적화, 트러블슈팅

예시(en):

- strengths, achievements, problem solving, collaboration, architecture, performance, optimization, troubleshooting

### 6.2 retrieval 파라미터 운영 가이드

- `topK`: 초기 6 유지, 문서량 증가 시 6~10 범위 실험
- `scoreThreshold`: 초기 0.68 유지, 거절 과다 시 소폭 하향(예: 0.64)

> 변경 시에는 질문셋 회귀 테스트로 false positive/negative를 함께 확인합니다.

---

## Phase 3. 인덱싱/모델 일관성 확보

### 7.1 원칙

- 인덱스 생성 모델과 런타임 질의 모델을 반드시 동일하게 유지
- 운영 환경에서 `GEMINI_EMBED_MODEL`을 단일 값으로 고정

### 7.2 운영 절차

1. `.env.local` 또는 배포 환경 변수에 `GEMINI_EMBED_MODEL` 지정
2. `pnpm rag:build`로 인덱스 재생성
3. 생성된 `rag-index.json`의 `embeddingModel`, `createdAt` 확인
4. `/chat`에서 대표 질문셋 수동 검증

---

## Phase 4. 검증 체계 강화

### 8.1 수동 검증 질문셋 (권장)

- in-domain (기술 스택, 프로젝트, 경력)
- 경계 질문 (애매한 표현)
- out-of-scope (날씨, 시사, 일반 상식)
- 실패 경로 (인덱스 없음, 키 누락 시 fallback)

### 8.2 자동 검증 유지/확장

- API route 테스트: out-of-scope, index_missing, fallback, success 스트림
- E2E 테스트: `/chat` 진입, 스트리밍 렌더링, 히스토리 복원

---

## 6. 표준 운영 Runbook

### 9.1 새 지식 반영 체크리스트

1. `rag-documents.json`에 문서 추가/수정
2. `rag-policy.json` 키워드/정책 검토
3. `GEMINI_EMBED_MODEL` 값 확인
4. `pnpm rag:build` 실행
5. `pnpm type-check` 실행
6. `/chat` 질문셋 검증
7. 변경사항 커밋

### 9.2 장애 대응 가이드

- `index_missing` 발생: 인덱스 파일 누락/배포 누락 여부 확인 후 재생성
- `missing_key` 발생: `GEMINI_API_KEY` 주입 확인
- `upstream_error` 발생: 외부 API 상태/쿼터 확인 + fallback 메시지 유지

---

## 7. 우선순위 백로그

### P0 (즉시)

- 지식 문서 확장
- allowedTopics 확장
- 임베딩 모델 일치성 보장

### P1 (단기)

- 문서 작성 템플릿/가이드 정착
- 대표 질문셋을 문서화해 회귀 검증 루틴 정착

### P2 (중기)

- 도메인 판정 고도화(키워드 + 보조 분류)
- citation 신뢰도 향상을 위한 청크 품질 최적화

---

## 8. 완료 기준 (DoD)

- 원하는 신규 지식이 `rag-documents.json`에 반영되어 검색됨
- in-domain 질문 응답 품질이 기존 대비 개선됨
- out-of-scope 거절 정책이 일관되게 유지됨
- 인덱스/모델 불일치 이슈 없이 운영됨
- 표준 Runbook으로 동일 작업을 재현 가능함

---

## 9. 참고 구현 파일

- Chat API: `app/api/chat/route.ts`
- Chat UI: `components/Chat/index.tsx`
- 정책: `utils/chat/policy.ts`, `content/profile/rag-policy.json`
- 프롬프트: `utils/chat/prompt.ts`
- Gemini 연동: `utils/chat/gemini.ts`
- 검색: `utils/chat/rag/retrieve.ts`
- 인덱스 로더: `utils/chat/rag/load-index.ts`
- 인덱스 빌더: `scripts/chat/build-rag-index.mjs`
- 원본 문서: `content/profile/rag-documents.json`
