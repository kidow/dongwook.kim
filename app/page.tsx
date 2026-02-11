import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <ul className="duration-400 grid grid-cols-2 gap-6 xl:grid-cols-4 xl:gap-10">
      <li className="col-span-2 xl:col-span-4">
        <Link
          href="https://github.com/kidow"
          target="_blank"
          className="flex h-[178px] w-full items-center justify-between rounded-3xl border p-8 shadow-sm transition hover:bg-neutral-50 xl:h-[175px] xl:w-[820px]"
        >
          <div>
            <p className="text-sm text-neutral-500">Follow</p>
            <h2 className="mt-2 text-3xl font-bold">Github</h2>
          </div>
          <span className="rounded-md border bg-slate-50 px-[21px] py-[7px] text-xs font-bold text-neutral-600">
            Follow
          </span>
        </Link>
      </li>

      <li className="col-span-2 rounded-3xl border p-8 shadow-sm xl:col-span-4">
        <h3 className="text-xl font-semibold">Link-in-bio UI migration in progress</h3>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          다음 단계에서 홈 위젯, 블로그/이력서 페이지 UI를 순차 이식합니다.
        </p>
      </li>

      <li className="col-span-1 h-[178px] rounded-3xl border shadow-sm xl:h-[175px] xl:w-[175px]">
        <Link href="/resume" className="flex h-full w-full flex-col items-start justify-end p-6">
          <p className="text-lg font-bold">Résumé</p>
          <p className="text-sm text-neutral-500">/resume</p>
        </Link>
      </li>

      <li className="col-span-1 h-[178px] rounded-3xl border shadow-sm xl:h-[175px] xl:w-[175px]">
        <Link
          href="https://wcgo2ling@gmail.com"
          className="flex h-full w-full flex-col items-start justify-end p-6"
        >
          <p className="text-lg font-bold">Gmail</p>
          <p className="text-sm text-neutral-500">wcgo2ling@gmail.com</p>
        </Link>
      </li>

      <li className="col-span-2 overflow-hidden rounded-3xl border shadow-sm xl:col-span-2 xl:h-[390px] xl:w-[390px]">
        <Image
          src="/avatar.svg"
          alt="Kidow avatar"
          width={600}
          height={600}
          className="h-full w-full object-cover"
        />
      </li>
    </ul>
  )
}
