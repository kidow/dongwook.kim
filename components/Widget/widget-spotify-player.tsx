import SpotifyPlayerClient from '@/components/Widget/widget-spotify-player-client'

interface SpotifyPlaylistTrack {
  title: string
  artists: string[]
  duration: number
  thumbnail: string
}

function pickRandomItems<T>(items: T[], count: number) {
  if (items.length <= count) {
    return items
  }

  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
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

async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim()
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim()

  if (!clientId || !clientSecret) {
    return null
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    }),
    next: { revalidate: 3600 }
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as { access_token?: string }
  return data.access_token ?? null
}

async function getSpotifyPlaylistPreview() {
  try {
    const rawPlaylist = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID?.trim()
    const playlistId = normalizePlaylistId(rawPlaylist)

    if (!playlistId) {
      return {
        tracks: [],
        totalSongs: 0,
        playlistUrl: 'https://open.spotify.com'
      }
    }

    const token = await getSpotifyAccessToken()
    if (!token) {
      return {
        tracks: [],
        totalSongs: 0,
        playlistUrl: `https://open.spotify.com/playlist/${playlistId}`
      }
    }

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}?fields=external_urls.spotify,tracks.total,tracks.items(track(name,duration_ms,preview_url,artists(name),album(images(url))))`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 }
      }
    )

    if (!response.ok) {
      return {
        tracks: [],
        totalSongs: 0,
        playlistUrl: `https://open.spotify.com/playlist/${playlistId}`
      }
    }

    const data = (await response.json()) as {
      external_urls?: { spotify?: string }
      tracks?: {
        total?: number
        items?: Array<{
          track?: {
            name?: string
            duration_ms?: number
            preview_url?: string
            artists?: Array<{ name?: string }>
            album?: { images?: Array<{ url?: string }> }
          }
        }>
      }
    }

    const randomTracks = pickRandomItems(
      (data.tracks?.items ?? [])
        .map(({ track }) => track)
        .filter((track): track is NonNullable<typeof track> =>
          Boolean(track?.name)
        ),
      4
    )

    const tracks: SpotifyPlaylistTrack[] = randomTracks.map((track) => ({
      title: track.name ?? 'Untitled',
      artists: (track.artists ?? [])
        .map((artist) => artist.name)
        .filter((name): name is string => Boolean(name)),
      duration: track.duration_ms ?? 0,
      thumbnail: track.album?.images?.[0]?.url ?? '/profile.webp'
    }))

    return {
      tracks,
      totalSongs: data.tracks?.total ?? tracks.length,
      playlistUrl:
        data.external_urls?.spotify ??
        `https://open.spotify.com/playlist/${playlistId}`
    }
  } catch {
    return {
      tracks: [],
      totalSongs: 0,
      playlistUrl: 'https://open.spotify.com'
    }
  }
}

export default async function WidgetSpotifyPlayer() {
  const { tracks, totalSongs, playlistUrl } = await getSpotifyPlaylistPreview()

  return (
    <SpotifyPlayerClient
      tracks={tracks}
      totalSongs={totalSongs}
      playlistUrl={playlistUrl}
    />
  )
}
