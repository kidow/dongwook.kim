import { useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    const c = new URLSearchParams(window.location.search).get('c')
    const item = window.localStorage.getItem(key)

    if (c) {
      return JSON.parse(decodeURIComponent(atob(c)))
    }

    if (item) {
      return JSON.parse(item)
    }

    return initialValue
  })

  const setValue = (value: T) => {
    setStoredValue(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  return [storedValue, setValue, true]
}
