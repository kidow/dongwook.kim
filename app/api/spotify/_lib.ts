import { cookies } from 'next/headers'

const SPOTIFY_ACCOUNTS_API = 'https://accounts.spotify.com/api/token'
const REFRESH_TOKEN_COOKIE = 'spotify_refresh_token'
const OAUTH_STATE_COOKIE = 'spotify_oauth_state'

function readEnv(key: string): string | undefined {
  const value = process.env[key]?.trim()
  return value || undefined
}

export function getSpotifyCredentials() {
  return {
    clientId: readEnv('SPOTIFY_CLIENT_ID'),
    clientSecret: readEnv('SPOTIFY_CLIENT_SECRET')
  }
}

export function getSpotifyPlaylistId() {
  return readEnv('NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID')
}

export function getSpotifyRedirectUri(origin: string) {
  const baseUrl = readEnv('NEXT_PUBLIC_BASE_URL') ?? origin
  return new URL('/api/spotify/callback', baseUrl).toString()
}

export function getOAuthStateCookieName() {
  return OAUTH_STATE_COOKIE
}

export async function setOAuthStateCookie(state: string) {
  const store = await cookies()
  store.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10
  })
}

export async function clearOAuthStateCookie() {
  const store = await cookies()
  store.delete(OAUTH_STATE_COOKIE)
}

export async function setRefreshTokenCookie(refreshToken: string) {
  const store = await cookies()
  store.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })
}

export async function getRefreshTokenFromCookie() {
  return (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value
}

export async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const credentials = getSpotifyCredentials()

  if (!credentials.clientId || !credentials.clientSecret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET')
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri
  })

  const response = await fetch(SPOTIFY_ACCOUNTS_API, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString(),
    cache: 'no-store'
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Spotify token exchange failed: ${errorText}`)
  }

  return (await response.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
  }
}

export async function refreshAccessToken(refreshToken: string) {
  const credentials = getSpotifyCredentials()

  if (!credentials.clientId || !credentials.clientSecret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET')
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  })

  const response = await fetch(SPOTIFY_ACCOUNTS_API, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString(),
    cache: 'no-store'
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Spotify refresh failed: ${errorText}`)
  }

  return (await response.json()) as {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token?: string
  }
}
