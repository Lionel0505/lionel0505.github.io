import { expect, test } from '@playwright/test';

test.describe('theme', () => {
  test('follows the OS on first visit and stores nothing', async ({ browser }) => {
    for (const scheme of ['light', 'dark'] as const) {
      const ctx = await browser.newContext({ colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      await expect(page.locator('html')).toHaveAttribute('data-theme-pref', 'system');
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
      await ctx.close();
    }
  });

  test('cycles system -> light -> dark -> system', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme-pref', 'light');
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme-pref', 'dark');
    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme-pref', 'system');
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
  });

  test('persists an explicit choice across reload', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.click('#theme-toggle'); // light
    await page.click('#theme-toggle'); // dark
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await ctx.close();
  });
});
