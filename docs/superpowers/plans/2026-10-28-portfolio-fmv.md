# Portfolio fmv Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar el mockup aprobado a Astro + Tailwind, cubrirlo con Playwright (E2E + axe), y publicarlo en GitHub Pages con CI, dejando el proceso documentado.

**Architecture:** Sitio estático de una página con Astro; un componente por sección y un layout con head/estilos globales. Los tokens de diseño viven como variables CSS en `src/styles/global.css` y se exponen a Tailwind v4 con `@theme`. Los tests corren contra `astro preview` (build real) en Chromium, Firefox y WebKit.

**Tech Stack:** Node 22, Astro 7.3.8, Tailwind CSS 4.3.3 (`@tailwindcss/vite` 4.3.3), TypeScript 5.9.3, @playwright/test 1.64.1, @axe-core/playwright 4.13.0, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-28-portfolio-fmv-design.md`

## Global Constraints

- Versiones exactas fijadas (sin `^`): las de Tech Stack. Node local 22.19 (Astro 7.4+ exige ≥22.23, por eso 7.3.8).
- Colores: `#050705` fondo, `#0c110c` cards, `#1a241a` bordes, `#e8ece8` texto, `#8a948a` secundario, `#00ff41` acento, `#00c834` acento atenuado.
- Fuentes: Inter (texto), JetBrains Mono (logo, labels, terminal, pills), desde Google Fonts.
- Secciones e ids: `home`, `sobre-mi`, `proyectos`, `contacto`. Nav: "Home", "Sobre mí", "Proyectos", "Contacto".
- `lang="es"`. Sin scroll horizontal a 375px. Lluvia Matrix solo en el hero y desactivada con `prefers-reduced-motion: reduce`.
- Contacto: `mailto:fvidaurre.qa@gmail.com`, `https://www.linkedin.com/in/fvidaurre-qa`, `https://github.com/fvidau`. Links externos con `target="_blank" rel="noopener"`.
- Sitio publicado en `https://fvidau.github.io` (Astro `site`, sin `base`).
- Nada de `[NEED: ...]` en el HTML publicado. No inventar logros.
- Fuera del repo (`.gitignore`): `node_modules/`, `dist/`, `.astro/`, `test-results/`, `playwright-report/`, `.claude/settings.local.json`, `.claude/skills/`, `.claude/product-marketing.md`, `CONTENIDO.md`.

## Review Focus

1. Saltos directos con `#ancla` en la URL: la sección queda visible debajo del nav fijo (no tapada). → test en Task 2.
2. Nav en 375px: los 4 links visibles y clickeables, sin desborde. → test en Task 2.
3. Teclado: Tab recorre nav y botones con foco visible. → test en Task 2.
4. Fuentes de Google bloqueadas o lentas: el texto se ve con la fuente de respaldo (no invisible). → `display=swap` verificado en Task 3.
5. El último link del nav ("Contacto") queda activo al llegar al final aunque la sección sea corta. → test en Task 2.

---

### Task 1: Repo y base

**Files:**
- Create: `.gitignore`, `README.md` (borrador), `docs/bitacora.md`
- Move: `index.html` → `docs/mockup/index.html`, `foto.png` → `docs/mockup/foto.png` (referencia del diseño aprobado)

- [ ] **Step 1:** `git init -b main`, crear `.gitignore` con la lista de Global Constraints.
- [ ] **Step 2:** README borrador: qué es, stack, cómo correrlo (se completa en Task 7). Bitácora con la entrada "Etapa 0: diseño" (qué hizo Claude, qué decidió fmv).
- [ ] **Step 3:** `git status` no muestra archivos excluidos. Commit `chore: base del repo, diseño y plan`.
- [ ] **Step 4:** `git remote add origin https://github.com/fvidau/fvidau.github.io.git` y `git push -u origin main`.

### Task 2: Proyecto Astro + suite de Playwright (tests primero)

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `playwright.config.ts`, `src/pages/index.astro` (vacío salvo layout mínimo), `tests/navegacion.spec.ts`, `tests/contenido.spec.ts`, `tests/accesibilidad.spec.ts`, `tests/responsive.spec.ts`

**Interfaces:**
- Produces: scripts `dev`, `build`, `preview`, `test` (`playwright test`); `playwright.config.ts` con `webServer: { command: 'npm run build && npm run preview -- --port 4321', url: 'http://localhost:4321' }`, proyectos `chromium`, `firefox`, `webkit` y `mobile-chromium` (viewport 375×812), reporter `[['html', { open: 'never' }], ['list']]`, `trace: 'retain-on-failure'`.

