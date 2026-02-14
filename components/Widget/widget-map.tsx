'use client'

import Script from 'next/script'
import { useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'

export default function WidgetMap() {
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const lat = 37.5744985
  const lng = 127.1926473

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`}
        strategy="lazyOnload"
        onLoad={() => {
          window.kakao.maps.load(() => {
            setIsMapLoaded(true)
          })
        }}
        onError={(e) => {
          console.error('Kakao Map script failed to load:', e)
        }}
      />
      <li className="relative col-span-2 row-span-2 h-[178px] w-full overflow-hidden rounded-3xl border border-neutral-200 shadow-sm xl:h-[390px] xl:w-[390px]">
        {isMapLoaded ? (
          <Map
            center={{ lat, lng }}
            className="h-full w-full"
            draggable={false}
            zoomable={false}
            level={9}
          >
            <MapMarker position={{ lat, lng }} />
          </Map>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100">
            <div className="text-sm text-neutral-500">Loading map...</div>
          </div>
        )}
        <div className="absolute bottom-4 left-4 z-10 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm">
          Hanam-si, Gyeonggi-do, South Korea
        </div>
      </li>
    </>
  )
}
