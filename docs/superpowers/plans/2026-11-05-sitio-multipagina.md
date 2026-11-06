# Sitio de varias páginas: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** pasar el portfolio de una página con anclas a cuatro páginas (Home, Sobre mí, Proyectos, Contacto), con acciones de contacto en íconos y tarjetas de repos de GitHub.

**Architecture:** cada página es un archivo en `src/pages/` que usa el layout `Base`, y `Base` incluye el nav y el footer. El nav lee un archivo de datos y marca la página actual al construir. Proyectos consulta la API de GitHub en el build con una función propia que filtra, ordena y falla si no hay datos.

**Tech Stack:** Astro 7.3.8, Tailwind 4.3.3, TypeScript 5.9.3, Playwright 1.64.1, @axe-core/playwright 4.13.0, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-05-sitio-multipagina-design.md`

## Global Constraints

- Sin dependencias nuevas. Node 22.
- El diseño visual no cambia: tokens de `src/styles/global.css`, Inter y JetBrains Mono, verde solo en detalles.
- No inventar textos: los títulos y descripciones salen de textos que ya están en el sitio o en este plan.
- 375 px sin scroll horizontal y axe WCAG 2.1 AA sin violaciones serias ni críticas, en cada página.
- Área táctil de 44 px como mínimo en el menú y en los botones de íconos.
- Respetar `prefers-reduced-motion`.
- Tests primero, vistos en rojo por el motivo correcto. Un commit por cambio, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Antes de correr tests locales: `npx kill-port 4321`, porque `reuseExistingServer` puede servir un build viejo.

## Review Focus

1. La API de GitHub responde un error o se queda sin cuota: el build falla con un mensaje claro y no se publica (Task 3, test unitario).
2. Un repo sin descripción o sin lenguaje: la tarjeta no muestra "null" ni un hueco (Task 3, test unitario y e2e).
3. Una URL sin barra final, como `/contacto`: carga la página igual (Task 1).
4. Un ancla desconocida (`/#algo`) o `/#home`: la Home queda quieta, sin redirigir ni entrar en bucle (Task 4).
5. Un botón de íconos con teclado: recibe el foco, se ve el foco y tiene un nombre accesible (Task 2).

---

### Task 1: páginas, layout y menú

**Files:**
- Create: `src/data/navegacion.ts`, `src/pages/sobre-mi.astro`, `src/pages/proyectos.astro`, `src/pages/contacto.astro`, `tests/paginas.ts`
- Modify: `src/layouts/Base.astro`, `src/components/Nav.astro`, `src/components/Hero.astro`, `src/components/SobreMi.astro`, `src/components/Proyectos.astro`, `src/components/Contacto.astro`, `src/pages/index.astro`, `src/styles/global.css`
- Test: `tests/navegacion.spec.ts` (se reescribe), `tests/contenido.spec.ts`, `tests/accesibilidad.spec.ts`, `tests/responsive.spec.ts`

**Interfaces:**
- Produces: `export const paginas: { href: string; texto: string }[]` en `src/data/navegacion.ts`, con `/`, `/sobre-mi/`, `/proyectos/`, `/contacto/` y los textos Home, Sobre mí, Proyectos, Contacto.
- Produces: `Base` mantiene sus props `title` y `description`, e incluye `<Nav />` antes y `<Footer />` después del `<slot />`.
- Produces: `export const PAGINAS = ['/', '/sobre-mi/', '/proyectos/', '/contacto/']` en `tests/paginas.ts`.

Títulos y descripciones de cada página:

| Página | `title` | `description` | `h1` |
|---|---|---|---|
| `/` | `fmv · QA Engineer` (sin cambios) | la actual, sin cambios | el del hero, sin cambios |
| `/sobre-mi/` | `Sobre mí · fmv` | `Recorrido de fmv como QA: el CRM de un banco, el core de pagos con microservicios y procesos batch sobre mainframe.` | `De la pantalla del CRM al batch del mainframe` |
| `/proyectos/` | `Proyectos · fmv` | `Repos públicos de fmv en GitHub: automatización de pruebas y agentes de IA aplicados a la calidad de software.` | `Proyectos` |
| `/contacto/` | `Contacto · fmv` | `Escribime y coordinamos una entrevista.` | `¿Buscás QA para un equipo de banca o fintech?` |

