import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Agentation } from 'agentation'
import { Toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const viewport: Viewport = {
  themeColor: '#09090b',
  colorScheme: 'dark'
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
    <html
      lang="ko"
      className={cn(geistSans.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        {/* ponytail: 폰트 파일 셀프호스팅이 필요하면 next/font/local로 교체 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Agentation />
        <Toast />
        <SpeedInsights />
        <Analytics />
        <GoogleAnalytics gaId="G-QBXY1NY7BL" />
      </body>
    </html>
  )
}
