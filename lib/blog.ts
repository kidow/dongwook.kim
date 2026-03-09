import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content/blog')

type BlogFrontmatter = {
  title: string
  description?: string
  date: string
  published?: boolean
}

type BlogPostRecord = BlogPostSummary & {
  filePath: string
}

export type BlogPostSummary = {
  slug: string
  title: string
  description: string
  date: string
  url: string
}

export type BlogPostDetail = BlogPostSummary

function walkBlogFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      return walkBlogFiles(fullPath)
    }

    if (!entry.isFile() || !entry.name.endsWith('.mdx') || entry.name === '_template.mdx') {
      return []
    }

    return [fullPath]
  })
}

function parseFrontmatterValue(value: string): string | boolean {
  const normalized = value.trim()

  if (normalized === 'true') {
    return true
  }

  if (normalized === 'false') {
    return false
  }

  if (
    (normalized.startsWith("'") && normalized.endsWith("'")) ||
    (normalized.startsWith('"') && normalized.endsWith('"'))
  ) {
    return normalized.slice(1, -1)
  }

  return normalized
}

function parseFrontmatter(fileContent: string): BlogFrontmatter {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---/)

  if (!match) {
    throw new Error('Blog post is missing frontmatter.')
  }

  const frontmatter = match[1]
    .split('\n')
    .reduce<Record<string, string | boolean>>((acc, line) => {
      const separatorIndex = line.indexOf(':')

      if (separatorIndex === -1) {
        return acc
      }

      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1)
      acc[key] = parseFrontmatterValue(value)
      return acc
    }, {})

  return {
    title: String(frontmatter.title ?? ''),
    description:
      typeof frontmatter.description === 'string'
        ? frontmatter.description
        : undefined,
    date: String(frontmatter.date ?? ''),
    published:
      typeof frontmatter.published === 'boolean'
        ? frontmatter.published
        : true
  }
}

function toPostRecord(filePath: string): BlogPostRecord | null {
  const fileContent = readFileSync(filePath, 'utf8')
  const frontmatter = parseFrontmatter(fileContent)
  const relativePath = path.relative(BLOG_CONTENT_DIR, filePath)
  const pathname = relativePath.replace(/\.mdx$/, '').split(path.sep).join('/')
  const slug = pathname.split('/').at(-1)

  if (!slug || frontmatter.published === false) {
    return null
  }

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description ?? '',
    date: frontmatter.date,
    url: `/blog/${pathname}`,
    filePath
  }
}

function loadBlogPosts(): BlogPostRecord[] {
  return walkBlogFiles(BLOG_CONTENT_DIR)
    .map(toPostRecord)
    .filter((post): post is BlogPostRecord => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getBlogPostSummaries(): BlogPostSummary[] {
  return loadBlogPosts().map(({ filePath, ...post }) => post)
}

export function getBlogPostBySlug(slug: string): BlogPostDetail | undefined {
  const post = loadBlogPosts().find((entry) => entry.slug === slug)

  if (!post) {
    return undefined
  }

  const { filePath, ...detail } = post
  return detail
}
