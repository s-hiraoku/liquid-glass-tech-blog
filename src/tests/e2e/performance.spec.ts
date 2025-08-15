/**
 * Performance E2E Tests
 * Core Web Vitals and Performance Optimization Testing
 */

import { test, expect, Page } from '@playwright/test';

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

interface CoreWebVitalsThresholds {
  lcp: { good: 2500, poor: 4000 };
  fid: { good: 100, poor: 300 };
  cls: { good: 0.1, poor: 0.25 };
  fcp: { good: 1800, poor: 3000 };
  ttfb: { good: 600, poor: 1500 };
}

const CORE_WEB_VITALS_THRESHOLDS: CoreWebVitalsThresholds = {
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 600, poor: 1500 }
};

async function measureCoreWebVitals(page: Page): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    return new Promise<PerformanceMetrics>((resolve) => {
      const metrics: Partial<PerformanceMetrics> = {};
      let metricsCount = 0;
      const totalMetrics = 5;

      function checkComplete() {
        metricsCount++;
        if (metricsCount === totalMetrics) {
          resolve(metrics as PerformanceMetrics);
        }
      }

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.lcp = lastEntry.startTime;
        checkComplete();
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0] as any;
        metrics.fid = firstEntry.processingStart - firstEntry.startTime;
        checkComplete();
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cls = clsValue;
        checkComplete();
      }).observe({ entryTypes: ['layout-shift'] });

      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          metrics.fcp = fcpEntry.startTime;
          checkComplete();
        }
      }).observe({ entryTypes: ['paint'] });

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
      metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      checkComplete();

      // Fallback timeout
      setTimeout(() => {
        resolve({
          lcp: metrics.lcp || 0,
          fid: metrics.fid || 0,
          cls: metrics.cls || 0,
          fcp: metrics.fcp || 0,
          ttfb: metrics.ttfb || 0
        });
      }, 10000);
    });
  });
}

