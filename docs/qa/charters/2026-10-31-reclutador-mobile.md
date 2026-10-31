# Charter: recorrido de un reclutador IT en mobile

- **Misión:** explorar https://fvidau.github.io con Playwright MCP para descubrir si un reclutador IT que entra desde el celular encuentra motivos suficientes (y sin fricción) para decidir escribirle a fmv.
- **Fecha y entorno:** 2026-10-31, Chromium (Playwright MCP), viewport 375x812.
- **Riesgo:** si el sitio no comunica rápido la propuesta de valor, tiene fricción táctil o se ve roto en mobile, un reclutador que entra desde el celular abandona antes de llegar al contacto y se pierde una oportunidad de entrevista.

## Notas de la sesión

1. **Carga inicial del hero.** Navegación a `/` en 375x812. Título de pestaña: "fmv · QA Engineer". La consola marca 1 error: `favicon.ico` responde 404. El hero carga completo: foto de perfil, headline ("Hago QA en *sistemas bancarios*, donde un error le cuesta plata a alguien."), bajada y dos CTA ("Coordinemos una entrevista" → `mailto:`, "Ver mi recorrido" → ancla). Evidencia: `evidence/2026-10-31-reclutador-mobile/01-hero.png`.
2. **Scroll horizontal.** Medí `scrollWidth` vs `innerWidth`: 360 vs 375, sin overflow. No hay scroll horizontal en 375px.
3. **Página completa.** Capturé el scroll completo (`02-fullpage.png`) para revisar continuidad visual: Home → Sobre mí (timeline 2022/2024/2026) → Proyectos → Contacto → footer. No encontré huecos ni elementos superpuestos; medí los límites de cada `<section>` con `getBoundingClientRect()` y confirman que el espaciado entre secciones es consistente (~95-120px de padding), no un bug de layout.
4. **Nav fijo y tamaño de toque.** El `<nav>` mide 375x65, fijo (`position: fixed`), y entran los 4 links (`fmv_`, Home, Sobre mí, Proyectos, Contacto) sin amontonarse (`03-nav.png`). Medí cada link: altura de toque real de ~16-21px, sin padding adicional (los `<li>`/`<a>` no tienen padding). Para comparar, las CTA del hero ("Coordinemos una entrevista", "Ver mi recorrido") miden 44px de alto, y los links de contacto (email/LinkedIn/GitHub) miden 343x88px. El nav es notoriamente más chico que el resto de los elementos clicables del sitio.
5. **Navegación por anclas.** Clické "Contacto" en el nav (`#contacto`). El heading de destino queda a 173px del tope, no tapado por el nav fijo (65px de alto). También navegué a `#proyectos`: el link activo se resalta en verde (scrollspy funcionando). Evidencia: `04-anchor-contacto.png`, `05-proyectos.png`.
6. **Sección Proyectos.** Contiene solo un bloque tipo terminal ("$ ls ./proyectos > compilando agentes de IA para QA... > próximamente") y un botón "Ver mi GitHub →". No hay ningún proyecto concreto listado todavía (esto coincide con lo documentado en AGENTS.md como estado actual). Lo anoto igual porque, desde la mirada de un reclutador que busca evidencia de trabajo, es la sección más floja del recorrido.
7. **Links externos.** Verifiqué los 3 links externos (GitHub x2, LinkedIn): los tres usan `target="_blank"` y `rel="noopener noreferrer"` correctamente.
8. **Imagen de perfil.** `foto.png` carga bien (`complete: true`, 319x302 natural, 155x155 mostrado) y tiene `alt="Foto de perfil de fmv"`.
9. **Metadatos para compartir.** `<title>` y `meta description` están completos y describen bien el perfil. `lang="es"` correcto. No encontré `og:image` — si un reclutador comparte el link (WhatsApp, LinkedIn, Slack), la vista previa va a mostrar solo texto, sin la foto de perfil ni una imagen de marca.
10. **Teclado y foco.** Desde una carga fresca de `/`, el primer Tab cae en el logo "fmv_" (orden lógico). El foco visible usa un outline verde sólido de 2px (`rgb(0,255,65)`), con buen contraste sobre el fondo negro. Evidencia: `06-focus-visible.png`.
11. **`prefers-reduced-motion`.** Emulé `reducedMotion: reduce` y recargué: el `<canvas>` de la lluvia Matrix pasa a `display: none` (no se dibuja ningún frame). Respeta la regla del diseño de desactivar la animación.
12. **Lluvia Matrix contenida al hero.** El canvas es `position: absolute` dentro del `<header>` (que mide exactamente el alto de pantalla por `min-h-screen`), no un overlay fijo sobre todo el documento. No pisa el contenido de las secciones siguientes al hacer scroll.
13. **Timeline y pills de tecnologías.** Revisé visualmente el timeline (2022/2024/2026): las fechas, los artículos y las listas de tareas se ven completos. Los pills de tecnologías (`z/OS`, `COBOL`, `JCL`, `DB2`, `SQL`, `Control-M`, `Jira/Xray`, etc.) envuelven en varias líneas sin desbordar el contenedor ni cortarse. Evidencia: `07-timeline-pills.png`, `08-tech-pills.png`.
14. **Imagen vs. headline en el hero.** En mobile la imagen de perfil y el `<h1>` se apilan verticalmente sin superponerse (imagen termina en y=278, headline arranca en y=339).

