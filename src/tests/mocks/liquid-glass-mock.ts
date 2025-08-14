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

// Mock the entire module
vi.mock('@developer-hub/liquid-glass', () => mockLiquidGlassAPI);

export default mockLiquidGlassAPI;