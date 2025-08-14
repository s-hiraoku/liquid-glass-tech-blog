/**
 * Phase 2.4: Glasscn Theme Provider - Full Implementation
 * 
 * Provides integration with glasscn-ui theme system for time-based color gradients
 * and seasonal theme coordination with real-time gradient generation.
 */

import React, { useMemo, useEffect, useState } from 'react';
import { Season, TimeOfDay } from '@/tests/mocks/seasonal-theme-provider';

export interface GlasscnThemeProviderProps {
  season: Season;
  timeOfDay: TimeOfDay;
  seasonalGradients?: boolean;
  enableTransitions?: boolean;
  transitionDuration?: number;
  children: React.ReactNode;
}

export interface TimeTransition {
  fromTime: TimeOfDay;
  toTime: TimeOfDay;
  season: Season;
  duration: number;
}

export interface SeasonalGradientConfig {
  enableSeasonalGradients: boolean;
  timeOfDayIntegration: boolean;
  smoothTransitions: boolean;
}

export interface GradientDefinition {
  colors: string[];
  direction: string;
  steps: number;
  transition?: string;
}

/**
 * Time-based gradient configurations for each season and time of day
 */
const SEASONAL_GRADIENTS: Record<Season, Record<TimeOfDay, GradientDefinition>> = {
  spring: {
    morning: {
      colors: ['#ffb3d9', '#98fb98', '#e6f3ff'],
      direction: '135deg',
      steps: 8,
      transition: 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    },
    day: {
      colors: ['#98fb98', '#87ceeb', '#fffacd'],
      direction: '180deg',
      steps: 6,
      transition: 'all 1.5s ease-in-out'
    },
    evening: {
      colors: ['#ff8c00', '#ffa500', '#98fb98'],
      direction: '225deg',
      steps: 7,
      transition: 'all 2.5s ease-out'
    },
    night: {
      colors: ['#191970', '#98fb98', '#c0c0c0'],
      direction: '270deg',
      steps: 9,
      transition: 'all 3s ease-in-out'
    }
  },
  summer: {
    morning: {
      colors: ['#87ceeb', '#ffff00', '#ff6347'],
      direction: '120deg',
      steps: 7,
      transition: 'all 1.8s ease-out'
    },
    day: {
      colors: ['#1e90ff', '#ffff00', '#ff4500'],
      direction: '180deg',
      steps: 5,
      transition: 'all 1s linear'
    },
    evening: {
      colors: ['#ff4500', '#ff6347', '#ff8c00'],
      direction: '240deg',
      steps: 6,
      transition: 'all 2s ease-in-out'
    },
    night: {
      colors: ['#000080', '#191970', '#4169e1'],
      direction: '300deg',
      steps: 8,
      transition: 'all 2.5s ease-in'
    }
  },
  autumn: {
    morning: {
      colors: ['#ffa500', '#ff8c00', '#cd853f'],
      direction: '45deg',
      steps: 6,
      transition: 'all 2s ease-out'
    },
    day: {
      colors: ['#ff8c00', '#dc143c', '#8b4513'],
      direction: '90deg',
      steps: 7,
      transition: 'all 1.5s ease-in-out'
    },
    evening: {
      colors: ['#dc143c', '#8b0000', '#654321'],
      direction: '180deg',
      steps: 8,
      transition: 'all 3s ease-out'
    },
    night: {
      colors: ['#2f4f4f', '#696969', '#8b4513'],
      direction: '270deg',
      steps: 9,
      transition: 'all 2.5s ease-in-out'
    }
  },
  winter: {
    morning: {
      colors: ['#b0e0e6', '#e0ffff', '#f0f8ff'],
      direction: '60deg',
      steps: 8,
      transition: 'all 2.2s ease-out'
    },
    day: {
      colors: ['#87ceeb', '#b0c4de', '#e6e6fa'],
      direction: '120deg',
      steps: 6,
      transition: 'all 1.8s linear'
    },
    evening: {
      colors: ['#4169e1', '#6495ed', '#b0c4de'],
      direction: '200deg',
      steps: 7,
      transition: 'all 2.8s ease-in-out'
    },
    night: {
      colors: ['#191970', '#000080', '#4169e1'],
      direction: '300deg',
      steps: 10,
      transition: 'all 3.5s ease-in'
    }
  }
};

