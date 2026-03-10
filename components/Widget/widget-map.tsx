'use client'

import { ReactNode } from 'react'
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const LOCATION = {
  lat: 37.5744985,
  lng: 127.1926473,
  label: 'Hanam-si, Gyeonggi-do, South Korea'
} as const

const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY
const KAKAO_MAP_SDK_URL = 'https://dapi.kakao.com/v2/maps/sdk.js'
const KAKAO_MAP_LIBRARIES = ['services'] as const

function WidgetMapFrame({ children }: { children: ReactNode }) {
  return (
    <li
      className="relative col-span-2 row-span-2 h-[178px] w-full overflow-hidden xl:h-[390px] xl:w-[390px]"
      aria-label={`위치: ${LOCATION.label}`}
    >
      <Card className="h-full w-full overflow-hidden rounded-3xl border-border py-0 shadow-sm">
        {children}
        <Badge
          variant="outline"
          className="absolute bottom-4 left-4 z-10 rounded-lg border-border bg-background/95 px-2 py-1.5 text-sm font-normal text-foreground backdrop-blur dark:bg-zinc-900/90"
        >
          {LOCATION.label}
        </Badge>
      </Card>
    </li>
  )
}

function WidgetMapContent({ appKey }: { appKey: string }) {
  const [isMapLoading, mapLoadError] = useKakaoLoader({
    appkey: appKey,
    libraries: [...KAKAO_MAP_LIBRARIES],
    url: KAKAO_MAP_SDK_URL
  })

  if (mapLoadError) {
    return (
      <WidgetMapFrame>
        <div className="text-muted-foreground flex h-full w-full items-center justify-center bg-muted/20 text-sm">
          지도를 불러오지 못했습니다.
        </div>
      </WidgetMapFrame>
    )
  }

  if (isMapLoading) {
    return (
      <WidgetMapFrame>
        <div className="text-muted-foreground flex h-full w-full items-center justify-center bg-muted/20 text-sm">
          지도를 불러오는 중입니다.
        </div>
      </WidgetMapFrame>
    )
  }

  return (
    <WidgetMapFrame>
      <Map
        center={{ lat: LOCATION.lat, lng: LOCATION.lng }}
        className="h-full w-full"
        draggable={false}
        zoomable={false}
        level={9}
      >
        <MapMarker position={{ lat: LOCATION.lat, lng: LOCATION.lng }} />
      </Map>
    </WidgetMapFrame>
  )
}

export default function WidgetMap() {
  if (!KAKAO_MAP_KEY) {
    return (
      <WidgetMapFrame>
        <div className="text-muted-foreground flex h-full w-full items-center justify-center bg-muted/20 text-sm">
          지도를 표시할 수 없습니다.
        </div>
      </WidgetMapFrame>
    )
  }

  return <WidgetMapContent appKey={KAKAO_MAP_KEY} />
}
