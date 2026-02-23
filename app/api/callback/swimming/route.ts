import { NextResponse } from 'next/server'

type SwimmingCallbackPayload = {
  distance: number
  unit: string
  startAt: string
  endAt: string
  source?: string
}

type ParseResult =
  | { ok: true; data: SwimmingCallbackPayload }
  | { ok: false; error: string }

function getString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function getNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value.trim())
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function getIsoDateString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toISOString()
}

function parsePayload(payload: unknown): ParseResult {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Payload must be a JSON object.' }
  }

  const candidate = payload as Record<string, unknown>
  const distance = getNumber(candidate.distance ?? candidate.value)
  const unit = getString(candidate.unit)
  const startAt = getIsoDateString(candidate.startAt ?? candidate.startDate)
  const endAt = getIsoDateString(candidate.endAt ?? candidate.endDate)
  const source = getString(candidate.source ?? candidate.sourceName) ?? undefined

  if (distance === null) {
    return {
      ok: false,
      error: 'Invalid distance. Use a number or numeric string (e.g. 1200 or "1200").'
    }
  }

  if (!unit) {
    return { ok: false, error: 'Invalid unit. Use a non-empty string (e.g. "m").' }
  }

  if (!startAt) {
    return {
      ok: false,
      error:
        'Invalid startAt. Use startAt/startDate with a parseable date string (e.g. ISO-8601).'
    }
  }

  if (!endAt) {
    return {
      ok: false,
      error:
        'Invalid endAt. Use endAt/endDate with a parseable date string (e.g. ISO-8601).'
    }
  }

  return {
    ok: true,
    data: {
      distance,
      unit,
      startAt,
      endAt,
      source
    }
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown

  const parsed = parsePayload(body)
  if (!parsed.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      ok: true,
      data: {
        ...parsed.data,
        source: parsed.data.source ?? null
      }
    },
    { status: 200 }
  )
}
