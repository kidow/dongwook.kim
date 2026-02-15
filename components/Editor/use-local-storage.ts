import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
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

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    const nextValue =
      value instanceof Function ? value(storedValue) : value

    setStoredValue(nextValue)
    window.localStorage.setItem(key, JSON.stringify(nextValue))
  }
  return [storedValue, setValue, true]
}
