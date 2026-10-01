/* Ritmo · service worker
   Cachea SOLO archivos públicos de la app (HTML, íconos, manifest, librería y fuentes).
   Nunca toca peticiones a Supabase (*.supabase.co): tus datos privados no pasan por aquí.
   Sube la versión (V) cuando publiques cambios importantes. */
const V = 'ritmo-v1.97.0';
const CORE = ['./', './index.html', './config.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './mascota.png'];
const PUBLIC_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const networkFirst = async (req, fallback) => {
  const c = await caches.open(V);
  try { const r = await fetch(req); if (r && r.ok) c.put(req, r.clone()); return r; }
  catch (e) { return (await c.match(req)) || (fallback && await c.match(fallback)) || Response.error(); }
};
const staleWhileRevalidate = async req => {
  const c = await caches.open(V), hit = await c.match(req);
  const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => null);
  return hit || (await net) || Response.error();
};

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (/\.supabase\.(co|in)$/.test(url.hostname) || url.pathname.includes('/auth/v1/') || url.pathname.includes('/rest/v1/')) return; // privado: siempre red
  if (req.headers.get('authorization')) return;
  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate') return e.respondWith(networkFirst(req, './index.html'));
    if (url.pathname.endsWith('/config.js') || url.pathname.endsWith('/sw.js')) return e.respondWith(networkFirst(req));
    return e.respondWith(staleWhileRevalidate(req));
  }
  if (PUBLIC_HOSTS.includes(url.hostname)) return e.respondWith(staleWhileRevalidate(req));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./');
  }));
});
