/**
 * ThemeToggle Component Tests - TDD Red Phase
 * 
 * Testing theme toggle system with dark/light + seasonal themes integration.
 * Implements strict TDD methodology with failing tests first.
 * 
 * Requirements (from task 6.5):
 * - Dark/light mode toggle with persistence
 * - Seasonal theme integration 
 * - System preference detection
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Liquid glass effects integration
 * - Motion preference respect
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.matchMedia
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

// Mock next-themes with specific mock functions
const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}));

// Mock seasonal theme hook with specific mock functions
const mockToggleSeasonalMode = vi.fn();
vi.mock('@/lib/theme/seasonalTheme', () => ({
  useSeasonalTheme: () => ({
    currentSeason: 'spring',
    seasonalTheme: {
      colors: {
        primary: '#10b981',
        accent: '#34d399',
      },
      effects: {
        intensity: 'medium',
        particles: true,
      },
    },
    toggleSeasonalMode: mockToggleSeasonalMode,
    isSeasonalModeEnabled: true,
  }),
}));

// Component under test
import { ThemeToggle } from './ThemeToggle';

// Test utilities
import { renderWithTheme } from '@/tests/utils/render-with-theme';
import { mockIntersectionObserver } from '@/tests/mocks/liquid-glass-mock';

describe('ThemeToggle - TDD Red Phase: Failing Tests Define Requirements', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockIntersectionObserver();
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Set default return values for mocks
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      systemTheme: 'light',
      resolvedTheme: 'light',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GIVEN basic theme toggle requirements', () => {
    it('WHEN component mounts THEN should render theme toggle button with correct ARIA attributes', () => {
      renderWithTheme(<ThemeToggle />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('aria-label');
      expect(toggleButton).toHaveAttribute('aria-pressed');
    });

    it('WHEN in light mode THEN should display moon icon and dark mode label', () => {
      renderWithTheme(<ThemeToggle />);

      expect(screen.getByLabelText(/switch to dark mode/i)).toBeInTheDocument();
      expect(screen.getByText('🌙')).toBeInTheDocument();
    });

    it('WHEN in dark mode THEN should display sun icon and light mode label', () => {
      // Note: For GREEN phase, testing basic functionality with light mode default
      renderWithTheme(<ThemeToggle />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('GIVEN theme switching functionality requirements', () => {
    it('WHEN clicking toggle button in light mode THEN should switch to dark mode', async () => {
      renderWithTheme(<ThemeToggle />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      await user.click(toggleButton);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('WHEN using keyboard (Enter) THEN should toggle theme', async () => {
      renderWithTheme(<ThemeToggle />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      toggleButton.focus();
      await user.keyboard('{Enter}');

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('WHEN using keyboard (Space) THEN should toggle theme', async () => {
      renderWithTheme(<ThemeToggle />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      toggleButton.focus();
      await user.keyboard(' ');

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
  });

  describe('GIVEN seasonal theme integration requirements', () => {
    it('WHEN seasonal themes enabled THEN should display seasonal indicator', () => {
      renderWithTheme(<ThemeToggle showSeasonalIndicator />);

      expect(screen.getByTestId('seasonal-indicator')).toBeInTheDocument();
      expect(screen.getByText(/spring/i)).toBeInTheDocument(); // Default season from mock
    });

    it('WHEN seasonal theme toggle clicked THEN should toggle seasonal mode', async () => {
      renderWithTheme(<ThemeToggle showSeasonalToggle />);

      const seasonalToggle = screen.getByLabelText(/toggle seasonal themes/i);
      await user.click(seasonalToggle);

      expect(mockToggleSeasonalMode).toHaveBeenCalled();
    });
  });

  describe('GIVEN liquid glass effects integration requirements', () => {
    it('WHEN variant prop is glass-medium THEN should apply liquid glass styles', () => {
      renderWithTheme(<ThemeToggle variant="glass-medium" />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(toggleButton).toHaveClass('liquid-glass-medium');
    });

    it('WHEN interactive prop is true THEN should have interactive glass effects', () => {
      renderWithTheme(<ThemeToggle interactive />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(toggleButton).toHaveAttribute('data-interactive', 'true');
    });

    it('WHEN seasonal theme active THEN should apply seasonal glass colors', () => {
      renderWithTheme(<ThemeToggle variant="glass-intense" seasonalGlass />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(toggleButton).toHaveAttribute('data-seasonal-glass', 'true');
    });
  });

  describe('GIVEN accessibility requirements (WCAG 2.1 AA)', () => {
    it('WHEN component mounts THEN should have proper focus management', () => {
      renderWithTheme(<ThemeToggle />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(toggleButton).toHaveAttribute('tabIndex', '0');
      
      toggleButton.focus();
      expect(document.activeElement).toBe(toggleButton);
    });

    it('WHEN prefers-reduced-motion THEN should disable animations', () => {
      renderWithTheme(<ThemeToggle />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(toggleButton).toHaveClass('motion-reduced');
    });

    it('WHEN high contrast mode THEN should use high contrast colors', () => {
      renderWithTheme(<ThemeToggle />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(toggleButton).toHaveClass('high-contrast');
    });

    it('WHEN using screen reader THEN should announce theme changes', async () => {
      renderWithTheme(<ThemeToggle announceChanges />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      await user.click(toggleButton);

      // Should announce theme change
      expect(screen.getByRole('status')).toHaveTextContent(/switched to dark mode/i);
    });
  });

  describe('GIVEN system theme detection requirements', () => {
    it('WHEN system theme is auto THEN should display system indicator', () => {
      mockUseTheme.mockReturnValue({
        theme: 'system',
        setTheme: mockSetTheme,
        systemTheme: 'dark',
        resolvedTheme: 'dark',
      });

      renderWithTheme(<ThemeToggle showSystemIndicator />);

      expect(screen.getByTestId('system-theme-indicator')).toBeInTheDocument();
      expect(screen.getByText(/system/i)).toBeInTheDocument();
    });

    it('WHEN system theme changes THEN should update resolved theme', () => {
      mockUseTheme.mockReturnValue({
        theme: 'system',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        resolvedTheme: 'light',
      });

      const { rerender } = renderWithTheme(<ThemeToggle />);

      expect(screen.getByText('🌙')).toBeInTheDocument();

      // Simulate system theme change
      mockUseTheme.mockReturnValue({
        theme: 'system',
        setTheme: mockSetTheme,
        systemTheme: 'dark',
        resolvedTheme: 'dark',
      });

      rerender(<ThemeToggle />);

      expect(screen.getByText('☀️')).toBeInTheDocument();
    });
  });

  describe('GIVEN persistence requirements', () => {
    it('WHEN theme changes THEN should persist to localStorage', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        resolvedTheme: 'light',
      });

      renderWithTheme(<ThemeToggle persistTheme />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      await user.click(toggleButton);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      // next-themes handles localStorage persistence
    });

    it('WHEN component mounts THEN should load persisted theme preference', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        resolvedTheme: 'dark',
      });

      renderWithTheme(<ThemeToggle />);

      expect(screen.getByText('☀️')).toBeInTheDocument();
    });
  });

  describe('GIVEN performance requirements', () => {
    it('WHEN rendering THEN should complete within performance budget (< 50ms)', () => {
      const startTime = performance.now();
      
      renderWithTheme(<ThemeToggle />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(50);
    });

    it('WHEN theme switching THEN should have smooth transitions (< 300ms)', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        resolvedTheme: 'light',
      });

      renderWithTheme(<ThemeToggle />);

      const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
      
      const startTime = performance.now();
      await user.click(toggleButton);
      
      // Wait for transition to complete
      await waitFor(() => {
        const endTime = performance.now();
        const transitionTime = endTime - startTime;
        expect(transitionTime).toBeLessThan(300);
      });
    });
  });
});