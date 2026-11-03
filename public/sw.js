const STATIC_CACHE = 'ecovex-static-v2';
const PAGES_CACHE = 'ecovex-pages-v2';

const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/logo.png',
  '/pwa-multi-devices.jpg',
  '/hero-recycling.png',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/offline',
];

const PRIVATE_PATTERNS = [
  /^\/api\//,
  /^\/connexion/,
  /^\/inscription/,
  /^\/admin/,
  /^\/citoyen/,
  /^\/verificateur/,
  /^\/acces-interdit/,
];

// Install: pre-cache critical public assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS.filter((url) => url !== '/offline'));
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up older caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => ![STATIC_CACHE, PAGES_CACHE].includes(name))
          .map((name) => {
            console.log('[PWA SW] Deleting outdated cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: smart network-first & cache fallback strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET and cross-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Never intercept Turbopack HMR or development requests
  if (
    url.pathname.includes('__turbopack__') ||
    url.pathname.includes('webpack-hmr') ||
    url.pathname.includes('/_next/development/')
  ) {
    return;
  }

  // Never cache private/authenticated routes
  if (PRIVATE_PATTERNS.some((pattern) => pattern.test(url.pathname))) return;

  // Next.js chunks (_next/static): Network First with Cache fallback
  // This prevents stale chunk factory errors when new builds/versions are released
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Pure static image/icon assets: Cache First
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML Page Navigation requests: Network First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline');
          });
        })
    );
    return;
  }
});
