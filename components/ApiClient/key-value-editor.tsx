import { PlusIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createEmptyKeyValuePair } from './constants'

import type { KeyValuePair } from './types'

interface KeyValueEditorProps {
  pairs: KeyValuePair[]
  onPairsChange: (pairs: KeyValuePair[]) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export default function KeyValueEditor({
  pairs,
  onPairsChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value'
}: KeyValueEditorProps) {
  const handleToggle = (id: string) => {
    onPairsChange(
      pairs.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    )
  }

  const handleKeyChange = (id: string, key: string) => {
    onPairsChange(pairs.map((p) => (p.id === id ? { ...p, key } : p)))
  }

  const handleValueChange = (id: string, value: string) => {
    onPairsChange(pairs.map((p) => (p.id === id ? { ...p, value } : p)))
  }

  const handleRemove = (id: string) => {
    if (pairs.length <= 1) return
    onPairsChange(pairs.filter((p) => p.id !== id))
  }

  const handleAdd = () => {
    onPairsChange([...pairs, createEmptyKeyValuePair()])
  }

  return (
    <div className="flex flex-col gap-2">
      {pairs.map((pair) => (
        <div key={pair.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={pair.enabled}
            onChange={() => handleToggle(pair.id)}
            className="size-4 shrink-0 accent-primary"
          />
          <Input
            className={`flex-1 font-mono text-sm ${!pair.enabled ? 'opacity-50' : ''}`}
            placeholder={keyPlaceholder}
            value={pair.key}
            onChange={(e) => handleKeyChange(pair.id, e.target.value)}
          />
          <Input
            className={`flex-1 font-mono text-sm ${!pair.enabled ? 'opacity-50' : ''}`}
            placeholder={valuePlaceholder}
            value={pair.value}
            onChange={(e) => handleValueChange(pair.id, e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            disabled={pairs.length <= 1}
            onClick={() => handleRemove(pair.id)}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-fit" onClick={handleAdd}>
        <PlusIcon className="size-4" />
        추가
      </Button>
    </div>
  )
}
