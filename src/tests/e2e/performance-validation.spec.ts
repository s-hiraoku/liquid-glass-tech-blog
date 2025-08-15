/**
 * Performance Validation Tests for Liquid Glass Blog
 * 
 * Comprehensive performance testing using Playwright MCP and Vercel MCP
 * integration for Core Web Vitals monitoring and real-world performance validation.
 * 
 * Test Coverage:
 * - Core Web Vitals (LCP, INP, CLS) compliance
 * - 60fps animation performance validation
 * - Memory usage and GPU performance monitoring  
 * - Bundle size optimization validation
 * - Progressive loading performance
 */

import { test, expect } from '../base-test';

test.describe('Performance Validation Tests', () => {
  test.beforeEach(async ({ liquidGlassTest }) => {
    await liquidGlassTest.startPerformanceMonitoring();
    await liquidGlassTest.mockGPUCapabilities(true);
  });

  test.describe('Core Web Vitals Compliance', () => {
    test('should meet LCP target of <2.5s on homepage', async ({ page, liquidGlassTest }) => {
      // Start navigation timing
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Measure LCP (Largest Contentful Paint)
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback timeout after 5 seconds
          setTimeout(() => resolve(5000), 5000);
        });
      });
      
      expect(lcp).toBeLessThan(2500); // LCP target: <2.5s
      
      // Verify glass effects don't negatively impact LCP
      await liquidGlassTest.waitForGlassEffectLoad();
      const postGlassLCP = await liquidGlassTest.getPerformanceMetrics();
      expect(postGlassLCP.lcp).toBeLessThan(2500);
    });

    test('should maintain INP <200ms during liquid glass interactions', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      await page.goto('/');
      await liquidGlassTest.waitForPageLoad();
      
      // Track interaction timing
      let interactionStartTime: number;
      let interactionEndTime: number;
      
      // Add INP measurement
      await page.addInitScript(() => {
        window.INPMeasurement = [];
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'event') {
              window.INPMeasurement.push({
                name: entry.name,
                duration: entry.duration,
                startTime: entry.startTime,
              });
            }
          }
        });
        
        if ('PerformanceEventTiming' in window) {
          observer.observe({ entryTypes: ['event'] });
        }
      });
      
      // Test glass card interactions
      const glassCards = page.locator('.liquid-glass-container[data-interactive]');
      const cardCount = await glassCards.count();
      
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = glassCards.nth(i);
        
        // Measure click interaction
        interactionStartTime = await page.evaluate(() => performance.now());
        await card.click();
        await page.waitForTimeout(50); // Allow interaction to process
        interactionEndTime = await page.evaluate(() => performance.now());
        
        const interactionDuration = interactionEndTime - interactionStartTime;
        expect(interactionDuration).toBeLessThan(200); // INP target: <200ms
        
        // Measure hover interaction
        interactionStartTime = await page.evaluate(() => performance.now());
        await card.hover();
        await page.waitForTimeout(50);
        interactionEndTime = await page.evaluate(() => performance.now());
        
        const hoverDuration = interactionEndTime - interactionStartTime;
        expect(hoverDuration).toBeLessThan(200);
      }
      
      // Verify no INP violations in measurement
      const inpMeasurements = await page.evaluate(() => window.INPMeasurement || []);
      const highINPEvents = inpMeasurements.filter((event: any) => event.duration > 200);
      expect(highINPEvents).toHaveLength(0);
    });

    test('should maintain CLS <0.1 during glass effect loading', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      // Enable CLS monitoring
      await page.addInitScript(() => {
        window.CLSMeasurement = 0;
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              window.CLSMeasurement += entry.value;
            }
          }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
      });
      
      await page.goto('/');
      await liquidGlassTest.waitForPageLoad();
      await liquidGlassTest.waitForGlassEffectLoad();
      
      // Wait for potential layout shifts to settle
      await page.waitForTimeout(2000);
      
      const clsValue = await page.evaluate(() => window.CLSMeasurement);
      expect(clsValue).toBeLessThan(0.1); // CLS target: <0.1
      
      // Test glass effect state changes don't cause layout shifts
      await liquidGlassTest.setGlassIntensity(30);
      await page.waitForTimeout(1000);
      
      const postChangeClsValue = await page.evaluate(() => window.CLSMeasurement);
      expect(postChangeClsValue).toBeLessThan(0.1);
    });
  });

  test.describe('60fps Animation Performance', () => {
    test('should maintain 60fps during glass effect animations', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      await page.goto('/showcase'); // Page with multiple animated glass effects
      await liquidGlassTest.waitForPageLoad();
      
      // Start frame rate monitoring
      await page.addInitScript(() => {
        window.frameRateData = [];
        let lastFrameTime = performance.now();
        
        function measureFrameRate() {
          const currentTime = performance.now();
          const deltaTime = currentTime - lastFrameTime;
          const fps = 1000 / deltaTime;
          
          window.frameRateData.push(fps);
          lastFrameTime = currentTime;
          
          if (window.frameRateData.length < 300) { // Monitor for 5 seconds at 60fps
            requestAnimationFrame(measureFrameRate);
          }
        }
        
        requestAnimationFrame(measureFrameRate);
      });
      
      // Trigger glass animations
      const animatedElements = page.locator('[data-motion="true"]');
      const elementCount = await animatedElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 5); i++) {
        await animatedElements.nth(i).hover();
        await page.waitForTimeout(200);
      }
      
      // Wait for frame rate measurement completion
      await page.waitForTimeout(5000);
      
      // Analyze frame rate data
      const frameRateData = await page.evaluate(() => window.frameRateData || []);
      expect(frameRateData.length).toBeGreaterThan(250); // Should have collected ~300 frames
      
      // Calculate average FPS
      const averageFPS = frameRateData.reduce((sum: number, fps: number) => sum + fps, 0) / frameRateData.length;
      expect(averageFPS).toBeGreaterThanOrEqual(55); // Target: 60fps ±5fps tolerance
      
      // Check for frame drops (fps < 30)
      const frameDrops = frameRateData.filter((fps: number) => fps < 30);
      expect(frameDrops.length).toBeLessThan(frameRateData.length * 0.05); // <5% frame drops
    });

    test('should optimize performance with multiple concurrent glass effects', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      await page.goto('/stress-test'); // Page with many glass effects
      await liquidGlassTest.waitForPageLoad();
      
      // Count glass elements
      const glassElements = page.locator('.liquid-glass-container');
      const elementCount = await glassElements.count();
      expect(elementCount).toBeGreaterThan(10); // Ensure stress test setup
      
      // Measure performance with all effects active
      const performanceMetrics = await liquidGlassTest.getPerformanceMetrics();
      expect(performanceMetrics.frameRate).toBeGreaterThanOrEqual(50); // Maintain 50fps under load
      expect(performanceMetrics.memoryUsage).toBeLessThan(400); // <400MB memory usage
      
      // Test batch rendering performance
      const renderTime = await liquidGlassTest.measureGlassEffectPerformance('.glass-grid');
      expect(renderTime).toBeLessThan(150); // <150ms batch render time
    });
  });

  test.describe('Memory and GPU Performance', () => {
    test('should maintain optimal memory usage during extended session', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      // Enable memory monitoring
      await page.addInitScript(() => {
        window.memorySnapshots = [];
        
        const takeMemorySnapshot = () => {
          if ('memory' in performance) {
            const memory = (performance as any).memory;
            window.memorySnapshots.push({
              timestamp: Date.now(),
              usedJSHeapSize: memory.usedJSHeapSize,
              totalJSHeapSize: memory.totalJSHeapSize,
              jsHeapSizeLimit: memory.jsHeapSizeLimit,
            });
          }
        };
        
        // Take snapshots every 2 seconds
        setInterval(takeMemorySnapshot, 2000);
        takeMemorySnapshot(); // Initial snapshot
      });
      
      // Navigate through multiple pages with glass effects
      const testPages = ['/', '/posts', '/showcase', '/about'];
      
      for (const testPage of testPages) {
        await page.goto(testPage);
        await liquidGlassTest.waitForPageLoad();
        await liquidGlassTest.waitForGlassEffectLoad();
        
        // Interact with glass elements
        const interactiveElements = page.locator('[data-interactive]');
        const elementCount = await interactiveElements.count();
        
        for (let i = 0; i < Math.min(elementCount, 3); i++) {
          await interactiveElements.nth(i).hover();
          await page.waitForTimeout(100);
        }
        
        await page.waitForTimeout(2000); // Allow memory snapshot
      }
      
      // Analyze memory usage patterns
      const memorySnapshots = await page.evaluate(() => window.memorySnapshots || []);
      expect(memorySnapshots.length).toBeGreaterThan(4);
      
      // Check for memory leaks
      const initialMemory = memorySnapshots[0].usedJSHeapSize;
      const finalMemory = memorySnapshots[memorySnapshots.length - 1].usedJSHeapSize;
      const memoryGrowth = (finalMemory - initialMemory) / initialMemory;
      
      expect(memoryGrowth).toBeLessThan(0.5); // <50% memory growth is acceptable
      expect(finalMemory / 1024 / 1024).toBeLessThan(300); // <300MB total usage
    });

    test('should efficiently utilize GPU for glass effects', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      await page.goto('/');
      await liquidGlassTest.waitForPageLoad();
      
      // Verify WebGL context availability
      const webglSupported = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      });
      
      expect(webglSupported).toBe(true);
      
      // Test GPU-accelerated glass effects
      await liquidGlassTest.setGlassIntensity(35); // High intensity for GPU test
      
      const glassElements = page.locator('.liquid-glass-container');
      const elementCount = await glassElements.count();
      
      // Verify hardware acceleration usage
      const gpuEffectsActive = await page.evaluate(() => {
        const glassElements = document.querySelectorAll('.liquid-glass-container');
        return Array.from(glassElements).every(el => {
          const style = window.getComputedStyle(el);
          return style.backdropFilter && style.backdropFilter !== 'none';
        });
      });
      
      expect(gpuEffectsActive).toBe(true);
      
      // Measure GPU-optimized rendering performance
      const renderTime = await liquidGlassTest.measureGlassEffectPerformance('.liquid-glass-container');
      expect(renderTime).toBeLessThan(80); // GPU-accelerated should be <80ms
    });
  });

  test.describe('Bundle Size and Loading Performance', () => {
    test('should optimize JavaScript bundle size', async ({ page }) => {
      // Capture network activity
      const resourceSizes = new Map<string, number>();
      
      page.on('response', async (response) => {
        if (response.url().includes('.js') || response.url().includes('.css')) {
          try {
            const buffer = await response.body();
            resourceSizes.set(response.url(), buffer.length);
          } catch (error) {
            // Handle cases where response body is not available
          }
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Analyze bundle sizes
      let totalJSSize = 0;
      let totalCSSSize = 0;
      
      for (const [url, size] of resourceSizes.entries()) {
        if (url.includes('.js')) {
          totalJSSize += size;
        } else if (url.includes('.css')) {
          totalCSSSize += size;
        }
      }
      
      // Convert to KB
      const totalJSSizeKB = totalJSSize / 1024;
      const totalCSSSizeKB = totalCSSSize / 1024;
      
      expect(totalJSSizeKB).toBeLessThan(500); // <500KB total JS
      expect(totalCSSSizeKB).toBeLessThan(100); // <100KB total CSS
      
      // Verify critical resources are optimized
      const criticalResources = Array.from(resourceSizes.entries()).filter(([url]) => 
        url.includes('main') || url.includes('index') || url.includes('app')
      );
      
      expect(criticalResources.length).toBeGreaterThan(0);
    });

    test('should implement efficient progressive loading', async ({ page, liquidGlassTest }) => {
      // Monitor loading stages
      await page.addInitScript(() => {
        window.loadingStages = [];
        
        // Track loading events
        const trackLoadingStage = (stage: string) => {
          window.loadingStages.push({
            stage,
            timestamp: performance.now(),
          });
        };
        
        // Track critical loading points
        window.addEventListener('DOMContentLoaded', () => trackLoadingStage('DOMContentLoaded'));
        window.addEventListener('load', () => trackLoadingStage('load'));
        
        // Track glass effects loading
        const checkGlassEffects = () => {
          const glassElements = document.querySelectorAll('.liquid-glass-container');
          if (glassElements.length > 0) {
            trackLoadingStage('glassEffectsReady');
          }
        };
        
        const observer = new MutationObserver(checkGlassEffects);
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Initial check
        setTimeout(checkGlassEffects, 100);
      });
      
      await page.goto('/');
      await liquidGlassTest.waitForPageLoad();
      await liquidGlassTest.waitForGlassEffectLoad();
      
      // Analyze loading progression
      const loadingStages = await page.evaluate(() => window.loadingStages || []);
      expect(loadingStages.length).toBeGreaterThanOrEqual(3);
      
      // Verify progressive loading timing
      const domContentLoaded = loadingStages.find(stage => stage.stage === 'DOMContentLoaded');
      const glassEffectsReady = loadingStages.find(stage => stage.stage === 'glassEffectsReady');
      
      expect(domContentLoaded).toBeDefined();
      expect(glassEffectsReady).toBeDefined();
      
      // Glass effects should load shortly after DOM
      if (domContentLoaded && glassEffectsReady) {
        const glassLoadDelay = glassEffectsReady.timestamp - domContentLoaded.timestamp;
        expect(glassLoadDelay).toBeLessThan(1000); // <1s delay for glass effects
      }
    });
  });

  test.describe('Real-World Performance Scenarios', () => {
    test('should maintain performance on slow network connections', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      // Simulate slow 3G connection
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
        await route.continue();
      });
      
      const startTime = Date.now();
      await page.goto('/');
      await liquidGlassTest.waitForPageLoad();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // <5s on slow connection
      
      // Verify glass effects still work properly
      await liquidGlassTest.waitForGlassEffectLoad();
      await liquidGlassTest.verifyGlassEffect('.liquid-glass-container');
      
      // Performance should degrade gracefully
      const performanceMetrics = await liquidGlassTest.getPerformanceMetrics();
      expect(performanceMetrics.frameRate).toBeGreaterThanOrEqual(45); // Reduced but acceptable
    });

    test('should handle concurrent user interactions efficiently', async ({ 
      page, 
      liquidGlassTest 
    }) => {
      await page.goto('/showcase');
      await liquidGlassTest.waitForPageLoad();
      
      // Simulate rapid concurrent interactions
      const interactionPromises = [];
      const interactiveElements = page.locator('[data-interactive]');
      const elementCount = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 8); i++) {
        const element = interactiveElements.nth(i);
        interactionPromises.push(
          element.hover().then(() => element.click()).then(() => page.waitForTimeout(50))
        );
      }
      
      const startTime = performance.now();
      await Promise.all(interactionPromises);
      const endTime = performance.now();
      
      const totalInteractionTime = endTime - startTime;
      expect(totalInteractionTime).toBeLessThan(2000); // <2s for all interactions
      
      // Verify no performance degradation
      const finalMetrics = await liquidGlassTest.getPerformanceMetrics();
      expect(finalMetrics.frameRate).toBeGreaterThanOrEqual(50);
    });
  });
});