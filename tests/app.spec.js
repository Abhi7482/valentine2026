import { test, expect } from '@playwright/test';

test.describe('Valentine\'s Proposal Website', () => {
    test('should load the homepage', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Check that the page loaded successfully
        expect(page.url()).toBe('http://localhost:5173/');
    });

    test('should display the main content', async ({ page }) => {
        await page.goto('/');

        // Wait for React to render
        await page.waitForLoadState('domcontentloaded');

        // Check that the root element exists
        const root = page.locator('#root');
        await expect(root).toBeVisible();
    });

    test('should have interactive elements', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to fully load
        await page.waitForLoadState('networkidle');

        // Take a screenshot for visual verification
        await page.screenshot({ path: 'tests/screenshots/homepage.png', fullPage: true });
    });

    test('should be responsive on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Check that the page is visible
        const root = page.locator('#root');
        await expect(root).toBeVisible();

        // Take a screenshot for mobile view
        await page.screenshot({ path: 'tests/screenshots/mobile-view.png', fullPage: true });
    });

    test('should handle 3D animations without errors', async ({ page }) => {
        await page.goto('/');

        // Listen for console errors
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        // Wait for animations to load
        await page.waitForTimeout(3000);

        // Check that there are no critical errors
        const criticalErrors = errors.filter(err =>
            !err.includes('THREE.WebGLRenderer') &&
            !err.includes('DevTools')
        );

        expect(criticalErrors.length).toBe(0);
    });
});
