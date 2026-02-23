# iPhone 건강 앱 수영 데이터 웹 연동 가이드 (Shortcuts + Next.js + Supabase)

이 문서는 **iPhone 건강(Health) 앱의 수영 데이터**를 웹에서 보여주기 위한 시작 방법을 정리합니다.

> 전제: Apple Health 데이터는 웹 서버에서 직접 읽을 수 없으므로, iOS 측(Shortcuts 또는 앱)에서 데이터를 꺼내 서버로 전달해야 합니다.

---

## 1) 권장 아키텍처

1. iOS 단축어에서 건강 샘플(수영) 조회
2. JSON 형태로 가공
3. Next.js API Route(Webhook)로 POST
4. 서버에서 유효성 검증 + Supabase 저장
5. 홈 대시보드의 **Swimming Widget**에서 통계/차트 렌더링

```text
Apple Health -> Shortcuts -> POST /api/health/swimming -> Supabase -> Home Swimming Widget
```

---

## 2) 데이터 스키마 먼저 확정하기

최소 필드는 아래처럼 잡는 것을 권장합니다.

- `idempotency_key`: 중복 저장 방지 키
- `source`: `apple-health-shortcuts` 등
- `start_at`, `end_at` (ISO 문자열)
- `distance_m` (미터)
- `duration_sec` (초)
- `energy_kcal` (선택)
- `stroke_type` (선택, 자유형/평영 등)
- `recorded_at` (단축어가 전송한 시각)
- `raw_payload` (원본 디버깅 보관)

### idempotency_key 예시

```text
sha256(start_at + end_at + distance_m + source)
```

고유 키를 만들어 두면 단축어를 여러 번 실행해도 같은 수영 세션이 중복 적재되지 않습니다.

---

## 3) Next.js 수집 API 구현 (예시)

`app/api/health/swimming/route.ts`를 생성하고, 최소한의 유효성 검증 + 인증을 넣습니다.

```ts
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

const WEBHOOK_TOKEN = process.env.HEALTH_WEBHOOK_TOKEN;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type IncomingSession = {
  source?: string;
  startAt?: string;
  endAt?: string;
  distanceM?: number;
  durationSec?: number;
  energyKcal?: number;
  strokeType?: string;
  recordedAt?: string;
};

function makeIdempotencyKey(v: IncomingSession) {
  const raw = `${v.startAt ?? ""}|${v.endAt ?? ""}|${v.distanceM ?? ""}|${v.source ?? ""}`;
  return createHash("sha256").update(raw).digest("hex");
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!WEBHOOK_TOKEN || auth !== `Bearer ${WEBHOOK_TOKEN}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { sessions?: IncomingSession[] };
  const sessions = body.sessions ?? [];

  const rows = sessions
    .filter((s) => s.startAt && s.endAt && typeof s.distanceM === "number")
    .map((s) => ({
      idempotency_key: makeIdempotencyKey(s),
      source: s.source ?? "apple-health-shortcuts",
      start_at: s.startAt,
      end_at: s.endAt,
      distance_m: s.distanceM,
      duration_sec: s.durationSec ?? null,
      energy_kcal: s.energyKcal ?? null,
      stroke_type: s.strokeType ?? null,
      recorded_at: s.recordedAt ?? new Date().toISOString(),
      raw_payload: s,
    }));

  const { error } = await supabase
    .from("swim_sessions")
    .upsert(rows, { onConflict: "idempotency_key", ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, accepted: rows.length });
}
```

### 인증/키 최소 권장

- `Authorization: Bearer <HEALTH_WEBHOOK_TOKEN>` 헤더를 필수화
- 서버에서만 `SUPABASE_SERVICE_ROLE_KEY` 사용
- 토큰/키는 `.env`에 저장하고 클라이언트 번들에 노출 금지

---

## 4) iOS 단축어(Shortcuts) 구성 단계

아래 흐름으로 단축어를 만듭니다.

1. **건강 샘플 찾기(Find Health Samples)**
   - Type: Swimming Distance(또는 수영 운동 기록 기반)
   - 기간: 최근 7일/30일
2. **반복(Repeat with each)**
   - 샘플별 `startDate`, `endDate`, `value`, `unit` 추출
3. **사전(Dictionary) 만들기**
   - `startAt`, `endAt`, `distanceM`, `durationSec`, `source` 구성
4. **목록(List)에 추가**
   - 각 세션 Dictionary 누적
5. **텍스트(JSON) 생성**
   - `{ "sessions": [...] }` 형식
6. **URL 가져오기(Get Contents of URL)**
   - Method: `POST`
   - URL: `https://<your-domain>/api/health/swimming`
   - Headers: `Authorization: Bearer <HEALTH_WEBHOOK_TOKEN>`
   - Body: JSON
7. 자동화(Automation) 연결
   - 매일 밤 10시, 또는 운동 종료 후 실행

> iOS 버전에 따라 액션 이름은 조금 다를 수 있습니다.

---

## 5) Supabase 테이블 예시

```sql
create table if not exists public.swim_sessions (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  source text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  distance_m numeric not null,
  duration_sec integer,
  energy_kcal numeric,
  stroke_type text,
  recorded_at timestamptz not null,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists swim_sessions_start_at_idx
  on public.swim_sessions (start_at desc);
```

`updated_at` 자동 갱신이 필요하면 trigger를 추가하세요.

---

## 6) Swimming Widget에서 처음 보여줄 지표 (MVP)

- 오늘/이번 주/이번 달 총 수영 거리
- 최근 10회 세션 리스트 (거리, 시간, 페이스)
- 주간 거리 추이 차트
- 평균 페이스(100m 기준)

### 페이스 계산 예시

```text
paceSecPer100m = (durationSec / distanceM) * 100
```

단, `distanceM`가 0이거나 누락된 데이터는 계산에서 제외하세요.

---

## 7) 운영 체크리스트

- HTTPS 강제
- 토큰 주기적 교체
- 요청/응답 로깅 시 민감정보 마스킹
- 재전송 대비 idempotency 보장
- 시간대 통일(저장 UTC, 화면 표시 로컬)
- 위젯 장애 시 fallback 카드/문구 유지

---

## 8) 빠른 시작 순서 (1주)

- Day 1: 수집 스키마 확정 + Supabase 테이블 생성
- Day 2: `POST /api/health/swimming` 구현
- Day 3: 단축어로 샘플 10건 전송 성공
- Day 4: 홈에 Swimming Widget 기본 카드 렌더링
- Day 5: 주간/월간 통계 + 차트 연결
- Day 6: 자동화(스케줄 실행) 적용
- Day 7: 에러 핸들링/중복 방지 점검

---

## 9) 자주 부딪히는 이슈

- **Q. 웹에서 Apple Health OAuth로 직접 못 가져오나요?**
  - A. 일반 웹 서버에서 직접 Health 데이터 접근은 어렵고, iOS 측 중간 레이어가 필요합니다.
- **Q. 같은 세션이 계속 중복 저장됩니다.**
  - A. `idempotency_key UNIQUE` + upsert로 해결하세요.
- **Q. 거리가 m가 아니라 km로 들어옵니다.**
  - A. 수집 시점에 단위 정규화를 강제하세요 (`distance_m`).

이 문서를 기반으로 구현하면, 처음에는 반자동으로 시작하고 이후 자동화까지 자연스럽게 확장할 수 있습니다.
