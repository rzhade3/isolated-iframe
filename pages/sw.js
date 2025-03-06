// Add these event listeners at the beginning of your service worker
self.addEventListener('install', event => {
  // Force the service worker to activate immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  // Take control of all clients/pages within the service worker's scope
  event.waitUntil(clients.claim());
});

const allowedOrigins = [
  self.origin
]

self.addEventListener('fetch', (e) => {
  return e.respondWith(new Promise((res, rej) => {
    console.log('[Service Worker] received resource request', e.request.url);

    const url = e.request.url
    const urlOrigin = new URL(url).origin
    // Only allow requesting resources from the allowed origins list:
    if (allowedOrigins.includes(urlOrigin)) {
      console.log('permitting request', url)
      return res(fetch(e.request))
    }

    console.log('rejecting resource request:', url)
    return rej(new Error('Unauthorized network request.'))
  }))
});

