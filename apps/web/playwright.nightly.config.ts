import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 1,
  webServer: {
    command: "npm run build && npm run start",
    port: 3000,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "Desktop Chrome",
      testDir: "./tests/desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      testDir: "./tests/mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
