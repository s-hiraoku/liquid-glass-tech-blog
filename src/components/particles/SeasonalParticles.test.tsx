/**
 * Phase 2.5: Seasonal Particle System - Comprehensive Test Implementation
 * 
 * Tests for seasonal particle system with @developer-hub/liquid-glass integration.
 * Validates all 4 seasonal particle effects with unique behaviors and performance optimization.
 * 
 * TDD RED Phase: Comprehensive failing tests to define the expected behavior
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Season, TimeOfDay } from '@/types/liquid-glass';

// Mock @developer-hub/liquid-glass for testing
const mockParticleSystem = { id: 'mock-particle-system' };

const mockLiquidGlass = {
  createParticleSystem: vi.fn(() => mockParticleSystem),
  renderParticles: vi.fn(),
  updateParticleSystem: vi.fn(),
  destroyParticleSystem: vi.fn(),
  isGPUSupported: vi.fn(() => true),
  getPerformanceMetrics: vi.fn(() => ({
    fps: 60,
    particleCount: 50,
    memoryUsage: 25.5,
    gpuUsage: 15.2
  }))
};

vi.mock('@developer-hub/liquid-glass', () => mockLiquidGlass);

// Mock SeasonalThemeEngine integration
const mockSeasonalThemeContext = {
  currentSeason: 'spring' as Season,
  timeOfDay: 'morning' as TimeOfDay,
  weatherCondition: 'sunny',
  glassEffect: {
    particleEffect: 'sakura',
    blurIntensity: 0.7,
    opacityLevel: 0.1,
    saturation: 1.5,
    backgroundGradient: ['#ffb3d9', '#98fb98']
  },
  isTransitioning: false,
  updateSeason: vi.fn(),
  updateTimeOfDay: vi.fn(),
  updateWeather: vi.fn()
};

const mockUseSeasonalThemeContext = vi.fn(() => mockSeasonalThemeContext);

vi.mock('@/lib/theme/seasonalThemeEngine', () => ({
  useSeasonalThemeContext: mockUseSeasonalThemeContext
}));

// Import the component after the mocks are set up
const { SeasonalParticles } = await import('./SeasonalParticles');

// Mock RAF for animation testing
let rafCallbacks: Array<() => void> = [];
const mockRequestAnimationFrame = vi.fn((callback: () => void) => {
  rafCallbacks.push(callback);
  return rafCallbacks.length;
});

const mockCancelAnimationFrame = vi.fn((id: number) => {
  delete rafCallbacks[id - 1];
});

describe('SeasonalParticles Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rafCallbacks = [];
    
    // Reset mock context to default values
    Object.assign(mockSeasonalThemeContext, {
      currentSeason: 'spring' as Season,
      timeOfDay: 'morning' as TimeOfDay,
      weatherCondition: 'sunny',
      glassEffect: {
        particleEffect: 'sakura',
        blurIntensity: 0.7,
        opacityLevel: 0.1,
        saturation: 1.5,
        backgroundGradient: ['#ffb3d9', '#98fb98']
      },
      isTransitioning: false,
      updateSeason: vi.fn(),
      updateTimeOfDay: vi.fn(),
      updateWeather: vi.fn()
    });
    
    // Setup RAF mocks
    Object.assign(globalThis, {
      requestAnimationFrame: mockRequestAnimationFrame,
      cancelAnimationFrame: mockCancelAnimationFrame
    });
    
    // Setup performance mock
    Object.assign(globalThis, {
      performance: {
        now: vi.fn(() => Date.now())
      }
    });

    // Setup window.matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering and Initialization', () => {
    it('should render seasonal particles container with default props', () => {
      render(<SeasonalParticles />);
      
      const container = screen.getByTestId('seasonal-particles');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('data-season', 'spring');
      expect(container).toHaveAttribute('data-particle-type', 'sakura');
    });

    it('should initialize particle system with @developer-hub/liquid-glass', () => {
      render(<SeasonalParticles />);
      
      expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'sakura',
          count: 50,
          size: [2, 6],
          speed: 1.0,
          colors: ['#ffb3d9', '#ff69b4', '#ffc0cb'],
          physics: {
            gravity: 0.1,
            wind: 0.05,
            turbulence: 0.02
          }
        })
      );
    });

    it('should create canvas element for GPU rendering', () => {
      render(<SeasonalParticles />);
      
      const canvas = screen.getByTestId('particle-canvas');
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveAttribute('width', '800');
      expect(canvas).toHaveAttribute('height', '600');
    });

    it('should detect GPU support and initialize WebGL context', () => {
      render(<SeasonalParticles />);
      
      expect(mockLiquidGlass.isGPUSupported).toHaveBeenCalled();
    });
  });

  describe('Seasonal Particle Types', () => {
    describe('Spring - Sakura/Cherry Blossom Petals', () => {
      beforeEach(() => {
        mockSeasonalThemeContext.currentSeason = 'spring';
        mockSeasonalThemeContext.glassEffect.particleEffect = 'sakura';
      });

      it('should render sakura particles with correct configuration', () => {
        render(<SeasonalParticles season="spring" />);
        
        expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'sakura',
            count: 50,
            size: [2, 6],
            colors: expect.arrayContaining(['#ffb3d9', '#ff69b4', '#ffc0cb']),
            physics: expect.objectContaining({
              gravity: 0.1,
              wind: 0.05,
              turbulence: 0.02
            })
          })
        );
      });

      it('should apply sakura-specific animations', async () => {
        render(<SeasonalParticles season="spring" />);
        
        // Wait for particle system to be created and initial render to happen
        await waitFor(() => {
          expect(mockLiquidGlass.renderParticles).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              animationType: 'floating',
              rotationSpeed: 0.02,
              fallPattern: 'spiral'
            })
          );
        });
      });

      it('should handle sakura particle lifecycle correctly', async () => {
        render(<SeasonalParticles season="spring" particleCount={25} />);
        
        expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
          expect.objectContaining({
            lifecycle: {
              spawn: 'top-random',
              despawn: 'bottom-out',
              respawn: true
            }
          })
        );
      });
    });

    describe('Summer - Light Particles/Sparkles', () => {
      it('should render light particles with summer configuration', () => {
        render(<SeasonalParticles season="summer" />);
        
        expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'light-particles',
            count: 75,
            size: [1, 3],
            colors: expect.arrayContaining(['#87ceeb', '#20b2aa', '#00ffff']),
            physics: expect.objectContaining({
              gravity: -0.02, // Floating upward
              wind: 0.03,
              turbulence: 0.05
            })
          })
        );
      });

      it('should apply summer light particle animations', async () => {
        render(<SeasonalParticles season="summer" />);
        
        // Wait for particle system to be created and initial render to happen
        await waitFor(() => {
          expect(mockLiquidGlass.renderParticles).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              animationType: 'twinkling',
              glowEffect: true,
              fadeInOut: true,
              movementPattern: 'floating-upward'
            })
          );
        });
      });
    });

    describe('Autumn - Falling Leaves', () => {
      it('should render falling leaves with autumn configuration', () => {
        render(<SeasonalParticles season="autumn" />);
        
        expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'leaves',
            count: 40,
            size: [3, 8],
            colors: expect.arrayContaining(['#ff8c00', '#dc143c', '#daa520']),
            physics: expect.objectContaining({
              gravity: 0.15,
              wind: 0.08,
              turbulence: 0.04
            })
          })
        );
      });

      it('should apply leaf-specific swaying animations', async () => {
        render(<SeasonalParticles season="autumn" />);
        
        // Wait for particle system to be created and initial render to happen
        await waitFor(() => {
          expect(mockLiquidGlass.renderParticles).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              animationType: 'swaying',
              rotationSpeed: 0.04,
              fallPattern: 'zigzag',
              leafFlutter: true
            })
          );
        });
      });
    });

    describe('Winter - Snow Particles', () => {
      it('should render snow particles with winter configuration', () => {
        render(<SeasonalParticles season="winter" />);
        
        expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'snow',
            count: 60,
            size: [1, 4],
            colors: expect.arrayContaining(['#ffffff', '#f0f8ff', '#e6f3ff']),
            physics: expect.objectContaining({
              gravity: 0.08,
              wind: 0.06,
              turbulence: 0.03
            })
          })
        );
      });

      it('should apply snow-specific gentle falling animations', async () => {
        render(<SeasonalParticles season="winter" />);
        
        // Wait for particle system to be created and initial render to happen
        await waitFor(() => {
          expect(mockLiquidGlass.renderParticles).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              animationType: 'gentle-falling',
              rotationSpeed: 0.01,
              fallPattern: 'straight-drift',
              accumulation: true
            })
          );
        });
      });
    });
  });

  describe('Performance Optimization Features', () => {
    describe('GPU Rendering Optimization', () => {
      it('should enable GPU acceleration when supported', () => {
        mockLiquidGlass.isGPUSupported.mockReturnValue(true);
        
        render(<SeasonalParticles gpuAccelerated />);
        
        expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
          expect.objectContaining({
            renderMode: 'gpu',
            useWebGL: true,
            hardwareAcceleration: true
          })
        );
      });

      it('should fallback to CPU rendering when GPU is not supported', () => {
        mockLiquidGlass.isGPUSupported.mockReturnValue(false);
        
        render(<SeasonalParticles gpuAccelerated />);
        
        expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
          expect.objectContaining({
            renderMode: 'cpu',
            useWebGL: false,
            hardwareAcceleration: false
          })
        );
      });

      it('should optimize shader compilation for particle rendering', () => {
        render(<SeasonalParticles gpuAccelerated />);
        
        expect(mockLiquidGlass.isGPUSupported).toHaveBeenCalled();
      });
    });

    describe('Particle Count Limits and Dynamic Adjustment', () => {
      it('should enforce maximum particle count limits', () => {
        render(<SeasonalParticles particleCount={500} maxParticles={100} />);
        
        expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
          expect.objectContaining({
            count: 100 // Should be clamped to maxParticles
          })
        );
      });

      it('should dynamically adjust particle count based on performance', async () => {
        mockLiquidGlass.getPerformanceMetrics.mockReturnValue({
          fps: 25, // Below target 60 FPS
          particleCount: 100,
          memoryUsage: 45.5,
          gpuUsage: 75.2
        });
        
        render(<SeasonalParticles adaptivePerformance />);
        
        // Trigger animation to check performance
        act(() => {
          rafCallbacks.forEach(callback => callback());
        });

        await waitFor(() => {
          expect(mockLiquidGlass.updateParticleSystem).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              count: expect.any(Number) // Should be reduced
            })
          );
        });
      });

      it('should provide performance metrics monitoring', () => {
        render(<SeasonalParticles showPerformanceMetrics />);
        
        const metricsDisplay = screen.getByTestId('performance-metrics');
        expect(metricsDisplay).toBeInTheDocument();
        expect(metricsDisplay).toHaveTextContent('FPS: 60');
        expect(metricsDisplay).toHaveTextContent('Particles: 50');
        expect(metricsDisplay).toHaveTextContent('Memory: 25.5 MB');
      });
    });

    describe('Memory Management and Cleanup', () => {
      it('should properly cleanup particle system on unmount', () => {
        const { unmount } = render(<SeasonalParticles />);
        
        unmount();
        
        expect(mockLiquidGlass.destroyParticleSystem).toHaveBeenCalled();
        expect(mockCancelAnimationFrame).toHaveBeenCalled();
      });

      it('should handle memory pressure by reducing particles', async () => {
        // Mock low memory situation
        mockLiquidGlass.getPerformanceMetrics.mockReturnValue({
          fps: 60,
          particleCount: 100,
          memoryUsage: 95.5, // High memory usage
          gpuUsage: 45.2
        });
        
        render(<SeasonalParticles memoryOptimized />);
        
        // Trigger animation to check performance
        act(() => {
          rafCallbacks.forEach(callback => callback());
        });

        await waitFor(() => {
          expect(mockLiquidGlass.updateParticleSystem).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              optimizationMode: 'low-memory'
            })
          );
        });
      });
    });
  });

  describe('Integration with SeasonalThemeEngine', () => {
    it('should sync with seasonal theme context automatically', () => {
      render(<SeasonalParticles />);
      
      expect(screen.getByTestId('seasonal-particles')).toHaveAttribute(
        'data-season',
        mockSeasonalThemeContext.currentSeason
      );
    });

    it('should update particles when season changes', async () => {
      const { rerender } = render(<SeasonalParticles />);
      
      // Change season
      mockSeasonalThemeContext.currentSeason = 'winter';
      mockSeasonalThemeContext.glassEffect.particleEffect = 'snow';
      
      rerender(<SeasonalParticles />);
      
      await waitFor(() => {
        expect(mockLiquidGlass.updateParticleSystem).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            type: 'snow'
          })
        );
      });
    });

    it('should apply glass effect parameters to particles', () => {
      mockSeasonalThemeContext.glassEffect = {
        particleEffect: 'sakura',
        blurIntensity: 1.2,
        opacityLevel: 0.15,
        saturation: 1.8,
        backgroundGradient: ['#ffb3d9', '#98fb98']
      };
      
      render(<SeasonalParticles />);
      
      expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
        expect.objectContaining({
          blurEffect: 1.2,
          globalOpacity: 0.15,
          colorSaturation: 1.8
        })
      );
    });

    it('should handle theme transitions smoothly', async () => {
      mockSeasonalThemeContext.isTransitioning = true;
      
      render(<SeasonalParticles />);
      
      expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
        expect.objectContaining({
          transitionMode: true,
          fadeDuration: 1000
        })
      );
    });
  });

  describe('Accessibility and Reduced Motion', () => {
    it('should respect prefers-reduced-motion preference', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
      
      render(<SeasonalParticles respectReducedMotion />);
      
      expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
        expect.objectContaining({
          animationEnabled: false,
          staticMode: true
        })
      );
    });

    it('should provide ARIA labels for accessibility', () => {
      render(<SeasonalParticles ariaLabel="Spring cherry blossom particles" />);
      
      const container = screen.getByTestId('seasonal-particles');
      expect(container).toHaveAttribute('aria-label', 'Spring cherry blossom particles');
    });

    it('should allow disabling particles via accessibility settings', () => {
      render(<SeasonalParticles disabled />);
      
      expect(mockLiquidGlass.createParticleSystem).not.toHaveBeenCalled();
      expect(screen.getByTestId('seasonal-particles')).toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('Weather-Based Particle Effects', () => {
    it('should adapt particles based on weather conditions', () => {
      mockSeasonalThemeContext.weatherCondition = 'rainy';
      
      render(<SeasonalParticles weatherIntegration />);
      
      expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'rain',
          weatherEffect: true,
          intensity: 'moderate'
        })
      );
    });

    it('should combine seasonal and weather effects appropriately', () => {
      mockSeasonalThemeContext.currentSeason = 'winter';
      mockSeasonalThemeContext.weatherCondition = 'snowy';
      
      render(<SeasonalParticles weatherIntegration />);
      
      expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'snow',
          intensity: 'heavy', // Enhanced for snowy weather
          windEffect: true
        })
      );
    });
  });

  describe('Interactive Features', () => {
    it('should respond to mouse interactions', () => {
      render(<SeasonalParticles interactive />);
      
      const container = screen.getByTestId('seasonal-particles');
      
      fireEvent.mouseMove(container, { clientX: 100, clientY: 200 });
      
      expect(mockLiquidGlass.updateParticleSystem).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          mousePosition: { x: 100, y: 200 },
          interactionMode: 'attract'
        })
      );
    });

    it('should handle touch interactions on mobile', () => {
      render(<SeasonalParticles interactive touchEnabled />);
      
      const container = screen.getByTestId('seasonal-particles');
      
      fireEvent.touchStart(container, {
        touches: [{ clientX: 150, clientY: 300 }]
      });
      
      expect(mockLiquidGlass.updateParticleSystem).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          touchPosition: { x: 150, y: 300 },
          interactionMode: 'repel'
        })
      );
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should handle particle system initialization errors gracefully', () => {
      mockLiquidGlass.createParticleSystem.mockImplementation(() => {
        throw new Error('WebGL context creation failed');
      });
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(<SeasonalParticles />);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize particle system')
      );
      
      const container = screen.getByTestId('seasonal-particles');
      expect(container).toHaveAttribute('data-error', 'true');
      
      consoleSpy.mockRestore();
    });

    it('should fallback to simpler rendering on performance issues', async () => {
      // Mock performance degradation
      mockLiquidGlass.getPerformanceMetrics
        .mockReturnValueOnce({ fps: 60, particleCount: 100, memoryUsage: 25, gpuUsage: 15 })
        .mockReturnValueOnce({ fps: 15, particleCount: 100, memoryUsage: 85, gpuUsage: 90 });
      
      render(<SeasonalParticles adaptivePerformance />);
      
      // Trigger animation frame twice to see degradation
      act(() => {
        rafCallbacks.forEach(callback => callback());
      });
      
      await waitFor(() => {
        expect(mockLiquidGlass.updateParticleSystem).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            fallbackMode: true,
            simplifiedRendering: true
          })
        );
      });
    });
  });

  describe('Custom Configuration', () => {
    it('should accept custom particle configuration', () => {
      const customConfig = {
        count: 200,
        size: [5, 10],
        colors: ['#ff0000', '#00ff00', '#0000ff'],
        speed: 2.0
      };
      
      render(<SeasonalParticles customConfig={customConfig} />);
      
      expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
        expect.objectContaining(customConfig)
      );
    });

    it('should merge custom config with seasonal defaults', () => {
      render(
        <SeasonalParticles
          season="spring"
          customConfig={{ count: 25 }}
        />
      );
      
      expect(mockLiquidGlass.createParticleSystem).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'sakura', // From spring default
          count: 25,      // From custom config
          colors: expect.arrayContaining(['#ffb3d9']) // From spring default
        })
      );
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should expose performance metrics via callback', () => {
      const onMetricsUpdate = vi.fn();
      
      render(<SeasonalParticles onMetricsUpdate={onMetricsUpdate} />);
      
      // Trigger metrics update
      act(() => {
        rafCallbacks.forEach(callback => callback());
      });
      
      expect(onMetricsUpdate).toHaveBeenCalledWith({
        fps: 60,
        particleCount: 50,
        memoryUsage: 25.5,
        gpuUsage: 15.2,
        renderTime: expect.any(Number)
      });
    });

    it('should track particle lifecycle metrics', () => {
      render(<SeasonalParticles trackLifecycle />);
      
      const container = screen.getByTestId('seasonal-particles');
      expect(container).toHaveAttribute('data-lifecycle-tracking', 'true');
    });
  });
});