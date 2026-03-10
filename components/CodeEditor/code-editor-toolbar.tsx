'use client'

import { CopyIcon, Share2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { CODE_PRESETS, SUPPORTED_TEMPLATES } from './constants'

import type { SupportedTemplate } from './types'

interface CodeEditorToolbarProps {
  template: SupportedTemplate
  onTemplateChange: (template: SupportedTemplate) => void
  onPresetSelect: (presetId: string) => void
  onShare: () => void
  onCopyCode: () => void
}

export default function CodeEditorToolbar({
  template,
  onTemplateChange,
  onPresetSelect,
  onShare,
  onCopyCode
}: CodeEditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={template} onValueChange={onTemplateChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="언어 선택" />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_TEMPLATES.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onPresetSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="예제 선택" />
        </SelectTrigger>
        <SelectContent>
          {CODE_PRESETS.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-9"
          onClick={onCopyCode}
          title="코드 복사"
        >
          <CopyIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-9"
          onClick={onShare}
          title="링크 공유"
        >
          <Share2Icon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