- [ ] **Step 1: Escribir los tests nuevos**
  - `navegacion.spec.ts`, para todos los proyectos salvo mobile-chromium:
    - por cada entrada de `paginas`, abrir `/`, hacer clic en su link del nav, `toHaveURL` con su `href`, ese link con `aria-current="page"` y ningún otro link del nav con `aria-current`;
    - el logo `fmv_` lleva a `/`;
    - Tab desde `/` recorre el logo y los 4 links en orden, con `outlineStyle` distinto de `none` (se omite en WebKit, como hoy).
  - Por cada página de `PAGINAS`:
    - `contenido.spec.ts`: un solo `h1` con el texto de la tabla, el `title` y la `description` de la tabla, y `link[rel=canonical]` igual a `https://fvidau.github.io` + ruta;
    - `accesibilidad.spec.ts`: axe con la guarda de que el `h1` sea visible;
    - `responsive.spec.ts`: sin scroll horizontal a 375 px.
  - Mudar los tests de contenido existentes a su página: `#sobre-mi`, `#proyectos` y `#contacto` pasan a abrir `/sobre-mi/`, `/proyectos/` y `/contacto/`.
  - Sacar del test del hero la aserción de "Ver mi recorrido" (Task 2 la reemplaza).
  - Agregar `page.goto('/contacto')`, sin barra final: muestra el `h1` de Contacto.
- [ ] **Step 2: Correr y verlos fallar**
  Run: `npx kill-port 4321; npm test`
  Expected: fallan los tests de páginas internas con 404 o con elementos no encontrados, no por errores de sintaxis.
- [ ] **Step 3: Implementar**
  - Crear las tres páginas con su componente dentro de `<main>`, y el `index` con el `Hero` dentro de `<main>`. `Hero` pasa de `<header id="home">` a `<section>`.
  - En cada componente de sección, el `h2` pasa a ser `h1` con las mismas clases. En las páginas internas, sumar un espacio arriba equivalente al alto del nav, 64 px, para que el título no quede debajo del nav fijo.
  - En `Nav.astro`, los links salen de `paginas`, y el logo y Home apuntan a `/`. El activo se calcula con `Astro.url.pathname` normalizado con barra final, y lleva `aria-current="page"`. El estilo activo pasa de `[&.active]:` a `aria-[current=page]:text-matrix`.
  - Del script de `Nav.astro` queda solo el borde al scrollear (`scrolled`). Se borran la sección activa, el fin de página y el arreglo de `fonts.ready`.
  - En `global.css` se borran `scroll-padding-top` y la regla `html.scroll-suave`.
  - En `Hero.astro`, "Ver mi recorrido" pasa a apuntar a `/sobre-mi/`, de forma transitoria hasta Task 2.
  - `astro.config.mjs` sigue sin `trailingSlash`, porque el valor por defecto acepta las dos formas.
- [ ] **Step 4: Correr y verlos pasar**
  Run: `npx astro check; npx kill-port 4321; npm test`
  Expected: 0 errores de tipos, 0 tests fallidos.
- [ ] **Step 5: Revisión visual** de las 4 páginas a 1280 y 375 px: el título queda debajo del nav y nada cambia de aspecto respecto de las secciones actuales.
- [ ] **Step 6: Commit** `refactor: separa las secciones en páginas con menú por ruta`

### Task 2: acciones del hero con íconos y WhatsApp

**Files:**
- Create: `src/components/Icono.astro`
- Modify: `src/data/contacto.ts`, `src/components/Hero.astro`, `src/components/Contacto.astro`
- Test: `tests/contenido.spec.ts`, `tests/responsive.spec.ts`, `tests/navegacion.spec.ts`

