# TDD Test Templates - Phase 6.2: Article List/Detail Pages

## ArticleCard Component Test Template

### Primary Test Suite: Core Functionality

```typescript
// tests/components/ui/ArticleCard.test.tsx
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { SeasonalThemeProvider } from '@/lib/theme/SeasonalThemeProvider';

describe('ArticleCard', () => {
  const mockArticle = {
    id: 'article-1',
    title: 'Mastering Liquid Glass Effects',
    excerpt: 'Learn how to create stunning glassmorphism effects with modern CSS and React.',
    slug: 'mastering-liquid-glass-effects',
    eyecatchImage: {
      url: 'https://example.com/image.webp',
      alt: 'Liquid glass effect demonstration',
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'
    },
    publishedAt: '2024-08-15T10:00:00Z',
    readingTime: 8,
    tags: [
      { name: 'CSS', color: '#3b82f6' },
      { name: 'React', color: '#ef4444' }
    ],
    category: { name: 'Tutorial', icon: '📚' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('Core Rendering', () => {
    test('should render article information correctly', () => {
      // GIVEN: Article card component with mock data
      render(<ArticleCard article={mockArticle} variant="glass-medium" />);

      // THEN: Should display all article information
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByText('Mastering Liquid Glass Effects')).toBeInTheDocument();
      expect(screen.getByText(/Learn how to create stunning glassmorphism/)).toBeInTheDocument();
      expect(screen.getByText('8 min read')).toBeInTheDocument();
      expect(screen.getByText('CSS')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('📚 Tutorial')).toBeInTheDocument();
    });

    test('should apply liquid glass effects with correct variant', () => {
      // GIVEN: Article card with glass-medium variant
      render(<ArticleCard article={mockArticle} variant="glass-medium" />);

      // THEN: Should apply medium glass effect styles
      const card = screen.getByRole('article');
      expect(card).toHaveStyle({
        backdropFilter: 'blur(15px) saturate(1.5)',
        willChange: 'transform',
        contain: 'layout style paint'
      });
      expect(card).toHaveAttribute('data-glass-variant', 'glass-medium');
    });
  });

  describe('Performance Optimization', () => {
    test('should implement lazy loading for images', () => {
      // GIVEN: Article card with lazy loading enabled
      render(<ArticleCard article={mockArticle} lazy={true} />);

      // THEN: Should apply lazy loading attributes
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('decoding', 'async');
      expect(image).toHaveAttribute('src', mockArticle.eyecatchImage.blurDataURL);
    });

    test('should optimize glass effects for low-end devices', async () => {
      // GIVEN: Low-end device simulation
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2 });
      Object.defineProperty(navigator, 'deviceMemory', { value: 2 });

      // WHEN: Article card is rendered
      render(<ArticleCard article={mockArticle} variant="glass-medium" />);

      // THEN: Should apply performance optimizations
      await waitFor(() => {
        const card = screen.getByRole('article');
        expect(card).toHaveAttribute('data-performance-tier', 'low-end');
        expect(card).toHaveStyle({ backdropFilter: 'blur(8px)' });
      });
    });

    test('should meet Core Web Vitals CLS requirements', () => {
      // GIVEN: Article card with proper layout constraints
      const { container } = render(
        <ArticleCard article={mockArticle} variant="glass-medium" />
      );

      // THEN: Should have stable layout dimensions
      const card = container.querySelector('[role="article"]');
      expect(card).toHaveStyle({
        aspectRatio: '16 / 9',
        minHeight: '320px'
      });
      
      // THEN: Should reserve space for image
      const imageContainer = screen.getByTestId('image-container');
      expect(imageContainer).toHaveAttribute('style', expect.stringContaining('aspect-ratio'));
    });
  });

  describe('Seasonal Theme Integration', () => {
    test('should apply spring theme with sakura particles', () => {
      // GIVEN: Spring season (March 21)
      const mockDate = new Date('2024-03-21T10:00:00Z');
      vi.setSystemTime(mockDate);

      // WHEN: Article card is rendered with seasonal theme
      render(
        <SeasonalThemeProvider>
          <ArticleCard article={mockArticle} seasonalTheme={true} />
        </SeasonalThemeProvider>
      );

      // THEN: Should apply spring theme
      const card = screen.getByRole('article');
      expect(card).toHaveClass('spring-theme');
      expect(card).toHaveAttribute('data-particle-type', 'sakura');
      expect(card).toHaveStyle({
        backgroundColor: expect.stringMatching(/rgba.*255, 182, 193/)
      });
    });

    test('should adapt theme based on time of day', () => {
      // GIVEN: Evening time (19:00)
      const mockDate = new Date('2024-08-15T19:00:00Z');
      vi.setSystemTime(mockDate);

      // WHEN: Article card is rendered with seasonal theme
      render(
        <SeasonalThemeProvider>
          <ArticleCard article={mockArticle} seasonalTheme={true} />
        </SeasonalThemeProvider>
      );

      // THEN: Should apply evening color adjustments
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('data-time-of-day', 'evening');
      expect(card).toHaveStyle({
        filter: expect.stringContaining('brightness(0.8)')
      });
    });
  });

  describe('Interactive Behavior', () => {
    test('should handle hover interactions smoothly', async () => {
      // GIVEN: Interactive article card
      const user = userEvent.setup();
      const onView = vi.fn();

      render(
        <ArticleCard 
          article={mockArticle} 
          interactive={true} 
          onView={onView}
        />
      );

      // WHEN: User hovers over card
      const card = screen.getByRole('article');
      await user.hover(card);

      // THEN: Should trigger hover animations
      expect(card).toHaveStyle({
        transform: 'scale(1.02)',
        cursor: 'pointer'
      });

      // WHEN: User clicks the card
      await user.click(card);

      // THEN: Should call onView callback
      expect(onView).toHaveBeenCalledTimes(1);
    });

    test('should be accessible via keyboard navigation', async () => {
      // GIVEN: Interactive article card
      const user = userEvent.setup();

      render(<ArticleCard article={mockArticle} interactive={true} />);

      // WHEN: User navigates with Tab key
      await user.tab();

      // THEN: Should focus on the card
      const card = screen.getByRole('article');
      expect(card).toHaveFocus();
      expect(card).toHaveAttribute('tabindex', '0');

      // WHEN: User presses Enter
      await user.keyboard('{Enter}');

      // THEN: Should trigger navigation (tested via mock router)
      // Implementation specific assertion here
    });
  });

  describe('Error Handling', () => {
    test('should handle missing image gracefully', () => {
      // GIVEN: Article without eyecatch image
      const articleWithoutImage = {
        ...mockArticle,
        eyecatchImage: null
      };

      // WHEN: Article card is rendered
      render(<ArticleCard article={articleWithoutImage} />);

      // THEN: Should display placeholder
      expect(screen.getByTestId('image-placeholder')).toBeInTheDocument();
      expect(screen.getByText('Mastering Liquid Glass Effects')).toBeInTheDocument();
    });

    test('should handle long titles gracefully', () => {
      // GIVEN: Article with very long title
      const articleWithLongTitle = {
        ...mockArticle,
        title: 'This is an extremely long article title that should be truncated properly to maintain layout consistency and prevent overflow issues in the card component'
      };

      // WHEN: Article card is rendered
      render(<ArticleCard article={articleWithLongTitle} />);

      // THEN: Should truncate title appropriately
      const titleElement = screen.getByText(/This is an extremely long article title/);
      expect(titleElement).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: '2'
      });
    });
  });
});
```

