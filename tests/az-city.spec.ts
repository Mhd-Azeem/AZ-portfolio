import { test, expect } from '@playwright/test';

test.describe('AZ CITY /city/ interactive driving', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/AZ-portfolio/city/');
    await expect(page.locator('#loading')).toHaveCount(0, { timeout: 30000 });
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('preserves portfolio navigation and shows both driving modes', async ({ page }) => {
    await expect(page.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '../');
    await expect(page.getByRole('button', { name: /cinematic tour/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /free drive/i })).toBeVisible();
  });

  test('cinematic tour advances the car and can be stopped', async ({ page }) => {
    const start = Number(await page.locator('body').getAttribute('data-car-z'));
    await page.locator('#tour').click();
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'tour');
    await page.waitForTimeout(1600);
    const next = Number(await page.locator('body').getAttribute('data-car-z'));
    expect(next).toBeLessThan(start);
    await page.locator('#tour').click();
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'free');
  });

  test('keyboard acceleration and free-drive reset work', async ({ page }) => {
    await page.keyboard.down('w');
    await page.waitForTimeout(650);
    const speed = Number(await page.locator('body').getAttribute('data-speed'));
    expect(speed).toBeGreaterThan(0);
    await page.keyboard.up('w');
    await page.locator('#tour').click();
    await page.locator('#free').click();
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'free');
  });

  test('touch controls accept pointer input', async ({ page }) => {
    const accelerate = page.getByRole('button', { name: 'Accelerate' });
    await accelerate.dispatchEvent('pointerdown', { pointerId: 1 });
    await page.waitForTimeout(400);
    expect(Number(await page.locator('body').getAttribute('data-speed'))).toBeGreaterThan(0);
    await accelerate.dispatchEvent('pointerup', { pointerId: 1 });
  });
});
