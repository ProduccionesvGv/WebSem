# VGVSERV – Guía rápida de mantenimiento

Este proyecto fue refactorizado para separar **datos (PRODUCTS)** de la **lógica (app)**, facilitar la carga de múltiples imágenes por genética y permitir agregar nuevas genéticas sin tocar el HTML.

---

## Estructura de carpetas

```
/
├─ index.html (u otros .html)
├─ img/                 # tus imágenes
├─ js/
│  ├─ products.js       # <-- define const PRODUCTS = [...] (DATA)
│  └─ app.min.js        # <-- lógica minificada (BOOTSTRAP/RENDER)
└─ css/                 # estilos (si aplica)
```

El HTML carga **primero** `js/products.js` y **después** `js/app.min.js`. El render se monta de forma automática sobre un contenedor con id `gallery` si existe.

Ejemplo mínimo de HTML para la galería:
```html
<div id="gallery"></div>
<script src="js/products.js"></script>
<script src="js/app.min.js"></script>
```

> Si no existe `#gallery`, no se renderiza nada (comportamiento intencional).

---

## Cómo agregar una genética nueva (SIN tocar el HTML)

1. **Agrega las imágenes** a la carpeta `img/` (usa nombres en kebab-case, ver convención más abajo).
2. **Abre** `js/products.js`.
3. **Copia** el bloque **TEMPLATE** y **pégalo** dentro del arreglo `PRODUCTS`.
4. Cambia:
   - `id`: slug en **kebab-case** (ej. `white-widow-auto`).
   - `title`: el título visible (ej. `White Widow Auto`).
   - `images`: rutas relativas en `img/` (hero + variantes).

Guarda el archivo, recarga el navegador y listo.

---

## Ejemplo listo para copiar/pegar (TEMPLATE)

```js
{
  id: 'template-id',              // slug en kebab-case, ej: 'white-widow-auto'
  title: 'Template Title',        // título visible
  images: [
    'img/template-hero.jpg',      // reemplaza por tus rutas reales
    'img/template-1.jpg',
    'img/template-2.jpg'
  ]
}
```

> **Orden de imágenes**: la primera se considera “principal/hero” y suele mostrarse primero.

---

## Convención de nombres (recomendada)

- **kebab-case**: minúsculas + guiones (`white-widow-auto.jpg`).
- Evita espacios, acentos o caracteres especiales.
- Prefiere el mismo **prefijo** para las variantes:  
  `white-widow-auto-hero.jpg`, `white-widow-auto-1.jpg`, `white-widow-auto-2.jpg`…

Esto ayuda a mantener el proyecto ordenado y a realizar búsquedas/renombrados en lote cuando haga falta.

---

## Reemplazar o sumar imágenes a una genética existente

En `js/products.js`, busca el objeto por `id` y agrega o reemplaza rutas dentro del array `images`.  
No hay que tocar `app.min.js` ni el HTML.

```js
{
  id: 'phantom-ice',
  title: 'Phantom Ice',
  images: [
    'img/phantom-ice-hero.jpg',
    'img/phantom-ice-1.jpg',
    'img/phantom-ice-2.jpg',
    // agrega aquí más rutas si quieres
  ]
}
```

---

## Optimización y performance (sugerencias)

- **Lazy loading**: todas las `<img>` se renderizan con `loading="lazy"` automáticamente.
- **Peso recomendado**: intenta que cada imagen pese ≤ 250–350 KB para una carga fluida en móvil.
- **Tamaño**: 1200–1600 px de ancho suele ser un buen balance.
- **Formato**: usa **.jpg** para fotos; considera **.webp** si tu hosting lo sirve bien (añade ambas y referencia webp primero si lo deseas).
- **Cache busting**: si reemplazas un archivo con el mismo nombre y no ves cambios, fuerza recarga (Ctrl+F5) o cambia el nombre del archivo.

---

## Personalización del render

El bootstrap busca `#gallery` al cargar la página y dibuja todas las genéticas definidas en `PRODUCTS`.  
Si quieres cambiar el **ID del contenedor**, basta modificarlo en `app.min.js` (o en la versión no minificada de tu preferencia) donde se llama a `renderGalleryFromConfig('#gallery', PRODUCTS);`.

> Si prefieres, podemos generar una versión no minificada `app.js` con comentarios para edición más cómoda.

---

## Solución de problemas

- **No aparecen las imágenes**: verifica rutas (respetar mayúsculas/minúsculas y carpetas).  
- **404 en alguna imagen**: confirma que el archivo exista en `img/` y que el nombre coincida exactamente.
- **No se renderiza nada**: asegúrate de tener `<div id="gallery"></div>` en el HTML **y** que `products.js` se cargue **antes** que `app.min.js`.
- **Cambios que no se ven**: limpia caché del navegador (Ctrl+F5) o prueba en ventana privada.
- **IDs duplicados**: cada `id` dentro de `PRODUCTS` debe ser único.

---

## Preguntas frecuentes

**¿Puedo reordenar las imágenes?**  
Sí. Cambia el orden en el array `images` dentro del objeto de la genética.

**¿Puedo ocultar temporalmente una genética?**  
Sí. Comenta el objeto en `PRODUCTS` o crea un flag `isActive: false` y filtra antes de renderizar (podemos ayudarte a añadir este filtro en el bootstrap).

**¿Cómo agrego una descripción por genética?**  
Añade un campo `description` al objeto y ajusta el render para mostrarlo (podemos dejarlo listo si lo necesitas).

---

## Changelog de la refactorización

- Renombrado de IDs/títulos: `gorilla-glue-auto` → `phantom-ice` (**Phantom Ice**), `lemon-haze-fem` → `la-messias` (**La Messias**).
- Centralización de datos en `js/products.js` (`const PRODUCTS = [...]`).
- Lógica minificada en `js/app.min.js` y carga de scripts ordenada.
- Soporte para múltiples imágenes por genética (ejemplos precargados).
- Template listo para copiar/pegar.
- `loading="lazy"` aplicado a imágenes para mejorar performance.
- Limpieza y homogeneización de rutas/archivos de imagen.

---

## Placeholder SVG (fallo de imágenes)

Si una genética no trae imágenes, el sistema usa un **placeholder SVG** muy liviano.

- Archivo: `img/placeholder.svg` (vectorial, se ve nítido en todas las resoluciones)
- Lógica:
  - **Hero del card**: usa `PRODUCTS[id].images[0]` o, si no existe, `placeholder.svg`.
  - **Galería de 3 del panel**: usa las 3 rutas de `PRODUCTS[id].images` o, si faltan, 3 veces `placeholder.svg`.
- Opcional: función `svgPlaceholder(label, bg, stroke, text)` disponible en `app.min.js` para generar placeholders inline (data URI) sin usar archivos.

> Puedes reemplazar el diseño del placeholder editando `img/placeholder.svg`.