## ArticlePage Component Test Template

### Primary Test Suite: MDX Integration

```typescript
// tests/app/articles/[slug]/page.test.tsx
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ArticlePage } from '@/app/articles/[slug]/page';
import { MDXProvider } from '@/components/mdx/MDXProvider';

describe('ArticlePage', () => {
  const mockArticle = {
    id: 'article-1',
    title: 'Advanced Liquid Glass Techniques',
    content: `
# Advanced Liquid Glass Techniques

This article explores advanced techniques for creating stunning liquid glass effects.

<LiquidGlassCard variant="glass-medium">
  <h2>Interactive Glass Demo</h2>
  <p>This is a beautiful glass card embedded in the article content.</p>
</LiquidGlassCard>

## Performance Considerations

When implementing liquid glass effects, consider these factors:

<EffectDemo effectId="performance-optimized-glass" />

<CodePreview language="css">
.liquid-glass {
  backdrop-filter: blur(15px) saturate(1.5);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</CodePreview>
    `,
    metadata: {
      author: 'Glass Expert',
      publishedAt: '2024-08-15T10:00:00Z',
      updatedAt: '2024-08-15T10:00:00Z',
      readingTime: 12,
      wordCount: 2500
    },
    seo: {
      title: 'Advanced Liquid Glass Techniques | Liquid Glass Tech Blog',
      description: 'Learn advanced techniques for creating stunning liquid glass effects with optimal performance.',
      keywords: ['liquid glass', 'glassmorphism', 'CSS', 'performance'],
      ogImage: 'https://example.com/og-image.webp'
    },
    liquidGlassEffects: [
      { id: 'performance-optimized-glass', name: 'Performance Optimized Glass' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Rendering', () => {
    test('should render article content with MDX components', () => {
      // GIVEN: Article page with MDX content
      render(
        <MDXProvider>
          <ArticlePage article={mockArticle} enableTOC={true} />
        </MDXProvider>
      );

      // THEN: Should render main article content
      expect(screen.getByText('Advanced Liquid Glass Techniques')).toBeInTheDocument();
      expect(screen.getByText(/This article explores advanced techniques/)).toBeInTheDocument();

      // THEN: Should render embedded liquid glass components
      expect(screen.getByText('Interactive Glass Demo')).toBeInTheDocument();
      expect(screen.getByText('This is a beautiful glass card embedded')).toBeInTheDocument();

      // THEN: Should render effect demos
      expect(screen.getByTestId('effect-demo-performance-optimized-glass')).toBeInTheDocument();

      // THEN: Should render code previews
      expect(screen.getByText('.liquid-glass {')).toBeInTheDocument();
    });

    test('should generate table of contents from headings', () => {
      // GIVEN: Article page with TOC enabled
      render(
        <MDXProvider>
          <ArticlePage article={mockArticle} enableTOC={true} />
        </MDXProvider>
      );

      // THEN: Should display table of contents
      const toc = screen.getByRole('navigation', { name: /table of contents/i });
      expect(toc).toBeInTheDocument();

      // THEN: Should include links to headings
      expect(screen.getByRole('link', { name: /performance considerations/i })).toBeInTheDocument();
    });
  });

  describe('Performance Optimization', () => {
    test('should implement proper meta tags for SEO', () => {
      // GIVEN: Article page component
      render(
        <MDXProvider>
          <ArticlePage article={mockArticle} />
        </MDXProvider>
      );

      // THEN: Should set proper document title
      expect(document.title).toBe('Advanced Liquid Glass Techniques | Liquid Glass Tech Blog');

      // THEN: Should include meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription?.getAttribute('content')).toBe(mockArticle.seo.description);

      // THEN: Should include Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute('content')).toBe(mockArticle.seo.title);
    });

    test('should implement structured data for articles', () => {
      // GIVEN: Article page component
      render(
        <MDXProvider>
          <ArticlePage article={mockArticle} />
        </MDXProvider>
      );

      // THEN: Should include JSON-LD structured data
      const structuredData = document.querySelector('script[type="application/ld+json"]');
      expect(structuredData).toBeInTheDocument();

      const jsonData = JSON.parse(structuredData?.textContent || '{}');
      expect(jsonData['@type']).toBe('Article');
      expect(jsonData.headline).toBe(mockArticle.title);
      expect(jsonData.wordCount).toBe(mockArticle.metadata.wordCount);
    });
  });

  describe('Accessibility Compliance', () => {
    test('should have proper heading hierarchy', () => {
      // GIVEN: Article page with content
      render(
        <MDXProvider>
          <ArticlePage article={mockArticle} />
        </MDXProvider>
      );

      // THEN: Should have proper heading structure
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Advanced Liquid Glass Techniques');

      const h2 = screen.getByRole('heading', { level: 2, name: /performance considerations/i });
      expect(h2).toBeInTheDocument();
    });

    test('should support keyboard navigation in TOC', async () => {
      // GIVEN: Article page with TOC
      const user = userEvent.setup();
      
      render(
        <MDXProvider>
          <ArticlePage article={mockArticle} enableTOC={true} />
        </MDXProvider>
      );

      // WHEN: User navigates TOC with keyboard
      const tocLink = screen.getByRole('link', { name: /performance considerations/i });
      await user.tab();
      
      // THEN: Should focus TOC links
      expect(tocLink).toHaveFocus();

      // WHEN: User activates link
      await user.keyboard('{Enter}');

      // THEN: Should scroll to section (mock implementation)
      expect(window.location.hash).toBe('#performance-considerations');
    });
  });

  describe('Related Articles', () => {
    test('should display related articles when provided', () => {
      // GIVEN: Article with related articles
      const relatedArticles = [
        { id: '2', title: 'Basic Glass Effects', slug: 'basic-glass-effects' },
        { id: '3', title: 'Glass Performance Tips', slug: 'glass-performance-tips' }
      ];

      render(
        <MDXProvider>
          <ArticlePage 
            article={mockArticle} 
            relatedArticles={relatedArticles}
          />
        </MDXProvider>
      );

      // THEN: Should display related articles section
      expect(screen.getByText(/related articles/i)).toBeInTheDocument();
      expect(screen.getByText('Basic Glass Effects')).toBeInTheDocument();
      expect(screen.getByText('Glass Performance Tips')).toBeInTheDocument();
    });
  });
});
```

## Performance Testing Template

### Core Web Vitals Testing

```typescript
// tests/performance/article-page-cwv.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Article Page Core Web Vitals', () => {
  test('should meet LCP target of 2.5 seconds', async ({ page }) => {
    // Navigate to article page
    await page.goto('/articles/mastering-liquid-glass-effects');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcpEntry = entries[entries.length - 1];
          resolve(lcpEntry.startTime);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    expect(lcp).toBeLessThan(2500);
  });

  test('should maintain CLS below 0.1', async ({ page }) => {
    await page.goto('/articles/mastering-liquid-glass-effects');

    // Wait for complete loading
    await page.waitForTimeout(3000);

    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          resolve(clsValue);
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Trigger potential layout shifts
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 2000);
      });
    });

    expect(cls).toBeLessThan(0.1);
  });

  test('should maintain 60fps during glass effect animations', async ({ page }) => {
    await page.goto('/articles/mastering-liquid-glass-effects');

    // Trigger glass effect animations
    const frameData = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frames = [];
        let lastTimestamp = performance.now();

        function measureFrame() {
          const currentTime = performance.now();
          const frameDuration = currentTime - lastTimestamp;
          frames.push(frameDuration);
          lastTimestamp = currentTime;

          if (frames.length < 60) {
            requestAnimationFrame(measureFrame);
          } else {
            const averageFrameTime = frames.reduce((sum, time) => sum + time, 0) / frames.length;
            const droppedFrames = frames.filter(time => time > 16.67).length;
            resolve({ averageFrameTime, droppedFrames });
          }
        }

        // Start animation
        document.querySelectorAll('[data-effect="liquid-glass"]').forEach(el => {
          el.style.transform = 'scale(1.05)';
        });

        requestAnimationFrame(measureFrame);
      });
    });

    expect(frameData.averageFrameTime).toBeLessThan(16.67); // 60fps
    expect(frameData.droppedFrames).toBeLessThan(3); // Max 5% dropped frames
  });
});
```

## Integration Testing Template

### Glass Effects Integration

```typescript
// tests/integration/liquid-glass-showcase.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Liquid Glass Effects Integration', () => {
  test('should render glass effects consistently across themes', async ({ page }) => {
    // Test light theme
    await page.goto('/articles/mastering-liquid-glass-effects');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

    let glassElement = page.locator('[data-effect="liquid-glass"]').first();
    let lightThemeStyles = await glassElement.evaluate(el => getComputedStyle(el).backdropFilter);

    // Test dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(500); // Allow theme transition

    let darkThemeStyles = await glassElement.evaluate(el => getComputedStyle(el).backdropFilter);

    // Both themes should have backdrop-filter applied
    expect(lightThemeStyles).toContain('blur(');
    expect(darkThemeStyles).toContain('blur(');
  });

  test('should adapt effects for different screen sizes', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/articles/mastering-liquid-glass-effects');

    let desktopBlur = await page.locator('[data-effect="liquid-glass"]').first()
      .evaluate(el => getComputedStyle(el).backdropFilter);

    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    let mobileBlur = await page.locator('[data-effect="liquid-glass"]').first()
      .evaluate(el => getComputedStyle(el).backdropFilter);

    // Mobile should have reduced blur for performance
    expect(desktopBlur).toContain('blur(15px)');
    expect(mobileBlur).toContain('blur(8px)');
  });

  test('should respect prefers-reduced-motion setting', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/articles/mastering-liquid-glass-effects');

    // Check that animations are disabled
    const animationDuration = await page.locator('[data-effect="liquid-glass"]').first()
      .evaluate(el => getComputedStyle(el).transitionDuration);

    expect(animationDuration).toBe('0s');
  });
});
```

This comprehensive TDD template set provides the foundation for implementing Phase 6.2 components with strict test-first development, performance optimization, and accessibility compliance.