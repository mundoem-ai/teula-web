/* ============================================================
   TEULA — CONFIGURACIÓN DE ENLACES
   ------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE EDITAR PARA ACTUALIZAR
   LAS URLS EXTERNAS. No hace falta tocar el HTML.

   1. Sustituye el "#" por la dirección real entre comillas.
      Ejemplo:  tarifaPDF: "https://teula.es/tarifa-2026.pdf",
   2. Guarda el archivo. Los botones se actualizan solos.

   Mientras el valor sea "#", el botón se muestra atenuado con
   la etiqueta "Próximamente" (no parece un enlace roto).
   ============================================================ */

window.TEULA_LINKS = {

  // Botón "Tarifas" → abre la landing visual de tarifas por categoría (tarifas.html).
  // El PDF completo se descarga desde un botón dentro de esa página.
  tarifaPDF: "tarifas.html",

  // Botón "Formación" → abre la landing de formación con acceso (formacion.html).
  // Cuando tengas la plataforma externa real, puedes poner aquí su URL https://…
  formacion: "formacion.html",

  // (Opcional) Contacto — se usa en el menú
  email: "info@teula.es",
  telefono: "+34 981 079 480"

};
