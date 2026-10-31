import { test, expect } from '@playwright/test';

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'solo aplica al viewport de 375px');
});

test('a 375px no hay scroll horizontal', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  const { ancho, viewport } = await page.evaluate(() => ({
    ancho: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(ancho).toBeLessThanOrEqual(viewport);
});

test('a 375px los 4 links del nav se ven y llevan a su sección', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation');
  for (const nombre of ['Home', 'Sobre mí', 'Proyectos', 'Contacto']) {
    await expect(nav.getByRole('link', { name: nombre, exact: true })).toBeInViewport();
  }
  await nav.getByRole('link', { name: 'Contacto', exact: true }).click();
  await expect(page.locator('#contacto h2')).toBeInViewport();
});

test('a 375px el logo y los links del nav se pueden tocar con el dedo (44px)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const links = page.getByRole('navigation').getByRole('link');
  await expect(links).toHaveCount(5);
  for (const link of await links.all()) {
    const box = await link.boundingBox();
    expect(box?.height, await link.innerText()).toBeGreaterThanOrEqual(44);
    expect(box?.width, await link.innerText()).toBeGreaterThanOrEqual(44);
  }
});

test('con movimiento reducido la lluvia Matrix no se muestra', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('canvas#rain')).toHaveCount(1);
  await expect(page.locator('canvas#rain')).toBeHidden();
});
