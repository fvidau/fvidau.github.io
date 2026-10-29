import { test, expect, type Page } from '@playwright/test';

const SECCIONES = [
  { link: 'Home', id: 'home' },
  { link: 'Sobre mí', id: 'sobre-mi' },
  { link: 'Proyectos', id: 'proyectos' },
  { link: 'Contacto', id: 'contacto' },
];

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium', 'cubierto en responsive.spec.ts');
});

async function alturaNav(page: Page) {
  const box = await page.getByRole('navigation').boundingBox();
  return box?.height ?? 0;
}

function tituloDe(page: Page, id: string) {
  return page.locator(`#${id}`).getByRole('heading').first();
}

for (const { link, id } of SECCIONES.slice(1)) {
  test(`el link "${link}" lleva a su sección sin que el nav la tape`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: link, exact: true }).click();

    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    const titulo = tituloDe(page, id);
    await expect(titulo).toBeInViewport();
    const nav = await alturaNav(page);
    await expect.poll(async () => (await titulo.boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(nav);
  });
}

test('el link de la sección visible queda marcado como activo', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation');
  await expect(nav.getByRole('link', { name: 'Home', exact: true })).toContainClass('active');

  await page.locator('#sobre-mi').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.getElementById('sobre-mi')!.offsetTop));
  await expect(nav.getByRole('link', { name: 'Sobre mí', exact: true })).toContainClass('active');
  await expect(nav.getByRole('link', { name: 'Home', exact: true })).not.toContainClass('active');
});

test('al llegar al final de la página "Contacto" queda activo', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(
    page.getByRole('navigation').getByRole('link', { name: 'Contacto', exact: true }),
  ).toContainClass('active');
});

test('entrar directo con #proyectos muestra la sección debajo del nav', async ({ page }) => {
  await page.goto('/#proyectos');
  const titulo = tituloDe(page, 'proyectos');
  await expect(titulo).toBeInViewport();
  const nav = await alturaNav(page);
  await expect.poll(async () => (await titulo.boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(nav);
});

test('con Tab se recorre el logo y los 4 links del nav en orden, con foco visible', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'webkit', 'WebKit no enfoca links con Tab por defecto');
  await page.goto('/');

  const esperados = ['fmv_', ...SECCIONES.map((s) => s.link)];
  for (const texto of esperados) {
    await page.keyboard.press('Tab');
    const foco = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return { texto: el.textContent?.trim(), outline: getComputedStyle(el).outlineStyle };
    });
    expect(foco.texto).toBe(texto);
    expect(foco.outline).not.toBe('none');
  }
});
