/**
 * Test Utilities for Liquid Glass Tech Blog TDD Environment
 * 
 * Comprehensive testing helpers for:
 * - Liquid glass component rendering and validation
 * - Seasonal theme testing and weather mocking
 * - Performance metrics and GPU acceleration testing
 * - Accessibility compliance validation (WCAG 2.1 AA)
 * - MDX content and React component integration
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { vi, MockedFunction } from 'vitest';
import type {
  SeasonalTheme,
  BlogPost,
  EffectData,
  PerformanceMetrics,
  LiquidGlassVariant,
  Season,
  TimeOfDay,
  Weather
} from '@/types';

// =============================================================================
// MOCK DATA FACTORIES
// =============================================================================

/**
 * Creates a mock seasonal theme for testing
 */
export const createMockSeasonalTheme = (
  season: Season = 'spring',
  timeOfDay: TimeOfDay = 'day',
  weather: Weather = 'sunny'
): SeasonalTheme => ({
  id: `${season}-${timeOfDay}-${weather}`,
  season,
  timeOfDay,
  weather,
  colors: {
    primary: season === 'spring' ? '#ffb3d9' : '#4f46e5',
    secondary: '#6366f1',
    accent: '#f59e0b',
    background: timeOfDay === 'night' ? '#1f2937' : '#f9fafb',
    surface: timeOfDay === 'night' ? '#374151' : '#ffffff',
    text: timeOfDay === 'night' ? '#f9fafb' : '#1f2937',
    muted: '#6b7280'
  },
  glassMorphism: {
    backdropFilter: 'blur(15px) saturate(1.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(0, 0, 0, 0.1)'
  },
  particles: {
    type: season === 'spring' ? 'sakura' : 'none',
    count: 20,
    size: [2, 5],
    speed: 1,
    opacity: 0.6,
    color: season === 'spring' ? '#ffb3d9' : undefined
  },
  animations: {
    transition: 'all 0.3s ease-out',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: 300
  }
});

/**
 * Creates a mock blog post for testing
 */
export const createMockBlogPost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  id: 'test-post-1',
  slug: 'advanced-liquid-glass-effects',
  title: 'Advanced Liquid Glass Effects with React',
  description: 'Learn how to create stunning liquid glass effects using modern CSS and React components.',
  content: '# Advanced Liquid Glass Effects\n\nThis post demonstrates liquid glass effects...',
  eyecatchImage: {
    id: 'test-image-1',
    url: 'https://example.com/test-image.webp',
    webpUrl: 'https://example.com/test-image.webp',
    alt: 'Liquid glass effect demonstration',
    width: 768,
    height: 432,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    generatedBy: 'ai',
    aiPrompt: 'liquid glass effect with modern UI elements',
    optimizationMetrics: {
      originalSize: 150000,
      compressedSize: 45000,
      compressionRatio: 0.3,
      format: 'webp',
      quality: 80
    }
  },
  author: {
    id: 'author-1',
    name: 'Jane Designer',
    email: 'jane@example.com',
    avatar: 'https://example.com/avatar.webp',
    bio: 'UI/UX Designer specializing in glassmorphism',
    social: {
      twitter: '@janedesigner',
      github: 'janedesigner'
    }
  },
  category: {
    id: 'cat-1',
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'User interface and experience design tutorials',
    color: '#3b82f6',
    postCount: 12
  },
  tags: [
    { id: 'tag-1', name: 'Liquid Glass', slug: 'liquid-glass', color: '#06b6d4', postCount: 8 },
    { id: 'tag-2', name: 'React', slug: 'react', color: '#10b981', postCount: 24 }
  ],
  publishedAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-16'),
  status: 'published',
  seoData: {
    title: 'Advanced Liquid Glass Effects with React | Liquid Glass Tech Blog',
    description: 'Learn how to create stunning liquid glass effects using modern CSS and React components.',
    keywords: ['liquid glass', 'glassmorphism', 'react', 'css', 'ui design'],
    canonicalUrl: 'https://liquidglass.blog/posts/advanced-liquid-glass-effects',
    ogTitle: 'Advanced Liquid Glass Effects with React',
    ogDescription: 'Learn how to create stunning liquid glass effects using modern CSS and React components.',
    ogImage: 'https://example.com/test-image.webp',
    ogType: 'article',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Advanced Liquid Glass Effects with React',
    twitterDescription: 'Learn how to create stunning liquid glass effects using modern CSS and React components.',
    twitterImage: 'https://example.com/test-image.webp',
    structuredData: {
      '@type': 'BlogPosting',
      headline: 'Advanced Liquid Glass Effects with React',
      author: { '@type': 'Person', name: 'Jane Designer' }
    }
  },
  readingTime: 8,
  viewCount: 1250,
  metadata: {
    difficulty: 'intermediate',
    codeExamples: true,
    interactiveDemo: true,
    performanceNotes: true,
    accessibilityInfo: true
  },
  ...overrides
});

