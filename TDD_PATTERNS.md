# TDD Development Patterns for Liquid Glass Tech Blog

## TDD Methodology Implementation

This project follows strict Test-Driven Development (TDD) using the Red-Green-Refactor cycle with 95% test coverage requirements.

## Core Testing Standards

### Test Coverage Requirements
- **Line Coverage**: 95%+
- **Branch Coverage**: 90%+
- **Function Coverage**: 95%+
- **Statement Coverage**: 95%+

### Test Structure Pattern: AAA + Given-When-Then

```typescript
describe('ComponentName', () => {
  describe('GIVEN initial conditions', () => {
    it('WHEN action occurs THEN expected result happens', () => {
      // ARRANGE: Set up test data, mocks, and initial state
      const mockProps = { variant: 'glass-medium', blur: 20 };
      const mockCallback = vi.fn();
      
      // ACT: Execute the functionality being tested
      render(<LiquidGlassCard {...mockProps} onClick={mockCallback} />);
      const card = screen.getByTestId('liquid-glass-card');
      fireEvent.click(card);
      
      // ASSERT: Verify the expected behavior occurred
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(card).toHaveStyle({ backdropFilter: 'blur(20px)' });
    });
  });
});
```

## Component Development Patterns

### 1. Liquid Glass Component Pattern

#### Test First (Red Phase)
```typescript
// components/liquid-glass/LiquidGlassCard.test.tsx
import { render, screen } from '@/tests/utils/test-utils';
import { LiquidGlassCard } from './LiquidGlassCard';

describe('LiquidGlassCard', () => {
  describe('GIVEN a LiquidGlassCard component', () => {
    it('WHEN rendered with blur prop THEN applies correct backdrop-filter style', () => {
      // ARRANGE
      const testContent = 'Test Content';
      const blurValue = 25;
      
      // ACT
      render(
        <LiquidGlassCard blur={blurValue}>
          {testContent}
        </LiquidGlassCard>
      );
      
      // ASSERT
      const card = screen.getByText(testContent).closest('[data-testid="liquid-glass"]');
      expect(card).toHaveStyle({
        backdropFilter: `blur(${blurValue}px)`
      });
    });

    it('WHEN rendered with interactive prop THEN enables hover effects', () => {
      // ARRANGE
      const testContent = 'Interactive Content';
      
      // ACT
      render(
        <LiquidGlassCard interactive>
          {testContent}
        </LiquidGlassCard>
      );
      
      // ASSERT
      const card = screen.getByText(testContent).parentElement;
      expect(card).toHaveClass('hover:scale-[1.02]');
    });

    it('WHEN rendered with seasonal theme THEN applies theme-specific styles', () => {
      // ARRANGE
      mockDateForSeason('spring');
      
      // ACT
      renderWithSeasonalTheme(
        <LiquidGlassCard seasonalTheme>
          Seasonal Content
        </LiquidGlassCard>,
        'spring'
      );
      
      // ASSERT
      const container = screen.getByTestId('liquid-glass-provider');
      expect(container).toHaveAttribute('data-season', 'spring');
    });
  });
});
```

#### Implementation (Green Phase)
```typescript
// components/liquid-glass/LiquidGlassCard.tsx
import React from 'react';
import { LiquidGlass } from '@developer-hub/liquid-glass';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useSeasonalTheme } from '@/lib/theme/seasonalTheme';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  variant?: 'subtle' | 'medium' | 'intense';
  blur?: number;
  opacity?: number;
  interactive?: boolean;
  seasonalTheme?: boolean;
  className?: string;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  variant = 'medium',
  blur = 15,
  opacity = 0.1,
  interactive = false,
  seasonalTheme = false,
  className,
  ...props
}) => {
  const { currentTheme } = useSeasonalTheme();
  
  return (
    <LiquidGlass
      variant={`glass-${variant}`}
      blur={blur}
      opacity={opacity}
      theme={seasonalTheme ? currentTheme.name : undefined}
      data-testid="liquid-glass"
    >
      <motion.div
        className={cn(
          'rounded-lg border bg-transparent shadow-sm',
          interactive && 'hover:scale-[1.02] cursor-pointer transition-transform',
          className
        )}
        whileHover={interactive ? { scale: 1.02 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        {...props}
      >
        <CardContent className="p-6">
          {children}
        </CardContent>
      </motion.div>
    </LiquidGlass>
  );
};
```

### 2. Seasonal Theme Engine Pattern

