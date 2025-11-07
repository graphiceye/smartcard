const CACHE_NAME = 'nfc-card-v2';
const PRECACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/dist/styles.css',
  '/assets/profile-placeholder.svg',
  '/assets/portfolio-1.svg',
  '/assets/portfolio-2.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Cache-first for same-origin images and static assets
  if (url.origin === location.origin && (event.request.destination === 'image' || url.pathname.endsWith('.svg') || url.pathname.endsWith('.css'))) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resp.clone());
          return resp;
        });
      })).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Network-first for navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(resp => {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resp.clone()));
        return resp;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Default: try cache, then network
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
