self.addEventListener("install", (e) => {
  // 立即激活，无需等待
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  clients.claim();
});

// 安全版：所有请求都直接从网络走，不缓存，不干扰页面
self.addEventListener("fetch", () => {});
