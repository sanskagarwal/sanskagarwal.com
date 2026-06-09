import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.A11Y_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    reporter: process.env.CI ? "github" : "list",
    use: {
        baseURL,
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
    },
});
