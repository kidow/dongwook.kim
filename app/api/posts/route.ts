import { NextResponse } from 'next/server'

import { getBlogPostSummaries } from '@/lib/blog'

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: getBlogPostSummaries()
  })
}
