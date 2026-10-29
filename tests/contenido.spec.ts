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
  await expect(seccion.getByRole('listitem').filter({ hasText: 'QA Engineer' })).toContainText(
    'integración de HSBC con Galicia',
  );
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
