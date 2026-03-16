import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	reporter: [['list']],
	use: {
		baseURL: 'http://127.0.0.1:4173',
		viewport: { width: 1600, height: 900 }
	},
	webServer: {
		command: 'npm run preview -- --host 127.0.0.1 --port 4173',
		port: 4173,
		reuseExistingServer: !process.env.CI
	}
});
