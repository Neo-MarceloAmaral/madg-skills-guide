/* Skills Guide: the guide inside the app-frame (search, filter, pack list, copy) and the Day/Night switch. */
(function () {
  var DS = window.GUIA_DS;
  var packs = window.GUIA.map(function (p) { return Object.assign({}, p, { grupo: "Skills principais" }); });
  DS.colecoes.forEach(function (c) {
    packs.push({
      id: c.id, nome: c.nome, grupo: "Designer Skills Pack", skills: 1, origem: DS.origem, resumo: c.resumo, invocar: DS.invocar,
      itens: c.cmds.map(function (x) { return { t: "cmd", n: x[0], d: x[1], e: x[2], g: "Comandos" }; })
        .concat(c.skills.map(function (x) { return { t: "skill", n: x[0], d: x[1], e: x[2], g: "Sub-skills" }; }))
    });
  });
  var all = [];
  packs.forEach(function (p) { p.itens.forEach(function (i) { all.push(Object.assign({}, i, { pack: p })); }); });

  var root = document.querySelector("[data-guide]");
  if (!root) return;
  var $ = function (s) { return root.querySelector(s); };
  var esc = function (s) { return String(s).replace(/\[([^\]]+)\]/g, "‹$1›").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var norm = function (s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  var plural = function (n, um, varios) { return n + " " + (n === 1 ? um : varios); };
  var rotulo = { cmd: "comando", skill: "sub-skill", pedido: "forma de pedir" };
  var status = document.querySelector("[data-g-status]");
  function anunciar(msg) { status.textContent = ""; setTimeout(function () { status.textContent = msg; }, 60); }

  var atual = packs[0], filtro = "all";

  function contagem(p) {
    var c = 0, s = 0, f = 0;
    p.itens.forEach(function (i) { if (i.t === "cmd") c++; else if (i.t === "skill") s++; else f++; });
    var partes = [plural(p.skills, "skill", "skills")];
    if (c) partes.push(plural(c, "comando", "comandos"));
    if (s) partes.push(plural(s, "sub-skill", "sub-skills"));
    if (f) partes.push(plural(f, "forma de pedir", "formas de pedir"));
    return partes.join(" · ");
  }

  // the pack list and the phone's select
  var html = "", grupo = "", opts = "";
  packs.forEach(function (p) {
    if (p.grupo !== grupo) { html += '<div class="g-group">' + p.grupo + "</div>"; grupo = p.grupo; }
    html += '<button type="button" class="g-pack" data-pack="' + p.id + '">' + esc(p.nome) + "<em>" + p.itens.length + "</em></button>";
    opts += '<option value="' + p.id + '">' + esc(p.nome) + "</option>";
  });
  $("[data-g-packs]").innerHTML = html;
  $("[data-g-select]").innerHTML = opts;

  function row(i, comPacote) {
    return '<div class="g-row"><div>' + (comPacote ? '<span class="g-pk">' + esc(i.pack.nome) + "</span>" : "") +
      "<code>" + esc(i.n) + '</code><span class="g-kind">' + rotulo[i.t] + (i.local ? " · precisa de servidor local" : "") + "</span></div>" +
      "<div><p>" + esc(i.d) + '</p><div class="g-ex"><q>' + esc(i.e) + '</q><button type="button" class="g-copy" data-copy="' + esc(i.e) + '" aria-label="Copiar pedido: ' + esc(i.e) + '">Copiar</button></div></div></div>';
  }
  var passa = function (i) { return filtro === "all" || (filtro === "cmd" ? i.t === "cmd" : i.t !== "cmd"); };

  function render(anuncia) {
    var q = $("[data-g-q]").value.trim();
    root.querySelectorAll(".g-pack").forEach(function (b) { b.setAttribute("aria-current", String(!q && b.dataset.pack === atual.id)); });
    $("[data-g-select]").value = atual.id;
    var list = $("[data-g-list]");
    if (q) {
      var termos = norm(q).split(/\s+/).filter(Boolean);
      var res = all.filter(passa).filter(function (i) {
        var t = norm([i.n, i.d, i.e, i.g, i.pack.nome].join(" "));
        return termos.every(function (x) { return t.indexOf(x) > -1; });
      });
      $("[data-g-crumb]").textContent = "Busca";
      $("[data-g-title]").textContent = plural(res.length, "resultado", "resultados") + " para “" + q + "”";
      $("[data-g-meta]").textContent = "em todos os pacotes";
      $("[data-g-how]").textContent = "";
      $("[data-g-note]").textContent = "";
      list.innerHTML = res.length ? res.map(function (i) { return row(i, true); }).join("") : '<p class="g-empty">Nada encontrado. Tente outra palavra, como “cor”, “formulário” ou “animação”.</p>';
      if (anuncia) anunciar(plural(res.length, "resultado", "resultados") + " para " + q);
    } else {
      var p = atual, itens = p.itens.filter(passa), grupos = [];
      itens.forEach(function (i) { if (grupos.indexOf(i.g) < 0) grupos.push(i.g); });
      $("[data-g-crumb]").textContent = p.nome;
      $("[data-g-title]").textContent = p.nome;
      $("[data-g-meta]").textContent = contagem(p) + " · " + p.origem;
      $("[data-g-how]").textContent = p.invocar;
      $("[data-g-note]").textContent = p.aviso || "";
      list.innerHTML = grupos.length ? grupos.map(function (g) {
        return '<div class="g-gt">' + esc(g) + "</div>" + itens.filter(function (i) { return i.g === g; }).map(function (i) { return row(Object.assign({}, i, { pack: p }), false); }).join("");
      }).join("") : '<p class="g-empty">Nenhum item desse tipo neste pacote. Escolha “Tudo” para ver o pacote inteiro.</p>';
      if (anuncia) anunciar(p.nome + ": " + plural(itens.length, "item", "itens"));
    }
    list.scrollTop = 0;
    observar();
  }

  // rows outside the list's window are not drawn (the frame cuts them anyway)
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle("is-off", !e.isIntersecting); });
  }, { root: $("[data-g-list]"), rootMargin: "120px 0px 160px 0px" }) : null;
  function observar() {
    if (!io) return; io.disconnect();
    $("[data-g-list]").querySelectorAll(".g-row").forEach(function (r) { r.classList.add("is-off"); io.observe(r); });
  }

  $("[data-g-packs]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-pack]"); if (!b) return;
    atual = packs.find(function (p) { return p.id === b.dataset.pack; }); $("[data-g-q]").value = ""; render(true);
  });
  $("[data-g-select]").addEventListener("change", function (e) {
    atual = packs.find(function (p) { return p.id === e.target.value; }); $("[data-g-q]").value = ""; render(true);
  });
  root.querySelectorAll("[data-g-f]").forEach(function (b) {
    b.addEventListener("click", function () {
      filtro = b.dataset.gF;
      root.querySelectorAll("[data-g-f]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      render(true);
    });
  });
  var t; $("[data-g-q]").addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { render(true); }, 200); });
  $("[data-g-list]").addEventListener("click", function (e) {
    var c = e.target.closest(".g-copy"); if (!c) return;
    var ok = function () { c.textContent = "Copiado"; anunciar("Pedido copiado"); };
    var falha = function () { c.textContent = "Selecione"; anunciar("Não foi possível copiar. Selecione o texto e copie."); };
    try { navigator.clipboard.writeText(c.dataset.copy).then(ok, falha); } catch (err) { falha(); }
    setTimeout(function () { c.textContent = "Copiar"; }, 1600);
  });
  render(false);

  // Day / Night / Auto: Night is the dealt palette, Day its inverse; Auto follows the system or the app
  var r = document.documentElement;
  var prefersLight = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;
  function aplicarAuto() {
    if (r.dataset.hostTheme) r.setAttribute("data-theme", r.dataset.hostTheme);
    else if (prefersLight && prefersLight.matches) r.setAttribute("data-theme", "light");
    else r.removeAttribute("data-theme");
  }
  var modo = "auto";
  try { var s = localStorage.getItem("sg-theme"); if (s === "light" || s === "dark") modo = s; } catch (e) {}
  function aplicar(m, salvar) {
    modo = m;
    if (m === "light" || m === "dark") r.setAttribute("data-theme", m); else aplicarAuto();
    document.querySelectorAll("[data-theme-set]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.themeSet === m)); });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", r.getAttribute("data-theme") === "light" ? "#e3e2da" : "#161c1a");
    if (salvar) {
      try { m === "auto" ? localStorage.removeItem("sg-theme") : localStorage.setItem("sg-theme", m); } catch (e) {}
      anunciar(m === "light" ? "Modo Day" : m === "dark" ? "Modo Night" : "Modo automático, segue o sistema");
    }
  }
  if (prefersLight && prefersLight.addEventListener) prefersLight.addEventListener("change", function () { if (modo === "auto") aplicar("auto", false); });
  aplicar(modo, false);
  document.querySelectorAll("[data-theme-set]").forEach(function (b) { b.addEventListener("click", function () { aplicar(b.dataset.themeSet, true); }); });
})();
