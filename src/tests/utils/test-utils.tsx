import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

// Mock providers for testing
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Custom test utilities for liquid glass components
export const renderWithLiquidGlass = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const LiquidGlassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div data-testid="liquid-glass-provider">
      <AllTheProviders>{children}</AllTheProviders>
    </div>
  );

  return render(ui, { wrapper: LiquidGlassProvider, ...options });
};

// Theme testing utilities
export const renderWithTheme = (
  ui: React.ReactElement,
  theme: 'light' | 'dark' = 'light',
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div data-theme={theme} className={theme}>
      <AllTheProviders>{children}</AllTheProviders>
    </div>
  );

  return render(ui, { wrapper: ThemeProvider, ...options });
};

// Seasonal theme testing utilities
export const renderWithSeasonalTheme = (
  ui: React.ReactElement,
  season: 'spring' | 'summer' | 'autumn' | 'winter' = 'spring',
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const SeasonalThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div data-season={season} className={`season-${season}`}>
      <AllTheProviders>{children}</AllTheProviders>
    </div>
  );

  return render(ui, { wrapper: SeasonalThemeProvider, ...options });
};

// Performance testing utilities
export const mockPerformanceObserver = () => {
  const mockEntries = [
    {
      name: 'LCP',
      entryType: 'largest-contentful-paint',
      startTime: 1200,
      value: 1200
    },
    {
      name: 'FCP',
      entryType: 'paint',
      startTime: 800,
      value: 800
    },
    {
      name: 'CLS',
      entryType: 'layout-shift',
      value: 0.05
    }
  ];

  const mockObserver = {
    observe: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn().mockReturnValue(mockEntries)
  };

  global.PerformanceObserver = vi.fn().mockImplementation((callback) => {
    callback({ getEntries: () => mockEntries });
    return mockObserver;
  }) as any;

  return { mockObserver, mockEntries };
};

// GPU acceleration testing utilities
export const mockGPUAcceleration = () => {
  const mockGetContext = vi.fn().mockReturnValue({
    canvas: { width: 1920, height: 1080 },
    drawingBufferWidth: 1920,
    drawingBufferHeight: 1080,
    getParameter: vi.fn().mockImplementation((param) => {
      // Mock GPU info
      if (param === 0x1F00) return 'WebKit WebGL'; // GL_VENDOR
      if (param === 0x1F01) return 'WebKit WebGL'; // GL_RENDERER
      if (param === 0x8B8C) return 16; // GL_MAX_FRAGMENT_UNIFORM_VECTORS
      return null;
    })
  });

  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: mockGetContext,
    writable: true
  });

  return mockGetContext;
};

// Accessibility testing utilities
export const mockAxeCore = () => {
  return {
    run: vi.fn().mockResolvedValue({
      violations: [],
      passes: [],
      incomplete: [],
      inapplicable: []
    }),
    configure: vi.fn(),
    reset: vi.fn()
  };
};

// Animation testing utilities
export const mockFramerMotion = () => {
  return {
    motion: {
      div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
        <div ref={ref} {...props}>{children}</div>
      )),
      button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
        <button ref={ref} {...props}>{children}</button>
      )),
      h1: React.forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => (
        <h1 ref={ref} {...props}>{children}</h1>
      )),
      h2: React.forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => (
        <h2 ref={ref} {...props}>{children}</h2>
      )),
      h3: React.forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => (
        <h3 ref={ref} {...props}>{children}</h3>
      ))
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn()
    }),
    useMotionValue: (initial: any) => ({ get: () => initial, set: vi.fn() })
  };
};

// Date mocking utilities for seasonal theme testing
export const mockDateForSeason = (season: 'spring' | 'summer' | 'autumn' | 'winter') => {
  const seasonDates = {
    spring: '2024-03-21T12:00:00.000Z', // Spring equinox
    summer: '2024-06-21T12:00:00.000Z', // Summer solstice
    autumn: '2024-09-21T12:00:00.000Z', // Autumn equinox
    winter: '2024-12-21T12:00:00.000Z'  // Winter solstice
  };

  const mockDate = new Date(seasonDates[season]);
  vi.setSystemTime(mockDate);
  return mockDate;
};

// Time of day mocking utilities
export const mockTimeOfDay = (timeOfDay: 'morning' | 'day' | 'evening' | 'night') => {
  const timeMap = {
    morning: 8,  // 8 AM
    day: 14,     // 2 PM
    evening: 19, // 7 PM
    night: 23    // 11 PM
  };

  const mockDate = new Date();
  mockDate.setHours(timeMap[timeOfDay], 0, 0, 0);
  vi.setSystemTime(mockDate);
  return mockDate;
};

// Wait for async operations
export const waitForAsync = (ms = 0) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Create mock component factory for testing
export const createMockComponent = (name: string, testId?: string) => {
  const MockComponent = React.forwardRef<HTMLDivElement, any>(
    ({ children, ...props }, ref) => (
      <div 
        ref={ref} 
        data-testid={testId || `mock-${name.toLowerCase()}`} 
        {...props}
      >
        {children}
      </div>
    )
  );
  
  MockComponent.displayName = `Mock${name}`;
  return MockComponent;
};

// Test data factories
export const createMockBlogPost = (overrides = {}) => ({
  id: '1',
  slug: 'test-post',
  title: 'Test Blog Post',
  description: 'A test blog post description',
  content: '# Test Content\n\nThis is test content.',
  eyecatchImage: {
    id: 'img-1',
    url: 'https://example.com/image.jpg',
    webpUrl: 'https://example.com/image.webp',
    alt: 'Test image',
    width: 768,
    height: 432,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ',
    generatedBy: 'ai' as const,
    optimizationMetrics: {
      originalSize: 100000,
      compressedSize: 50000,
      compressionRatio: 0.5
    }
  },
  publishedAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  status: 'published' as const,
  readingTime: 5,
  viewCount: 100,
  ...overrides
});

export const createMockEffectData = (overrides = {}) => ({
  id: 'effect-1',
  name: 'Test Effect',
  description: 'A test liquid glass effect',
  code: 'backdrop-filter: blur(15px);',
  parameters: {
    blur: 15,
    opacity: 0.1,
    saturation: 1.8,
    brightness: 1.0
  },
  previewImage: 'https://example.com/preview.jpg',
  category: 'card' as const,
  difficulty: 'beginner' as const,
  performance: {
    lcp: 1200,
    inp: 150,
    cls: 0.05,
    fcp: 800,
    ttfb: 200,
    effectRenderTime: 16,
    gpuUsage: 30,
    memoryUsage: 50
  },
  compatibility: {
    chrome: true,
    firefox: true,
    safari: true,
    edge: true
  },
  createdBy: 'test-user',
  createdAt: new Date('2024-01-01'),
  downloads: 10,
  likes: 5,
  ...overrides
});