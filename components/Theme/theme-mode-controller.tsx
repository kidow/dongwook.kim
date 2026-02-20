'use client'

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Card } from '@/components/ui/card'

type ThemeMode = 'system' | 'dark' | 'light'

const STORAGE_KEY = 'site-theme-mode'

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') {
    return
  }

  const resolved = mode === 'system' ? getSystemTheme() : mode
  const root = document.documentElement

  root.dataset.theme = resolved
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}

export default function ThemeModeController() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'system'
    }

    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    return saved === 'light' || saved === 'dark' || saved === 'system'
      ? saved
      : 'system'
  })

  useEffect(() => {
    applyTheme(mode)
    window.localStorage.setItem(STORAGE_KEY, mode)

    if (mode !== 'system') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [mode])

  const items = useMemo(
    () => [
      {
        key: 'system' as const,
        label: 'System',
        icon: <MonitorIcon className="size-4" />
      },
      {
        key: 'dark' as const,
        label: 'Dark',
        icon: <MoonIcon className="size-4" />
      },
      {
        key: 'light' as const,
        label: 'Light',
        icon: <SunIcon className="size-4" />
      }
    ],
    []
  )

  return (
    <li className="h-[178px] w-full xl:h-[175px] xl:w-[175px]">
      <Card className="flex h-full w-full flex-col justify-between gap-4 rounded-3xl border-border px-4 py-4 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Appearance
          </p>
          <h3 className="text-sm font-semibold">Theme</h3>
        </div>

        <div className="flex items-center justify-between gap-1 rounded-full border border-border bg-muted/40 p-1.5">
          {items.map((item) => {
            const selected = mode === item.key

            return (
              <button
                key={item.key}
                type="button"
                aria-label={item.label}
                title={item.label}
                onClick={() => setMode(item.key)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  selected
                    ? 'border-transparent bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.icon}
              </button>
            )
          })}
        </div>
      </Card>
    </li>
  )
}
