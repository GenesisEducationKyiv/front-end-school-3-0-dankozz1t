import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  projects: [
    {
      name: 'playwright',
      testMatch: '**/tests/playwright/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
        screenshot: 'on',
        video: 'retain-on-failure',
        trace: 'on-first-retry'
      }
    },
    {
      name: 'mobile-playwright',
      testMatch: '**/tests/playwright/**/*.spec.ts',
      use: {
        ...devices['iPhone 13'],
        baseURL: 'http://localhost:3000'
      }
    }
  ],

  use: {
    testIdAttribute: 'data-testid',
    
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    
    locale: 'uk-UA',
    timezoneId: 'Europe/Kiev',
    
    extraHTTPHeaders: {
      'Accept-Language': 'uk,en'
    }
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],

  outputDir: 'test-results/',
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },

  expect: {
    toHaveScreenshot: {
      threshold: 0.3
    },
    timeout: 10_000
  }
}); 
