/**
 * Phase 2.4: Weather Theme Integration - Full Implementation
 * 
 * Weather API integration for environmental glass effect adjustments
 * with real-time weather data and dynamic liquid glass modifications.
 */

import { WeatherAPI } from '@/tests/mocks/weather-api';
import { Season, TimeOfDay } from '@/tests/mocks/seasonal-theme-provider';
import { createSeasonalGlassEffect, SeasonalGlassParams } from './seasonalGlassEffects';

export interface WeatherEffectConfig {
  enabled: boolean;
  updateInterval: number;
  fallbackWeather: string;
  intensityMultiplier: number;
  particleEffects: boolean;
  backgroundEffects: boolean;
}

export interface WeatherThemeData {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
}

export interface WeatherGlassEffect {
  blurIntensity: number;
  opacityLevel: number;
  particleCount: number;
  particleType: string;
  animationSpeed: number;
  colorOverlay: string;
}

/**
 * Global weather effects configuration
 */
let weatherConfig: WeatherEffectConfig = {
  enabled: false,
  updateInterval: 900000, // 15 minutes
  fallbackWeather: 'sunny',
  intensityMultiplier: 1.0,
  particleEffects: true,
  backgroundEffects: true
};

let weatherUpdateInterval: NodeJS.Timeout | null = null;
let currentWeatherData: WeatherThemeData | null = null;

/**
 * Weather condition to glass effect mappings
 */
const WEATHER_GLASS_EFFECTS: Record<string, WeatherGlassEffect> = {
  sunny: {
    blurIntensity: 0.8,
    opacityLevel: 0.1,
    particleCount: 20,
    particleType: 'sparkle',
    animationSpeed: 1.0,
    colorOverlay: 'rgba(255, 255, 0, 0.1)'
  },
  cloudy: {
    blurIntensity: 1.2,
    opacityLevel: 0.15,
    particleCount: 40,
    particleType: 'clouds',
    animationSpeed: 0.7,
    colorOverlay: 'rgba(128, 128, 128, 0.2)'
  },
  rainy: {
    blurIntensity: 1.6,
    opacityLevel: 0.25,
    particleCount: 100,
    particleType: 'rain',
    animationSpeed: 1.8,
    colorOverlay: 'rgba(0, 100, 200, 0.3)'
  },
  snowy: {
    blurIntensity: 1.4,
    opacityLevel: 0.2,
    particleCount: 80,
    particleType: 'snow',
    animationSpeed: 0.5,
    colorOverlay: 'rgba(255, 255, 255, 0.4)'
  },
  stormy: {
    blurIntensity: 2.0,
    opacityLevel: 0.35,
    particleCount: 150,
    particleType: 'storm',
    animationSpeed: 2.5,
    colorOverlay: 'rgba(50, 50, 50, 0.5)'
  },
  foggy: {
    blurIntensity: 2.2,
    opacityLevel: 0.4,
    particleCount: 60,
    particleType: 'fog',
    animationSpeed: 0.3,
    colorOverlay: 'rgba(200, 200, 200, 0.6)'
  }
};

/**
 * Enables weather effects with real-time updates
 */
export function enableWeatherEffects(config?: Partial<WeatherEffectConfig>): void {
  // Merge with default configuration
  weatherConfig = { ...weatherConfig, ...config, enabled: true };
  
  // Start weather data fetching
  startWeatherUpdates();
  
  // Set up CSS custom properties
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--weather-effects-enabled', 'true');
    document.documentElement.style.setProperty('--weather-intensity-multiplier', 
      weatherConfig.intensityMultiplier.toString());
  }
}

/**
 * Disables weather effects and cleans up
 */
export function disableWeatherEffects(): void {
  weatherConfig.enabled = false;
  
  if (weatherUpdateInterval) {
    clearInterval(weatherUpdateInterval);
    weatherUpdateInterval = null;
  }
  
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--weather-effects-enabled', 'false');
  }
}

/**
 * Fetches local weather theme based on geolocation
 */
export async function fetchLocalWeatherTheme(): Promise<{
  weatherData: WeatherThemeData;
  glassEffect: WeatherGlassEffect;
  themeSuggestion: any;
}> {
  try {
    // Fetch current weather data
    const weather = await WeatherAPI.getCurrentWeather();
    
    // Convert to our internal format
    const weatherData: WeatherThemeData = {
      condition: weather.weather,
      temperature: weather.temperature,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      visibility: weather.visibility || 10000,
      pressure: 1013 // Default pressure value as weather API doesn't provide this
    };
    
    // Get glass effect configuration
    const glassEffect = getWeatherGlassEffect(weather.weather);
    
    // Get theme suggestion from API
    const themeSuggestion = await WeatherAPI.getThemeSuggestion(weather);
    
    // Update current weather data
    currentWeatherData = weatherData;
    
    // Apply weather effects to DOM
    applyWeatherEffectsToDOM(weatherData, glassEffect);
    
    return {
      weatherData,
      glassEffect,
      themeSuggestion
    };
  } catch (error) {
    console.warn('Failed to fetch local weather theme:', error);
    
    // Return fallback configuration
    const fallbackWeather: WeatherThemeData = {
      condition: weatherConfig.fallbackWeather,
      temperature: 20,
      humidity: 50,
      windSpeed: 5,
      visibility: 10000,
      pressure: 1013
    };
    
    return {
      weatherData: fallbackWeather,
      glassEffect: getWeatherGlassEffect(weatherConfig.fallbackWeather),
      themeSuggestion: {
        season: 'spring',
        timeOfDay: 'day',
        glassMorphismIntensity: 0.5,
        particleEffect: 'none'
      }
    };
  }
}

