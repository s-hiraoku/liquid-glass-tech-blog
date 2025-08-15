/**
 * Performance Testing Helpers
 * Utilities for measuring and validating performance metrics
 */

export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fcp: number; // First Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
  tti: number; // Time to Interactive
}

export interface PerformanceThresholds {
  lcp: { good: number; poor: number };
  fcp: { good: number; poor: number };
  cls: { good: number; poor: number };
  fid: { good: number; poor: number };
  ttfb: { good: number; poor: number };
  tti: { good: number; poor: number };
}

export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, poor: 4000 },
  fcp: { good: 1800, poor: 3000 },
  cls: { good: 0.1, poor: 0.25 },
  fid: { good: 100, poor: 300 },
  ttfb: { good: 600, poor: 1500 },
  tti: { good: 3800, poor: 7300 }
};

/**
 * Measure Core Web Vitals using browser APIs
 */
export async function measureCoreWebVitals(page: any): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    return new Promise<PerformanceMetrics>((resolve) => {
      const metrics: Partial<PerformanceMetrics> = {};
      let metricsCollected = 0;
      const totalMetrics = 6;

      function checkComplete() {
        metricsCollected++;
        if (metricsCollected === totalMetrics) {
          resolve(metrics as PerformanceMetrics);
        }
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1] as any;
          metrics.lcp = lastEntry.startTime;
          lcpObserver.disconnect();
          checkComplete();
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          metrics.fcp = fcpEntry.startTime;
          fcpObserver.disconnect();
          checkComplete();
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const firstEntry = entries[0] as any;
          metrics.fid = firstEntry.processingStart - firstEntry.startTime;
          fidObserver.disconnect();
          checkComplete();
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
      if (navigationEntry) {
        metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        checkComplete();
      }

      // Time to Interactive (approximation)
      const ttiObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          metrics.tti = lastEntry.startTime + (lastEntry as any).duration;
          ttiObserver.disconnect();
          checkComplete();
        }
      });
      ttiObserver.observe({ entryTypes: ['navigation'] });

      // Timeout fallback
      setTimeout(() => {
        clsObserver.disconnect();
        resolve({
          lcp: metrics.lcp || 0,
          fcp: metrics.fcp || 0,
          cls: metrics.cls || 0,
          fid: metrics.fid || 0,
          ttfb: metrics.ttfb || 0,
          tti: metrics.tti || 0
        });
      }, 10000);
    });
  });
}

/**
 * Validate performance metrics against thresholds
 */
export function validatePerformanceMetrics(
  metrics: PerformanceMetrics,
  thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS
): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  if (metrics.lcp > thresholds.lcp.good) {
    failures.push(`LCP (${metrics.lcp.toFixed(0)}ms) exceeds threshold (${thresholds.lcp.good}ms)`);
  }

  if (metrics.fcp > thresholds.fcp.good) {
    failures.push(`FCP (${metrics.fcp.toFixed(0)}ms) exceeds threshold (${thresholds.fcp.good}ms)`);
  }

  if (metrics.cls > thresholds.cls.good) {
    failures.push(`CLS (${metrics.cls.toFixed(3)}) exceeds threshold (${thresholds.cls.good})`);
  }

  if (metrics.fid > thresholds.fid.good) {
    failures.push(`FID (${metrics.fid.toFixed(0)}ms) exceeds threshold (${thresholds.fid.good}ms)`);
  }

  if (metrics.ttfb > thresholds.ttfb.good) {
    failures.push(`TTFB (${metrics.ttfb.toFixed(0)}ms) exceeds threshold (${thresholds.ttfb.good}ms)`);
  }

  if (metrics.tti > thresholds.tti.good) {
    failures.push(`TTI (${metrics.tti.toFixed(0)}ms) exceeds threshold (${thresholds.tti.good}ms)`);
  }

  return {
    passed: failures.length === 0,
    failures
  };
}

/**
 * Measure liquid glass effect performance
 */
export async function measureGlassEffectPerformance(page: any) {
  return await page.evaluate(() => {
    const cards = document.querySelectorAll('[data-testid="liquid-glass-card"]');
    const results: any[] = [];

    cards.forEach((card, index) => {
      const styles = getComputedStyle(card);
      
      // Extract performance-relevant properties
      const backdropFilter = styles.backdropFilter || styles.webkitBackdropFilter;
      const transform = styles.transform;
      const willChange = styles.willChange;
      
      // Measure blur intensity
      let blurValue = 0;
      if (backdropFilter.includes('blur')) {
        const match = backdropFilter.match(/blur\((\d+(?:\.\d+)?)px\)/);
        blurValue = match ? parseFloat(match[1]) : 0;
      }

      // Check for GPU acceleration
      const hasGPUAcceleration = 
        transform.includes('translate3d') ||
        transform.includes('translateZ') ||
        willChange !== 'auto';

      results.push({
        index,
        blurValue,
        hasBackdropFilter: backdropFilter !== 'none',
        hasGPUAcceleration,
        isOptimized: blurValue <= 20 && hasGPUAcceleration
      });
    });

    return results;
  });
}

