import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createSupabaseServiceRoleClient } from '@/utils/api/supabase'

const swimmingPayloadSchema = z.object({
  date: z.string().date(),
  distance: z.number().int().min(0).max(9999),
  source: z.literal('APPLE_WATCH').default('APPLE_WATCH')
})

type ParseResult =
  | { success: true; data: z.infer<typeof swimmingPayloadSchema> }
  | { success: false; error: string }

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
  const configuredToken = process.env.AUTH_TOKEN
  const authToken = request.headers.get('X-Auth-Token')

  if (!configuredToken) {
    console.error('[api/callback/swimming] AUTH_TOKEN is not configured.')

    return NextResponse.json(
      {
        ok: false,
        error: 'Server configuration error'
      },
      { status: 500 }
    )
  }

  if (!authToken || authToken !== configuredToken) {
    console.warn('[api/callback/swimming] unauthorized request.')

    return NextResponse.json(
      {
        ok: false,
        error: 'Unauthorized'
      },
      { status: 401 }
    )
  }

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

  if (parsed.data.distance === 0) {
    return NextResponse.json(
      {
        ok: true,
        skipped: true,
        reason: 'Distance is zero, so insert was skipped',
        data: parsed.data
      },
      { status: 200 }
    )
  }

  const supabase = createSupabaseServiceRoleClient()
  const { error } = await supabase.from('swim_sessions').insert({
    date: parsed.data.date,
    distance: parsed.data.distance,
    source: parsed.data.source
  })

  if (error) {
    console.error('[api/callback/swimming] failed to insert swim session:', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to persist swimming data'
      },
      { status: 500 }
    )
  }

  revalidateTag('widget-swimming-sessions', 'max')

  return NextResponse.json(
    {
      ok: true,
      data: parsed.data
    },
    { status: 200 }
  )
}
