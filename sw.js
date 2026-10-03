/* ============================================
   YS STORE — Service Worker
   ============================================ */

const CACHE_VERSION = 'yadstore-v1791001665';
const CACHE_NAME = CACHE_VERSION + '-' + '1791001665';



const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/ys-store.css',
  '/manifest.json',
  '/js/games-data.js',
  '/js/firebase-config.js',
  '/js/auth.js',
  '/js/telegram-config.js',
  '/js/animasi.js',
  '/js/topup-ui.js',
  '/js/home-store.js',
  '/js/premium-ui.js',
  '/js/app.js',
  '/js/log-tracker.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => Promise.resolve());
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key.startsWith('ys-store-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/admin/')) return;

  if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() => new Response('Offline', { status: 503 }));
    })
  );
});

console.log('[SW] YS Store loaded');
