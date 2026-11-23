// RESET NOW · motor do Journal (prática da aula). Um conteúdo (window.AULA), dois jeitos de mostrar:
//   data-mode="page"  → página única rolando (visual A, "Caderno")
//   data-mode="steps" → uma tela por vez, tipo app (visual B)
// ?embed=1 (ou dentro de iframe) → esconde o "voltar" e ajusta pra caber embaixo do vídeo no LeadPass.
(function () {
  "use strict";
  const A = window.AULA;
  const body = document.body;
  const MODE = body.dataset.mode || "page";
  const BASE = body.dataset.base || "../";
  const qs = new URLSearchParams(location.search);
  let EMBED = qs.has("embed");
  try { if (window.self !== window.top) EMBED = true; } catch (e) { EMBED = true; }
  if (EMBED) document.documentElement.classList.add("embed");
  const KEY = "reset.journal." + A.id;

  // ---------- utilidades ----------
  const $ = (s, r = document) => r.querySelector(s);
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  const img = (n) => (n === "table" ? BASE + "img/table.svg" : BASE + "img/" + n + "_3d.png");
  const pic = (n, cls = "pic") => `<img class="${cls}" src="${img(n)}" alt="" loading="lazy" draggable="false">`;
  function art(en) {
    const m = en.match(/^(an?)\s+(.*)$/i);
    return m ? `<span class="art art-${m[1].toLowerCase()}">${m[1]}</span> ${m[2]}` : en;
  }
  const norm = (s) => (s || "").toLowerCase().replace(/[^a-z' ]+/g, " ").replace(/\s+/g, " ").trim();
  function salvar(dados) { try { localStorage.setItem(KEY, JSON.stringify(dados)); } catch (e) {} }
  function ler() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }

  // ---------- áudio ----------
  const player = new Audio();
  player.preload = "auto";
  let tocando = null;
  function play(slug, lento, botao) {
    try {
      player.pause();
      player.src = BASE + "audio/" + slug + (lento ? "-lento" : "") + ".mp3";
      player.currentTime = 0;
      const p = player.play();
      if (p && p.catch) p.catch(() => {});
      if (tocando) tocando.classList.remove("tocando");
      if (botao) { botao.classList.add("tocando"); tocando = botao; }
    } catch (e) {}
  }
  player.addEventListener("ended", () => { if (tocando) tocando.classList.remove("tocando"); tocando = null; });
  function botoesAudio(slug) {
    const w = el("div", "audios");
    const b1 = el("button", "btn-audio", '<span class="ic">🔊</span><span>Ouvir</span>');
    const b2 = el("button", "btn-audio lento", '<span class="ic">🐢</span><span>Devagar</span>');
    b1.type = b2.type = "button";
    b1.onclick = (ev) => { ev.stopPropagation(); play(slug, false, b1); };
    b2.onclick = (ev) => { ev.stopPropagation(); play(slug, true, b2); };
    w.append(b1, b2);
    return w;
  }

  // ---------- placar ----------
  const S = { pontos: 0, total: 0, falas: 0, feitos: {} };
  A.escolha = A.escolha || []; A.verdadeiroFalso = A.verdadeiroFalso || []; A.erro = A.erro || []; A.fala = A.fala || [];
  let TOTAL_QUIZ = A.escolha.length + A.verdadeiroFalso.length + A.erro.length;
  const PARTES = [], NUM = {};
  if (A.grupoA) { PARTES.push("O padrão <i>(the pattern)</i>"); NUM.padrao = PARTES.length; }
  if (A.extra) { PARTES.push((A.tituloVocab || "Vocabulário com áudio") + " <i>(vocabulary)</i>"); NUM.vocab = PARTES.length; }
  PARTES.push("Desafio rápido <i>(quick challenge)</i>"); NUM.desafio = PARTES.length;
  if (A.fala.length) { PARTES.push("Fala aí <i>(say it!)</i>"); NUM.fala = PARTES.length; }
  const T = (sec, nome) => "0" + NUM[sec] + " · " + nome;
  function marca(id, ok) {
    if (id in S.feitos) return;
    S.feitos[id] = ok; S.total++; if (ok) S.pontos++;
    atualizaTopo();
  }

  // ---------- peças ----------
  function cartaoPalavra(w, extraCls = "") {
    const c = el("button", "palavra " + extraCls, `${pic(w.img)}<span class="en">${art(w.en)}</span><span class="pt">${w.pt}</span><span class="toque">🔊</span>`);
    c.type = "button";
    c.onclick = () => play(w.audio, false, c);
    return c;
  }
  function grade(lista, cls) {
    const g = el("div", "grade " + (cls || ""));
    lista.forEach((w) => g.append(cartaoPalavra(w)));
    return g;
  }

  // feedback: no modo página aparece embaixo do item; no modo app vira a "folha" de baixo
  function makeApi(holder) {
    return {
      feedback(ok, html) {
        if (MODE === "steps") { folha(ok, html); return; }
        let f = holder.querySelector(":scope > .fb");
        if (!f) { f = el("div", "fb"); holder.append(f); }
        f.className = "fb " + (ok ? "fb-ok" : "fb-no");
        f.innerHTML = `<b class="fb-t">${ok ? "✅ Isso!" : "❌ Quase!"}</b> <span>${html}</span>`;
      },
      done() { holder.dataset.done = "1"; if (MODE === "steps") libera(); else atualizaTopo(); }
    };
  }

  // ---------- telas ----------
  const steps = [];
  const add = (secao, titulo, render, opts = {}) => steps.push({ secao, titulo, render, ...opts });

  // 0 · capa
  add("intro", "", (box, api) => {
    const feito = ler();
    box.append(el("div", "capa", `
      <div class="capa-tag">[ ${A.tag || "JOURNAL · " + A.modulo + "·" + A.numero} ]</div>
      <h1 class="capa-t">${A.titulo}<em> · ${A.tituloEn}</em></h1>
      <div class="capa-traco"></div>
      <p class="capa-sub">${A.capaSub || "Assistiu o vídeo? Agora é a tua vez. <i>(Your turn!)</i>"}</p>
      <ul class="capa-lista">${PARTES.map((p, k) => `<li><span>0${k + 1}</span> ${p}</li>`).join("")}</ul>
      <p class="capa-meta">⏱️ ~${A.minutos} min · 🔊 toca em qualquer palavra pra ouvir</p>
      ${feito ? `<p class="capa-feito">✔ Você já fez essa: ${feito.pontos}/${feito.total} acertos. Bora de novo?</p>` : ""}`));
    api.done();
  }, { botao: "Começar" });

  // 01 · o padrão
  if (A.grupoA) add("padrao", T("padrao", "O padrão"), (box, api) => {
    box.append(el("p", "lead", "Olha essas palavras comigo. Toca pra ouvir. <i>(Look at these words.)</i>"));
    const dois = el("div", "dois");
    const c1 = el("div", "coluna col-a", `<div class="col-t"><span class="art art-a">a</span></div>`);
    c1.append(grade(A.grupoA, "mini"));
    const c2 = el("div", "coluna col-an", `<div class="col-t"><span class="art art-an">an</span></div>`);
    c2.append(grade(A.grupoAn, "mini"));
    dois.append(c1, c2);
    box.append(dois);
    api.done();
  });

  if (A.descoberta) add("padrao", T("padrao", "O padrão"), (box, api) => {
    const d = A.descoberta;
    const q = el("div", "item descoberta");
    q.append(el("div", "pergunta", `🤔 ${d.pergunta}`));
    const ops = el("div", "opcoes col");
    d.opcoes.forEach((o, i) => {
      const b = el("button", "op", o); b.type = "button";
      b.onclick = () => {
        if (q.dataset.done) return;
        if (i === d.certa) {
          b.classList.add("certo");
          ops.querySelectorAll(".op").forEach((x) => (x.disabled = true));
          const r = el("div", "revela", `<p>${d.revela}</p>`);
          const ex = el("div", "excecoes", `<div class="ex-t">⚠️ Raríssimas exceções <i>(é o SOM que manda, não a letra)</i></div>`);
          const g = el("div", "grade mini");
          A.excecoes.forEach((w) => { const c = cartaoPalavra(w, "exc"); c.insertAdjacentHTML("beforeend", `<span class="porque">${w.porque}</span>`); g.append(c); });
          ex.append(g, el("p", "nota", A.excecaoNota));
          r.append(ex);
          q.append(r);
          play("excellent");
          makeApi(q).done();
        } else {
          b.classList.add("errado", "treme");
          setTimeout(() => b.classList.remove("treme"), 450);
          b.disabled = true;
        }
      };
      ops.append(b);
    });
    q.append(ops);
    box.append(q);
    api.wait = true;
  }, { botao: "Continuar" });

  // 02 · vocabulário
  if (A.extra) add("vocab", T("vocab", A.tituloVocab || "Vocabulário extra"), (box, api) => {
    box.append(el("p", "lead", A.leadVocab || "Palavras novas pra treinar o padrão. Toca pra ouvir. <i>(Extra vocabulary.)</i>"));
    box.append(grade(A.extra));
    const dica = el("p", "dica", "💡 Dica: aperta 🔊 e repete em voz alta. É assim que gruda.");
    box.append(dica);
    api.done();
  });

  // 03 · desafio — escolha a / an
  A.escolha.forEach((it, i) => add("desafio", T("desafio", "Desafio · " + (A.titEscolha || "a ou an?")), (box, api) => {
    const q = el("div", "item escolha");
    q.append(el("div", "enunciado", `<span class="num">${i + 1}/${A.escolha.length}</span> Qual é o certo? <i>(Which one?)</i>`));
    if (it.img) q.append(el("div", "fig", pic(it.img, "pic grande")));
    const ops_ = it.opcoes || ["a", "an"];
    const montaFrase = (x) => it.frase ? it.frase.replace("___", x) : x + " " + it.palavra;
    const frase = el("div", "frase" + (it.frase ? " frase-longa" : ""), montaFrase('<span class="lacuna">___</span>'));
    q.append(frase, el("div", "pt", it.pt));
    const ops = el("div", "opcoes");
    ops_.forEach((o) => {
      const b = el("button", "op op-art" + (ops_.some((x) => x.length > 3) ? " op-longa" : ""), o); b.type = "button";
      b.onclick = () => {
        if (q.dataset.done) return;
        const ok = o === it.certa;
        ops.querySelectorAll(".op").forEach((x) => { x.disabled = true; if (x.textContent === it.certa) x.classList.add("certo"); });
        if (!ok) b.classList.add("errado", "treme");
        frase.innerHTML = montaFrase(`<span class="lacuna cheia">${it.certa}</span>`);
        q.append(botoesAudio(it.audio));
        play(it.audio);
        marca("e" + i, ok);
        const a = makeApi(q); a.feedback(ok, it.why); a.done();
      };
      ops.append(b);
    });
    q.append(ops);
    box.append(q);
    api.wait = true;
  }, { botao: "Continuar", quiz: true }));

  // 03 · desafio — true or false
  A.verdadeiroFalso.forEach((it, i) => add("desafio", T("desafio", "Desafio · True or False"), (box, api) => {
    const q = el("div", "item vf");
    q.append(el("div", "enunciado", `<span class="num">${i + 1}/${A.verdadeiroFalso.length}</span> Verdadeiro ou falso? <i>(True or false?)</i>`));
    if (it.img) q.append(el("div", "fig", pic(it.img, "pic grande")));
    const frase = el("div", "frase vf-frase", `<span class="pt-in">${it.pt}</span> <span class="igual">=</span> <span class="en-in">${art(it.en)}</span>`);
    q.append(frase);
    const ops = el("div", "opcoes");
    [[true, "True", "Verdadeiro"], [false, "False", "Falso"]].forEach(([v, en, pt]) => {
      const b = el("button", "op op-vf", `<b>${en}</b><small>${pt}</small>`); b.type = "button"; b.dataset.v = v;
      b.onclick = () => {
        if (q.dataset.done) return;
        const ok = v === it.certo;
        ops.querySelectorAll(".op").forEach((x) => { x.disabled = true; if ((x.dataset.v === "true") === it.certo) x.classList.add("certo"); });
        if (!ok) b.classList.add("errado", "treme");
        const enEl = frase.querySelector(".en-in");
        if (!it.certo) {
          const m = it.en.match(/^(an?)\s+(.*)$/i); const f = (it.fix || "").match(/^(an?)\s+/i);
          enEl.innerHTML = (m && f ? `<del>${m[1]}</del> <ins>${f[1]}</ins> ${m[2]}` : `<del>${it.en}</del> <ins>${it.fix}</ins>`) + ` <span class="selo no">❌</span>`;
        } else {
          enEl.insertAdjacentHTML("beforeend", ' <span class="selo ok">✅</span>');
        }
        if (it.audio) { q.append(botoesAudio(it.audio)); play(it.audio); }
        marca("v" + i, ok);
        const a = makeApi(q); a.feedback(ok, it.why); a.done();
      };
      ops.append(b);
    });
    q.append(ops);
    box.append(q);
    api.wait = true;
  }, { botao: "Continuar", quiz: true }));

  // 03 · desafio — find the mistake (correção na MESMA frase)
  A.erro.forEach((it, i) => add("desafio", T("desafio", "Desafio · Find the mistake"), (box, api) => {
    const q = el("div", "item erro");
    q.append(el("div", "enunciado", `<span class="num">${i + 1}/${A.erro.length}</span> Toca na palavra errada 👆 <i>(Find the mistake)</i>`));
    const frase = el("div", "frase chips");
    let tentativas = 0;
    const fim = (ok) => {
      const chip = frase.children[it.errada];
      chip.classList.add("corrigido");
      chip.innerHTML = `<del>${it.palavras[it.errada]}</del><ins>${it.fix}</ins>`;
      frase.querySelectorAll(".chip").forEach((c) => (c.disabled = true));
      q.append(el("div", "pt", it.pt), botoesAudio(it.audio));
      play(it.audio);
      marca("x" + i, ok);
      const a = makeApi(q); a.feedback(ok, it.why); a.done();
    };
    it.palavras.forEach((w, j) => {
      const c = el("button", "chip", w); c.type = "button";
      c.onclick = () => {
        if (q.dataset.done) return;
        if (j === it.errada) { fim(tentativas === 0); return; }
        tentativas++;
        c.classList.add("tava-certa", "treme"); c.disabled = true;
        setTimeout(() => c.classList.remove("treme"), 450);
        if (tentativas >= 2) fim(false);
      };
      frase.append(c);
    });
    q.append(frase);
    box.append(q);
    api.wait = true;
  }, { botao: "Continuar", quiz: true }));

  // 04 · fala aí
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  A.fala.forEach((it, i) => add("fala", T("fala", "Fala aí"), (box, api) => {
    const q = el("div", "item fala");
    q.append(el("div", "enunciado", `<span class="num">${i + 1}/${A.fala.length}</span> Ouve e fala em voz alta 🎤 <i>(Listen and say it)</i>`));
    if (it.img) q.append(el("div", "fig", pic(it.img, "pic grande")));
    q.append(el("div", "frase grande", it.en.replace(/(^|\s)(an?)(\s)/, '$1<span class="art art-$2">$2</span>$3')));
    q.append(el("div", "pt", it.pt), botoesAudio(it.audio));
    const zona = el("div", "mic-zona");
    const msg = el("div", "mic-msg");
    const ok = () => { if (q.dataset.done) return; S.falas++; makeApi(q).done(); };
    let tentativas = 0;
    if (SR) {
      const b = el("button", "mic", '<span class="ic">🎤</span><span class="tx">Toca e fala</span>'); b.type = "button";
      b.onclick = () => {
        let r;
        try { r = new SR(); } catch (e) { semReconhecer(); return; }
        r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 4;
        b.classList.add("ouvindo"); b.querySelector(".tx").textContent = "Ouvindo…";
        let ouviu = false;
        r.onresult = (ev) => {
          ouviu = true;
          const alts = Array.from(ev.results[0]).map((x) => norm(x.transcript));
          const alvos = [].concat(it.alvo).map(norm), errados = [].concat(it.errado || []).map(norm);
          const tem = (t, x) => (" " + t + " ").includes(" " + x + " ");
          const acertou = alts.some((t) => alvos.some((x) => tem(t, x)));
          const errou = !acertou && alts.some((t) => errados.some((x) => tem(t, x)));
          tentativas++;
          if (acertou) {
            msg.className = "mic-msg ok"; msg.innerHTML = `🎉 Perfeito! Ouvi: “${alts[0]}”`; play("excellent"); ok();
          } else if (errou) {
            msg.className = "mic-msg no"; msg.innerHTML = `Ouvi “${alts[0]}”. Lembra: <b>${[].concat(it.alvo)[0]}</b>. Tenta de novo!`;
          } else {
            msg.className = "mic-msg no"; msg.innerHTML = `Hmm, não peguei direito. Ouvi: “${alts[0] || "…"}”. Tenta de novo!`;
          }
          if (!acertou && tentativas >= 3) { msg.innerHTML += "<br>Tudo bem! Segue que na próxima sai 😉"; ok(); }
        };
        r.onerror = (ev) => {
          if (ev.error === "not-allowed" || ev.error === "service-not-allowed") { semReconhecer("Sem acesso ao microfone aqui."); }
          else if (ev.error === "no-speech") { msg.className = "mic-msg no"; msg.textContent = "Não ouvi nada. Aperta e fala pertinho do celular."; }
          else { msg.className = "mic-msg no"; msg.textContent = "Deu ruim no microfone. Tenta de novo."; }
        };
        r.onend = () => { b.classList.remove("ouvindo"); b.querySelector(".tx").textContent = ouviu ? "Falar de novo" : "Toca e fala"; };
        try { r.start(); } catch (e) { semReconhecer(); }
      };
      zona.append(b);
    } else semReconhecer();
    function semReconhecer(motivo) {
      zona.innerHTML = "";
      const linha = el("div", "mic-alt");
      if (navigator.mediaDevices && window.MediaRecorder) {
        const g = el("button", "mic", '<span class="ic">🎙️</span><span class="tx">Gravar minha voz</span>'); g.type = "button";
        let url = null;
        g.onclick = async () => {
          try {
            const st = await navigator.mediaDevices.getUserMedia({ audio: true });
            const rec = new MediaRecorder(st); const pedacos = [];
            rec.ondataavailable = (e) => pedacos.push(e.data);
            rec.onstop = () => {
              st.getTracks().forEach((t) => t.stop());
              url = URL.createObjectURL(new Blob(pedacos, { type: rec.mimeType || "audio/webm" }));
              g.classList.remove("ouvindo"); g.querySelector(".tx").textContent = "Gravar de novo";
              const ouvir = el("button", "btn-audio", '<span class="ic">▶</span><span>Ouvir você</span>'); ouvir.type = "button";
              ouvir.onclick = () => new Audio(url).play();
              msg.className = "mic-msg"; msg.innerHTML = "Compara: toca 🔊 Ouvir e depois ▶ Ouvir você.";
              msg.append(ouvir);
              ok();
            };
            rec.start(); g.classList.add("ouvindo"); g.querySelector(".tx").textContent = "Gravando… (3 s)";
            setTimeout(() => rec.state !== "inactive" && rec.stop(), 3000);
          } catch (e) { soFalei(motivo || "Sem acesso ao microfone aqui."); }
        };
        linha.append(g);
        zona.append(linha);
      } else soFalei(motivo);
    }
    function soFalei(motivo) {
      zona.innerHTML = "";
      const f = el("button", "mic", '<span class="ic">🗣️</span><span class="tx">Falei em voz alta!</span>'); f.type = "button";
      f.onclick = () => { msg.className = "mic-msg ok"; msg.textContent = "Boa! Repetir em voz alta é o que faz grudar."; ok(); };
      zona.append(f);
      if (motivo) msg.textContent = motivo + " Ouve, repete em voz alta e marca.";
    }
    q.append(zona, msg);
    const pular = el("button", "pular", "Agora não dá pra falar"); pular.type = "button";
    pular.onclick = () => { if (!q.dataset.done) { q.dataset.done = "1"; if (MODE === "steps") libera(); else atualizaTopo(); pular.remove(); } };
    q.append(pular);
    box.append(q);
    api.wait = true;
  }, { botao: "Continuar" }));

  // fim
  add("fim", "", (box, api) => {
    const t = S.total || TOTAL_QUIZ, p = S.pontos;
    const pct = t ? p / t : 0;
    const estrelas = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
    salvar({ pontos: p, total: t, falas: S.falas, data: new Date().toISOString() });
    const frase = estrelas === 3 ? (A.fimTop || "Excellent! Você dominou o a / an.") : estrelas === 2 ? "Very good! Mais uma rodada e fica perfeito." : "Good start! Refaz o desafio que a regra gruda.";
    const missao = BASE + "missao/" + (EMBED ? "?embed=1" : "");
    box.append(el("div", "fim", `
      ${pic("trophy", "pic trofeu")}
      <div class="estrelas">${"★".repeat(estrelas)}<span>${"★".repeat(3 - estrelas)}</span></div>
      <h2 class="fim-t">${A.fimTitulo || "Lesson complete!"}</h2>
      <p class="fim-pt">${A.fimPt || "(Aula concluída!)"}</p>
      <div class="placar"><div><b>${p}/${t}</b><span>acertos de primeira</span></div><div><b>${S.falas}/${A.fala.length}</b><span>frases faladas</span></div></div>
      <p class="fim-frase">${frase}</p>
      <div class="fim-acoes">
        ${A.ehMissao ? "" : `<a class="cta" href="${missao}" target="${EMBED ? "_blank" : "_self"}">🎯 Missão da semana</a>`}
        <button class="cta2" type="button" id="refazer">↺ Refazer</button>
        ${EMBED ? "" : `<a class="cta2" href="${BASE}">⌂ Início</a>`}
      </div>
      ${A.fimExtra ? `<p class="fim-extra">${A.fimExtra}</p>` : ""}
      <p class="see">${A.see || "See you in the next class! 👋 <i>(Te vejo na próxima aula!)</i>"}</p>
      ${A.proxima ? `<p class="proxima">Próxima: ${A.proxima.titulo} <i>(${A.proxima.pt})</i></p>` : ""}`));
    $("#refazer", box).onclick = () => { location.reload(); };
    play("excellent");
    if (estrelas >= 2) confete();
    api.done();
  }, { fim: true });

  // ---------- montagem ----------
  const app = $("#app");
  let topo, barra, pontosEl, secaoEl, palco, rodape, botaoCont;
  function atualizaTopo() {
    if (pontosEl) pontosEl.textContent = S.pontos;
    if (MODE === "page" && barra) {
      const interativos = document.querySelectorAll(".item").length;
      const feitos = document.querySelectorAll(".item[data-done]").length;
      barra.style.width = (interativos ? (feitos / interativos) * 100 : 0) + "%";
    }
  }

  if (MODE === "page") {
    topo = el("div", "topo", `<a class="voltar" href="${BASE}">← RESET</a><div class="trilho"><i></i></div><div class="pts">✔ <b>0</b></div>`);
    app.append(topo);
    barra = $(".trilho i", topo); pontosEl = $(".pts b", topo);
    let secAtual = null, secBox = null;
    steps.forEach((st, idx) => {
      if (st.fim) return; // o fim aparece quando terminar tudo
      if (st.secao !== secAtual) {
        secAtual = st.secao;
        secBox = el("section", "secao secao-" + st.secao);
        if (st.titulo) {
          const [n, ...resto] = st.titulo.split(" · ");
          secBox.append(el("div", "sec-cab", `<span class="sec-n">${n}</span><h2>${resto[0] || ""}</h2>`));
        }
        app.append(secBox);
      }
      if (st.secao === "desafio") {
        const sub = st.titulo.split(" · ")[2];
        if (sub && secBox.dataset.sub !== sub) { secBox.dataset.sub = sub; secBox.append(el("h3", "sub", sub)); }
      }
      const box = el("div", "passo");
      st.render(box, makeApi(box));
      secBox.append(box);
    });
    const fimBox = el("section", "secao secao-fim");
    const botaoFim = el("button", "cta grande-cta", "Terminar e ver meu resultado 🏁"); botaoFim.type = "button";
    botaoFim.onclick = () => {
      fimBox.innerHTML = "";
      steps[steps.length - 1].render(fimBox, makeApi(fimBox));
      fimBox.scrollIntoView({ behavior: "smooth" });
    };
    fimBox.append(botaoFim);
    app.append(fimBox);
  } else {
    topo = el("div", "topo", `<a class="fechar" href="${BASE}" aria-label="Sair">✕</a><div class="trilho"><i></i></div><div class="pts">🔥 <b>0</b></div>`);
    secaoEl = el("div", "secao-nome");
    palco = el("div", "palco");
    rodape = el("div", "rodape");
    botaoCont = el("button", "cta", "Continuar"); botaoCont.type = "button";
    rodape.append(botaoCont);
    app.append(topo, secaoEl, palco, rodape);
    barra = $(".trilho i", topo); pontosEl = $(".pts b", topo);
    let idx = 0;
    const mostra = (i) => {
      idx = i;
      const st = steps[i];
      palco.innerHTML = ""; palco.scrollTop = 0;
      rodape.className = "rodape";
      rodape.querySelector(".folha-txt") && rodape.querySelector(".folha-txt").remove();
      secaoEl.textContent = st.titulo || "";
      const box = el("div", "passo entra");
      const api = makeApi(box);
      api.wait = false;
      botaoCont.disabled = true;
      botaoCont.textContent = st.botao || "Continuar";
      st.render(box, api);
      palco.append(box);
      barra.style.width = (i / (steps.length - 1)) * 100 + "%";
      rodape.style.display = st.fim ? "none" : "";
    };
    window.__libera = () => { botaoCont.disabled = false; };
    botaoCont.onclick = () => { if (!botaoCont.disabled && idx < steps.length - 1) mostra(idx + 1); };
    mostra(0);
  }

  function libera() { if (window.__libera) window.__libera(); }
  function folha(ok, html) {
    rodape.className = "rodape " + (ok ? "folha-ok" : "folha-no");
    const t = el("div", "folha-txt", `<b class="fb-t">${ok ? "✅ Isso!" : "❌ Quase!"}</b><span>${html}</span>`);
    rodape.prepend(t);
  }
  function confete() {
    const cores = ["#D9541F", "#3D7BFF", "#22C55E", "#FFC83D", "#F2EBE0", "#EF4444"];
    const c = el("div", "confete");
    for (let i = 0; i < 70; i++) {
      const p = el("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = cores[i % cores.length];
      p.style.animationDelay = Math.random() * 0.6 + "s";
      p.style.animationDuration = 1.8 + Math.random() * 1.4 + "s";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      c.append(p);
    }
    document.body.append(c);
    setTimeout(() => c.remove(), 4000);
  }

  // app instalável: service worker (silencioso se não der, ex.: dentro de iframe)
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    try { navigator.serviceWorker.register(BASE + "sw.js").catch(() => {}); } catch (e) {}
  }
})();
