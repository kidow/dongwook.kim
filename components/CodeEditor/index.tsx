'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { copyText, toast } from '@/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import CodeEditorToolbar from './code-editor-toolbar'
import RunButton from './run-button'
import { useCodeSharing } from './use-code-sharing'
import {
  CODE_PRESETS,
  DEFAULT_TEMPLATE,
  SUPPORTED_TEMPLATES
} from './constants'

import type { EditorTheme, SupportedTemplate } from './types'

const SandpackProvider = dynamic(
  () =>
    import('@codesandbox/sandpack-react').then((mod) => mod.SandpackProvider),
  { ssr: false }
)

const SandpackCodeEditor = dynamic(
  () =>
    import('@codesandbox/sandpack-react').then((mod) => mod.SandpackCodeEditor),
  { ssr: false }
)

const SandpackPreview = dynamic(
  () =>
    import('@codesandbox/sandpack-react').then((mod) => mod.SandpackPreview),
  { ssr: false }
)

const SandpackConsole = dynamic(
  () =>
    import('@codesandbox/sandpack-react').then((mod) => mod.SandpackConsole),
  { ssr: false }
)

export default function CodeEditor() {
  const { initialState, share } = useCodeSharing()

  const [template, setTemplate] = useState<SupportedTemplate>(
    initialState?.template ?? DEFAULT_TEMPLATE
  )
  const [theme, setTheme] = useState<EditorTheme>('light')
  const [customCode, setCustomCode] = useState<string | null>(
    initialState?.code ?? null
  )
  const [presetKey, setPresetKey] = useState(0)

  const activeConfig = useMemo(
    () => SUPPORTED_TEMPLATES.find((t) => t.id === template)!,
    [template]
  )

  const currentCode = customCode ?? activeConfig.defaultCode

  const isReactTemplate = template === 'react' || template === 'react-ts'

  const handleTemplateChange = useCallback((newTemplate: string) => {
    const t = newTemplate as SupportedTemplate
    setTemplate(t)
    setCustomCode(null)
    setPresetKey((k) => k + 1)
  }, [])

  const handlePresetSelect = useCallback((presetId: string) => {
    const preset = CODE_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setTemplate(preset.template)
    setCustomCode(preset.code)
    setPresetKey((k) => k + 1)
  }, [])

  const handleShare = useCallback(() => {
    share({ template, code: currentCode })
  }, [share, template, currentCode])

  const handleCopyCode = useCallback(() => {
    copyText(currentCode)
    toast.success('코드가 복사되었습니다.')
  }, [currentCode])

  return (
    <Card className="overflow-hidden rounded-xl border-border shadow-sm">
      <CardHeader className="border-b border-border px-4 py-3">
        <CodeEditorToolbar
          template={template}
          theme={theme}
          onTemplateChange={handleTemplateChange}
          onThemeChange={setTheme}
          onPresetSelect={handlePresetSelect}
          onShare={handleShare}
          onCopyCode={handleCopyCode}
        />
      </CardHeader>
      <CardContent className="p-0">
        <SandpackProvider
          key={`${template}-${presetKey}`}
          template={template}
          theme={theme === 'dark' ? 'dark' : 'light'}
          files={{
            [activeConfig.entryFile]: {
              code: currentCode,
              active: true
            }
          }}
        >
          <div className="flex flex-col xl:flex-row">
            <div className="min-h-[300px] flex-1 overflow-auto xl:min-h-[500px]">
              <SandpackCodeEditor
                showLineNumbers
                showInlineErrors
                wrapContent
                style={{ height: '100%' }}
              />
            </div>
            <div className="flex min-h-[200px] flex-1 flex-col border-t border-border xl:min-h-[500px] xl:border-t-0 xl:border-l">
              <RunButton />
              <div className="flex-1">
                {isReactTemplate ? (
                  <SandpackPreview
                    showOpenInCodeSandbox={false}
                    style={{ height: '100%' }}
                  />
                ) : (
                  <SandpackConsole showHeader style={{ height: '100%' }} />
                )}
              </div>
            </div>
          </div>
        </SandpackProvider>
      </CardContent>
    </Card>
  )
}
