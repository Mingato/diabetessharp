// RiseUp Service Worker — handles Web Push notifications
const CACHE_NAME = "riseup-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = {
      title: "RiseUp",
      body: event.data.text(),
      icon: "/icon-192.png",
    };
  }

  const options = {
    body: data.body || "",
    icon: data.icon || "/icon-192.png",
    badge: data.badge || "/badge-72.png",
    tag: data.tag || "riseup",
    data: data.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: false,
    actions: [
      { action: "open", title: "Open App" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "RiseUp", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/app";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
