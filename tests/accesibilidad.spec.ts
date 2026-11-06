import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { META, PAGINAS } from './paginas';

const WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

for (const ruta of PAGINAS) {
  test(`${ruta}: sin violaciones WCAG 2.1 AA serias o críticas`, async ({ page }) => {
    await page.goto(ruta);
    // La lluvia Matrix es decorativa y cambia en cada frame: se apaga para un análisis estable.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Guarda: exige el h1 propio de la página, para no analizar una página 404 y pasar en falso.
    await expect(page.locator('main h1')).toHaveText(META[ruta].h1);

    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_21_AA).analyze();
    const graves = violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => ({ regla: v.id, impacto: v.impact, nodos: v.nodes.map((n) => n.target.join(' ')) }));

    expect(graves, JSON.stringify(graves, null, 2)).toEqual([]);
  });
}
