const CACHE_NAME = '3d-print-calc-v2';
const ASSETS = ['./','index.html','app.js','style.css','manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k === CACHE_NAME ? null : caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// Listen for messages from the page (e.g., to skipWaiting)
self.addEventListener('message', (e) => {
  const data = e.data;
  if (!data) return;
  if (data === 'SKIP_WAITING' || (data.type && data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});
