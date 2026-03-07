# Multi Agents 운영 계획 (Widget Team Model)

## 왜 문서를 다시 정리했는가

이 프로젝트는 실제로 **위젯/툴 단위 기능 묶음**이 명확합니다. 따라서 기존의 "기술 영역 중심(Frontend/Integration/QA/Docs)" 분리보다, 질문 주신 것처럼 **위젯 단위 팀(Pod)** 으로 운영하는 전략이 더 직관적일 수 있습니다.

다만, 처음부터 "위젯마다 개발/디자인/SEO/기타 에이전트 전부"를 붙이면 운영 복잡도가 급증합니다. 이 문서는 그 아이디어를 살리되, 과분할 리스크를 줄인 **실행 가능한 하이브리드 설계**를 제안합니다.

---

## 1) 결론: 좋은 방향이지만, "완전 분리"보다 "하이브리드"가 먼저

질문하신 구성:

- 위젯별 개발 에이전트
- 위젯별 디자인 에이전트
- 위젯별 SEO 에이전트
- 위젯별 QA 에이전트

의 장점은 분명합니다.

- 기능 소유권이 명확해짐
- 컨텍스트 스위칭 감소
- 위젯 단위 실험/개선 속도 향상

하지만 초기에는 아래 문제가 큽니다.

- 에이전트 수 급증으로 조율 비용 증가
- 동일 규칙(접근성/SEO/문서)이 여러 팀에 중복 내재화됨
- 작은 변경에도 핸드오프 단계가 과도하게 늘어남

**권장안:**

1. 위젯별로는 **개발 에이전트(Pod Builder)** 만 분리
2. 디자인/SEO/QA/Docs는 **플랫폼 공통 에이전트**로 중앙화
3. 운영 지표가 안정되면, 트래픽 높은 위젯부터 디자인/SEO를 Pod 내부로 점진 이전

---

## 2) 제안 아키텍처 (Widget Pod + Shared Platform)

```text
Orchestrator
 ├─ Widget Pod Agents (개발 중심)
 │   ├─ Pod: Home Widgets (components/Widget/*, app/page.tsx)
 │   ├─ Pod: Memo (app/memo/*, components/Editor/*)
 │   ├─ Pod: Lunch (app/lunch/*)
 │   └─ Pod: Side Projects (app/{kanban,mindmap,erd-editor,...}/*)
 └─ Shared Platform Agents (공통 품질)
     ├─ Design System Agent
     ├─ SEO Agent
     ├─ QA Agent
     └─ Docs/Spec Agent
```

### 역할 분리 원칙

- **Widget Pod Agent:** 해당 기능의 구현/리팩터링/버그 수정 책임
- **Design System Agent:** 컴포넌트 일관성, 토큰, UI 정책 점검
- **SEO Agent:** 메타데이터, 구조화 데이터, 문서 SEO 체크
- **QA Agent:** lint/type-check/build 및 회귀 시나리오 검증
- **Docs/Spec Agent:** `docs/*`, `spec.md`, 변경 이력 동기화

---

## 3) 이 프로젝트에 맞춘 Pod 정의 (1차)

## Pod A: Home Widget Pod

- 범위: `app/page.tsx`, `components/Widget/*`
- 목표:
  - 홈 대시보드 카드 안정화
  - 소셜/통계/Spotify 위젯 회귀 최소화

## Pod B: Content Pod

- 범위: `app/blog/*`, `app/api/posts/route.ts`, `app/archive/*`, `content/archive/*`
- 목표:
  - 블로그/아카이브 렌더링 안정화
  - Notion 데이터 소스 fallback 유지

## Pod C: Tooling Pod (Side Projects)

- 범위: `app/kanban/*`, `app/mindmap/*`, `app/erd-editor/*`, 기타 툴 라우트
- 목표:
  - fullscreen overlay 패턴 일관 유지
  - 신규 도구 추가 시 레이아웃/상호작용 표준 준수

## Pod D: Integration Pod

- 범위: `app/api/*`, `utils/*`
- 목표:
  - 외부 API 연동 실패 경로(키 누락/토큰 만료) 회귀 방지

> 참고: Pod를 4개 이상 늘리기 전에 "충돌률/리드타임" 지표가 개선되는지 먼저 확인합니다.

---

## 4) "위젯별 디자인/SEO 에이전트"를 언제 분리할까?

아래 기준을 만족할 때만 분리 권장:

- 해당 위젯이 월간 지속 개선 대상(예: 실험 빈도 높음)
- SEO 영향이 독립적으로 크고 측정 가능함
- 공통 플랫폼 에이전트 병목이 명확히 확인됨

즉, **기본은 중앙화**, **성과가 필요한 핵심 위젯만 전담 분리**가 효율적입니다.

---

## 5) 운영 계약 (핸드오프 템플릿)

모든 에이전트는 아래 형식으로 전달합니다.

```json
{
  "task_id": "WIDGET-2026-001",
  "pod": "Tooling Pod",
  "scope": ["app/mindmap/page.tsx", "components/Mindmap/*"],
  "goal": "mindmap interaction 개선",
  "acceptance_criteria": [
    "기존 fullscreen overlay 동작 유지",
    "pnpm lint / pnpm type-check 통과",
    "fallback 동작 회귀 없음"
  ],
  "handoff_to": ["Design System Agent", "QA Agent", "Docs/Spec Agent"],
  "risk": ["클라이언트 번들 사이즈 증가 가능성"]
}
```

핵심은 "자연어 설명"이 아니라 **범위와 완료 기준을 고정하는 것**입니다.

---

## 6) 2주 시작 플랜 (처음 시도 기준)

## Week 1

1. Pod 2개만 시작
   - Home Widget Pod
   - Tooling Pod
2. 공통 품질 에이전트 3개 고정
   - SEO / QA / Docs
3. 공통 게이트
   - `pnpm lint`
   - `pnpm type-check`
   - 라우팅 영향 시 `pnpm build`

## Week 2

1. KPI 측정
   - PR 리드타임
   - 충돌 재작업 횟수
   - CI 실패율
2. 병목 분석
   - SEO/디자인 요청 대기시간
   - Pod 간 파일 충돌 빈도
3. 의사결정
   - 분리 유지 / 단순화 / 특정 위젯 전담 에이전트 추가

---

## 7) 필요한 추가 정보 (정확도 향상)

아래가 있으면 운영 설계를 더 정밀하게 맞출 수 있습니다.

- KPI 우선순위: 속도 vs 품질
- 배포 정책: main 직배포인지, staging 게이트 존재 여부
- 트래픽 상위 위젯 목록: 어떤 Pod를 먼저 강화할지 결정용
- SEO 핵심 페이지 목록: SEO Agent 점검 우선순위 산정용
- 최근 장애 분류: UI/연동/성능 중 어디에 집중할지

---

## 8) 바로 실행 체크리스트

- [ ] Pod별 파일 소유권 확정
- [ ] 공통 에이전트(SEO/QA/Docs) 역할 고정
- [ ] 핸드오프 JSON 템플릿 저장
- [ ] PR 템플릿에 "Pod 결과 / 공통 에이전트 검토" 섹션 추가
- [ ] 2주 파일럿 후 KPI 기반으로 분리 수준 조정