/**
 * Creates a mock effect data for testing
 */
export const createMockEffectData = (overrides: Partial<EffectData> = {}): EffectData => ({
  id: 'effect-1',
  name: 'Floating Glass Card',
  description: 'A floating card with subtle glass morphism effect',
  code: `
    .glass-card {
      backdrop-filter: blur(15px) saturate(1.8);
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
    }
  `,
  parameters: {
    blur: 15,
    opacity: 0.1,
    saturation: 1.8,
    brightness: 1.0,
    borderRadius: 12,
    animation: {
      type: 'float',
      duration: 3000,
      easing: 'ease-in-out'
    }
  },
  previewImage: 'https://example.com/effect-preview.webp',
  category: 'cards',
  difficulty: 'beginner',
  performance: createMockPerformanceMetrics(),
  compatibility: {
    chrome: '76+',
    firefox: '103+',
    safari: '14+',
    edge: '79+',
    mobile: {
      ios: '14.0+',
      android: '10+'
    },
    fallback: true,
    notes: 'Graceful degradation to solid background on unsupported browsers'
  },
  createdBy: 'test-user',
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-10'),
  downloads: 156,
  likes: 89,
  tags: ['glass', 'card', 'float', 'beginner'],
  ...overrides
});

/**
 * Creates mock performance metrics for testing
 */
export const createMockPerformanceMetrics = (overrides: Partial<PerformanceMetrics> = {}): PerformanceMetrics => ({
  lcp: 2200, // < 2500ms target
  inp: 180, // < 200ms target
  cls: 0.08, // < 0.1 target
  fcp: 1800,
  ttfb: 800,
  effectRenderTime: 12,
  gpuUsage: 45,
  memoryUsage: 128,
  fps: 60,
  frameDrops: 0,
  ...overrides
});

// =============================================================================
// CUSTOM RENDER FUNCTIONS
// =============================================================================

/**
 * Theme Provider Mock for testing seasonal themes
 */
export const MockThemeProvider = ({ 
  children, 
  theme = createMockSeasonalTheme() 
}: { 
  children: ReactNode;
  theme?: SeasonalTheme;
}) => {
  return (
    <div data-testid="theme-provider" data-theme={theme.id}>
      {children}
    </div>
  );
};

/**
 * Liquid Glass Component Mock for testing
 */
export const MockLiquidGlass = ({ 
  children, 
  variant = 'medium',
  className = '',
  ...props 
}: {
  children: ReactNode;
  variant?: LiquidGlassVariant;
  className?: string;
  [key: string]: any;
}) => (
  <div
    data-testid="liquid-glass"
    data-variant={variant}
    className={`liquid-glass ${className}`}
    style={{
      backdropFilter: `blur(${props.blur || 15}px) saturate(${props.saturation || 1.8})`,
      backgroundColor: `rgba(255, 255, 255, ${props.opacity || 0.1})`
    }}
    {...props}
  >
    {children}
  </div>
);

/**
 * Custom render function with theme provider
 */
export const renderWithTheme = (
  ui: ReactElement,
  options: {
    theme?: SeasonalTheme;
    renderOptions?: Omit<RenderOptions, 'wrapper'>;
  } = {}
): RenderResult => {
  const { theme = createMockSeasonalTheme(), renderOptions } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MockThemeProvider theme={theme}>
      {children}
    </MockThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Custom render function with liquid glass context
 */
export const renderWithLiquidGlass = (
  ui: ReactElement,
  options: RenderOptions = {}
): RenderResult => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div data-testid="liquid-glass-provider">
      {children}
    </div>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// =============================================================================
// MOCK FUNCTIONS AND SPIES
// =============================================================================

/**
 * Mock performance observer for testing
 */
export const mockPerformanceObserver = () => {
  const mockObserve = vi.fn();
  const mockDisconnect = vi.fn();
  const mockTakeRecords = vi.fn(() => []);

  global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    takeRecords: mockTakeRecords
  })) as any;

  return { mockObserve, mockDisconnect, mockTakeRecords };
};

