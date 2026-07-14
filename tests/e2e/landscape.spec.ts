import { test, expect } from '@playwright/test';

test('homepage shows four map cards', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: 'Models' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Apps & SaaS' })).toBeVisible();
});

test('navigates to models map and shows timeline', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('link', { name: 'Explore Models' }).click();
  await expect(page).toHaveURL(/\/en\/maps\/models/);
  await expect(page.getByRole('rowheader', { name: 'deepseek' })).toBeVisible();
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
