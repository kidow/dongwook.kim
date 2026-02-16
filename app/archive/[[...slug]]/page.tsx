import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page'
import type { ComponentType } from 'react'

import { source } from '@/lib/source'

type ArchivePageProps = {
  params: Promise<{ slug?: string[] }>
}

type ArchivePageData = {
  title?: string
  description?: string
  full?: boolean
  toc?: unknown
  body: ComponentType<{ components?: Record<string, unknown> }>
}

export default async function Page(props: ArchivePageProps) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const pageData = page.data as ArchivePageData
  const MDX = pageData.body

  return (
    <DocsPage>
      <DocsTitle>{pageData.title}</DocsTitle>
      <DocsDescription>{pageData.description}</DocsDescription>
      <DocsBody>
        <MDX components={defaultMdxComponents} />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: ArchivePageProps): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    return {}
  }

  return {
    title: `${page.data.title} | 코드 아카이브 | Kidow`,
    description: page.data.description
  }
}
