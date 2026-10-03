/* ============================================
   LEARN EARN - Service Worker
   Monetag Push + PWA Offline Cache
   ============================================ */

const CACHE_VERSION = 'ys-store-v1790994663';
const CACHE_NAME = CACHE_VERSION + '-1790994663';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/manifest.json',
  '/js/i18n.js',
  '/js/lessons-data.js',
  '/js/duolingo-core.js',
  '/js/games-data.js',
  '/js/animasi.js',
  '/js/duolingo-ui.js',
  '/js/topup-ui.js',
  '/js/telegram-config.js',
  '/js/firebase-config.js',
  '/js/auth.js',
  '/js/rewards.js',
  '/js/ads-manager.js',
  '/js/log-tracker.js',
  '/js/referral.js',
  '/js/articles.js',
  '/js/app.js'
];

// ===== MONETAG PUSH (existing) =====
try {
  self.options = {
    "domain": "5gvci.com",
    "zoneId": 11886708
  };
  self.lary = "";
  importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw&v=9');
} catch (e) {
  console.warn('[SW] Monetag import failed:', e);
}

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Some assets failed:', err);
        return Promise.resolve();
      });
    }).then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key.startsWith('learnearn-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// ===== FETCH =====
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/admin/')) return;
  if (url.pathname.endsWith('.bak')) return;
  if (url.pathname.includes('assetlinks.json')) return;

  // HTML: network-first
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

  // Asset: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() => {
        if (req.destination === 'image') return new Response('', { status: 404 });
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// ===== MESSAGE =====
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
  }
});

console.log('[SW] Loaded (Learn Earn PWA + Monetag)');
