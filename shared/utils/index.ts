import * as EventListener from './event-listener'

type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, boolean | null | undefined>

function toClassName(value: ClassValue): string {
  if (!value) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map(toClassName).filter(Boolean).join(' ')
  }

  return Object.entries(value)
    .filter(([, isEnabled]) => Boolean(isEnabled))
    .map(([className]) => className)
    .join(' ')
}

export function cn(...inputs: ClassValue[]) {
  return inputs.map(toClassName).filter(Boolean).join(' ')
}

export * as EventListener from './event-listener'

export function backdrop(open: boolean) {
  EventListener.emit('backdrop', open)
}

class Toast {
  private emit(message: string, type: NToast.Type) {
    EventListener.emit<NToast.Emit>('toast', { message, type })
  }

  success(message: string) {
    this.emit(message, 'success')
  }

  info(message: string) {
    this.emit(message, 'info')
  }

  warn(message: string) {
    this.emit(message, 'warn')
  }

  error(message: string) {
    this.emit(message, 'error')
  }
}

export const toast = new Toast()

export function copyText(text: string): Promise<string> | undefined {
  if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
    return
  }

  return new Promise((resolve, reject) =>
    window.navigator.clipboard
      .writeText(text)
      .then(() => resolve(text))
      .catch(reject)
  )
}
