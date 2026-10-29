# Portfolio fmv: diseño del ciclo completo hasta el deploy

Fecha: 2026-10-28 · Estado: borrador para aprobación

## Intención y porqué

fmv (Federico Vidaurre) es QA con 4 años en banca y quiere crecer hacia un perfil de
**QA agéntico**: Claude Code + MCP + Playwright, accesibilidad, CI y reportes.

Este proyecto tiene dos productos:

1. **El sitio**: un portfolio personal de una sola página, para que reclutadores IT
   lo contacten para una entrevista.
2. **La evidencia de cómo trabaja**: un repo público en GitHub que muestra un ciclo
   completo (diseño → plan → desarrollo → tests → CI → deploy) hecho junto a una IA,
   con las decisiones humanas visibles. El sitio funciona como su primer
   "sistema bajo prueba" de QA agéntico.

También es un ejercicio de aprendizaje: fmv quiere aprender a usar Claude Code y
aplicar agentes de IA a QA. Cada etapa debe poder explicarse y repetirse.

## Objetivos

- Migrar el mockup aprobado (`index.html`) a **Astro + Tailwind**, con el mismo
  aspecto y comportamiento.
- Publicarlo en **GitHub Pages** en `https://fvidau.github.io`.
- Suite de **Playwright + TypeScript** con E2E y accesibilidad (**axe-core**,
  objetivo WCAG 2.1 AA) en **Chromium, Firefox y WebKit**.
- **GitHub Actions**: en cada pull request corren build y tests; al unir a `main`
  se publica el sitio si todo pasa.
- **Reportes** de Playwright (HTML report + traces en fallos) como artefactos del CI.
- **Exploración agéntica con Playwright MCP**: Claude Code explora el sitio,
  genera *user-journey charters* y propone tests; fmv revisa y decide cuáles entran.
- **Documentación**: README del repo + bitácora del proceso (qué se hizo, qué
  hizo la IA, qué decidió fmv).

## No objetivos (por ahora)

- Textos finales: se usa la propuesta v1 de `CONTENIDO.md`; fmv los reescribirá después.
- Sección de proyectos real: queda el placeholder con link a GitHub.
- Versión en inglés (la estructura no debe impedirla más adelante).
- Pruebas de performance con k6 y pruebas de API: el sitio es estático, sin backend.
- Dominio propio, analytics, formulario de contacto con backend.

## Anti-objetivos (sería un fracaso aunque funcione)

- Que el repo parezca generado por IA sin criterio humano: el proceso y las
  decisiones de fmv tienen que verse.
- Tests que pasan siempre y no prueban nada (tests decorativos).
- Cambiar el diseño aprobado sin pedirlo.
- Inventar logros o cifras en los textos.

## Restricciones

- Diseño aprobado (ver `AGENTS.md`): fondo `#050705`, acento `#00FF41` solo en
  detalles, Inter + JetBrains Mono, una página con anclas (Home · Sobre mí ·
  Proyectos · Contacto), lluvia Matrix tenue solo en el hero respetando
  `prefers-reduced-motion`.
- Responsive sin scroll horizontal a 375px.
- Español (`lang="es"`).
- Repo público `fvidau/fvidau.github.io` (renombrado desde `fvit`, que estaba vacío).
- Entorno: Windows, Node 22, Git. GitHub CLI no instalado (opcional).

## Decisiones tomadas

| Tema | Decisión | Quién |
|---|---|---|
| Framework | Astro + Tailwind | fmv (aceptó la recomendación) |
| Hosting | GitHub Pages, repo `fvidau.github.io` | fmv |
| Tests | Playwright + TypeScript, axe-core | Claude (alineado al perfil objetivo de fmv) |
| CI/CD | GitHub Actions | Claude |
| Flujo | Una rama + pull request por etapa, tests antes de unir a `main` | Claude |
| Contenido | Propuesta v1 de `CONTENIDO.md` | fmv |

## Qué deben cubrir los tests (mínimo)

- El nav lleva a cada sección y marca la sección activa al hacer scroll.
- Los botones del hero llevan a su destino (sección o `mailto:`).
- Links externos (LinkedIn, GitHub) abren con `rel="noopener"`.
- Sin scroll horizontal a 375px; nav usable en mobile.
- La foto tiene `alt`; un solo `h1`; jerarquía de encabezados correcta.
- axe-core sin violaciones WCAG 2.1 AA (serias o críticas) en desktop y mobile.
- Con `prefers-reduced-motion: reduce` la lluvia Matrix no se anima.
- Metadatos: `title`, `meta description`, `lang="es"`.

## Etapas (cada una es una rama + PR)

1. **Repo y base**: git, `.gitignore`, README inicial, este documento.
2. **Migración a Astro + Tailwind**: componentes por sección, mismo resultado visual.
3. **Tests E2E + accesibilidad** con Playwright.
4. **CI**: workflow de tests en cada PR.
5. **Deploy**: workflow de publicación en GitHub Pages desde `main`.
6. **Exploración agéntica**: Playwright MCP + Claude Code, charters y tests nuevos
   que salgan de ahí.
7. **Documentación final**: README con capturas, badges y bitácora.

## Datos de contacto (reales, dados por fmv)

- Email: fvidaurre.qa@gmail.com
- LinkedIn: https://www.linkedin.com/in/fvidaurre-qa
- GitHub: https://github.com/fvidau

## Decisiones de Claude tras la revisión (fmv puede objetarlas)

- **Migración y contenido separados**: la etapa 2 migra el mockup tal cual, para
  poder compararlo. Los textos v1 de `CONTENIDO.md` entran en una etapa 2b propia.
  Las marcas `[NEED: ...]` no llegan al sitio: esas frases se omiten. En el título
  nuevo, el resaltado verde va en "sistemas bancarios".
- **Accesibilidad vs. diseño**: si axe marca una violación causada por el diseño
  aprobado (por ejemplo, contraste), no se cambia el diseño en silencio: se le
  muestra a fmv el antes y el después, y fmv decide.
- **Qué va al repo público**: código, `AGENTS.md`, `CLAUDE.md` y `docs/`. Quedan
  fuera (`.gitignore`): `.claude/settings.local.json`, `.claude/skills/` (skill de
  terceros), `.claude/product-marketing.md` y `CONTENIDO.md` (borradores personales).
- **Bitácora**: Claude redacta un borrador por etapa; fmv agrega o corrige sus
  decisiones con sus palabras antes de unir el PR.

## Lo que queda a criterio del builder

- Estructura de carpetas y componentes de Astro.
- Configuración concreta de Playwright (proyectos, retries, reporter).
- Formato y ubicación de la bitácora y de los charters.
- Cómo verificar que la migración se ve igual al mockup.

## Pendientes de fmv (no bloquean)

- Textos finales del hero y la experiencia (se publica con la v1 y se itera).
