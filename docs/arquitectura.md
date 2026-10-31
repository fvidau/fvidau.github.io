# Arquitectura del proyecto

Cómo está construido este portfolio, qué hace cada pieza y por qué se eligió. Los links apuntan a los archivos reales para poder abrirlos mientras se lee.

## 1. El panorama: tres partes que trabajan juntas

```
  COMPUTADORA LOCAL                 GITHUB                         INTERNET
 ┌──────────────────┐   git push   ┌───────────────────────┐   ┌────────────────────┐
 │ Código fuente    │ ───────────► │ Repo                  │   │ fvidau.github.io   │
 │ (Astro + Tail-   │              │   │                   │   │ (HTML + CSS + JS   │
 │  wind)           │              │   ▼                   │   │  estáticos)        │
 │ Tests            │              │ GitHub Actions:       │   └────────────────────┘
 │ (Playwright)     │              │ 1. instala            │            ▲
 └──────────────────┘              │ 2. construye          │            │
                                   │ 3. testea ──falla──► ✋ no publica   │
                                   │ 4. publica ───────────────────────┘
                                   └───────────────────────┘
```

1. **El sitio:** código que se *transforma* en archivos HTML, CSS y JS.
2. **Los tests:** un robot que abre el sitio en navegadores reales y verifica que funcione.
3. **La automatización (CI/CD):** cada cambio subido se construye, se prueba y se publica solo, únicamente si todo pasa.

## 2. El sitio: Astro + Tailwind

### Qué es un "sitio estático" y por qué se eligió

Hay dos grandes tipos de sitios:

- **Dinámicos:** un servidor arma la página en cada visita, por ejemplo consultando una base de datos.
- **Estáticos:** las páginas se arman **una sola vez** al publicar, y el servidor solo entrega archivos ya hechos.

Este portfolio no tiene datos que cambien por usuario, así que es estático. Eso lo hace rápido, gratis de alojar (GitHub Pages solo sirve archivos) y difícil de romper en producción.

### Astro: un "compilador" de páginas

Astro permite escribir el sitio en **componentes** (piezas reutilizables). Al ejecutar `npm run build`, los convierte en un único `index.html` plano dentro de `dist/`.

Un componente `.astro` tiene dos partes. Versión simplificada de [Contacto.astro](../src/components/Contacto.astro):

```astro
---
// PARTE 1: "frontmatter". JavaScript que corre al CONSTRUIR, no en el navegador.
import { contacto } from '../data/contacto';
const canales = [ ... ];
---
<!-- PARTE 2: HTML con datos insertados -->
<section id="contacto">
  {canales.map(({ texto, href }) => <li><a href={href}>{texto}</a></li>)}
</section>
```

El `.map()` recorre la lista y genera un `<li>` por canal. Al navegador del visitante solo llega el HTML resultante.

### La estructura de carpetas

```
src/
├── pages/index.astro      ← LA página. Arma todo juntando componentes
├── layouts/Base.astro     ← El "marco": <head>, metadatos, fuentes
├── components/            ← Una pieza por sección
│   ├── Nav.astro          (+ script del link activo)
│   ├── Hero.astro
│   ├── MatrixRain.astro   (+ script de la animación)
│   ├── SobreMi.astro → usa Timeline.astro
│   ├── Proyectos.astro
│   ├── Contacto.astro
│   └── Footer.astro
├── data/                  ← DATOS separados del diseño
│   ├── experiencia.ts     (los 3 trabajos)
│   └── contacto.ts        (email, LinkedIn, GitHub)
└── styles/global.css      ← Colores y fuentes del diseño
public/foto.png            ← Archivos que se copian tal cual
```

Dos ideas de arquitectura sostienen esta estructura:

