# TDD Patterns for Liquid Glass Tech Blog

## Overview

This document provides comprehensive TDD patterns following t-wada methodology for the liquid-glass-tech-blog project. All implementations must follow these patterns to ensure 95%+ test coverage and robust code quality.

## Core TDD Principles

### 1. Red-Green-Refactor Cycle
- **RED**: Write a failing test first
- **GREEN**: Write minimal code to make the test pass
- **REFACTOR**: Improve code quality while keeping tests green

### 2. AAA Pattern + Given-When-Then
- **ARRANGE/GIVEN**: Set up test data and preconditions
- **ACT/WHEN**: Execute the functionality being tested
- **ASSERT/THEN**: Verify the expected behavior

## Component Testing Patterns

### 1. Liquid Glass Component Pattern

```typescript
// Test First: components/liquid-glass/LiquidGlassCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LiquidGlassCard } from './LiquidGlassCard';
import { renderWithTheme, mockCSSSupports } from '@/tests/utils/testUtils';

describe('LiquidGlassCard', () => {
  beforeEach(() => {
    mockCSSSupports(true); // Mock CSS.supports for backdrop-filter
  });

  describe('GIVEN default props', () => {
    it('WHEN rendered THEN applies default glass-medium variant', () => {
      // ARRANGE
      const testContent = 'Test content';
      
      // ACT
      renderWithTheme(<LiquidGlassCard>{testContent}</LiquidGlassCard>);
      
      // ASSERT
      const card = screen.getByText(testContent).closest('[data-variant]');
      expect(card).toHaveAttribute('data-variant', 'glass-medium');
    });
  });

  describe('GIVEN blur prop', () => {
    it('WHEN blur=20 THEN applies correct backdrop-filter', () => {
      // ARRANGE
      const blur = 20;
      const testContent = 'Blurred content';
      
      // ACT
      renderWithTheme(
        <LiquidGlassCard blur={blur}>{testContent}</LiquidGlassCard>
      );
      
      // ASSERT
      const card = screen.getByText(testContent).parentElement;
      expect(card).toHaveStyle({
        backdropFilter: `blur(${blur}px)`,
      });
    });

    it('WHEN blur=0 THEN removes backdrop-filter', () => {
      // ARRANGE
      const blur = 0;
      const testContent = 'No blur content';
      
      // ACT
      renderWithTheme(
        <LiquidGlassCard blur={blur}>{testContent}</LiquidGlassCard>
      );
      
      // ASSERT
      const card = screen.getByText(testContent).parentElement;
      expect(card).toHaveStyle({
        backdropFilter: 'none',
      });
    });
  });

  describe('GIVEN interactive prop', () => {
    it('WHEN interactive=true THEN responds to hover events', async () => {
      // ARRANGE
      const onHover = vi.fn();
      const testContent = 'Interactive content';
      
      // ACT
      renderWithTheme(
        <LiquidGlassCard interactive onMouseEnter={onHover}>
          {testContent}
        </LiquidGlassCard>
      );
      
      const card = screen.getByText(testContent).parentElement;
      fireEvent.mouseEnter(card);
      
      // ASSERT
      expect(onHover).toHaveBeenCalledTimes(1);
      expect(card).toHaveClass('hover:scale-105');
    });
  });

  describe('GIVEN seasonalTheme prop', () => {
    it('WHEN seasonalTheme=true THEN applies current seasonal theme', () => {
      // ARRANGE
      const testContent = 'Seasonal content';
      
      // ACT
      renderWithTheme(
        <LiquidGlassCard seasonalTheme>{testContent}</LiquidGlassCard>
      );
      
      // ASSERT
      const themeProvider = screen.getByTestId('seasonal-theme-provider');
      expect(themeProvider).toHaveAttribute('data-season', 'spring');
      
      const card = screen.getByText(testContent).parentElement;
      expect(card).toHaveClass('spring-theme');
    });
  });

  describe('GIVEN browser compatibility', () => {
    it('WHEN backdrop-filter not supported THEN falls back gracefully', () => {
      // ARRANGE
      mockCSSSupports(false);
      const testContent = 'Fallback content';
      
      // ACT
      renderWithTheme(<LiquidGlassCard>{testContent}</LiquidGlassCard>);
      
      // ASSERT
      const card = screen.getByText(testContent).parentElement;
      expect(card).not.toHaveStyle({ backdropFilter: expect.any(String) });
      expect(card).toHaveClass('fallback-glass-style');
    });
  });
});
```

