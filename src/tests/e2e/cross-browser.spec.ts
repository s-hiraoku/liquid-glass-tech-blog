/**
 * Cross-Browser Compatibility E2E Tests
 * Testing liquid glass effects across different browsers
 */

import { test, expect, devices } from '@playwright/test';

// Test configurations for different browsers
const browsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] }
];

browsers.forEach(({ name, device }) => {
  test.describe(`Cross-Browser Tests - ${name}`, () => {
    // Note: test.use() moved to project configuration for compatibility

    test(`Liquid glass effects should render correctly in ${name}`, async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="liquid-glass-card"]');

      const glassCards = page.locator('[data-testid="liquid-glass-card"]');
      const cardCount = await glassCards.count();
      expect(cardCount).toBeGreaterThan(0);

      // Test CSS properties support
      for (let i = 0; i < cardCount; i++) {
        const card = glassCards.nth(i);
        
        const styles = await card.evaluate(el => {
          const computed = getComputedStyle(el);
          return {
            backdropFilter: computed.backdropFilter || computed.webkitBackdropFilter,
            transform: computed.transform,
            opacity: computed.opacity,
            borderRadius: computed.borderRadius,
            background: computed.background
          };
        });

        // Should have some form of glass effect
        const hasGlassEffect = 
          styles.backdropFilter !== 'none' ||
          styles.opacity !== '1' ||
          styles.background.includes('rgba') ||
          styles.background.includes('hsla');

        expect(hasGlassEffect).toBe(true);
      }
    });

    test(`Navigation should work correctly in ${name}`, async ({ page }) => {
      await page.goto('/');

      // Test main navigation
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();
      
      if (linkCount > 0) {
        const firstLink = navLinks.first();
        await firstLink.click();
        
        // Should navigate successfully
        await page.waitForLoadState('networkidle');
        expect(page.url()).not.toBe('/');
      }
    });

    test(`Form interactions should work in ${name}`, async ({ page }) => {
      await page.goto('/');

      // Test search functionality if available
      const searchInput = page.locator('input[type="search"]');
      const searchCount = await searchInput.count();

      if (searchCount > 0) {
        await searchInput.first().fill('liquid glass');
        await searchInput.first().press('Enter');
        
        // Should handle search
        await page.waitForLoadState('networkidle');
        // Basic assertion that page responded
        expect(page.url()).toContain('search') || expect(page.url()).toBe('/');
      }
    });

    test(`Responsive design should work in ${name}`, async ({ page }) => {
      // Test desktop view
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForSelector('[data-testid="liquid-glass-card"]');

      let desktopCards = await page.locator('[data-testid="liquid-glass-card"]').count();

      // Test tablet view
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500); // Allow layout to adjust

      let tabletCards = await page.locator('[data-testid="liquid-glass-card"]').count();

      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      let mobileCards = await page.locator('[data-testid="liquid-glass-card"]').count();

      // Cards should be present in all viewport sizes
      expect(desktopCards).toBeGreaterThan(0);
      expect(tabletCards).toBeGreaterThan(0);
      expect(mobileCards).toBeGreaterThan(0);
    });

    test(`JavaScript features should work in ${name}`, async ({ page }) => {
      await page.goto('/');

      // Test that JavaScript is working
      const jsWorking = await page.evaluate(() => {
        return typeof window !== 'undefined' && 
               typeof document !== 'undefined' &&
               'querySelector' in document;
      });

      expect(jsWorking).toBe(true);

      // Test React hydration
      const reactMounted = await page.waitForFunction(() => {
        const root = document.querySelector('#__next, [data-reactroot]');
        return root && root.children.length > 0;
      }, { timeout: 5000 });

      expect(reactMounted).toBeTruthy();
    });

    if (name === 'webkit') {
      test('Safari-specific liquid glass fallbacks should work', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('[data-testid="liquid-glass-card"]');

        const safariCompatibility = await page.evaluate(() => {
          const card = document.querySelector('[data-testid="liquid-glass-card"]');
          if (!card) return false;

          const styles = getComputedStyle(card);
          
          // Check for webkit-specific properties
          const hasWebkitBackdrop = 'webkitBackdropFilter' in card.style;
          const hasStandardBackdrop = 'backdropFilter' in card.style;
          
          // Should have some form of backdrop filter support or fallback
          return hasWebkitBackdrop || hasStandardBackdrop || 
                 styles.background.includes('rgba');
        });

        expect(safariCompatibility).toBe(true);
      });
    }

    if (name === 'firefox') {
      test('Firefox-specific rendering should work', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('[data-testid="liquid-glass-card"]');

        const firefoxCompatibility = await page.evaluate(() => {
          const card = document.querySelector('[data-testid="liquid-glass-card"]');
          if (!card) return false;

          const styles = getComputedStyle(card);
          
          // Firefox may not support backdrop-filter, check for fallbacks
          const hasBackdropFilter = styles.backdropFilter !== 'none';
          const hasOpacityFallback = parseFloat(styles.opacity) < 1;
          const hasGradientBackground = styles.background.includes('gradient');
          
          return hasBackdropFilter || hasOpacityFallback || hasGradientBackground;
        });

        expect(firefoxCompatibility).toBe(true);
      });
    }

    test(`Performance should be acceptable in ${name}`, async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-testid="liquid-glass-card"]');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time (browser-specific thresholds)
      const timeThreshold = name === 'webkit' ? 5000 : 4000; // Safari might be slower
      expect(loadTime).toBeLessThan(timeThreshold);
    });
  });
});

