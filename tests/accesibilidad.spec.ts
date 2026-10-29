import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test('sin violaciones WCAG 2.1 AA serias o críticas', async ({ page }) => {
  await page.goto('/');
  // La lluvia Matrix es decorativa y cambia en cada frame: se apaga para un análisis estable.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Guarda: sin contenido, axe no tendría nada que analizar y el test pasaría vacío.
  await expect(page.locator('#home h1')).toBeVisible();
  await expect(page.locator('#contacto')).toBeAttached();

  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_21_AA).analyze();
  const graves = violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => ({ regla: v.id, impacto: v.impact, nodos: v.nodes.map((n) => n.target.join(' ')) }));

  expect(graves, JSON.stringify(graves, null, 2)).toEqual([]);
});
