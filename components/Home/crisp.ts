// Minimal Crisp chatbox loader (https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/dollar-crisp/).
// The default launcher stays hidden; the site's own Chat button opens it.

type CrispCommand = unknown[]

declare global {
  interface Window {
    $crisp?: CrispCommand[] & {
      get?: (key: string) => unknown
      is?: (key: string) => boolean
    }
    CRISP_WEBSITE_ID?: string
  }
}

export const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

function push(...command: CrispCommand) {
  window.$crisp?.push(command)
}

// Crisp keeps one callback per event, so availability fans out from here.
const availabilityListeners = new Set<(online: boolean) => void>()

function notifyAvailability(online: boolean) {
  availabilityListeners.forEach((listener) => listener(online))
}

/** Subscribes to whether I'm online in Crisp. Returns an unsubscribe function. */
export function subscribeAvailability(listener: (online: boolean) => void) {
  availabilityListeners.add(listener)
  if (window.$crisp?.is) listener(window.$crisp.is('website:available'))
  return () => {
    availabilityListeners.delete(listener)
  }
}

/** Injects the Crisp script once and applies the site configuration. */
export function loadCrisp() {
  if (!CRISP_WEBSITE_ID || typeof window === 'undefined' || window.$crisp) {
    return
  }

  window.$crisp = [] as unknown as NonNullable<Window['$crisp']>
  window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID

  push('do', 'chat:hide')
  push('config', 'color:mode', ['dark'])
  push('config', 'color:theme', ['blue'])
  // Hide the launcher again once the visitor closes the chatbox.
  push('on', 'chat:closed', () => push('do', 'chat:hide'))
  // Surface replies that arrive while the chatbox is hidden.
  push('on', 'message:received', () => push('do', 'chat:show'))
  // Returning visitors with unread replies see the launcher right away.
  push('on', 'session:loaded', () => {
    if (Number(window.$crisp?.get?.('chat:unread:count')) > 0) {
      push('do', 'chat:show')
    }
    notifyAvailability(Boolean(window.$crisp?.is?.('website:available')))
  })
  push('on', 'website:availability:changed', (online: boolean) =>
    notifyAvailability(online)
  )

  const script = document.createElement('script')
  script.src = 'https://client.crisp.chat/l.js'
  script.async = true
  document.head.appendChild(script)
}

/** Loads Crisp when the browser is idle after the page has loaded. */
export function preloadCrispWhenIdle() {
  const run = () =>
    'requestIdleCallback' in window
      ? window.requestIdleCallback(loadCrisp, { timeout: 4000 })
      : setTimeout(loadCrisp, 2000)

  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })
}

export function openCrisp() {
  loadCrisp()
  push('do', 'chat:show')
  push('do', 'chat:open')
}
