export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; source: string }

export interface NotionEnv {
  secretKey?: string
  databaseId?: string
  dataSourceId?: string
  resumePageId?: string
}

function readEnv(key: string): string | undefined {
  const value = process.env[key]?.trim()

  if (!value) {
    return undefined
  }

  return value
}

export function getNotionEnv(): NotionEnv {
  return {
    secretKey: readEnv('NOTION_SECRET_KEY'),
    databaseId: readEnv('NOTION_DATABASE_ID'),
    dataSourceId: readEnv('NOTION_DATA_SOURCE_ID'),
    resumePageId: readEnv('NOTION_RESUME_PAGE_ID')
  }
}

export function requireEnv(
  values: Record<string, string | undefined>,
  source: string
): Result<Record<string, string>> {
  const missing = Object.entries(values)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    return {
      ok: false,
      source,
      error: `Missing required env: ${missing.join(', ')}`
    }
  }

  return {
    ok: true,
    data: values as Record<string, string>
  }
}
