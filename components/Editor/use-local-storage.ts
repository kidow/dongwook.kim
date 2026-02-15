import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, boolean] {
  const [storedValue, setStoredValue] = useState(initialValue)
  const [isReady, setIsReady] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const c = searchParams.get('c')
    const item = window.localStorage.getItem(key)
    if (c) {
      const content = JSON.parse(decodeURIComponent(atob(c)))
      setStoredValue(content)
    } else if (item) {
      setStoredValue(JSON.parse(item))
    }

    setIsReady(true)
  }, [key, searchParams])

  const setValue = (value: T) => {
    setStoredValue(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  return [storedValue, setValue, isReady]
}
