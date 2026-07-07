import { test, expect } from '@playwright/test';

test('page loads and shows calculator', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.calculator')).toBeVisible();
  await expect(page.locator('.current')).toHaveText('0');
});

test('number buttons update display', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '7' }).click();
  await page.getByRole('button', { name: '8' }).click();
  await expect(page.locator('.current')).toHaveText('78');
});

test('decimal point works', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '3' }).click();
  await page.getByRole('button', { name: '.' }).click();
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: '4' }).click();
  await expect(page.locator('.current')).toHaveText('3.14');
});

test('AC clears everything', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '5' }).click();
  await page.getByRole('button', { name: '6' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: 'AC' }).click();
  await expect(page.locator('.current')).toHaveText('0');
  await expect(page.locator('.history')).toHaveText('');
});

test('C clears current value only', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '9' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: 'C', exact: true }).click();
  await expect(page.locator('.current')).toHaveText('0');
  // history keeps the pending operation
  await expect(page.locator('.history')).toHaveText('9 +');
});

test('operator sets history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '4' }).click();
  await page.getByRole('button', { name: '×' }).click();
  await expect(page.locator('.history')).toHaveText('4 ×');
});

test('error shown when backend is down', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '2' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: '3' }).click();
  await page.getByRole('button', { name: '=' }).click();
  await expect(page.locator('.error')).toBeVisible();
  await expect(page.locator('.error')).toHaveText('Calculation failed. Is backend running?');
  await expect(page.locator('.current')).toHaveText('Error');
});
