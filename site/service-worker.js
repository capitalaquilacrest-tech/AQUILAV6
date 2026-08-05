const CACHE = "aquila-vnext-8-chat-unread-counter";
const ASSETS = [
  "./",
  "index.html",
  "privacy-policy.html",
  "terms-of-use.html",
  "disclaimer.html",
  "manifest.webmanifest",
  "assets/logo.jpg",
  "assets/icon-192.png",
  "assets/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(ASSETS.map(asset => cache.add(asset)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))),
      self.clients.claim()
    ])
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) caches.open(CACHE).then(cache => cache.put("index.html", response.clone()));
          return response;
        })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const update = fetch(event.request).then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
        return response;
      });
      return cached || update;
    })
  );
});

self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}

  const title = data.title || "Aquila Community Live Chat";
  const options = {
    body: data.body || "May bagong mensahe sa Aquila community.",
    icon: data.icon || "assets/icon-192.png",
    badge: data.badge || "assets/icon-192.png",
    image: data.image || undefined,
    tag: data.tag || "aquila-live-chat",
    renotify: true,
    silent: false,
    vibrate: [180, 80, 180],
    requireInteraction: false,
    timestamp: data.timestamp || Date.now(),
    data: { url: data.url || "./?openChat=1", messageId: data.messageId || null }
  };

  event.waitUntil(Promise.all([
    self.registration.showNotification(title, options),
    self.navigator?.setAppBadge ? self.navigator.setAppBadge(1).catch(() => {}) : Promise.resolve()
  ]));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "./?openChat=1", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async clients => {
      for (const client of clients) {
        if (new URL(client.url).origin === self.location.origin) {
          await client.focus();
          client.postMessage({ type: "AQUILA_OPEN_CHAT" });
          return;
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
