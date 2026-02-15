'use client'

import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

export default function WidgetScheduling() {
  const times = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30']

  return (
    <li className="col-span-3 row-span-3 hidden h-[605px] w-full overflow-hidden xl:flex">
      <Card className="w-full rounded-3xl border-neutral-200 py-0 shadow-sm">
        <CardContent className="flex h-full divide-x divide-neutral-200 p-0">
          <div className="flex w-1/2 flex-col p-10">
            <span className="flex h-20 w-20 items-center justify-center rounded-xl border border-neutral-200">
              <Image src="/google-meet.png" alt="google meet" width={40} height={40} />
            </span>
            <div className="mt-8">
              <p className="text-[24px] leading-[1.2]">화상 미팅</p>
              <p className="mt-2 text-[20px] leading-[1.2] text-muted-foreground">
                30분에서 1시간 가능합니다.
              </p>
            </div>
            <div className="mt-12 flex items-center justify-between">
              <p className="text-[48px] font-semibold leading-none">2026년 2월</p>
              <div className="flex items-center gap-6">
                <ChevronLeftIcon className="h-10 w-10 text-neutral-300" />
                <ChevronRightIcon className="h-10 w-10 text-black" />
              </div>
            </div>
            <div className="mt-12 grid grid-cols-7 text-center text-[28px] font-semibold">
              <span>일</span>
              <span>월</span>
              <span>화</span>
              <span>수</span>
              <span>목</span>
              <span>금</span>
              <span>토</span>
            </div>
            <div className="mt-7 grid grid-cols-7 gap-y-2 text-center text-[32px] leading-none text-neutral-300">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
              <span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span>
              <span className="rounded-full bg-[#171717] py-4 text-white">14</span>
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2 text-center text-[32px] leading-none">
              {['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'].map(
                (day) => (
                  <span key={day} className="rounded-full bg-neutral-100 py-4">
                    {day}
                  </span>
                )
              )}
            </div>
            <div className="mt-8 text-[28px] font-semibold leading-none text-neutral-800">
              대한민국/서울 (16:08)
            </div>
          </div>
          <div className="w-1/2 overflow-hidden p-10">
            <h3 className="text-[52px] font-semibold leading-none">시간 선택</h3>
            <p className="mt-6 text-[36px] font-semibold leading-none">2월 14일 토요일</p>
            <div className="mt-8 space-y-6">
              {times.map((time) => (
                <div
                  key={time}
                  className="rounded-xl border border-neutral-200 px-10 py-8 text-[32px] font-medium leading-none"
                >
                  {time}
                </div>
              ))}
            </div>
            <p className="mt-8 text-[18px] text-muted-foreground">상호작용 없는 UI 미리보기입니다.</p>
          </div>
        </CardContent>
      </Card>
    </li>
  )
}
