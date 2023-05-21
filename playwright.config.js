import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false
  },
  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run serve-test-page',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});
