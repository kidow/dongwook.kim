import { NextResponse } from 'next/server'

import {
  getSpotifyCredentials,
  getSpotifyRedirectUri,
  setOAuthStateCookie
} from '@/app/api/spotify/_lib'

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-modify-playback-state',
  'user-read-playback-state'
]

export async function GET(request: Request) {
  const { clientId } = getSpotifyCredentials()

  if (!clientId) {
    return NextResponse.json(
      { ok: false, error: 'Missing SPOTIFY_CLIENT_ID' },
      { status: 500 }
    )
  }

  const requestUrl = new URL(request.url)
  const redirectUri = getSpotifyRedirectUri(requestUrl.origin)
  const state = crypto.randomUUID()
  await setOAuthStateCookie(state)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: SPOTIFY_SCOPES.join(' '),
    redirect_uri: redirectUri,
    state,
    show_dialog: 'true'
  })

  const authorizeUrl = `${SPOTIFY_AUTH_URL}?${params.toString()}`

  return NextResponse.redirect(authorizeUrl)
}

export const dynamic = 'force-dynamic'
