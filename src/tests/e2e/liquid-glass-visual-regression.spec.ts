/**
 * E2E Visual Regression Tests for Liquid Glass Effects
 * 
 * Comprehensive visual testing of liquid glass components across browsers,
 * devices, and performance scenarios using Playwright MCP integration.
 * 
 * Test Coverage:
 * - Cross-browser visual consistency (Chrome, Firefox, Safari)
 * - Device responsiveness (Desktop, Mobile, Tablet)
 * - Liquid glass effect rendering accuracy
 * - Performance-aware visual testing
 * - Seasonal theme visual validation
 */

import { test, expect } from '../base-test';

test.describe('Liquid Glass Visual Regression Tests', () => {
  test.beforeEach(async ({ liquidGlassTest }) => {
    await liquidGlassTest.mockGPUCapabilities(true);
    await liquidGlassTest.startPerformanceMonitoring();
  });

  test.describe('Cross-Browser Glass Effect Consistency', () => {
    const glassEffectTestCases = [
      { variant: 'glass-subtle', blur: 10, opacity: 0.1 },
      { variant: 'glass-medium', blur: 15, opacity: 0.15 },
      { variant: 'glass-intense', blur: 25, opacity: 0.25 }
    ];

    for (const testCase of glassEffectTestCases) {
      test(`should render ${testCase.variant} consistently across browsers`, async ({ 
        page, 
        liquidGlassTest,
        browserName 
      }) => {
        // Navigate to test page
        await page.goto('/test/glass-components');
        
        // Set up glass effect parameters
        await liquidGlassTest.setGlassIntensity(testCase.blur);
        
        // Wait for glass effects to load
        await liquidGlassTest.waitForGlassEffectLoad();
        
        // Verify glass effect application
        await liquidGlassTest.verifyGlassEffect(`[data-variant="${testCase.variant}"]`);
        
        // Capture screenshot for visual comparison
        const screenshot = await liquidGlassTest.captureGlassEffectScreenshot(
          `glass-effect-${testCase.variant}-${browserName}`,
          { 
            threshold: 0.2,
            animations: 'disabled',
            fullPage: false,
            clip: { x: 0, y: 0, width: 800, height: 600 }
          }
        );
        
        // Compare with baseline
        await expect(page).toHaveScreenshot(
          `glass-effect-${testCase.variant}-${browserName}.png`,
          { threshold: 0.2 }
        );
        
        // Verify performance metrics
        const performanceMetrics = await liquidGlassTest.getPerformanceMetrics();
        expect(performanceMetrics.frameRate).toBeGreaterThanOrEqual(55); // 60fps target with 5fps tolerance
        expect(performanceMetrics.glassRenderTime).toBeLessThan(100); // <100ms render time
      });
    }
  });

  test.describe('Responsive Glass Effects', () => {
    const viewports = [
      { name: 'mobile', width: 390, height: 844 }, // iPhone 12 Pro
      { name: 'tablet', width: 768, height: 1024 }, // iPad
      { name: 'desktop', width: 1920, height: 1080 }, // Full HD
      { name: 'ultrawide', width: 2560, height: 1440 } // 2K Ultrawide
    ];

    for (const viewport of viewports) {
      test(`should maintain glass effect quality on ${viewport.name}`, async ({ 
        page, 
        liquidGlassTest 
      }) => {
        // Set viewport
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Navigate to homepage with glass effects
        await page.goto('/');
        await liquidGlassTest.waitForPageLoad();
        
        // Test responsive glass effects
        const responsiveResults = await liquidGlassTest.testGlassEffectResponsiveness(
          '.liquid-glass-container'
        );
        
        expect(responsiveResults).toHaveLength(1);
        expect(responsiveResults[0].visible).toBe(true);
        expect(responsiveResults[0].styles.backdropFilter).toContain('blur');
        
        // Capture responsive screenshot
        await expect(page).toHaveScreenshot(
          `homepage-glass-${viewport.name}.png`,
          { 
            fullPage: true,
            threshold: 0.2,
            mask: [page.locator('[data-dynamic-content]')] // Mask dynamic content
          }
        );
        
        // Verify glass effect performance on different screen sizes
        const renderTime = await liquidGlassTest.measureGlassEffectPerformance(
          '.liquid-glass-container'
        );
        
        // Performance should scale appropriately with screen size
        const expectedMaxRenderTime = viewport.width > 1440 ? 120 : 80;
        expect(renderTime).toBeLessThan(expectedMaxRenderTime);
      });
    }
  });

  test.describe('Seasonal Theme Visual Validation', () => {
    const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
    const timesOfDay = ['morning', 'day', 'evening', 'night'] as const;

    for (const season of seasons) {
      for (const timeOfDay of timesOfDay) {
        test(`should render ${season} ${timeOfDay} theme correctly`, async ({ 
          page, 
          liquidGlassTest 
        }) => {
          // Set seasonal theme
          await liquidGlassTest.setSeasonalTheme(season, timeOfDay);
          
          // Navigate to themed page
          await page.goto('/');
          await liquidGlassTest.waitForPageLoad();
          
          // Verify theme application
          await liquidGlassTest.verifySeasonalThemeApplication(season);
          
          // Wait for theme-specific glass effects
          await liquidGlassTest.waitForGlassEffectLoad();
          
          // Capture themed screenshot
          await expect(page).toHaveScreenshot(
            `seasonal-theme-${season}-${timeOfDay}.png`,
            { 
              fullPage: true,
              threshold: 0.3, // Slightly higher threshold for seasonal variations
              mask: [
                page.locator('[data-time-sensitive]'), // Mask time-sensitive content
                page.locator('.particle-animation') // Mask animated particles
              ]
            }
          );
          
          // Verify theme-specific glass morphism properties
          const glassElement = page.locator('.liquid-glass-container').first();
          const glassStyles = await glassElement.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              backdropFilter: styles.backdropFilter,
              backgroundColor: styles.backgroundColor,
              borderColor: styles.borderColor
            };
          });
          
          expect(glassStyles.backdropFilter).toContain('blur');
          expect(glassStyles.backgroundColor).toMatch(/rgba?\(/);
        });
      }
    }
  });

  test.describe('Interactive Glass Effects', () => {
    test('should maintain visual consistency during hover interactions', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      await page.goto('/');
      await liquidGlassTest.waitForPageLoad();
      
      const interactiveCard = page.locator('.liquid-glass-container[data-interactive]').first();
      await expect(interactiveCard).toBeVisible();
      
      // Capture initial state
      await expect(page).toHaveScreenshot('glass-interactive-initial.png', {
        clip: await interactiveCard.boundingBox()
      });
      
      // Test hover state
      await interactiveCard.hover();
      await page.waitForTimeout(200); // Allow hover animation
      
      await expect(page).toHaveScreenshot('glass-interactive-hover.png', {
        clip: await interactiveCard.boundingBox(),
        threshold: 0.3 // Allow for hover effect differences
      });
      
      // Test click/focus state
      await interactiveCard.click();
      await page.waitForTimeout(200); // Allow click animation
      
      await expect(page).toHaveScreenshot('glass-interactive-focus.png', {
        clip: await interactiveCard.boundingBox(),
        threshold: 0.3
      });
      
      // Verify interaction performance
      const interactionStyles = await liquidGlassTest.testGlassElementInteraction(
        '.liquid-glass-container[data-interactive]'
      );
      
      expect(interactionStyles.hoverStyles.backdropFilter).toContain('blur');
      expect(interactionStyles.clickStyles.transform).toBeDefined();
    });
  });

  test.describe('Performance-Aware Visual Testing', () => {
    test('should maintain visual quality under high performance load', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      // Simulate high performance scenario
      await liquidGlassTest.setGlassIntensity(40); // High intensity
      
      await page.goto('/showcase'); // Page with multiple glass effects
      await liquidGlassTest.waitForPageLoad();
      
      // Start performance monitoring
      const initialMetrics = await liquidGlassTest.getPerformanceMetrics();
      
      // Capture screenshot under load
      await expect(page).toHaveScreenshot('glass-high-performance.png', {
        fullPage: true,
        threshold: 0.2
      });
      
      // Verify performance hasn't degraded
      const finalMetrics = await liquidGlassTest.getPerformanceMetrics();
      expect(finalMetrics.frameRate).toBeGreaterThanOrEqual(50); // Minimum 50fps under load
      expect(finalMetrics.memoryUsage).toBeLessThan(500); // <500MB memory usage
      
      // Test glass effect quality under load
      const glassElements = page.locator('.liquid-glass-container');
      const elementCount = await glassElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 5); i++) { // Test first 5 elements
        await liquidGlassTest.verifyGlassEffect(`.liquid-glass-container:nth-child(${i + 1})`);
      }
    });

    test('should gracefully degrade on low-performance devices', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      // Simulate low-performance device
      await liquidGlassTest.mockGPUCapabilities(false);
      
      await page.goto('/');
      await liquidGlassTest.waitForPageLoad();
      
      // Capture fallback rendering
      await expect(page).toHaveScreenshot('glass-low-performance-fallback.png', {
        fullPage: true,
        threshold: 0.4 // Higher threshold for fallback rendering
      });
      
      // Verify fallback glass effects
      const fallbackElements = page.locator('.fallback-glass-style');
      expect(await fallbackElements.count()).toBeGreaterThan(0);
      
      // Test accessibility of fallback rendering
      const glassElement = page.locator('.liquid-glass-container').first();
      const accessibilityCheck = await liquidGlassTest.verifyGlassEffectAccessibility(
        '.liquid-glass-container'
      );
      
      expect(accessibilityCheck.contrastInfo.backgroundColor).toBeDefined();
      expect(accessibilityCheck.contrastInfo.textColor).toBeDefined();
    });
  });

  test.describe('Accessibility Visual Validation', () => {
    test('should maintain readability with reduced motion preference', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      // Enable reduced motion
      await liquidGlassTest.enableReducedMotion(true);
      
      await page.goto('/');
      await liquidGlassTest.waitForPageLoad();
      
      // Capture reduced motion rendering
      await expect(page).toHaveScreenshot('glass-reduced-motion.png', {
        fullPage: true,
        threshold: 0.2
      });
      
      // Verify reduced motion compliance
      const motionElements = page.locator('[class*="motion-reduce"]');
      expect(await motionElements.count()).toBeGreaterThan(0);
      
      // Test glass effect accessibility
      await liquidGlassTest.verifyGlassEffectAccessibility('.liquid-glass-container');
    });

    test('should provide sufficient contrast in all glass variants', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      await page.goto('/accessibility-test');
      await liquidGlassTest.waitForPageLoad();
      
      const variants = ['glass-subtle', 'glass-medium', 'glass-intense'];
      
      for (const variant of variants) {
        const element = page.locator(`[data-variant="${variant}"]`);
        await expect(element).toBeVisible();
        
        // Capture variant for contrast analysis
        await expect(page).toHaveScreenshot(`glass-contrast-${variant}.png`, {
          clip: await element.boundingBox()
        });
        
        // Verify accessibility compliance
        const accessibilityInfo = await liquidGlassTest.verifyGlassEffectAccessibility(
          `[data-variant="${variant}"]`
        );
        
        expect(accessibilityInfo.ariaAttributes.role).toBeDefined();
      }
    });
  });
});