- **Separar datos de presentación.** Para sumar un trabajo se edita solo [experiencia.ts](../src/data/experiencia.ts) y el timeline se regenera. El email está definido **una sola vez** en [contacto.ts](../src/data/contacto.ts) y lo usan el hero y la sección de contacto. Este principio se llama *DRY* (Don't Repeat Yourself, "no te repitas").
- **Un componente por responsabilidad.** Si algo falla en el nav, está en `Nav.astro`. Es la misma idea que el Page Object Model en automatización de tests: cada pieza tiene su lugar.

### Tailwind: estilos con clases utilitarias

En el [mockup](mockup/index.html), el CSS estaba en un bloque aparte:

```css
.card { background: #0c110c; border: 1px solid #1a241a; border-radius: 12px; }
```

Con Tailwind, el estilo se escribe directamente en el HTML con clases cortas:

```html
<a class="block rounded-xl border border-line bg-surface p-5">
```

Los colores propios (`line`, `surface`, `matrix`) se definen una sola vez en [global.css](../src/styles/global.css), dentro de `@theme`. Son los **tokens de diseño**: para cambiar el verde alcanza con editar una línea.

### El JavaScript que sí llega al navegador

Casi todo es HTML estático. Solo dos `<script>` corren en el navegador del visitante:

- **[Nav.astro](../src/components/Nav.astro):** escucha el scroll y marca en verde la sección visible.
- **[MatrixRain.astro](../src/components/MatrixRain.astro):** dibuja la lluvia en un `<canvas>` cada 60 ms. No se ejecuta si el usuario pidió reducir el movimiento.

## 3. Los tests: Playwright + axe

### Cómo funciona

[playwright.config.ts](../playwright.config.ts) define:

- **`webServer`:** antes de testear, construye el sitio (`npm run build`) y lo levanta (`npm run preview`) en `localhost:4321`. Se testea **el sitio real construido**, no una simulación.
- **`projects`:** los tests corren en 4 entornos: Chromium (Chrome), Firefox, WebKit (Safari) y un Chromium a 375 px de ancho (celular). Algunas suites se limitan al entorno donde tienen sentido.
- **`trace: 'retain-on-failure'`:** si un test falla, guarda una grabación paso a paso para depurarlo.

### Las 4 suites

| Archivo | Tipo de prueba |
|---|---|
| [navegacion.spec.ts](../tests/navegacion.spec.ts) | Funcional E2E de flujo |
| [contenido.spec.ts](../tests/contenido.spec.ts) | Validación de datos y reglas de contenido |
| [accesibilidad.spec.ts](../tests/accesibilidad.spec.ts) | No funcional (WCAG con axe) |
| [responsive.spec.ts](../tests/responsive.spec.ts) | Compatibilidad entre dispositivos |

**axe-core** es un motor que analiza la página contra reglas de accesibilidad WCAG, como contraste, textos alternativos y jerarquía de títulos. Detecta problemas automatizables, así que no reemplaza una revisión manual.

### Lecciones de QA sobre los propios tests

1. **Tests que pasan sin probar nada.** Con la página vacía, "no hay errores de accesibilidad" pasaba. Solución: una *guarda* que exige que haya contenido antes de verificar.
2. **Falsos positivos.** Buscar `active` en las clases coincidía con una clase de Tailwind que siempre la contiene.
3. **Mutation testing manual.** Para saber si un test protege algo, se rompe el código a propósito y se verifica que falle. Así aparecieron dos tests que no detectaban la regresión que debían cubrir.
4. **Diferencias entre entornos.** WebKit en Linux se comportaba distinto que en Windows (la página crecía al cargar las fuentes). Solo apareció en CI.

## 4. CI/CD: GitHub Actions

Hay dos workflows en [.github/workflows/](../.github/workflows/).

**[ci.yml](../.github/workflows/ci.yml)** corre en cada pull request, en una máquina Linux limpia:

1. Descarga el código.
2. Instala Node 22 y las dependencias (`npm ci` usa las versiones exactas de `package-lock.json`).
3. Chequea los tipos de TypeScript (`astro check`).
4. Instala los 3 navegadores.
5. Corre los tests.
6. Sube el reporte de Playwright como artefacto descargable.

**[deploy.yml](../.github/workflows/deploy.yml)** corre al unir cambios a `main`:

```
test (reutiliza ci.yml) ──pasa──► build (Astro genera dist/) ──► deploy (a GitHub Pages)
        │
      falla ──► se corta todo, el sitio publicado no cambia
```

A eso se suma la **protección de rama**: GitHub no deja unir un PR a `main` si el check de tests no está en verde. Funciona como un *quality gate* de un pipeline corporativo.

**CI** (Integración Continua) significa probar cada cambio automáticamente. **CD** (Despliegue Continuo) significa publicar automáticamente lo que pasó las pruebas.

## 5. Las herramientas de base

| Herramienta | Para qué |
|---|---|
| **Node.js** | Ejecuta JavaScript fuera del navegador. Lo necesitan Astro y Playwright |
| **npm** | Instala librerías. [package.json](../package.json) lista cuáles y sus comandos (`npm run dev`, `npm test`) |
| **package-lock.json** | Fija la versión exacta de todas las dependencias, para que la máquina local y CI usen lo mismo |
| **TypeScript** | JavaScript con tipos. Detecta errores antes de ejecutar |
| **Git** | Historial de cambios. Cada commit es una "foto" con su explicación |
| **GitHub** | Aloja el repo, corre las Actions y sirve el sitio (Pages) |

## 6. El proceso

El trabajo siguió un flujo guiado por las skills de Superpowers en Claude Code:

1. **Brainstorming:** entender qué se quería antes de construir.
2. **Documento de diseño:** qué y por qué, con objetivos y anti-objetivos. Un revisor lo leyó como si tuviera que construirlo, para encontrar huecos.
3. **Plan:** tareas chicas, cada una con sus tests.
4. **TDD** (*Test-Driven Development*, desarrollo guiado por tests): test primero → verlo fallar (RED) → implementar → verlo pasar (GREEN).
5. **Revisión independiente:** un agente sin contexto previo revisó todo.
6. **PR + CI + merge:** el código entra a `main` solo con los tests en verde.

El registro está en el [diseño](superpowers/specs/2026-10-28-portfolio-fmv-design.md), el [plan](superpowers/plans/2026-10-28-portfolio-fmv.md) y la [bitácora](bitacora.md). [AGENTS.md](../AGENTS.md) guarda las reglas del proyecto que lee el agente en cada sesión.

## 7. Aprender haciendo

Ejercicios de menor a mayor:

1. **Ver el sitio en vivo mientras se edita.** Correr `npm run dev`, abrir `localhost:4321` y cambiar un texto en [Hero.astro](../src/components/Hero.astro).
2. **Cambiar datos sin tocar el diseño.** Agregar una tecnología a un trabajo en [experiencia.ts](../src/data/experiencia.ts) y ver aparecer la pill.
3. **Romper un test a propósito.** Cambiar el email en [contacto.ts](../src/data/contacto.ts), correr `npm test` y leer el error. Después abrir el reporte con `npx playwright show-report`.
4. **Explorar un fallo con el trace viewer.** En el reporte, abrir el *trace* de un test fallido: muestra cada paso, el DOM y capturas.
5. **Escribir un test nuevo.** Por ejemplo: "el footer muestra el año actual". Verlo fallar primero.
6. **Hacer un PR propio.** Crear una rama, hacer un cambio chico, abrir el PR y mirar correr el CI en GitHub.
