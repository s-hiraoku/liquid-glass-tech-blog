/**
 * Phase 2.4: Seasonal Theme Engine Integration Tests
 * 
 * Comprehensive integration tests for the enhanced seasonal theme engine
 * with full @developer-hub/liquid-glass integration, weather API, and
 * dynamic gradient system.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';

// Import the enhanced implementations
import { SeasonalThemeEngine } from './seasonalThemeEngine';
import { configureSeasonalEffect, createOptimizedSeasonalEffect } from './seasonalGlassEffects';
import { createTimeTransition, configureSeasonalGradients } from './glasscnThemeProvider';
import { enableWeatherEffects, fetchLocalWeatherTheme, integrateWeatherWithSeason } from './weatherThemeIntegration';
import { useSeasonalTransitions, detectSeasonalBoundary, getCurrentSeason } from './useSeasonalTransitions';

// Mock utilities
import { mockWeatherAPIFetch, WeatherAPI } from '@/tests/mocks/weather-api';

describe('Phase 2.4: Enhanced Seasonal Theme Engine Integration', () => {
  let mockWeatherFetch: ReturnType<typeof mockWeatherAPIFetch>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWeatherFetch = mockWeatherAPIFetch();
    WeatherAPI.resetMockData();
  });

  afterEach(() => {
    mockWeatherFetch.restore();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('GIVEN Enhanced Seasonal Theme Engine', () => {
    it('WHEN rendered with full configuration THEN should initialize with all features', async () => {
      // ARRANGE
      const props = {
        season: 'summer' as const,
        timeOfDay: 'day' as const,
        autoDetect: true,
        weatherIntegration: true,
        geolocationEnabled: true,
        boundaryTransitions: true,
        glasscnIntegration: true,
        performanceMode: 'gpu-accelerated' as const,
        accessibilityMode: true
      };

      // ACT
      render(React.createElement(SeasonalThemeEngine, props, 
        React.createElement('div', { 'data-testid': 'child-content' }, 'Test Content')
      ));

      // ASSERT
      const engine = screen.getByTestId('seasonal-theme-engine');
      expect(engine).toHaveAttribute('data-season', 'summer');
      expect(engine).toHaveAttribute('data-time-of-day', 'day');
      expect(engine).toHaveAttribute('data-auto-detect', 'true');
      expect(engine).toHaveAttribute('data-weather-integration', 'true');
      // GPU support depends on environment - in JSDOM it's false
      expect(engine).toHaveAttribute('data-gpu-supported', 'false');
      
      // Check CSS variables are set
      expect(engine.style.getPropertyValue('--seasonal-blur')).toBeTruthy();
      expect(engine.style.getPropertyValue('--seasonal-opacity')).toBeTruthy();
      expect(engine.style.getPropertyValue('--seasonal-gradient-start')).toBeTruthy();
      
      // Check child content is preserved
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('WHEN weather integration enabled THEN should fetch and apply weather effects', async () => {
      // ARRANGE
      WeatherAPI.setMockData({
        current: {
          condition: 'rainy',
          temperature: 15,
          humidity: 85,
          windSpeed: 12.0,
          visibility: 5000,
          pressure: 995
        }
      });

      // ACT
      render(React.createElement(SeasonalThemeEngine, {
        weatherIntegration: true,
        season: 'autumn',
        timeOfDay: 'evening'
      }));

      // Wait for weather integration
      await waitFor(() => {
        const engine = screen.getByTestId('seasonal-theme-engine');
        expect(engine).toHaveAttribute('data-weather-condition', 'rainy');
      }, { timeout: 2000 });

      // ASSERT
      const engine = screen.getByTestId('seasonal-theme-engine');
      expect(engine.className).toContain('autumn-theme');
      expect(engine.className).toContain('evening-time');
    });

    it('WHEN GPU acceleration enabled THEN should set appropriate CSS properties', () => {
      // ARRANGE & ACT
      render(React.createElement(SeasonalThemeEngine, {
        performanceMode: 'gpu-accelerated',
        season: 'winter',
        timeOfDay: 'night'
      }));

      // ASSERT
      const engine = screen.getByTestId('seasonal-theme-engine');
      // In test environment GPU acceleration is disabled
      expect(engine.style.getPropertyValue('--gpu-acceleration')).toBe('none');
      // In test environment GPU is not supported
      expect(engine).toHaveAttribute('data-gpu-supported', 'false');
    });
  });

  describe('GIVEN Advanced Seasonal Glass Effects', () => {
    it('WHEN configuring seasonal effect THEN should return optimized configuration', () => {
      // ARRANGE
      const config = {
        season: 'spring' as const,
        timeOfDay: 'morning' as const,
        weatherCondition: 'sunny',
        performanceMode: 'gpu-accelerated' as const,
        enableParticles: true,
        colorIntensity: 1.2
      };

      // ACT
      const result = configureSeasonalEffect(config);

      // ASSERT
      expect(result).toHaveProperty('glassEffect');
      expect(result).toHaveProperty('cssProperties');
      expect(result).toHaveProperty('performanceMetrics');
      
      expect(result.glassEffect.blurIntensity).toBeGreaterThan(0);
      expect(result.glassEffect.opacityLevel).toBeGreaterThan(0);
      expect(result.glassEffect.saturation).toBeGreaterThan(1);
      
      expect(result.cssProperties['--seasonal-blur-intensity']).toBeTruthy();
      expect(result.cssProperties['--seasonal-performance-mode']).toBe('gpu-accelerated');
      
      expect(result.performanceMetrics.expectedFPS).toBeGreaterThanOrEqual(30);
      expect(result.performanceMetrics.gpuUsage).toMatch(/minimal|moderate|intensive/);
    });

    it('WHEN creating optimized effect for low-power device THEN should reduce complexity', () => {
      // ARRANGE
      const params = {
        season: 'winter' as const,
        timeOfDay: 'night' as const,
        weatherCondition: 'snowy'
      };
      
      const deviceCapabilities = {
        supportsGPU: false,
        maxParticles: 20,
        targetFPS: 30,
        memoryLimit: 25
      };

      // ACT
      const result = createOptimizedSeasonalEffect(params, deviceCapabilities);

      // ASSERT
      expect(result.performanceMetrics.expectedFPS).toBeLessThanOrEqual(30);
      expect(result.performanceMetrics.memoryUsage).toBe('low');
      expect(result.performanceMetrics.gpuUsage).toBe('none');
      expect(result.cssProperties['--seasonal-performance-mode']).toBe('low-power');
    });
  });

  describe('GIVEN Time-based Gradient System', () => {
    it('WHEN creating time transition THEN should generate smooth interpolation', () => {
      // ARRANGE
      const transitionConfig = {
        fromTime: 'morning' as const,
        toTime: 'day' as const,
        season: 'summer' as const,
        duration: 3000
      };

      // ACT
      const result = createTimeTransition(transitionConfig);

      // ASSERT
      expect(result).toHaveProperty('gradient');
      expect(result).toHaveProperty('transition');
      expect(result).toHaveProperty('duration', 3000);
      
      expect(result.gradient.colors).toHaveLength(3);
      expect(result.gradient.direction).toMatch(/\d+deg/);
      expect(result.transition).toContain('cubic-bezier');
    });

    it('WHEN configuring seasonal gradients THEN should return proper CSS properties', () => {
      // ARRANGE
      const config = {
        enableSeasonalGradients: true,
        timeOfDayIntegration: true,
        smoothTransitions: true
      };

      // ACT
      const result = configureSeasonalGradients(config);

      // ASSERT
      expect(result.enabled).toBe(true);
      expect(result.timeIntegration).toBe(true);
      expect(result.smoothTransitions).toBe(true);
      
      expect(result.cssProperties['--seasonal-gradients-enabled']).toBe('true');
      expect(result.cssProperties['--gradient-animation']).toContain('seasonal-gradient-transition');
      expect(result.cssProperties['--time-transition-duration']).toBe('1500ms');
    });
  });

  describe('GIVEN Weather Integration System', () => {
    it('WHEN enabling weather effects THEN should start updates and set CSS properties', () => {
      // ARRANGE
      const mockDocumentElement = {
        style: {
          setProperty: vi.fn()
        }
      };
      
      Object.defineProperty(document, 'documentElement', {
        value: mockDocumentElement,
        writable: true
      });

      // ACT
      enableWeatherEffects({
        updateInterval: 60000,
        intensityMultiplier: 1.5,
        particleEffects: true
      });

      // ASSERT
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--weather-effects-enabled', 'true'
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--weather-intensity-multiplier', '1.5'
      );
    });

    it('WHEN fetching local weather theme THEN should return complete weather data', async () => {
      // ARRANGE
      WeatherAPI.setMockData({
        current: {
          condition: 'stormy',
          temperature: 18,
          humidity: 90,
          windSpeed: 25.0,
          visibility: 3000,
          pressure: 980
        }
      });

      // ACT
      const result = await fetchLocalWeatherTheme();

      // ASSERT
      expect(result).toHaveProperty('weatherData');
      expect(result).toHaveProperty('glassEffect');
      expect(result).toHaveProperty('themeSuggestion');
      
      expect(result.weatherData.condition).toBe('stormy');
      expect(result.glassEffect.particleType).toBe('storm');
      expect(result.glassEffect.blurIntensity).toBeGreaterThan(1.5);
    });

    it('WHEN integrating weather with season THEN should combine effects properly', () => {
      // ARRANGE
      const season = 'autumn';
      const timeOfDay = 'evening';
      const weatherCondition = 'rainy';

      // ACT
      const result = integrateWeatherWithSeason(season, timeOfDay, weatherCondition);

      // ASSERT
      expect(result).toHaveProperty('seasonalEffect');
      expect(result).toHaveProperty('weatherEffect');
      expect(result).toHaveProperty('combinedEffect');
      
      expect(result.combinedEffect.blurIntensity).toBeGreaterThan(result.seasonalEffect.blurIntensity);
      expect(result.combinedEffect.particleEffect).toBe('rain');
      expect(result.combinedEffect.colorOverlay).toContain('rgba');
    });
  });

  describe('GIVEN Enhanced Seasonal Transitions', () => {
    it('WHEN detecting seasonal boundary THEN should identify equinox/solstice dates', () => {
      // ARRANGE
      const springEquinox = new Date('2024-03-20T12:00:00Z');
      const summerSolstice = new Date('2024-06-21T01:00:00Z');

      // ACT
      const springBoundary = detectSeasonalBoundary(springEquinox);
      const summerBoundary = detectSeasonalBoundary(summerSolstice);

      // ASSERT
      expect(springBoundary).toBeTruthy();
      expect(springBoundary?.season).toBe('spring');
      expect(springBoundary?.type).toBe('equinox');
      
      expect(summerBoundary).toBeTruthy();
      expect(summerBoundary?.season).toBe('summer');
      expect(summerBoundary?.type).toBe('solstice');
    });

    it('WHEN getting current season THEN should return accurate season for date', () => {
      // ARRANGE
      const springDate = new Date('2024-04-15');
      const summerDate = new Date('2024-07-20');
      const autumnDate = new Date('2024-10-10');
      const winterDate = new Date('2024-01-15');

      // ACT & ASSERT
      expect(getCurrentSeason(springDate)).toBe('spring');
      expect(getCurrentSeason(summerDate)).toBe('summer');
      expect(getCurrentSeason(autumnDate)).toBe('autumn');
      expect(getCurrentSeason(winterDate)).toBe('winter');
    });
  });

  describe('GIVEN Performance Optimization', () => {
    it('WHEN using GPU acceleration THEN should maintain 60 FPS target', () => {
      // ARRANGE
      const config = {
        season: 'spring' as const,
        timeOfDay: 'day' as const,
        performanceMode: 'gpu-accelerated' as const,
        enableParticles: true
      };

      // ACT
      const result = configureSeasonalEffect(config);

      // ASSERT
      expect(result.performanceMetrics.expectedFPS).toBe(60);
      expect(result.performanceMetrics.gpuUsage).toMatch(/moderate|intensive/);
      expect(result.cssProperties['--seasonal-will-change']).toBeTruthy();
    });

    it('WHEN using low-power mode THEN should optimize for performance', () => {
      // ARRANGE
      const config = {
        season: 'winter' as const,
        timeOfDay: 'night' as const,
        performanceMode: 'low-power' as const,
        enableParticles: false
      };

      // ACT
      const result = configureSeasonalEffect(config);

      // ASSERT
      expect(result.performanceMetrics.expectedFPS).toBeLessThanOrEqual(30);
      expect(result.performanceMetrics.memoryUsage).toBe('low');
      expect(result.performanceMetrics.gpuUsage).toBe('none');
      expect(result.glassEffect.blurIntensity).toBeLessThanOrEqual(1.5);
    });
  });

  describe('GIVEN Accessibility Features', () => {
    it('WHEN reduced motion preferred THEN should respect user preferences', () => {
      // ARRANGE
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn(() => ({
          matches: true,
          media: '(prefers-reduced-motion: reduce)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
        writable: true,
      });

      // ACT
      render(React.createElement(SeasonalThemeEngine, {
        season: 'spring',
        timeOfDay: 'morning',
        accessibilityMode: true,
        reducedMotion: true,
        weatherIntegration: false
      }));

      // ASSERT
      const engine = screen.getByTestId('seasonal-theme-engine');
      expect(engine).toHaveAttribute('data-reduced-motion', 'true');
      expect(engine.className).toContain('reduced-motion');
    });

    it('WHEN accessibility mode enabled THEN should provide proper ARIA labels', () => {
      // ARRANGE & ACT
      render(React.createElement(SeasonalThemeEngine, {
        season: 'autumn',
        timeOfDay: 'evening',
        accessibilityMode: true,
        weatherIntegration: false
      }));

      // ASSERT
      const engine = screen.getByTestId('seasonal-theme-engine');
      expect(engine).toHaveAttribute('aria-label');
      expect(engine.getAttribute('aria-label')).toContain('autumn evening');
    });
  });
});