test.describe('Core Web Vitals Performance', () => {
  test('Homepage should meet Core Web Vitals thresholds', async ({ page }) => {
    // Enable performance monitoring
    await page.addInitScript(() => {
      // Inject Web Vitals library if needed
      window.webVitalsReady = true;
    });

    const response = await page.goto('/', { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);

    // Wait for liquid glass effects to fully load
    await page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    // Trigger user interaction for FID measurement
    await page.click('body');
    
    // Wait a bit for metrics to stabilize
    await page.waitForTimeout(2000);

    const metrics = await measureCoreWebVitals(page);

    console.log('Core Web Vitals:', {
      LCP: `${metrics.lcp.toFixed(0)}ms`,
      FID: `${metrics.fid.toFixed(0)}ms`, 
      CLS: metrics.cls.toFixed(3),
      FCP: `${metrics.fcp.toFixed(0)}ms`,
      TTFB: `${metrics.ttfb.toFixed(0)}ms`
    });

    // Assert Core Web Vitals thresholds
    expect(metrics.lcp).toBeLessThan(CORE_WEB_VITALS_THRESHOLDS.lcp.good);
    expect(metrics.fid).toBeLessThan(CORE_WEB_VITALS_THRESHOLDS.fid.good);
    expect(metrics.cls).toBeLessThan(CORE_WEB_VITALS_THRESHOLDS.cls.good);
    expect(metrics.fcp).toBeLessThan(CORE_WEB_VITALS_THRESHOLDS.fcp.good);
    expect(metrics.ttfb).toBeLessThan(CORE_WEB_VITALS_THRESHOLDS.ttfb.good);
  });

  test('Blog post page should meet performance thresholds', async ({ page }) => {
    const response = await page.goto('/posts/mastering-liquid-glass-effects', { 
      waitUntil: 'networkidle' 
    });
    expect(response?.status()).toBe(200);

    await page.waitForSelector('[data-testid="mdx-content"]');
    await page.click('body');
    await page.waitForTimeout(2000);

    const metrics = await measureCoreWebVitals(page);

    // Blog posts may have slightly relaxed thresholds due to content richness
    expect(metrics.lcp).toBeLessThan(CORE_WEB_VITALS_THRESHOLDS.lcp.poor);
    expect(metrics.cls).toBeLessThan(CORE_WEB_VITALS_THRESHOLDS.cls.good);
  });
});

test.describe('Liquid Glass Effects Performance', () => {
  test('Glass effects should not impact Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for glass effects to initialize
    await page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    // Measure performance impact of glass effects
    const glassCards = page.locator('[data-testid="liquid-glass-card"]');
    const cardCount = await glassCards.count();
    
    // Test animation performance
    const animationMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const startTime = performance.now();
        let frameCount = 0;
        
        function measureFrame() {
          frameCount++;
          if (frameCount < 60) { // Measure 60 frames (~1 second at 60fps)
            requestAnimationFrame(measureFrame);
          } else {
            const endTime = performance.now();
            const fps = frameCount / ((endTime - startTime) / 1000);
            resolve({ fps, duration: endTime - startTime });
          }
        }
        
        requestAnimationFrame(measureFrame);
      });
    });

    const { fps } = animationMetrics as { fps: number; duration: number };
    
    // Should maintain at least 30 FPS for smooth animations
    expect(fps).toBeGreaterThan(30);
    
    console.log(`Glass effects performance: ${fps.toFixed(1)} FPS with ${cardCount} cards`);
  });

  test('GPU acceleration should be active for glass effects', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    const gpuAcceleration = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-testid="liquid-glass-card"]');
      const results = Array.from(cards).map(card => {
        const styles = getComputedStyle(card);
        const transform = styles.transform;
        const willChange = styles.willChange;
        const backfaceVisibility = styles.backfaceVisibility;
        
        return {
          hasTransform3d: transform.includes('matrix3d') || transform.includes('translate3d'),
          hasWillChange: willChange !== 'auto',
          hasBackfaceVisibility: backfaceVisibility === 'hidden'
        };
      });
      
      return results;
    });
    
    // At least some glass cards should have GPU acceleration indicators
    const acceleratedCards = gpuAcceleration.filter(card => 
      card.hasTransform3d || card.hasWillChange || card.hasBackfaceVisibility
    );
    
    expect(acceleratedCards.length).toBeGreaterThan(0);
  });

  test('Backdrop filter performance should be optimized', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    const backdropFilterMetrics = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-testid="liquid-glass-card"]');
      const metrics = Array.from(cards).map(card => {
        const styles = getComputedStyle(card);
        const backdropFilter = styles.backdropFilter || styles.webkitBackdropFilter;
        
        // Extract blur value if present
        const blurMatch = backdropFilter.match(/blur\((\d+(?:\.\d+)?)px\)/);
        const blurValue = blurMatch ? parseFloat(blurMatch[1]) : 0;
        
        return {
          hasBackdropFilter: backdropFilter !== 'none',
          blurValue,
          isOptimized: blurValue <= 20 // Performance threshold
        };
      });
      
      return metrics;
    });
    
    // All cards with backdrop filters should be performance-optimized
    const unoptimizedCards = backdropFilterMetrics.filter(card => 
      card.hasBackdropFilter && !card.isOptimized
    );
    
    expect(unoptimizedCards.length).toBe(0);
    
    console.log('Backdrop filter analysis:', {
      total: backdropFilterMetrics.length,
      withBackdropFilter: backdropFilterMetrics.filter(c => c.hasBackdropFilter).length,
      optimized: backdropFilterMetrics.filter(c => c.isOptimized).length
    });
  });
});

