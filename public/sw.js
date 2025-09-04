// Service Worker for Understanding PWA
// Version: 0.0.8
// Note: This version must be manually synced with src/utils/version.ts

const CACHE_NAME = 'understanding-v0.0.8';
// Only pre-cache non-hashed assets that won't change between builds
const urlsToCache = [
  '/manifest.json',
  '/mrjoy_192.png',
  '/mrjoy_512.png'
];

// Install event - minimal pre-caching
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[ServiceWorker] Cache failed:', error);
      })
  );
  // Don't skip waiting automatically - wait for user confirmation
  // self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('understanding-') && cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);

  // Determine caching strategy based on resource type
  // For hashed assets (immutable), use cache-first
  const isHashedAsset = url.pathname.includes('/_next/static/') ||
                        url.pathname.match(/\.[0-9a-f]{8,}\./);

  // For HTML documents and API routes, use network-first
  const isDocument = event.request.destination === 'document' ||
                     url.pathname === '/' ||
                     url.pathname.startsWith('/api/');

  if (isHashedAsset) {
    // Cache-first for immutable hashed assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            // Only cache successful responses
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          });
        })
    );
  } else if (isDocument) {
    // Network-first for HTML and API routes
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Don't cache API responses or non-200 responses
          if (response && response.status === 200 && !url.pathname.startsWith('/api/')) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // Only fall back to cache for HTML documents
          if (event.request.destination === 'document') {
            return caches.match(event.request);
          }
        })
    );
  } else {
    // Default: network-first with cache fallback for other resources
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[ServiceWorker] Skip waiting');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CHECK_UPDATE') {
    // This will be used for manual update checks
    console.log('[ServiceWorker] Checking for updates');
    self.registration.update();
  }
});
