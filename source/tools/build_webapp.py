"""Baut aus dem Expo-Web-Export eine eigenständige Web-App (für APK-Hülle und PWA)."""
import glob, os, re, shutil, sys, json, hashlib
app, out, icons = sys.argv[1], sys.argv[2], sys.argv[3]
shutil.rmtree(out, ignore_errors=True)
os.makedirs(out + '/fonts'); os.makedirs(out + '/icons')
js = open(glob.glob(app + '/dist/_expo/static/js/web/*.js')[0]).read()
def font(m):
    name = os.path.basename(m.group(1))
    shutil.copy(app + '/dist' + m.group(1), out + '/fonts/' + name)
    return '"fonts/' + name + '"'
js, n = re.subn(r'"(/assets/[^"]+\.ttf)"', font, js)
assert n == 4, n
open(out + '/app.js', 'w').write(js)
for f in ['icon-512.png', 'icon-192.png', 'apple-touch-icon.png', 'favicon.png']:
    shutil.copy(icons + '/' + f, out + '/icons/' + f)
manifest = {
  "name": "LearnCoding", "short_name": "LearnCoding", "lang": "de",
  "description": "Programmieren lernen in kleinen Häppchen",
  "start_url": "./", "scope": "./", "display": "standalone", "orientation": "portrait",
  "background_color": "#F7F8FC", "theme_color": "#FFFFFF",
  "icons": [
    {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}
  ]
}
json.dump(manifest, open(out + '/manifest.webmanifest', 'w'), ensure_ascii=False, indent=1)
files = ['./', 'index.html', 'app.js', 'manifest.webmanifest'] + ['fonts/' + f for f in sorted(os.listdir(out + '/fonts'))] + ['icons/' + f for f in sorted(os.listdir(out + '/icons'))]
version = hashlib.sha1(js.encode()).hexdigest()[:10]
open(out + '/sw.js', 'w').write(f'''// Offline-Speicher: lädt die App einmal und startet sie danach auch ohne Internet.
const CACHE = 'learncoding-{version}';
const FILES = {json.dumps(files)};
self.addEventListener('install', (e) => {{
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
}});
self.addEventListener('activate', (e) => {{
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
}});
self.addEventListener('fetch', (e) => {{
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {{ ignoreSearch: true }}).then((hit) => hit || fetch(e.request)));
}});
''')
open(out + '/index.html', 'w').write('''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<title>LearnCoding</title>
<meta name="theme-color" content="#FFFFFF">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="LearnCoding">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" href="icons/favicon.png">
<style>
  html, body { height: 100%; margin: 0; }
  body { overflow: hidden; background: #E9E7F8; overscroll-behavior: none; -webkit-tap-highlight-color: transparent; }
  #root { display: flex; height: 100%; flex: 1; }
  .boot { margin: auto; text-align: center; padding: 24px 16px; font: 600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #6B7090; }
  .boot b { display: block; font-size: 28px; color: #6C5CE7; margin-bottom: 8px; }
  .boot .err { color: #B91C1C; margin-top: 14px; max-width: 34em; word-break: break-word; }
</style>
</head>
<body>
<div id="root"><div class="boot"><b>LearnCoding</b><span id="boot-msg">Wird geladen …</span></div></div>
<script>
  function bootFail(text) {
    var msg = document.getElementById('boot-msg');
    if (!msg) return;
    var e = document.createElement('div');
    e.className = 'err';
    e.textContent = 'Die App konnte nicht starten: ' + text;
    msg.parentNode.appendChild(e);
    msg.textContent = '';
  }
  window.addEventListener('error', function (ev) { bootFail(ev.message || 'Skript-Fehler'); });
  setTimeout(function () { if (document.getElementById('boot-msg')) bootFail('Zeitüberschreitung beim Laden.'); }, 15000);
  // Offline-Modus für die Web-App (nicht in der Android-App nötig).
  if ('serviceWorker' in navigator && location.protocol === 'https:' && navigator.userAgent.indexOf('LearnCodingApp') < 0) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
</script>
<script src="app.js" onerror="bootFail('app.js wurde nicht gefunden.')"></script>
</body>
</html>
''')
print('ok', version)
