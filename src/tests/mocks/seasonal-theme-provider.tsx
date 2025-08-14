/**
 * SeasonalThemeProvider Mock for Testing
 * 
 * Provides a mock implementation of the seasonal theme provider for testing
 * liquid glass effects and theme switching functionality.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { vi } from 'vitest';

// Mock seasonal theme types
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export interface SeasonalTheme {
  season: Season;
  timeOfDay: TimeOfDay;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  glassMorphism: {
    backdropFilter: string;
    backgroundColor: string;
    borderColor: string;
    shadowColor: string;
  };
  particles: {
    type: string;
    count: number;
    size: [number, number];
    speed: number;
    opacity: number;
  };
}

export interface SeasonalThemeContextType {
  currentTheme: SeasonalTheme;
  season: Season;
  timeOfDay: TimeOfDay;
  setSeason: (season: Season) => void;
  setTimeOfDay: (timeOfDay: TimeOfDay) => void;
  isAutoMode: boolean;
  setAutoMode: (auto: boolean) => void;
  updateTheme: () => void;
}

// Mock theme data
const mockThemes: Record<Season, SeasonalTheme> = {
  spring: {
    season: 'spring',
    timeOfDay: 'morning',
    colors: {
      primary: '#ffb3d9',
      secondary: '#98fb98',
      accent: '#ffc0cb',
      background: 'rgba(255, 255, 255, 0.8)',
      surface: 'rgba(255, 255, 255, 0.6)',
    },
    glassMorphism: {
      backdropFilter: 'blur(15px) saturate(150%)',
      backgroundColor: 'rgba(255, 179, 217, 0.1)',
      borderColor: 'rgba(255, 179, 217, 0.2)',
      shadowColor: 'rgba(255, 179, 217, 0.3)',
    },
    particles: {
      type: 'sakura',
      count: 50,
      size: [4, 8],
      speed: 1.5,
      opacity: 0.7,
    },
  },
  summer: {
    season: 'summer',
    timeOfDay: 'day',
    colors: {
      primary: '#87ceeb',
      secondary: '#20b2aa',
      accent: '#00bfff',
      background: 'rgba(135, 206, 235, 0.8)',
      surface: 'rgba(135, 206, 235, 0.6)',
    },
    glassMorphism: {
      backdropFilter: 'blur(20px) saturate(180%)',
      backgroundColor: 'rgba(135, 206, 235, 0.15)',
      borderColor: 'rgba(135, 206, 235, 0.25)',
      shadowColor: 'rgba(135, 206, 235, 0.35)',
    },
    particles: {
      type: 'waterdrops',
      count: 30,
      size: [2, 6],
      speed: 2.0,
      opacity: 0.6,
    },
  },
  autumn: {
    season: 'autumn',
    timeOfDay: 'evening',
    colors: {
      primary: '#ff8c00',
      secondary: '#dc143c',
      accent: '#ffd700',
      background: 'rgba(255, 140, 0, 0.8)',
      surface: 'rgba(255, 140, 0, 0.6)',
    },
    glassMorphism: {
      backdropFilter: 'blur(18px) saturate(120%)',
      backgroundColor: 'rgba(255, 140, 0, 0.12)',
      borderColor: 'rgba(255, 140, 0, 0.22)',
      shadowColor: 'rgba(255, 140, 0, 0.32)',
    },
    particles: {
      type: 'leaves',
      count: 40,
      size: [6, 12],
      speed: 1.2,
      opacity: 0.8,
    },
  },
  winter: {
    season: 'winter',
    timeOfDay: 'night',
    colors: {
      primary: '#b0e0e6',
      secondary: '#4169e1',
      accent: '#ffffff',
      background: 'rgba(176, 224, 230, 0.8)',
      surface: 'rgba(176, 224, 230, 0.6)',
    },
    glassMorphism: {
      backdropFilter: 'blur(25px) saturate(200%)',
      backgroundColor: 'rgba(176, 224, 230, 0.18)',
      borderColor: 'rgba(176, 224, 230, 0.28)',
      shadowColor: 'rgba(176, 224, 230, 0.38)',
    },
    particles: {
      type: 'snow',
      count: 60,
      size: [3, 7],
      speed: 0.8,
      opacity: 0.9,
    },
  },
};

// Create mock context
const SeasonalThemeContext = createContext<SeasonalThemeContextType | null>(null);

// Mock provider implementation
export const SeasonalThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [season, setSeason] = useState<Season>('spring');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [isAutoMode, setAutoMode] = useState(false);

  const currentTheme = mockThemes[season];

  const updateTheme = vi.fn(() => {
    // Mock theme update logic
    if (isAutoMode) {
      const now = new Date();
      const month = now.getMonth();
      const hour = now.getHours();

      // Auto-detect season based on month
      if (month >= 2 && month <= 4) setSeason('spring');
      else if (month >= 5 && month <= 7) setSeason('summer');
      else if (month >= 8 && month <= 10) setSeason('autumn');
      else setSeason('winter');

      // Auto-detect time of day based on hour
      if (hour >= 6 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 18) setTimeOfDay('day');
      else if (hour >= 18 && hour < 22) setTimeOfDay('evening');
      else setTimeOfDay('night');
    }
  });

  const contextValue: SeasonalThemeContextType = {
    currentTheme,
    season,
    timeOfDay,
    setSeason,
    setTimeOfDay,
    isAutoMode,
    setAutoMode,
    updateTheme,
  };

  return (
    <SeasonalThemeContext.Provider value={contextValue}>
      <div data-testid="seasonal-theme-provider" data-season={season} data-time={timeOfDay}>
        {children}
      </div>
    </SeasonalThemeContext.Provider>
  );
};

// Mock hook for accessing seasonal theme context
export const useSeasonalTheme = (): SeasonalThemeContextType => {
  const context = useContext(SeasonalThemeContext);
  if (!context) {
    throw new Error('useSeasonalTheme must be used within a SeasonalThemeProvider');
  }
  return context;
};

// Export mock themes for testing
export { mockThemes };

// Alias for easier importing in tests
export const ThemeProvider = SeasonalThemeProvider;

// Mock weather-based theme detection
export const mockWeatherThemeDetection = () => {
  return vi.fn().mockResolvedValue({
    suggestedSeason: 'spring',
    suggestedTimeOfDay: 'morning',
    weatherCondition: 'sunny',
    confidence: 0.95,
  });
};

// Mock geolocation for seasonal detection
export const mockGeolocation = () => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn((success) => {
      success({
        coords: {
          latitude: 35.6762,
          longitude: 139.6503,
          accuracy: 100,
        },
        timestamp: Date.now(),
      });
    }),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  };

  Object.defineProperty(navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true,
  });

  return mockGeolocation;
};