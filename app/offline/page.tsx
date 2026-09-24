export const metadata = {
  title: 'Offline'
}

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-prose flex-col items-start justify-center gap-4 px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Offline Mode
      </p>
      <h1 className="text-3xl font-bold tracking-tight">
        You&apos;re offline.
      </h1>
      <p className="text-base text-muted-foreground">
        Refresh the page once your connection is back. Some of the home page
        content is available offline.
      </p>
    </main>
  )
}
