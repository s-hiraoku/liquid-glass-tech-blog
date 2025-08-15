# Phase 6 Continuation - TDD Environment Configuration

## 🧪 Enhanced TDD Setup for Phase 6 Continuation

### Test Framework Configuration for Liquid Glass Effects

#### Vitest Configuration Enhancement
```typescript
// vitest.config.ts - Enhanced for Phase 6 continuation
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup/vitest-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 95,
        branches: 90,
        functions: 95,
        statements: 95
      },
      exclude: [
        'node_modules/',
        'src/tests/setup/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/coverage/**'
      ]
    },
    globals: true,
    css: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/types': path.resolve(__dirname, './src/types')
    }
  },
  define: {
    'process.env.NODE_ENV': '"test"'
  }
});
```

#### Enhanced Test Setup for Glass Effects
```typescript
// src/tests/setup/vitest-setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock browser APIs for glass effects
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock CSS.supports for backdrop-filter detection
Object.defineProperty(CSS, 'supports', {
  writable: true,
  value: vi.fn().mockImplementation((property: string, value?: string) => {
    if (property === 'backdrop-filter' || property.includes('backdrop-filter')) {
      return true; // Assume backdrop-filter is supported in tests
    }
    return false;
  })
});

// Mock ResizeObserver for responsive components
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver for lazy loading
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Performance API mock for glass effect testing
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
  }
});

// Mock navigator APIs for device detection
Object.defineProperty(navigator, 'hardwareConcurrency', {
  writable: true,
  value: 4 // Default to mid-range device
});

Object.defineProperty(navigator, 'deviceMemory', {
  writable: true,
  value: 4 // Default to 4GB RAM
});

// Mock prefers-reduced-motion for accessibility testing
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn((property: string) => {
      if (property === 'prefers-reduced-motion') {
        return 'no-preference';
      }
      return '';
    })
  }))
});
```

### Phase 6 Continuation Test Utilities

#### Liquid Glass Testing Utilities
```typescript
// src/tests/utils/liquid-glass-utils.ts
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { SeasonalThemeProvider } from '@/lib/theme/SeasonalThemeProvider';
import { ThemeProvider } from '@/components/theme-provider';

// Custom render with theme providers
export const renderWithTheme = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      <SeasonalThemeProvider>
        {children}
      </SeasonalThemeProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Glass effect performance testing utility
export const measureGlassEffectPerformance = async (
  component: ReactElement,
  testDuration: number = 1000
) => {
  const { container } = renderWithTheme(component);
  
  const startTime = performance.now();
  let frameCount = 0;
  let maxFrameTime = 0;
  
  const measureFrame = () => {
    const frameStart = performance.now();
    
    // Simulate glass effect updates
    const glassElements = container.querySelectorAll('[data-testid*="glass"]');
    glassElements.forEach(el => {
      (el as HTMLElement).style.transform = `scale(${1 + Math.sin(frameCount * 0.1) * 0.05})`;
    });
    
    const frameEnd = performance.now();
    const frameTime = frameEnd - frameStart;
    maxFrameTime = Math.max(maxFrameTime, frameTime);
    frameCount++;
    
    if (frameEnd - startTime < testDuration) {
      requestAnimationFrame(measureFrame);
    }
  };
  
  requestAnimationFrame(measureFrame);
  
  return new Promise(resolve => {
    setTimeout(() => {
      const averageFrameTime = (performance.now() - startTime) / frameCount;
      resolve({
        frameCount,
        averageFrameTime,
        maxFrameTime,
        fps: frameCount / (testDuration / 1000),
        passesTarget: averageFrameTime <= 16.67 // 60fps threshold
      });
    }, testDuration + 100);
  });
};

// Device performance simulation
export const simulateDevicePerformance = (tier: 'low' | 'mid' | 'high') => {
  const configs = {
    low: { hardwareConcurrency: 2, deviceMemory: 2, reducedMotion: true },
    mid: { hardwareConcurrency: 4, deviceMemory: 4, reducedMotion: false },
    high: { hardwareConcurrency: 8, deviceMemory: 8, reducedMotion: false }
  };
  
  const config = configs[tier];
  
  Object.defineProperty(navigator, 'hardwareConcurrency', { value: config.hardwareConcurrency });
  Object.defineProperty(navigator, 'deviceMemory', { value: config.deviceMemory });
  
  // Mock prefers-reduced-motion based on device tier
  const mockMatchMedia = (query: string) => ({
    matches: query.includes('prefers-reduced-motion') && config.reducedMotion,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
  
  Object.defineProperty(window, 'matchMedia', { value: mockMatchMedia });
};

// Viewport simulation for responsive testing
export const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
  Object.defineProperty(window, 'innerHeight', { value: height, writable: true });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Seasonal theme testing utility
export const mockSeasonalDate = (date: string) => {
  const mockDate = new Date(date);
  vi.setSystemTime(mockDate);
  return mockDate;
};
```