- [ ] **Step 1:** Instalar dependencias con versiones exactas; `npx playwright install --with-deps chromium firefox webkit`.
- [ ] **Step 2: Tests (todos deben fallar contra la página vacía)**
  - `navegacion`: click en cada link del nav → la sección con ese id está en viewport y su título no queda debajo del nav (`boundingBox().y >= navHeight`); link activo = clase `active` en el link de la sección visible; al hacer scroll al final, "Contacto" activo; abrir `/#proyectos` directo → sección visible bajo el nav; Tab desde el inicio llega al logo y luego a los 4 links en orden.
  - `contenido`: un solo `h1`; `title` contiene "fmv"; `meta[name=description]` no vacía; `html[lang=es]`; foto con `alt` no vacío; links de contacto con los hrefs exactos de Global Constraints; externos con `rel` que contiene `noopener`; el HTML no contiene `[NEED`.
  - `accesibilidad`: `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()`; filtrar `impact` `serious|critical` → lista vacía (en desktop y mobile).
  - `responsive` (proyecto mobile): `document.documentElement.scrollWidth <= innerWidth`; los 4 links del nav visibles; con `page.emulateMedia({ reducedMotion: 'reduce' })` el `canvas#rain` no se muestra.
- [ ] **Step 3:** `npm test` → falla (página vacía). Commit `test: suite E2E y accesibilidad (roja)`.

### Task 3: Migración del mockup a componentes Astro

**Files:**
- Create: `src/layouts/Base.astro` (head, fuentes con `display=swap`, meta), `src/styles/global.css` (tokens + `@theme` + estilos del mockup que no son utilidades), `src/components/{Nav,Hero,MatrixRain,SobreMi,Timeline,Proyectos,Contacto,Footer}.astro`, `src/data/experiencia.ts`, `public/foto.png`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `src/data/experiencia.ts` exporta `experiencia: { anio: string; rol: string; empresa: string; periodo: string; descripcion: string; tags: string[] }[]`, consumido por `Timeline.astro`.

- [ ] **Step 1:** Portar el mockup con el mismo HTML/CSS visible y los mismos textos del mockup. Scripts (nav activo y lluvia) en `<script>` de `Nav.astro` y `MatrixRain.astro`.
- [ ] **Step 2:** `npm test` → pasan todos menos los de contacto (hrefs aún placeholder) y `[NEED`.
- [ ] **Step 3:** Comparación visual manual contra `docs/mockup/index.html` a 1280px y 375px; diferencias anotadas en la bitácora.
- [ ] **Step 4:** Si axe marca violaciones por el diseño: no cambiar colores; registrar en la bitácora y consultar a fmv. Commit `feat: migración del mockup a Astro + Tailwind`.

### Task 4: Contenido v1 y datos de contacto

**Files:** Modify: `src/components/{Hero,SobreMi,Contacto,Proyectos}.astro`, `src/data/experiencia.ts`, `src/layouts/Base.astro` (meta description)

- [ ] **Step 1:** Agregar a `contenido.spec.ts`: el `h1` contiene "Hago QA en sistemas bancarios"; el botón "Coordinemos una entrevista" tiene `href="mailto:fvidaurre.qa@gmail.com"`; "Ver mi recorrido" apunta a `#sobre-mi`; el título de Sobre mí es "De la pantalla del CRM al batch del mainframe". Correr → falla.
- [ ] **Step 2:** Volcar los textos de "Propuesta v1" de `CONTENIDO.md` (sin las marcas `[NEED]`), resaltado verde en "sistemas bancarios", datos de contacto reales.
- [ ] **Step 3:** `npm test` → todo verde. Commit `feat: contenido v1 y datos de contacto`.

### Task 5: CI en pull requests

**Files:** Create: `.github/workflows/ci.yml`

- [ ] **Step 1:** Workflow en `pull_request` y `push` a `main`: `actions/checkout@v4`, `actions/setup-node@v4` (node 22, cache npm), `npm ci`, `npx astro check`, `npx playwright install --with-deps`, `npm test`; subir `playwright-report/` con `actions/upload-artifact@v4` siempre (`if: always()`).
- [ ] **Step 2:** Abrir PR → el check pasa en GitHub. Commit `ci: tests en cada PR`.

### Task 6: Deploy a GitHub Pages

**Files:** Create: `.github/workflows/deploy.yml`; Modify: `astro.config.mjs` (`site: 'https://fvidau.github.io'`)

- [ ] **Step 1:** Workflow en `push` a `main` que primero corre los mismos tests (job `test`) y luego `withastro/action@v3` + `actions/deploy-pages@v4` (`needs: test`, permisos `pages: write`, `id-token: write`).
- [ ] **Step 2:** Configurar Pages con fuente "GitHub Actions" (Settings → Pages, o `gh api`).
- [ ] **Step 3:** Merge a `main` → `https://fvidau.github.io` responde 200 y muestra el h1. Commit `ci: deploy a GitHub Pages`.

### Task 7: Documentación

**Files:** Modify: `README.md`, `docs/bitacora.md`

- [ ] **Step 1:** README: link al sitio, badges de CI y deploy, captura, stack, cómo correr y testear, estructura, cómo se trabajó con IA (link a spec, plan y bitácora).
- [ ] **Step 2:** Bitácora con una entrada por etapa; dejar espacio marcado para que fmv agregue sus decisiones.
- [ ] **Step 3:** Commit `docs: README y bitácora`.

### Task 8 (siguiente sesión, guiada con fmv): Exploración agéntica con Playwright MCP

- Configurar Playwright MCP en Claude Code; explorar el sitio publicado; escribir charters en `docs/qa/charters/`; convertir hallazgos en tests nuevos por PR. Queda fuera de esta ejecución porque necesita una sesión nueva con el MCP cargado y fmv al mando.
