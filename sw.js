/* YADSTORE — Service Worker (Monetag Push aktif) */

self.options = {
    "domain": "5gvci.com",
    "zoneId": 11886708
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw&v=9')

// Force skip waiting & claim
self.addEventListener('install', (event) => {
    self.skipWaiting();
    console.log('[SW] Installed (YadStore v9)');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    console.log('[SW] Activated & claimed clients');
});
