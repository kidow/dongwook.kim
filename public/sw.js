const SW_VERSION = 'v1'
const STATIC_CACHE = `dwk-static-${SW_VERSION}`
const RUNTIME_CACHE = `dwk-runtime-${SW_VERSION}`
const OFFLINE_URL = '/offline'
const APP_SHELL = ['/', '/blog', '/memo', OFFLINE_URL]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  if (request.method !== 'GET') {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(STATIC_CACHE)
        return (await cache.match(OFFLINE_URL)) || Response.error()
      })
    )
    return
  }

  if (url.origin !== self.location.origin) {
    return
  }

  const isStaticAsset =
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached
        }

        return fetch(request).then((response) => {
          if (response.ok) {
            const cloned = response.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, cloned))
          }
          return response
        })
      })
    )
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const cloned = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, cloned))
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})
