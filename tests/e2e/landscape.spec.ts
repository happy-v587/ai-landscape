import { test, expect } from '@playwright/test';

// The pages embed third-party logo images (simpleicons, github avatars, hunter.io).
// Block everything off-origin so tests stay hermetic and never hang on external CDNs.
test.beforeEach(async ({ page }) => {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (!url.startsWith('http://localhost:3000')) return route.abort();
    return route.continue();
  });
});

test('homepage shows all four map sections', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Apps & SaaS' })).toBeVisible();
});

test('homepage links to map pages', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('link', { name: /Models/ }).first().click();
  await expect(page).toHaveURL(/\/en\/maps\/models/);
});

test('switches language', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('link', { name: '中文' }).click();
  await expect(page).toHaveURL(/\/zh/);
});

test('explorer filters entries', async ({ page }) => {
  await page.goto('/en/explore');
  await page.getByRole('textbox', { name: 'Search catalog' }).fill('cursor');
  await expect(page.getByText('Cursor')).toBeVisible();
});
