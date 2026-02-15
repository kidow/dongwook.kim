export { cn } from './cn'
export * as EventListener from './event-listener'

import * as EventListener from './event-listener'

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
  if (
    typeof window === 'undefined' ||
    typeof window.navigator === 'undefined'
  ) {
    return
  }

  return new Promise((resolve, reject) =>
    window.navigator.clipboard
      .writeText(text)
      .then(() => resolve(text))
      .catch(reject)
  )
}
