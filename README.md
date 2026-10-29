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
| `tests/navegacion.spec.ts` | Links del nav, sección activa al hacer scroll, anclas directas, navegación con teclado |
| `tests/contenido.spec.ts` | Metadatos, jerarquía de títulos, textos clave, links de contacto reales, links externos seguros |
| `tests/accesibilidad.spec.ts` | Sin violaciones WCAG 2.1 AA serias o críticas (axe) |
| `tests/responsive.spec.ts` | Sin scroll horizontal a 375px, nav usable en mobile, respeto de `prefers-reduced-motion` |

## Correrlo localmente

Requiere Node 22.

```bash
npm install
npx playwright install chromium firefox webkit
npm run dev      # sitio en http://localhost:4321
npm test         # build + suite completa
npx playwright show-report
```

## Estructura

```
src/
  components/   Una sección por componente (Nav, Hero, SobreMi, Timeline, Proyectos, Contacto...)
  data/         Experiencia y datos de contacto
  layouts/      Head, metadatos y fuentes
  styles/       Tokens del diseño (Tailwind @theme)
tests/          Suites de Playwright
docs/           Diseño, plan, bitácora y mockup
```

## Próximo paso

Exploración agéntica con **Playwright MCP**: Claude Code recorre el sitio publicado como un usuario, genera *user-journey charters* y propone tests nuevos que reviso antes de sumarlos.
