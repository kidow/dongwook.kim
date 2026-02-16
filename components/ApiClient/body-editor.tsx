import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BODY_TYPES } from './constants'
import KeyValueEditor from './key-value-editor'

import type { BodyType, KeyValuePair } from './types'

interface BodyEditorProps {
  bodyType: BodyType
  bodyJson: string
  bodyFormData: KeyValuePair[]
  onBodyTypeChange: (type: BodyType) => void
  onBodyJsonChange: (json: string) => void
  onBodyFormDataChange: (pairs: KeyValuePair[]) => void
}

export default function BodyEditor({
  bodyType,
  bodyJson,
  bodyFormData,
  onBodyTypeChange,
  onBodyJsonChange,
  onBodyFormDataChange
}: BodyEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <Select
        value={bodyType}
        onValueChange={(v) => onBodyTypeChange(v as BodyType)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {BODY_TYPES.map((bt) => (
            <SelectItem key={bt.value} value={bt.value}>
              {bt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {bodyType === 'none' && (
        <p className="py-4 text-sm text-muted-foreground">
          이 요청에는 바디가 없습니다.
        </p>
      )}

      {bodyType === 'json' && (
        <Textarea
          className="min-h-[200px] font-mono text-sm"
          placeholder='{ "key": "value" }'
          value={bodyJson}
          onChange={(e) => onBodyJsonChange(e.target.value)}
        />
      )}

      {bodyType === 'form-data' && (
        <KeyValueEditor
          pairs={bodyFormData}
          onPairsChange={onBodyFormDataChange}
          keyPlaceholder="Field"
          valuePlaceholder="Value"
        />
      )}
    </div>
  )
}
