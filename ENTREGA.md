# Teula Sistemas — Entrega de la web (frontend)

Documento para la empresa que alojará la web en el dominio de Teula. Resume qué se entrega, qué necesita el alojamiento y qué **no** está hecho todavía.

## 1. Qué se entrega

Una web **estática**: HTML, CSS y JavaScript. No hay servidor propio, base de datos, panel de administración ni proceso de compilación. Se publica copiando el contenido de esta carpeta a la raíz de un alojamiento web con HTTPS.

- **Sin dependencias externas:** no carga nada de CDNs ni de terceros (las tipografías, el JavaScript y las imágenes están en la propia carpeta). No usa cookies, almacenamiento local ni analítica.
- **Rutas relativas:** funciona igual en la raíz de un dominio que en una subcarpeta. Hoy se revisa en GitHub Pages solo como entorno de revisión.
- **Tamaño:** unos 228 MB en 228 archivos. Casi todo son imágenes de producto en PNG (86 archivos de 2–3 MB, en `productos/` y `assets/img/`) y el PDF de tarifas (37 MB). Conviene optimizarlas antes de producción.

| Carpeta / archivo | Contenido |
|---|---|
| `index.html` | Portada |
| `categorias/` | 6 páginas: Radiadores, Hidráulica y Contabilización, más Componentes, Depósitos y Sistemas de control (subpáginas de Hidráulica) |
| `productos/` | 33 fichas de producto estáticas |
| `contacto.html`, `formacion.html`, `tarifas.html` | Contacto, landing de formación y tarifas (esta última sin enlazar desde la navegación) |
| `assets/` | `css/`, `js/` (`main.js`, `galerias.js`, `config.js`), `img/`, `fonts/`, `logos/` |
| `tarifa/` | Retirada: el PDF de tarifas se quitó del repositorio el 23/10/2026 por confidencialidad. Pendiente decidir si se publica y dónde. |

## 2. Requisitos del alojamiento

- Servidor de archivos estáticos (Apache, Nginx, IIS, un CDN o un servicio de hosting estático) con `index.html` como documento por defecto.
- HTTPS y el dominio de Teula apuntando a la carpeta.
- Recomendado: compresión (gzip o brotli) y caché larga para `assets/` con caché corta para los `.html`.
- No hacen falta reescrituras de URL ni Node, PHP o bases de datos para mostrar la web.

## 3. Qué NO está hecho (parte de servidor y servicios)

| Tema | Estado actual | Qué hace falta |
|---|---|---|
| **Formularios de contacto** (`contacto.html` y 7 páginas más) | Solo visuales: validan y muestran «Gracias», pero **no envían ni guardan nada**. Campos: tipo (particular o profesional), perfil, nombre, email, teléfono, interés, mensaje. | Un destino real (correo, servicio de formularios o CRM como Holded), protección antispam y casilla de consentimiento RGPD. El código a sustituir está en `assets/js/main.js` (bloque «Formulario de contacto universal»). |
| **Formación** | `formacion.html` es una landing con botones «Acceder al curso». **No hay login ni plataforma**; los botones apuntan a un valor vacío y se muestran como «Próximamente». | La URL de la plataforma de formación, que se pone en `assets/js/config.js` (clave `plataformaFormacion`). |
| **PDF descargables** | Los botones de ficha técnica y manual de instalación aparecen como «Próximamente». No existen esos PDF. | Los PDF por producto y dónde alojarlos. |
| **Tarifa** | El PDF y `tarifas.html` están en la carpeta, pero sin enlace en la navegación. | Decidir si se publica y dónde se aloja el PDF (37 MB). |
| **Datos de producto** | Están dentro del HTML y de un JSON embebido en `categorias/*.html`. No hay base de datos. | Si el cliente quiere editar productos sin tocar código, hay que añadir un CMS o un panel (decisión de alcance). |
| **Buscador del encabezado** | Busca sobre una lista fija en `assets/js/main.js` (constante `SEARCH`). | Mantener la lista a mano o sustituirla por un índice generado. |
| **Legal y cookies** | No hay aviso legal, política de privacidad ni política de cookies. | Textos legales y enlaces en el pie. El banner de cookies solo será necesario si se añade analítica o terceros. |
| **SEO e infraestructura** | Hay `title` y `description` básicos en las páginas. No hay `robots.txt`, `sitemap.xml`, página 404 ni analítica. | Crearlos según el alojamiento elegido. |

Los datos de contacto (email y teléfono) están en `assets/js/config.js` y escritos a mano en el pie de cada página.

## 4. Contenidos pendientes del cliente

- Medidas de **Vent** y **Toalleros**: figuran como «Consultar».
- Textos de **Canales** (Colores y Rejilla enrollable): son provisionales.
- **Armarios**: las 3 tarjetas de la galería interna (Producción de agua caliente, Grupos de bombeo y Estaciones de transferencia) tienen placeholder, y falta la referencia de producto para «Estaciones de transferencia». La descripción del hero es provisional.
- **T30R y T30L** comparten la misma foto en su ficha.
- Confirmar la imagen de **Telegestión de sala** (hoy muestra un gráfico de rendimiento de caldera).

## 5. Cómo se actualiza hoy

Editando los archivos de esta carpeta (HTML y JSON de las galerías) y, para enlaces externos, `assets/js/config.js`. El repositorio de GitHub es el origen de los cambios: la empresa de alojamiento puede desplegar desde ahí o con una copia de la carpeta.

## 6. Decisiones que necesita el cliente

1. ¿Los formularios deben llegar a un correo o a un CRM? ¿Cuál?
2. ¿Habrá una plataforma de formación con acceso? ¿Qué URL?
3. ¿Se publican la tarifa y las fichas en PDF? ¿Quién las prepara?
4. ¿Quiere editar productos sin tocar código (CMS) o basta con que lo haga el equipo técnico?
5. ¿Quién redacta los textos legales y de cookies?
