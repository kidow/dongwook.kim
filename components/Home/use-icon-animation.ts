import { useRef } from 'react'

interface IconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

/** Starts the icon animation while the surrounding control is hovered or focused. */
export function useIconAnimation() {
  const ref = useRef<IconHandle>(null)
  const start = () => ref.current?.startAnimation()
  const stop = () => ref.current?.stopAnimation()
  return {
    ref,
    handlers: {
      onMouseEnter: start,
      onMouseLeave: stop,
      onFocus: start,
      onBlur: stop
    }
  }
}
