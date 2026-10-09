import glob, os, re, shutil, sys
app, out = sys.argv[1], sys.argv[2]
shutil.rmtree(out, ignore_errors=True)
os.makedirs(out + '/fonts')
js = open(glob.glob(app + '/dist/_expo/static/js/web/*.js')[0]).read()
def font(m):
    src = m.group(1)
    name = os.path.basename(src)
    shutil.copy(app + '/dist' + src, out + '/fonts/' + name)
    return '"fonts/' + name + '"'
js, n = re.subn(r'"(/assets/[^"]+\.ttf)"', font, js)
assert n == 4, n
open(out + '/app.js', 'w').write(js)
html = '''<title>LearnCoding</title>
<style>
  :root { --ground: #E9E7F8; --ink: #1F2340; --soft: #6B7090; --accent: #6C5CE7; color-scheme: light; }
  html, body { height: 100%; }
  body { overflow: hidden; background: var(--ground); color: var(--ink); }
  #root { display: flex; height: 100%; flex: 1; }
  .boot { margin: auto; text-align: center; padding: 24px 16px; font: 600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--soft); }
  .boot b { display: block; font-size: 28px; color: var(--accent); margin-bottom: 8px; }
  .boot .err { color: #B91C1C; margin-top: 14px; max-width: 34em; word-break: break-word; }
</style>
<div id="root"><div class="boot"><b>LearnCoding</b><span id="boot-msg">Wird geladen …</span></div></div>
<script>
  // Zeigt einen Fehler an, statt endlos zu laden.
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
  setTimeout(function () { if (document.getElementById('boot-msg')) bootFail('Zeitüberschreitung beim Laden (app.js).'); }, 15000);
</script>
<script src="app.js" onerror="bootFail('app.js wurde nicht gefunden.')"></script>
'''
open(out + '/index.html', 'w').write(html)
for f in sorted(glob.glob(out + '/**', recursive=True)):
    if os.path.isfile(f): print(os.path.getsize(f), f)
