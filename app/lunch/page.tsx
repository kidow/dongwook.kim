'use client'

import Link from 'next/link'
import Script from 'next/script'
import { KeyboardEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowDownLeftIcon,
  ArrowDownRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpLeftIcon,
  ArrowUpRightIcon,
  ExternalLinkIcon,
  SearchIcon
} from 'lucide-react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from '@/utils'

const MENU_BOARD: string[][] = [
  ['찌개', '국밥', '고깃집', '족발,보쌈', '국수', '찜', '해물,생선', '쌈밥', '돈까스'],
  ['짜장면', '짬뽕', '마라탕', '양꼬치', '훠궈', '', '', '', ''],
  ['초밥,스시', '라멘', '우동', '돈가츠', '오마카세', '샤브샤브', '텐동', '', ''],
  ['파스타', '피자', '스테이크', '샐러드', '뷔페', '멕시칸,브라질', '', '', ''],
  ['한식', '중식', '일식', '양식', '혼밥', '아시아음식', '분식', '패스트푸드', '술집'],
  ['베트남음식', '태국음식', '인도음식', '', '', '', '', '', ''],
  ['떡볶이', '김밥', '라면', '만두', '도시락', '', '', '', '편의점'],
  ['버거', '토스트', '샌드위치', '타코', '핫도그', '도넛', '빵', '카페', ''],
  ['치킨', '와인바', '포장마차', '파전', '', '', '', '', '']
]

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }
const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY

const DIRECTION_ICONS: Record<number, ReactNode> = {
  0: (
    <ArrowUpLeftIcon className="absolute top-0 left-0 z-10 size-5 -translate-x-1/2 -translate-y-1/2 opacity-20" />
  ),
  1: (
    <ArrowUpIcon className="absolute top-0 left-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 opacity-20" />
  ),
  2: (
    <ArrowUpRightIcon className="absolute top-0 right-0 z-10 size-5 translate-x-1/2 -translate-y-1/2 opacity-20" />
  ),
  3: (
    <ArrowLeftIcon className="absolute top-1/2 left-0 z-10 size-5 -translate-x-1/2 -translate-y-1/2 opacity-20" />
  ),
  5: (
    <ArrowRightIcon className="absolute top-1/2 right-0 z-10 size-5 translate-x-1/2 -translate-y-1/2 opacity-20" />
  ),
  6: (
    <ArrowDownLeftIcon className="absolute bottom-0 left-0 z-10 size-5 -translate-x-1/2 translate-y-1/2 opacity-20" />
  ),
  7: (
    <ArrowDownIcon className="absolute bottom-0 left-1/2 z-10 size-5 -translate-x-1/2 translate-y-1/2 opacity-20" />
  ),
  8: (
    <ArrowDownRightIcon className="absolute right-0 bottom-0 z-10 size-5 translate-x-1/2 translate-y-1/2 opacity-20" />
  )
}

