import { NextResponse } from 'next/server'
import { z } from 'zod'

const swimmingPayloadSchema = z.object({
  date: z.string(),
  distance: z.number()
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
  const authorization = request.headers.get('X-Auth-Token')
  const bearerToken = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null

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

  if (!bearerToken || bearerToken !== configuredToken) {
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

  return NextResponse.json(
    {
      ok: true,
      data: parsed.data
    },
    { status: 200 }
  )
}
