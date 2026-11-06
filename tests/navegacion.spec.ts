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

// El sitio fue de una sola página con anclas: los links viejos compartidos tienen que seguir funcionando.
for (const { texto, ruta } of LINKS.slice(1)) {
  const ancla = ruta.replaceAll('/', '');
  test(`el link viejo /#${ancla} redirige a la página de ${texto}`, async ({ page }) => {
    await page.goto(`/#${ancla}`);
    await expect(page).toHaveURL(ruta);
  });
}

for (const ancla of ['home', 'algo']) {
  test(`/#${ancla} se queda en la Home sin redirigir`, async ({ page }) => {
    await page.goto(`/#${ancla}`);
    await page.waitForTimeout(1_000);
    await expect(page).toHaveURL(`/#${ancla}`);
    await expect(page.locator('main h1')).toContainText('Hago QA en sistemas bancarios');
  });
}

test('una página que no existe muestra el 404 con el menú', async ({ page }) => {
  const respuesta = await page.goto('/no-existe/');
  expect(respuesta?.status()).toBe(404);
  await expect(page.locator('main h1')).toHaveText('Esta página no existe');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
});

test('el logo lleva a la Home', async ({ page }) => {
  await page.goto('/proyectos/');
  await page.getByRole('navigation').getByRole('link', { name: 'fmv_' }).click();
  await expect(page).toHaveURL('/');
});

test('con Tab se recorre el nav y los botones de contacto del hero en orden, con foco visible', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'webkit', 'WebKit no enfoca links con Tab por defecto');
  await page.goto('/');

  // Los botones del hero no tienen texto: se identifican por su nombre accesible.
  const esperados = [
    'fmv_',
    ...LINKS.map((l) => l.texto),
    'Escribirme por email',
    'Mi perfil de LinkedIn',
    'Escribirme por WhatsApp',
  ];
  for (const nombre of esperados) {
    await page.keyboard.press('Tab');
    const foco = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return {
        nombre: el.getAttribute('aria-label') ?? el.textContent?.trim(),
        outline: getComputedStyle(el).outlineStyle,
      };
    });
    expect(foco.nombre).toBe(nombre);
    expect(foco.outline).not.toBe('none');
  }
});
