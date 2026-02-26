const CACHE_NAME = '3d-print-calc-v3';
const ASSETS = ['./','index.html','app.js','style.css','manifest.json','/icons/icon-192.png','/icons/icon-512.png','/icons/related-icon.svg'];

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

  // Prefer network for navigation requests so index.html is fresh
  const accept = e.request.headers.get('accept') || '';
  const isNavigation = accept.includes('text/html') || e.request.mode === 'navigate';

  if (isNavigation) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        return resp;
      }).catch(() => caches.match('index.html'))
    );
    return;
  }

  // Cache-first for other assets
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    try { caches.open(CACHE_NAME).then(c => c.put(e.request, resp.clone())); } catch (err) {}
    return resp;
  })));
});

// Listen for messages from the page (e.g., to skipWaiting)
self.addEventListener('message', (e) => {
  const data = e.data;
  if (!data) return;
  if (data === 'SKIP_WAITING' || (data.type && data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});
