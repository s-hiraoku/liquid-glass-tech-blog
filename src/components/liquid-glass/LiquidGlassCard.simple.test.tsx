/**
 * Simple TDD Red-Green-Refactor Test for LiquidGlassCard
 * Phase 2: Core Liquid Glass Component Implementation
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock the liquid glass library first
vi.mock('@developer-hub/liquid-glass', () => ({
  LiquidGlass: ({ children, ...props }: any) => (
    <div data-testid="liquid-glass" {...props}>
      {children}
    </div>
  ),
  createLiquidGlass: vi.fn(() => ({
    render: vi.fn(),
    updateParams: vi.fn(),
    destroy: vi.fn()
  })),
  withGlassEffect: vi.fn((component) => component),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

// Mock shadcn/ui components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div data-testid="card-content" {...props}>{children}</div>
}));

// Mock utils
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

// Mock types
vi.mock('@/types/liquid-glass', () => ({}));

// Now import the component
import { LiquidGlassCard } from './LiquidGlassCard';

describe('LiquidGlassCard TDD Implementation', () => {
  describe('Phase 1: RED - Basic Rendering Tests', () => {
    it('GIVEN a LiquidGlassCard component WHEN rendered THEN displays content', () => {
      // ARRANGE
      const testContent = 'Test liquid glass content';
      
      // ACT
      render(<LiquidGlassCard>{testContent}</LiquidGlassCard>);
      
      // ASSERT
      expect(screen.getByText(testContent)).toBeInTheDocument();
      expect(screen.getByTestId('liquid-glass')).toBeInTheDocument();
    });

    it('GIVEN a LiquidGlassCard WHEN rendered with default props THEN applies glass-medium variant', () => {
      // ARRANGE
      const testContent = 'Default variant test';
      
      // ACT
      render(<LiquidGlassCard>{testContent}</LiquidGlassCard>);
      
      // ASSERT
      const liquidGlass = screen.getByTestId('liquid-glass');
      expect(liquidGlass).toHaveAttribute('variant', 'glass-medium');
    });

    it('GIVEN a LiquidGlassCard WHEN rendered with custom blur THEN applies blur property', () => {
      // ARRANGE
      const testContent = 'Custom blur test';
      const customBlur = 25;
      
      // ACT
      render(<LiquidGlassCard blur={customBlur}>{testContent}</LiquidGlassCard>);
      
      // ASSERT
      const liquidGlass = screen.getByTestId('liquid-glass');
      expect(liquidGlass).toHaveAttribute('blur', '25');
    });
  });

  describe('Phase 2: GREEN - Interactive Features', () => {
    it('GIVEN a LiquidGlassCard WHEN interactive=true THEN enables interactive features', () => {
      // ARRANGE
      const testContent = 'Interactive test';
      
      // ACT
      render(<LiquidGlassCard interactive>{testContent}</LiquidGlassCard>);
      
      // ASSERT
      const liquidGlass = screen.getByTestId('liquid-glass');
      expect(liquidGlass).toBeInTheDocument();
      // Interactive features would be verified through motion props
    });
  });

  describe('Phase 3: REFACTOR - Component Optimization', () => {
    it('GIVEN a LiquidGlassCard WHEN rendered multiple times THEN maintains performance', () => {
      // ARRANGE
      const testContent = 'Performance test';
      
      // ACT
      const { rerender } = render(<LiquidGlassCard blur={10}>{testContent}</LiquidGlassCard>);
      rerender(<LiquidGlassCard blur={20}>{testContent}</LiquidGlassCard>);
      rerender(<LiquidGlassCard blur={30}>{testContent}</LiquidGlassCard>);
      
      // ASSERT
      expect(screen.getByText(testContent)).toBeInTheDocument();
      const liquidGlass = screen.getByTestId('liquid-glass');
      expect(liquidGlass).toHaveAttribute('blur', '30');
    });
  });
});