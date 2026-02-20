import { NextResponse } from 'next/server'

import {
  getRefreshTokenFromCookie,
  getSpotifyPlaylistId,
  refreshAccessToken
} from '@/app/api/spotify/_lib'

interface PlayRequest {
  deviceId?: string
  playlistId?: string
}

function normalizePlaylistId(input?: string) {
  if (!input) return undefined

  if (input.includes('spotify:playlist:')) {
    return input.replace('spotify:playlist:', '')
  }

  if (input.includes('open.spotify.com/playlist/')) {
    const [, tail = ''] = input.split('/playlist/')
    const [id = ''] = tail.split('?')
    return id || undefined
  }

  return input
}

export async function PUT(request: Request) {
  const refreshToken = await getRefreshTokenFromCookie()

  if (!refreshToken) {
    return NextResponse.json(
      { ok: false, error: 'Spotify account is not connected.' },
      { status: 401 }
    )
  }

  const body = (await request.json()) as PlayRequest
  const deviceId = body.deviceId?.trim()
  const playlistId = normalizePlaylistId(
    body.playlistId?.trim() || getSpotifyPlaylistId()
  )

  if (!deviceId) {
    return NextResponse.json(
      { ok: false, error: 'Missing Spotify device id.' },
      { status: 400 }
    )
  }

  if (!playlistId) {
    return NextResponse.json(
      { ok: false, error: 'Missing playlist id.' },
      { status: 400 }
    )
  }

  try {
    const refreshed = await refreshAccessToken(refreshToken)

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(deviceId)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${refreshed.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context_uri: `spotify:playlist:${playlistId}`
        }),
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { ok: false, error: `Spotify playback failed: ${errorText}` },
        { status: response.status }
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Failed to start Spotify playback.' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
