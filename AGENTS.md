# Portfolio fmv

Sitio personal de fmv: QA Engineer que construye agentes de IA aplicados a la calidad de software.

## Estado actual
- Publicado en `https://fvidau.github.io` con Astro + Tailwind, tests con Playwright y deploy a GitHub Pages.
- Sitio de varias páginas (Home, Sobre mí, Proyectos, Contacto). Diseño en
  `docs/superpowers/specs/2026-11-05-sitio-multipagina-design.md`.
- Para sumar una página: crear el archivo en `src/pages/` y agregarla en `src/data/navegacion.ts`.
- Registrar cada etapa en `docs/bitacora.md`.

## Diseño (aprobado, no cambiar sin pedirlo)
- Una página por sección: Home · Sobre mí · Proyectos · Contacto. La Home es el hero con acciones de contacto.
- La estructura tiene que permitir sumar páginas nuevas (por ejemplo, exploraciones técnicas) sin rehacer el sitio.
- Fondo negro `#050705`, acento verde Matrix `#00FF41` usado solo en detalles (links, bordes, años, pills).
- Texto principal `#e8ece8`, secundario `#8a948a`. Cards `#0c110c` con borde `#1a241a`.
- Tipografías: Inter (texto) y JetBrains Mono (logo, labels, terminal, pills).
- Minimalista: sin sección de skills ni testimonios. Por ahora sin blog.
- Lluvia Matrix tenue solo en el hero; respetar `prefers-reduced-motion`.

## Contenido
- Idioma: solo español por ahora. Preparar la estructura para sumar inglés más adelante.
- Los textos se están redefiniendo en `CONTENIDO.md`. No inventar logros ni cifras.
- Proyectos: tarjetas con los repos públicos de GitHub. Qué se muestra se refina más adelante.

## Reglas
- Responsive: probar en 375px de ancho, sin scroll horizontal.
- Accesibilidad: alt en imágenes, contraste suficiente, navegación con teclado.
- Commits chicos, uno por cambio.
