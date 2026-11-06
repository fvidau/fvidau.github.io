# fvidau.github.io

[![CI](https://github.com/fvidau/fvidau.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/fvidau/fvidau.github.io/actions/workflows/ci.yml)
[![Deploy](https://github.com/fvidau/fvidau.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/fvidau/fvidau.github.io/actions/workflows/deploy.yml)

Portfolio personal de **fmv**: QA en sistemas bancarios que está construyendo agentes de IA aplicados a testing.

**Sitio:** https://fvidau.github.io

## Qué muestra este repo

Además del sitio, el repo documenta un ciclo completo de desarrollo hecho junto a una IA (Claude Code), con criterio de QA en cada etapa:

| Etapa | Evidencia |
|---|---|
| Diseño | [Documento de diseño](docs/superpowers/specs/2026-10-28-portfolio-fmv-design.md) y [mockup aprobado](docs/mockup/index.html) |
| Plan | [Plan de implementación](docs/superpowers/plans/2026-10-28-portfolio-fmv.md) |
| Tests primero | La suite se escribió antes que el sitio y se vio fallar (33 tests en rojo) |
| Desarrollo | Migración del mockup a componentes Astro + Tailwind |
| CI/CD | Tests en cada pull request; deploy a GitHub Pages solo si pasan |
| Proceso | [Bitácora](docs/bitacora.md): qué hizo la IA y qué decidí yo en cada etapa |

## Stack

- **Sitio:** [Astro](https://astro.build) 7 + [Tailwind CSS](https://tailwindcss.com) 4
- **Tests:** [Playwright](https://playwright.dev) + TypeScript en Chromium, Firefox, WebKit y mobile (375px)
- **Accesibilidad:** [axe-core](https://github.com/dequelabs/axe-core), objetivo WCAG 2.1 AA
- **CI/CD:** GitHub Actions + GitHub Pages

## Qué se prueba

| Suite | Cubre |
|---|---|
| `tests/navegacion.spec.ts` | Cada link del menú lleva a su página y la marca como actual, links viejos con ancla, página 404, navegación con teclado |
| `tests/contenido.spec.ts` | Título, descripción, canonical y `h1` de cada página, textos clave, botones de contacto, tarjetas de proyectos, links externos seguros |
| `tests/accesibilidad.spec.ts` | Sin violaciones WCAG 2.1 AA serias o críticas (axe), en cada página |
| `tests/responsive.spec.ts` | Sin scroll horizontal a 375px en cada página, áreas táctiles de 44px, respeto de `prefers-reduced-motion` |
| `tests/repos.spec.ts` | Unitario: la consulta a GitHub filtra forks y archivados, ordena y falla si la API no responde |

## Correrlo localmente

Requiere Node 22.

```bash
npm install
npx playwright install chromium firefox webkit
npm run dev      # sitio en http://localhost:4321
npm test         # build + suite completa
npx playwright show-report
```

## Deploy

Cada push a `main` corre los tests y, si pasan, publica en GitHub Pages. Requisito de una sola vez: en **Settings → Pages → Source** elegir **GitHub Actions**.

La página de Proyectos consulta los repos públicos a la API de GitHub al construir el sitio. Si la API no responde, el build falla y queda online la versión anterior. Un repo nuevo aparece en el próximo deploy.

## Estructura

```
src/
  pages/        Una página por archivo: Home, Sobre mí, Proyectos, Contacto y 404
  components/   Una sección por componente (Nav, Hero, SobreMi, Timeline, Proyectos, Contacto...)
  data/         Menú, experiencia, contacto y consulta de repos a GitHub
  layouts/      Head, metadatos, fuentes, nav y footer
  styles/       Tokens del diseño (Tailwind @theme)
tests/          Suites de Playwright
docs/           Diseño, plan, bitácora y mockup
```

## Exploración con agentes

Probé una sesión de exploración con **Playwright MCP**: Claude Code recorrió el sitio publicado como un reclutador desde el celular. Encontró solo problemas ya conocidos y usó muchos tokens, así que en este proyecto queda en pausa. Detalle en el [charter](docs/qa/charters/2026-10-31-reclutador-mobile.md).
