// 缓存版本（更新资源时修改版本号，如v2）
const CACHE_NAME = "大涼銀行-pwa-v1";
// 核心缓存资源（匹配你的项目文件路径）
const CACHE_ASSETS = [
  "/startup.html", // 启动页
  "/index.html",   // 登录注册页
  "/bank-home.html", // 登录后首页（从index.html跳转逻辑获取）
  "/1762443181715.png", // 应用图标（登录页/配置文件引用）
  "/1762444418649.png", // 启动页图片1
  "/1762444429563.png", // 启动页图片2
  "https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js" // 加密依赖（登录页核心脚本）
];

// 安装阶段：缓存核心资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting()) // 立即激活新SW，无需刷新页面
  );
});

// 激活阶段：清理旧缓存，避免冗余
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // 删除非当前版本的缓存
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim()) // 控制所有已打开的页面
  );
});

// 拦截请求：优先缓存，无缓存走网络（同时缓存新资源）
self.addEventListener("fetch", (event) => {
  // 忽略跨域请求（如非缓存的CDN资源）
  if (event.request.mode !== "navigate" && !event.request.url.includes(CACHE_ASSETS[5])) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // 缓存存在则返回，否则发起网络请求并缓存
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          })
          .catch(() => {
            // 网络失败时，返回缓存的登录页作为兜底
            return caches.match("/index.html");
          });

        return cachedResponse || fetchPromise;
      })
  );
});
