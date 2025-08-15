/**
 * Vitest Setup for Liquid Glass Tech Blog
 * 
 * TDD Environment Configuration:
 * - React Testing Library setup with liquid glass mocks
 * - @developer-hub/liquid-glass library mocking for consistent testing
 * - shadcn/ui component mocking and theme setup
 * - Performance and GPU acceleration mocking
 * - Accessibility testing utilities
 */

import React from 'react';
import { beforeEach, afterEach, vi, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  }),
}));

// Mock Next.js navigation (App Router)
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock @developer-hub/liquid-glass library
vi.mock('@developer-hub/liquid-glass', () => ({
  LiquidGlass: ({ children, className, ...props }: any) => 
    React.createElement('div', {
      'data-testid': 'liquid-glass',
      className,
      'data-variant': props.variant,
      'data-blur': props.blur,
      'data-opacity': props.opacity,
      'data-saturation': props.saturation,
      style: {
        backdropFilter: `blur(${props.blur || 15}px) saturate(${props.saturation || 1.8})`,
        backgroundColor: `rgba(255, 255, 255, ${props.opacity || 0.1})`
      }
    }, children),
  createLiquidGlassTheme: vi.fn((config: any) => ({
    name: config.name,
    variant: config.baseVariant,
    customProperties: config.customProperties
  })),
  useLiquidGlassPerformance: () => ({
    fps: 60,
    gpuUsage: 45,
    renderTime: 8.3,
    isOptimized: true
  }),
  withGlassEffect: (Component: any) => Component
}));

// Mock Motion/Framer Motion
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    h1: ({ children, ...props }: any) => React.createElement('h1', props, children),
    h2: ({ children, ...props }: any) => React.createElement('h2', props, children),
    h3: ({ children, ...props }: any) => React.createElement('h3', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
  useMotionValue: () => ({ set: vi.fn(), get: vi.fn(() => 0) }),
  useSpring: () => ({ set: vi.fn(), get: vi.fn(() => 0) }),
  useTransform: () => ({ set: vi.fn(), get: vi.fn(() => 0) }),
}));

// Mock glasscn-ui components
vi.mock('glasscn-ui', () => ({
  GlassCard: ({ children, className, ...props }: any) => 
    React.createElement('div', { 'data-testid': 'glass-card', className, ...props }, children),
  GlassButton: ({ children, className, ...props }: any) => 
    React.createElement('button', { 'data-testid': 'glass-button', className, ...props }, children),
  ThemeProvider: ({ children }: any) => children,
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    systemTheme: 'light',
    themes: ['light', 'dark'],
    resolvedTheme: 'light',
  }),
  ThemeProvider: ({ children }: any) => children,
}));

// Mock Cloudinary
vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload: vi.fn().mockResolvedValue({
        public_id: 'test-image',
        secure_url: 'https://res.cloudinary.com/test/image/upload/v1/test-image.webp',
        width: 768,
        height: 432,
        format: 'webp'
      }),
    },
    url: vi.fn(() => 'https://res.cloudinary.com/test/image/upload/v1/test-image.webp'),
  },
}));

// Mock OpenAI API
vi.mock('openai', () => ({
  default: class MockOpenAI {
    images = {
      generate: vi.fn().mockResolvedValue({
        data: [
          {
            url: 'https://example.com/generated-image.png',
            revised_prompt: 'A beautiful liquid glass effect for tech blog'
          }
        ]
      })
    };
  }
}));

// Mock Weather API (for seasonal themes)
global.fetch = vi.fn();

// Mock performance APIs for GPU testing
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    observer: vi.fn()
  }
});

// Mock CSS.supports for backdrop-filter testing
Object.defineProperty(CSS, 'supports', {
  writable: true,
  value: vi.fn((property: string, value: string) => {
    // Mock backdrop-filter support based on test needs
    if (property === 'backdrop-filter') {
      return process.env.VITEST_CSS_SUPPORTS_BACKDROP_FILTER !== 'false';
    }
    return true;
  })
});

