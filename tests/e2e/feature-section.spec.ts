import { test, expect } from '@playwright/test';

test('gia-on-laptop.png is visible in the feature section', async ({
  page,
}) => {
  await page.goto('/');

  const img = page.locator('section img[alt="GIA on Laptop"]');

  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute('src', '/features/gia-on-laptop.png');

  const response = await page.request.get('/features/gia-on-laptop.png');
  expect(response.status()).toBe(200);
});
