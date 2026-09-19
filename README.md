# Web Teula Sistemas

Sitio web estático (HTML + CSS + JavaScript). **No necesita servidor, base de datos ni
proceso de compilación.** Se puede abrir tal cual y subir a cualquier alojamiento web.

Arquitectura basada en el documento *Arquitectura Web 2.0: Simplificación, Diseño
Artesanal y Captación*: 3 categorías, cada una con la misma "Anatomía Universal"
(titular + intro, cuadrícula de gama, módulo específico, formulario de contacto
universal), fichas de producto individuales y un hub de formación aparte.

---

## 1. Estructura

```
sitio/
├── index.html                  Página principal (landing)
├── formacion.html               Landing de formación con acceso (login) — módulo aparte
├── tarifas.html                 Catálogo de tarifas (SIN ENLAZAR por ahora, ver §2)
├── categorias/                  Una página por línea de producto (3)
│   ├── radiadores.html          Banner + galería de 6 modelos + guía de medidas
│   ├── hidraulica.html          Cuadrícula + banner de armarios (Hidrofox)
│   └── contabilizacion.html     Cuadrícula + módulo de Servicios
├── productos/                   Fichas de producto individuales (estilo Caleido)
│   ├── t30.html                 2 acabados (blanco / antracita), galería completa
│   ├── decor.html
│   ├── canales.html
│   └── toallero.html
├── tarifa/                      Tarifa PDF (archivo conservado, sin enlazar)
│   └── Tarifa-Teula-2026.pdf
├── assets/
│   ├── css/styles.css           Diseño (colores, tipografías, maquetación)
│   ├── js/config.js             ← ENLACES (lo único a editar a menudo)
│   ├── js/main.js               Comportamiento: menú, buscador, formulario, animaciones
│   ├── js/gsap.min.js           Librería de animación (auto-alojada)
│   ├── js/ScrollTrigger.min.js  Animación al hacer scroll (auto-alojada)
│   ├── fonts/                   Tipografías Teula (Bakbak One, Archivo, JetBrains Mono)
│   ├── img/                     Fotografías (cat-*, pin-*, prod-*, amb-*)
│   └── logos/                   Logotipos e isotipos en SVG
└── README.md                    Este archivo
```

Las 3 categorías (+ Formación, aparte) se ocultan tras el **icono de menú** del header,
que abre un panel a pantalla completa con foto de fondo. El header también incluye un
**buscador** que encuentra categorías, fichas de producto y páginas al escribir.

---

## 2. Las 3 categorías y su contenido

| Categoría | Color | Gama (Capa 2) | Módulo específico (Capa 3) |
|---|---|---|---|
| **Radiadores** | Verde Lima | Banner + galería de 6 modelos: T30, Tower, Decor, Bent, Canales, Toalleros | Guía de medidas y acabados |
| **Hidráulica** | Azul Marino | Depósitos, Componentes, Sistemas de control | Banner "Armarios hidráulicos" (Hidrofox) |
| **Contabilización** | Amarillo Ámbar | Equipos de medición, Comunicaciones | Módulo "Servicios" (Auditoría, Plataforma, Telegestión) |

Todas terminan con el mismo **formulario de contacto universal** (Capa 4): un único
formulario con la rama **Particular / Profesional** (y dentro de Profesional:
Arquitecto / Instalador / Administrador de fincas), tal como pide el documento de
arquitectura. **Es solo de diseño: no envía datos a ningún sitio todavía.** Cuando haya
un CRM (p. ej. Holded) o un backend de correo, se sustituye el `submit` de
`.lead-form` en `assets/js/main.js` por el envío real.

### Tarifas — aparcado, no eliminado
El catálogo de tarifas (`tarifas.html` y el PDF en `tarifa/`) se ha **desenlazado** de
toda la navegación a petición expresa, pero el archivo sigue funcionando si lo abres
directamente. Para reactivarlo más adelante, basta con volver a poner enlaces a
`tarifas.html` donde se necesiten.

### Bombas de calor
No forma parte de esta arquitectura de 3 categorías (el documento de referencia no la
incluye) y se ha retirado de la navegación. Las fotos específicas de bombas de calor no
se usan actualmente.

---

## 3. Radiadores: galería de modelos y fichas de producto

`categorias/radiadores.html` tiene un banner a pantalla completa (estilo portada) y,
debajo, una **galería a ancho completo con los 6 modelos** (T30, Tower, Decor, Bent,
Canales, Toalleros). Al hacer clic en un modelo se abre su **ficha individual** en
`productos/`, con el diseño de referencia (banner + nombre superpuesto, franja de datos
básicos, ficha técnica, botón "Descargar ficha técnica (PDF)" — marcado
**"Próximamente"** porque aún no hay un PDF por producto — y una galería de fotos).

- **Con ficha completa** (fotografía real): `t30.html` (2 acabados: blanco y antracita),
  `decor.html`, `canales.html`, `toallero.html`.
- **Sin ficha todavía** (sin fotografía de producto): **Tower** y **Bent** aparecen en la
  galería como tarjetas de marca con la etiqueta **"Próximamente"**, sin enlace. En
  cuanto tengas fotos de estos dos modelos, se les puede montar su ficha igual que a
  los demás (duplica `decor.html` como plantilla, cambia imágenes y metadatos, y enlaza
  la tarjeta desde `categorias/radiadores.html`).

Las fotos nuevas de T30 (banner, interiores, detalle, y la variante doble en antracita)
llegan de `landing fotos/t30-*.png`, optimizadas a `assets/img/t30-*.jpg`.

---

## 4. Cómo cambiar los enlaces (formación, contacto)

Abre **`assets/js/config.js`** con cualquier editor de texto:

```js
window.TEULA_LINKS = {
  tarifaPDF: "tarifas.html",   // sin usar en la navegación actual (ver §2)
  formacion: "#",              // ← pega aquí la URL de la plataforma de formación
  email: "info@teula.es",
  telefono: "+34 981 079 480"
};
```

Mientras `formacion` valga `#`, cualquier botón que lo use aparece atenuado con la
etiqueta **«Próximamente»**. En cuanto tengas la URL real, pégala entre comillas.

---

## 5. Cómo cambiar textos e imágenes

- **Categorías:** cada archivo en `categorias/` tiene el texto de introducción y los
  módulos directamente en el HTML — edítalo con cualquier editor.
- **Fotos del mural o la gama:** sustituye el archivo en `assets/img/` (mismo nombre) o
  cambia la ruta `src` en el HTML.
- **Formulario de contacto:** su estructura vive en `assets/js/main.js`
  (función que genera `.lead-form`) — si solo quieres cambiar textos, edítalos
  directamente en cada página, dentro de `<section class="section" id="contacto">`.

---

## 6. Cómo publicarlo

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

## 7. Identidad de marca

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
