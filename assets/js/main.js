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