#### Test First (Red Phase)
```typescript
// lib/theme/seasonalTheme.test.ts
import { renderHook, act } from '@testing-library/react';
import { useSeasonalTheme } from './seasonalTheme';
import { mockDateForSeason, mockTimeOfDay } from '@/tests/utils/test-utils';

describe('useSeasonalTheme', () => {
  describe('GIVEN different seasons and times', () => {
    it('WHEN it is spring equinox THEN returns spring theme configuration', () => {
      // ARRANGE
      mockDateForSeason('spring');
      
      // ACT
      const { result } = renderHook(() => useSeasonalTheme());
      
      // ASSERT
      expect(result.current.season).toBe('spring');
      expect(result.current.colors.primary).toMatch(/#[0-9a-fA-F]{6}/); // Pink cherry blossom
      expect(result.current.particles.type).toBe('sakura');
    });

    it('WHEN time changes from day to evening THEN updates theme accordingly', async () => {
      // ARRANGE
      mockTimeOfDay('day');
      const { result, rerender } = renderHook(() => useSeasonalTheme());
      
      // ACT
      mockTimeOfDay('evening');
      await act(async () => {
        rerender();
      });
      
      // ASSERT
      expect(result.current.timeOfDay).toBe('evening');
      expect(result.current.glassMorphism.backgroundColor).toContain('rgba');
    });

    it('WHEN transitioning between seasons THEN applies gradual theme changes', async () => {
      // ARRANGE
      const transitionDate = new Date('2024-03-19'); // 2 days before spring
      vi.setSystemTime(transitionDate);
      
      // ACT
      const { result } = renderHook(() => useSeasonalTheme());
      
      // ASSERT
      expect(result.current.isTransitioning).toBe(true);
      expect(result.current.transitionProgress).toBeGreaterThan(0);
      expect(result.current.transitionProgress).toBeLessThan(1);
    });
  });
});
```

#### Implementation (Green Phase)
```typescript
// lib/theme/seasonalTheme.ts
import { useState, useEffect, useCallback } from 'react';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

interface SeasonalThemeConfig {
  season: Season;
  timeOfDay: TimeOfDay;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  glassMorphism: {
    backgroundColor: string;
    backdropFilter: string;
  };
  particles: {
    type: 'sakura' | 'waterdrops' | 'leaves' | 'snow';
  };
  isTransitioning: boolean;
  transitionProgress: number;
}

export const useSeasonalTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<SeasonalThemeConfig | null>(null);

  const determineTheme = useCallback(() => {
    const now = new Date();
    const month = now.getMonth();
    const hour = now.getHours();
    
    // Determine season
    const season: Season = 
      month >= 2 && month <= 4 ? 'spring' :
      month >= 5 && month <= 7 ? 'summer' :
      month >= 8 && month <= 10 ? 'autumn' : 'winter';
    
    // Determine time of day
    const timeOfDay: TimeOfDay =
      hour >= 6 && hour < 10 ? 'morning' :
      hour >= 10 && hour < 17 ? 'day' :
      hour >= 17 && hour < 22 ? 'evening' : 'night';
    
    // Check if in transition period (3 days before season change)
    const seasonBoundaries = {
      spring: new Date(now.getFullYear(), 2, 21), // March 21
      summer: new Date(now.getFullYear(), 5, 21), // June 21
      autumn: new Date(now.getFullYear(), 8, 21), // September 21
      winter: new Date(now.getFullYear(), 11, 21) // December 21
    };
    
    const nextSeasonDate = seasonBoundaries[season];
    const daysDiff = Math.abs(now.getTime() - nextSeasonDate.getTime()) / (1000 * 60 * 60 * 24);
    const isTransitioning = daysDiff <= 3;
    const transitionProgress = isTransitioning ? (3 - daysDiff) / 3 : 0;
    
    return generateThemeConfig(season, timeOfDay, isTransitioning, transitionProgress);
  }, []);

  useEffect(() => {
    setCurrentTheme(determineTheme());
    
    // Update theme every hour
    const interval = setInterval(() => {
      setCurrentTheme(determineTheme());
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [determineTheme]);

  return currentTheme;
};

const generateThemeConfig = (
  season: Season,
  timeOfDay: TimeOfDay,
  isTransitioning: boolean,
  transitionProgress: number
): SeasonalThemeConfig => {
  const seasonColors = {
    spring: { primary: '#ffb3d9', secondary: '#ff80cc', accent: '#ff4db3' },
    summer: { primary: '#66d9ff', secondary: '#33ccff', accent: '#00bfff' },
    autumn: { primary: '#ff9966', secondary: '#ff8533', accent: '#ff6600' },
    winter: { primary: '#b3e0ff', secondary: '#80d4ff', accent: '#4dc9ff' }
  };

  const particleTypes = {
    spring: 'sakura' as const,
    summer: 'waterdrops' as const,
    autumn: 'leaves' as const,
    winter: 'snow' as const
  };

  return {
    season,
    timeOfDay,
    colors: seasonColors[season],
    glassMorphism: {
      backgroundColor: `rgba(255, 255, 255, ${timeOfDay === 'night' ? 0.05 : 0.1})`,
      backdropFilter: 'blur(15px) saturate(180%)'
    },
    particles: {
      type: particleTypes[season]
    },
    isTransitioning,
    transitionProgress
  };
};
```

