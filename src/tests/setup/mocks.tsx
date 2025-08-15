import { vi } from 'vitest';
import React from 'react';

export const setupLiquidGlassMocks = () => {
  // Mock @developer-hub/liquid-glass
  vi.mock('@developer-hub/liquid-glass', () => ({
    LiquidGlass: ({ children, className, variant, theme, ...props }: any) => 
      React.createElement('div', {
        className: `mock-liquid-glass ${className || ''}`,
        'data-testid': 'liquid-glass',
        'data-variant': variant,
        'data-theme': theme,
        ...props
      }, children),
    createLiquidGlassTheme: vi.fn((config) => ({
      name: config.name || 'mock-theme',
      ...config,
    })),
    withGlassEffect: vi.fn((component) => component),
    useLiquidGlassPerformance: vi.fn(() => ({
      gpuUsage: 45,
      frameRate: 60,
      renderTime: 8.5,
    })),
  }));

  // Mock motion/framer-motion
  vi.mock('motion/react', () => ({
    motion: {
      div: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
      button: vi.fn(({ children, ...props }) => React.createElement('button', props, children)),
      h1: vi.fn(({ children, ...props }) => React.createElement('h1', props, children)),
      h2: vi.fn(({ children, ...props }) => React.createElement('h2', props, children)),
      h3: vi.fn(({ children, ...props }) => React.createElement('h3', props, children)),
      span: vi.fn(({ children, ...props }) => React.createElement('span', props, children)),
      p: vi.fn(({ children, ...props }) => React.createElement('p', props, children)),
    },
    AnimatePresence: vi.fn(({ children }) => children),
    useMotionValue: vi.fn(() => ({ get: vi.fn(), set: vi.fn() })),
    useTransform: vi.fn(() => ({ get: vi.fn(), set: vi.fn() })),
    useSpring: vi.fn(() => ({ get: vi.fn(), set: vi.fn() })),
  }));

  // Mock seasonal theme provider
  vi.mock('@/lib/theme/seasonalTheme', () => ({
    useSeasonalTheme: vi.fn(() => ({
      currentTheme: {
        name: 'spring-day',
        season: 'spring',
        timeOfDay: 'day',
        colors: {
          primary: '#ff69b4',
          secondary: '#98fb98',
          accent: '#ffd700',
          background: 'rgba(255, 182, 193, 0.05)',
          surface: 'rgba(255, 182, 193, 0.1)',
        },
        glassMorphism: {
          backdropFilter: 'blur(15px) saturate(1.5)',
          backgroundColor: 'rgba(255, 182, 193, 0.1)',
          borderColor: 'rgba(255, 182, 193, 0.2)',
          shadowColor: 'rgba(255, 182, 193, 0.3)',
          particleEffect: 'sakura',
        },
        particles: {
          type: 'sakura',
          count: 20,
          size: [2, 8],
          speed: 0.5,
          opacity: 0.6,
        },
        animations: {
          transition: 'all 0.3s ease-out',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          duration: 300,
        },
      },
      weatherData: {
        weather: 'sunny',
        temperature: 22,
        humidity: 65,
        windSpeed: 3.2,
      },
      determineTheme: vi.fn(),
      setTheme: vi.fn(),
    })),
    SeasonalThemeProvider: vi.fn(({ children }) => children),
    getSeasonalHue: vi.fn(() => 320),
    getParticleCount: vi.fn(() => 20),
    getAnimationSpeed: vi.fn(() => 1),
  }));

  // Mock shadcn/ui components
  vi.mock('@/components/ui/card', () => ({
    Card: vi.fn(({ children, className, ...props }) => (
      <div className={`mock-card ${className || ''}`} {...props}>
        {children}
      </div>
    )),
    CardContent: vi.fn(({ children, className, ...props }) => (
      <div className={`mock-card-content ${className || ''}`} {...props}>
        {children}
      </div>
    )),
    CardHeader: vi.fn(({ children, className, ...props }) => (
      <div className={`mock-card-header ${className || ''}`} {...props}>
        {children}
      </div>
    )),
    CardTitle: vi.fn(({ children, className, ...props }) => (
      <h3 className={`mock-card-title ${className || ''}`} {...props}>
        {children}
      </h3>
    )),
    CardDescription: vi.fn(({ children, className, ...props }) => (
      <p className={`mock-card-description ${className || ''}`} {...props}>
        {children}
      </p>
    )),
    CardFooter: vi.fn(({ children, className, ...props }) => (
      <div className={`mock-card-footer ${className || ''}`} {...props}>
        {children}
      </div>
    )),
  }));

  vi.mock('@/components/ui/button', () => ({
    Button: vi.fn(({ children, className, variant, size, ...props }) => (
      <button 
        className={`mock-button ${className || ''}`} 
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </button>
    )),
  }));

  vi.mock('@/components/ui/badge', () => ({
    Badge: vi.fn(({ children, className, variant, ...props }) => (
      <span 
        className={`mock-badge ${className || ''}`} 
        data-variant={variant}
        {...props}
      >
        {children}
      </span>
    )),
  }));

  vi.mock('@/components/ui/separator', () => ({
    Separator: vi.fn(({ className, orientation = 'horizontal', ...props }) => (
      <div 
        className={`mock-separator ${className || ''}`} 
        data-orientation={orientation}
        {...props}
      />
    )),
  }));

  vi.mock('@/components/ui/slider', () => ({
    Slider: vi.fn(({ value, onValueChange, min, max, step, ...props }) => (
      <input 
        type="range"
        value={Array.isArray(value) ? value[0] : value}
        onChange={(e) => onValueChange?.([parseFloat(e.target.value)])}
        min={min}
        max={max}
        step={step}
        className="mock-slider"
        {...props}
      />
    )),
  }));

  vi.mock('@/components/ui/tabs', () => ({
    Tabs: vi.fn(({ children, value, onValueChange, ...props }) => (
      <div className="mock-tabs" data-value={value} {...props}>
        {children}
      </div>
    )),
    TabsList: vi.fn(({ children, className, ...props }) => (
      <div className={`mock-tabs-list ${className || ''}`} {...props}>
        {children}
      </div>
    )),
    TabsTrigger: vi.fn(({ children, value, ...props }) => (
      <button className="mock-tabs-trigger" data-value={value} {...props}>
        {children}
      </button>
    )),
    TabsContent: vi.fn(({ children, value, ...props }) => (
      <div className="mock-tabs-content" data-value={value} {...props}>
        {children}
      </div>
    )),
  }));

  // Mock glasscn-ui components
  vi.mock('glasscn-ui', () => ({
    GlassCard: vi.fn(({ children, variant = 'default', ...props }) => (
      <div className={`mock-glass-card glass-${variant}`} {...props}>
        {children}
      </div>
    )),
    GlassButton: vi.fn(({ children, variant = 'primary', ...props }) => (
      <button className={`mock-glass-button glass-${variant}`} {...props}>
        {children}
      </button>
    )),
    GlassInput: vi.fn((props) => (
      <input className="mock-glass-input" {...props} />
    )),
  }));

  // Mock utility functions
  vi.mock('@/lib/utils', () => ({
    cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
    debounce: vi.fn((fn, delay) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      };
    }),
  }));

  // Mock performance monitoring
  vi.mock('@/lib/performance/webVitals', () => ({
    trackCoreWebVitals: vi.fn(),
    measureLiquidGlassPerformance: vi.fn(() => ({
      renderTime: 8.5,
      gpuUsage: 45,
      frameRate: 60,
      effectComplexity: 'medium',
    })),
    getPerformanceMetrics: vi.fn(() => ({
      lcp: 1800,
      inp: 120,
      cls: 0.05,
      fcp: 1200,
      ttfb: 400,
    })),
  }));

  // Mock AI image generation
  vi.mock('@/lib/ai/imageGeneration', () => ({
    generateEyecatchImage: vi.fn(async () => ({
      url: 'https://mock-ai-image.jpg',
      webpUrl: 'https://mock-ai-image.webp',
      avifUrl: 'https://mock-ai-image.avif',
      blurDataURL: 'data:image/jpeg;base64,mock-blur-data',
      alt: 'AI generated eyecatch image',
      width: 768,
      height: 432,
    })),
  }));

  // Mock weather API
  vi.mock('@/lib/weather/weatherAPI', () => ({
    getCurrentWeather: vi.fn(async () => ({
      weather: 'sunny',
      temperature: 22,
      humidity: 65,
      windSpeed: 3.2,
      location: 'Tokyo, Japan',
    })),
  }));

  // Mock MDX processing
  vi.mock('@/lib/mdx/mdxProcessor', () => ({
    compileMDX: vi.fn(async () => ({
      content: '<div>Mock MDX Content</div>',
      frontmatter: {
        title: 'Mock Article',
        description: 'Mock description',
        tags: ['liquid-glass', 'test'],
        date: '2024-08-13',
      },
    })),
    getMDXComponents: vi.fn(() => ({})),
  }));

  // Mock localStorage wrapper
  vi.mock('@/lib/storage/localStorage', () => ({
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }));

  // Mock error boundary
  vi.mock('@/components/error/LiquidGlassErrorBoundary', () => ({
    LiquidGlassErrorBoundary: vi.fn(({ children }) => children),
  }));
};