/**
 * Mock intersection observer for lazy loading tests
 */
export const mockIntersectionObserver = () => {
  const mockObserve = vi.fn();
  const mockUnobserve = vi.fn();
  const mockDisconnect = vi.fn();

  global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect
  })) as any;

  return { mockObserve, mockUnobserve, mockDisconnect };
};

/**
 * Mock CSS.supports for backdrop-filter testing
 */
export const mockCSSSupports = (supports: boolean = true) => {
  Object.defineProperty(CSS, 'supports', {
    writable: true,
    value: vi.fn((property: string, value: string) => {
      if (property === 'backdrop-filter') {
        return supports;
      }
      return true;
    })
  });
};

/**
 * Mock window.matchMedia for responsive and accessibility tests
 */
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

/**
 * Mock weather API response for seasonal theme testing
 */
export const mockWeatherAPI = (weather: Weather = 'sunny', temperature: number = 20) => {
  (global.fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      weather: [{ main: weather, description: `${weather} weather` }],
      main: { temp: temperature, humidity: 65 }
    })
  } as Response);
};

// =============================================================================
// ASSERTION HELPERS
// =============================================================================

/**
 * Assert that element has liquid glass effect applied
 */
export const expectLiquidGlassEffect = (element: HTMLElement, variant?: LiquidGlassVariant) => {
  expect(element).toHaveAttribute('data-testid', 'liquid-glass');
  
  if (variant) {
    expect(element).toHaveAttribute('data-variant', variant);
  }
  
  const style = getComputedStyle(element);
  expect(style.backdropFilter).toMatch(/blur\(\d+px\)/);
};

/**
 * Assert that element meets WCAG accessibility standards
 */
export const expectAccessibilityCompliance = (element: HTMLElement) => {
  // Check for ARIA attributes
  const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
  expect(hasAriaLabel || element.textContent).toBeTruthy();
  
  // Check for proper role
  const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
  const hasRole = element.hasAttribute('role') || interactiveElements.includes(element.tagName.toLowerCase());
  expect(hasRole).toBe(true);
  
  // Check tabindex for keyboard navigation
  if (element.hasAttribute('tabindex')) {
    const tabIndex = parseInt(element.getAttribute('tabindex') || '0');
    expect(tabIndex).toBeGreaterThanOrEqual(-1);
  }
};

/**
 * Assert performance metrics meet requirements
 */
export const expectPerformanceCompliance = (metrics: PerformanceMetrics) => {
  expect(metrics.lcp).toBeLessThan(2500); // < 2.5s
  expect(metrics.inp).toBeLessThan(200);  // < 200ms
  expect(metrics.cls).toBeLessThan(0.1);  // < 0.1
  expect(metrics.fps).toBeGreaterThanOrEqual(55); // ~60fps with tolerance
};

/**
 * Wait for liquid glass animation to complete
 */
export const waitForLiquidGlassAnimation = async (timeout: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

// =============================================================================
// TEST ENVIRONMENT UTILITIES
// =============================================================================

/**
 * Setup test environment for liquid glass effects
 */
export const setupLiquidGlassTestEnvironment = () => {
  mockCSSSupports(true);
  mockIntersectionObserver();
  mockPerformanceObserver();
  mockMatchMedia(false); // Default to no reduced motion
  
  // Mock requestAnimationFrame for smooth animations
  global.requestAnimationFrame = vi.fn(callback => {
    setTimeout(callback, 16); // ~60fps
    return 1;
  });
  
  global.cancelAnimationFrame = vi.fn();
  
  return {
    cleanup: () => {
      vi.restoreAllMocks();
    }
  };
};

/**
 * Setup accessibility testing environment
 */
export const setupAccessibilityTestEnvironment = () => {
  // Mock screen reader announcements
  const mockAnnounce = vi.fn();
  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: {
      speak: mockAnnounce,
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn()
    }
  });
  
  return { mockAnnounce };
};

/**
 * Generate test ID for consistent test identification
 */
export const createTestId = (component: string, variant?: string) => {
  return variant ? `${component}-${variant}` : component;
};

export default {
  createMockSeasonalTheme,
  createMockBlogPost,
  createMockEffectData,
  createMockPerformanceMetrics,
  renderWithTheme,
  renderWithLiquidGlass,
  expectLiquidGlassEffect,
  expectAccessibilityCompliance,
  expectPerformanceCompliance,
  setupLiquidGlassTestEnvironment,
  setupAccessibilityTestEnvironment
};