### 3. MDX Component Integration Pattern

#### Test First (Red Phase)
```typescript
// components/mdx/MDXComponents.test.tsx
import { render, screen } from '@/tests/utils/test-utils';
import { MDXComponents } from './MDXComponents';

describe('MDXComponents', () => {
  describe('GIVEN MDX components', () => {
    it('WHEN CodePreview is rendered THEN displays syntax highlighted code', () => {
      // ARRANGE
      const code = 'const hello = "world";';
      const CodePreview = MDXComponents.CodePreview;
      
      // ACT
      render(
        <CodePreview language="typescript">
          {code}
        </CodePreview>
      );
      
      // ASSERT
      expect(screen.getByTestId('liquid-glass')).toBeInTheDocument();
      expect(screen.getByText(code)).toBeInTheDocument();
    });

    it('WHEN EffectDemo is rendered THEN provides interactive preview', () => {
      // ARRANGE
      const effectCode = 'backdrop-filter: blur(20px);';
      const EffectDemo = MDXComponents.EffectDemo;
      
      // ACT
      render(
        <EffectDemo effectCode={effectCode} editable />
      );
      
      // ASSERT
      expect(screen.getByTestId('liquid-glass')).toBeInTheDocument();
      expect(screen.getByDisplayValue(effectCode)).toBeInTheDocument();
    });
  });
});
```

### 4. Performance Testing Pattern

#### Test First (Red Phase)
```typescript
// lib/performance/webVitals.test.ts
import { measureCoreWebVitals, trackLiquidGlassPerformance } from './webVitals';
import { mockPerformanceObserver } from '@/tests/utils/test-utils';

describe('Performance Monitoring', () => {
  describe('GIVEN Core Web Vitals monitoring', () => {
    it('WHEN measuring LCP THEN reports value under 2.5 seconds', async () => {
      // ARRANGE
      const { mockEntries } = mockPerformanceObserver();
      
      // ACT
      const vitals = await measureCoreWebVitals();
      
      // ASSERT
      expect(vitals.lcp).toBeLessThan(2500);
      expect(vitals.lcp).toBeGreaterThan(0);
    });

    it('WHEN liquid glass effects render THEN maintains 60fps', async () => {
      // ARRANGE
      const mockGPU = mockGPUAcceleration();
      
      // ACT
      const performance = await trackLiquidGlassPerformance();
      
      // ASSERT
      expect(performance.fps).toBeGreaterThanOrEqual(58); // Allow 2fps tolerance
      expect(performance.effectRenderTime).toBeLessThan(16.67); // 60fps = 16.67ms per frame
    });
  });
});
```

## Testing Commands and Workflow

### Development Workflow Commands
```bash
# Run tests in watch mode during development
npm run test

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm run test -- LiquidGlassCard.test.tsx

# Run tests for specific pattern
npm run test -- --grep "GIVEN.*WHEN.*THEN"

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

### TDD Cycle Commands
```bash
# RED: Run failing test
npm run test -- --reporter=verbose ComponentName.test.tsx

# GREEN: Run test after minimal implementation
npm run test -- ComponentName.test.tsx

# REFACTOR: Run full test suite to ensure no regression
npm run test:coverage
```

## Quality Gates

### Before Commit
1. ✅ All tests pass (`npm run test`)
2. ✅ Coverage thresholds met (`npm run test:coverage`)
3. ✅ Type checking passes (`npm run type-check`)
4. ✅ Linting passes (`npm run lint`)

### Before Push
1. ✅ E2E tests pass (`npm run test:e2e`)
2. ✅ Performance tests pass
3. ✅ Accessibility tests pass
4. ✅ Visual regression tests pass

This TDD pattern ensures high-quality, well-tested code that meets all performance, accessibility, and functionality requirements for the liquid glass tech blog platform.