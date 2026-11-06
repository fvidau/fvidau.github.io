import { test, expect } from '@playwright/test';

const LINKS = [
  { texto: 'Home', ruta: '/' },
  { texto: 'Sobre mí', ruta: '/sobre-mi/' },
  { texto: 'Proyectos', ruta: '/proyectos/' },
  { texto: 'Contacto', ruta: '/contacto/' },
];

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium', 'cubierto en responsive.spec.ts');
});

for (const { texto, ruta } of LINKS) {
  test(`el link "${texto}" lleva a su página y queda como página actual`, async ({ page }) => {
    // Se arranca desde otra página para que el clic realmente navegue.
    await page.goto(ruta === '/contacto/' ? '/' : '/contacto/');
    const nav = page.getByRole('navigation');
    await nav.getByRole('link', { name: texto, exact: true }).click();

    await expect(page).toHaveURL(ruta);
    await expect(nav.getByRole('link', { name: texto, exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(nav.locator('a[aria-current]')).toHaveCount(1);
  });
}

test('el logo lleva a la Home', async ({ page }) => {
  await page.goto('/proyectos/');
  await page.getByRole('navigation').getByRole('link', { name: 'fmv_' }).click();
  await expect(page).toHaveURL('/');
});

test('con Tab se recorre el logo y los 4 links del nav en orden, con foco visible', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'webkit', 'WebKit no enfoca links con Tab por defecto');
  await page.goto('/');

  const esperados = ['fmv_', ...LINKS.map((l) => l.texto)];
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
