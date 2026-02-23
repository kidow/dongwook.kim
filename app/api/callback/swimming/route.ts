import { NextResponse } from 'next/server'
import { z } from 'zod'

const isoDateSchema = z
  .string()
  .trim()
  .min(1, 'Date is required')
  .transform((value) => new Date(value))
  .refine((value) => !Number.isNaN(value.getTime()), {
    message: 'Invalid date format'
  })
  .transform((value) => value.toISOString())

const swimmingPayloadSchema = z.object({
  distance: z.coerce.number().finite(),
  unit: z.string().trim().min(1),
  startAt: isoDateSchema,
  endAt: isoDateSchema,
  source: z.string().trim().min(1).optional()
})

type SwimmingCallbackPayload = z.infer<typeof swimmingPayloadSchema>

type ParseResult =
  | { success: true; data: SwimmingCallbackPayload }
  | { success: false; error: string }

function normalizePayload(payload: unknown): unknown {
  if (!payload || typeof payload !== 'object') {
    return payload
  }

  const candidate = payload as Record<string, unknown>

  return {
    ...candidate,
    distance: candidate.distance ?? candidate.value,
    startAt: candidate.startAt ?? candidate.startDate,
    endAt: candidate.endAt ?? candidate.endDate,
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
  const normalizedBody = normalizePayload(body)

  console.info('[api/callback/swimming] received body:', body)
  console.info('[api/callback/swimming] normalized body:', normalizedBody)

  const parsed = parsePayload(normalizedBody)
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
      data: {
        ...parsed.data,
        source: parsed.data.source ?? null
      }
    },
    { status: 200 }
  )
}
