// Offline-Speicher: lädt die App einmal und startet sie danach auch ohne Internet.
const CACHE = 'learncoding-012495f59b';
const FILES = ["./", "index.html", "app.js", "manifest.webmanifest", "fonts/JetBrainsMono_500Medium.9200bf1d80f2f4947b496a2e6ab2e224.ttf", "fonts/Nunito_600SemiBold.b1364260246b29fd9393a1a071f3af61.ttf", "fonts/Nunito_800ExtraBold.2b1bb82750274fc2d1043bf3891cb531.ttf", "fonts/Nunito_900Black.3ffae19d12dc67269f5cdd8d7a0aaeaf.ttf", "icons/apple-touch-icon.png", "icons/favicon.png", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request)));
});
