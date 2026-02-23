import { NextResponse } from 'next/server'

type SwimmingCallbackPayload = {
  distance: number
  unit: string
  startAt: string
  endAt: string
  source?: string
}

function isValidPayload(payload: unknown): payload is SwimmingCallbackPayload {
  if (!payload || typeof payload !== 'object') {
    return false
  }

  const candidate = payload as Partial<SwimmingCallbackPayload>

  return (
    typeof candidate.distance === 'number' &&
    Number.isFinite(candidate.distance) &&
    typeof candidate.unit === 'string' &&
    candidate.unit.trim().length > 0 &&
    typeof candidate.startAt === 'string' &&
    candidate.startAt.trim().length > 0 &&
    typeof candidate.endAt === 'string' &&
    candidate.endAt.trim().length > 0 &&
    (candidate.source === undefined || typeof candidate.source === 'string')
  )
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown

  if (!isValidPayload(body)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Invalid payload. Required fields: distance(number), unit(string), startAt(string), endAt(string).'
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      ok: true,
      data: {
        distance: body.distance,
        unit: body.unit,
        startAt: body.startAt,
        endAt: body.endAt,
        source: body.source ?? null
      }
    },
    { status: 200 }
  )
}
