import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Mock Theme Provider for testing
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="theme-provider">{children}</div>;
};

// Mock Seasonal Theme Provider
const MockSeasonalThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="seasonal-theme-provider" data-season="spring" data-time="morning">
      {children}
    </div>
  );
};

// Test wrapper with all providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MockThemeProvider>
      <MockSeasonalThemeProvider>
        {children}
      </MockSeasonalThemeProvider>
    </MockThemeProvider>
  );
};

// Type for theme options
interface ThemeOptions {
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  timeOfDay?: 'morning' | 'day' | 'evening' | 'night';
}

// Custom render function with theme support
export const renderWithTheme = (
  ui: React.ReactElement | (() => React.ReactElement),
  themeOptions?: ThemeOptions,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Component = typeof ui === 'function' ? ui : () => ui;
  const ThemedComponent = () => (
    <AllTheProviders>
      <Component />
    </AllTheProviders>
  );
  return render(<ThemedComponent />, options);
};

// Custom render function with shadcn theme support
export const renderWithShadcnTheme = (
  ui: React.ReactElement | (() => React.ReactElement),
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Component = typeof ui === 'function' ? ui : () => ui;
  const ShadcnWrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={{ '--background': '0 0% 100%', '--foreground': '240 10% 3.9%' } as React.CSSProperties}>
      {children}
    </div>
  );
  
  const ThemedComponent = () => (
    <ShadcnWrapper>
      <Component />
    </ShadcnWrapper>
  );
  return render(<ThemedComponent />, options);
};

// Mock seasonal theme data
export const mockSeasonalThemes = {
  spring: {
    season: 'spring' as const,
    timeOfDay: 'morning' as const,
    colors: {
      primary: '#ffb3d9', // Cherry blossom pink
      secondary: '#98fb98', // Light green
      accent: '#ffc0cb', // Pink
      background: 'rgba(255, 255, 255, 0.8)',
      surface: 'rgba(255, 255, 255, 0.6)',
    },
    glassMorphism: {
      backdropFilter: 'blur(15px) saturate(150%)',
      backgroundColor: 'rgba(255, 179, 217, 0.1)',
      borderColor: 'rgba(255, 179, 217, 0.2)',
      shadowColor: 'rgba(255, 179, 217, 0.3)',
    },
    particles: {
      type: 'sakura' as const,
      count: 50,
      size: [4, 8] as [number, number],
      speed: 1.5,
      opacity: 0.7,
    },
  },
  summer: {
    season: 'summer' as const,
    timeOfDay: 'day' as const,
    colors: {
      primary: '#87ceeb', // Sky blue
      secondary: '#20b2aa', // Light sea green
      accent: '#00bfff', // Deep sky blue
      background: 'rgba(135, 206, 235, 0.8)',
      surface: 'rgba(135, 206, 235, 0.6)',
    },
    glassMorphism: {
      backdropFilter: 'blur(20px) saturate(180%)',
      backgroundColor: 'rgba(135, 206, 235, 0.15)',
      borderColor: 'rgba(135, 206, 235, 0.25)',
      shadowColor: 'rgba(135, 206, 235, 0.35)',
    },
    particles: {
      type: 'waterdrops' as const,
      count: 30,
      size: [2, 6] as [number, number],
      speed: 2.0,
      opacity: 0.6,
    },
  },
};

// Mock performance API with comprehensive metrics
export const mockPerformanceAPI = () => {
  const mockEntries = {
    lcp: { name: 'LCP', value: 2200, startTime: 1000 },
    inp: { name: 'INP', value: 150, startTime: 2000 },
    cls: { name: 'CLS', value: 0.05, startTime: 3000 },
  };

  const mockAPI = {
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn((type: string) => {
      if (type === 'measure') {
        return Object.values(mockEntries) as PerformanceEntry[];
      }
      return [];
    }),
    getEntriesByName: vi.fn(),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    now: vi.fn(() => Date.now()),
  };

  // Mock the performance object
  Object.defineProperty(window, 'performance', {
    value: { ...window.performance, ...mockAPI },
    writable: true,
  });

  return mockAPI;
};

// Mock Intersection Observer for lazy loading tests
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

// Mock ResizeObserver for responsive tests
export const mockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  
  window.ResizeObserver = mockResizeObserver;
  return mockResizeObserver;
};

// Mock CSS.supports for backdrop-filter testing
export const mockCSSSupports = (supported: boolean = true) => {
  vi.spyOn(CSS, 'supports').mockImplementation((property: string, value?: string) => {
    if (property === 'backdrop-filter' || 
        property === '(backdrop-filter: blur(1px))' ||
        (property === 'backdrop-filter' && value === 'blur(1px)')) {
      return supported;
    }
    return true;
  });
};

// Mock window.matchMedia for responsive tests
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
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

// Mock reduced motion preference
export const mockPrefersReducedMotion = (reduced: boolean = false) => {
  mockMatchMedia(reduced);
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return {
          matches: reduced,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  });
};

// Mock GPU performance monitoring
export const mockGPUPerformance = () => {
  const mockMetrics = {
    renderTime: 12.5, // ms
    gpuUsage: 45, // percentage
    frameRate: 60, // fps
    memoryUsage: 128, // MB
  };

  // Mock performance.now for frame timing
  let frameCount = 0;
  vi.spyOn(performance, 'now').mockImplementation(() => {
    frameCount++;
    return frameCount * 16.67; // 60fps timing
  });

  return mockMetrics;
};

// Mock weather API for seasonal theme testing
export const mockWeatherAPI = () => {
  const mockWeatherData = {
    current: {
      weather: 'sunny' as const,
      temperature: 22,
      location: 'Tokyo',
      description: 'Clear sky',
    },
  };

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockWeatherData,
  });

  return mockWeatherData;
};

// Mock localStorage for theme persistence testing
export const mockLocalStorage = () => {
  const storage: Record<string, string> = {};
  
  const localStorageMock = {
    getItem: vi.fn((key: string) => storage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key];
    }),
    clear: vi.fn(() => {
      Object.keys(storage).forEach(key => delete storage[key]);
    }),
    length: 0,
    key: vi.fn(),
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  return { localStorageMock, storage };
};

// Helper for testing async components
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Mock Date for seasonal theme testing
export const mockDate = (date: string) => {
  const mockDate = new Date(date);
  vi.setSystemTime(mockDate);
  return mockDate;
};

// Cleanup function for tests
export const cleanupMocks = () => {
  vi.clearAllMocks();
  vi.clearAllTimers();
  vi.useRealTimers();
};

// Export commonly used testing utilities
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { vi } from 'vitest';