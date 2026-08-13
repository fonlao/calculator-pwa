const CACHE_NAME = 'calculator-pwa-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Установка: кешируем все файлы
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker: установка');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📂 Кешируем файлы');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Активация: чистим старые кеши
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker: активация');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('🗑 Удаляем старый кеш:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Перехват запросов: отдаём из кеша, если офлайн
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Возвращаем кешированную версию или идём в сеть
                return response || fetch(event.request)
                    .then(fetchResponse => {
                        // Кешируем новые ресурсы
                        return caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    });
            })
            .catch(() => {
                // Если офлайн и нет в кеше — показываем заглушку
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            })
    );
});