#### Category/Tag Page Testing Patterns
```typescript
// src/tests/patterns/category-page-patterns.ts

export const categoryPageTestPatterns = {
  // Test data generation
  createMockCategory: (overrides = {}) => ({
    id: 'liquid-glass-techniques',
    name: 'Liquid Glass Techniques',
    description: 'Advanced techniques for liquid glass effects',
    articleCount: 24,
    slug: 'liquid-glass-techniques',
    seo: {
      title: 'Liquid Glass Techniques - Advanced CSS Effects',
      description: 'Learn advanced liquid glass and glassmorphism techniques for modern web design',
      keywords: ['liquid glass', 'glassmorphism', 'CSS effects', 'web design']
    },
    ...overrides
  }),

  createMockCategoryArticles: (count = 12) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `article-${index + 1}`,
      title: `Liquid Glass Technique ${index + 1}`,
      excerpt: 'Learn advanced liquid glass effects for modern web design',
      slug: `liquid-glass-technique-${index + 1}`,
      eyecatchImage: {
        url: `https://example.com/images/article-${index + 1}.webp`,
        alt: `Article ${index + 1} eyecatch image`,
        blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'
      },
      publishedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 5 + Math.floor(Math.random() * 10),
      tags: [
        { name: 'CSS', color: '#3b82f6' },
        { name: 'Glass Effects', color: '#8b5cf6' },
        { name: 'Animation', color: '#06b6d4' }
      ],
      category: {
        name: 'Liquid Glass Techniques',
        icon: '🌟'
      }
    }));
  },

  // TDD test pattern for category pages
  categoryPageTDDPattern: `
describe('CategoryPage - Phase 6.3 TDD Implementation', () => {
  beforeEach(() => {
    // Reset viewport to desktop for consistent testing
    setViewportSize(1440, 900);
    simulateDevicePerformance('mid');
  });

  describe('RED PHASE: Failing Tests Define Requirements', () => {
    test('should render category header with liquid glass effects', () => {
      // GIVEN: Category data with glass effect requirements
      const mockCategory = createMockCategory();
      
      // WHEN: CategoryPage component is rendered
      const { container } = renderWithTheme(
        <CategoryPage category={mockCategory} articles={[]} />
      );
      
      // THEN: Should display category header with glass effects
      const header = container.querySelector('[data-testid="category-header"]');
      expect(header).toBeInTheDocument();
      expect(header).toHaveStyle({
        backdropFilter: expect.stringContaining('blur('),
        backgroundColor: expect.stringMatching(/rgba.*/)
      });
    });

    test('should implement pagination for large article sets', () => {
      // GIVEN: Category with more than 12 articles
      const mockCategory = createMockCategory();
      const mockArticles = createMockCategoryArticles(25);
      
      // WHEN: CategoryPage is rendered with many articles
      renderWithTheme(
        <CategoryPage 
          category={mockCategory} 
          articles={mockArticles.slice(0, 12)} 
          totalCount={25}
          currentPage={1}
        />
      );
      
      // THEN: Should display pagination component
      const pagination = screen.getByRole('navigation', { name: /pagination/i });
      expect(pagination).toBeInTheDocument();
      
      // THEN: Should show correct page information
      expect(screen.getByText('Showing 1-12 of 25 articles')).toBeInTheDocument();
    });

    test('should optimize glass effects for mobile viewport', () => {
      // GIVEN: Mobile viewport simulation
      setViewportSize(375, 667);
      simulateDevicePerformance('low');
      
      const mockCategory = createMockCategory();
      const mockArticles = createMockCategoryArticles(6);
      
      // WHEN: CategoryPage is rendered on mobile
      const { container } = renderWithTheme(
        <CategoryPage category={mockCategory} articles={mockArticles} />
      );
      
      // THEN: Should apply mobile-optimized glass effects
      const glassElements = container.querySelectorAll('[data-testid*="glass"]');
      glassElements.forEach(element => {
        expect(element).toHaveAttribute('data-performance-tier', 'mobile-optimized');
        expect(element).toHaveStyle({ backdropFilter: 'blur(8px)' }); // Reduced blur
      });
    });
  });

  describe('GREEN PHASE: Minimal Implementation', () => {
    test('renders basic category structure', () => {
      const mockCategory = createMockCategory();
      const mockArticles = createMockCategoryArticles(3);
      
      renderWithTheme(
        <CategoryPage category={mockCategory} articles={mockArticles} />
      );
      
      expect(screen.getByText(mockCategory.name)).toBeInTheDocument();
      expect(screen.getAllByRole('article')).toHaveLength(3);
    });
  });

  describe('REFACTOR PHASE: Enhanced Implementation', () => {
    test('meets Core Web Vitals requirements with glass effects', async () => {
      const mockCategory = createMockCategory();
      const mockArticles = createMockCategoryArticles(12);
      
      // Mock performance measurement
      const performanceMetrics = await measureGlassEffectPerformance(
        <CategoryPage category={mockCategory} articles={mockArticles} />,
        1000
      );
      
      expect(performanceMetrics.passesTarget).toBe(true);
      expect(performanceMetrics.averageFrameTime).toBeLessThan(16.67);
    });
  });
});`
};
```

#### Theme Toggle Testing Patterns
```typescript
// src/tests/patterns/theme-toggle-patterns.ts

