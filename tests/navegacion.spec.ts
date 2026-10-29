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

// Borde superior de la sección respecto del viewport.
function bordeSuperior(page: Page, id: string) {
  return page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top);
}

function alFinalDeLaPagina(page: Page) {
  return page.evaluate(() => innerHeight + scrollY >= document.documentElement.scrollHeight - 2);
}

// Las fuentes web cambian la altura de la página al cargar: hay que esperarlas antes de medir o scrollear.
async function abrir(page: Page, ruta = '/') {
  await page.goto(ruta);
  await page.evaluate(() => document.fonts.ready);
}

// La sección tiene que quedar justo debajo del nav: ni tapada ni con un salto de más.
// Comprueba el scroll-padding-top; con smooth scroll espera a que el movimiento termine.
// La última sección puede no llegar arriba porque la página se termina antes: ahí alcanza con llegar al final.
async function esperarSeccionBajoNav(page: Page, id: string) {
  const nav = await alturaNav(page);
  await expect
    .poll(async () => (await bordeSuperior(page, id)) <= nav + 16 || (await alFinalDeLaPagina(page)))
    .toBe(true);
  expect(await bordeSuperior(page, id)).toBeGreaterThanOrEqual(nav - 1);
}

for (const { link, id } of SECCIONES.slice(1)) {
  test(`el link "${link}" lleva a su sección sin que el nav la tape`, async ({ page }) => {
    await abrir(page);
    await page.getByRole('navigation').getByRole('link', { name: link, exact: true }).click();

    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await esperarSeccionBajoNav(page, id);
  });
}

test('el link de la sección visible queda marcado como activo', async ({ page }) => {
  await abrir(page);
  const nav = page.getByRole('navigation');
  await expect(nav.getByRole('link', { name: 'Home', exact: true })).toContainClass('active');

  await page.evaluate(() => window.scrollTo(0, document.getElementById('sobre-mi')!.offsetTop));
  await expect(nav.getByRole('link', { name: 'Sobre mí', exact: true })).toContainClass('active');
  await expect(nav.getByRole('link', { name: 'Home', exact: true })).not.toContainClass('active');
});

test.describe('en una pantalla grande', () => {
  // A 1920x1200 la regla del 40% de la pantalla elige "Proyectos" al final de la página:
  // solo la detección de fin de página marca "Contacto".
  test.use({ viewport: { width: 1920, height: 1200 } });

  test('al llegar al final de la página "Contacto" queda activo', async ({ page }) => {
    await abrir(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(
      page.getByRole('navigation').getByRole('link', { name: 'Contacto', exact: true }),
    ).toContainClass('active');
  });
});

test('entrar directo con #proyectos muestra la sección debajo del nav', async ({ page }) => {
  await abrir(page, '/#proyectos');
  await esperarSeccionBajoNav(page, 'proyectos');
});

test('con Tab se recorre el logo y los 4 links del nav en orden, con foco visible', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'webkit', 'WebKit no enfoca links con Tab por defecto');
  await abrir(page);

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
