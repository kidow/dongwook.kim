import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getBlogPostBySlug, getBlogPostSummaries } from '@/lib/blog'
import { getBlogPostBodyBySlug } from '@/lib/blog-mdx'

interface BlogDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getBlogPostSummaries().map((post) => ({
    id: post.slug
  }))
}

export async function generateMetadata({
  params
}: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const post = getBlogPostBySlug(id)

  return {
    title: `${post?.title ?? id} | 블로그 | Dongwook Kim`,
    description: post?.description ?? '웹 개발자의 이야기들을 다룹니다.'
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params
  const post = getBlogPostBySlug(id)
  const MDX = getBlogPostBodyBySlug(id)

  if (!post || !MDX) {
    notFound()
  }

  return (
    <article className="mx-auto p-3 space-y-6">
      <header className="pb-10">
        <h1 className="font-medium text-neutral-900">{post.title}</h1>
      </header>

      <section className="prose prose-h1:font-medium prose-p:text-neutral-500 prose-li:text-neutral-500 prose-h2:font-medium prose-h1:text-base prose-h2:text-base prose-neutral max-w-none">
        <MDX />
      </section>
    </article>
  )
}
