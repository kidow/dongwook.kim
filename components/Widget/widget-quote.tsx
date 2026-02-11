'use client'

export default function WidgetQuote() {
  return (
    <li className="rows-span-2 col-span-2 overflow-hidden xl:col-span-4 xl:row-span-1">
      <div className="h-[175px] w-full rounded-3xl border border-neutral-200 p-5 shadow-sm xl:p-6">
        <div>
          <span className="flex h-10 w-10 items-center justify-center rounded-md border">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 scale-[-1]" fill="currentColor">
              <path d="M7.17 6A5.01 5.01 0 0 0 2 11v7h7v-7H5a3 3 0 0 1 3-3h1V6H7.17Zm9 0A5.01 5.01 0 0 0 11 11v7h7v-7h-4a3 3 0 0 1 3-3h1V6h-1.83Z" />
            </svg>
          </span>
        </div>
        <div className="mt-3 text-xl font-normal italic text-neutral-600 dark:text-neutral-300">
          더 게으르기 위해, 더 열심히 공부하는 것을 모토로 삼고 있습니다.
        </div>
      </div>
    </li>
  )
}
