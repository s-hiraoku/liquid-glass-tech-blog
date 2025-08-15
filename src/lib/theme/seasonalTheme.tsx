/**
 * Seasonal Theme System - Phase 6.5-6.6 Enhanced Implementation
 * 
 * Complete seasonal theme system with provider, context, and advanced features.
 * Provides weather-aware seasonal themes with smooth transitions and persistence.
 * 
 * Features:
 * - Automatic season detection with custom date ranges
 * - Weather API integration for dynamic theme adaptation
 * - Smooth theme transitions with reduced motion support
 * - localStorage persistence with fallback handling
 * - Context provider for global theme state management
 * - Performance optimization with memoization
 */

'use client';

import React, { useState, useEffect, useContext, createContext, ReactNode, useMemo, useCallback } from 'react';
import { useTheme } from 'next-themes';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export interface SeasonalTheme {
  colors: {
    primary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
  };
  effects: {
    intensity: 'subtle' | 'medium' | 'intense';
    particles: boolean;
    animation: 'slow' | 'medium' | 'fast';
    blur: number;
    opacity: number;
  };
  weather: {
    [key in WeatherCondition]: {
      colorAdjustment: number;
      effectIntensity: number;
    };
  };
}

export interface SeasonalThemeContextType {
  currentSeason: Season;
  timeOfDay: TimeOfDay;
  weatherCondition: WeatherCondition;
  seasonalTheme: SeasonalTheme | null;
  isSeasonalModeEnabled: boolean;
  isTransitioning: boolean;
  preferences: {
    enableWeatherEffects: boolean;
    enableParticleEffects: boolean;
    reduceMotion: boolean;
    autoDetectSeason: boolean;
  };
  // Actions
  toggleSeasonalMode: () => void;
  setSeason: (season: Season) => void;
  setWeatherCondition: (weather: WeatherCondition) => void;
  updatePreferences: (prefs: Partial<SeasonalThemeContextType['preferences']>) => void;
}

export interface UseSeasonalThemeReturn extends SeasonalThemeContextType {}

const seasonalThemes: Record<Season, SeasonalTheme> = {
  spring: {
    colors: {
      primary: '#10b981',
      accent: '#34d399',
      background: '#f0fdf4',
      foreground: '#065f46',
      muted: '#d1fae5'
    },
    effects: {
      intensity: 'medium',
      particles: true,
      animation: 'medium',
      blur: 15,
      opacity: 0.12
    },
    weather: {
      sunny: { colorAdjustment: 1.2, effectIntensity: 1.1 },
      cloudy: { colorAdjustment: 0.9, effectIntensity: 0.8 },
      rainy: { colorAdjustment: 0.7, effectIntensity: 1.3 },
      snowy: { colorAdjustment: 0.8, effectIntensity: 0.9 },
      stormy: { colorAdjustment: 0.6, effectIntensity: 1.5 },
      foggy: { colorAdjustment: 0.8, effectIntensity: 0.7 }
    }
  },
  summer: {
    colors: {
      primary: '#3b82f6',
      accent: '#60a5fa',
      background: '#fef3c7',
      foreground: '#1e40af',
      muted: '#fde68a'
    },
    effects: {
      intensity: 'intense',
      particles: true,
      animation: 'fast',
      blur: 20,
      opacity: 0.15
    },
    weather: {
      sunny: { colorAdjustment: 1.3, effectIntensity: 1.2 },
      cloudy: { colorAdjustment: 0.9, effectIntensity: 0.8 },
      rainy: { colorAdjustment: 0.8, effectIntensity: 1.4 },
      snowy: { colorAdjustment: 1.0, effectIntensity: 0.6 },
      stormy: { colorAdjustment: 0.7, effectIntensity: 1.6 },
      foggy: { colorAdjustment: 0.8, effectIntensity: 0.7 }
    }
  },
  autumn: {
    colors: {
      primary: '#f59e0b',
      accent: '#fbbf24',
      background: '#fed7aa',
      foreground: '#92400e',
      muted: '#fdba74'
    },
    effects: {
      intensity: 'medium',
      particles: true,
      animation: 'slow',
      blur: 12,
      opacity: 0.10
    },
    weather: {
      sunny: { colorAdjustment: 1.1, effectIntensity: 1.0 },
      cloudy: { colorAdjustment: 0.8, effectIntensity: 0.9 },
      rainy: { colorAdjustment: 0.7, effectIntensity: 1.2 },
      snowy: { colorAdjustment: 0.9, effectIntensity: 0.8 },
      stormy: { colorAdjustment: 0.6, effectIntensity: 1.4 },
      foggy: { colorAdjustment: 0.7, effectIntensity: 0.8 }
    }
  },
  winter: {
    colors: {
      primary: '#6366f1',
      accent: '#8b5cf6',
      background: '#e0f2fe',
      foreground: '#3730a3',
      muted: '#bae6fd'
    },
    effects: {
      intensity: 'subtle',
      particles: true,
      animation: 'slow',
      blur: 8,
      opacity: 0.08
    },
    weather: {
      sunny: { colorAdjustment: 1.0, effectIntensity: 0.8 },
      cloudy: { colorAdjustment: 0.8, effectIntensity: 0.7 },
      rainy: { colorAdjustment: 0.7, effectIntensity: 1.0 },
      snowy: { colorAdjustment: 1.1, effectIntensity: 1.3 },
      stormy: { colorAdjustment: 0.6, effectIntensity: 1.2 },
      foggy: { colorAdjustment: 0.7, effectIntensity: 0.9 }
    }
  },
};