// Mock Intersection Observer for lazy loading tests
global.IntersectionObserver = class MockIntersectionObserver implements IntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  callback: IntersectionObserverCallback;
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [0];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
} as any;

// Mock ResizeObserver for responsive tests
global.ResizeObserver = class MockResizeObserver {
  constructor(callback: any) {
    this.callback = callback;
  }
  callback: any;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
};

// Mock matchMedia for responsive and accessibility tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: query.includes('prefers-reduced-motion: reduce') ? false : true,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock canvas for GPU-related tests
HTMLCanvasElement.prototype.getContext = vi.fn(function(this: HTMLCanvasElement, contextId: string) {
  if (contextId === '2d') {
    return {
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
    } as any;
  }
  return null;
}) as any;

// Setup for each test
beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();
  
  // Set default CSS supports behavior
  process.env.VITEST_CSS_SUPPORTS_BACKDROP_FILTER = 'true';
  
  // Reset fetch mock
  (global.fetch as any).mockClear();
  
  // Mock successful fetch responses by default
  (global.fetch as any).mockResolvedValue({
    ok: true,
    json: async () => ({
      weather: [{ main: 'Clear', description: 'clear sky' }],
      main: { temp: 20 }
    }),
  });
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Extend expect with custom matchers for TDD assertions
expect.extend({
  toHaveLiquidGlassEffect(received: HTMLElement, expectedVariant?: string) {
    const hasEffect = received.hasAttribute('data-testid') && 
                      received.getAttribute('data-testid') === 'liquid-glass';
    
    if (expectedVariant) {
      const variant = received.getAttribute('data-variant');
      return {
        pass: hasEffect && variant === expectedVariant,
        message: () => 
          `expected element to have liquid glass effect with variant "${expectedVariant}", but got "${variant}"`
      };
    }
    
    return {
      pass: hasEffect,
      message: () => 
        hasEffect 
          ? 'expected element not to have liquid glass effect' 
          : 'expected element to have liquid glass effect'
    };
  },
  
  toBeAccessible(received: HTMLElement) {
    // Basic accessibility checks
    const hasAriaLabel = received.hasAttribute('aria-label') || received.hasAttribute('aria-labelledby');
    const hasRole = received.hasAttribute('role') || received.tagName.toLowerCase() in ['button', 'input', 'a', 'textarea'];
    const hasTabIndex = !received.hasAttribute('tabindex') || parseInt(received.getAttribute('tabindex') || '0') >= -1;
    
    const isAccessible = hasAriaLabel && hasRole && hasTabIndex;
    
    return {
      pass: isAccessible,
      message: () => 
        isAccessible
          ? 'expected element not to be accessible'
          : `expected element to be accessible (missing: ${[
              !hasAriaLabel && 'aria-label',
              !hasRole && 'role',
              !hasTabIndex && 'valid tabindex'
            ].filter(Boolean).join(', ')})`
    };
  },
});

// Global test utilities
export const createMockSeasonalTheme = (season: string = 'spring') => ({
  season,
  timeOfDay: 'day',
  weather: 'sunny',
  glassMorphism: {
    backdropFilter: 'blur(15px) saturate(1.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    particleEffect: season === 'spring' ? 'sakura' : 'none'
  }
});

export const createMockBlogPost = (overrides = {}) => ({
  id: 'test-post-1',
  slug: 'test-liquid-glass-effects',
  title: 'Advanced Liquid Glass Effects with React',
  description: 'Learn how to create stunning liquid glass effects using modern CSS and React.',
  content: '# Test Post\n\nThis is a test post about liquid glass effects.',
  eyecatchImage: {
    url: 'https://example.com/test-image.webp',
    alt: 'Liquid glass effect demonstration',
    width: 768,
    height: 432
  },
  publishedAt: new Date('2024-01-15'),
  tags: ['liquid-glass', 'react', 'css'],
  category: 'tutorial',
  ...overrides
});

// Console warning suppression for known testing issues
const originalError = console.error;
beforeEach(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: Each child in a list should have a unique "key" prop'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterEach(() => {
  console.error = originalError;
});

export {};