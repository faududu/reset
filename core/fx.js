// RESET NOW · camada de efeitos do Journal (som, partículas, combo, vibração, transição de tela).
// Fica POR CIMA do motor (core/journal.js): escuta journal:certo | errado | passo | fim.
// Cada conceito visual configura com window.FX = { som, particula, palavras, transicao, ... } antes deste arquivo.
// Som 100% sintetizado no navegador (Web Audio) = zero arquivo, zero licença.
(function () {
  "use strict";
  const F = Object.assign({
    som: "marimba",          // marimba | sino | synth | bolha | gibi
    particula: "confete",    // confete | luz | emoji | tinta | estrela
    cores: ["#2D5BFF", "#D9541F", "#22C55E", "#FFC83D"],
    emojis: ["❤️", "🔥", "😍", "👏"],
    palavras: ["Nice!", "Boa!", "Yes!", "Isso!"],
    palavrasErro: ["Quase!"],
    comboTxt: (n) => n + " seguidas",
    transicao: true,         // View Transitions (Chrome/Safari 18+); sem suporte = troca normal
    vibrar: true,
    flash: false,
    segmentos: false         // barrinhas tipo Stories no topo
  }, window.FX || {});
  window.__fxFim = true; // o fim é nosso (confete do motor desliga)
  const html = document.documentElement;
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  html.classList.add("fx");

  // ---------- onde o dedo tocou (origem das partículas) ----------
  let px = innerWidth / 2, py = innerHeight / 2;
  addEventListener("pointerdown", (e) => { px = e.clientX; py = e.clientY; }, true);

  // ---------- SOM ----------
  const KS = "reset.som";
  let mudo = localStorage.getItem(KS) === "0";
  let ctx = null, mestre = null;
  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      ctx = new C(); mestre = ctx.createGain(); mestre.gain.value = 0.55;
      const comp = ctx.createDynamicsCompressor(); mestre.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  addEventListener("pointerdown", () => { try { ac(); } catch (e) {} }, { capture: true });
  const hz = (semi, base = 523.25) => base * Math.pow(2, semi / 12);
  function nota(f, t0, o = {}) {
    const c = ctx, t = c.currentTime + t0;
    const g = c.createGain(), d = o.d || 0.3, vol = o.g || 0.25;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (o.a || 0.006));
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    let saida = g;
    if (o.lp) { const fl = c.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.setValueAtTime(o.lp, t); fl.frequency.exponentialRampToValueAtTime(o.lp2 || o.lp, t + d); fl.Q.value = o.q || 4; g.connect(fl); saida = fl; }
    saida.connect(mestre);
    (o.parciais || [[1, 1]]).forEach(([mult, amp]) => {
      const os = c.createOscillator(), ga = c.createGain();
      os.type = o.tipo || "sine";
      os.frequency.setValueAtTime(f * mult * (o.de || 1), t);
      if (o.de) os.frequency.exponentialRampToValueAtTime(f * mult, t + (o.bendT || 0.06));
      ga.gain.value = amp; os.connect(ga); ga.connect(g);
      os.start(t); os.stop(t + d + 0.05);
    });
  }
  function ruido(t0, o = {}) {
    const c = ctx, t = c.currentTime + t0, d = o.d || 0.25;
    const buf = c.createBuffer(1, Math.ceil(c.sampleRate * d), c.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = buf;
    const fl = c.createBiquadFilter(); fl.type = o.tipo || "bandpass"; fl.Q.value = o.q || 1.2;
    fl.frequency.setValueAtTime(o.f1 || 400, t); fl.frequency.exponentialRampToValueAtTime(o.f2 || 3000, t + d);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.g || 0.08, t + d * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(fl); fl.connect(g); g.connect(mestre); s.start(t); s.stop(t + d);
  }
  // timbres
  const T = {
    marimba: (f, t, g = 0.28) => { nota(f, t, { d: 0.45, g, parciais: [[1, 1], [4, 0.18], [10, 0.04]] }); },
    sino: (f, t, g = 0.18) => { nota(f, t, { d: 1.4, g, a: 0.004, parciais: [[1, 1], [2.76, 0.35], [5.4, 0.12], [8.93, 0.05]] }); },
    synth: (f, t, g = 0.16) => { nota(f, t, { d: 0.32, g, tipo: "sawtooth", lp: 4200, lp2: 700, q: 6, parciais: [[1, 1], [1.006, 0.8]] }); },
    bolha: (f, t, g = 0.3) => { nota(f, t, { d: 0.22, g, de: 0.55, bendT: 0.05, parciais: [[1, 1], [2, 0.12]] }); },
    gibi: (f, t, g = 0.12) => { nota(f, t, { d: 0.16, g, tipo: "square", lp: 5000, lp2: 2500, parciais: [[1, 1]] }); }
  };
  const ESCALA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24]; // pentatônica: cada acerto seguido sobe um degrau
  const toca = (fn) => { if (mudo) return; try { if (ac()) fn(T[F.som] || T.marimba); } catch (e) {} };
  const SOM = {
    certo(combo) {
      toca((tim) => {
        const r = ESCALA[Math.min(combo - 1, ESCALA.length - 1)];
        tim(hz(r), 0); tim(hz(r + 4), 0.07); tim(hz(r + 7), 0.14);
        if (F.som === "synth") nota(150, 0, { d: 0.18, g: 0.5, de: 2.4, bendT: 0.09 }); // bumbo
        if (F.som === "gibi") ruido(0, { d: 0.12, f1: 1800, f2: 6000, g: 0.06, tipo: "highpass" });
        if (combo >= 3) tim(hz(r + 12), 0.22, 0.12); // brilho extra no combo
      });
    },
    errado(leve) {
      toca(() => {
        nota(196, 0, { d: 0.16, g: leve ? 0.09 : 0.16, tipo: "triangle" });
        if (!leve) nota(147, 0.1, { d: 0.24, g: 0.14, tipo: "triangle" });
      });
    },
    passo() { toca(() => ruido(0, { d: 0.22, f1: 300, f2: 2600, g: F.som === "synth" ? 0.05 : 0.035 })); },
    fim(estrelas) {
      toca((tim) => {
        [0, 4, 7, 12, 16, 19].forEach((s, k) => tim(hz(s, 392), k * 0.09));
        if (estrelas >= 2) [12, 16, 19, 24].forEach((s) => tim(hz(s, 392), 0.62, 0.1));
      });
    }
  };

  // ---------- VIBRAÇÃO (Android; iPhone ignora sem erro) ----------
  const vib = (p) => { if (F.vibrar && navigator.vibrate) try { navigator.vibrate(p); } catch (e) {} };

  // ---------- PARTÍCULAS (canvas por cima de tudo, não pega toque) ----------
  const cv = document.createElement("canvas"); cv.className = "fx-canvas";
  const g2 = cv.getContext("2d"); let P = [], rodando = false, dpr = 1;
  function tamanho() { dpr = Math.min(devicePixelRatio || 1, 2); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px"; }
  addEventListener("resize", tamanho);
  function estrela(x, y, r) { g2.beginPath(); for (let i = 0; i < 10; i++) { const a = (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; g2.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g2.closePath(); g2.fill(); }
  function explode(x, y, n, tipo) {
    if (reduz) return;
    tipo = tipo || F.particula;
    n = Math.min(n, { emoji: 9, luz: 28 }[tipo] || 60); // emoji grande cobre a pergunta: poucos
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2, vel = 3 + Math.random() * 7;
      const p = { x, y, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel - 4, r: 4 + Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, vida: 1, dec: 0.012 + Math.random() * 0.012, cor: F.cores[i % F.cores.length], tipo, grav: 0.22, arr: 0.985 };
      if (tipo === "emoji") { p.vx = (Math.random() - 0.5) * 2.5; p.vy = -3 - Math.random() * 4; p.grav = -0.02; p.r = 16 + Math.random() * 10; p.ch = F.emojis[i % F.emojis.length]; p.dec = 0.008 + Math.random() * 0.006; p.onda = Math.random() * 6; }
      if (tipo === "luz") { p.grav = -0.03; p.r = 3 + Math.random() * 9; p.vx *= 0.6; p.vy = p.vy * 0.6; p.arr = 0.95; }
      if (tipo === "tinta") { p.r = 6 + Math.random() * 10; p.grav = 0.3; }
      P.push(p);
    }
    if (!rodando) { rodando = true; requestAnimationFrame(quadro); }
  }
  function quadro() {
    g2.setTransform(dpr, 0, 0, dpr, 0, 0); g2.clearRect(0, 0, innerWidth, innerHeight);
    P = P.filter((p) => p.vida > 0);
    for (const p of P) {
      p.vx *= p.arr; p.vy = p.vy * p.arr + p.grav; p.x += p.vx + (p.onda !== undefined ? Math.sin((p.onda += 0.08)) * 0.8 : 0); p.y += p.vy; p.rot += p.vr; p.vida -= p.dec;
      g2.globalAlpha = Math.max(0, Math.min(1, p.vida * 1.6)); g2.fillStyle = p.cor;
      if (p.tipo === "confete") { g2.save(); g2.translate(p.x, p.y); g2.rotate(p.rot); g2.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 1.6); g2.restore(); }
      else if (p.tipo === "estrela") estrela(p.x, p.y, p.r);
      else if (p.tipo === "luz") { const gr = g2.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.4); gr.addColorStop(0, "#fff"); gr.addColorStop(0.35, p.cor); gr.addColorStop(1, "rgba(255,255,255,0)"); g2.fillStyle = gr; g2.beginPath(); g2.arc(p.x, p.y, p.r * 2.4, 0, 7); g2.fill(); }
      else if (p.tipo === "emoji") { g2.font = p.r + "px system-ui, 'Segoe UI Emoji', 'Apple Color Emoji'"; g2.textAlign = "center"; g2.fillText(p.ch, p.x, p.y); }
      else if (p.tipo === "tinta") { g2.beginPath(); g2.arc(p.x, p.y, Math.max(0.1, p.r * p.vida), 0, 7); g2.fill(); g2.strokeStyle = "#111"; g2.lineWidth = 2.5; g2.stroke(); }
    }
    g2.globalAlpha = 1;
    if (P.length) requestAnimationFrame(quadro); else { rodando = false; g2.clearRect(0, 0, innerWidth, innerHeight); }
  }

  // ---------- PALAVRA QUE PULA + COMBO + FLASH ----------
  let combo = 0, comboEl = null;
  const escolhe = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function palavra(txt, x, y, cls) {
    if (reduz) return;
    const w = document.createElement("div"); w.className = "fx-palavra " + (cls || ""); w.innerHTML = txt;
    w.style.left = Math.max(70, Math.min(innerWidth - 70, x)) + "px"; w.style.top = Math.max(90, y - 30) + "px";
    w.style.setProperty("--giro", (Math.random() * 16 - 8).toFixed(1) + "deg");
    document.body.append(w); setTimeout(() => w.remove(), 1300);
  }
  function flash(cls) {
    if (!F.flash || reduz) return;
    const f = document.createElement("div"); f.className = "fx-flash " + cls; document.body.append(f); setTimeout(() => f.remove(), 700);
  }
  function mostraCombo() {
    if (!comboEl) return;
    if (combo >= 2) { comboEl.innerHTML = F.comboTxt(combo); comboEl.classList.remove("pula"); void comboEl.offsetWidth; comboEl.classList.add("on", "pula"); }
    else comboEl.classList.remove("on", "pula");
  }
  function reage(cls) {
    const it = document.querySelector(".palco .passo:last-child .item") || document.querySelector(".palco .item");
    if (!it) return; it.classList.remove("fx-acertou", "fx-errou"); void it.offsetWidth; it.classList.add(cls);
  }

  addEventListener("journal:certo", (e) => {
    combo++;
    SOM.certo(combo); vib(combo >= 3 ? [14, 40, 22] : 16);
    explode(px, py, Math.min(18 + combo * 6, 60));
    palavra(e.detail.fala ? "🎤 " + escolhe(F.palavras) : escolhe(F.palavras), px, py, "ok");
    flash("ok"); reage("fx-acertou"); mostraCombo();
    if (F.onCerto) F.onCerto(combo, e.detail);
  });
  addEventListener("journal:errado", (e) => {
    if (!e.detail.leve) { combo = 0; mostraCombo(); }
    SOM.errado(e.detail.leve); vib(e.detail.leve ? 30 : [40, 50, 40]);
    if (!e.detail.leve) { palavra(escolhe(F.palavrasErro), px, py, "no"); flash("no"); }
    reage("fx-errou");
    if (F.onErro) F.onErro(e.detail);
  });
  addEventListener("journal:fim", (e) => {
    SOM.fim(e.detail.estrelas); vib([20, 60, 20, 60, 40]);
    if (comboEl) comboEl.classList.remove("on", "pula");
    const n = e.detail.estrelas >= 2 ? 3 : 1;
    for (let k = 0; k < n; k++) setTimeout(() => { explode(innerWidth * (0.2 + 0.3 * k), innerHeight * 0.35, 50); }, k * 260);
    if (F.onFim) F.onFim(e.detail);
  });

  // ---------- TOPO: combo, botão de som, barrinhas tipo Stories ----------
  let segs = null;
  addEventListener("journal:passo", (e) => {
    const d = e.detail, topo = document.querySelector(".topo");
    if (topo && !topo.dataset.fx) {
      topo.dataset.fx = "1";
      comboEl = document.createElement("div"); comboEl.className = "fx-combo";
      const som = document.createElement("button"); som.type = "button"; som.className = "fx-som"; som.setAttribute("aria-label", "Som");
      const pinta = () => (som.textContent = mudo ? "🔇" : "🔊"); pinta();
      som.onclick = () => { mudo = !mudo; localStorage.setItem(KS, mudo ? "0" : "1"); pinta(); if (!mudo) { ac(); SOM.certo(1); } };
      topo.append(comboEl, som);
      if (F.segmentos) {
        segs = document.createElement("div"); segs.className = "fx-segs";
        d.secoes.forEach(() => { const s = document.createElement("span"); s.append(document.createElement("i")); segs.append(s); });
        const tr = topo.querySelector(".trilho"); tr.replaceWith(segs);
      }
    }
    if (segs) [...segs.children].forEach((s, k) => { s.firstChild.style.width = (k < d.nSecao ? 100 : k > d.nSecao ? 0 : ((d.dentro + 1) / d.tamSecao) * 100) + "%"; });
    html.dataset.passo = d.i; html.dataset.secao = d.secao; html.dataset.cor = d.i % 5;
    if (d.i > 0) SOM.passo();
    if (F.onPasso) F.onPasso(d);
  });

  // ---------- TRANSIÇÃO ENTRE TELAS ----------
  if (F.transicao && document.startViewTransition && !reduz) {
    window.__fxTransicao = (run) => { try { document.startViewTransition(run); } catch (e) { run(); } };
  }

  document.addEventListener("DOMContentLoaded", () => { document.body.append(cv); tamanho(); });
  if (document.readyState !== "loading") { document.body.append(cv); tamanho(); }
})();
