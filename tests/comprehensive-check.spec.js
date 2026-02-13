import { test, expect } from '@playwright/test';

test.describe('Comprehensive Page Error Check', () => {
    test('check all scenes for errors', async ({ page }) => {
        const errors = [];
        const warnings = [];

        // Capture console messages
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();

            if (type === 'error') {
                errors.push({ type: 'console-error', message: text, timestamp: new Date().toISOString() });
            } else if (type === 'warning') {
                warnings.push({ type: 'console-warning', message: text, timestamp: new Date().toISOString() });
            }
        });

        // Capture page errors
        page.on('pageerror', error => {
            errors.push({
                type: 'page-error',
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        });

        console.log('=== STARTING COMPREHENSIVE ERROR CHECK ===');

        // Navigate to the app
        await page.goto('http://localhost:3001');
        console.log('✓ Page loaded');

        // Wait for initial load
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        // Take screenshot of loading screen
        await page.screenshot({
            path: 'test-results/screenshots/00-loading-screen.png',
            fullPage: true
        });
        console.log('✓ Loading screen captured');

        // Wait for loading to complete (Scene 1 should appear)
        await page.waitForTimeout(5000);

        // Scene 1: Entry
        console.log('\n--- Testing Scene 1: Entry ---');
        await page.screenshot({
            path: 'test-results/screenshots/01-scene1-entry.png',
            fullPage: true
        });

        const scene1Text = await page.locator('body').textContent();
        console.log('Scene 1 text content:', scene1Text?.substring(0, 200));

        // Look for buttons in Scene 1
        const scene1Buttons = await page.locator('button').all();
        console.log(`Found ${scene1Buttons.length} buttons in Scene 1`);

        if (scene1Buttons.length > 0) {
            console.log('Clicking button to go to Scene 2...');
            await scene1Buttons[0].click();
            await page.waitForTimeout(3000);

            // Scene 2: Mini Game
            console.log('\n--- Testing Scene 2: Mini Game ---');
            await page.screenshot({
                path: 'test-results/screenshots/02-scene2-minigame.png',
                fullPage: true
            });

            const scene2Text = await page.locator('body').textContent();
            console.log('Scene 2 text content:', scene2Text?.substring(0, 200));

            // Try to interact with the game
            const scene2Buttons = await page.locator('button').all();
            console.log(`Found ${scene2Buttons.length} buttons in Scene 2`);

            // Wait and observe the game
            await page.waitForTimeout(5000);
            await page.screenshot({
                path: 'test-results/screenshots/02b-scene2-after-wait.png',
                fullPage: true
            });

            // Try to progress (might need to collect hearts or click skip)
            const skipButton = page.locator('button:has-text("Skip"), button:has-text("Continue"), button:has-text("Next")');
            const skipCount = await skipButton.count();

            if (skipCount > 0) {
                console.log('Found skip/continue button, clicking...');
                await skipButton.first().click();
                await page.waitForTimeout(3000);

                // Scene 3: Memories
                console.log('\n--- Testing Scene 3: Memories ---');
                await page.screenshot({
                    path: 'test-results/screenshots/03-scene3-memories.png',
                    fullPage: true
                });

                const scene3Text = await page.locator('body').textContent();
                console.log('Scene 3 text content:', scene3Text?.substring(0, 200));

                await page.waitForTimeout(5000);

                // Try to progress to Scene 4
                const scene3Buttons = await page.locator('button').all();
                console.log(`Found ${scene3Buttons.length} buttons in Scene 3`);

                if (scene3Buttons.length > 0) {
                    console.log('Clicking button to go to Scene 4...');
                    await scene3Buttons[scene3Buttons.length - 1].click();
                    await page.waitForTimeout(3000);

                    // Scene 4: Proposal
                    console.log('\n--- Testing Scene 4: Proposal ---');
                    await page.screenshot({
                        path: 'test-results/screenshots/04-scene4-proposal.png',
                        fullPage: true
                    });

                    const scene4Text = await page.locator('body').textContent();
                    console.log('Scene 4 text content:', scene4Text?.substring(0, 200));

                    await page.waitForTimeout(5000);
                    await page.screenshot({
                        path: 'test-results/screenshots/04b-scene4-final.png',
                        fullPage: true
                    });
                }
            }
        }

        // Final error report
        console.log('\n=== ERROR REPORT ===');
        console.log(`Total Errors: ${errors.length}`);
        console.log(`Total Warnings: ${warnings.length}`);

        if (errors.length > 0) {
            console.log('\nERRORS:');
            errors.forEach((err, idx) => {
                console.log(`${idx + 1}. [${err.type}] ${err.message}`);
            });
        }

        if (warnings.length > 0) {
            console.log('\nWARNINGS:');
            warnings.forEach((warn, idx) => {
                console.log(`${idx + 1}. ${warn.message}`);
            });
        }

        // Filter out known non-critical errors
        const criticalErrors = errors.filter(err =>
            !err.message.includes('THREE.WebGLRenderer') &&
            !err.message.includes('DevTools') &&
            !err.message.includes('Download the React DevTools')
        );

        console.log(`\nCritical Errors: ${criticalErrors.length}`);

        // The test passes if there are no critical errors
        expect(criticalErrors.length).toBe(0);
    });
});
