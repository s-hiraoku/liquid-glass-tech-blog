/**
 * E2E Base Test Class for Liquid Glass Technology Blog
 * 
 * Provides comprehensive E2E testing utilities specifically designed for
 * liquid glass effects, seasonal themes, and performance monitoring.
 */

import { test as base, expect, Page, BrowserContext, Locator } from '@playwright/test';

// Extended test interface for liquid glass testing
export interface LiquidGlassTestOptions {
  theme: 'spring' | 'summer' | 'autumn' | 'winter';
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  deviceType: 'desktop' | 'mobile' | 'tablet';
  glassIntensity: number;
  enableAnimations: boolean;
  performanceMonitoring: boolean;
}

// Visual regression test options
export interface VisualTestOptions {
  threshold: number;
  maxDiffPixels?: number;
  animations?: 'disabled' | 'allow';
  clip?: { x: number; y: number; width: number; height: number };
  fullPage?: boolean;
}

// Performance metrics interface
export interface PerformanceMetrics {
  lcp: number;
  inp: number;
  cls: number;
  glassRenderTime: number;
  frameRate: number;
  memoryUsage: number;
  gpuUsage?: number;
}

// Base test class with liquid glass utilities
export class E2EBaseTest {
  protected page: Page;
  protected context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  // Theme and glass effect utilities
  async setSeasonalTheme(theme: LiquidGlassTestOptions['theme'], timeOfDay: LiquidGlassTestOptions['timeOfDay']) {
    await this.page.evaluate(
      ({ theme, timeOfDay }) => {
        localStorage.setItem('seasonal-theme', JSON.stringify({ theme, timeOfDay }));
        window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme, timeOfDay } }));
      },
      { theme, timeOfDay }
    );
  }

  async setGlassIntensity(intensity: number) {
    await this.page.evaluate(
      (intensity) => {
        localStorage.setItem('glass-intensity', intensity.toString());
        document.documentElement.style.setProperty('--glass-intensity', intensity.toString());
      },
      intensity
    );
  }

  async enableReducedMotion(enabled: boolean = true) {
    await this.page.emulateMedia({ reducedMotion: enabled ? 'reduce' : 'no-preference' });
  }

  async mockGPUCapabilities(highPerformance: boolean = true) {
    await this.page.addInitScript((highPerformance) => {
      // Mock WebGL context for testing glass effects
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, attributes) {
        if (type === 'webgl' || type === 'webgl2') {
          if (!highPerformance) {
            return null; // Simulate no WebGL support
          }
          const context = originalGetContext.call(this, type, attributes);
          if (context) {
            // Mock high-performance GPU
            context.getParameter = function(pname) {
              if (pname === context.MAX_TEXTURE_SIZE) return 4096;
              if (pname === context.MAX_RENDERBUFFER_SIZE) return 4096;
              return originalGetContext.call(this, pname);
            };
          }
          return context;
        }
        return originalGetContext.call(this, type, attributes);
      };
    }, highPerformance);
  }

  // Glass effect testing utilities
  async waitForGlassEffectLoad() {
    // Wait for CSS backdrop-filter to be applied
    await this.page.waitForFunction(() => {
      const glassElements = document.querySelectorAll('[class*="glass"]');
      return Array.from(glassElements).some(el => {
        const style = window.getComputedStyle(el);
        return style.backdropFilter && style.backdropFilter !== 'none';
      });
    });
  }

  async verifyGlassEffect(selector: string) {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible();

    // Check backdrop-filter CSS property
    const backdropFilter = await element.evaluate(el => 
      window.getComputedStyle(el).backdropFilter
    );
    expect(backdropFilter).not.toBe('none');

    // Check glass morphism properties
    const styles = await element.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backdropFilter: computed.backdropFilter,
        backgroundColor: computed.backgroundColor,
        borderRadius: computed.borderRadius,
        border: computed.border,
      };
    });

    expect(styles.backdropFilter).toContain('blur');
    expect(styles.backgroundColor).toMatch(/rgba?\(/);
  }

  async captureGlassEffectScreenshot(name: string, options: VisualTestOptions = { threshold: 0.2 }) {
    // Ensure glass effects are fully loaded
    await this.waitForGlassEffectLoad();
    
    // Wait for any animations to complete
    if (options.animations === 'disabled') {
      await this.page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `
      });
    }

    await this.page.waitForTimeout(500); // Stabilization time

    return await this.page.screenshot({
      fullPage: options.fullPage,
      clip: options.clip,
      animations: options.animations,
    });
  }

  async verifySeasonalThemeApplication(expectedTheme: LiquidGlassTestOptions['theme']) {
    const appliedTheme = await this.page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') ||
             document.body.getAttribute('data-theme') ||
             localStorage.getItem('seasonal-theme');
    });

    expect(appliedTheme).toContain(expectedTheme);

    // Verify theme-specific CSS variables
    const themeVariables = await this.page.evaluate(() => {
      const styles = window.getComputedStyle(document.documentElement);
      return {
        primary: styles.getPropertyValue('--color-primary'),
        background: styles.getPropertyValue('--color-background'),
        glassOpacity: styles.getPropertyValue('--glass-opacity'),
      };
    });

    expect(themeVariables.primary).toBeTruthy();
    expect(themeVariables.background).toBeTruthy();
  }

  // Performance testing utilities
  async startPerformanceMonitoring(): Promise<void> {
    await this.page.addInitScript(() => {
      window.performanceMetrics = {
        marks: [],
        measures: [],
        observations: [],
      };

      // Override performance methods to capture metrics
      const originalMark = performance.mark;
      const originalMeasure = performance.measure;

      performance.mark = function(name) {
        window.performanceMetrics.marks.push({ name, timestamp: Date.now() });
        return originalMark.call(this, name);
      };

      performance.measure = function(name, startMark, endMark) {
        const result = originalMeasure.call(this, name, startMark, endMark);
        window.performanceMetrics.measures.push({
          name,
          duration: result.duration,
          startTime: result.startTime,
        });
        return result;
      };

      // Monitor glass effect rendering performance
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' || entry.entryType === 'measure') {
            window.performanceMetrics.observations.push({
              name: entry.name,
              startTime: entry.startTime,
              duration: entry.duration || 0,
              entryType: entry.entryType,
            });
          }
        }
      });

      observer.observe({ entryTypes: ['paint', 'measure'] });
    });
  }

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint')?.startTime || 0;
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

      // Calculate frame rate
      const frameRate = window.performanceMetrics?.observations?.length 
        ? (window.performanceMetrics.observations.length / (Date.now() - navigation.loadEventStart)) * 1000
        : 60;

      // Estimate memory usage
      const memory = (performance as any).memory;
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0;

      return {
        lcp,
        inp: 0, // INP requires user interaction
        cls: 0, // CLS requires layout shift detection
        glassRenderTime: fcp, // Approximate glass effect render time
        frameRate: Math.min(frameRate, 60),
        memoryUsage,
      };
    });

    return metrics;
  }

  async measureGlassEffectPerformance(selector: string): Promise<number> {
    await this.page.evaluate(() => {
      performance.mark('glass-effect-start');
    });

    await this.verifyGlassEffect(selector);

    const renderTime = await this.page.evaluate(() => {
      performance.mark('glass-effect-end');
      performance.measure('glass-effect-render', 'glass-effect-start', 'glass-effect-end');
      
      const measure = performance.getEntriesByName('glass-effect-render')[0];
      return measure ? measure.duration : 0;
    });

    return renderTime;
  }

  // Interaction testing utilities
  async testGlassElementInteraction(selector: string) {
    const element = this.page.locator(selector);
    
    // Test hover effects
    await element.hover();
    await this.page.waitForTimeout(100);
    
    const hoverStyles = await element.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backdropFilter: styles.backdropFilter,
        transform: styles.transform,
        opacity: styles.opacity,
      };
    });

    // Test click interactions
    await element.click();
    await this.page.waitForTimeout(100);

    const clickStyles = await element.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backdropFilter: styles.backdropFilter,
        transform: styles.transform,
        opacity: styles.opacity,
      };
    });

    return { hoverStyles, clickStyles };
  }

  // Accessibility testing utilities
  async verifyGlassEffectAccessibility(selector: string) {
    const element = this.page.locator(selector);
    
    // Check contrast ratios
    const contrastInfo = await element.evaluate(el => {
      const styles = window.getComputedStyle(el);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;
      
      return { backgroundColor: bgColor, textColor: textColor };
    });

    // Verify keyboard navigation
    await this.page.keyboard.press('Tab');
    await expect(element).toBeFocused();

    // Check ARIA attributes
    const ariaAttributes = await element.evaluate(el => ({
      role: el.getAttribute('role'),
      label: el.getAttribute('aria-label'),
      describedBy: el.getAttribute('aria-describedby'),
    }));

    return { contrastInfo, ariaAttributes };
  }

  // Responsive testing utilities
  async testGlassEffectResponsiveness(selector: string) {
    const viewports = [
      { width: 320, height: 568, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ];

    const results = [];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(500); // Allow layout to stabilize

      const element = this.page.locator(selector);
      const isVisible = await element.isVisible();
      
      if (isVisible) {
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            width: computed.width,
            height: computed.height,
            backdropFilter: computed.backdropFilter,
            fontSize: computed.fontSize,
          };
        });

        results.push({
          viewport: viewport.name,
          visible: isVisible,
          styles,
        });
      }
    }

    return results;
  }

  // Utility methods
  async mockWeatherData(weatherCondition: 'sunny' | 'rainy' | 'cloudy' | 'snowy') {
    await this.page.route('**/api/weather**', async route => {
      const mockData = {
        sunny: { weather: 'sunny', temperature: 25, description: 'Clear sky' },
        rainy: { weather: 'rainy', temperature: 18, description: 'Light rain' },
        cloudy: { weather: 'cloudy', temperature: 20, description: 'Partly cloudy' },
        snowy: { weather: 'snowy', temperature: -2, description: 'Snow' },
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData[weatherCondition]),
      });
    });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForFunction(() => document.readyState === 'complete');
  }

  async cleanup() {
    // Reset any mocked APIs
    await this.page.unrouteAll();
    
    // Clear localStorage
    await this.page.evaluate(() => localStorage.clear());
    
    // Reset viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
  }
}

// Extended Playwright test with liquid glass utilities
export const test = base.extend<{ liquidGlassTest: E2EBaseTest }>({
  liquidGlassTest: async ({ page, context }, use) => {
    const testInstance = new E2EBaseTest(page, context);
    await use(testInstance);
    await testInstance.cleanup();
  },
});

export { expect } from '@playwright/test';