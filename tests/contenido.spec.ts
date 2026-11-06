import { test, expect } from '@playwright/test';
import { META, PAGINAS } from './paginas';

const EMAIL = 'mailto:fvidaurre.qa@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/fvidaurre-qa';
const GITHUB = 'https://github.com/fvidau';
const WHATSAPP = 'https://wa.me/5491127539151';

const ACCIONES_HERO = [
  { nombre: 'Escribirme por email', href: EMAIL, externo: false },
  { nombre: 'Mi perfil de LinkedIn', href: LINKEDIN, externo: true },
  { nombre: 'Escribirme por WhatsApp', href: WHATSAPP, externo: true },
];

// El contenido es estático: alcanza con verificarlo en un navegador.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'contenido estático, se verifica solo en chromium');
});

for (const ruta of PAGINAS) {
  test(`${ruta}: título, descripción, canonical y un solo h1 propios`, async ({ page }) => {
    const { title, description, h1 } = META[ruta];
    await page.goto(ruta);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://fvidau.github.io${ruta}`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveText(h1);
  });

  test(`${ruta}: los links externos se abren en otra pestaña de forma segura`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page.locator('main h1')).toHaveText(META[ruta].h1);
    for (const link of await page.locator('a[href^="http"]').all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test(`${ruta}: no quedan marcadores de contenido pendiente ni datos de ejemplo`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page.locator('main h1')).toHaveText(META[ruta].h1);
    const html = await page.content();
    expect(html).not.toContain('[NEED');
    expect(html).not.toContain('tu-email@ejemplo.com');
    expect(html).not.toContain('tu-usuario');
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
  });
}

test('una URL sin barra final carga la página igual', async ({ page }) => {
  await page.goto('/contacto');
  await expect(page.locator('main h1')).toHaveText(META['/contacto/'].h1);
});

test.describe('home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('el sitio tiene favicon y cargar la página no da errores 404', async ({ page, request }) => {
    const icono = await page.locator('link[rel="icon"]').getAttribute('href');
    expect(icono).toBeTruthy();
    expect((await request.get(icono!)).ok()).toBe(true);

    const fallidas: string[] = [];
    page.on('response', (r) => {
      if (r.status() >= 400) fallidas.push(r.url());
    });
    await page.reload({ waitUntil: 'networkidle' });
    expect(fallidas).toEqual([]);
  });

  test('compartir el link muestra una imagen de 1200x630 con URL absoluta', async ({ page, request }) => {
    const meta = (propiedad: string) => page.locator(`meta[property="${propiedad}"]`);
    await expect(meta('og:image:width')).toHaveAttribute('content', '1200');
    await expect(meta('og:image:height')).toHaveAttribute('content', '630');
    await expect(meta('og:image:alt')).toHaveAttribute('content', /\S+/);

    // Las redes solo aceptan URLs absolutas; el archivo se pide al sitio local porque puede no estar publicado aún.
    const url = new URL((await meta('og:image').getAttribute('content'))!);
    expect(url.origin).toBe('https://fvidau.github.io');
    const imagen = await request.get(url.pathname);
    expect(imagen.ok()).toBe(true);
    expect(imagen.headers()['content-type']).toBe('image/png');
    // El ancho y el alto declarados tienen que ser los reales: se leen del encabezado del PNG.
    const png = await imagen.body();
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });

  test('el hero ofrece contactarme con botones de íconos, sin texto visible', async ({ page }) => {
    await expect(page.locator('h1 em')).toHaveText('sistemas bancarios');
    const hero = page.locator('main');
    for (const { nombre, href, externo } of ACCIONES_HERO) {
      const boton = hero.getByRole('link', { name: nombre, exact: true });
      await expect(boton).toHaveAttribute('href', href);
      await expect(boton).toHaveAttribute('title', nombre);
      expect((await boton.innerText()).trim()).toBe('');
      if (externo) {
        await expect(boton).toHaveAttribute('target', '_blank');
        await expect(boton).toHaveAttribute('rel', /noopener/);
      }
    }
    await expect(hero.getByRole('link', { name: 'Ver mi recorrido' })).toHaveCount(0);
    await expect(hero.getByRole('link', { name: 'Coordinemos una entrevista' })).toHaveCount(0);
  });

  test('la foto de perfil tiene texto alternativo', async ({ page }) => {
    await expect(page.locator('main img')).toHaveAttribute('alt', /\S+/);
  });
});

test.describe('sobre mí', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sobre-mi/');
  });

  test('destaca la integración HSBC → Galicia', async ({ page }) => {
    await expect(page.locator('main li').filter({ hasText: 'ene. 2024' }).first()).toContainText(
      'integración de HSBC con Galicia',
    );
  });

  test('el recorrido muestra los dos pasos como Analyst y el actual como Engineer', async ({ page }) => {
    await expect(page.locator('main h3')).toHaveText(['QA Engineer', 'QA Analyst', 'QA Analyst']);
  });

  test('cada paso del recorrido detalla sus tareas', async ({ page }) => {
    const pasos = [
      { periodo: 'jun. 2026 – actualidad', detalle: ['criterios de aceptación verificables', 'SQL sobre DB2', 'Jira/Xray'] },
      { periodo: 'ene. 2024', detalle: ['contratos, payloads e integraciones', 'Parasoft Virtualize', 'code scanning'] },
      { periodo: 'sept. 2022', detalle: ['frontend ↔ servicios ↔ SQL Server', 'pruebas exploratorias', 'HP ALM'] },
    ];
    for (const { periodo, detalle } of pasos) {
      const paso = page.locator('main li').filter({ hasText: periodo }).first();
      const tareas = paso.getByRole('list', { name: 'Tareas' });
      await expect(tareas.getByRole('listitem')).not.toHaveCount(0);
      for (const texto of detalle) {
        await expect(tareas).toContainText(texto);
      }
    }
  });
});

test('proyectos lleva al GitHub', async ({ page }) => {
  await page.goto('/proyectos/');
  await expect(page.locator(`main a[href="${GITHUB}"]`)).toHaveCount(1);
});

test('proyectos muestra una tarjeta por repo público, con link al repo', async ({ page }) => {
  await page.goto('/proyectos/');
  // Los repos vienen de GitHub en vivo: se verifica la estructura, nunca nombres puntuales salvo el del portfolio.
  const tarjetas = page.locator('main article');
  expect(await tarjetas.count()).toBeGreaterThan(0);
  for (const tarjeta of await tarjetas.all()) {
    const link = tarjeta.getByRole('link').first();
    await expect(link).toHaveAttribute('href', /^https:\/\/github\.com\/fvidau\/[^/]+$/);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
  await expect(page.locator('main article a[href="https://github.com/fvidau/fvidau.github.io"]')).toHaveCount(1);
  const texto = await page.locator('main').innerText();
  expect(texto).not.toMatch(/\bnull\b|\bundefined\b|próximamente/);
});

test('los links de contacto apuntan a los datos reales', async ({ page }) => {
  await page.goto('/contacto/');
  const contacto = page.locator('main');
  await expect(contacto.locator(`a[href="${EMAIL}"]`)).toHaveCount(1);
  await expect(contacto.locator(`a[href="${LINKEDIN}"]`)).toHaveCount(1);
  await expect(contacto.locator(`a[href="${GITHUB}"]`)).toHaveCount(1);
  await expect(contacto.locator(`a[href="${WHATSAPP}"]`)).toHaveCount(1);
});
