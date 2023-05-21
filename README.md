# playwright-line-length

Check element line lengths with playwright.

## Install

```
npm install playwright-line-length -D
```

## Add to playwright config

In `playwright.config.js`:

```js
import { expect, defineConfig } from '@playwright/test';
import { lineLengthAssertions } from 'playwright-line-length';

expect.extend(lineLengthAssertions);

export default defineConfig({
  // your usual playwright config properties here
});
```

## Usage

```js
test('check line length', async ({ page }) => {
  await page.goto('https://website.com');

  const article = page.locator('#article-1');
  await expect(article).toHaveMedianLineLength({min: 55, max: 80});
});
```

## API

`expect(locator).toHaveMedianLineLength({min: number, max: number})`

At least one of `min` and `max` are required.

## License

MIT
