// RESET NOW · app instalável. Página/JS = rede primeiro (a missão da semana troca); imagem/áudio/fonte = cache primeiro (offline).
const V = "reset-v1";
const BASE = self.registration.scope;
const PRE = ["", "index.html", "b/m1-5.html", "a/m1-5.html", "missao/", "core/journal.js", "core/a.css", "core/b.css", "aulas/m1-5.js", "missoes/m01.js", "manifest.webmanifest", "icons/icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(PRE.map(p => BASE + p))).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  const midia = /\.(png|svg|mp3|woff2?|ttf)$/.test(u.pathname) || u.host.includes("fonts.g");
  if (midia) {
    e.respondWith(caches.match(r).then(c => c || fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(ca => ca.put(r, cp)); return res; })));
  } else if (u.origin === location.origin) {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(ca => ca.put(r, cp)); return res; }).catch(() => caches.match(r)));
  }
});
