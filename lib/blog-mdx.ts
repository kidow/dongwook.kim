import { blog as blogCollection } from '../.source/server'

function getSlugFromInfoPath(filePath: string): string | undefined {
  return filePath.replace(/\.mdx$/, '').split('/').at(-1)
}

export function getBlogPostBodyBySlug(slug: string) {
  return blogCollection.docs.find(
    (entry) => getSlugFromInfoPath(entry.info.path) === slug
  )?.body
}
