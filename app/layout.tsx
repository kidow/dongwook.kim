import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Toast } from '@/shared/ui'
import { cn } from '@/shared/utils'

import './globals.css'

const inter = Inter({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Kidow',
  description: '비즈니스에 관심이 많은 웹 개발자'
}

export default function RootLayout({ children }: Readonly<ReactProps>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
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
                <div className="relative flex-1 xl:w-[820px] xl:flex-none">{children}</div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
        <Toast.v2 />
      </body>
    </html>
  )
}
