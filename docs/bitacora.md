# Bitácora del proceso

Registro de cada etapa: qué hizo la IA (Claude Code) y qué decidió fmv.
Las notas marcadas con **fmv:** son decisiones o comentarios propios.

## Etapa 0: diseño (2026-10-28)

**Qué se hizo**
- Análisis de un portfolio de referencia y de la experiencia en LinkedIn.
- Mockup navegable en HTML (`docs/mockup/index.html`) con el estilo elegido: negro con detalles verde Matrix.
- Primera versión de los textos con una skill de copywriting (reglas: no inventar logros, evitar frases típicas de IA).
- Sesión de brainstorming guiada (skill `superpowers:brainstorming`) que terminó en el [documento de diseño](superpowers/specs/2026-10-28-portfolio-fmv-design.md).
- Un subagente revisor leyó el diseño "como si tuviera que construirlo" y marcó 5 dudas; 3 las resolvió Claude y 2 las respondió fmv.
- [Plan de implementación](superpowers/plans/2026-10-28-portfolio-fmv.md) con la skill `superpowers:writing-plans`.

**Decisiones de fmv**
- Sitio minimalista de una página: Home · Sobre mí · Proyectos · Contacto, sin sección de skills.
- Iniciales `fmv` como marca; negro + verde Matrix; solo español por ahora.
- Proyectos queda como placeholder con link a GitHub.
- Usar el propio portfolio como primer proyecto de QA agéntico y publicarlo en `fvidau.github.io`.
- Publicar con los textos v1 e iterarlos después.

**fmv:** _(espacio para tus notas)_

## Etapa 1: repo, tests, migración, contenido y CI/CD (2026-10-29)

Ejecutado con la skill `superpowers:executing-plans` siguiendo el plan tarea por tarea. fmv delegó la ejecución completa ("crea y avanza todo tú").

**Qué se hizo**
- Repo base con `.gitignore` que deja fuera la configuración local y los borradores personales.
- **Tests primero:** 4 suites de Playwright escritas antes que el sitio. Con la página vacía fallaron 33 tests, como se esperaba.
- Migración del mockup a Astro + Tailwind (un componente por sección, tokens del diseño en `@theme`).
- Comparación visual contra el mockup a 1280px y 375px.
- Contenido v1 y datos de contacto reales.
- Workflows de GitHub Actions: CI en cada PR y deploy a Pages que reutiliza el CI (si los tests fallan, no se publica).

**Hallazgos de QA durante el desarrollo**
- **Tests que pasaban sin probar nada.** Con la página vacía, 4 tests pasaban: verificaban *ausencias* (sin violaciones de axe, sin scroll horizontal, sin `[NEED`, canvas oculto) y una página vacía cumple todo eso. Se les agregó una guarda que exige contenido antes de verificar.
- **Falso positivo en el link activo.** La aserción buscaba `active` con una regex sobre el atributo `class`, y la clase de Tailwind `[&.active]:text-matrix` siempre contiene esa palabra. El test "pasaba" aunque el link no estuviera activo. Se cambió a `toContainClass('active')`, que compara clases exactas.
- **Diferencias con el mockup.** La comparación visual mostró que en el mockup la fecha de cada trabajo es gris (una regla CSS más específica pisaba el verde) y que el título cortaba en otro lugar por el espaciado entre letras. Se igualaron al mockup.
- **Foco de teclado.** El mockup no definía estilo de foco; se agregó un contorno verde visible solo al navegar con teclado.
- WebKit no enfoca links con Tab por defecto, así que el test de teclado se omite en ese navegador.

**Resultado:** 36 tests en verde en Chromium, Firefox, WebKit y mobile; axe sin violaciones serias ni críticas; `astro check` sin errores.

**fmv:** _(espacio para tus notas)_
