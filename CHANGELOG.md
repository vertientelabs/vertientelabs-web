# Changelog

Todos los cambios relevantes del sitio de Vertiente Labs se registran aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [versionado semántico](https://semver.org/lang/es/).

## [Sin publicar]

### Cambiado (proceso y correo)
- "Producto con IA" pasa a "Integraciones con IA" en Servicios, la etiqueta del Caso 02, el footer y la opción de interés del formulario. Migración `supabase/migrations/20261011180000_rename_interes_integraciones_ia.sql` para el `CHECK` de `leads.interes`.
- Hero: el texto de apoyo pasa a "Construimos plataformas, apps y sistemas a la medida para que tu equipo opere eficientemente." La meta descripción (`layout.tsx`) usa el mismo texto.
- Sección 03 Proceso: el texto de introducción pasa a "Llevamos una idea desde la primera conversación hasta un producto en producción que sigue creciendo conforme a las necesidades de tu equipo." (se retira "Mueve el cursor sobre el mapa").
- Correo de la empresa: `informes@vertientelabs.com` en Contacto, footer y el aviso del formulario (antes `hola@`).
- Sección 01 Esencia: el párrafo "Vertiente Labs diseña y desarrolla software a la medida…" se oculta en móvil (≤ 560 px).

### Cambiado (contacto y CTA)
- Sección 02, tarjeta CTA: el texto queda solo en "Cuéntanos qué necesitas construir."
- WhatsApp: los enlaces de Contacto y del footer apuntan a `https://wa.me/51986040205` (Perú) y se abren en una pestaña nueva.
- Formulario: nuevo campo obligatorio **Teléfono** (validado en servidor) y la etiqueta "Email corporativo" pasa a "E-mail". "Sector" e "Interés" quedan lado a lado.
- Migración `supabase/migrations/20261011120000_add_leads_telefono.sql`: columna `telefono` en `leads` y permiso de inserción para `anon`.

### Añadido
- Formulario de contacto completo (nombre, empresa, email corporativo, sector, interés, mensaje) con validación en servidor, mensajes por campo, estado de envío y confirmación. Server Action `submitLead` que guarda en la tabla `leads` de Supabase; honeypot anti-spam.
- Migración `supabase/migrations/20261011000000_create_leads.sql`: tabla `leads` con restricciones y RLS que solo permite insertar desde la web.
- `.env.example` con las variables de Supabase.
- Migración aplicada en el proyecto Supabase de producción; permisos verificados (la web solo puede insertar) y envío real probado de punta a punta.
- Capturas de producto en `public/productos/laborcare/` y `public/productos/reader/`.
- Dependencias: `@supabase/supabase-js`, `server-only`.
- Hero: nuevo shader de **integración**. Flujos de datos salen de sistemas (ERP, CRM, App móvil, Web, IA, Cloud), bajan por la V y salen del vértice como un único flujo hacia "Una sola plataforma". Fondo de retícula de puntos que reacciona al cursor.
- `HeroSystems`: etiquetas de cristal alineadas con los flujos, a partir de la misma geometría (`FLOW`) que usa el shader.
- Sección 01: escena 3D de logística (Three.js + React Three Fiber). Un camión se descarga en una cinta, un operario escanea cada paquete con su tablet bajo un arco lector y las cajas se apilan en un pallet que se despacha al completarse. HUD en vivo con contador de paquetes y aviso de cada escaneo.
- Dependencias: `three`, `@react-three/fiber`, `@types/three`.
- `AGENTS.md` con las reglas de marca, la arquitectura de shaders, las convenciones y los pasos de verificación del proyecto.
- `CHANGELOG.md`.
- `CLAUDE.md`, que remite a `AGENTS.md` para que Claude Code siga las mismas reglas.
- Repositorio en GitHub: `dcs-71/vertientelabs-web`.

### Cambiado
- Hero más pausado: intro de 3.6 s y paquetes de datos lentos.
- `ShaderCanvas` acepta `introSeconds`.
- Escena 3D: el remolque vuelve a tener pared lateral y techo (solo queda abierto por detrás, hacia el muelle), con franja ámbar y el símbolo V en el costado.
- Sección 02: se retira "Cloud & DevOps"; "Consultoría técnica" pasa a la quinta celda y la sexta es una tarjeta de llamada a la acción oscura que lleva al formulario de contacto.
- Footer: el enlace "Cloud & DevOps" pasa a "Consultoría técnica".

### Eliminado
- Hero: fondo líquido, curvas de nivel en V y tarjetas flotantes (código, uptime, build).
- Sección 01: plano de construcción de la V (`VConstruct`), reemplazado por la escena 3D.

### Cambiado (contacto, casos y footer)
- Contacto: diseño en dos columnas (texto y canales a la izquierda, formulario de cristal a la derecha).
- Casos: las dos primeras tarjetas son ahora los productos reales, LaborCare y Vertiente Reader. Mismo diseño.
- Footer: la columna "Estudio" pasa a "Productos" (LaborCare, Vertiente Reader).

### Corregido
- Sección 01: se elimina la tarjeta "¿Tienes un proyecto en mente?", que se había duplicado por error debajo de los valores.
- Escena 3D: el borde del remolque parpadeaba (caras coplanares entre paredes y postes, z-fighting). Los postes ahora envuelven los extremos de las paredes, el logotipo lateral usa `polygonOffset` y la sombra lleva `normalBias`.

### Cambiado (CTA)
- Sección 02, tarjeta de llamada a la acción: el botón pasa de "Completar formulario" a "Contáctanos".

## [0.4.0] - 2026-10-11

### Cambiado
- Footer, columna Contacto: Instagram se reemplaza por WhatsApp (enlace pendiente).
- Sección 01, valor "Método": el texto pasa a "Entregas medibles, procesos documentados y comunicación constante.", con un tono más adecuado para clientes corporativos.

## [0.3.0] - 2026-10-11

### Añadido
- Sección 01 rediseñada en dos columnas: frase principal con el párrafo "Por qué existimos" y una tarjeta de cristal claro con el plano de construcción de la V (retícula, guías, ángulo de 72.5°, trazos que se dibujan al aparecer y curvas de nivel en movimiento).
- Valores Promesa, Principio y Método como tarjetas `.glass-light` con letra, ícono y tipografía más grande.
- Pie del hero: indicador "Agenda abierta para nuevos proyectos" con enlace a Contacto.

### Cambiado
- Título de la sección 04: "Problemas reales, *soluciones eficientes.*"

### Eliminado
- Texto "Edición 2026" del pie del hero.

### Corregido
- Las líneas de la retícula de celdas (Servicios, Voz, Footer) desaparecían durante las animaciones de entrada. Ahora se dibujan con bordes reales en vez de `box-shadow`.
- Etiquetas del plano de la V que se superponían a los trazos.

## [0.2.0] - 2026-10-11

### Cambiado
- Texto del hero: "…para equipos que quieren moverse eficientemente." (también en la meta descripción).
- Sección 01: nueva frase "Identificamos el origen de cada problema y construimos el *cauce* para que la tecnología fluya sin fricción."
- Promesa: "Tecnología que funciona, se entiende y crece con tu organización."

### Eliminado
- Cinta de tecnologías (marquee) debajo del hero.
- Tagline de la fila de valores de la sección 01.

### Corregido
- La punta de la V del hero se recortaba al terminar la animación de entrada.

## [0.1.0] - 2026-10-11

### Añadido
- Proyecto Next.js 16 (App Router, TypeScript) con los tokens del Manual de marca v2.0, variante Ámbar: paleta, Instrument Serif, Geist y Geist Mono, cristal líquido, retícula de celdas y logotipo.
- `ShaderCanvas`: renderizador WebGL2 reutilizable con pausa fuera de pantalla, cursor suavizado, intro, scroll y soporte para movimiento reducido.
- Shader del hero: la V de marca con curvas de nivel en V que fluyen hacia el vértice, luz líquida y respuesta al cursor.
- Shader topográfico interactivo para la sección Proceso.
- Shader de auras con cáusticas (Contacto) y auras en las esquinas de las secciones claras.
- Secciones: navegación de cristal, hero con tarjetas flotantes, Esencia, Servicios, Proceso, Casos, Voz, Contacto y footer con el logotipo a gran escala.
- Diseño responsive (escritorio, tablet y móvil) y favicon con la V.
