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

**Revisión final independiente** (un subagente revisor sin contexto previo, sobre toda la rama)
- Sin hallazgos críticos. Dos importantes, los dos de **calidad de los tests**:
  - Los tests de anclas pasaban aunque se quitara el `scroll-padding-top`, porque el padding de cada sección ya dejaba el título debajo del nav. Ahora miden el borde de la sección.
  - El test de "Contacto activo al final" corría en una pantalla donde la regla normal ya elegía Contacto. Ahora corre a 1920×1200, donde solo la detección de fin de página lo resuelve.
- **Mutation testing a mano:** para probar los tests nuevos se rompió a propósito el código que protegen. Con el código saboteado fallan 12 tests y con el código real pasan los 36.
- En el camino aparecieron dos lecciones más:
  - Un reemplazo automático dejó un selector vacío, y el primer "rojo" fallaba por ese motivo y no por la regresión. Un test en rojo solo vale si falla por la razón correcta.
  - En WebKit la página crece 59px cuando terminan de cargar las fuentes web. Los tests ahora esperan `document.fonts.ready` antes de medir o scrollear.
- Mejoras menores anotadas para una próxima iteración: `aria-current` en el nav, hero dentro de `<main>`, favicon, imagen para compartir en LinkedIn, pausar la lluvia Matrix fuera de pantalla, áreas táctiles más grandes en el nav mobile.

**Resultado:** 36 tests en verde en Chromium, Firefox, WebKit y mobile; axe sin violaciones serias ni críticas; `astro check` sin errores.

**fmv:** _(espacio para tus notas)_

## Etapa 2: exploración con Playwright MCP (2026-10-31)

**Qué se hizo**
- Configuración de Playwright MCP y una prueba real del servidor contra el sitio publicado.
- Una sesión exploratoria con un [charter](qa/charters/2026-10-31-reclutador-mobile.md): un reclutador IT que entra desde el celular.

**Resultado**
- Nada roto y 4 hallazgos de mejora, todos ya conocidos.
- La sesión no probó un celular real: fue Chromium de escritorio con la ventana achicada.

**Decisiones de fmv**
- Pausar la exploración con agentes en este proyecto: usó muchos tokens para una tarea poco útil, aunque sirvió como aprendizaje.
- Sacar el servidor MCP del repo y guardar el charter como registro.

**fmv:** _(espacio para tus notas)_
