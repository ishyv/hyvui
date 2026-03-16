import { expect, test } from '@playwright/test';

const widths = [280, 320, 375, 480, 640, 768, 1024, 1440];

test('lab frames render (visual)', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });

	await page.goto('/lab', { waitUntil: 'networkidle' });

	// Ensure web fonts settle before taking snapshots.
	await page.evaluate(() => (document as any).fonts?.ready);

	for (const w of widths) {
		const frame = page.locator(`[data-width="${w}"]`);
		await expect(frame).toBeVisible();
		await frame.scrollIntoViewIfNeeded();
		await expect(frame).toHaveScreenshot(`lab-${w}.png`);
	}
});
