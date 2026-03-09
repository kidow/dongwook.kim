import type { Metadata } from 'next'
import Link from 'next/link'

import { getBlogPostSummaries } from '@/lib/blog'

export const metadata: Metadata = {
  title: '블로그 | Dongwook Kim',
  description: '웹 개발자의 이야기들을 다룹니다.'
}

export default function BlogPage() {
  const posts = getBlogPostSummaries()

  return (
    <>
      <ul className="space-y-7 sm:space-y-4">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="flex flex-col rounded-md p-3 no-underline hover:bg-neutral-100"
          >
            <article className="group relative border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
              <div>
                <h2 className="text-neutral-900 font-medium">
                  <span className="after:bg-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:origin-bottom-right after:scale-x-0 after:opacity-35 after:transition-transform after:duration-150 after:content-[''] after:group-hover:origin-bottom-left after:group-hover:scale-x-100">
                    {post.title}
                  </span>
                </h2>
                <p className="max-w-2xl text-neutral-400">{post.description}</p>
              </div>
              <Link href={`/blog/${post.slug}`} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </>
  )
}
