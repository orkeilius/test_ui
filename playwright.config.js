import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 10000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
    headless: true
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true
  }
});
