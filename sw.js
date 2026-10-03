/* ============================================
   SERVICE WORKER — Learn Earn
   NO CACHE untuk ads & API
   ============================================ */

const CACHE_VERSION = 'yadstore-v1791009069';
const CACHE_NAME = CACHE_VERSION + '-' + '1791009069';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// ===== INSTALL =====
self.addEventListener('install', function(event) {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_ASSETS).catch(function(err) {
        console.warn('[SW] Precache partial fail:', err);
      });
    }).then(function() { return self.skipWaiting(); })
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', function(event) {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { 
          return k.startsWith('yadstore-') && k !== CACHE_NAME;
        }).map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// ===== FETCH =====
self.addEventListener('fetch', function(event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  
  var url = new URL(req.url);
  
  // ===== SKIP CACHE: Ads scripts =====
  if (url.hostname.indexOf('profitableratecpmnetwork.com') !== -1 ||
      url.hostname.indexOf('adsterra') !== -1) {
    // Network-only, no cache
    return; // Let browser handle natively
  }
  
  // ===== SKIP CACHE: API calls =====
  if (url.pathname.indexOf('/api/') === 0) {
    return;
  }
  
  // ===== SKIP CACHE: Telegram =====
  if (url.hostname.indexOf('telegram.org') !== -1) {
    return;
  }
  
  // ===== SKIP CACHE: Firebase =====
  if (url.hostname.indexOf('firebaseio.com') !== -1 ||
      url.hostname.indexOf('googleapis.com') !== -1) {
    return;
  }
  
  // ===== SKIP CACHE: Adsterra debug =====
  if (url.pathname.indexOf('ads-debug') !== -1) {
    event.respondWith(fetch(req));
    return;
  }
  
  // ===== HTML: Network-first =====
  if (req.headers.get('accept') && req.headers.get('accept').indexOf('text/html') !== -1) {
    event.respondWith(
      fetch(req).then(function(res) {
        var clone = res.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(req, clone); });
        return res;
      }).catch(function() {
        return caches.match(req).then(function(c) {
          return c || caches.match('/index.html');
        });
      })
    );
    return;
  }
  
  // ===== Assets: Cache-first =====
  event.respondWith(
    caches.match(req).then(function(cached) {
      if (cached) return cached;
      return fetch(req).then(function(res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var clone = res.clone();
          caches.open(CACHE_NAME).then(function(c) { c.put(req, clone); });
        }
        return res;
      }).catch(function() {
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// ===== MESSAGE =====
self.addEventListener('message', function(event) {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(function(keys) {
      keys.forEach(function(k) { caches.delete(k); });
    });
  }
});

console.log('[SW] Ready');
