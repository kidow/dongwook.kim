import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { RagIndexFile } from '@/utils/chat/types'

let cachedIndex: RagIndexFile | null = null
let cachedMtimeMs: number | null = null

const INDEX_PATH = path.join(process.cwd(), 'content/profile/rag-index.json')

export async function loadRagIndex(): Promise<RagIndexFile | null> {
  try {
    const file = await readFile(INDEX_PATH, 'utf8')
    const parsed = JSON.parse(file) as RagIndexFile

    const mtimeMs = parsed.createdAt ? Date.parse(parsed.createdAt) : Date.now()

    if (!cachedIndex || cachedMtimeMs !== mtimeMs) {
      cachedIndex = parsed
      cachedMtimeMs = mtimeMs
    }

    return cachedIndex
  } catch {
    return null
  }
}
