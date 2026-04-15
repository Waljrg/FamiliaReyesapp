const CACHE_NAME = 'graduale-cache-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './images/logo_fr.png',
    './images/fr.png',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap'
];

// 1. Instalación: Uso de cache.addAll con mayor control
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Pre-fetching assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// 2. Activación: Limpieza atómica y control de clientes
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Cleaning old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Toma el control de las pestañas abiertas inmediatamente
    );
});

// 3. Estrategia Avanzada: Diferenciación por tipo de recurso
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar peticiones que no sean GET (como Firebase POST/PUT)
    if (request.method !== 'GET') return;

    // Estrategia: Cache First para Fuentes y Assets Estáticos
    if (STATIC_ASSETS.includes(url.pathname) || request.destination === 'font') {
        event.respondWith(
            caches.match(request).then((response) => {
                return response || fetchAndCache(request);
            })
        );
        return;
    }

    // Estrategia: Stale-While-Revalidate para el resto (Lógica Mejorada)
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetchAndCache(request);
            
            // Retorna la caché si existe, si no, espera a la red
            return cachedResponse || fetchPromise;
        })
    );
});

// Función auxiliar para fetch y guardado dinámico
async function fetchAndCache(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Solo cachear respuestas válidas y de nuestro origen o fuentes permitidas
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, responseToCache);
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[SW] Fetch failed:', error);
        // Opcional: Retornar un fallback offline para imágenes o HTML
    }
}