/**
 * Glasscn Theme Provider Component
 * 
 * Integrates with glasscn-ui theme system for seasonal color gradients
 * with real-time time-of-day transitions and GPU optimization.
 */
export const GlasscnThemeProvider: React.FC<GlasscnThemeProviderProps> = ({
  season,
  timeOfDay,
  seasonalGradients = true,
  enableTransitions = true,
  transitionDuration = 2000,
  children
}) => {
  const [currentGradient, setCurrentGradient] = useState<GradientDefinition | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generate current gradient based on season and time of day
  const activeGradient = useMemo(() => {
    if (!seasonalGradients) return null;
    return SEASONAL_GRADIENTS[season]?.[timeOfDay] || null;
  }, [season, timeOfDay, seasonalGradients]);

  // Handle smooth transitions between gradients
  useEffect(() => {
    if (!activeGradient || !enableTransitions) {
      setCurrentGradient(activeGradient);
      return;
    }

    if (currentGradient && currentGradient !== activeGradient) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setCurrentGradient(activeGradient);
        setIsTransitioning(false);
      }, transitionDuration / 2);

      return () => clearTimeout(timer);
    } else {
      setCurrentGradient(activeGradient);
    }
  }, [activeGradient, enableTransitions, transitionDuration, currentGradient]);

  // Generate CSS gradient string
  const gradientCSS = useMemo(() => {
    if (!currentGradient) return null;
    
    const { colors, direction, steps } = currentGradient;
    const gradientStops = colors.map((color, index) => {
      const position = (index / (colors.length - 1)) * 100;
      return `${color} ${position}%`;
    }).join(', ');
    
    return `linear-gradient(${direction}, ${gradientStops})`;
  }, [currentGradient]);

  // CSS custom properties for glasscn-ui integration
  const cssProperties = useMemo(() => {
    if (!currentGradient) return {};
    
    return {
      '--glasscn-gradient': gradientCSS,
      '--glasscn-gradient-direction': currentGradient.direction,
      '--glasscn-gradient-steps': currentGradient.steps.toString(),
      '--glasscn-transition': currentGradient.transition || 'none',
      '--glasscn-primary-color': currentGradient.colors[0],
      '--glasscn-secondary-color': currentGradient.colors[1],
      '--glasscn-accent-color': currentGradient.colors[2] || currentGradient.colors[1]
    };
  }, [currentGradient, gradientCSS]);

  return React.createElement('div', {
    'data-testid': 'glasscn-theme-provider',
    'data-theme': season,
    'data-time-of-day': timeOfDay,
    'data-seasonal-gradients': seasonalGradients,
    'data-gradient-active': !!currentGradient,
    'data-is-transitioning': isTransitioning,
    'data-gradient-steps': currentGradient?.steps || 0,
    className: `glasscn-theme-provider ${season}-season ${timeOfDay}-time ${isTransitioning ? 'transitioning' : ''}`,
    style: {
      ...cssProperties,
      background: gradientCSS || 'transparent',
      transition: enableTransitions ? `background ${transitionDuration}ms ease-in-out` : 'none'
    }
  }, children);
};

/**
 * Creates time-based gradient transitions with smooth animations
 */
