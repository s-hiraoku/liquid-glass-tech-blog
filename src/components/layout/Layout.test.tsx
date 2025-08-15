/**
 * Layout Component Tests - TDD Red Phase
 * 
 * Testing responsive layout system with liquid glass effects.
 * Implements strict TDD methodology with failing tests first.
 * 
 * Requirements (from task 6.7):
 * - Mobile-first responsive design
 * - Touch-optimized interactions
 * - Device rotation handling
 * - Performance optimization
 * - WCAG 2.1 AA accessibility
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock window object
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Component under test
import { Layout } from './Layout';

// Test utilities
import { renderWithTheme } from '@/tests/utils/render-with-theme';
import { mockIntersectionObserver } from '@/tests/mocks/liquid-glass-mock';

describe('Layout - TDD Red Phase: Responsive Layout Requirements', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockIntersectionObserver();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GIVEN mobile-first responsive design requirements', () => {
    it('WHEN component mounts THEN should have mobile-first layout classes', () => {
      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const layoutContainer = screen.getByTestId('layout-container');
      expect(layoutContainer).toBeInTheDocument();
      expect(layoutContainer).toHaveClass('mobile-first-layout');
    });

    it('WHEN on mobile viewport THEN should display mobile navigation', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-navigation')).not.toBeInTheDocument();
    });

    it('WHEN on tablet viewport THEN should display tablet layout', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const layoutContainer = screen.getByTestId('layout-container');
      expect(layoutContainer).toHaveClass('tablet-layout');
    });

    it('WHEN on desktop viewport THEN should display desktop layout', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const layoutContainer = screen.getByTestId('layout-container');
      expect(layoutContainer).toHaveClass('desktop-layout');
      expect(screen.getByTestId('desktop-navigation')).toBeInTheDocument();
    });
  });

  describe('GIVEN touch-optimized interaction requirements', () => {
    it('WHEN touch device detected THEN should apply touch-optimized styles', () => {
      // Mock touch device
      Object.defineProperty(window, 'ontouchstart', {
        value: {},
      });

      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const layoutContainer = screen.getByTestId('layout-container');
      expect(layoutContainer).toHaveClass('touch-optimized');
    });

    it('WHEN touch interaction THEN should have proper touch targets (44px minimum)', () => {
      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const touchTargets = screen.getAllByTestId(/touch-target-/);
      touchTargets.forEach(target => {
        const styles = window.getComputedStyle(target);
        const minSize = 44; // WCAG minimum touch target size
        expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(minSize);
        expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(minSize);
      });
    });

    it('WHEN swiping on mobile THEN should handle swipe gestures', async () => {
      const onSwipe = vi.fn();
      
      renderWithTheme(
        <Layout onSwipe={onSwipe}>
          <div>Test Content</div>
        </Layout>
      );

      const swipeArea = screen.getByTestId('layout-container swipe-area');
      
      // Simulate swipe gesture
      fireEvent.touchStart(swipeArea, {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      
      fireEvent.touchMove(swipeArea, {
        touches: [{ clientX: 200, clientY: 100 }]
      });
      
      fireEvent.touchEnd(swipeArea);

      await waitFor(() => {
        expect(onSwipe).toHaveBeenCalledWith('right');
      });
    });
  });

  describe('GIVEN device rotation handling requirements', () => {
    it('WHEN device rotates to portrait THEN should adjust layout', async () => {
      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      // Mock portrait orientation
      Object.defineProperty(screen, 'orientation', {
        value: { angle: 0 },
        writable: true,
      });

      fireEvent(window, new Event('orientationchange'));

      await waitFor(() => {
        const layoutContainer = screen.getByTestId('layout-container');
        expect(layoutContainer).toHaveClass('portrait-layout');
      });
    });

    it('WHEN device rotates to landscape THEN should adjust layout', async () => {
      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      // Mock landscape orientation
      Object.defineProperty(screen, 'orientation', {
        value: { angle: 90 },
        writable: true,
      });

      fireEvent(window, new Event('orientationchange'));

      await waitFor(() => {
        const layoutContainer = screen.getByTestId('layout-container');
        expect(layoutContainer).toHaveClass('landscape-layout');
      });
    });

    it('WHEN orientation changes THEN should maintain liquid glass effects', async () => {
      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const glassElements = screen.getAllByTestId(/glass-effect-/);
      expect(glassElements.length).toBeGreaterThan(0);

      // Simulate orientation change
      fireEvent(window, new Event('orientationchange'));

      await waitFor(() => {
        const updatedGlassElements = screen.getAllByTestId(/glass-effect-/);
        expect(updatedGlassElements.length).toBe(glassElements.length);
        updatedGlassElements.forEach(element => {
          expect(element).toHaveClass('liquid-glass-maintained');
        });
      });
    });
  });

  describe('GIVEN performance optimization requirements', () => {
    it('WHEN rendering layout THEN should complete within performance budget (< 100ms)', () => {
      const startTime = performance.now();
      
      renderWithTheme(
        <Layout>
          <div>Large Content</div>
        </Layout>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(100);
    });

    it('WHEN viewport changes THEN should debounce resize events', async () => {
      const onResize = vi.fn();
      
      renderWithTheme(
        <Layout onResize={onResize}>
          <div>Test Content</div>
        </Layout>
      );

      // Simulate multiple rapid resize events
      fireEvent(window, new Event('resize'));
      fireEvent(window, new Event('resize'));
      fireEvent(window, new Event('resize'));

      // Should debounce and only call once after delay
      await waitFor(() => {
        expect(onResize).toHaveBeenCalledTimes(1);
      }, { timeout: 500 });
    });

    it('WHEN lazy loading enabled THEN should load content progressively', async () => {
      renderWithTheme(
        <Layout enableLazyLoading>
          <div data-testid="above-fold">Above fold content</div>
          <div data-testid="below-fold">Below fold content</div>
        </Layout>
      );

      // Above fold content should be visible immediately
      expect(screen.getByTestId('above-fold')).toBeInTheDocument();
      
      // Below fold content should be lazy loaded
      expect(screen.queryByTestId('below-fold')).not.toBeInTheDocument();

      // Simulate scroll to trigger lazy loading
      fireEvent.scroll(window, { target: { scrollY: 1000 } });

      await waitFor(() => {
        expect(screen.getByTestId('below-fold')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN accessibility requirements (WCAG 2.1 AA)', () => {
    it('WHEN using keyboard navigation THEN should have proper focus management', () => {
      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const focusableElements = screen.getAllByRole('button, link, [tabindex]');
      focusableElements.forEach(element => {
        expect(element).toHaveAttribute('tabIndex');
        const tabIndex = element.getAttribute('tabIndex');
        expect(tabIndex).not.toBe('-1');
      });
    });

    it('WHEN skip link pressed THEN should skip to main content', async () => {
      renderWithTheme(
        <Layout>
          <main data-testid="main-content">Main Content</main>
        </Layout>
      );

      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(skipLink).toBeInTheDocument();

      await user.click(skipLink);

      const mainContent = screen.getByTestId('main-content');
      expect(document.activeElement).toBe(mainContent);
    });

    it('WHEN using screen reader THEN should have proper landmark regions', () => {
      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
      expect(screen.getByRole('main')).toBeInTheDocument(); // main
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    });

    it('WHEN high contrast mode enabled THEN should maintain readability', () => {
      // Mock high contrast media query
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-contrast: high)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const layoutContainer = screen.getByTestId('layout-container');
      expect(layoutContainer).toHaveClass('high-contrast-compatible');
    });
  });

  describe('GIVEN liquid glass effects integration requirements', () => {
    it('WHEN mobile device THEN should optimize glass effects for performance', () => {
      // Mock mobile device
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
      });

      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const glassElements = screen.getAllByTestId(/glass-effect-/);
      glassElements.forEach(element => {
        expect(element).toHaveClass('mobile-optimized-glass');
      });
    });

    it('WHEN prefers-reduced-motion THEN should disable glass animations', () => {
      // Mock prefers-reduced-motion
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      renderWithTheme(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      const glassElements = screen.getAllByTestId(/glass-effect-/);
      glassElements.forEach(element => {
        expect(element).toHaveClass('motion-reduced');
      });
    });

    it('WHEN seasonal themes active THEN should apply seasonal glass effects', () => {
      renderWithTheme(
        <Layout seasonalTheme="spring">
          <div>Test Content</div>
        </Layout>
      );

      const glassElements = screen.getAllByTestId(/glass-effect-/);
      glassElements.forEach(element => {
        expect(element).toHaveAttribute('data-seasonal-theme', 'spring');
      });
    });
  });
});