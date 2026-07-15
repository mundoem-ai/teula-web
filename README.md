# Web Teula Sistemas

Sitio web estático (HTML + CSS + JavaScript). **No necesita servidor, base de datos ni
proceso de compilación.** Se puede abrir tal cual y subir a cualquier alojamiento web.

---

## 1. Estructura

```
sitio/
├── index.html                  Página principal (landing)
├── tarifas.html                Catálogo visual de tarifas por categoría
├── formacion.html              Landing de formación con acceso (login)
├── categorias/                 Una landing por departamento (6)
│   ├── bombas-de-calor.html
│   ├── aquabuster.html
│   ├── hidrofox.html
│   ├── climatizacion-baja-temperatura.html
│   ├── sistemas-de-control.html
│   └── contadores.html
├── tarifa/                     Tarifa PDF (se descarga desde la web)
│   └── Tarifa-Teula-2026.pdf
├── assets/
│   ├── css/styles.css          Diseño (colores, tipografías, maquetación)
│   ├── js/config.js            ← ENLACES (lo único a editar a menudo)
│   ├── js/main.js              Comportamiento: menú + animaciones (no hace falta tocarlo)
│   ├── js/gsap.min.js          Librería de animación (auto-alojada)
│   ├── js/ScrollTrigger.min.js Animación al hacer scroll (auto-alojada)
│   ├── fonts/                  Tipografías Teula (Bakbak One, Archivo, JetBrains Mono)
│   ├── img/                    Fotografías (cat-* apartados · amb-* ambiente)
│   └── logos/                  Logotipos e isotipos en SVG
└── README.md                   Este archivo
```

Las 6 categorías se ocultan tras el **icono de menú** (botón «Menú» del header), que
abre un panel a pantalla completa. Las secciones aparecen con una **animación suave al
hacer scroll** (GSAP, auto-alojado; sin conexión externa).

---

## 2. Cómo cambiar los enlaces (tarifa y formación)

Abre **`assets/js/config.js`** con cualquier editor de texto y sustituye el `#`
por la dirección real, entre comillas:

```js
window.TEULA_LINKS = {
  tarifaPDF: "tarifa/Tarifa-Teula-2026.pdf",   // PDF de la tarifa (archivo local)
  formacion: "#",                              // ← pega aquí la URL de formación
  email: "info@teula.es",
  telefono: "+34 900 000 000"
};
```

Guarda el archivo. Los botones de **toda la web** se actualizan solos.

- **Tarifa:** ya está enlazada al PDF incluido en la carpeta `tarifa/`. Para actualizarla,
  reemplaza ese archivo (mismo nombre) o cambia la ruta. También puedes poner una URL online
  `https://…` si prefieres alojarla fuera.
- **Formación:** todavía es un placeholder (`#`): su botón aparece atenuado con la etiqueta
  **«Próximamente»**. En cuanto tengas la URL de la plataforma, pégala entre comillas y el
  botón se activa (se abre en pestaña nueva).

---

## 3. Cómo cambiar textos e imágenes de una categoría

Cada categoría es un archivo `.html` dentro de `categorias/`. Ábrelo y edita:

- El texto entre las etiquetas del bloque marcado con
  `<!-- TEXTO GUÍA (editable) ... -->` (el copy es provisional, para rellenar con datos reales).
- Para cambiar la **foto** de una categoría, sustituye su imagen en `assets/img/`
  (las de apartado se llaman `cat-*.png`) o cambia la ruta `src` en el HTML.
- Añade tus fotos a `assets/img/` (recomendado: máximo ~1600 px de ancho, formato PNG o JPG).

---

## 4. Cómo publicarlo

Es un sitio estático: sube **toda la carpeta `sitio/`** a cualquiera de estas opciones.

- **Netlify / Vercel:** arrastra la carpeta a su panel. Publicación inmediata.
- **GitHub Pages:** sube la carpeta al repositorio y actívalo en *Settings → Pages*.
- **Hosting propio (FTP):** copia el contenido de `sitio/` a la carpeta pública (`public_html`).

No hay nada que «construir». Los archivos que ves son los que se publican.

### Ver la web en tu ordenador antes de publicar
Basta con abrir `index.html` en el navegador. Si algún navegador bloquea la carga de las
tipografías al abrir el archivo directamente, usa un servidor local simple, por ejemplo:

```
npx serve sitio
```

---

## 5. Identidad de marca

Colores, tipografías y logotipos siguen el *Manual de identidad visual Teula V-2026*.
Todo (fuentes e imágenes) está **auto-alojado**: la web no depende de servicios externos,
por lo que es estable y no requiere mantenimiento técnico.

| Color         | Hex       |
|---------------|-----------|
| Verde Mar     | `#014751` |
| Verde Lima    | `#D1D700` |
| Azul Marino   | `#15253E` |
| Fucsia        | `#E72380` |
| Azul Cielo    | `#A6DAEA` |
| Amarillo Ámbar| `#F7AD1A` |
