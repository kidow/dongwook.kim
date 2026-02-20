import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const DOCS_PATH = path.join(ROOT, 'content/profile/rag-documents.json')
const OUTPUT_PATH = path.join(ROOT, 'content/profile/rag-index.json')
const ENV_LOCAL_PATH = path.join(ROOT, '.env.local')

const DEFAULT_EMBED_MODEL =
  process.env.GEMINI_EMBED_MODEL?.trim() || 'gemini-embedding-001'
const MAX_CHARS = 460
const OVERLAP_CHARS = 80

async function loadEnvLocal() {
  try {
    const raw = await fs.readFile(ENV_LOCAL_PATH, 'utf8')
    const lines = raw.split(/\r?\n/)

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const eq = trimmed.indexOf('=')
      if (eq === -1) continue

      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  } catch {
    // no-op
  }
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim()
}

function splitParagraphs(text) {
  return text
    .split(/\n\s*\n/g)
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean)
}

function chunkParagraphs(paragraphs) {
  const chunks = []
  let current = ''

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph

    if (candidate.length <= MAX_CHARS) {
      current = candidate
      continue
    }

    if (current) {
      chunks.push(current)
      const overlap = current.slice(Math.max(0, current.length - OVERLAP_CHARS))
      current = `${overlap} ${paragraph}`.trim()
    } else {
      chunks.push(paragraph.slice(0, MAX_CHARS))
      current = paragraph.slice(MAX_CHARS - OVERLAP_CHARS)
    }

    while (current.length > MAX_CHARS) {
      chunks.push(current.slice(0, MAX_CHARS))
      current = current.slice(MAX_CHARS - OVERLAP_CHARS)
    }
  }

  if (current) chunks.push(current)

  return chunks.map((chunk) => normalizeWhitespace(chunk)).filter(Boolean)
}

async function embedText({ text, apiKey, model }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:embedContent?key=${encodeURIComponent(apiKey)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: {
        parts: [{ text }]
      }
    })
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Embedding failed (${response.status}): ${body}`)
  }

  const data = await response.json()
  const vector = data?.embedding?.values

  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error('Embedding response does not include a valid vector')
  }

  return vector
}

function estimateTokens(text) {
  return Math.max(1, Math.round(text.length / 4))
}

async function main() {
  await loadEnvLocal()

  const apiKey = process.env.GEMINI_API_KEY?.trim()
  const model = process.env.GEMINI_EMBED_MODEL?.trim() || DEFAULT_EMBED_MODEL

  if (!apiKey) {
    throw new Error(
      'Missing GEMINI_API_KEY. Set it in .env.local or current environment.'
    )
  }

  const raw = await fs.readFile(DOCS_PATH, 'utf8')
  const docs = JSON.parse(raw)

  const chunks = []

  for (const doc of docs) {
    const paragraphs = splitParagraphs(doc.text)
    const textChunks = chunkParagraphs(paragraphs)

    for (let index = 0; index < textChunks.length; index += 1) {
      const text = textChunks[index]
      const vector = await embedText({ text, apiKey, model })

      chunks.push({
        chunkId: `${doc.id}-c${index + 1}`,
        docId: doc.id,
        text,
        tokensApprox: estimateTokens(text),
        vector,
        metadata: {
          title: doc.title,
          section: doc.section,
          tags: doc.tags,
          lang: doc.lang,
          priority: doc.priority
        }
      })

      process.stdout.write(
        `Embedded ${doc.id} chunk ${index + 1}/${textChunks.length}\n`
      )
    }
  }

  const payload = {
    version: 1,
    embeddingModel: model,
    createdAt: new Date().toISOString(),
    chunks
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2), 'utf8')

  process.stdout.write(`\nRAG index written: ${OUTPUT_PATH}\n`)
  process.stdout.write(`Total chunks: ${chunks.length}\n`)
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`
  )
  process.exit(1)
})
