/**
 * Debug test to see actual rendered styles
 */

import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LiquidGlassCard } from './LiquidGlassCard.tdd';

describe('Debug Rendered Styles', () => {
  it('should show actual rendered styles', () => {
    render(
      <LiquidGlassCard blur={15} opacity={0.1} saturation={1.8}>
        Debug content
      </LiquidGlassCard>
    );
    
    const card = screen.getByTestId('liquid-glass-card');
    console.log('Card element:', card);
    console.log('Card style:', card.style);
    console.log('Card computed style:', getComputedStyle(card));
    console.log('Card attributes:', card.attributes);
    console.log('Card innerHTML:', card.innerHTML);
  });
});