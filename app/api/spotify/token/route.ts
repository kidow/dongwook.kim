import { NextResponse } from 'next/server'

import {
  getRefreshTokenFromCookie,
  refreshAccessToken,
  setRefreshTokenCookie
} from '@/app/api/spotify/_lib'

export async function GET() {
  const refreshToken = await getRefreshTokenFromCookie()

  if (!refreshToken) {
    return NextResponse.json(
      { ok: false, error: 'Spotify account is not connected.' },
      { status: 401 }
    )
  }

  try {
    const refreshed = await refreshAccessToken(refreshToken)

    if (refreshed.refresh_token) {
      await setRefreshTokenCookie(refreshed.refresh_token)
    }

    return NextResponse.json({
      ok: true,
      accessToken: refreshed.access_token,
      expiresIn: refreshed.expires_in
    })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Failed to refresh Spotify access token.' },
      { status: 401 }
    )
  }
}

export const dynamic = 'force-dynamic'
