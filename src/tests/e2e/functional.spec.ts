/**
 * Functional E2E Tests
 * Core functionality and user flows
 */

import { test, expect } from '@playwright/test';

test.describe('Core Functionality', () => {
  test('Should navigate between pages successfully', async ({ page }) => {
    await page.goto('/');
    
    // Test homepage navigation
    await expect(page.locator('h1')).toContainText(/liquid glass/i);
    
    // Navigate to a blog post
    const firstPostLink = page.locator('a[href*="/posts/"]').first();
    if (await firstPostLink.count() > 0) {
      await firstPostLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on a blog post page
      expect(page.url()).toContain('/posts/');
      await expect(page.locator('[data-testid="mdx-content"]')).toBeVisible();
    }
  });

  test('Should handle search functionality', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[type="search"]').first();
    
    if (await searchInput.count() > 0) {
      // Test search functionality
      await searchInput.fill('liquid glass');
      await searchInput.press('Enter');
      
      await page.waitForLoadState('networkidle');
      
      // Should show search results or redirect
      const currentUrl = page.url();
      expect(currentUrl.includes('search') || currentUrl === '/').toBe(true);
    }
  });

  test('Should display blog posts with proper metadata', async ({ page }) => {
    await page.goto('/');
    
    // Wait for blog posts to load
    await page.waitForSelector('[data-testid="blog-post-card"]');
    
    const postCards = page.locator('[data-testid="blog-post-card"]');
    const cardCount = await postCards.count();
    
    expect(cardCount).toBeGreaterThan(0);
    
    // Check first post card has required elements
    const firstCard = postCards.first();
    await expect(firstCard.locator('h3, h2')).toBeVisible(); // Title
    await expect(firstCard.locator('p')).toBeVisible(); // Excerpt
  });

  test('Should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);
    
    // Should show a proper 404 page
    await expect(page.locator('h1')).toContainText(/404|not found/i);
  });
});

test.describe('Liquid Glass Effects', () => {
  test('Should render liquid glass cards correctly', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    const glassCards = page.locator('[data-testid="liquid-glass-card"]');
    const cardCount = await glassCards.count();
    
    expect(cardCount).toBeGreaterThan(0);
    
    // Test visual properties of glass cards
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const card = glassCards.nth(i);
      
      await expect(card).toBeVisible();
      
      // Should have glass-like styling
      const styles = await card.evaluate(el => {
        const computed = getComputedStyle(el);
        return {
          backdropFilter: computed.backdropFilter || computed.webkitBackdropFilter,
          background: computed.background,
          borderRadius: computed.borderRadius,
          opacity: computed.opacity
        };
      });
      
      // Should have some form of glass effect
      const hasGlassEffect = 
        styles.backdropFilter !== 'none' ||
        styles.background.includes('rgba') ||
        parseFloat(styles.opacity) < 1;
      
      expect(hasGlassEffect).toBe(true);
    }
  });

  test('Should handle hover effects on interactive elements', async ({ page }) => {
    await page.goto('/');
    
    const interactiveElements = page.locator('button, a[href]');
    const elementCount = await interactiveElements.count();
    
    if (elementCount > 0) {
      const firstElement = interactiveElements.first();
      
      // Get initial styles
      const initialStyles = await firstElement.evaluate(el => {
        const computed = getComputedStyle(el);
        return {
          transform: computed.transform,
          opacity: computed.opacity,
          background: computed.background
        };
      });
      
      // Hover over element
      await firstElement.hover();
      await page.waitForTimeout(100); // Allow hover transition
      
      // Styles may have changed due to hover effects
      const hoverStyles = await firstElement.evaluate(el => {
        const computed = getComputedStyle(el);
        return {
          transform: computed.transform,
          opacity: computed.opacity,
          background: computed.background
        };
      });
      
      // At least the element should remain visible and functional
      await expect(firstElement).toBeVisible();
    }
  });
});

test.describe('Content Management', () => {
  test('Should display MDX content correctly', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('/posts/mastering-liquid-glass-effects');
    
    // Wait for MDX content to load
    await page.waitForSelector('[data-testid="mdx-content"]', { timeout: 10000 });
    
    const mdxContent = page.locator('[data-testid="mdx-content"]');
    await expect(mdxContent).toBeVisible();
    
    // Should have proper heading structure
    const headings = mdxContent.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Should have paragraphs
    const paragraphs = mdxContent.locator('p');
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(0);
  });

  test('Should handle code blocks with syntax highlighting', async ({ page }) => {
    await page.goto('/posts/mastering-liquid-glass-effects');
    
    await page.waitForSelector('[data-testid="mdx-content"]');
    
    const codeBlocks = page.locator('pre code, [data-testid="code-block"]');
    const codeBlockCount = await codeBlocks.count();
    
    if (codeBlockCount > 0) {
      const firstCodeBlock = codeBlocks.first();
      await expect(firstCodeBlock).toBeVisible();
      
      // Should have syntax highlighting classes
      const hasHighlighting = await firstCodeBlock.evaluate(el => {
        const className = el.className;
        return className.includes('language-') || 
               className.includes('highlight') ||
               el.querySelector('.token') !== null;
      });
      
      expect(hasHighlighting).toBe(true);
    }
  });
});

test.describe('Responsive Behavior', () => {
  test('Should adapt layout for mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    // Should have mobile-appropriate layout
    const navigation = page.locator('nav');
    const isMobileLayout = await navigation.evaluate(el => {
      const computed = getComputedStyle(el);
      const display = computed.display;
      const flexDirection = computed.flexDirection;
      
      return display.includes('flex') || flexDirection === 'column';
    });
    
    expect(isMobileLayout).toBe(true);
  });

  test('Should handle orientation changes', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    const portraitCards = await page.locator('[data-testid="liquid-glass-card"]').count();
    
    // Switch to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500); // Allow layout adjustment
    
    const landscapeCards = await page.locator('[data-testid="liquid-glass-card"]').count();
    
    // Cards should still be visible in both orientations
    expect(portraitCards).toBeGreaterThan(0);
    expect(landscapeCards).toBeGreaterThan(0);
  });
});

test.describe('Error Handling', () => {
  test('Should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/*', route => {
      if (route.request().url().includes('/api/')) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    await page.goto('/');
    
    // Should still load basic content
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Should handle JavaScript errors gracefully', async ({ page }) => {
    const jsErrors: string[] = [];
    
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    // Should not have critical JavaScript errors
    const criticalErrors = jsErrors.filter(error => 
      error.includes('TypeError') || 
      error.includes('ReferenceError') ||
      error.includes('SyntaxError')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('SEO and Metadata', () => {
  test('Should have proper page titles', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toContain('Liquid Glass');
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60);
  });

  test('Should have meta descriptions', async ({ page }) => {
    await page.goto('/');
    
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
    expect(metaDescription!.length).toBeLessThan(160);
  });

  test('Should have Open Graph metadata', async ({ page }) => {
    await page.goto('/');
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
  });
});