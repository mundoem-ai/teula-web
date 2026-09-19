/* ============================================================
   TEULA — Comportamiento
   - Rellena los href de enlaces externos desde config.js
   - Marca como "Próximamente" los que aún no tienen URL
   - Menú de navegación en móvil
   No requiere librerías externas.
   ============================================================ */
(function () {
  "use strict";

  var LINKS = window.TEULA_LINKS || {};

  /* --- Enlaces externos (data-link="tarifaPDF" | "formacion") --- */
  var placeholders = { "#": true, "": true, undefined: true, null: true };

  document.querySelectorAll("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    var url = LINKS[key];

    if (placeholders[url]) {
      // Aún sin URL definitiva
      el.classList.add("is-soon");
      el.setAttribute("aria-disabled", "true");
      el.setAttribute("href", "#");
      el.addEventListener("click", function (e) { e.preventDefault(); });
    } else {
      el.classList.remove("is-soon");
      el.removeAttribute("aria-disabled");
      if (/^https?:/i.test(url)) {
        // Enlace externo: pestaña nueva de forma segura
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      } else if (/^(mailto:|tel:|#|\/)/i.test(url)) {
        el.setAttribute("href", url);
      } else {
        // Ruta a un archivo/página dentro de la web. Se resuelve desde la raíz
        // usando TEULA_BASE ("" en la portada, "../" en las subpáginas).
        var base = window.TEULA_BASE || "";
        el.setAttribute("href", base + url);
        // Las páginas internas (.html) se abren en la misma pestaña;
        // los archivos (p. ej. un PDF) se abren en pestaña nueva.
        if (!/\.html?($|[?#])/i.test(url)) {
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener");
        }
      }
    }
  });

  /* --- Contacto en el pie --- */
  document.querySelectorAll('[data-contact="email"]').forEach(function (el) {
    if (LINKS.email) { el.setAttribute("href", "mailto:" + LINKS.email); el.textContent = LINKS.email; }
  });
  document.querySelectorAll('[data-contact="telefono"]').forEach(function (el) {
    if (LINKS.telefono) { el.setAttribute("href", "tel:" + LINKS.telefono.replace(/\s+/g, "")); el.textContent = LINKS.telefono; }
    else { el.parentNode && el.parentNode.removeChild(el); }
  });

  /* --- Menú en icono (overlay a pantalla completa) --- */
  var menuBtn = document.querySelector(".menu-btn");
  var overlay = document.querySelector(".menu-overlay");
  var closeBtn = document.querySelector(".menu-close");
  function setMenu(open) {
    if (!overlay) return;
    overlay.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && closeBtn) closeBtn.focus();
    else if (menuBtn) menuBtn.focus();
  }
  if (menuBtn && overlay) {
    menuBtn.addEventListener("click", function () { setMenu(!overlay.classList.contains("is-open")); });
    if (closeBtn) closeBtn.addEventListener("click", function () { setMenu(false); });
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) setMenu(false);
    });
  }

  /* --- Buscador del header --- */
  var SEARCH = [
    { t: "Radiadores", u: "categorias/radiadores.html", c: "--verde-lima", k: "baja temperatura toalleros decor t30 canales accesorios control" },
    { t: "Hidráulica", u: "categorias/hidraulica.html", c: "--azul-marino", k: "depositos componentes armarios sistemas de control bombeo" },
    { t: "Contabilización", u: "categorias/contabilizacion.html", c: "--amarillo-ambar", k: "contadores medicion comunicaciones servicios lecturas" },
    { t: "T30", u: "productos/t30.html", c: "--verde-lima", k: "radiador ficha producto baja temperatura" },
    { t: "Decor", u: "productos/decor.html", c: "--verde-lima", k: "radiador vertical espejo ficha producto" },
    { t: "Canales", u: "productos/canales.html", c: "--verde-lima", k: "canal de suelo ficha producto" },
    { t: "Toallero", u: "productos/toallero.html", c: "--verde-lima", k: "ficha producto bano" },
    { t: "Formación", u: "formacion.html", c: "--verde-lima", k: "cursos formacion acceso login" },
    { t: "Inicio", u: "index.html", c: "--verde-mar", k: "home portada" }
  ];
  var searchWrap = document.querySelector(".header-search");
  if (searchWrap) {
    var sInput = searchWrap.querySelector("input");
    var sResults = searchWrap.querySelector(".header-search__results");
    var sBase = window.TEULA_BASE || "";
    var sActive = -1;
    function norm(s) { return s.toLowerCase().replace(/[áàä]/g, "a").replace(/[éèë]/g, "e").replace(/[íìï]/g, "i").replace(/[óòö]/g, "o").replace(/[úùü]/g, "u").replace(/ñ/g, "n"); }
    function runSearch(q) {
      q = norm(q.trim());
      if (!q) { sResults.classList.remove("is-open"); sResults.innerHTML = ""; return; }
      var list = SEARCH.filter(function (it) { return norm(it.t + " " + it.k).indexOf(q) > -1; });
      sActive = -1;
      if (!list.length) {
        sResults.innerHTML = '<div class="header-search__empty">Sin resultados</div>';
      } else {
        sResults.innerHTML = list.map(function (it) {
          return '<a href="' + sBase + it.u + '" style="--c:var(' + it.c + ');"><span class="dot"></span>' + it.t + "</a>";
        }).join("");
      }
      sResults.classList.add("is-open");
    }
    sInput.addEventListener("input", function () { runSearch(sInput.value); });
    sInput.addEventListener("focus", function () { if (sInput.value.trim()) runSearch(sInput.value); });
    sInput.addEventListener("keydown", function (e) {
      var links = sResults.querySelectorAll("a");
      if (e.key === "ArrowDown") { e.preventDefault(); sActive = Math.min(sActive + 1, links.length - 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sActive = Math.max(sActive - 1, 0); }
      else if (e.key === "Enter") { if (links.length) { e.preventDefault(); links[sActive > -1 ? sActive : 0].click(); } return; }
      else if (e.key === "Escape") { sInput.value = ""; sResults.classList.remove("is-open"); return; }
      else { return; }
      links.forEach(function (a, i) { a.classList.toggle("is-active", i === sActive); });
    });
    document.addEventListener("click", function (e) { if (!searchWrap.contains(e.target)) sResults.classList.remove("is-open"); });
  }

  /* --- Formulario de contacto universal (frontal, sin backend) ---
     Rama Particular/Profesional -> Profesional revela el rol
     (Arquitecto/Instalador/Administrador de fincas). No envía datos a
     ningún sitio todavía: cuando haya CRM/backend, se sustituye este
     bloque por el envío real. */
  document.querySelectorAll(".lead-form").forEach(function (form) {
    var typeInputs = form.querySelectorAll('input[name="tipo"]');
    var roleField = form.querySelector(".lf-role");
    var msg = form.querySelector(".lf-msg");
    function syncRole() {
      var checked = form.querySelector('input[name="tipo"]:checked');
      var isPro = checked && checked.value === "profesional";
      if (roleField) roleField.classList.toggle("is-visible", !!isPro);
    }
    typeInputs.forEach(function (i) { i.addEventListener("change", syncRole); });
    syncRole();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (msg) msg.textContent = "Gracias. Hemos recibido tu solicitud y te contactaremos en breve.";
      form.reset();
      syncRole();
    });
  });

  /* --- Año en el pie --- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --- Animaciones al hacer scroll --- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!(window.gsap);
  var hasIO = "IntersectionObserver" in window;

  /* Marca que el sistema de animación se ha inicializado (desactiva el failsafe
     de la cabecera, que revela todo si este script no llegara a ejecutarse). */
  window.__teulaAnimated = true;

  function showNow(el) { el.classList.add("is-in"); }
  function forceShow() {
    reveals.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
  }

  try {
  if (reduce || (!hasGsap && !hasIO)) {
    /* Sin animación: mostrar todo */
    reveals.forEach(showNow);
  } else if (hasGsap && hasIO) {
    /* GSAP anima; IntersectionObserver dispara (fiable también en lo visible al cargar) */
    gsap.set(reveals, { opacity: 0, y: 28 });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var delay = parseFloat(el.getAttribute("data-reveal-delay")) || 0;
        gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: delay, overwrite: "auto" });
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });

    /* Parallax sutil de la imagen del hero */
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      var heroImg = document.querySelector(".hero-clean__media img");
      if (heroImg) {
        gsap.to(heroImg, {
          yPercent: 6, ease: "none",
          scrollTrigger: { trigger: ".hero-clean", start: "top top", end: "bottom top", scrub: true }
        });
      }
    }
  } else if (hasIO) {
    /* Reserva sin GSAP: IntersectionObserver + animación CSS */
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { showNow(e.target); io2.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io2.observe(el); });
  } else {
    reveals.forEach(showNow);
  }
  } catch (err) {
    /* Ante cualquier fallo del sistema de animación, mostrar el contenido */
    forceShow();
  }
})();
