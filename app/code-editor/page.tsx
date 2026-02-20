import type { Metadata } from 'next'
import { Suspense } from 'react'

import CodeEditor from '@/components/CodeEditor'

const TITLE = '코드 에디터'
const DESCRIPTION =
  '브라우저에서 JavaScript, TypeScript 코드를 작성하고 실행할 수 있는 에디터입니다.'
const BASE_URL = 'https://dongwook.kim/code-editor'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'code editor',
    'javascript',
    'typescript',
    'sandbox',
    'playground'
  ],
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
  return (
    <Suspense
      fallback={
        <div className="text-sm text-stone-400">에디터를 불러오는 중...</div>
      }
    >
      <CodeEditor />
    </Suspense>
  )
}
