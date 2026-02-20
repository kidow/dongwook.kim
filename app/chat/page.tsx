import type { Metadata } from 'next'

import ChatPage from '@/components/Chat'

const TITLE = 'Chat'
const DESCRIPTION = 'Gemini AI chat'
const BASE_URL = 'https://dongwook.kim/chat'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: BASE_URL
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_URL
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION
  },
  metadataBase: new URL(BASE_URL)
}

export default function Page() {
  return <ChatPage />
}