// Test utilities for component testing
export const mockSeasonalTheme = (season: string, timeOfDay: string) => {
  const themes = {
    'spring-day': {
      name: 'spring-day',
      season: 'spring',
      timeOfDay: 'day',
      particleEffect: 'sakura',
      colors: { primary: '#ff69b4' },
    },
    'summer-day': {
      name: 'summer-day',
      season: 'summer',
      timeOfDay: 'day',
      particleEffect: 'waterdrops',
      colors: { primary: '#00bfff' },
    },
    'autumn-day': {
      name: 'autumn-day',
      season: 'autumn',
      timeOfDay: 'day',
      particleEffect: 'leaves',
      colors: { primary: '#ff8c00' },
    },
    'winter-day': {
      name: 'winter-day',
      season: 'winter',
      timeOfDay: 'day',
      particleEffect: 'snow',
      colors: { primary: '#87ceeb' },
    },
  };

  return themes[`${season}-${timeOfDay}` as keyof typeof themes] || themes['spring-day'];
};

export const mockPerformanceMetrics = {
  good: { lcp: 1500, inp: 100, cls: 0.05 },
  poor: { lcp: 3500, inp: 350, cls: 0.3 },
  excellent: { lcp: 1200, inp: 80, cls: 0.02 },
};

export const mockDeviceCapabilities = {
  lowEnd: { hardwareConcurrency: 2, deviceMemory: 2 },
  midRange: { hardwareConcurrency: 4, deviceMemory: 4 },
  highEnd: { hardwareConcurrency: 8, deviceMemory: 8 },
};