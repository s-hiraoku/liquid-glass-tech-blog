import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
// Simplified setup without complex mocks for now

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  }),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Next.js image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => 
    React.createElement('img', { src, alt, ...props }),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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

// Mock requestAnimationFrame for animation testing
global.requestAnimationFrame = vi.fn((callback) => {
  return setTimeout(callback, 16.67); // 60fps
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id);
});

// Mock performance API for Core Web Vitals testing
Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    ...performance,
    getEntriesByType: vi.fn(),
    mark: vi.fn(),
    measure: vi.fn(),
    now: vi.fn(() => Date.now()),
    getEntriesByName: vi.fn(),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
  },
});

// Mock CSS.supports for feature detection
Object.defineProperty(CSS, 'supports', {
  value: vi.fn((property: string, value?: string) => {
    // Mock support for modern CSS features
    if (property === 'backdrop-filter') return true;
    if (property === 'transform-style' && value === 'preserve-3d') return true;
    if (property === 'will-change') return true;
    if (property === 'contain') return true;
    return false;
  }),
});

// Mock localStorage for theme persistence testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};

// Setup for motion preference testing
Object.defineProperty(window, 'navigator', {
  value: {
    ...navigator,
    hardwareConcurrency: 8,
    deviceMemory: 8,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
});

// Mock GeolocationAPI for weather integration
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
});

// Mock MDX processor for testing
vi.mock('@/lib/mdx/mdxProcessor', () => ({
  getAllPosts: vi.fn(),
  processMarkdownToMDX: vi.fn(),
  parseFrontmatter: vi.fn(),
  generateTableOfContents: vi.fn(),
  applySyntaxHighlighting: vi.fn(),
  extractMetadata: vi.fn(),
}));

// Global test utilities
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

// Setup cleanup
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});