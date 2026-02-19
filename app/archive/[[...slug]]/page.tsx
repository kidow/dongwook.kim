import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

import { source } from '@/lib/source'

type ArchivePageProps = {
  params: Promise<{ slug?: string[] }>
}

type ArchivePageData = {
  title?: string
  description?: string
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
    <article className="space-y-6 pb-10">
      <header className="space-y-3">
        <Badge variant="secondary" className="w-fit">
          Code Archive
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">{pageData.title}</h1>
        {pageData.description && (
          <p className="text-muted-foreground text-base">
            {pageData.description}
          </p>
        )}
      </header>
      <Card className="border-border">
        <CardContent className="prose prose-neutral max-w-none p-6">
          <MDX />
        </CardContent>
      </Card>
    </article>
  )
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(
  props: ArchivePageProps
): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    return {}
  }

  return {
    title: page.data.title,
    description: page.data.description
  }
}