## Hallazgos

| # | Observación | Evidencia | Decisión de fmv |
|---|---|---|---|
| 1 | Falta `favicon.ico` (404 en consola en cada carga de página). | Mensaje de consola: `Failed to load resource: 404 @ /favicon.ico` | Arreglar |
| 2 | Los links del nav (`Home`, `Sobre mí`, `Proyectos`, `Contacto`) tienen un área de toque de solo ~16-21px de alto, sin padding, muy por debajo de los ~44px de las CTA y los ~88px de los links de contacto. En un celular real esto puede causar toques fallidos o al link vecino. | `03-nav.png` + medición `getBoundingClientRect()` (alto real: 16-21px) | Arreglar |
| 3 | La sección "Proyectos" no muestra ningún proyecto concreto, solo un placeholder "próximamente" y un link al perfil de GitHub. Para la misión (reclutador evaluando si escribir), es el punto más débil del recorrido: no hay evidencia tangible de trabajo más allá del timeline de experiencia. | `05-proyectos.png` | |
| 4 | No hay meta tag `og:image`. Si el link se comparte (WhatsApp/LinkedIn/Slack), la vista previa no incluye imagen, solo título y descripción. | `meta[property="og:image"]` ausente (verificado por JS) | Arreglar |

## Tests propuestos
Uno por cada hallazgo aprobado (1, 2 y 4), en `tests/contenido.spec.ts` y `tests/responsive.spec.ts`. El hallazgo 3 queda sin decisión de fmv.

## Conclusión

**fmv:** usó muchos tokens para una tarea poco útil en este proyecto, al menos por ahora. Sirvió como aprendizaje.

Revisión posterior de la sesión:
- Los 4 hallazgos ya eran conocidos: los hallazgos 1, 2 y 4 estaban en las mejoras menores de la [bitácora](../../bitacora.md) y el placeholder de Proyectos fue una decisión de diseño.
- El ancho medido fue 360px de contenido sobre 375px de ventana, así que esta sesión no comprueba la ausencia de scroll horizontal a 375px. Lo cubre `tests/responsive.spec.ts`.
- La nota 4 habla de 4 links y enumera 5, contando el logo.

## Fuera de alcance
- Dispositivo táctil real (solo se emuló el viewport en Chromium de escritorio vía Playwright; no se probó touch real ni Safari/iOS).
- Throttling de red (3G/4G) para medir tiempos de carga percibidos.
- Auditoría de accesibilidad completa (lector de pantalla, contraste AA/AAA exhaustivo, axe/Lighthouse).
- Comportamiento del cliente de mail real al abrir el `mailto:` (solo se verificó el `href`).
- Orientación landscape en mobile.
- SEO más allá de `title`/`description`/`lang`/Open Graph básico.
