import { NextResponse } from 'next/server'
import { z } from 'zod'

const swimmingPayloadItemSchema = z.object({
  date: z.string(),
  distance: z.number()
})

const swimmingPayloadSchema = z.array(swimmingPayloadItemSchema).min(1)

type ParseResult =
  | { success: true; data: z.infer<typeof swimmingPayloadSchema> }
  | { success: false; error: string }

function toDateYmd(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString().slice(0, 10)
}

function normalizeItem(item: unknown): unknown {
  if (!item || typeof item !== 'object') {
    return item
  }

  const candidate = item as Record<string, unknown>
  return {
    ...candidate,
    distance: candidate.distance ?? candidate.value,
    date:
      candidate.date ??
      candidate.day ??
      toDateYmd(candidate.startAt ?? candidate.startDate),
    source: candidate.source ?? candidate.sourceName
  }
}

function parsePayload(payload: unknown): ParseResult {
  const parsed = swimmingPayloadSchema.safeParse(payload)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const path = issue?.path?.join('.') || 'payload'
    const message = issue?.message ?? 'Invalid payload'

    return {
      success: false,
      error: `${path}: ${message}`
    }
  }

  return { success: true, data: parsed.data }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown

  console.info('[api/callback/swimming] received body:', body)

  const parsed = parsePayload(body)
  if ('error' in parsed) {
    console.warn(
      '[api/callback/swimming] payload validation failed:',
      parsed.error
    )

    return NextResponse.json(
      {
        ok: false,
        error: parsed.error,
        body: body
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      ok: true,
      data: parsed.data
    },
    { status: 200 }
  )
}
