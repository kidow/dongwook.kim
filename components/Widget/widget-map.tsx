'use client'

import Script from 'next/script'
import { Map, MapMarker } from 'react-kakao-maps-sdk'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const LOCATION = {
  lat: 37.5744985,
  lng: 127.1926473,
  label: 'Hanam-si, Gyeonggi-do, South Korea'
} as const

export default function WidgetMap() {
  return (
    <>
      <Script
        type="text/javascript"
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=c0986f45ad519044d2574ac8091cb572&libraries=services&autoload=false"
        async
        strategy="afterInteractive"
      />
      <li
        className="relative col-span-2 row-span-2 h-[178px] w-full overflow-hidden xl:h-[390px] xl:w-[390px]"
        aria-label={`위치: ${LOCATION.label}`}
      >
        <Card className="h-full w-full overflow-hidden rounded-3xl border-border py-0 shadow-sm">
          <Map
            center={{ lat: LOCATION.lat, lng: LOCATION.lng }}
            className="h-full w-full"
            draggable={false}
            zoomable={false}
            level={9}
          >
            <MapMarker position={{ lat: LOCATION.lat, lng: LOCATION.lng }} />
          </Map>
          <Badge
            variant="outline"
            className="absolute bottom-4 left-4 z-10 rounded-lg border-border bg-white px-2 py-1.5 text-sm font-normal text-foreground"
          >
            {LOCATION.label}
          </Badge>
        </Card>
      </li>
    </>
  )
}
