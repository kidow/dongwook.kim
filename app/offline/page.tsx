export const metadata = {
  title: 'Offline'
}

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-prose flex-col items-start justify-center gap-4 px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Offline Mode
      </p>
      <h1 className="text-3xl font-bold tracking-tight">네트워크에 연결할 수 없습니다.</h1>
      <p className="text-base text-muted-foreground">
        연결이 복구되면 페이지를 새로고침해 주세요. 홈, 블로그, 메모의 일부 화면은 오프라인에서도 기본
        콘텐츠를 볼 수 있도록 준비되어 있습니다.
      </p>
    </main>
  )
}
