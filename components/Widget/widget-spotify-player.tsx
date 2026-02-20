'use client'
/* eslint-disable no-unused-vars */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { SkipForwardIcon } from 'lucide-react'

import * as Icon from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type PlayerStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'unauthenticated'
  | 'error'

interface SpotifyTrackInfo {
  title: string
  artist: string
}

interface SpotifyPlayerState {
  paused: boolean
  track_window: {
    current_track: {
      name: string
      artists: Array<{ name: string }>
    }
  }
}

interface SpotifyPlayerInstance {
  connect: () => Promise<boolean>
  disconnect: () => void
  addListener: (...args: unknown[]) => boolean
  nextTrack: () => Promise<void>
  togglePlay: () => Promise<void>
}

interface SpotifyPlayerOptions {
  name: string
  getOAuthToken: (cb: (token: string) => void) => void
  volume?: number
}

interface SpotifySdkNamespace {
  Player: new (options: SpotifyPlayerOptions) => SpotifyPlayerInstance
}

const SPOTIFY_PLAYER_SCRIPT = 'https://sdk.scdn.co/spotify-player.js'
const DEFAULT_PLAYLIST_ID = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID ?? ''
let spotifySdkPromise: Promise<SpotifySdkNamespace | null> | null = null

function loadSpotifySdk() {
  if (spotifySdkPromise) return spotifySdkPromise

  spotifySdkPromise = new Promise((resolve) => {
    const playerWindow = window as Window & {
      Spotify?: SpotifySdkNamespace
      onSpotifyWebPlaybackSDKReady?: () => void
    }

    if (playerWindow.Spotify) {
      resolve(playerWindow.Spotify)
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SPOTIFY_PLAYER_SCRIPT}"]`
    )

    if (!existing) {
      const script = document.createElement('script')
      script.src = SPOTIFY_PLAYER_SCRIPT
      script.async = true
      document.body.appendChild(script)
    }

    playerWindow.onSpotifyWebPlaybackSDKReady = () => {
      resolve(playerWindow.Spotify ?? null)
    }
  })

  return spotifySdkPromise
}

async function requestAccessToken() {
  const response = await fetch('/api/spotify/token', { cache: 'no-store' })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as { accessToken?: string }
  return data.accessToken ?? null
}

export default function WidgetSpotifyPlayer() {
  const [status, setStatus] = useState<PlayerStatus>('idle')
  const [player, setPlayer] = useState<SpotifyPlayerInstance | null>(null)
  const [deviceId, setDeviceId] = useState<string>('')
  const [trackInfo, setTrackInfo] = useState<SpotifyTrackInfo | null>(null)
  const [isPaused, setIsPaused] = useState(true)
  const [playlistId, setPlaylistId] = useState(DEFAULT_PLAYLIST_ID)
  const [actionMessage, setActionMessage] = useState('')

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'loading':
        return 'Connecting Spotify SDK...'
      case 'ready':
        return 'Connected'
      case 'unauthenticated':
        return 'Login required'
      case 'error':
        return 'Connection failed'
      default:
        return 'Waiting'
    }
  }, [status])

  useEffect(() => {
    let mounted = true
    let currentPlayer: SpotifyPlayerInstance | null = null

    const setupPlayer = async () => {
      setStatus('loading')

      const sdk = await loadSpotifySdk()
      if (!sdk || !mounted) {
        setStatus('error')
        return
      }

      currentPlayer = new sdk.Player({
        name: 'Kidow Web Player',
        volume: 0.7,
        getOAuthToken: async (cb) => {
          const token = await requestAccessToken()
          if (!token) {
            setStatus('unauthenticated')
            return
          }
          cb(token)
        }
      })

      currentPlayer.addListener('ready', (payload?: { device_id: string }) => {
        if (!mounted || !payload?.device_id) return
        setDeviceId(payload.device_id)
        setStatus('ready')
        setActionMessage('')
      })

      currentPlayer.addListener('authentication_error', () => {
        if (!mounted) return
        setStatus('unauthenticated')
      })

      currentPlayer.addListener('account_error', () => {
        if (!mounted) return
        setStatus('error')
        setActionMessage('Spotify Premium account is required for Web Playback.')
      })

      currentPlayer.addListener('initialization_error', () => {
        if (!mounted) return
        setStatus('error')
      })

      currentPlayer.addListener('player_state_changed', (state?: SpotifyPlayerState) => {
        if (!mounted || !state) return

        setIsPaused(state.paused)
        setTrackInfo({
          title: state.track_window.current_track.name,
          artist: state.track_window.current_track.artists
            .map((artist) => artist.name)
            .join(', ')
        })
      })

      const connected = await currentPlayer.connect()

      if (!connected && mounted) {
        setStatus('unauthenticated')
      }

      setPlayer(currentPlayer)
    }

    setupPlayer()

    return () => {
      mounted = false
      currentPlayer?.disconnect()
    }
  }, [])

  const handleTogglePlayback = useCallback(async () => {
    if (!player || status !== 'ready') return
    await player.togglePlay()
  }, [player, status])

  const handleNextTrack = useCallback(async () => {
    if (!player || status !== 'ready') return
    await player.nextTrack()
  }, [player, status])

  const handleStartPlaylist = useCallback(async () => {
    setActionMessage('')

    if (!playlistId.trim()) {
      setActionMessage('Set playlist id or URL first.')
      return
    }

    if (!deviceId) {
      setActionMessage('Spotify device is not ready yet.')
      return
    }

    const response = await fetch('/api/spotify/play', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playlistId,
        deviceId
      })
    })

    if (!response.ok) {
      const data = (await response.json()) as { error?: string }
      setActionMessage(data.error ?? 'Failed to start playlist.')
      return
    }

    setActionMessage('Playlist started.')
  }, [deviceId, playlistId])

  return (
    <li className="col-span-2 row-span-2">
      <Card className="h-[390px] w-full rounded-3xl border-border bg-[#EAF8F0] py-0 shadow-sm">
        <CardContent className="flex h-full flex-col p-5 xl:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon.Spotify />
              <div>
                <p className="text-sm font-semibold uppercase">Spotify Player</p>
                <p className="text-xs text-muted-foreground">{statusLabel}</p>
              </div>
            </div>

            {status === 'unauthenticated' && (
              <Button asChild size="sm">
                <a href="/api/spotify/login">Connect</a>
              </Button>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-white p-4">
            <p className="text-xs text-muted-foreground">Now Playing</p>
            <p className="mt-1 line-clamp-1 text-sm font-medium">
              {trackInfo?.title ?? 'No track'}
            </p>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {trackInfo?.artist ?? 'Start a playlist to begin playback'}
            </p>
          </div>

          <div className="mt-4">
            <label htmlFor="spotify-playlist" className="text-xs text-muted-foreground">
              Playlist ID or URL
            </label>
            <input
              id="spotify-playlist"
              value={playlistId}
              onChange={(event) => setPlaylistId(event.target.value)}
              className="mt-2 h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
              placeholder="spotify:playlist:..."
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleStartPlaylist}
              disabled={status !== 'ready'}
            >
              Play Playlist
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleTogglePlayback}
              disabled={status !== 'ready'}
              aria-label="Toggle playback"
            >
              {isPaused ? <Icon.Play /> : <Icon.Pause />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleNextTrack}
              disabled={status !== 'ready'}
              aria-label="Next track"
            >
              <SkipForwardIcon className="size-4" />
            </Button>
          </div>

          <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
            <Icon.Note className="size-3" />
            <p className="line-clamp-1">
              {actionMessage || 'First playback action may require user interaction.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  )
}
