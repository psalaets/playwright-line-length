import { test, expect } from "@playwright/test";

test.describe('min and max provided', () => {
  test('median is good', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await expect(page.locator('#p1')).toHaveMedianLineLength({min: 60, max: 80});
  });

  test('median too high', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await expect(page.locator('#p1')).not.toHaveMedianLineLength({min: 60, max: 65});
  });

  test('median too low', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await expect(page.locator('#p1')).not.toHaveMedianLineLength({min: 80, max: 95});
  });
});

test.describe('only max provided', () => {
  test('median is good', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await expect(page.locator('#p1')).toHaveMedianLineLength({max: 80});
  });

  test('median too high', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await expect(page.locator('#p1')).not.toHaveMedianLineLength({max: 65});
  });
});

test.describe('only min provided', () => {
  test('median is good', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await expect(page.locator('#p1')).toHaveMedianLineLength({min: 60});
  });

  test('median too low', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await expect(page.locator('#p1')).not.toHaveMedianLineLength({min: 80});
  });
});

test.describe('errors', () => {
  test('empty range object provided', async ({ page }) => {
    await page.goto('http://localhost:8080');

    try {
      await expect(page.locator('#p1')).toHaveMedianLineLength({});
      test.fail();
    } catch(ignored) {}
  });

  test('min > max', async ({ page }) => {
    await page.goto('http://localhost:8080');

    try {
      await expect(page.locator('#p1')).toHaveMedianLineLength({min: 50, max: 40});
      test.fail();
    } catch(ignored) {}
  });

  test('element has no lines', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await expect(page.locator('#p2')).not.toHaveMedianLineLength({min: 0, max: 100});
  });
});