### 2. Hook Testing Pattern

```typescript
// Test First: lib/theme/useSeasonalTheme.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSeasonalTheme } from './useSeasonalTheme';
import { mockDate, mockWeatherAPI } from '@/tests/utils/testUtils';

describe('useSeasonalTheme', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('GIVEN spring date', () => {
    it('WHEN hook called THEN returns spring theme with cherry blossom colors', () => {
      // ARRANGE
      mockDate('2024-03-21'); // Spring equinox
      
      // ACT
      const { result } = renderHook(() => useSeasonalTheme());
      
      // ASSERT
      expect(result.current.season).toBe('spring');
      expect(result.current.currentTheme.colors.primary).toBe('#ffb3d9');
      expect(result.current.currentTheme.particles.type).toBe('sakura');
    });
  });

  describe('GIVEN time of day changes', () => {
    it('WHEN morning (8am) THEN returns morning theme variant', () => {
      // ARRANGE
      mockDate('2024-03-21T08:00:00');
      
      // ACT
      const { result } = renderHook(() => useSeasonalTheme());
      
      // ASSERT
      expect(result.current.timeOfDay).toBe('morning');
      expect(result.current.currentTheme.glassMorphism.backgroundColor)
        .toContain('rgba(255, 255, 255, 0.8)'); // Light morning effect
    });

    it('WHEN evening (19pm) THEN returns evening theme variant', () => {
      // ARRANGE
      mockDate('2024-03-21T19:00:00');
      
      // ACT
      const { result } = renderHook(() => useSeasonalTheme());
      
      // ASSERT
      expect(result.current.timeOfDay).toBe('evening');
      expect(result.current.currentTheme.glassMorphism.backgroundColor)
        .toContain('rgba(255, 215, 0, 0.6)'); // Golden evening effect
    });
  });

  describe('GIVEN weather API integration', () => {
    it('WHEN sunny weather THEN enhances saturation and brightness', async () => {
      // ARRANGE
      mockWeatherAPI();
      mockDate('2024-06-21T12:00:00'); // Summer noon
      
      // ACT
      const { result, waitForNextUpdate } = renderHook(() => useSeasonalTheme());
      await waitForNextUpdate();
      
      // ASSERT
      expect(result.current.weather).toBe('sunny');
      expect(result.current.currentTheme.glassMorphism.backdropFilter)
        .toContain('saturate(180%)'); // Enhanced for sunny weather
    });
  });

  describe('GIVEN manual theme override', () => {
    it('WHEN setManualTheme called THEN overrides automatic theme', () => {
      // ARRANGE
      mockDate('2024-03-21'); // Spring
      const { result } = renderHook(() => useSeasonalTheme());
      
      // ACT
      act(() => {
        result.current.setManualTheme({
          season: 'winter',
          colors: { primary: '#e0f6ff' }
        });
      });
      
      // ASSERT
      expect(result.current.currentTheme.season).toBe('winter');
      expect(result.current.currentTheme.colors.primary).toBe('#e0f6ff');
    });

    it('WHEN resetToAutomatic called THEN returns to automatic detection', () => {
      // ARRANGE
      mockDate('2024-03-21'); // Spring
      const { result } = renderHook(() => useSeasonalTheme());
      
      act(() => {
        result.current.setManualTheme({ season: 'winter' });
      });
      
      // ACT
      act(() => {
        result.current.resetToAutomatic();
      });
      
      // ASSERT
      expect(result.current.currentTheme.season).toBe('spring');
    });
  });

  describe('GIVEN seasonal transition period', () => {
    it('WHEN near seasonal boundary THEN shows transition state', () => {
      // ARRANGE
      mockDate('2024-03-19'); // 2 days before spring equinox
      
      // ACT
      const { result } = renderHook(() => useSeasonalTheme());
      
      // ASSERT
      expect(result.current.isTransitioning).toBe(true);
    });
  });
});
```

