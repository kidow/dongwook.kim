import { CopyIcon, LoaderIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { copyText } from 'utils'
import JsonViewer from './json-viewer'
import { formatBytes, formatTime, getStatusColor, tryParseJson } from './utils'

import type { ResponseData } from './types'

interface ResponsePanelProps {
  response: ResponseData | null
  isLoading: boolean
  error: string | null
}

const MAX_BODY_SIZE = 100 * 1024

export default function ResponsePanel({
  response,
  isLoading,
  error
}: ResponsePanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border py-12">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">요청 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border py-12">
        <p className="text-sm text-muted-foreground">
          요청을 보내면 응답이 여기에 표시됩니다.
        </p>
      </div>
    )
  }

  const parsed = tryParseJson(response.body)
  const isTruncated = response.body.length > MAX_BODY_SIZE

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={cn('font-mono font-semibold', getStatusColor(response.status))}
        >
          {response.status} {response.statusText}
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">
          {formatTime(response.time)}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {formatBytes(response.size)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-7"
          onClick={() => copyText(response.body)}
        >
          <CopyIcon className="size-3.5" />
          Copy
        </Button>
      </div>

      <Tabs defaultValue="body">
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">
            Headers ({Object.keys(response.headers).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="mt-3">
          {isTruncated ? (
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-2 text-sm text-muted-foreground">
                응답이 너무 커서 전체를 표시할 수 없습니다 (
                {formatBytes(response.body.length)}).
              </p>
              <pre className="overflow-auto font-mono text-sm">
                {response.body.slice(0, MAX_BODY_SIZE)}...
              </pre>
            </div>
          ) : parsed !== null ? (
            <JsonViewer data={parsed} />
          ) : (
            <pre className="overflow-auto rounded-lg bg-muted/50 p-4 font-mono text-sm">
              {response.body}
            </pre>
          )}
        </TabsContent>

        <TabsContent value="headers" className="mt-3">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium">Header</th>
                  <th className="px-3 py-2 text-left font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response.headers).map(([key, value]) => (
                  <tr key={key} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-mono font-medium">
                      {key}
                    </td>
                    <td className="break-all px-3 py-2 font-mono text-muted-foreground">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
