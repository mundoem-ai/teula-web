/* Teula — galerías por niveles: categorías → subcategorías → ficha (opcional).
   Sin dependencias. Se configura con TeulaGaleria({ cats, series, raiz, ficha }). */
(function () {
  var IMG = (window.TEULA_BASE || "../") + "assets/img/";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function $(s, r) { return (r || document).querySelector(s); }

  /* Tarjeta de modelo. Con item.det -> rollover (foto general + detalle); sin él, una sola foto. */
  function cardHTML(it, clickable) {
    var inner;
    if (it.det) {
      inner = '<span class="rollover">' +
        '<img class="rollover__img rollover__img--general" src="' + IMG + it.img + '" alt="' + esc(it.nombre) + '" loading="lazy">' +
        '<img class="rollover__img rollover__img--detalle" src="' + IMG + it.det + '" alt="Detalle de ' + esc(it.nombre) + '" loading="lazy">' +
        '<span class="subcat-card__cap"><h3 class="subcat-card__title">' + esc(it.nombre) + '</h3>' +
        '<span class="subcat-card__note">' + esc(it.nota) + '</span></span></span>';
    } else {
      inner = '<img src="' + IMG + it.img + '" alt="' + esc(it.nombre) + '" loading="lazy">' +
        '<span class="model-card__cap"><span class="model-card__cap-name">' + esc(it.nombre) + '</span>' +
        '<span class="model-card__cap-desc">' + esc(it.nota) + '</span></span>';
    }
    var body = '<span class="model-card__img">' + inner + '</span>';
    return clickable
      ? '<button type="button" class="model-card" data-prod="' + esc(it.id) + '">' + body + '</button>'
      : '<div class="model-card">' + body + '</div>';
  }

  function gridHTML(cat, clickable) {
    var n = cat.items.length;
    var cls = "model-grid" + (n === 1 ? " model-grid--n1" : n === 2 ? " model-grid--n2" : "") + (cat.destacar ? " model-grid--foco" : "");
    return '<div class="full-bleed cat-band"><div class="' + cls + '">' +
      cat.items.map(function (it) { return cardHTML(it, clickable); }).join("") +
      "</div></div>" +
      (cat.nota ? '<p class="gal-nota">' + esc(cat.nota) + "</p>" : "");
  }

  function altHTML(cat) {
    return '<div class="wrap">' + cat.bloques.map(function (b, i) {
      var n = b.fotos.length;
      return '<div class="alt-block' + (i % 2 ? " alt-block--rev" : "") + '">' +
        '<div class="alt-block__fotos alt-block__fotos--' + (n > 1 ? "multi" : "uno") + '" style="--n:' + n + '">' +
        b.fotos.map(function (f) { return '<figure><img src="' + IMG + f + '" alt="' + esc(b.titulo) + '" loading="lazy"></figure>'; }).join("") +
        '</div><div class="alt-block__texto"><h3>' + esc(b.titulo) + "</h3><p>" + esc(b.texto) + "</p></div></div>";
    }).join("") + "</div>";
  }

  window.TeulaGaleria = function (cfg) {
    var cats = cfg.cats, series = cfg.series || {};
    var root = $("#modelos"), vCat = $("#vista-categorias"), vSub = $("#vista-subcategorias");
    var title = $("#subcat-titulo"), cont = $("#subcat-contenido");
    if (!root || !vCat || !vSub) return;
    var ov = null, openCat = null;

    function toTop() {
      var y = root.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo(0, Math.max(0, y));
    }

    /* Foco: resalta el modelo bajo el cursor / con foco de teclado y atenúa el resto. */
    function bindFoco() {
      var g = $(".model-grid--foco", cont);
      if (!g) return;
      var hover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
      function set(card) {
        g.classList.toggle("has-foco", !!card);
        Array.prototype.forEach.call(g.querySelectorAll(".model-card.is-foco"), function (c) {
          if (c !== card) c.classList.remove("is-foco");
        });
        if (card) card.classList.add("is-foco");
      }
      if (hover) {
        g.addEventListener("mouseover", function (e) { set(e.target.closest(".model-card")); });
        g.addEventListener("mouseleave", function () { set(null); });
        g.addEventListener("click", function () { set(null); });
      }
      g.addEventListener("focusin", function (e) {
        if (e.target.matches && e.target.matches(":focus-visible")) set(e.target.closest(".model-card"));
      });
      g.addEventListener("focusout", function () { set(null); });
    }

    function showCats() {
      closeFicha();
      root.classList.remove("is-sub");
      vSub.classList.remove("is-active");
      vCat.classList.add("is-active");
      openCat = null;
      toTop();
    }

    function showSub(id) {
      var cat = cats[id];
      if (!cat) return;
      closeFicha();
      openCat = id;
      title.textContent = cat.titulo;
      cont.innerHTML = cat.bloques ? altHTML(cat) : gridHTML(cat, !!(cfg.ficha && cat.ficha));
      bindFoco();
      root.classList.add("is-sub");
      vCat.classList.remove("is-active");
      vSub.classList.add("is-active");
      toTop();
    }

    /* ---------- Ficha de producto (replica productos/t30.html) ---------- */
    function fichaHTML(cat, it) {
      var s = series[it.serie] || {};
      var banner = it.banner || s.banner || it.img;
      var lead = (it.nota ? it.nota + " " : "") + (s.lead || "");
      var specs = it.specs || s.specs || [];
      var meta = it.meta || s.meta || [];
      var gal = it.gal || s.gal || [[it.img, it.det || it.img, it.nombre]];
      var esquema = it.esquema || s.esquema;
      var nombreCat = cat.corto || cat.titulo;
      var h = "";
      h += '<section class="model-hero"><div class="model-hero__media"><img src="' + IMG + banner + '" alt="' + esc(it.nombre) + '"></div>' +
        '<div class="model-hero__top"><nav class="breadcrumb" aria-label="Ruta"><span>' + esc(cfg.raiz) + '</span><span class="sep">/</span>' +
        "<span>" + esc(nombreCat) + '</span><span class="sep">/</span><span>' + esc(it.nombre) + "</span></nav></div>" +
        '<div class="model-hero__body"><h1>' + esc(it.nombre) + '.</h1><p class="model-hero__lead">' + esc(lead) + "</p></div></section>";
      if (specs.length) {
        h += '<div class="model-specs">' + specs.map(function (p) {
          return '<div class="model-specs__item"><div class="label">' + esc(p[0]) + "</div><div>" + esc(p[1]) + "</div></div>";
        }).join("") + "</div>";
      }
      h += '<section class="section"><div class="wrap"><p class="label" style="margin-bottom:8px;">Galería</p>' +
        '<h3 class="ficha-h3">' + esc(it.nombre) + ', en detalle.</h3><div class="subcat-grid">' +
        gal.map(function (g) {
          return '<div class="subcat-card"><span class="subcat-card__img"><span class="rollover">' +
            '<img class="rollover__img rollover__img--general" src="' + IMG + g[0] + '" alt="' + esc(g[2]) + '">' +
            '<img class="rollover__img rollover__img--detalle" src="' + IMG + g[1] + '" alt="Detalle: ' + esc(g[2]) + '">' +
            '<span class="subcat-card__cap"><h3 class="subcat-card__title">' + esc(g[2]) + "</h3></span></span></span></div>";
        }).join("") + "</div></div></section>";
      if (meta.length || esquema) {
        h += '<section class="section section--tight"><div class="wrap"><p class="label" style="margin-bottom:8px;">Datos técnicos</p>' +
          '<h3 class="ficha-h3">' + (esquema ? "Esquema y dimensiones." : "Características.") + "</h3>";
        if (meta.length) {
          h += '<div class="prod-meta">' + meta.map(function (p) {
            return '<div><div class="prod-meta__label">' + esc(p[0]) + '</div><div class="prod-meta__val">' + esc(p[1]) + "</div></div>";
          }).join("") + "</div>";
        }
        if (esquema) h += '<figure class="tech-schema"><img src="' + IMG + esquema + '" alt="Esquema técnico de ' + esc(it.nombre) + '"></figure>';
        h += "</div></section>";
      }
      h += '<section class="section section--tight"><div class="wrap"><div class="prod-hero__cta">' +
        '<a class="btn is-soon" href="#" aria-disabled="true">Descargar ficha técnica (PDF) <span class="arw">↓</span></a>' +
        '<a class="btn btn--gray is-soon" href="#" aria-disabled="true">Descargar manual de instalación (PDF) <span class="arw">↓</span></a>' +
        '<a class="btn btn--ghost" href="' + (window.TEULA_BASE || "../") + "contacto.html?interes=" + encodeURIComponent(cfg.interes || cfg.raiz) +
        '">Solicitar información <span class="arw">→</span></a></div></div></section>';
      return h;
    }

    function ensureOverlay() {
      if (ov) return ov;
      ov = document.createElement("div");
      ov.className = "ficha-overlay";
      ov.setAttribute("role", "dialog");
      ov.setAttribute("aria-modal", "true");
      ov.setAttribute("aria-label", "Ficha de producto");
      ov.innerHTML = '<button type="button" class="ficha-close" aria-label="Cerrar ficha">✕</button><div class="ficha-body"></div>';
      document.body.appendChild(ov);
      $(".ficha-close", ov).addEventListener("click", requestClose);
      ov.addEventListener("click", function (e) {
        var soon = e.target.closest && e.target.closest(".is-soon");
        if (soon) e.preventDefault();
      });
      return ov;
    }

    function openFicha(catId, prodId) {
      var cat = cats[catId];
      var it = cat && cat.items && cat.items.filter(function (x) { return x.id === prodId; })[0];
      if (!it) return;
      ensureOverlay();
      $(".ficha-body", ov).innerHTML = fichaHTML(cat, it);
      ov.scrollTop = 0;
      ov.classList.add("is-open");
      document.documentElement.style.overflow = "hidden";
      $(".ficha-close", ov).focus();
    }

    function closeFicha() {
      if (ov) ov.classList.remove("is-open");
      document.documentElement.style.overflow = "";
    }

    function requestClose() {
      if (history.state && history.state.prod) history.back(); else closeFicha();
    }

    /* ---------- Eventos ---------- */
    document.querySelectorAll("[data-cat]").forEach(function (b) {
      b.addEventListener("click", function () {
        history.pushState({ cat: b.getAttribute("data-cat") }, "");
        showSub(b.getAttribute("data-cat"));
      });
    });
    $(".gal-back", vSub).addEventListener("click", function () {
      if (history.state && history.state.cat) history.back(); else showCats();
    });
    cont.addEventListener("click", function (e) {
      var b = e.target.closest("[data-prod]");
      if (!b || !openCat) return;
      history.pushState({ cat: openCat, prod: b.getAttribute("data-prod") }, "");
      openFicha(openCat, b.getAttribute("data-prod"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && ov && ov.classList.contains("is-open")) requestClose();
    });
    window.addEventListener("popstate", function (e) {
      var st = e.state;
      if (st && st.cat && st.prod) { if (openCat !== st.cat) showSub(st.cat); openFicha(st.cat, st.prod); }
      else if (st && st.cat) showSub(st.cat);
      else showCats();
    });
  };
})();
