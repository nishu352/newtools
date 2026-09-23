/**
 * OmniTools Service Worker
 * Offline caching for client-side tools and static assets.
 * Excludes all API endpoints and non-GET requests.
 */

const CACHE_NAME = 'omnitools-v1';

const STATIC_PRECACHE = [
  '/',
  '/tools',
  '/categories',
  '/about',
  '/privacy',
  '/manifest.json',
  '/favicon.ico',
];

// Install: cache application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_PRECACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate: clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME && name.startsWith('omnitools-')) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch: serve from cache or network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Never cache non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // 2. Never cache backend API requests
  if (url.pathname.startsWith('/api/') || url.port === '4000') {
    return;
  }

  // 3. Static assets: Cache-First
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 4. HTML Navigation / Tool Routes: Network-First with Cache Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return root shell or tools directory
            return caches.match('/tools');
          });
        })
    );
    return;
  }
});