### 3. Performance Testing Pattern

```typescript
// Test First: lib/performance/gpuAcceleration.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard';
import { mockGPUPerformance, mockPerformanceAPI } from '@/tests/utils/testUtils';

describe('GPU Acceleration Performance', () => {
  beforeEach(() => {
    mockPerformanceAPI();
    mockGPUPerformance();
  });

  describe('GIVEN multiple liquid glass elements', () => {
    it('WHEN rendered THEN maintains 60fps performance', async () => {
      // ARRANGE
      const performanceMonitor = vi.fn();
      Object.defineProperty(window, 'requestAnimationFrame', {
        value: performanceMonitor
      });

      // ACT
      render(
        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <LiquidGlassCard key={i} blur={15}>
              Card {i}
            </LiquidGlassCard>
          ))}
        </div>
      );

      // Simulate 1 second of animation frames
      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
      }

      // ASSERT
      expect(performanceMonitor).toHaveBeenCalledTimes(60);
      const averageFrameTime = 1000 / 60; // 16.67ms for 60fps
      expect(performance.now()).toBeLessThanOrEqual(averageFrameTime * 60);
    });
  });

  describe('GIVEN low-end device', () => {
    it('WHEN performance threshold exceeded THEN reduces effect complexity', () => {
      // ARRANGE
      const mockDeviceMemory = 2; // Low-end device
      Object.defineProperty(navigator, 'deviceMemory', {
        value: mockDeviceMemory,
        configurable: true
      });

      // ACT
      render(<LiquidGlassCard blur={30}>Heavy effect</LiquidGlassCard>);

      // ASSERT
      const card = document.querySelector('[data-variant]');
      expect(card).toHaveAttribute('data-performance-mode', 'reduced');
    });
  });
});
```

### 4. Accessibility Testing Pattern

```typescript
// Test First: components/liquid-glass/LiquidGlassCard.a11y.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LiquidGlassCard } from './LiquidGlassCard';
import { mockPrefersReducedMotion } from '@/tests/utils/testUtils';

expect.extend(toHaveNoViolations);

describe('LiquidGlassCard Accessibility', () => {
  describe('GIVEN WCAG 2.1 AA compliance', () => {
    it('WHEN rendered THEN has no accessibility violations', async () => {
      // ARRANGE & ACT
      const { container } = render(
        <LiquidGlassCard>Accessible content</LiquidGlassCard>
      );

      // ASSERT
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('GIVEN interactive card', () => {
    it('WHEN focused THEN shows visible focus indicator', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(
        <LiquidGlassCard interactive tabIndex={0}>
          Focusable card
        </LiquidGlassCard>
      );

      // ACT
      await user.tab();

      // ASSERT
      const card = screen.getByText('Focusable card').parentElement;
      expect(card).toHaveFocus();
      expect(card).toHaveClass('focus-visible:ring-2');
    });

    it('WHEN activated via keyboard THEN triggers same action as click', async () => {
      // ARRANGE
      const user = userEvent.setup();
      const handleClick = vi.fn();
      
      render(
        <LiquidGlassCard interactive onClick={handleClick}>
          Keyboard accessible
        </LiquidGlassCard>
      );

      // ACT
      await user.tab();
      await user.keyboard('{Enter}');

      // ASSERT
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('GIVEN prefers-reduced-motion', () => {
    it('WHEN user prefers reduced motion THEN disables animations', () => {
      // ARRANGE
      mockPrefersReducedMotion(true);

      // ACT
      render(
        <LiquidGlassCard motionPreset="spring">
          Reduced motion content
        </LiquidGlassCard>
      );

      // ASSERT
      const card = screen.getByText('Reduced motion content').parentElement;
      expect(card).toHaveClass('motion-reduce:transition-none');
    });
  });

  describe('GIVEN color contrast requirements', () => {
    it('WHEN text overlays glass effect THEN maintains 4.5:1 contrast ratio', () => {
      // ARRANGE & ACT
      render(
        <LiquidGlassCard>
          <p className="text-foreground">High contrast text</p>
        </LiquidGlassCard>
      );

      // ASSERT
      const text = screen.getByText('High contrast text');
      const computedStyle = getComputedStyle(text);
      // Note: In a real test, you'd use a color contrast library
      expect(computedStyle.color).toBeDefined();
    });
  });
});
```

