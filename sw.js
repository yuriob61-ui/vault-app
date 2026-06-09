const CACHE = 'vault-v1';
const ASSETS = [
  '/vault-app/index.html',
  '/vault-app/manifest.json',
  '/vault-app/icon-192.png',
  '/vault-app/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() =>
      caches.match('/vault-app/index.html')
    ))
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'Vault', body: 'Tienes una notificación' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/vault-app/icon-192.png',
      badge: '/vault-app/icon-192.png',
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('https://yuriob61-ui.github.io/vault-app/'));
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/vault-app/icon-192.png',
        badge: '/vault-app/icon-192.png',
        vibrate: [200, 100, 200]
      });
    }, delay);
  }
});
