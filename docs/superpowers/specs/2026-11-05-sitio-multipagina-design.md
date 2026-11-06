# Diseño: sitio de varias páginas

Reemplaza la decisión "una sola página con scroll" del [diseño original](2026-10-28-portfolio-fmv-design.md). Todo lo demás de ese documento sigue vigente: estilo visual, tono, reglas de contenido, tests y CI/CD.

## Intención y porqué

fmv quiere que el portfolio pueda crecer: mejorar el contenido y, más adelante, sumar curiosidades y exploraciones técnicas del área de QA. Una sola página con scroll no escala: cada sección nueva la alarga, y "Sobre mí" ya ocupa unos 2.700 px de alto en el celular. Con una página por sección, sumar contenido es sumar una página.

## Objetivos

- Cuatro páginas: Home (`/`), Sobre mí (`/sobre-mi/`), Proyectos (`/proyectos/`) y Contacto (`/contacto/`).
- La Home es el hero, con acciones de contacto directas para que un reclutador pueda escribir sin recorrer el sitio.
- Proyectos muestra tarjetas con los repos públicos de GitHub de fvidau.
- Sumar una página nueva en el futuro tiene que ser crear un archivo y agregar una entrada al menú.
- La suite de tests cubre el sitio nuevo con el mismo rigor que el actual.

## No objetivos

- Contenido nuevo de exploraciones técnicas o blog. La estructura lo permite, pero no se escribe ahora.
- Versión en inglés.
- Elegir qué repos mostrar y cómo describirlos: se refina después, con las tarjetas ya funcionando.
- Transiciones animadas entre páginas.

## Anti-objetivos

- Que el diseño visual cambie: colores, tipografías y componentes se ven igual que hoy.
- Inventar textos, logros o descripciones de proyectos.
- Que un fallo de la API de GitHub publique una página de Proyectos vacía o rota.
- Perder cobertura de tests en el cambio.

## Decisiones de fmv

- Actualizar `AGENTS.md` y este diseño para que la regla "una sola página" no vuelva en otra sesión.
- La Home lleva el hero con uno o más links de contacto. fmv delega cuáles según lo que espera el mercado.
- Proyectos: tarjetas con lo que hay en GitHub; después se refina qué se muestra.
- Más clics para el reclutador es aceptable: prioriza que el sitio escale.

## Decisiones de Claude (fmv puede cambiarlas)

| Tema | Decisión | Por qué |
|---|---|---|
| Acciones del hero | Botón principal "Coordinemos una entrevista" (email), botón secundario "LinkedIn" y un link de texto "Ver mi recorrido" a `/sobre-mi/` | Los reclutadores IT trabajan sobre todo con LinkedIn y email. GitHub ya aparece en Proyectos y Contacto |
| CV descargable | No se agrega | Es habitual en el mercado, pero no hay un CV en el repo. Se suma cuando fmv lo provea |
| Origen de las tarjetas | La API pública de GitHub, consultada al construir el sitio | Los repos nuevos aparecen solos en el próximo deploy, sin mantener una lista a mano |
| Qué repos | Públicos, sin forks ni archivados, ordenados por último push | Es "lo que hay en GitHub", sin ruido |
| Si la API falla | El build falla y no se publica nada | Cumple el anti-objetivo de no publicar Proyectos vacío. El sitio anterior queda online |
| Límite de la API | El build usa `GITHUB_TOKEN` en CI; local funciona sin token | Sin token, GitHub permite 60 consultas por hora |
| Datos de cada tarjeta | Nombre, descripción, lenguaje principal, fecha del último cambio y link al repo | Es lo que da la API sin interpretar nada |
| Repos sin descripción | La tarjeta muestra solo nombre, lenguaje y fecha | 4 de los 5 repos no tienen descripción; escribirla en GitHub la suma al sitio sin tocar código |
| Menú | Los mismos 4 links, en un archivo de datos. El activo se marca con `aria-current="page"` al construir, sin JavaScript | Sumar una página es una línea; elimina el script de scroll, que era lo más frágil |
| Nav y footer | Pasan al layout `Base` | Se escriben una vez para todas las páginas |
| URLs | Con barra final (`/sobre-mi/`), igual en local y publicado | Es como GitHub Pages sirve las carpetas; evita redirecciones |
| Links viejos con ancla | `/#contacto` y similares redirigen a su página | El sitio ya está publicado y pueden existir links compartidos |
| Página 404 | Propia, con el menú y un link a la Home | GitHub Pages la sirve sola si existe `404.html` |
| Títulos y descripciones | Uno por página, armado con textos que ya existen en el sitio | Cada link compartido muestra la sección correcta |
| Lluvia Matrix | Solo en la Home, en el hero | Mantiene la regla del diseño original |
| Arreglo del salto al ancla | Se elimina | Sin anclas, ya no hace falta |

## Restricciones

- Astro 7.3.8, Tailwind 4.3.3 y Playwright 1.64.1, sin dependencias nuevas.
- Node 22 en local y en CI.
- Responsive a 375 px sin scroll horizontal, en cada página.
- WCAG 2.1 AA sin violaciones serias ni críticas de axe, en cada página.
- Área táctil de 44 px en el menú, como hoy.
- Respetar `prefers-reduced-motion`.
- Commits chicos, uno por cambio; tests primero, vistos en rojo.

## Qué tienen que cubrir los tests

- Cada link del menú lleva a su página y queda marcado con `aria-current="page"`; ningún otro lo tiene.
- El logo lleva a la Home.
- Teclado: Tab recorre el logo y los links en orden, con foco visible.
- Home: el hero, las tres acciones con su destino correcto y la lluvia Matrix oculta con movimiento reducido.
- Sobre mí, Proyectos y Contacto: el contenido que hoy se verifica, cada uno en su página.
- Proyectos: al menos una tarjeta; cada una tiene nombre y link a `https://github.com/fvidau/<repo>`; el repo del portfolio aparece; ningún fork.
- Cada página: título y descripción propios, un solo `h1`, canonical correcto, sin scroll horizontal a 375 px y sin violaciones serias de axe.
- `/#contacto` termina en `/contacto/`.
- Una URL inexistente muestra la página 404 con el menú.

Como Proyectos depende de datos en vivo, sus tests verifican la estructura y nunca nombres de repos puntuales, salvo el del portfolio.

## Lo que queda para el plan

- Nombres de archivos y componentes nuevos.
- El texto del `h1` de cada página interna: hoy los títulos de sección son `h2` y pasan a ser el `h1` de su página.
- Cómo se reparte la suite entre archivos de test.
