'use client'

import { useState } from 'react'
import {
  ChevronDownIcon,
  FolderPlusIcon,
  SaveIcon,
  Trash2Icon,
  XIcon
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'utils'
import { getMethodColor } from './utils'

import type { Collection, RequestConfig, SavedRequest } from './types'

interface CollectionPanelProps {
  collections: Collection[]
  currentRequest: RequestConfig
  onCollectionsChange: (collections: Collection[]) => void
  onLoadRequest: (config: RequestConfig) => void
}

export default function CollectionPanel({
  collections,
  currentRequest,
  onCollectionsChange,
  onLoadRequest
}: CollectionPanelProps) {
  const [open, setOpen] = useState(false)
  const [requestName, setRequestName] = useState('')
  const [selectedCollectionId, setSelectedCollectionId] = useState('')
  const [newCollectionName, setNewCollectionName] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSave = () => {
    if (!requestName.trim()) {
      toast.error('요청 이름을 입력해주세요')
      return
    }

    let targetId = selectedCollectionId

    if (!targetId && newCollectionName.trim()) {
      const newCollection: Collection = {
        id: crypto.randomUUID(),
        name: newCollectionName.trim(),
        requests: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      targetId = newCollection.id
      onCollectionsChange([...collections, newCollection])
    }

    if (!targetId) {
      toast.error('컬렉션을 선택하거나 새로 만들어주세요')
      return
    }

    const savedRequest: SavedRequest = {
      id: crypto.randomUUID(),
      name: requestName.trim(),
      config: structuredClone(currentRequest)
    }

    onCollectionsChange(
      collections.map((c) =>
        c.id === targetId
          ? {
              ...c,
              requests: [...c.requests, savedRequest],
              updatedAt: Date.now()
            }
          : c
      )
    )

    toast.success('요청이 저장되었습니다')
    setOpen(false)
    setRequestName('')
    setNewCollectionName('')
    setSelectedCollectionId('')
  }

  const handleDeleteCollection = (id: string) => {
    onCollectionsChange(collections.filter((c) => c.id !== id))
  }

  const handleDeleteRequest = (collectionId: string, requestId: string) => {
    onCollectionsChange(
      collections.map((c) =>
        c.id === collectionId
          ? {
              ...c,
              requests: c.requests.filter((r) => r.id !== requestId),
              updatedAt: Date.now()
            }
          : c
      )
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">컬렉션</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <SaveIcon className="size-3.5" />
              저장
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>요청 저장</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">요청 이름</label>
                <Input
                  placeholder="예: Get Users"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                />
              </div>

              {collections.length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    기존 컬렉션 선택
                  </label>
                  <div className="flex flex-col gap-1">
                    {collections.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={cn(
                          'rounded-md px-3 py-2 text-left text-sm',
                          selectedCollectionId === c.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted/50'
                        )}
                        onClick={() => {
                          setSelectedCollectionId(
                            selectedCollectionId === c.id ? '' : c.id
                          )
                          setNewCollectionName('')
                        }}
                      >
                        {c.name} ({c.requests.length})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {collections.length > 0
                    ? '또는 새 컬렉션 만들기'
                    : '새 컬렉션 만들기'}
                </label>
                <div className="flex items-center gap-2">
                  <FolderPlusIcon className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    placeholder="컬렉션 이름"
                    value={newCollectionName}
                    onChange={(e) => {
                      setNewCollectionName(e.target.value)
                      setSelectedCollectionId('')
                    }}
                  />
                </div>
              </div>

              <Button onClick={handleSave}>저장</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {collections.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          저장된 컬렉션이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {collections.map((collection) => (
            <div key={collection.id}>
              <div className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50">
                <button
                  type="button"
                  className="flex flex-1 items-center gap-2"
                  onClick={() => toggleExpand(collection.id)}
                >
                  <ChevronDownIcon
                    className={cn(
                      'size-4 shrink-0 transition-transform',
                      !expandedIds.has(collection.id) && '-rotate-90'
                    )}
                  />
                  <span className="text-sm font-medium">{collection.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({collection.requests.length})
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0 opacity-0 group-hover:opacity-100"
                  onClick={() => handleDeleteCollection(collection.id)}
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              </div>

              {expandedIds.has(collection.id) && (
                <div className="ml-6 flex flex-col gap-0.5">
                  {collection.requests.map((req) => (
                    <div
                      key={req.id}
                      className="group/req flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/50"
                      onClick={() => onLoadRequest(req.config)}
                    >
                      <Badge
                        variant="outline"
                        className={cn(
                          'shrink-0 font-mono text-xs',
                          getMethodColor(req.config.method)
                        )}
                      >
                        {req.config.method}
                      </Badge>
                      <span className="truncate text-xs">{req.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto size-5 shrink-0 opacity-0 group-hover/req:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteRequest(collection.id, req.id)
                        }}
                      >
                        <XIcon className="size-3" />
                      </Button>
                    </div>
                  ))}
                  {collection.requests.length === 0 && (
                    <p className="px-2 py-1 text-xs text-muted-foreground">
                      저장된 요청이 없습니다.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
