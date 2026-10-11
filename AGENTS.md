<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Vertiente Labs · Sitio web

Landing de Vertiente Labs (estudio de software a la medida). Una sola página construida con Next.js y shaders WebGL2 propios, siguiendo el **Manual de marca v2.0, variante Ámbar**.

- Manual de referencia: `../../Manual de Marca - VERTIENTE V2/manual-de-marca-vertiente-v2.html` (fuera de este repo). Ante cualquier duda visual, el manual manda.
- Idioma del sitio: español. Los textos de la interfaz y el copy van en español; comentarios de código en inglés.
- Registro de cambios: [`CHANGELOG.md`](CHANGELOG.md). Actualízalo con cada cambio visible.

## Comandos

```bash
npm run dev          # servidor de desarrollo (http://localhost:3000; en este entorno se usa -p 3100)
npm run build        # build de producción (debe pasar antes de dar algo por terminado)
npm run lint         # ESLint (config de Next)
npx tsc --noEmit     # chequeo de tipos
```

## Stack

- Next.js 16 (App Router, `cacheComponents` activo), React 19, TypeScript estricto.
- Sin Tailwind ni librerías de UI: todo el estilo vive en `src/app/globals.css`.
- Sin three.js: los shaders se dibujan con WebGL2 puro a través de `ShaderCanvas`.
- Fuentes vía `next/font/google`: Geist, Geist Mono e Instrument Serif (normal + itálica), expuestas como `--font-geist`, `--font-geist-mono`, `--font-instrument`.

## Estructura

```
src/
  app/
    layout.tsx        fuentes, metadata, <html lang="es">
    page.tsx          toda la página (Server Component); datos de secciones como constantes arriba
    globals.css       tokens de marca + estilos de todas las secciones
    icon.svg          favicon (V ámbar sobre obsidiana)
  components/
    ShaderCanvas.tsx  canvas WebGL2 genérico (client)
    Shaders.tsx       HeroShader, ContourShader, AuraShader (client, envuelven ShaderCanvas)
    Nav.tsx           barra de cristal fija (client)
    HeroFloat.tsx     tarjetas de cristal del hero con parallax (client)
    Manifesto.tsx     frase de la sección 01 que se ilumina con el scroll (client)
    Reveal.tsx        añade .is-in a los .reveal al entrar en pantalla (client)
    VConstruct.tsx    plano de construcción de la V en SVG (server)
    Logo.tsx          VMark y Logo (server)
  shaders/
    common.ts         cabecera GLSL: uniforms, paleta, simplex noise, fbm, helpers
    hero.ts           V + curvas de nivel en V que fluyen al vértice + luz líquida
    contours.ts       mapa topográfico interactivo (sección Proceso)
    aura.ts           auras de atmósfera; modo oscuro con cáusticas, modo claro en esquinas
```

Secciones de la página, en orden: Hero → 01 Esencia (`#estudio`) → 02 Servicios → 03 Proceso → 04 Casos → Voz → 05 Contacto → Footer.

## Reglas de marca (no negociables)

**Color.** Usa siempre los tokens de `:root`; no inventes colores.

| Rol | Token | Hex |
|---|---|---|
| Fondo oscuro / texto sobre claro | `--obsidiana` | `#0E0D0B` (nunca negro puro) |
| Fondo claro | `--caliza` / `--papel` | `#F3F0E9` / `#FBFAF6` (nunca blanco puro) |
| Acento, símbolo, CTA | `--ambar` | `#FF7A1F` |
| Ámbar para texto sobre claro | `--oxido` | `#B24A06` |
| Neutros | `--grafito`, `--niebla` | `#2B2824`, `#8A847A` |
| Atmósfera (solo auras) | `--miel`, `--coral`, `--manantial`, `--lima` | — |

- Los tonos de atmósfera solo aparecen como auras difusas, nunca como bloques planos.
- Proporción aproximada: Caliza/Papel 52 %, Obsidiana 28 %, neutros 10 %, aura 4 %. Alterna secciones claras y oscuras.
- Sobre fondo claro, el énfasis en ámbar se escribe en Óxido (clase `.amber-text` o `em` dentro de `.signature`).

**Tipografía.**
- Instrument Serif: titulares grandes, citas, frases de marca. La itálica marca el énfasis.
- Geist: cuerpo, interfaz, subtítulos y el wordmark. Light (300) para titulares grandes, Medium (500) para jerarquía.
- Geist Mono: rótulos y metadatos, en MAYÚSCULAS con tracking abierto (`.mono-s`, `.tag`).
- Firma tipográfica (`.signature`): primera línea en Geist Light y segunda en Instrument Serif itálica color Óxido.

**Símbolo y logotipo.**
- La V tiene geometría fija: trazo exterior `M10 18 L32 48 L54 18` (4u) y trazo interior `M18 18 L32 42 L46 18` (2.5u) al 42 % de opacidad. Siempre una sola tinta sólida: sin degradados, sombras ni segundo color.
- Logotipo: V + "vertiente" (Geist 500) + "labs" (Instrument Serif itálica). Usa `<Logo />` o `<VMark />`; no lo redibujes a mano.
- No rotar, deformar, cambiar tipografía ni colocar sobre fondos sin contraste.