**Interfaces:**
- Consumes: `contacto` de `src/data/contacto.ts`.
- Produces: `contacto.whatsapp = 'https://wa.me/5491127539151'`.
- Produces: `<Icono nombre="email" | "linkedin" | "whatsapp" />`, un SVG inline de 24 px con `fill="currentColor"` y `aria-hidden="true"`.

Botones del hero, en este orden:

| Ícono | `href` | Nombre accesible y `title` | Externo |
|---|---|---|---|
| sobre (dibujo propio, no logo de Gmail) | `mailto:fvidaurre.qa@gmail.com` | `Escribirme por email` | no |
| LinkedIn | `contacto.linkedin` | `Mi perfil de LinkedIn` | sí |
| WhatsApp | `contacto.whatsapp` | `Escribirme por WhatsApp` | sí |

Los paths de LinkedIn y WhatsApp se copian de Simple Icons (licencia CC0), sin agregar la dependencia.

- [ ] **Step 1: Escribir los tests**
  - `contenido.spec.ts`, en `/`:
    - los tres links por nombre accesible, con su `href`;
    - los externos con `_blank` y `noopener`;
    - ninguno con texto visible (`innerText` vacío);
    - ya no existe "Ver mi recorrido".
  - En `/contacto/`, una tarjeta más, con el link de WhatsApp.
  - `responsive.spec.ts`: a 375 px, los tres botones miden 44×44 px como mínimo.
  - `navegacion.spec.ts`: después de los links del nav, Tab llega a los tres botones en orden y cada uno con foco visible.
- [ ] **Step 2: Correr y verlos fallar** (`npx kill-port 4321; npm test`). Expected: fallan los nombres accesibles y el WhatsApp.
- [ ] **Step 3: Implementar**
  - En `Hero.astro`, reemplazar los dos botones actuales por los tres de la tabla:
    - círculos de 48 px, con borde `border-line` y el ícono en `text-matrix`;
    - en hover, borde `border-matrix` y el glow de las tarjetas de contacto;
    - `aria-label` y `title` con el texto de la tabla.
  - En `Contacto.astro`, sumar la tarjeta con `tipo: 'whatsapp'` y `texto: '+54 9 11 2753-9151'`. La grilla pasa a `sm:grid-cols-2 lg:grid-cols-4`.
- [ ] **Step 4: Correr y verlos pasar** (`npx astro check; npx kill-port 4321; npm test`). Expected: 0 errores, 0 fallidos.
- [ ] **Step 5: Revisión visual** del hero a 1280 y 375 px y de los íconos a tamaño real.
- [ ] **Step 6: Commit** `feat: acciones de contacto del hero con íconos y WhatsApp`

### Task 3: tarjetas de proyectos desde GitHub

**Files:**
- Create: `src/data/repos.ts`, `tests/repos.spec.ts`
- Modify: `src/components/Proyectos.astro`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`
- Test: `tests/repos.spec.ts` (unitario, sin navegador), `tests/contenido.spec.ts`

**Interfaces:**
- Produces:

```ts
export interface Repo { nombre: string; descripcion: string | null; lenguaje: string | null; actualizado: string; url: string }
export async function obtenerRepos(usuario: string, token?: string): Promise<Repo[]>
```

`obtenerRepos` pide `https://api.github.com/users/<usuario>/repos?per_page=100`, con `Authorization: Bearer <token>` solo si hay token. Descarta forks y archivados, y ordena por `pushed_at` descendente. Lanza un `Error` que nombra el status HTTP si la respuesta no es OK, y otro error si no queda ningún repo. `actualizado` es el `pushed_at` en ISO.

- [ ] **Step 1: Escribir `tests/repos.spec.ts`**
  - Corre solo en el proyecto chromium y reemplaza `globalThis.fetch` en cada test:
    - con un 403, `obtenerRepos('fvidau')` rechaza con un mensaje que contiene `403`;
    - con `[]`, rechaza;
    - con un fork, un archivado y dos repos normales, devuelve solo los dos normales, ordenados del push más reciente al más viejo;
    - con un repo de `description: null` y `language: null`, devuelve `descripcion: null` y `lenguaje: null`;
    - con token, el header `Authorization` es `Bearer <token>`; sin token, no hay header.
  - En `contenido.spec.ts`, en `/proyectos/`:
    - hay al menos una tarjeta (`article`);
    - cada una tiene un link a `^https://github.com/fvidau/[^/]+$` con `_blank` y `noopener`;
    - una de ellas apunta a `https://github.com/fvidau/fvidau.github.io`;
    - el texto de la sección no contiene `null`, `undefined` ni "próximamente".
