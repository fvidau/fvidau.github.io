# Portfolio fmv

Sitio personal de fmv: QA Engineer que construye agentes de IA aplicados a la calidad de software.

## Estado actual
- Mockup aprobado en `docs/mockup/index.html` (HTML + CSS puro, una sola página).
- En curso: migración a Astro + Tailwind, tests con Playwright y deploy a GitHub Pages
  (`https://fvidau.github.io`). Diseño en `docs/superpowers/specs/`, plan en `docs/superpowers/plans/`.
- Registrar cada etapa en `docs/bitacora.md`.

## Diseño (aprobado, no cambiar sin pedirlo)
- Una sola página con scroll. Nav: Home · Sobre mí · Proyectos · Contacto (links a anclas).
- Fondo negro `#050705`, acento verde Matrix `#00FF41` usado solo en detalles (links, bordes, años, pills).
- Texto principal `#e8ece8`, secundario `#8a948a`. Cards `#0c110c` con borde `#1a241a`.
- Tipografías: Inter (texto) y JetBrains Mono (logo, labels, terminal, pills).
- Minimalista: sin sección de skills, sin blog, sin testimonios.
- Lluvia Matrix tenue solo en el hero; respetar `prefers-reduced-motion`.

## Contenido
- Idioma: solo español por ahora. Preparar la estructura para sumar inglés más adelante.
- Los textos se están redefiniendo en `CONTENIDO.md`. No inventar logros ni cifras.
- Proyectos: por ahora solo un placeholder con link a GitHub.

## Reglas
- Responsive: probar en 375px de ancho, sin scroll horizontal.
- Accesibilidad: alt en imágenes, contraste suficiente, navegación con teclado.
- Commits chicos, uno por cambio.
