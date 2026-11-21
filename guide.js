(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var GUIA = window.GUIA || [];
  var DS = window.GUIA_DS || { colecoes: [] };

  var TYPE = { cmd: "Comando", skill: "Skill", pedido: "Pedido" };
  var PLURAL = { cmd: ["comando", "comandos"], skill: ["sub-skill", "sub-skills"], pedido: ["pedido", "pedidos"] };

  /* ---------- dados normalizados ---------- */
  var packs = GUIA.map(function (p) {
    return { id: p.id, nome: p.nome, origem: p.origem, resumo: p.resumo, invocar: p.invocar, aviso: p.aviso, skills: p.skills || 1, ds: false,
      itens: p.itens.map(function (i) { return { t: i.t, n: i.n, g: i.g, d: i.d, e: i.e, local: !!i.local }; }) };
  });
  var dsPacks = (DS.colecoes || []).map(function (c) {
    var it = [];
    c.cmds.forEach(function (x) { it.push({ t: "cmd", n: x[0], g: "Comandos", d: x[1], e: x[2] }); });
    c.skills.forEach(function (x) { it.push({ t: "skill", n: x[0], g: "Sub-skills", d: x[1], e: x[2] }); });
    return { id: c.id, nome: c.nome, origem: DS.origem, resumo: c.resumo, invocar: null, aviso: null, skills: 1, ds: true, itens: it };
  });
  var all = packs.concat(dsPacks);

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fold(s) {
    var out = "";
    for (var k = 0; k < s.length; k++) {
      var c = s[k].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
      out += c.length === 1 ? c : s[k].toLowerCase().charAt(0);
    }
    return out;
  }
  function hl(text, q) {
    if (!q) return esc(text);
    var f = fold(text), out = "", from = 0, at;
    while ((at = f.indexOf(q, from)) !== -1) {
      out += esc(text.slice(from, at)) + "<mark>" + esc(text.slice(at, at + q.length)) + "</mark>";
      from = at + q.length;
    }
    return out + esc(text.slice(from));
  }
  function count(n, w) { return n + " " + (n === 1 ? w[0] : w[1]); }
  function tally(items) {
    var c = { cmd: 0, skill: 0, pedido: 0 };
    items.forEach(function (i) { c[i.t]++; });
    return ["cmd", "skill", "pedido"].filter(function (t) { return c[t]; }).map(function (t) { return count(c[t], PLURAL[t]); }).join(" · ");
  }

  var ICON_PLUS = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="0" y="8.5" width="20" height="3" fill="currentColor"/><rect class="v" x="8.5" y="0" width="3" height="20" fill="currentColor"/></svg>';
  var ICON_COPY = '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="9" height="9"/><path d="M11 5V2H2v9h3"/></svg>';
  var ICON_WARN = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l7.5 14H.5z" fill="currentColor"/><rect x="7.1" y="5.5" width="1.8" height="5" fill="var(--ground)"/><rect x="7.1" y="11.6" width="1.8" height="1.8" fill="var(--ground)"/></svg>';

  /* ---------- contagens do cabeçalho ---------- */
  (function () {
    var nSkills = packs.reduce(function (a, p) { return a + p.skills; }, 0) + dsPacks.length;
    var nItems = all.reduce(function (a, p) { return a + p.itens.length; }, 0);
    var nCmd = 0, nSub = 0;
    all.forEach(function (p) { p.itens.forEach(function (i) { if (i.t === "cmd") nCmd++; if (p.ds && i.t === "skill") nSub++; }); });
    var el = doc.querySelector("[data-tally]");
    if (el) el.innerHTML = "<strong>" + nSkills + "</strong> skills em <strong>" + all.length + "</strong> pacotes, com <strong>" + nCmd +
      "</strong> comandos, <strong>" + nSub + "</strong> sub-skills e <strong>" + nItems + "</strong> pedidos prontos para copiar. Abra uma skill para ver tudo o que ela faz.";
  })();

  /* ---------- montagem ---------- */
  var list = doc.querySelector("[data-list]");
  function packHTML(p) {
    var items = p.itens;
    var groups = [];
    items.forEach(function (i, ix) {
      var g = groups[groups.length - 1];
      if (!g || g.name !== i.g) { g = { name: i.g, rows: [] }; groups.push(g); }
      g.rows.push(ix);
    });
    var side = '<div class="side"><p class="resumo">' + esc(p.resumo) + "</p>";
    if (p.invocar) side += "<div><h4>Como chamar</h4><p>" + esc(p.invocar) + "</p></div>";
    if (p.aviso) side += '<div class="note"><h4>' + ICON_WARN + "Atenção</h4><p>" + esc(p.aviso) + "</p></div>";
    side += '<p class="src">Fonte: ' + esc(p.origem) + "</p></div>";
    var body = '<div class="items">' + groups.map(function (g) {
      return '<div class="grp" data-grp><h4 class="grp-h">' + esc(g.name) + ' <span data-grp-n>' + g.rows.length + "</span></h4>" +
        g.rows.map(function (ix) { return '<div class="item" data-ix="' + ix + '"></div>'; }).join("") + "</div>";
    }).join("") + "</div>";
    return '<section class="pack" id="' + esc(p.id) + '" data-pack>' +
      '<h3><button type="button" class="pack-btn" aria-expanded="false" aria-controls="d-' + esc(p.id) + '">' +
      '<span><span class="pack-name">' + esc(p.nome) + '</span><span class="pack-meta" data-meta>' + esc(tally(items)) + "</span></span>" +
      '<span class="pack-count"><b data-n>' + items.length + "</b>" + (items.length === 1 ? "item" : "itens") + "</span>" +
      '<span class="plus">' + ICON_PLUS + "</span></button></h3>" +
      '<div class="drawer" id="d-' + esc(p.id) + '" role="region" aria-label="' + esc(p.nome) + '" inert><div class="inner"><div class="panel">' + side + body + "</div></div></div></section>";
  }
  var html = '<div class="block-h wrap"><h2>Pacotes de skills</h2><p>Cada pacote abre com o resumo, o jeito de chamar e a lista de comandos, cada um com um pedido pronto.</p></div>';
  html += packs.map(packHTML).join("");
  html += '<div class="block-h wrap" data-ds-h><h2>Designer Skills Pack</h2><p>' + esc(DS.invocar || "") + "</p></div>";
  html += dsPacks.map(packHTML).join("");
  list.innerHTML = html;

  var els = Array.prototype.map.call(list.querySelectorAll("[data-pack]"), function (sec, k) {
    var p = all[k];
    var rows = Array.prototype.slice.call(sec.querySelectorAll(".item"));
    var data = rows.map(function (row) {
      var i = p.itens[+row.dataset.ix];
      return { row: row, i: i, hay: fold([i.n, i.d, i.e, i.g, TYPE[i.t]].join(" ")) };
    });
    return { sec: sec, btn: sec.querySelector(".pack-btn"), drawer: sec.querySelector(".drawer"), p: p, data: data,
      hay: fold([p.nome, p.resumo, p.invocar || ""].join(" ")), n: sec.querySelector("[data-n]"), meta: sec.querySelector("[data-meta]") };
  });

  function renderRow(d, q) {
    var i = d.i;
    var tags = '<span class="tag">' + TYPE[i.t] + "</span>" + (i.local ? '<span class="tag tag--warn">Só no Claude Code</span>' : "");
    d.row.innerHTML = '<div class="item-head"><p class="item-n" translate="no">' + hl(i.n, q) + '</p><div class="tags">' + tags + "</div></div>" +
      '<p class="item-d">' + hl(i.d, q) + "</p>" +
      '<div class="ex"><code translate="no">' + hl(i.e, q) + '</code><button type="button" class="copy" data-copy aria-label="Copiar o pedido: ' + esc(i.e) + '">' + ICON_COPY + "<span>Copiar</span></button></div>";
    d.row._text = i.e;
  }
  els.forEach(function (e) { e.data.forEach(function (d) { renderRow(d, ""); }); });

  /* ---------- abrir e fechar ---------- */
  function setOpen(e, open) {
    e.sec.classList.toggle("is-open", open);
    e.btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) e.drawer.removeAttribute("inert"); else e.drawer.setAttribute("inert", "");
  }
  els.forEach(function (e) {
    e.btn.addEventListener("click", function () {
      var open = e.btn.getAttribute("aria-expanded") !== "true";
      setOpen(e, open);
      if (open) { try { history.replaceState(null, "", "#" + e.p.id); } catch (x) {} }
    });
  });
  doc.querySelectorAll("[data-all]").forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.dataset.all === "open";
      els.forEach(function (e) { if (!e.sec.hidden) setOpen(e, open); });
    });
  });

  /* ---------- busca e filtros ---------- */
  var input = doc.getElementById("q");
  var status = doc.getElementById("status");
  var empty = doc.querySelector("[data-empty]");
  var dsH = list.querySelector("[data-ds-h]");
  var clearBtn = doc.querySelector(".q [data-clear]");
  var filter = "all";
  var saved = null;
  var timer;

  function apply() {
    var raw = input.value.trim();
    var q = fold(raw);
    clearBtn.hidden = !raw;
    if (q && !saved) saved = els.map(function (e) { return e.sec.classList.contains("is-open"); });
    var shownItems = 0, shownPacks = 0, dsShown = 0;
    els.forEach(function (e, k) {
      var packHit = q && e.hay.indexOf(q) !== -1;
      var n = 0;
      e.data.forEach(function (d) {
        var typeOk = filter === "all" || d.i.t === filter;
        var ok = typeOk && (!q || packHit || d.hay.indexOf(q) !== -1);
        d.row.hidden = !ok;
        if (ok) n++;
        renderRow(d, ok ? q : "");
      });
      e.sec.querySelectorAll("[data-grp]").forEach(function (g) {
        var vis = g.querySelectorAll(".item:not([hidden])").length;
        g.hidden = !vis;
        g.querySelector("[data-grp-n]").textContent = vis;
      });
      e.sec.hidden = !n;
      e.n.textContent = n;
      if (n) { shownPacks++; shownItems += n; if (e.p.ds) dsShown++; }
      if (q) setOpen(e, !!n);
      else if (saved) setOpen(e, saved[k]);
    });
    if (!q) saved = null;
    dsH.hidden = !dsShown;
    empty.hidden = !!shownPacks;
    if (q) status.innerHTML = shownItems ? "<strong>" + shownItems + "</strong> " + (shownItems === 1 ? "resultado" : "resultados") + " para “" + esc(raw) + "” em <strong>" + shownPacks + "</strong> " + (shownPacks === 1 ? "pacote" : "pacotes") + "." : "Nenhum resultado para “" + esc(raw) + "”.";
    else if (filter !== "all") status.innerHTML = "<strong>" + shownItems + "</strong> " + PLURAL[filter][shownItems === 1 ? 0 : 1] + " em <strong>" + shownPacks + "</strong> pacotes.";
    else status.textContent = "";
  }
  input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(apply, 120); });
  input.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && input.value) { input.value = ""; apply(); } });
  doc.querySelectorAll("[data-clear]").forEach(function (b) {
    b.addEventListener("click", function () { input.value = ""; apply(); input.focus(); });
  });
  doc.querySelectorAll("[data-f]").forEach(function (b) {
    b.addEventListener("click", function () {
      filter = b.dataset.f;
      doc.querySelectorAll("[data-f]").forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
      apply();
    });
  });
  doc.addEventListener("keydown", function (ev) {
    if (ev.key === "/" && doc.activeElement !== input && !/input|textarea/i.test(doc.activeElement.tagName)) { ev.preventDefault(); input.focus(); }
  });

  /* ---------- copiar ---------- */
  var live = doc.createElement("p");
  live.className = "sr"; live.setAttribute("aria-live", "polite");
  live.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;margin:0";
  doc.body.appendChild(live);
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) {
      var ta = doc.createElement("textarea");
      ta.value = t; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;opacity:0;top:0";
      doc.body.appendChild(ta); ta.select();
      try { doc.execCommand("copy") ? res() : rej(); } catch (x) { rej(x); }
      ta.remove();
    });
  }
  list.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-copy]");
    if (!b) return;
    var t = b.closest(".item")._text;
    var label = b.querySelector("span");
    copyText(t).then(function () {
      b.classList.add("done"); label.textContent = "Copiado";
      live.textContent = "Pedido copiado: " + t;
      setTimeout(function () { b.classList.remove("done"); label.textContent = "Copiar"; }, 1800);
    }, function () {
      label.textContent = "Selecione";
      var r = doc.createRange(); r.selectNodeContents(b.previousElementSibling);
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      live.textContent = "Não deu para copiar automaticamente. O texto está selecionado.";
    });
  });

  /* ---------- tema ---------- */
  var themeBtns = doc.querySelectorAll("[data-theme-set]");
  function paintTheme() {
    var cur = root.dataset.theme || "auto";
    themeBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.themeSet === cur ? "true" : "false"); });
  }
  themeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.dataset.themeSet;
      if (v === "auto") delete root.dataset.theme; else root.dataset.theme = v;
      try { if (v === "auto") localStorage.removeItem("sg-theme"); else localStorage.setItem("sg-theme", v); } catch (x) {}
      paintTheme();
    });
  });
  paintTheme();

  /* ---------- título na largura toda ---------- */
  var h1 = doc.querySelector("[data-fit]");
  function fit() {
    if (!h1) return;
    h1.style.fontSize = "";
    var box = h1.clientWidth;
    var w = h1.firstElementChild.getBoundingClientRect().width;
    if (w > 0) {
      var size = parseFloat(getComputedStyle(h1).fontSize) * (box / w);
      h1.style.fontSize = Math.min(size, 360) + "px";
    }
  }
  if (doc.fonts && doc.fonts.load) doc.fonts.load('700 1em "Big Shoulders"', "SKILLS GUIDE").then(fit, fit); else fit();
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fit, 80); });

  /* ---------- endereço com # ---------- */
  function fromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    var e = els.filter(function (x) { return x.p.id === id; })[0];
    if (e) { setOpen(e, true); e.sec.scrollIntoView({ block: "start" }); }
  }
  fromHash();
  window.addEventListener("hashchange", fromHash);
})();
