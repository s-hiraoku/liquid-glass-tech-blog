/**
 * Phase 2.4: Seasonal Transitions Hook - Full Implementation
 * 
 * Provides smooth transition controls for seasonal boundary changes
 * and theme provider coordination with GPU-accelerated animations.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Season } from '@/tests/mocks/seasonal-theme-provider';

export interface SeasonalTransitionsConfig {
  duration?: number;
  easing?: 'linear' | 'spring' | 'ease-in-out' | 'cubic-bezier';
  autoTransition?: boolean;
  gpuAccelerated?: boolean;
  pauseOnHover?: boolean;
  reverseOnCancel?: boolean;
}

export interface SeasonalTransitionsResult {
  isTransitioning: boolean;
  progress: number;
  currentSeason: Season | null;
  targetSeason: Season | null;
  transitionTo: (season: Season) => Promise<void>;
  cancelTransition: () => void;
  pauseTransition: () => void;
  resumeTransition: () => void;
  setProgress: (progress: number) => void;
}

export interface SeasonalBoundary {
  date: Date;
  season: Season;
  type: 'equinox' | 'solstice';
  name: string;
}

/**
 * Easing functions for different transition types
 */
const EASING_FUNCTIONS = {
  linear: (t: number) => t,
  'ease-in-out': (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  spring: (t: number) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  'cubic-bezier': (t: number) => {
    // Custom cubic-bezier approximation for smooth seasonal transitions
    return 3 * t * t - 2 * t * t * t;
  }
};

/**
 * Seasonal boundary dates (Northern Hemisphere)
 */
const SEASONAL_BOUNDARIES: Record<number, SeasonalBoundary[]> = {
  2024: [
    { date: new Date('2024-03-20T03:06:00Z'), season: 'spring', type: 'equinox', name: 'Spring Equinox' },
    { date: new Date('2024-06-20T20:51:00Z'), season: 'summer', type: 'solstice', name: 'Summer Solstice' },
    { date: new Date('2024-09-22T12:44:00Z'), season: 'autumn', type: 'equinox', name: 'Autumn Equinox' },
    { date: new Date('2024-12-21T09:21:00Z'), season: 'winter', type: 'solstice', name: 'Winter Solstice' }
  ],
  2025: [
    { date: new Date('2025-03-20T09:01:00Z'), season: 'spring', type: 'equinox', name: 'Spring Equinox' },
    { date: new Date('2025-06-21T02:42:00Z'), season: 'summer', type: 'solstice', name: 'Summer Solstice' },
    { date: new Date('2025-09-22T18:19:00Z'), season: 'autumn', type: 'equinox', name: 'Autumn Equinox' },
    { date: new Date('2025-12-21T15:03:00Z'), season: 'winter', type: 'solstice', name: 'Winter Solstice' }
  ]
};

/**
 * Hook for managing seasonal transitions with smooth animations and GPU acceleration
 */
export function useSeasonalTransitions(config: SeasonalTransitionsConfig): SeasonalTransitionsResult {
  const {
    duration = 2000,
    easing = 'spring',
    autoTransition = false,
    gpuAccelerated = true,
    pauseOnHover = false,
    reverseOnCancel = false
  } = config;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [targetSeason, setTargetSeason] = useState<Season | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const easingFunction = EASING_FUNCTIONS[easing] || EASING_FUNCTIONS.spring;

  // GPU acceleration setup
  useEffect(() => {
    if (gpuAccelerated && typeof document !== 'undefined' && document.documentElement?.style) {
      document.documentElement.style.setProperty('--seasonal-gpu-acceleration', 'auto');
      document.documentElement.style.setProperty('--seasonal-will-change', 'transform, opacity, filter');
    }

    return () => {
      if (typeof document !== 'undefined' && document.documentElement?.style?.removeProperty) {
        try {
          document.documentElement.style.removeProperty('--seasonal-gpu-acceleration');
          document.documentElement.style.removeProperty('--seasonal-will-change');
        } catch (error) {
          // Handle JSDOM limitations in test environment
          if (process.env.NODE_ENV !== 'test') {
            console.warn('Failed to remove CSS properties:', error);
          }
        }
      }
    };
  }, [gpuAccelerated]);

  // Animation loop with requestAnimationFrame
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    if (isPaused) {
      pausedTimeRef.current += 16; // Estimate 16ms per frame
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const elapsed = timestamp - startTimeRef.current - pausedTimeRef.current;
    const rawProgress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunction(rawProgress);

    setProgressState(easedProgress);

    if (rawProgress >= 1) {
      setIsTransitioning(false);
      setCurrentSeason(targetSeason);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
    } else {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [duration, easingFunction, isPaused, targetSeason]);

  // Transition to new season
  const transitionTo = useCallback(async (season: Season): Promise<void> => {
    return new Promise((resolve) => {
      if (isTransitioning) {
        cancelTransition();
      }

      setCurrentSeason(prev => prev || season);
      setTargetSeason(season);
      setIsTransitioning(true);
      setProgressState(0);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;

      // Start animation
      animationFrameRef.current = requestAnimationFrame(animate);

      // Resolve when transition completes
      const checkComplete = () => {
        if (!isTransitioning) {
          resolve();
        } else {
          setTimeout(checkComplete, 50);
        }
      };
      setTimeout(checkComplete, duration + 100);
    });
  }, [isTransitioning, animate, duration]);

  // Cancel transition
  const cancelTransition = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (reverseOnCancel && progress > 0) {
      // Reverse the transition
      const reverseStartTime = performance.now();
      const reverseProgress = progress;
      
      const reverseAnimate = (timestamp: number) => {
        const elapsed = timestamp - reverseStartTime;
        const reverseRawProgress = Math.min(elapsed / (duration * reverseProgress), 1);
        const newProgress = reverseProgress * (1 - easingFunction(reverseRawProgress));
        
        setProgressState(newProgress);
        
        if (reverseRawProgress >= 1) {
          setIsTransitioning(false);
          setProgressState(0);
          setTargetSeason(null);
        } else {
          requestAnimationFrame(reverseAnimate);
        }
      };
      
      requestAnimationFrame(reverseAnimate);
    } else {
      setIsTransitioning(false);
      setProgressState(0);
      setTargetSeason(null);
    }
    
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [progress, reverseOnCancel, duration, easingFunction]);

  // Pause transition
  const pauseTransition = useCallback(() => {
    if (isTransitioning && !isPaused) {
      setIsPaused(true);
    }
  }, [isTransitioning, isPaused]);

  // Resume transition
  const resumeTransition = useCallback(() => {
    if (isTransitioning && isPaused) {
      setIsPaused(false);
    }
  }, [isTransitioning, isPaused]);

  // Manual progress setter
  const setProgress = useCallback((newProgress: number) => {
    const clampedProgress = Math.max(0, Math.min(1, newProgress));
    setProgressState(clampedProgress);
    
    if (clampedProgress >= 1 && isTransitioning) {
      setIsTransitioning(false);
      setCurrentSeason(targetSeason);
    }
  }, [isTransitioning, targetSeason]);

  // Auto transition on seasonal boundaries
  useEffect(() => {
    if (!autoTransition) return;

    const checkSeasonalBoundary = () => {
      const boundary = detectSeasonalBoundary(new Date());
      if (boundary && boundary.season !== currentSeason) {
        transitionTo(boundary.season);
      }
    };

    // Check daily at noon
    const interval = setInterval(checkSeasonalBoundary, 24 * 60 * 60 * 1000);
    checkSeasonalBoundary(); // Initial check

    return () => clearInterval(interval);
  }, [autoTransition, currentSeason, transitionTo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isTransitioning,
    progress,
    currentSeason,
    targetSeason,
    transitionTo,
    cancelTransition,
    pauseTransition,
    resumeTransition,
    setProgress
  };
}

/**
 * Detects seasonal boundary dates (equinox/solstice) for the given date
 */
export function detectSeasonalBoundary(date: Date): SeasonalBoundary | null {
  const year = date.getFullYear();
  const boundaries = SEASONAL_BOUNDARIES[year];
  
  if (!boundaries) {
    // Fallback to approximate dates if exact year not available
    const month = date.getMonth();
    const day = date.getDate();
    
    if ((month === 2 && day >= 19 && day <= 22)) {
      return {
        date: new Date(year, 2, 20),
        season: 'spring',
        type: 'equinox',
        name: 'Spring Equinox (Approximate)'
      };
    } else if ((month === 5 && day >= 19 && day <= 22)) {
      return {
        date: new Date(year, 5, 21),
        season: 'summer',
        type: 'solstice',
        name: 'Summer Solstice (Approximate)'
      };
    } else if ((month === 8 && day >= 21 && day <= 24)) {
      return {
        date: new Date(year, 8, 22),
        season: 'autumn',
        type: 'equinox',
        name: 'Autumn Equinox (Approximate)'
      };
    } else if ((month === 11 && day >= 20 && day <= 23)) {
      return {
        date: new Date(year, 11, 21),
        season: 'winter',
        type: 'solstice',
        name: 'Winter Solstice (Approximate)'
      };
    }
    
    return null;
  }
  
  // Find the closest boundary
  const currentTime = date.getTime();
  const toleranceMs = 24 * 60 * 60 * 1000; // 1 day tolerance
  
  for (const boundary of boundaries) {
    const boundaryTime = boundary.date.getTime();
    if (Math.abs(currentTime - boundaryTime) <= toleranceMs) {
      return boundary;
    }
  }
  
  return null;
}

/**
 * Gets all seasonal boundaries for a given year
 */
export function getSeasonalBoundaries(year: number): SeasonalBoundary[] {
  return SEASONAL_BOUNDARIES[year] || [];
}

/**
 * Gets the next seasonal boundary from the given date
 */
export function getNextSeasonalBoundary(date: Date): SeasonalBoundary | null {
  const year = date.getFullYear();
  const boundaries = SEASONAL_BOUNDARIES[year] || SEASONAL_BOUNDARIES[year + 1];
  
  if (!boundaries) return null;
  
  const currentTime = date.getTime();
  
  for (const boundary of boundaries) {
    if (boundary.date.getTime() > currentTime) {
      return boundary;
    }
  }
  
  // If no boundary found in current year, check next year
  const nextYearBoundaries = SEASONAL_BOUNDARIES[year + 1];
  return nextYearBoundaries ? nextYearBoundaries[0] : null;
}

/**
 * Gets the current season based on the date
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth();
  const day = date.getDate();
  
  // Northern hemisphere seasonal boundaries
  if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day < 21)) {
    return 'spring';
  } else if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day < 23)) {
    return 'summer';
  } else if ((month === 8 && day >= 23) || month === 9 || month === 10 || (month === 11 && day < 21)) {
    return 'autumn';
  } else {
    return 'winter';
  }
}