/**
 * Gets weather-specific glass effect configuration
 */
export function getWeatherGlassEffect(condition: string): WeatherGlassEffect {
  const baseEffect = WEATHER_GLASS_EFFECTS[condition] || WEATHER_GLASS_EFFECTS.sunny;
  
  // Apply intensity multiplier
  return {
    ...baseEffect,
    blurIntensity: baseEffect.blurIntensity * weatherConfig.intensityMultiplier,
    opacityLevel: Math.min(baseEffect.opacityLevel * weatherConfig.intensityMultiplier, 0.8),
    particleCount: Math.round(baseEffect.particleCount * weatherConfig.intensityMultiplier),
    animationSpeed: baseEffect.animationSpeed * weatherConfig.intensityMultiplier
  };
}

/**
 * Integrates weather data with seasonal glass effects
 */
export function integrateWeatherWithSeason(
  season: Season,
  timeOfDay: TimeOfDay,
  weatherCondition: string
): {
  seasonalEffect: ReturnType<typeof createSeasonalGlassEffect>;
  weatherEffect: WeatherGlassEffect;
  combinedEffect: any;
} {
  // Get base seasonal effect
  const seasonalParams: SeasonalGlassParams = {
    season,
    timeOfDay,
    weatherCondition
  };
  
  const seasonalEffect = createSeasonalGlassEffect(seasonalParams);
  const weatherEffect = getWeatherGlassEffect(weatherCondition);
  
  // Combine effects
  const combinedEffect = {
    blurIntensity: Math.min(
      seasonalEffect.blurIntensity + weatherEffect.blurIntensity * 0.3,
      3.0
    ),
    opacityLevel: Math.min(
      seasonalEffect.opacityLevel + weatherEffect.opacityLevel * 0.2,
      0.6
    ),
    saturation: seasonalEffect.saturation,
    particleEffect: weatherEffect.particleType || seasonalEffect.particleEffect,
    backgroundGradient: seasonalEffect.backgroundGradient,
    colorOverlay: weatherEffect.colorOverlay,
    animationSpeed: weatherEffect.animationSpeed
  };
  
  return {
    seasonalEffect,
    weatherEffect,
    combinedEffect
  };
}

/**
 * Starts automatic weather updates
 */
function startWeatherUpdates(): void {
  if (weatherUpdateInterval) {
    clearInterval(weatherUpdateInterval);
  }
  
  // Initial fetch
  fetchLocalWeatherTheme().catch(console.warn);
  
  // Set up periodic updates
  weatherUpdateInterval = setInterval(async () => {
    if (weatherConfig.enabled) {
      try {
        await fetchLocalWeatherTheme();
      } catch (error) {
        console.warn('Weather update failed:', error);
      }
    }
  }, weatherConfig.updateInterval);
}

/**
 * Applies weather effects to DOM elements
 */
function applyWeatherEffectsToDOM(
  weatherData: WeatherThemeData,
  glassEffect: WeatherGlassEffect
): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Set weather-specific CSS custom properties
  root.style.setProperty('--weather-condition', weatherData.condition);
  root.style.setProperty('--weather-blur', `${glassEffect.blurIntensity}px`);
  root.style.setProperty('--weather-opacity', glassEffect.opacityLevel.toString());
  root.style.setProperty('--weather-particle-count', glassEffect.particleCount.toString());
  root.style.setProperty('--weather-particle-type', glassEffect.particleType);
  root.style.setProperty('--weather-animation-speed', glassEffect.animationSpeed.toString());
  root.style.setProperty('--weather-color-overlay', glassEffect.colorOverlay);
  
  // Add weather class to body
  document.body.classList.add(`weather-${weatherData.condition}`);
  
  // Remove previous weather classes
  Object.keys(WEATHER_GLASS_EFFECTS).forEach(condition => {
    if (condition !== weatherData.condition) {
      document.body.classList.remove(`weather-${condition}`);
    }
  });
}

/**
 * Gets current weather configuration
 */
export function getWeatherConfig(): WeatherEffectConfig {
  return { ...weatherConfig };
}

/**
 * Gets current weather data
 */
export function getCurrentWeatherData(): WeatherThemeData | null {
  return currentWeatherData ? { ...currentWeatherData } : null;
}

/**
 * Updates weather configuration
 */
export function updateWeatherConfig(updates: Partial<WeatherEffectConfig>): void {
  weatherConfig = { ...weatherConfig, ...updates };
  
  if (weatherConfig.enabled && !weatherUpdateInterval) {
    startWeatherUpdates();
  } else if (!weatherConfig.enabled && weatherUpdateInterval) {
    disableWeatherEffects();
  }
}