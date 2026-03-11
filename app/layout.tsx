import type { Metadata, Viewport } from 'next'
import { Agentation } from 'agentation'
import Header from '@/components/Header'
import { Toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'

export const viewport: Viewport = {
  themeColor: 'oklch(58.5% 0.233 277.117)'
}

export const metadata: Metadata = {
  title: {
    default: 'kidow',
    template: '%s | kidow'
  },
  description: '비즈니스에 관심이 많은 웹 개발자',
  manifest: '/manifest.webmanifest'
}

export default function RootLayout({ children }: Readonly<ReactProps>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="relative font-sans">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(191, 255, 0, 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(191, 255, 0, 0.04) 0%, transparent 50%)'
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'repeat',
              backgroundSize: '182px',
              opacity: 0.25,
              mixBlendMode: 'soft-light'
            }}
          />
        </div>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <div className="flex min-h-screen w-full max-w-[1728px] flex-col">
            <div className="relative flex min-h-screen w-full flex-1 flex-col items-center">
              <Header />
              <div
                className={cn(
                  'flex h-full w-full max-w-prose flex-1 flex-col p-6 pt-0 xl:max-w-[1728px] xl:flex-row xl:p-16'
                )}
              >
                <div className="mb-10 flex flex-col px-4 xl:mb-0 xl:mr-20 xl:flex-1 xl:px-0" />
                <div className="relative flex-1 xl:w-[820px] xl:flex-none">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Agentation />
        <Toast />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
