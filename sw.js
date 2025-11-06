const CACHE_NAME = "daliang-bank-v1";

const CORE_ASSETS = [
  "/BankofLC/",
  "/BankofLC/startup.html",
  "/BankofLC/index.html",

  "/BankofLC/1762443181715.png",   // APP ICON
  "/BankofLC/1762444418649.png",
  "/BankofLC/1762444429563.png",

  "/BankofLC/manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

// cache-first
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
