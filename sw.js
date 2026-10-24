// Change this version whenever a bundled file changes, so updates are atomic.
const CACHE_PREFIX = 'matrix-offline:' + self.registration.scope + ':';
const CACHE_NAME = CACHE_PREFIX + 'v33';
const ASSETS = [
  'index.html', 'offline.js', 'ZW clock.html', 'cal.html', '101010.html',
  '12 h.html', '12life.html', '9P.html', 'Matrix_九宮飛星_流年羅盤與宅盤_v2.html', 'lifeData.js', 'lunar.min.js',
  'bagua.html', 'bagua-data.js', 'ornaments.js'
];

self.addEventListener('install', event => {
  // A failed download prevents activation rather than reporting partial readiness.
  event.waitUntil(caches.open(CACHE_NAME).then(cache =>
    cache.addAll(ASSETS.map(path => new Request(new URL(path, self.registration.scope), {cache: 'reload'})))
  ));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;
  const index = new URL('index.html', self.registration.scope);
  const key = url.pathname === new URL(self.registration.scope).pathname ? index.href : request;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(key, {ignoreSearch: true});
    if (cached) return cached;
    return fetch(request);
  })());
});