'use client'

import { useCallback, useEffect, useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'utils'
import BodyEditor from './body-editor'
import CollectionPanel from './collection-panel'
import {
  MAX_HISTORY_ENTRIES,
  STORAGE_KEYS,
  createDefaultRequest
} from './constants'
import CorsNotice from './cors-notice'
import HistoryPanel from './history-panel'
import KeyValueEditor from './key-value-editor'
import ResponsePanel from './response-panel'
import UrlBar from './url-bar'
import {
  buildUrlWithParams,
  parseResponseHeaders
} from './utils'

import type {
  BodyType,
  Collection,
  HistoryEntry,
  HttpMethod,
  KeyValuePair,
  RequestConfig,
  ResponseData
} from './types'

export default function ApiClient() {
  const [request, setRequest] = useState<RequestConfig>(createDefaultRequest)
  const [response, setResponse] = useState<ResponseData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.history)
      if (stored) setHistory(JSON.parse(stored))
    } catch {
      /* ignore corrupted data */
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.collections)
      if (stored) setCollections(JSON.parse(stored))
    } catch {
      /* ignore corrupted data */
    }
  }, [])

  const saveHistory = useCallback((entries: HistoryEntry[]) => {
    setHistory(entries)
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(entries))
  }, [])

  const saveCollections = useCallback((cols: Collection[]) => {
    setCollections(cols)
    localStorage.setItem(STORAGE_KEYS.collections, JSON.stringify(cols))
  }, [])

  const handleMethodChange = useCallback((method: HttpMethod) => {
    setRequest((prev) => ({ ...prev, method }))
  }, [])

  const handleUrlChange = useCallback((url: string) => {
    setRequest((prev) => ({ ...prev, url }))
  }, [])

  const handleParamsChange = useCallback((params: KeyValuePair[]) => {
    setRequest((prev) => ({ ...prev, params }))
  }, [])

  const handleHeadersChange = useCallback((headers: KeyValuePair[]) => {
    setRequest((prev) => ({ ...prev, headers }))
  }, [])

  const handleBodyTypeChange = useCallback((bodyType: BodyType) => {
    setRequest((prev) => ({ ...prev, bodyType }))
  }, [])

  const handleBodyJsonChange = useCallback((bodyJson: string) => {
    setRequest((prev) => ({ ...prev, bodyJson }))
  }, [])

  const handleBodyFormDataChange = useCallback(
    (bodyFormData: KeyValuePair[]) => {
      setRequest((prev) => ({ ...prev, bodyFormData }))
    },
    []
  )

  const handleSend = useCallback(async () => {
    if (!request.url.trim()) {
      toast.error('URL을 입력해주세요')
      return
    }

    setIsLoading(true)
    setError(null)
    setResponse(null)

    const url = buildUrlWithParams(request.url, request.params)
    const headers: Record<string, string> = {}
    for (const h of request.headers) {
      if (h.enabled && h.key.trim()) {
        headers[h.key.trim()] = h.value
      }
    }

    let body: string | FormData | undefined
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      if (request.bodyType === 'json') {
        body = request.bodyJson
        if (!headers['Content-Type']) {
          headers['Content-Type'] = 'application/json'
        }
      } else if (request.bodyType === 'form-data') {
        const formData = new FormData()
        for (const pair of request.bodyFormData) {
          if (pair.enabled && pair.key.trim()) {
            formData.append(pair.key.trim(), pair.value)
          }
        }
        body = formData
        delete headers['Content-Type']
      }
    }

    const startTime = performance.now()
    try {
      const res = await fetch(url, {
        method: request.method,
        headers,
        body
      })
      const endTime = performance.now()
      const text = await res.text()

      const responseData: ResponseData = {
        status: res.status,
        statusText: res.statusText,
        headers: parseResponseHeaders(res.headers),
        body: text,
        time: Math.round(endTime - startTime),
        size: new Blob([text]).size
      }

      setResponse(responseData)

      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        request: structuredClone(request),
        response: {
          status: responseData.status,
          statusText: responseData.statusText,
          time: responseData.time,
          size: responseData.size
        }
      }
      saveHistory([entry, ...history].slice(0, MAX_HISTORY_ENTRIES))
    } catch (err) {
      setError(
        err instanceof TypeError
          ? '요청에 실패했습니다. CORS 정책 또는 네트워크 오류를 확인해주세요.'
          : err instanceof Error
            ? err.message
            : '알 수 없는 오류'
      )
    } finally {
      setIsLoading(false)
    }
  }, [request, history, saveHistory])

  const handleLoadFromHistory = useCallback((entry: HistoryEntry) => {
    setRequest(structuredClone(entry.request))
    setResponse(null)
    setError(null)
    toast.info('히스토리에서 요청을 불러왔습니다')
  }, [])

  const handleDeleteHistoryEntry = useCallback(
    (id: string) => {
      saveHistory(history.filter((h) => h.id !== id))
    },
    [history, saveHistory]
  )

  const handleClearHistory = useCallback(() => {
    saveHistory([])
    toast.info('히스토리가 삭제되었습니다')
  }, [saveHistory])

  const handleLoadRequest = useCallback((config: RequestConfig) => {
    setRequest(structuredClone(config))
    setResponse(null)
    setError(null)
    toast.info('컬렉션에서 요청을 불러왔습니다')
  }, [])

  const enabledParamsCount = request.params.filter(
    (p) => p.enabled && p.key.trim()
  ).length
  const enabledHeadersCount = request.headers.filter(
    (h) => h.enabled && h.key.trim()
  ).length

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">API Client</h1>
        <p className="text-sm text-muted-foreground">
          브라우저에서 HTTP API를 테스트할 수 있는 도구입니다.
        </p>
      </div>

      <CorsNotice />

      <UrlBar
        method={request.method}
        url={request.url}
        isLoading={isLoading}
        onMethodChange={handleMethodChange}
        onUrlChange={handleUrlChange}
        onSend={handleSend}
      />

      <Tabs defaultValue="params">
        <TabsList>
          <TabsTrigger value="params">
            Params{enabledParamsCount > 0 && ` (${enabledParamsCount})`}
          </TabsTrigger>
          <TabsTrigger value="headers">
            Headers{enabledHeadersCount > 0 && ` (${enabledHeadersCount})`}
          </TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="mt-3">
          <KeyValueEditor
            pairs={request.params}
            onPairsChange={handleParamsChange}
            keyPlaceholder="Parameter"
            valuePlaceholder="Value"
          />
        </TabsContent>

        <TabsContent value="headers" className="mt-3">
          <KeyValueEditor
            pairs={request.headers}
            onPairsChange={handleHeadersChange}
          />
        </TabsContent>

        <TabsContent value="body" className="mt-3">
          <BodyEditor
            bodyType={request.bodyType}
            bodyJson={request.bodyJson}
            bodyFormData={request.bodyFormData}
            onBodyTypeChange={handleBodyTypeChange}
            onBodyJsonChange={handleBodyJsonChange}
            onBodyFormDataChange={handleBodyFormDataChange}
          />
        </TabsContent>
      </Tabs>

      <div>
        <h2 className="mb-3 text-sm font-semibold">Response</h2>
        <ResponsePanel
          response={response}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <HistoryPanel
          history={history}
          onLoad={handleLoadFromHistory}
          onDelete={handleDeleteHistoryEntry}
          onClear={handleClearHistory}
        />
        <CollectionPanel
          collections={collections}
          currentRequest={request}
          onCollectionsChange={saveCollections}
          onLoadRequest={handleLoadRequest}
        />
      </div>
    </div>
  )
}