**Sistema gráfico.**
- Retícula de celdas de 1 px (`.cells`). Los bordes son `border-right`/`border-bottom` reales. **No los vuelvas a hacer con `box-shadow`**: las celdas animadas (`.reveal` con transform/filter) tapaban la línea de la vecina.
- Cristal líquido: `.glass` sobre oscuro, `.glass-light` sobre claro (blur 22 px, borde de 1 px, radio 22 px).
- Radios: pill para acciones, 22 px tarjetas, 12 px campos, 6 px elementos pequeños.
- Íconos: lineales, trazo 1.6 px, terminales redondeadas, retícula 24 px. Monocromos; el ámbar/óxido solo para estado activo o énfasis.
- Curvas de nivel: Vs anidadas y desplazadas, siempre en baja opacidad.

## Voz y copy

- Somos claros, técnicos, cercanos y seguros; nunca simplistas, herméticos, informales ni arrogantes.
- Los clientes son organizaciones serias. Prioriza confianza, control y resultados medibles (p. ej. "Entregas medibles, procesos documentados y comunicación constante").
- Evita frases efectistas o "creativas" que no vendan a ese público (el cliente descartó "Pensar como ingenieros, diseñar como artistas" para Método).
- Tagline oficial: "Software que fluye."
- No cambies copy aprobado sin que te lo pidan; si propones alternativas, hazlo en la respuesta, no en el código.

## Shaders

- `ShaderCanvas` dibuja un triángulo a pantalla completa con un fragment shader GLSL ES 3.00. Uniforms automáticos (declarados en `HEADER` de `common.ts`):
  - `uRes` (px), `uTime` (s), `uMouse` (0–1, y hacia arriba, suavizado), `uMouseActive` (0–1 con easing)
  - `uIntro` (0→1 en ~2.4 s), `uScroll` (0–1 mientras el canvas sale por arriba)
- Uniforms propios: pásalos en `uniforms` como `number | [x,y] | [x,y,z]`. Define el objeto fuera del componente (o memoízalo) para que su identidad sea estable.
- Todo shader nuevo empieza con `${HEADER}` y usa las constantes de paleta (`OBSIDIANA`, `AMBAR`, …), no colores sueltos.
- Rendimiento: el canvas se pausa fuera de pantalla (IntersectionObserver) y limita el DPR (`maxDpr`: 1.25 en hero/proceso, 1 en auras). Mantén las octavas de ruido bajas; `fbmSoft` (2 octavas) para movimiento líquido, `fbm` (4) solo donde haga falta detalle. Un domain-warp con muchas octavas generó un "veteado de mármol" que ensuciaba el hero.
- Accesibilidad: con `prefers-reduced-motion` se dibuja un solo fotograma fijo y las animaciones CSS se desactivan. Si WebGL2 no está disponible, el canvas recibe `.is-fallback` (degradado CSS).
- En el hero, la posición/tamaño de la V se calcula en el shader según el aspecto (`wide`). Las tarjetas de `HeroFloat` están posicionadas en CSS alrededor de esa V; si mueves una, revisa la otra. La V no debe recortarse (el `reveal` de la intro está desplazado bajo el vértice a propósito).

## Convenciones de código

- `page.tsx` es Server Component; solo los componentes con estado, efectos o WebGL llevan `"use client"`.
- Datos de secciones (servicios, pasos, casos, valores) como arrays constantes al inicio de `page.tsx`.
- CSS: un único `globals.css`, organizado por secciones con encabezados de comentario. Responsive con breakpoints en 1080, 860 y 560 px; sin scroll horizontal en móvil.
- Animaciones de entrada: añade la clase `.reveal` (y `--i` para escalonar); `Reveal.tsx` se encarga del resto.

## Verificación antes de terminar

1. `npx tsc --noEmit`, `npm run lint` y `npm run build` sin errores.
2. Revisar en navegador a ~1440×900 y a 390×844: hero (V completa, tarjetas sin tapar el vértice), líneas de las celdas, legibilidad sobre auras.
3. Consola del navegador sin errores de compilación GLSL.
4. Añadir la entrada correspondiente en `CHANGELOG.md`.

## Contenido provisional (pendiente del cliente)

- Casos de estudio (Fintech, Logística, Salud): textos y etiquetas de ejemplo.
- Métricas del hero (`99.98%` uptime, `v4.2.1`, `build #2048`).
- Correo `hola@vertientelabs.com`, enlace de LinkedIn y enlace de WhatsApp (`href="#"`, formato previsto `https://wa.me/<número>`).
- Formulario de contacto: no envía datos todavía.
- Indicador "Agenda abierta para nuevos proyectos" en el pie del hero.
- Titular de la sección Voz ("Pensar como ingenieros. Diseñar como artistas."): pendiente de decisión del cliente.
