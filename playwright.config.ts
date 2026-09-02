import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1600, height: 900 },
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "firefox-foundation",
      testMatch: /foundation\.spec\.ts/,
      use: { browserName: "firefox" },
    },
    {
      name: "webkit-foundation",
      testMatch: /foundation\.spec\.ts/,
      use: { browserName: "webkit" },
    },
    {
      name: "chromium-foundation-dpr2",
      testMatch: /foundation\.spec\.ts/,
      use: { browserName: "chromium", deviceScaleFactor: 2 },
    },
    {
      name: "chromium-foundation-dpr3",
      testMatch: /foundation\.spec\.ts/,
      use: { browserName: "chromium", deviceScaleFactor: 3 },
    },
    {
      name: "chromium-foundation-forced-colors",
      testMatch: /foundation\.spec\.ts/,
      use: { browserName: "chromium", forcedColors: "active" },
    },
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
