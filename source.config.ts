import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config'
import { z } from 'zod'

const blogSchema = frontmatterSchema.extend({
  date: z.string(),
  published: z.boolean().default(true)
})

export const docs = defineDocs({
  dir: 'content/archive',
  docs: {
    files: ['**/*.mdx', '!_template.mdx']
  }
})

export const blog = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: blogSchema,
    files: ['**/*.mdx', '!_template.mdx']
  }
})

export default defineConfig()