export default function LunchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<kakao.maps.services.PlacesSearchResult>([])
  const [hasNextPage, setHasNextPage] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [isSearching, setIsSearching] = useState(false)

  const hasMapKey = useMemo(() => Boolean(KAKAO_MAP_KEY), [])

  const searchPlaces = (keyword: string, page = 1) => {
    if (!map || !keyword.trim() || typeof window === 'undefined' || !window.kakao?.maps?.services) {
      return
    }

    setIsSearching(true)

    const places = new window.kakao.maps.services.Places()
    const location = map.getCenter()

    places.keywordSearch(
      keyword,
      (data, status, pagination) => {
        setIsSearching(false)

        if (status !== window.kakao.maps.services.Status.OK) {
          if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            setResults([])
            setTotalCount(0)
            setHasNextPage(false)
            setCurrentPage(1)
            return
          }

          toast.warn('검색 결과를 불러오지 못했습니다.')
          return
        }

        setResults((prev) => (page === 1 ? data : [...prev, ...data]))
        setHasNextPage(pagination.hasNextPage)
        setTotalCount(pagination.totalCount)
        setCurrentPage(pagination.current)
      },
      {
        location,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
        radius: 500,
        page
      }
    )
  }

  const onSearchInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || !searchQuery.trim()) {
      return
    }

    searchPlaces(searchQuery)
  }

  const focusPlace = (item: kakao.maps.services.PlacesSearchResultItem) => {
    if (!map || !window.kakao?.maps) {
      return
    }

    map.setCenter(new window.kakao.maps.LatLng(Number(item.y), Number(item.x)))
  }

  useEffect(() => {
    if (!hasMapKey || !map) {
      return
    }

    if (typeof window.navigator === 'undefined' || !window.navigator.geolocation) {
      toast.warn('현재 브라우저에서 위치 기능을 사용할 수 없습니다.')
      return
    }

    window.navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextCenter = { lat: coords.latitude, lng: coords.longitude }
        setCenter(nextCenter)
        map.setCenter(new window.kakao.maps.LatLng(nextCenter.lat, nextCenter.lng))
      },
      () => {
        toast.info('위치 접근 권한이 없어 기본 위치로 표시합니다.')
      }
    )
  }, [hasMapKey, map])

  if (!hasMapKey) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight xl:text-4xl">점심 뭐 먹지?</h1>
        <Card className="rounded-3xl border-border">
          <CardHeader>
            <CardTitle>카카오 지도 API 키가 필요합니다</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            <p>`NEXT_PUBLIC_KAKAO_MAP_API_KEY`를 설정하면 점심 탐색 지도를 사용할 수 있습니다.</p>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <>
      <Script
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services&autoload=false`}
        async
        strategy="afterInteractive"
      />
      <section className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight xl:text-4xl">점심 뭐 먹지?</h1>
          <p className="text-muted-foreground text-sm">
            현재 위치 기준 반경 500m 내 식당을 빠르게 탐색합니다.
          </p>
        </header>

        <Card className="overflow-hidden rounded-3xl border-border py-0 shadow-sm">
          <Map
            center={center}
            onCreate={setMap}
            className="h-[360px] w-full xl:h-[620px]"
            level={4}
          >
            {results.map((item) => (
              <MapMarker
                key={item.id}
                position={{ lat: Number(item.y), lng: Number(item.x) }}
                onClick={() => focusPlace(item)}
              />
            ))}
          </Map>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
          <div className="grid grid-cols-3 border border-border">
            {MENU_BOARD.map((group, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))] grid-rows-[repeat(3,minmax(60px,1fr))] odd:bg-muted/30"
              >
                {group.map((menu, columnIndex) => (
                  <button
                    key={`${rowIndex}-${columnIndex}-${menu || 'empty'}`}
                    type="button"
                    disabled={!menu}
                    onClick={() => {
                      if (!menu) {
                        return
                      }

                      setSearchQuery(menu)
                      searchPlaces(menu)
                    }}
                    className={cn(
                      'relative min-h-16 border-r border-b border-border px-2 text-center text-sm',
                      menu ? 'hover:bg-muted/60' : 'cursor-default bg-transparent'
                    )}
                  >
                    {menu}
                    {rowIndex === 4 ? DIRECTION_ICONS[columnIndex] : null}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <Card className="rounded-3xl border-border py-0 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-3 py-3">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={onSearchInputKeyDown}
                spellCheck={false}
                autoComplete="off"
                placeholder="메뉴 또는 식당 검색"
                aria-label="메뉴 또는 식당 검색"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                disabled={!searchQuery.trim() || isSearching}
                onClick={() => searchPlaces(searchQuery)}
                aria-label="검색"
              >
                <SearchIcon className="size-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs">
              <span className="text-muted-foreground">검색 결과</span>
              <Badge variant="outline" className="font-normal">
                총 {totalCount}개
              </Badge>
            </div>

            <ul className="max-h-[420px] overflow-auto overscroll-contain">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="cursor-pointer border-b border-border px-3 py-3 text-sm hover:bg-muted/30"
                  onClick={() => focusPlace(item)}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-medium">{item.place_name}</span>
                    <span className="text-muted-foreground ml-auto shrink-0 text-xs">
                      {item.distance}m
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">{item.category_name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      href={item.place_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`${item.place_name} 카카오맵에서 열기`}
                    >
                      <ExternalLinkIcon className="size-4" />
                    </Link>
                    <span className="text-muted-foreground text-xs">{item.phone || '전화번호 없음'}</span>
                  </div>
                </li>
              ))}
              {!results.length && !isSearching ? (
                <li className="text-muted-foreground px-3 py-6 text-center text-sm">검색 결과가 없습니다.</li>
              ) : null}
              {hasNextPage ? (
                <li className="p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => searchPlaces(searchQuery, currentPage + 1)}
                  >
                    더 보기
                  </Button>
                </li>
              ) : null}
            </ul>
          </Card>
        </div>
      </section>
    </>
  )
}
