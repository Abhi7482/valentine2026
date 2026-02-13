import { test, expect } from '@playwright/test';

test.describe('Valentine\'s App Interactive Test', () => {
    test('explore the Valentine\'s proposal journey', async ({ page }) => {
        // Navigate to the app
        await page.goto('http://localhost:5173');

        // Wait for the page to load
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000); // Give time for animations to start

        // Take initial screenshot
        await page.screenshot({
            path: 'test-results/screenshots/01-initial-load.png',
            fullPage: true
        });

        console.log('Page loaded successfully');

        // Look for any buttons or clickable elements
        const buttons = await page.locator('button').all();
        console.log(`Found ${buttons.length} buttons on the page`);

        // Look for any text content
        const bodyText = await page.locator('body').textContent();
        console.log('Page text content:', bodyText?.substring(0, 200));

        // Wait a bit to see animations
        await page.waitForTimeout(3000);

        // Take screenshot after animations
        await page.screenshot({
            path: 'test-results/screenshots/02-after-animations.png',
            fullPage: true
        });

        // Try clicking the first button if it exists
        if (buttons.length > 0) {
            console.log('Clicking first button...');
            await buttons[0].click();
            await page.waitForTimeout(2000);

            await page.screenshot({
                path: 'test-results/screenshots/03-after-first-click.png',
                fullPage: true
            });
        }

        // Look for any input fields or interactive elements
        const inputs = await page.locator('input').all();
        console.log(`Found ${inputs.length} input fields`);

        // Test mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: 'test-results/screenshots/04-mobile-view.png',
            fullPage: true
        });

        console.log('Interactive test completed successfully!');
    });
});
