# Web de Teula (sitio estático)

HTML/CSS/JS sin build. Identidad visual: skill `teula-brand`.

- **Probar en local:** `python -m http.server 8765` desde la raíz y abrir `http://localhost:8765` en el navegador integrado. Comprobar escritorio y 375 px. Si el navegador sirve una versión vieja, recargar con `fetch(url, {cache:'reload'})`.
- **Categorías:** `categorias/*.html` llevan un JSON `cats` que `assets/js/galerias.js` pinta de forma genérica. Si una categoría tiene `hero`, sustituye imagen, título y lead del hero.
- **Animaciones:** GSAP y ScrollTrigger (`assets/js/`) escriben `transform` en línea; no uses `transform` en CSS sobre elementos animados, o se pisa.
- **Imágenes:** JPG en `assets/img/`, mismo nombre al reconvertir. Las originales generadas están en `C:\Users\Usuario\Documents\TEULA EDITORIAL STUDIO\exportaciones`.
- **Imágenes generadas:** sin textos, logos ni marcas ajenas. El logo de Teula se coloca aparte con los assets oficiales. Gráficas, pantallas y mandos exactos, como vectores.
- **Git:** no hacer push sin que se pida. Commits acotados a las rutas tocadas.
