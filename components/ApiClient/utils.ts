import { HTTP_METHODS } from './constants'

import type { HttpMethod, KeyValuePair } from './types'

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value % 1 === 0 ? value : value.toFixed(1)} ${units[i]}`
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(1)} s`
}

export function buildUrlWithParams(
  baseUrl: string,
  params: KeyValuePair[]
): string {
  const enabledParams = params.filter((p) => p.enabled && p.key.trim())
  if (enabledParams.length === 0) return baseUrl

  try {
    const url = new URL(baseUrl)
    for (const p of enabledParams) {
      url.searchParams.append(p.key.trim(), p.value)
    }
    return url.toString()
  } catch {
    const qs = enabledParams
      .map(
        (p) =>
          `${encodeURIComponent(p.key.trim())}=${encodeURIComponent(p.value)}`
      )
      .join('&')
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}${qs}`
  }
}

export function parseResponseHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {}
  headers.forEach((value, key) => {
    result[key] = value
  })
  return result
}

export function tryParseJson(text: string): unknown | null {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function getMethodColor(method: HttpMethod): string {
  return HTTP_METHODS.find((m) => m.value === method)?.color ?? ''
}

export function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'text-green-600'
  if (status >= 300 && status < 400) return 'text-blue-600'
  if (status >= 400 && status < 500) return 'text-yellow-600'
  if (status >= 500) return 'text-red-600'
  return 'text-muted-foreground'
}

export function getRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return '방금 전'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}