export const themeToggleTestPatterns = {
  // TDD pattern for theme toggle
  themeToggleTDDPattern: `
describe('ThemeToggle - Phase 6.5 TDD Implementation', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset system time to spring for consistent seasonal theme testing
    mockSeasonalDate('2024-03-21T12:00:00Z');
  });

  describe('RED PHASE: Failing Tests Define Requirements', () => {
    test('should toggle between light and dark themes with glass adaptation', async () => {
      // GIVEN: Theme toggle with seasonal integration
      const user = userEvent.setup();
      
      renderWithTheme(
        <ThemeProvider>
          <ThemeToggle seasonalIntegration={true} />
          <div data-testid="glass-element" className="glass-card">Test content</div>
        </ThemeProvider>
      );
      
      // WHEN: User toggles to dark theme
      const toggle = screen.getByRole('switch', { name: /theme toggle/i });
      await user.click(toggle);
      
      // THEN: Should update document theme class
      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark');
      });
      
      // THEN: Should adapt glass effects for dark theme
      const glassElement = screen.getByTestId('glass-element');
      expect(glassElement).toHaveAttribute('data-theme-adapted', 'dark');
    });

    test('should persist theme preference in localStorage', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(
        <ThemeProvider>
          <ThemeToggle persistPreferences={true} />
        </ThemeProvider>
      );
      
      // WHEN: User changes theme
      const toggle = screen.getByRole('switch', { name: /theme toggle/i });
      await user.click(toggle);
      
      // THEN: Should save preference to localStorage
      expect(localStorage.getItem('theme-preference')).toBe('dark');
    });

    test('should integrate with seasonal themes correctly', () => {
      // GIVEN: Spring season with dark theme preference
      mockSeasonalDate('2024-03-21T12:00:00Z'); // Spring equinox
      
      renderWithTheme(
        <SeasonalThemeProvider>
          <ThemeProvider defaultTheme="dark">
            <ThemeToggle seasonalIntegration={true} />
            <div data-testid="seasonal-glass" className="seasonal-glass-card">
              Seasonal content
            </div>
          </ThemeProvider>
        </SeasonalThemeProvider>
      );
      
      // THEN: Should combine dark theme with spring seasonal theme
      const seasonalElement = screen.getByTestId('seasonal-glass');
      expect(seasonalElement).toHaveClass('spring-theme');
      expect(seasonalElement).toHaveClass('dark-mode');
      expect(seasonalElement).toHaveAttribute('data-particle-type', 'sakura');
    });
  });

  describe('GREEN PHASE: Minimal Implementation', () => {
    test('renders toggle switch', () => {
      renderWithTheme(<ThemeToggle />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });
  });

  describe('REFACTOR PHASE: Enhanced Implementation', () => {
    test('supports keyboard navigation and accessibility', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(<ThemeToggle />);
      
      const toggle = screen.getByRole('switch');
      
      // Should be focusable
      toggle.focus();
      expect(toggle).toHaveFocus();
      
      // Should toggle with keyboard
      await user.keyboard('{Space}');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });
  });
});`
};
```

### Performance Testing Configuration

#### E2E Performance Tests
```typescript
// tests/e2e/phase6-performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Phase 6 Performance Tests', () => {
  test('Category page meets Core Web Vitals with glass effects', async ({ page }) => {
    // Navigate to category page
    await page.goto('/categories/liquid-glass-techniques');
    
    // Wait for glass effects to load
    await page.waitForSelector('[data-testid="liquid-glass-card"]', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries.find(entry => entry.entryType === 'largest-contentful-paint');
          const cls = entries.filter(entry => entry.entryType === 'layout-shift');
          
          resolve({
            lcp: lcp?.startTime || 0,
            cls: cls.reduce((sum, entry) => sum + entry.value, 0)
          });
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
        
        // Trigger timeout after 5 seconds
        setTimeout(() => resolve({ lcp: 0, cls: 0 }), 5000);
      });
    });
    
    // Assert Core Web Vitals targets
    expect(vitals.lcp).toBeLessThan(2500); // LCP < 2.5s
    expect(vitals.cls).toBeLessThan(0.1);  // CLS < 0.1
  });

  test('Glass effects maintain 60fps during theme transitions', async ({ page }) => {
    await page.goto('/');
    
    // Start performance measurement
    await page.evaluate(() => {
      window.performanceData = {
        frameCount: 0,
        startTime: performance.now(),
        frameTimeSum: 0
      };
      
      const measureFrame = () => {
        const frameStart = performance.now();
        window.performanceData.frameCount++;
        
        requestAnimationFrame(() => {
          const frameEnd = performance.now();
          window.performanceData.frameTimeSum += (frameEnd - frameStart);
          
          if (frameEnd - window.performanceData.startTime < 2000) {
            measureFrame();
          }
        });
      };
      
      measureFrame();
    });
    
    // Trigger theme toggle
    await page.click('[data-testid="theme-toggle"]');
    
    // Wait for transition to complete
    await page.waitForTimeout(2100);
    
    // Get performance results
    const performanceResults = await page.evaluate(() => {
      const data = window.performanceData;
      return {
        averageFrameTime: data.frameTimeSum / data.frameCount,
        frameCount: data.frameCount,
        totalTime: performance.now() - data.startTime
      };
    });
    
    // Assert 60fps performance (16.67ms per frame)
    expect(performanceResults.averageFrameTime).toBeLessThan(16.67);
    expect(performanceResults.frameCount).toBeGreaterThan(100); // At least 50fps for 2 seconds
  });
});
```

## 📊 Quality Metrics for Phase 6 Continuation

### Coverage Targets
- **Line Coverage**: >95% (targeting 97% for critical paths)
- **Branch Coverage**: >90% (targeting 93% for conditional logic)
- **Function Coverage**: >95% (targeting 98% for public APIs)
- **Statement Coverage**: >95% (targeting 97% overall)

### Performance Targets
- **Core Web Vitals**: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1
- **Glass Effects**: 60fps consistent performance
- **Bundle Size**: <250KB total, <85KB first load
- **Network**: <5 requests for critical path, <2s TTI

### Accessibility Targets
- **WCAG Compliance**: 2.1 AA level across all components
- **Keyboard Navigation**: 100% functionality accessible via keyboard
- **Screen Reader**: Complete compatibility with NVDA, JAWS, VoiceOver
- **Motion Preferences**: Respect for prefers-reduced-motion setting

### Cross-Browser Targets
- **Chrome**: 90+ (current and previous version)
- **Firefox**: 90+ (current and previous version)  
- **Safari**: 14+ (current and previous major version)
- **Edge**: 90+ (current version)
- **Mobile Safari**: iOS 14+
- **Mobile Chrome**: Android 8+

---

This comprehensive TDD environment configuration provides the foundation for rigorous test-driven development of Phase 6 continuation tasks with full liquid glass effect integration and enterprise-grade quality standards.