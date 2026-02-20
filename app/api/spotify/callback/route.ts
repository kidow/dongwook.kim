import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import {
  clearOAuthStateCookie,
  exchangeCodeForTokens,
  getOAuthStateCookieName,
  getSpotifyRedirectUri,
  setRefreshTokenCookie
} from '@/app/api/spotify/_lib'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const state = requestUrl.searchParams.get('state')
  const error = requestUrl.searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      new URL('/?spotify=auth_denied', requestUrl.origin)
    )
  }

  const savedState = (await cookies()).get(getOAuthStateCookieName())?.value

  if (!state || !savedState || state !== savedState) {
    await clearOAuthStateCookie()
    return NextResponse.redirect(
      new URL('/?spotify=invalid_state', requestUrl.origin)
    )
  }

  if (!code) {
    await clearOAuthStateCookie()
    return NextResponse.redirect(
      new URL('/?spotify=missing_code', requestUrl.origin)
    )
  }

  try {
    const redirectUri = getSpotifyRedirectUri(requestUrl.origin)
    const tokenResponse = await exchangeCodeForTokens(code, redirectUri)
    await clearOAuthStateCookie()

    if (tokenResponse.refresh_token) {
      await setRefreshTokenCookie(tokenResponse.refresh_token)
    }

    return NextResponse.redirect(
      new URL('/?spotify=connected', requestUrl.origin)
    )
  } catch {
    await clearOAuthStateCookie()
    return NextResponse.redirect(
      new URL('/?spotify=token_error', requestUrl.origin)
    )
  }
}

export const dynamic = 'force-dynamic'
