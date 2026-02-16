export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type BodyType = 'json' | 'form-data' | 'none'

export interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
}

export interface RequestConfig {
  method: HttpMethod
  url: string
  headers: KeyValuePair[]
  params: KeyValuePair[]
  bodyType: BodyType
  bodyJson: string
  bodyFormData: KeyValuePair[]
}

export interface ResponseData {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  time: number
  size: number
}

export interface HistoryEntry {
  id: string
  timestamp: number
  request: RequestConfig
  response: Pick<ResponseData, 'status' | 'statusText' | 'time' | 'size'>
}

export interface Collection {
  id: string
  name: string
  requests: SavedRequest[]
  createdAt: number
  updatedAt: number
}

export interface SavedRequest {
  id: string
  name: string
  config: RequestConfig
}