- [ ] **Step 2: Correr y verlos fallar** (`npx kill-port 4321; npm test`). Expected: el import de `src/data/repos.ts` no existe; faltan las tarjetas.
- [ ] **Step 3: Implementar**
  - `obtenerRepos` en `src/data/repos.ts`.
  - En `Proyectos.astro`, llamarla en el frontmatter con `obtenerRepos('fvidau', import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN)`. Mostrar una grilla `sm:grid-cols-2` de `article`, con el estilo de las tarjetas de experiencia:
    - el nombre en `h2`, como link al repo;
    - la descripción, si existe;
    - una pill con el lenguaje, si existe;
    - la fecha como `actualizado <mes abreviado> <año>`, en `es-AR`.

    Se borra el bloque de terminal con "próximamente" y se mantiene "Ver mi GitHub →" debajo de la grilla.
  - En `ci.yml`, el paso `npm test` lleva `env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`.
  - En `deploy.yml`, el job `build` lleva el mismo `env` a nivel de job.
- [ ] **Step 4: Correr y verlos pasar** (`npx astro check; npx kill-port 4321; npm test`). Expected: 0 errores, 0 fallidos.
- [ ] **Step 5: Probar la falla de verdad:** con `GITHUB_TOKEN=invalido npm run build`, el build termina con error y el mensaje nombra el status 401.
- [ ] **Step 6: Commit** `feat: tarjetas de proyectos con los repos públicos de GitHub`

### Task 4: links viejos con ancla y página 404

**Files:**
- Create: `src/pages/404.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/navegacion.spec.ts`

**Interfaces:**
- Consumes: `Base` y `paginas` de Task 1.

- [ ] **Step 1: Escribir los tests**
  - `/#sobre-mi`, `/#proyectos` y `/#contacto` terminan en `/sobre-mi/`, `/proyectos/` y `/contacto/`, con `toHaveURL`.
  - `/#home` y `/#algo` se quedan en `/` y el `h1` del hero sigue visible después de 1 s.
  - `goto('/no-existe/')` devuelve status 404 y muestra el nav y un link a `/`.
- [ ] **Step 2: Correr y verlos fallar** (`npx kill-port 4321; npm test`).
- [ ] **Step 3: Implementar**
  - En `index.astro`, un script inline que lee `location.hash`. Si es uno de los tres de arriba, hace `location.replace` a su página; si no, no hace nada.
  - `404.astro` con `Base`, `title` "Página no encontrada · fmv", `h1` "Esta página no existe" y un link "Volver al inicio" a `/`.
- [ ] **Step 4: Correr y verlos pasar.** Si `astro preview` no devuelve 404 para rutas inexistentes, la aserción de status se reemplaza por la del contenido, y queda anotado como ruling.
- [ ] **Step 5: Commit** `feat: redirige los links con ancla y agrega página 404`

### Task 5: documentación

**Files:**
- Modify: `README.md` (estructura y tabla de tests), `docs/arquitectura.md` (secciones 2 y 3), `docs/bitacora.md` (Etapa 3), `AGENTS.md` (estado actual: diseño terminado)

- [ ] **Step 1:** Actualizar los cuatro archivos para que describan las páginas, el menú por ruta, `obtenerRepos` y los tests nuevos, sin mencionar ya el scroll por anclas.
- [ ] **Step 2: Verificar** con `grep -rn "scroll-suave\|#sobre-mi\|una sola página" README.md docs/arquitectura.md AGENTS.md`. Expected: sin resultados.
- [ ] **Step 3: Commit** `docs: describe el sitio de varias páginas`
