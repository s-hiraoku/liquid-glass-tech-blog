/**
 * Accessibility E2E Tests
 * WCAG 2.1 AA Compliance Testing
 */

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

interface AccessibilityTestContext {
  page: Page;
  axeBuilder: AxeBuilder;
}

test.describe('Accessibility Tests - WCAG 2.1 AA Compliance', () => {
  let context: AccessibilityTestContext;

  test.beforeEach(async ({ page }) => {
    context = {
      page,
      axeBuilder: new AxeBuilder({ page })
    };
    
    // Configure axe-core for WCAG 2.1 AA
    await context.axeBuilder
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#ads') // Exclude third-party content
      .configure({
        rules: {
          'color-contrast': { enabled: true },
          'focus-order-semantics': { enabled: true },
          'keyboard': { enabled: true }
        }
      });
  });

  test('Homepage should meet WCAG 2.1 AA standards', async () => {
    await context.page.goto('/');
    
    // Wait for liquid glass effects to load
    await context.page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    // Run accessibility scan
    const accessibilityScanResults = await context.axeBuilder.analyze();
    
    // Log violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:');
      accessibilityScanResults.violations.forEach(violation => {
        console.log(`- ${violation.id}: ${violation.description}`);
        violation.nodes.forEach(node => {
          console.log(`  Element: ${node.target.join(', ')}`);
        });
      });
    }
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Blog post page should meet WCAG 2.1 AA standards', async () => {
    // Navigate to a blog post
    await context.page.goto('/posts/mastering-liquid-glass-effects');
    
    // Wait for MDX content to render
    await context.page.waitForSelector('[data-testid="mdx-content"]');
    
    const accessibilityScanResults = await context.axeBuilder.analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Navigation should be keyboard accessible', async () => {
    await context.page.goto('/');
    
    // Test tab navigation
    await context.page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    const firstFocusedElement = await context.page.locator(':focus').first();
    expect(await firstFocusedElement.isVisible()).toBe(true);
    
    // Tab through navigation elements
    const navigationItems = await context.page.locator('nav a, nav button').count();
    
    for (let i = 0; i < navigationItems; i++) {
      const focusedElement = await context.page.locator(':focus');
      expect(await focusedElement.isVisible()).toBe(true);
      
      // Check focus indicator is visible
      const focusBox = await focusedElement.boundingBox();
      expect(focusBox).not.toBeNull();
      
      await context.page.keyboard.press('Tab');
    }
  });

  test('Liquid glass effects should respect prefers-reduced-motion', async () => {
    // Enable reduced motion preference
    await context.page.emulateMedia({ reducedMotion: 'reduce' });
    
    await context.page.goto('/');
    
    // Check that animations are disabled
    const glassCards = context.page.locator('[data-testid="liquid-glass-card"]');
    const cardCount = await glassCards.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = glassCards.nth(i);
      const animationDuration = await card.evaluate(el => 
        getComputedStyle(el).animationDuration
      );
      
      // Should have no animation or very short duration
      expect(animationDuration === '0s' || animationDuration === 'none').toBe(true);
    }
  });

  test('Images should have proper alt text and captions', async () => {
    await context.page.goto('/');
    
    const images = context.page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      const src = await image.getAttribute('src');
      
      // Decorative images can have empty alt, but should be explicitly marked
      if (alt === '') {
        const role = await image.getAttribute('role');
        const ariaHidden = await image.getAttribute('aria-hidden');
        
        expect(role === 'presentation' || ariaHidden === 'true').toBe(true);
      } else {
        // Informative images should have meaningful alt text
        expect(alt).toBeTruthy();
        expect(alt!.length).toBeGreaterThan(0);
        expect(alt!.length).toBeLessThan(150); // Reasonable length limit
        
        // Alt text should not include "image of" or "picture of"
        expect(alt!.toLowerCase()).not.toContain('image of');
        expect(alt!.toLowerCase()).not.toContain('picture of');
      }
    }
  });

  test('Headings should follow proper hierarchy', async () => {
    await context.page.goto('/');
    
    const headings = await context.page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = await Promise.all(
      headings.map(heading => heading.evaluate(el => parseInt(el.tagName.charAt(1))))
    );
    
    // Should have exactly one h1
    const h1Count = headingLevels.filter(level => level === 1).length;
    expect(h1Count).toBe(1);
    
    // Check heading hierarchy (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];
      
      // Should not skip more than one level
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
    }
  });

  test('Form controls should have proper labels', async () => {
    // Test search form
    await context.page.goto('/');
    
    const inputs = context.page.locator('input, select, textarea');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      
      if (id) {
        // Check for associated label
        const label = context.page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        
        expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy();
      } else {
        // Should have aria-label or aria-labelledby
        expect(ariaLabel || ariaLabelledby).toBeTruthy();
      }
    }
  });

  test('Color contrast should meet AA standards', async () => {
    await context.page.goto('/');
    
    // Test specific contrast requirements with axe-core
    const contrastResults = await context.axeBuilder
      .withTags(['wcag2aa'])
      .include('[data-testid="liquid-glass-card"]')
      .analyze();
    
    const contrastViolations = contrastResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });

  test('Liquid glass cards should be accessible to screen readers', async () => {
    await context.page.goto('/');
    
    const glassCards = context.page.locator('[data-testid="liquid-glass-card"]');
    const cardCount = await glassCards.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = glassCards.nth(i);
      
      // Should have accessible name
      const accessibleName = await card.evaluate(el => {
        const computedName = (window as any).getComputedAccessibleName?.(el);
        return computedName || el.textContent?.trim() || el.getAttribute('aria-label');
      });
      
      expect(accessibleName).toBeTruthy();
      
      // Should not interfere with screen reader navigation
      const ariaHidden = await card.getAttribute('aria-hidden');
      expect(ariaHidden).not.toBe('true');
    }
  });

  test('Skip links should be available and functional', async () => {
    await context.page.goto('/');
    
    // Tab to first element (should be skip link)
    await context.page.keyboard.press('Tab');
    
    const focusedElement = context.page.locator(':focus');
    const skipLinkText = await focusedElement.textContent();
    
    // Should be a skip link
    expect(skipLinkText?.toLowerCase()).toContain('skip');
    
    // Should be visually hidden until focused
    const isVisible = await focusedElement.isVisible();
    expect(isVisible).toBe(true);
    
    // Test skip functionality
    await focusedElement.press('Enter');
    
    // Should jump to main content
    const mainContent = context.page.locator('main, [role="main"]');
    await expect(mainContent).toBeFocused();
  });

  test('Error messages should be properly announced', async () => {
    // Test search with no results
    await context.page.goto('/');
    
    const searchInput = context.page.locator('input[type="search"]').first();
    await searchInput.fill('nonexistentquery123');
    await searchInput.press('Enter');
    
    // Should have aria-live region for announcements
    const liveRegion = context.page.locator('[aria-live]');
    await expect(liveRegion).toBeVisible();
    
    // Error message should be announced
    const errorMessage = await liveRegion.textContent();
    expect(errorMessage?.toLowerCase()).toContain('no results');
  });
});

test.describe('Mobile Accessibility', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Mobile navigation should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Find mobile menu button
    const menuButton = page.locator('[aria-label*="menu"], [aria-label*="navigation"]');
    await expect(menuButton).toBeVisible();
    
    // Should have proper ARIA attributes
    const expanded = await menuButton.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
    
    // Open menu
    await menuButton.click();
    
    // Should update aria-expanded
    const expandedAfter = await menuButton.getAttribute('aria-expanded');
    expect(expandedAfter).toBe('true');
    
    // Menu should be visible and accessible
    const mobileMenu = page.locator('[role="menu"], nav ul');
    await expect(mobileMenu).toBeVisible();
    
    // Should be keyboard navigable
    await page.keyboard.press('Tab');
    const focusedLink = page.locator(':focus');
    await expect(focusedLink).toBeVisible();
  });

  test('Touch targets should meet minimum size requirements', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button, a, input[type="submit"]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      
      if (box) {
        // WCAG 2.1 AAA requires 44x44px minimum
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
      }
    }
  });
});