/**
 * Measure frame rate during animations
 */
export async function measureFrameRate(page: any, duration: number = 1000): Promise<number> {
  return await page.evaluate((duration) => {
    return new Promise<number>((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();
      
      function countFrame() {
        frameCount++;
        const elapsed = performance.now() - startTime;
        
        if (elapsed < duration) {
          requestAnimationFrame(countFrame);
        } else {
          const fps = frameCount / (elapsed / 1000);
          resolve(fps);
        }
      }
      
      requestAnimationFrame(countFrame);
    });
  }, duration);
}

/**
 * Analyze resource loading performance
 */
export async function analyzeResourceLoading(page: any) {
  return await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource') as any[];
    
    const analysis = {
      total: entries.length,
      css: entries.filter(e => e.initiatorType === 'css').length,
      script: entries.filter(e => e.initiatorType === 'script').length,
      img: entries.filter(e => e.initiatorType === 'img').length,
      font: entries.filter(e => e.name.includes('font')).length,
      slowResources: entries.filter(e => e.duration > 1000),
      totalTransferSize: entries.reduce((sum, e) => sum + (e.transferSize || 0), 0),
      avgLoadTime: entries.reduce((sum, e) => sum + e.duration, 0) / entries.length
    };

    return analysis;
  });
}

/**
 * Generate performance report
 */
export function generatePerformanceReport(
  metrics: PerformanceMetrics,
  glassEffectData: any[],
  resourceData: any
): string {
  const validation = validatePerformanceMetrics(metrics);
  
  let report = '# Performance Test Report\n\n';
  
  report += '## Core Web Vitals\n\n';
  report += `- **LCP**: ${metrics.lcp.toFixed(0)}ms ${metrics.lcp <= DEFAULT_THRESHOLDS.lcp.good ? '✅' : '❌'}\n`;
  report += `- **FCP**: ${metrics.fcp.toFixed(0)}ms ${metrics.fcp <= DEFAULT_THRESHOLDS.fcp.good ? '✅' : '❌'}\n`;
  report += `- **CLS**: ${metrics.cls.toFixed(3)} ${metrics.cls <= DEFAULT_THRESHOLDS.cls.good ? '✅' : '❌'}\n`;
  report += `- **FID**: ${metrics.fid.toFixed(0)}ms ${metrics.fid <= DEFAULT_THRESHOLDS.fid.good ? '✅' : '❌'}\n`;
  report += `- **TTFB**: ${metrics.ttfb.toFixed(0)}ms ${metrics.ttfb <= DEFAULT_THRESHOLDS.ttfb.good ? '✅' : '❌'}\n`;
  report += `- **TTI**: ${metrics.tti.toFixed(0)}ms ${metrics.tti <= DEFAULT_THRESHOLDS.tti.good ? '✅' : '❌'}\n\n`;
  
  report += '## Liquid Glass Effects\n\n';
  const optimizedCards = glassEffectData.filter(card => card.isOptimized);
  report += `- **Total Cards**: ${glassEffectData.length}\n`;
  report += `- **Optimized**: ${optimizedCards.length}/${glassEffectData.length}\n`;
  report += `- **Average Blur**: ${(glassEffectData.reduce((sum, card) => sum + card.blurValue, 0) / glassEffectData.length).toFixed(1)}px\n`;
  report += `- **GPU Acceleration**: ${glassEffectData.filter(card => card.hasGPUAcceleration).length}/${glassEffectData.length}\n\n`;
  
  report += '## Resource Loading\n\n';
  report += `- **Total Resources**: ${resourceData.total}\n`;
  report += `- **CSS Files**: ${resourceData.css}\n`;
  report += `- **JavaScript Files**: ${resourceData.script}\n`;
  report += `- **Images**: ${resourceData.img}\n`;
  report += `- **Fonts**: ${resourceData.font}\n`;
  report += `- **Slow Resources (>1s)**: ${resourceData.slowResources.length}\n`;
  report += `- **Total Transfer Size**: ${(resourceData.totalTransferSize / 1024 / 1024).toFixed(2)}MB\n`;
  report += `- **Average Load Time**: ${resourceData.avgLoadTime.toFixed(0)}ms\n\n`;
  
  if (!validation.passed) {
    report += '## Issues Found\n\n';
    validation.failures.forEach(failure => {
      report += `- ❌ ${failure}\n`;
    });
    report += '\n';
  }
  
  return report;
}