'use client'

import { LanguagesIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'

type LanguageMode = 'ko' | 'en'

const STORAGE_KEY = 'site-language-mode'

function applyLanguage(mode: LanguageMode) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.lang = mode
  root.dataset.locale = mode
}

export default function WidgetI18n() {
  const [mode, setMode] = useState<LanguageMode>('ko')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as LanguageMode | null
    const initialMode = saved === 'en' || saved === 'ko' ? saved : 'ko'

    setMode(initialMode)
    applyLanguage(initialMode)
  }, [])

  useEffect(() => {
    applyLanguage(mode)
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const items = useMemo(
    () => [
      { key: 'ko' as const, label: '�ѱ���', shortLabel: 'KO' },
      { key: 'en' as const, label: 'English', shortLabel: 'EN' }
    ],
    []
  )

  return (
    <li className="overflow-hidden transition-all duration-150 xl:hover:rotate-1">
      <Card className="h-[178px] w-full rounded-3xl border-border py-0 shadow-sm xl:h-[175px] xl:w-[175px]">
        <CardContent className="flex h-full flex-col justify-between p-5 xl:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-muted text-foreground">
            <LanguagesIcon className="size-5" />
          </span>

          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => {
              const selected = item.key === mode

              return (
                <button
                  key={item.key}
                  type="button"
                  aria-label={item.label}
                  title={item.label}
                  onClick={() => setMode(item.key)}
                  className={`inline-flex h-10 w-full items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                    selected
                      ? 'border-transparent bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.shortLabel}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </li>
  )
}

