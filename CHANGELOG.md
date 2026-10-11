# Changelog

Todos los cambios relevantes del sitio de Vertiente Labs se registran aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [versionado semántico](https://semver.org/lang/es/).

## [Sin publicar]

### Añadido
- `AGENTS.md` con las reglas de marca, la arquitectura de shaders, las convenciones y los pasos de verificación del proyecto.
- `CHANGELOG.md`.
- `CLAUDE.md`, que remite a `AGENTS.md` para que Claude Code siga las mismas reglas.
- Repositorio en GitHub: `dcs-71/vertientelabs-web`.

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
