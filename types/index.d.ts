import type { ReactNode } from 'react'

declare global {
  interface ReactProps {
    children?: ReactNode
  }

  namespace NToast {
    type Type = 'success' | 'info' | 'warn' | 'error'

    interface Emit {
      message: string
      type: Type
    }

    interface Item {
      id: string
      message: string
      type: Type
    }
  }
}

export {}
