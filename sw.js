self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  
  // 只缓存本地同源的静态资源（页面、图片），CDN请求直接放行
  if (requestUrl.origin !== self.location.origin) {
    return; // 所有跨域请求（包括crypto-js CDN）都不拦截
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // 只缓存本地同源资源
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          })
          .catch(() => caches.match("/index.html"));

        return cachedResponse || fetchPromise;
      })
  );
});
