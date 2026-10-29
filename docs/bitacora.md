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