export function createTimeTransition(config: TimeTransition): {
  gradient: GradientDefinition;
  transition: string;
  duration: number;
} {
  const { fromTime, toTime, season, duration } = config;
  
  const fromGradient = SEASONAL_GRADIENTS[season]?.[fromTime];
  const toGradient = SEASONAL_GRADIENTS[season]?.[toTime];
  
  if (!fromGradient || !toGradient) {
    throw new Error(`Invalid time transition: ${fromTime} to ${toTime} for season ${season}`);
  }

  // Create interpolated gradient for smooth transitions
  const interpolatedColors = fromGradient.colors.map((fromColor, index) => {
    const toColor = toGradient.colors[index] || toGradient.colors[toGradient.colors.length - 1];
    return `color-mix(in srgb, ${fromColor} 50%, ${toColor} 50%)`;
  });

  const interpolatedGradient: GradientDefinition = {
    colors: interpolatedColors,
    direction: `${(parseFloat(fromGradient.direction) + parseFloat(toGradient.direction)) / 2}deg`,
    steps: Math.round((fromGradient.steps + toGradient.steps) / 2),
    transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
  };

  return {
    gradient: interpolatedGradient,
    transition: interpolatedGradient.transition!,
    duration
  };
}

/**
 * Configures seasonal gradients with advanced options
 */
export function configureSeasonalGradients(config: SeasonalGradientConfig): {
  enabled: boolean;
  timeIntegration: boolean;
  smoothTransitions: boolean;
  cssProperties: Record<string, string>;
} {
  const { enableSeasonalGradients, timeOfDayIntegration, smoothTransitions } = config;
  
  const cssProperties: Record<string, string> = {
    '--seasonal-gradients-enabled': enableSeasonalGradients.toString(),
    '--time-integration-enabled': timeOfDayIntegration.toString(),
    '--smooth-transitions-enabled': smoothTransitions.toString()
  };

  if (enableSeasonalGradients) {
    cssProperties['--gradient-animation'] = smoothTransitions ? 
      'seasonal-gradient-transition 2s ease-in-out infinite alternate' : 'none';
    cssProperties['--gradient-blend-mode'] = 'multiply';
    cssProperties['--gradient-opacity'] = '0.8';
  }

  if (timeOfDayIntegration) {
    cssProperties['--time-gradient-overlay'] = 'rgba(255, 255, 255, 0.1)';
    cssProperties['--time-transition-duration'] = '1500ms';
  }

  return {
    enabled: enableSeasonalGradients,
    timeIntegration: timeOfDayIntegration,
    smoothTransitions,
    cssProperties
  };
}

/**
 * Hook for accessing glasscn theme utilities
 */
export function useGlasscnTheme(season: Season, timeOfDay: TimeOfDay) {
  const currentGradient = useMemo(() => {
    return SEASONAL_GRADIENTS[season]?.[timeOfDay] || null;
  }, [season, timeOfDay]);

  const timeGradients = useMemo(() => {
    return SEASONAL_GRADIENTS[season] || {};
  }, [season]);

  const applyTimeGradient = (time: TimeOfDay) => {
    const gradient = SEASONAL_GRADIENTS[season]?.[time];
    if (!gradient) return null;
    
    return {
      background: `linear-gradient(${gradient.direction}, ${gradient.colors.join(', ')})`,
      transition: gradient.transition || 'all 2s ease-in-out'
    };
  };

  const transitionToSeason = (newSeason: Season) => {
    const newGradient = SEASONAL_GRADIENTS[newSeason]?.[timeOfDay];
    if (!newGradient) return null;
    
    return createTimeTransition({
      fromTime: timeOfDay,
      toTime: timeOfDay,
      season: newSeason,
      duration: 2000
    });
  };

  return {
    currentTheme: season,
    currentGradient,
    timeGradients,
    applyTimeGradient,
    transitionToSeason
  };
}

/**
 * Creates time-based gradient with advanced configuration
 */
export function createTimeBasedGradient(season: Season, timeOfDay: TimeOfDay): GradientDefinition {
  const gradient = SEASONAL_GRADIENTS[season]?.[timeOfDay];
  
  if (!gradient) {
    throw new Error(`No gradient found for ${season} ${timeOfDay}`);
  }
  
  return gradient;
}