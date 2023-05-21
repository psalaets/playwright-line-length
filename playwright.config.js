import { expect, defineConfig } from '@playwright/test';
import { lineLengthAssertions } from './dist/index.js';

expect.extend(lineLengthAssertions);

export default defineConfig({
  use: {
    headless: true,
  },
  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run serve-test-page',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});
