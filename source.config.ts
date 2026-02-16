import { defineConfig, defineDocs } from 'fumadocs-mdx/config'

export const docs = defineDocs({
  dir: 'content/archive',
  docs: {
    files: ['**/*.mdx', '!_template.mdx']
  }
})

export default defineConfig()
