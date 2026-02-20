'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import * as Icon from '@/components/icons'
import { cn } from '@/lib/utils'

function getRunningTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

interface SpotifyTrack {
  title: string
  artists: string[]
  duration: number
  thumbnail: string
  audioSnippet: string
}

interface Props {
  tracks: SpotifyTrack[]
  totalSongs: number
  playlistUrl: string
}

export default function SpotifyPlayerClient({
  tracks,
  totalSongs,
  playlistUrl
}: Props) {
  const [audio, setAudio] = useState<HTMLAudioElement>()
  const [isPlayed, setIsPlayed] = useState(false)

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause()
      }
    }
  }, [audio])

  const onPlay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    window.open(playlistUrl, '_blank', 'noopener,noreferrer')
  }

  const onPlayTrack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    window.open(playlistUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <li className="col-span-2 row-span-2 overflow-hidden">
      <Link
        href={playlistUrl}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        className="flex h-[390px] w-full flex-col items-start rounded-3xl border border-neutral-200 bg-emerald-50 p-5 shadow-sm duration-150 xl:w-[390px] xl:p-6"
      >
        <div className="flex w-full flex-1 flex-col items-start">
          <div className="flex w-full items-start justify-between">
            <div className="relative">
              <div className="absolute inset-0 z-0">
                <span
                  className={cn(
                    'absolute inset-0 z-30 h-full w-full rounded-full bg-[#1ed760]/[0.08] transition-transform',
                    { 'animate-playing': isPlayed }
                  )}
                />
                <Icon.Note
                  className={cn(
                    'absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2',
                    { 'animate-note-1': isPlayed }
                  )}
                />
                <Icon.Note
                  className={cn(
                    'absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2',
                    { 'animate-note-2': isPlayed }
                  )}
                />
                <Icon.Note
                  className={cn(
                    'absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2',
                    { 'animate-note-3': isPlayed }
                  )}
                />
              </div>
              <Icon.Spotify />
            </div>
            <button
              onClick={onPlay}
              className="xs:px-[16px] flex min-w-[86px] items-center justify-center gap-1 rounded-[18px] bg-[#1ED760] px-[10px] py-[7px] text-center text-xs font-bold text-white transition-transform will-change-transform hover:bg-[#1fdf64] active:scale-[0.95] active:bg-[#169c46] active:text-white/80"
            >
              <span className="pointer-events-auto flex flex-row items-center gap-1.5">
                <Icon.Play />
                <span>Play</span>
              </span>
            </button>
          </div>
          <div className="mt-3 flex-1">
            <div className="text-sm uppercase">Spotify</div>
            <p className="mt-1 text-xs text-neutral-400">{totalSongs || 0} songs</p>
          </div>
        </div>
        <ul className="w-full">
          {tracks?.map((item, key) => (
            <li className="group last:hidden xl:last:block" key={key}>
              <button
                onClick={onPlayTrack}
                className="group flex w-full flex-row items-center justify-between py-2 transition-transform duration-150 active:scale-[0.995] group-last:pb-0"
              >
                <div className="flex flex-row items-center">
                  <div className="relative h-[40px] w-[40px] flex-none transition-all group-hover:rounded-full">
                    <div
                      className={cn(
                        'absolute inset-0 z-20 h-full w-full items-center justify-center rounded-full bg-[#1ED760] transition-all duration-150 ease-in active:bg-[#07BB47]',
                        isPlayed && audio?.src === item.audioSnippet
                          ? 'flex opacity-100'
                          : 'hidden appearance-none hover:bg-[#12CE55] group-hover:flex group-hover:opacity-100'
                      )}
                    >
                      {isPlayed ? <Icon.Pause /> : <Icon.Play />}
                    </div>
                    <div className="relative rounded-[6px]">
                      <Image
                        src={item.thumbnail}
                        loading="lazy"
                        height={40}
                        width={40}
                        className={cn(
                          'pointer-events-auto z-10 h-full w-full rounded-[inherit] border-black/[0.08] object-cover transition-all ease-in group-hover:hidden',
                          {
                            hidden: isPlayed && audio?.src === item.audioSnippet
                          }
                        )}
                        alt={item.title}
                      />
                    </div>
                  </div>
                  <div className="mx-3 flex flex-col text-left">
                    <div className="line-clamp-1 text-sm">{item.title}</div>
                    <div className="pointer-events-auto line-clamp-1 text-xs text-neutral-400">
                      {item.artists.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="w-fit flex-none text-sm tabular-nums text-black/40">
                  {getRunningTime(item.duration)}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Link>
    </li>
  )
}
