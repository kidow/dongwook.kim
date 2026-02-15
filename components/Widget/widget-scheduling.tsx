'use client'

import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const TIMES = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30'] as const
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const
const PAST_DAYS = Array.from({ length: 13 }, (_, i) => String(i + 1))
const FUTURE_DAYS = Array.from({ length: 14 }, (_, i) => String(i + 15))

export default function WidgetScheduling() {
  return (
    <li
      className="col-span-3 row-span-3 hidden h-[605px] w-full overflow-hidden xl:flex"
      aria-label="화상 미팅 스케줄링 미리보기"
    >
      <Card className="w-full rounded-3xl border-neutral-200 py-0 shadow-sm">
        <CardContent className="flex h-full divide-x divide-border p-0">
          <div className="flex w-1/2 flex-col p-10">
            <span className="flex h-20 w-20 items-center justify-center rounded-xl border border-border">
              <Image src="/google-meet.png" alt="Google Meet" width={40} height={40} />
            </span>
            <div className="mt-8">
              <p className="text-[24px] leading-[1.2]">화상 미팅</p>
              <p className="mt-2 text-[20px] leading-[1.2] text-muted-foreground">
                30분에서 1시간 가능합니다.
              </p>
            </div>
            <div className="mt-12 flex items-center justify-between">
              <p className="text-[48px] font-semibold leading-none">2026년 2월</p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-lg" disabled aria-label="이전 달">
                  <ChevronLeftIcon className="size-10 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon-lg" aria-label="다음 달">
                  <ChevronRightIcon className="size-10" />
                </Button>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-7 text-center text-[28px] font-semibold">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-7 grid grid-cols-7 gap-y-2 text-center text-[32px] leading-none text-muted-foreground">
              {PAST_DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
              <span className="rounded-full bg-primary py-4 text-primary-foreground">14</span>
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2 text-center text-[32px] leading-none">
              {FUTURE_DAYS.map((day) => (
                <span key={day} className="rounded-full bg-secondary py-4">
                  {day}
                </span>
              ))}
            </div>
            <div className="mt-8 text-[28px] font-semibold leading-none text-foreground/80">
              대한민국/서울 (16:08)
            </div>
          </div>
          <div className="w-1/2 overflow-hidden p-10">
            <h3 className="text-[52px] font-semibold leading-none">시간 선택</h3>
            <p className="mt-6 text-[36px] font-semibold leading-none">2월 14일 토요일</p>
            <div className="mt-8 space-y-6">
              {TIMES.map((time) => (
                <div
                  key={time}
                  className="rounded-xl border border-border px-10 py-8 text-[32px] font-medium leading-none"
                >
                  {time}
                </div>
              ))}
            </div>
            <p className="mt-8 text-[18px] text-muted-foreground">
              상호작용 없는 UI 미리보기입니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  )
}