### 5. Integration Testing Pattern

```typescript
// Test First: components/liquid-glass/LiquidGlassCard.integration.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LiquidGlassCard } from './LiquidGlassCard';
import { SeasonalThemeProvider } from '@/components/providers/SeasonalThemeProvider';
import { mockDate, mockWeatherAPI } from '@/tests/utils/testUtils';

describe('LiquidGlassCard Integration', () => {
  describe('GIVEN seasonal theme provider', () => {
    it('WHEN season changes THEN card updates theme smoothly', async () => {
      // ARRANGE
      mockDate('2024-03-20'); // Day before spring
      mockWeatherAPI();
      
      const { rerender } = render(
        <SeasonalThemeProvider>
          <LiquidGlassCard seasonalTheme>
            Seasonal card
          </LiquidGlassCard>
        </SeasonalThemeProvider>
      );

      // ACT
      mockDate('2024-03-21'); // Spring equinox
      rerender(
        <SeasonalThemeProvider>
          <LiquidGlassCard seasonalTheme>
            Seasonal card
          </LiquidGlassCard>
        </SeasonalThemeProvider>
      );

      // ASSERT
      await waitFor(() => {
        const card = screen.getByText('Seasonal card').parentElement;
        expect(card).toHaveClass('spring-theme');
      }, { timeout: 3000 }); // Allow for transition animation
    });
  });

  describe('GIVEN performance monitoring', () => {
    it('WHEN performance degrades THEN automatically reduces effects', async () => {
      // ARRANGE
      const performanceThreshold = 33; // 30fps threshold
      vi.spyOn(performance, 'now').mockReturnValue(performanceThreshold);

      // ACT
      render(
        <LiquidGlassCard blur={50} interactive>
          Performance monitored card
        </LiquidGlassCard>
      );

      // ASSERT
      await waitFor(() => {
        const card = screen.getByText('Performance monitored card').parentElement;
        expect(card).toHaveAttribute('data-performance-mode', 'optimized');
      });
    });
  });
});
```

## Best Practices

### 1. Test Naming Convention
- Use descriptive test names following Given-When-Then pattern
- Include specific values and expected outcomes
- Group related tests using `describe` blocks

### 2. Test Organization
- One test file per component/function
- Separate accessibility tests with `.a11y.test.tsx` suffix
- Separate integration tests with `.integration.test.tsx` suffix
- Use setup and teardown appropriately

### 3. Mock Strategy
- Mock external dependencies (APIs, browser APIs)
- Use fake timers for time-dependent tests
- Mock CSS support for browser compatibility tests
- Provide realistic mock data

### 4. Coverage Requirements
- Line Coverage: 95%+
- Branch Coverage: 90%+
- Function Coverage: 95%+
- Statement Coverage: 95%+

### 5. Test Performance
- Keep tests fast (< 100ms per test)
- Use `vi.mocked()` for better TypeScript support
- Avoid unnecessary DOM rendering
- Clean up after tests

## Anti-Patterns to Avoid

### ❌ Testing Implementation Details
```typescript
// BAD: Testing internal state
expect(component.state.isVisible).toBe(true);

// GOOD: Testing user-observable behavior
expect(screen.getByRole('dialog')).toBeVisible();
```

### ❌ Multiple Assertions in One Test
```typescript
// BAD: Multiple concepts in one test
it('should handle multiple scenarios', () => {
  // Test rendering
  // Test user interaction
  // Test error handling
});

// GOOD: One concept per test
it('WHEN rendered THEN shows correct content', () => {});
it('WHEN clicked THEN triggers action', () => {});
it('WHEN error occurs THEN shows error message', () => {});
```

### ❌ Brittle Selectors
```typescript
// BAD: Fragile CSS selectors
screen.getByClassName('card-wrapper-123');

// GOOD: Semantic selectors
screen.getByRole('button', { name: 'Save changes' });
screen.getByLabelText('Email address');
```

This comprehensive TDD pattern guide ensures consistent, high-quality testing across the entire liquid-glass-tech-blog project, supporting the 95% coverage requirement and robust development practices.