/* 大涼銀行 PWA Service Worker */
const CACHE_NAME = "daliang-bank-cache-v1";

const FILES_TO_CACHE = [
  "/BankofLC/",
  "/BankofLC/startup.html",
  "/BankofLC/index.html",
  "/BankofLC/bank-home.html",
  "/BankofLC/bank-transfer.html",
  "/BankofLC/bank-card.html",
  "/BankofLC/bank-loan.html",
  "/BankofLC/bank-life.html",
  "/BankofLC/bank-account.html",
  "/BankofLC/bank-lcps.html",
  "/BankofLC/bank-deposit.html",
  "/BankofLC/bank-invest.html",
  "/BankofLC/bank-insure.html",
  "/BankofLC/bank-gold.html",
  "/BankofLC/bank-fx.html",
  "/BankofLC/bank-more.html",
  "/BankofLC/bank-my.html",
  "/BankofLC/1762443181715.png",
  "/BankofLC/1762444418649.png",
  "/BankofLC/1762444429563.png"
];

/* 安装阶段：缓存文件 */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* 激活阶段：清理旧缓存 */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

/* 拦截请求：离线优先 */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return (
        res ||
        fetch(event.request).catch(() => caches.match("/BankofLC/index.html"))
      );
    })
  );
});
