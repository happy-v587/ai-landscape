import { test, expect } from '@playwright/test';

test('homepage shows four map guides', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: 'Models' })).toBeVisible();
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
