import { useCallback } from 'react'
import { copyText, toast } from '@/utils'

import type { ShareableState } from './types'

function parseUrlState(): ShareableState | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('code')
  if (!encoded) return null
  try {
    return JSON.parse(decodeURIComponent(atob(encoded))) as ShareableState
  } catch {
    return null
  }
}

export function useCodeSharing() {
  const initialState = parseUrlState()

  const share = useCallback((state: ShareableState) => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(state)))
    const url = `${window.location.origin}/code-editor?code=${encoded}`
    if (url.length > 2000) {
      toast.warn('코드가 길어 URL이 잘릴 수 있습니다.')
    }
    copyText(url)
    toast.success('링크가 복사되었습니다.')
  }, [])

  return { initialState, share }
}
