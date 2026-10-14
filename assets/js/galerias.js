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

  /* Tarjeta de modelo. Con item.det -> pie de foto en subcat-card; sin él, rótulo model-card__cap. */
  function cardHTML(it, clickable) {
    var inner;
    if (it.det) {
      inner = '<span class="rollover">' +
        '<img class="rollover__img rollover__img--general" src="' + IMG + it.img + '" alt="' + esc(it.nombre) + '" loading="lazy">' +
        '<span class="subcat-card__cap"><h3 class="subcat-card__title">' + esc(it.nombre) + '</h3>' +
        '<span class="subcat-card__note">' + esc(it.nota) + '</span></span></span>';
    } else {
      inner = '<img src="' + IMG + it.img + '" alt="' + esc(it.nombre) + '"' + (it.pos ? ' style="object-position:' + esc(it.pos) + '"' : "") + ' loading="lazy">' +
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
    var cls = "model-grid" + (cat.sinAmpliar ? "" : n === 1 ? " model-grid--n1" : n === 2 ? " model-grid--n2" : "") + (cat.destacar ? " model-grid--foco" : "");
    return '<div class="full-bleed cat-band"><div class="' + cls + '">' +
      cat.items.map(function (it) { return cardHTML(it, clickable); }).join("") +
      "</div></div>" +
      (cat.nota ? '<p class="gal-nota">' + esc(cat.nota) + "</p>" : "");
  }

  /* Galería en fila a ancho de página: tarjetas no clicables con solo el nombre sobre la foto.
     Sin "foto" se muestra el placeholder (.ph) con el nombre. */
  function galeriaHTML(cat) {
    return '<div class="full-bleed cat-band"><div class="model-grid model-grid--fila">' +
      cat.galeria.map(function (g) {
        var media = g.foto
          ? '<img src="' + IMG + g.foto + '" alt="' + esc(g.titulo) + '" loading="lazy">' +
            '<span class="model-card__cap"><span class="model-card__cap-name">' + esc(g.titulo) + "</span></span>"
          : '<span class="ph" style="--ph:var(--azul-marino);"><b>' + esc(g.titulo) + "</b></span>";
        return '<div class="model-card"><span class="model-card__img">' + media + "</span></div>";
      }).join("") + "</div></div>";
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
    var ov = null, openCat = null, lastProd = null;

    /* Hero de la página: si la categoría trae "hero", se sustituye imagen, título y descripción;
       al volver a las categorías se restauran los valores originales. */
    var hero = $(".hero-clean"), heroBase = null, heroClase = "";
    var hImg = hero && $(".hero-clean__media img", hero), hH1 = hero && $("h1", hero), hLead = hero && $(".hero-clean__lead", hero);
    if (hImg && hH1 && hLead) {
      heroBase = { img: hImg.getAttribute("src"), alt: hImg.getAttribute("alt") || "", titulo: hH1.textContent, lead: hLead.textContent };
    }
    function setHero(h) {
      if (!heroBase) return;
      hImg.setAttribute("src", h ? IMG + h.img : heroBase.img);
      hImg.setAttribute("alt", h ? (h.alt || "") : heroBase.alt);
      hH1.textContent = h ? h.titulo : heroBase.titulo;
      hLead.textContent = h ? h.lead : heroBase.lead;
      if (heroClase) hero.classList.remove(heroClase);
      heroClase = (h && h.clase) || "";
      if (heroClase) hero.classList.add(heroClase);
    }

    function toTop() {
      var y = root.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo(0, Math.max(0, y));
    }

    function showCats() {
      closeFicha();
      setHero(null);
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
      title.style.display = cat.hero ? "none" : "";
      setHero(cat.hero || null);
      cont.innerHTML = cat.galeria ? galeriaHTML(cat) : cat.bloques ? altHTML(cat) : gridHTML(cat, !!(cfg.ficha && cat.ficha));
      root.classList.add("is-sub");
      vCat.classList.remove("is-active");
      vSub.classList.add("is-active");
      if (cat.hero) window.scrollTo(0, 0); else toTop();
    }

    /* ---------- Ficha de producto: panel flotante vertical ---------- */
    function fichaHTML(cat, it) {
      var s = series[it.serie] || {};
      var meta = it.meta || s.meta || [];
      var esquema = it.esquema || s.esquema;
      /* Una sola foto: la primera de gal (item o serie); con fotoPropia, la del propio modelo. */
      var g = cat.fotoPropia ? [it.img, it.img, it.nombre] : (it.gal || s.gal || [[it.img, it.img, it.nombre]])[0];
      var h = '<section class="ficha-sec"><p class="label">' + esc(String(cfg.raiz).toUpperCase()) + "</p>" +
        '<h3 class="ficha-h3">' + esc(it.nombre) + ', en detalle.</h3>' +
        '<div class="subcat-card"><span class="subcat-card__img"><img src="' + IMG + g[0] + '" alt="' + esc(g[2] || it.nombre) + '">' +
        '<span class="subcat-card__cap"><h3 class="subcat-card__title">' + esc(g[2] || it.nombre) + "</h3></span></span></div></section>";
      if (meta.length || esquema) {
        h += '<section class="ficha-sec"><p class="label">Datos técnicos</p>' +
          '<h3 class="ficha-h3">' + (esquema ? "Esquema y dimensiones." : "Características.") + "</h3>";
        if (meta.length) {
          h += '<div class="prod-meta">' + meta.map(function (p) {
            return '<div><div class="prod-meta__label">' + esc(p[0]) + '</div><div class="prod-meta__val">' + esc(p[1]) + "</div></div>";
          }).join("") + "</div>";
        }
        if (esquema) h += '<figure class="tech-schema"><img src="' + IMG + esquema + '" alt="Esquema técnico de ' + esc(it.nombre) + '"></figure>';
        h += "</section>";
      }
      h += '<section class="ficha-sec"><div class="prod-hero__cta">' +
        '<a class="btn is-soon" href="#" aria-disabled="true">Descargar ficha técnica (PDF) <span class="arw">↓</span></a>' +
        '<a class="btn btn--ghost" href="' + (window.TEULA_BASE || "../") + "contacto.html?interes=" + encodeURIComponent(cfg.interes || cfg.raiz) +
        '">Solicitar información <span class="arw">→</span></a></div></section>';
      return h;
    }

    function ensureOverlay() {
      if (ov) return ov;
      ov = document.createElement("div");
      ov.className = "ficha-overlay";
      ov.setAttribute("role", "dialog");
      ov.setAttribute("aria-modal", "true");
      ov.setAttribute("aria-label", "Ficha de producto");
      ov.innerHTML = '<div class="ficha-panel"><button type="button" class="ficha-close" aria-label="Cerrar ficha">✕</button><div class="ficha-body"></div></div>';
      document.body.appendChild(ov);
      $(".ficha-close", ov).addEventListener("click", requestClose);
      ov.addEventListener("click", function (e) {
        if (e.target === ov) { requestClose(); return; }
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
      lastProd = prodId;
      $(".ficha-body", ov).innerHTML = fichaHTML(cat, it);
      $(".ficha-body", ov).scrollTop = 0;
      ov.classList.add("is-open");
      document.documentElement.style.overflow = "hidden";
      $(".ficha-close", ov).focus();
    }

    function closeFicha() {
      if (ov) ov.classList.remove("is-open");
      document.documentElement.style.overflow = "";
    }

    /* Devuelve el foco al modelo que abrió la ficha (la rejilla puede haberse repintado). */
    function restoreFocus() {
      if (!lastProd) return;
      var b = cont.querySelector('[data-prod="' + lastProd + '"]');
      if (b) b.focus({ preventScroll: true });
    }

    function requestClose() {
      if (history.state && history.state.prod) history.back();
      else { closeFicha(); restoreFocus(); }
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
      else if (st && st.cat) {
        if (openCat === st.cat && vSub.classList.contains("is-active")) { closeFicha(); restoreFocus(); }
        else showSub(st.cat);
      }
      else showCats();
    });
  };
})();
