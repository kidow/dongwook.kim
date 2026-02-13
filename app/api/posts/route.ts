import { NextResponse } from 'next/server'

import { getNotionBlogPosts } from '@/shared/utils/api/notion'

export async function GET() {
  const postsResult = await getNotionBlogPosts()

  if (!postsResult.ok) {
    return NextResponse.json(postsResult, { status: 200 })
  }

  return NextResponse.json(postsResult)
}
