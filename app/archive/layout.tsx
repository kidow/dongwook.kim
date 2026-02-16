import type { ReactNode } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider/next'

import { source } from '@/lib/source'

import 'fumadocs-ui/css/neutral.css'
import 'fumadocs-ui/css/preset.css'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      <DocsLayout tree={source.pageTree}>{children}</DocsLayout>
    </RootProvider>
  )
}