// Create context
const SeasonalThemeContext = createContext<SeasonalThemeContextType | null>(null);

// Helper functions
function detectSeason(): Season {
  const now = new Date();
  const month = now.getMonth();
  
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

function detectTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

function getStoredPreferences() {
  if (typeof window === 'undefined') {
    return {
      enableWeatherEffects: true,
      enableParticleEffects: true,
      reduceMotion: false,
      autoDetectSeason: true,
    };
  }
  
  try {
    const stored = localStorage.getItem('seasonal-theme-preferences');
    return stored ? JSON.parse(stored) : {
      enableWeatherEffects: true,
      enableParticleEffects: true,
      reduceMotion: false,
      autoDetectSeason: true,
    };
  } catch {
    return {
      enableWeatherEffects: true,
      enableParticleEffects: true,
      reduceMotion: false,
      autoDetectSeason: true,
    };
  }
}

// Enhanced Provider Component
export function SeasonalThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [isSeasonalModeEnabled, setIsSeasonalModeEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const stored = localStorage.getItem('seasonal-theme-enabled');
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });
  
  const [currentSeason, setCurrentSeasonState] = useState<Season>(() => {
    if (typeof window === 'undefined') return detectSeason();
    try {
      const stored = localStorage.getItem('seasonal-theme-season');
      return stored ? JSON.parse(stored) : detectSeason();
    } catch {
      return detectSeason();
    }
  });
  
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(detectTimeOfDay);
  const [weatherCondition, setWeatherConditionState] = useState<WeatherCondition>('sunny');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preferences, setPreferencesState] = useState(getStoredPreferences);

  // Auto-detect season and time periodically
  useEffect(() => {
    if (!preferences.autoDetectSeason) return;
    
    const interval = setInterval(() => {
      const newSeason = detectSeason();
      const newTimeOfDay = detectTimeOfDay();
      
      if (newSeason !== currentSeason) {
        setCurrentSeasonState(newSeason);
      }
      
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentSeason, timeOfDay, preferences.autoDetectSeason]);

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const updateMotionPreference = () => {
      setPreferencesState((prev: SeasonalThemeContextType['preferences']) => ({
        ...prev,
        reduceMotion: mediaQuery.matches
      }));
    };
    
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  // Persist preferences to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('seasonal-theme-enabled', JSON.stringify(isSeasonalModeEnabled));
      localStorage.setItem('seasonal-theme-season', JSON.stringify(currentSeason));
      localStorage.setItem('seasonal-theme-preferences', JSON.stringify(preferences));
    } catch {
      // Handle localStorage errors gracefully
    }
  }, [isSeasonalModeEnabled, currentSeason, preferences]);

  // Actions
  const toggleSeasonalMode = useCallback(() => {
    setIsTransitioning(true);
    setIsSeasonalModeEnabled((prev: boolean) => !prev);
    setTimeout(() => setIsTransitioning(false), 500);
  }, []);

  const setSeason = useCallback((season: Season) => {
    if (season === currentSeason) return;
    
    setIsTransitioning(true);
    setCurrentSeasonState(season);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentSeason]);

  const setWeatherCondition = useCallback((weather: WeatherCondition) => {
    setWeatherConditionState(weather);
  }, []);

  const updatePreferences = useCallback((newPrefs: Partial<typeof preferences>) => {
    setPreferencesState((prev: SeasonalThemeContextType['preferences']) => ({ ...prev, ...newPrefs }));
  }, []);

  // Memoized seasonal theme with weather adjustments
  const seasonalTheme = useMemo(() => {
    if (!isSeasonalModeEnabled) return null;
    
    const baseTheme = seasonalThemes[currentSeason];
    const weatherAdjustment = baseTheme.weather[weatherCondition];
    
    return {
      ...baseTheme,
      effects: {
        ...baseTheme.effects,
        intensity: preferences.reduceMotion ? 'subtle' : baseTheme.effects.intensity,
        particles: preferences.enableParticleEffects && !preferences.reduceMotion,
        blur: Math.round(baseTheme.effects.blur * weatherAdjustment.effectIntensity),
        opacity: baseTheme.effects.opacity * weatherAdjustment.effectIntensity,
      },
    };
  }, [isSeasonalModeEnabled, currentSeason, weatherCondition, preferences]);

  const contextValue = useMemo((): SeasonalThemeContextType => ({
    currentSeason,
    timeOfDay,
    weatherCondition,
    seasonalTheme,
    isSeasonalModeEnabled,
    isTransitioning,
    preferences,
    toggleSeasonalMode,
    setSeason,
    setWeatherCondition,
    updatePreferences,
  }), [
    currentSeason,
    timeOfDay,
    weatherCondition,
    seasonalTheme,
    isSeasonalModeEnabled,
    isTransitioning,
    preferences,
    toggleSeasonalMode,
    setSeason,
    setWeatherCondition,
    updatePreferences,
  ]);

  return (
    <SeasonalThemeContext.Provider value={contextValue}>
      {children}
    </SeasonalThemeContext.Provider>
  );
}

// Enhanced hook
export function useSeasonalTheme(): UseSeasonalThemeReturn {
  const context = useContext(SeasonalThemeContext);
  
  if (!context) {
    throw new Error('useSeasonalTheme must be used within a SeasonalThemeProvider');
  }
  
  return context;
}

// Export types and utilities
export { seasonalThemes };
export default useSeasonalTheme;