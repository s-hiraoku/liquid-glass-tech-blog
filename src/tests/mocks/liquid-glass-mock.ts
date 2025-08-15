import React from 'react';
import { vi } from 'vitest';

/**
 * Mock implementation for @developer-hub/liquid-glass
 * Provides basic mock functions for testing liquid glass components
 */

export const MockGlassCard = vi.fn(({ children, className, ...props }) => (
  React.createElement('div', {
    className: `mock-glass-card ${className || ''}`,
    'data-testid': 'mock-glass-card',
    ...props
  }, children)
));

export const mockLiquidGlassAPI = {
  GlassCard: MockGlassCard,
};

/**
 * Mock IntersectionObserver for testing components that use it
 */
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
};

// Mock the entire module
vi.mock('@developer-hub/liquid-glass', () => mockLiquidGlassAPI);

export default mockLiquidGlassAPI;