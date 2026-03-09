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
    <article className="mx-auto space-y-6">
      <header>
        <h1 className="font-medium text-neutral-900">{post.title}</h1>
        <p className="text-neutral-400">{post.description}</p>
      </header>

      <section className="prose prose-neutral max-w-none">
        <MDX />
      </section>
    </article>
  )
}
