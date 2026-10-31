import { test, expect } from '@playwright/test';

const EMAIL = 'mailto:fvidaurre.qa@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/fvidaurre-qa';
const GITHUB = 'https://github.com/fvidau';

// El contenido es estático: alcanza con verificarlo en un navegador.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'contenido estático, se verifica solo en chromium');
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('metadatos básicos: idioma, título y descripción', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page).toHaveTitle(/fmv/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
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

test('hay un solo h1 y cada sección tiene su título h2', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1);
  for (const id of ['sobre-mi', 'proyectos', 'contacto']) {
    await expect(page.locator(`#${id} h2`)).toHaveCount(1);
  }
});

test('el hero presenta el perfil y lleva a la entrevista', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Hago QA en sistemas bancarios');
  await expect(page.locator('h1 em')).toHaveText('sistemas bancarios');
  await expect(page.getByRole('link', { name: 'Coordinemos una entrevista' })).toHaveAttribute('href', EMAIL);
  await expect(page.getByRole('link', { name: 'Ver mi recorrido' })).toHaveAttribute('href', '#sobre-mi');
});

test('sobre mí cuenta el recorrido y destaca la integración HSBC → Galicia', async ({ page }) => {
  const seccion = page.locator('#sobre-mi');
  await expect(seccion.locator('h2')).toHaveText('De la pantalla del CRM al batch del mainframe');
  await expect(seccion.getByRole('listitem').filter({ hasText: 'ene. 2024' })).toContainText(
    'integración de HSBC con Galicia',
  );
});

test('el recorrido muestra los dos pasos como Analyst y el actual como Engineer', async ({ page }) => {
  await expect(page.locator('#sobre-mi h3')).toHaveText(['QA Engineer', 'QA Analyst', 'QA Analyst']);
});

test('cada paso del recorrido detalla sus tareas', async ({ page }) => {
  const pasos = [
    { periodo: 'jun. 2026 – actualidad', detalle: ['criterios de aceptación verificables', 'SQL sobre DB2', 'Jira/Xray'] },
    { periodo: 'ene. 2024', detalle: ['contratos, payloads e integraciones', 'Parasoft Virtualize', 'code scanning'] },
    { periodo: 'sept. 2022', detalle: ['frontend ↔ servicios ↔ SQL Server', 'pruebas exploratorias', 'HP ALM'] },
  ];
  for (const { periodo, detalle } of pasos) {
    const paso = page.locator('#sobre-mi li').filter({ hasText: periodo });
    await expect(paso.getByRole('list', { name: 'Tareas' }).getByRole('listitem')).not.toHaveCount(0);
    for (const texto of detalle) {
      await expect(paso.getByRole('list', { name: 'Tareas' })).toContainText(texto);
    }
  }
});

test('contacto invita a coordinar una entrevista', async ({ page }) => {
  await expect(page.locator('#contacto h2')).toHaveText('¿Buscás QA para un equipo de banca o fintech?');
});

test('la foto de perfil tiene texto alternativo', async ({ page }) => {
  const foto = page.locator('#home img');
  await expect(foto).toHaveAttribute('alt', /\S+/);
});

test('los links de contacto apuntan a los datos reales', async ({ page }) => {
  const contacto = page.locator('#contacto');
  await expect(contacto.locator(`a[href="${EMAIL}"]`)).toHaveCount(1);
  await expect(contacto.locator(`a[href="${LINKEDIN}"]`)).toHaveCount(1);
  await expect(contacto.locator(`a[href="${GITHUB}"]`)).toHaveCount(1);
  await expect(page.locator('#proyectos').locator(`a[href="${GITHUB}"]`)).toHaveCount(1);
});

test('los links externos se abren en otra pestaña de forma segura', async ({ page }) => {
  const externos = page.locator('a[href^="http"]');
  const total = await externos.count();
  expect(total).toBeGreaterThan(0);
  for (let i = 0; i < total; i++) {
    await expect(externos.nth(i)).toHaveAttribute('target', '_blank');
    await expect(externos.nth(i)).toHaveAttribute('rel', /noopener/);
  }
});

test('no quedan marcadores de contenido pendiente ni datos de ejemplo', async ({ page }) => {
  await expect(page.locator('#contacto')).toBeAttached();
  const html = await page.content();
  expect(html).not.toContain('[NEED');
  expect(html).not.toContain('tu-email@ejemplo.com');
  expect(html).not.toContain('tu-usuario');
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
});
