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

  // Botón "Descargar tarifa" (catálogo digital PDF con fichas y vídeos)
  // Archivo local dentro de la web (carpeta /tarifa). Para usar una versión
  // online, sustituye por una URL https://…
  tarifaPDF: "tarifa/Tarifa-Teula-2026.pdf",

  // Enlace "Formación" (plataforma externa de cursos: registro + acceso)
  formacion: "#",

  // (Opcional) Contacto — se usa en el pie de página
  email: "info@teula.es",
  telefono: ""

};