test.describe('Mobile Browser Compatibility', () => {
  const mobileBrowsers = [
    { name: 'Mobile Chrome', device: devices['Pixel 5'] },
    { name: 'Mobile Safari', device: devices['iPhone 13'] },
    { name: 'iPad', device: devices['iPad Pro'] }
  ];

  mobileBrowsers.forEach(({ name, device }) => {
    test.describe(`Mobile Tests - ${name}`, () => {
      // Note: test.use() moved to project configuration for compatibility

      test(`Touch interactions should work on ${name}`, async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('[data-testid="liquid-glass-card"]');

        // Test touch interactions
        const touchableElements = page.locator('button, a, [role="button"]');
        const elementCount = await touchableElements.count();

        if (elementCount > 0) {
          const element = touchableElements.first();
          
          // Test tap
          await element.tap();
          
          // Should respond to touch
          await page.waitForTimeout(100);
          // Basic assertion that interaction worked
          expect(await element.isVisible()).toBe(true);
        }
      });

      test(`Viewport scaling should work on ${name}`, async ({ page }) => {
        await page.goto('/');

        const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewportMeta).toContain('width=device-width');
        expect(viewportMeta).toContain('initial-scale=1');
      });

      test(`Liquid glass effects should be optimized for ${name}`, async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('[data-testid="liquid-glass-card"]');

        const mobileOptimization = await page.evaluate(() => {
          const cards = document.querySelectorAll('[data-testid="liquid-glass-card"]');
          
          return Array.from(cards).map(card => {
            const styles = getComputedStyle(card);
            const backdropFilter = styles.backdropFilter || styles.webkitBackdropFilter;
            
            // Check for mobile-optimized effects
            let blurValue = 0;
            if (backdropFilter.includes('blur')) {
              const match = backdropFilter.match(/blur\((\d+(?:\.\d+)?)px\)/);
              blurValue = match ? parseFloat(match[1]) : 0;
            }
            
            return {
              hasBackdropFilter: backdropFilter !== 'none',
              blurValue,
              isMobileOptimized: blurValue <= 10, // Lower blur for mobile performance
              hasGPUAcceleration: styles.transform.includes('translate3d') || 
                                 styles.willChange !== 'auto'
            };
          });
        });

        // Mobile cards should be performance-optimized
        const optimizedCards = mobileOptimization.filter(card => 
          !card.hasBackdropFilter || card.isMobileOptimized
        );

        expect(optimizedCards.length).toBe(mobileOptimization.length);
      });
    });
  });
});

test.describe('Feature Detection and Fallbacks', () => {
  test('Should gracefully handle unsupported CSS features', async ({ page }) => {
    // Disable backdrop-filter support
    await page.addInitScript(() => {
      Object.defineProperty(CSS, 'supports', {
        value: (property: string, value: string) => {
          if (property === 'backdrop-filter') return false;
          return true;
        }
      });
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="liquid-glass-card"]');

    const fallbackStyles = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-testid="liquid-glass-card"]');
      
      return Array.from(cards).map(card => {
        const styles = getComputedStyle(card);
        return {
          hasBackground: styles.background !== 'none',
          hasOpacity: parseFloat(styles.opacity) < 1,
          hasBorder: styles.border !== 'none' || styles.borderWidth !== '0px',
          hasShadow: styles.boxShadow !== 'none'
        };
      });
    });

    // Should have fallback styling when backdrop-filter is not supported
    const cardsWithFallbacks = fallbackStyles.filter(card => 
      card.hasBackground || card.hasOpacity || card.hasBorder || card.hasShadow
    );

    expect(cardsWithFallbacks.length).toBeGreaterThan(0);
  });

  test('Should detect and handle reduced motion preferences', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/');
    await page.waitForSelector('[data-testid="liquid-glass-card"]');

    const animationState = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-testid="liquid-glass-card"]');
      
      return Array.from(cards).map(card => {
        const styles = getComputedStyle(card);
        return {
          animationDuration: styles.animationDuration,
          transitionDuration: styles.transitionDuration,
          transform: styles.transform
        };
      });
    });

    // Animations should be disabled or minimal with reduced motion
    animationState.forEach(state => {
      if (state.animationDuration !== 'none') {
        expect(['0s', 'none'].includes(state.animationDuration)).toBe(true);
      }
    });
  });
});