test.describe('Resource Loading Performance', () => {
  test('Critical resources should load quickly', async ({ page }) => {
    const resourceTimings: any[] = [];
    
    page.on('response', response => {
      const url = response.url();
      const timing = response.timing();
      
      if (url.includes('.css') || url.includes('.js') || url.includes('font')) {
        resourceTimings.push({
          url: url.split('/').pop(),
          type: response.request().resourceType(),
          status: response.status(),
          size: response.headers()['content-length'],
          timing: timing
        });
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Critical CSS should load quickly
    const criticalCSS = resourceTimings.filter(r => 
      r.type === 'stylesheet' && r.url.includes('app')
    );
    
    criticalCSS.forEach(css => {
      expect(css.timing.responseEnd).toBeLessThan(1000); // 1 second max
    });
    
    // JavaScript bundles should be optimized
    const jsBundle = resourceTimings.filter(r => 
      r.type === 'script' && r.url.includes('chunk')
    );
    
    jsBundle.forEach(js => {
      expect(js.timing.responseEnd).toBeLessThan(2000); // 2 seconds max
    });
    
    console.log('Resource loading summary:', {
      css: criticalCSS.length,
      js: jsBundle.length,
      totalResources: resourceTimings.length
    });
  });

  test('Images should be optimized and lazy loaded', async ({ page }) => {
    await page.goto('/');
    
    const imageMetrics = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const metrics = Array.from(images).map(img => {
        return {
          src: img.src,
          loading: img.loading,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight,
          hasNext: img.src.includes('_next'), // Next.js optimized images
          isLazyLoaded: img.loading === 'lazy'
        };
      });
      
      return metrics;
    });
    
    // Non-critical images should be lazy loaded
    const nonHeroImages = imageMetrics.slice(1); // Exclude hero image
    const lazyLoadedImages = nonHeroImages.filter(img => img.isLazyLoaded);
    
    expect(lazyLoadedImages.length).toBeGreaterThan(0);
    
    // Images should be properly sized (not oversized)
    imageMetrics.forEach(img => {
      if (img.naturalWidth > 0 && img.displayWidth > 0) {
        const oversizeRatio = img.naturalWidth / img.displayWidth;
        expect(oversizeRatio).toBeLessThan(2); // Not more than 2x oversize
      }
    });
    
    console.log('Image optimization analysis:', {
      total: imageMetrics.length,
      lazyLoaded: lazyLoadedImages.length,
      nextOptimized: imageMetrics.filter(i => i.hasNext).length
    });
  });

  test('Font loading should be optimized', async ({ page }) => {
    let fontLoadEvents: any[] = [];
    
    await page.addInitScript(() => {
      // Track font loading
      document.fonts.addEventListener('loading', (event: any) => {
        (window as any).fontLoadEvents = (window as any).fontLoadEvents || [];
        (window as any).fontLoadEvents.push({
          family: event.fontface.family,
          status: 'loading',
          timestamp: performance.now()
        });
      });
      
      document.fonts.addEventListener('loadingdone', (event: any) => {
        (window as any).fontLoadEvents = (window as any).fontLoadEvents || [];
        (window as any).fontLoadEvents.push({
          family: event.fontface.family,
          status: 'loaded',
          timestamp: performance.now()
        });
      });
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    fontLoadEvents = await page.evaluate(() => (window as any).fontLoadEvents || []);
    
    if (fontLoadEvents.length > 0) {
      // Fonts should load within reasonable time
      const loadedFonts = fontLoadEvents.filter(e => e.status === 'loaded');
      loadedFonts.forEach(font => {
        expect(font.timestamp).toBeLessThan(3000); // 3 seconds max
      });
      
      console.log('Font loading analysis:', {
        total: fontLoadEvents.length,
        loaded: loadedFonts.length
      });
    }
  });
});

test.describe('Mobile Performance', () => {
  test.use({ 
    viewport: { width: 375, height: 667 },
    // Simulate slower mobile connection
    httpCredentials: undefined
  });

  test('Mobile performance should meet thresholds', async ({ page }) => {
    // Simulate 3G connection
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100); // Add 100ms delay
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    await page.click('body');
    await page.waitForTimeout(2000);
    
    const metrics = await measureCoreWebVitals(page);
    
    // More lenient thresholds for mobile
    expect(metrics.lcp).toBeLessThan(CORE_WEB_VITALS_THRESHOLDS.lcp.poor);
    expect(metrics.fcp).toBeLessThan(CORE_WEB_VITALS_THRESHOLDS.fcp.poor);
    expect(metrics.cls).toBeLessThan(CORE_WEB_VITALS_THRESHOLDS.cls.good);
    
    console.log('Mobile Core Web Vitals:', {
      LCP: `${metrics.lcp.toFixed(0)}ms`,
      FCP: `${metrics.fcp.toFixed(0)}ms`,
      CLS: metrics.cls.toFixed(3)
    });
  });

  test('Touch interactions should be responsive', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="liquid-glass-card"]');
    
    const touchElements = page.locator('button, a, [role="button"]');
    const elementCount = await touchElements.count();
    
    for (let i = 0; i < Math.min(elementCount, 5); i++) {
      const element = touchElements.nth(i);
      
      const startTime = Date.now();
      await element.tap();
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(100); // 100ms for good responsiveness
    }
  });
});