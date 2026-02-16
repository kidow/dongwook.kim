import type { BodyType, HttpMethod, KeyValuePair, RequestConfig } from './types'

export const HTTP_METHODS: {
  value: HttpMethod
  label: string
  color: string
}[] = [
  { value: 'GET', label: 'GET', color: 'text-green-600' },
  { value: 'POST', label: 'POST', color: 'text-yellow-600' },
  { value: 'PUT', label: 'PUT', color: 'text-blue-600' },
  { value: 'PATCH', label: 'PATCH', color: 'text-purple-600' },
  { value: 'DELETE', label: 'DELETE', color: 'text-red-600' }
]

export const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'json', label: 'JSON' },
  { value: 'form-data', label: 'Form Data' }
]

export const STORAGE_KEYS = {
  history: 'api-client-history',
  collections: 'api-client-collections'
} as const

export const MAX_HISTORY_ENTRIES = 50

export function createEmptyKeyValuePair(): KeyValuePair {
  return {
    id: crypto.randomUUID(),
    key: '',
    value: '',
    enabled: true
  }
}

export function createDefaultRequest(): RequestConfig {
  return {
    method: 'GET',
    url: '',
    headers: [createEmptyKeyValuePair()],
    params: [createEmptyKeyValuePair()],
    bodyType: 'none',
    bodyJson: '{\n  \n}',
    bodyFormData: [createEmptyKeyValuePair()]
  }
}
