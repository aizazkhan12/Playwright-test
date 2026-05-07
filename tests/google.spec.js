const { test, expect } = require('@playwright/test');

test.describe('Google.com Tests', () => {

  test('should load Google homepage successfully', async ({ page }) => {
    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle(/Google/);
  });

  test('should display Google search input', async ({ page }) => {
    await page.goto('https://www.google.com');
    const searchBox = page.locator('textarea[name="q"], input[name="q"]');
    await expect(searchBox).toBeVisible();
  });

  test('should perform a search and navigate away from homepage', async ({ page }) => {
    await page.goto('https://www.google.com');
    const searchBox = page.locator('textarea[name="q"], input[name="q"]');
    await searchBox.fill('Playwright testing');
    await searchBox.press('Enter');
    await page.waitForLoadState('domcontentloaded');
    // Google may show CAPTCHA for automated browsers — just verify URL changed from homepage
    const currentURL = page.url();
    expect(currentURL).not.toBe('https://www.google.com/');
    expect(currentURL).toMatch(/google\.com/);
  });

  test('should have Google Search button', async ({ page }) => {
    await page.goto('https://www.google.com');
    // Hover over search box to make buttons visible
    const searchBox = page.locator('textarea[name="q"], input[name="q"]');
    await searchBox.click();
    const searchButton = page.locator('input[value="Google Search"]').first();
    await expect(searchButton).toBeVisible();
  });

  test('should have correct URL', async ({ page }) => {
    await page.goto('https://www.google.com');
    await expect(page).toHaveURL(/google\.com/);
  });

  test('should display Google logo', async ({ page }) => {
    await page.goto('https://www.google.com');
    // Google logo can be SVG, canvas, or img depending on browser/region
    const logo = page.locator('[aria-label="Google"], #lga, #hplogo, svg[height="92"]').first();
    await expect(logo).toBeVisible();
  });

  test('should navigate to Images page', async ({ page }) => {
    await page.goto('https://www.google.com');
    const imagesLink = page.locator('a[href*="imghp"], a:has-text("Images")').first();
    await expect(imagesLink).toBeVisible();
    await imagesLink.click();
    await expect(page).toHaveURL(/google\.com\/imghp|google\.com\/search/);
  });

  test('should show search suggestions on typing', async ({ page }) => {
    await page.goto('https://www.google.com');
    const searchBox = page.locator('textarea[name="q"], input[name="q"]');
    await searchBox.fill('Playwright');
    // Wait for suggestions dropdown
    const suggestions = page.locator('ul[role="listbox"], .erkvQe').first();
    await expect(suggestions).toBeVisible({ timeout: 5000 });
  });

});

//test webhook
