/**
 * Phase 2.4: Seasonal Glass Effects - Full Implementation
 * 
 * Provides seasonal parameter configuration for @developer-hub/liquid-glass integration.
 * Handles seasonal effect calculations, GPU-accelerated optimizations, and performance monitoring.
 */

import { Season, TimeOfDay } from '@/tests/mocks/seasonal-theme-provider';

export interface SeasonalGlassParams {
  season: Season;
  timeOfDay: TimeOfDay;
  weatherCondition: string;
}

export interface SeasonalGlassEffect {
  blurIntensity: number;
  opacityLevel: number;
  saturation: number;
  particleEffect: string;
  backgroundGradient: string[];
}

/**
 * Creates seasonal glass effect configuration based on seasonal parameters.
 * 
 * @param params - Seasonal parameters including season, time of day, and weather
 * @returns Configured glass effect settings for the given seasonal context
 */
export function createSeasonalGlassEffect(params: SeasonalGlassParams): SeasonalGlassEffect {
  const { season, timeOfDay, weatherCondition } = params;
  
  // Seasonal base configurations
  const seasonalConfigs = {
    spring: {
      blurIntensity: 0.7,
      opacityLevel: 0.1,
      saturation: 1.5,
      particleEffect: 'sakura',
      backgroundGradient: ['#ffb3d9', '#98fb98']
    },
    summer: {
      blurIntensity: 0.9,
      opacityLevel: 0.15,
      saturation: 1.8,
      particleEffect: 'waterdrops',
      backgroundGradient: ['#87ceeb', '#20b2aa']
    },
    autumn: {
      blurIntensity: 0.6,
      opacityLevel: 0.12,
      saturation: 1.2,
      particleEffect: 'leaves',
      backgroundGradient: ['#ff8c00', '#dc143c']
    },
    winter: {
      blurIntensity: 1.0,
      opacityLevel: 0.18,
      saturation: 2.0,
      particleEffect: 'snow',
      backgroundGradient: ['#b0e0e6', '#4169e1']
    }
  };

  const baseConfig = seasonalConfigs[season];
  
  // Time of day adjustments
  const timeMultipliers = {
    morning: { blur: 0.8, opacity: 0.9 },
    day: { blur: 1.0, opacity: 1.0 },
    evening: { blur: 1.1, opacity: 1.1 },
    night: { blur: 1.2, opacity: 1.2 }
  };

  const timeMultiplier = timeMultipliers[timeOfDay];
  
  // Weather condition adjustments
  const weatherAdjustments = {
    sunny: { blur: 1.0, opacity: 1.0, particle: baseConfig.particleEffect },
    rainy: { blur: 1.3, opacity: 1.4, particle: 'rain' },
    cloudy: { blur: 1.1, opacity: 1.1, particle: 'clouds' },
    snowy: { blur: 1.4, opacity: 1.3, particle: 'snow' },
    stormy: { blur: 1.5, opacity: 1.5, particle: 'storm' }
  };

  const weatherAdj = weatherAdjustments[weatherCondition as keyof typeof weatherAdjustments] || 
                    weatherAdjustments.sunny;

  return {
    blurIntensity: Math.min(baseConfig.blurIntensity * timeMultiplier.blur * weatherAdj.blur, 2.0),
    opacityLevel: Math.min(baseConfig.opacityLevel * timeMultiplier.opacity * weatherAdj.opacity, 0.5),
    saturation: baseConfig.saturation,
    particleEffect: weatherAdj.particle,
    backgroundGradient: baseConfig.backgroundGradient
  };
}

/**
 * Advanced seasonal effect configuration interface
 */
export interface AdvancedSeasonalConfig {
  season: Season;
  timeOfDay: TimeOfDay;
  weatherCondition?: string;
  performanceMode?: 'standard' | 'gpu-accelerated' | 'low-power';
  particleCount?: number;
  animationSpeed?: number;
  colorIntensity?: number;
  blurMultiplier?: number;
  opacityMultiplier?: number;
  enableParticles?: boolean;
  enableGradients?: boolean;
  customGradient?: string[];
  transitionDuration?: number;
}

/**
 * Performance tier configurations
 */
const PERFORMANCE_TIERS = {
  'low-power': {
    particleMultiplier: 0.3,
    blurMultiplier: 0.5,
    animationSpeedMultiplier: 0.7,
    enableComplexEffects: false
  },
  'standard': {
    particleMultiplier: 1.0,
    blurMultiplier: 1.0,
    animationSpeedMultiplier: 1.0,
    enableComplexEffects: true
  },
  'gpu-accelerated': {
    particleMultiplier: 1.5,
    blurMultiplier: 1.2,
    animationSpeedMultiplier: 1.3,
    enableComplexEffects: true
  }
};

/**
 * Configures seasonal effect with enhanced parameters and performance optimization
 */
export function configureSeasonalEffect(config: AdvancedSeasonalConfig): {
  glassEffect: SeasonalGlassEffect;
  cssProperties: Record<string, string>;
  performanceMetrics: {
    expectedFPS: number;
    memoryUsage: 'low' | 'medium' | 'high';
    gpuUsage: 'none' | 'minimal' | 'moderate' | 'intensive';
  };
} {
  const {
    season,
    timeOfDay,
    weatherCondition = 'sunny',
    performanceMode = 'standard',
    particleCount,
    animationSpeed,
    colorIntensity = 1.0,
    blurMultiplier = 1.0,
    opacityMultiplier = 1.0,
    enableParticles = true,
    enableGradients = true,
    customGradient,
    transitionDuration = 2000
  } = config;

  // Get base seasonal effect
  const baseEffect = createSeasonalGlassEffect({ season, timeOfDay, weatherCondition });
  
  // Apply performance tier modifiers
  const perfTier = PERFORMANCE_TIERS[performanceMode];
  
  // Calculate enhanced glass effect
  const enhancedEffect: SeasonalGlassEffect = {
    blurIntensity: Math.min(
      baseEffect.blurIntensity * blurMultiplier * perfTier.blurMultiplier,
      performanceMode === 'low-power' ? 1.5 : 3.0
    ),
    opacityLevel: Math.min(
      baseEffect.opacityLevel * opacityMultiplier,
      performanceMode === 'low-power' ? 0.3 : 0.6
    ),
    saturation: Math.min(
      baseEffect.saturation * colorIntensity,
      performanceMode === 'gpu-accelerated' ? 2.5 : 2.0
    ),
    particleEffect: enableParticles ? baseEffect.particleEffect : 'none',
    backgroundGradient: customGradient || baseEffect.backgroundGradient
  };

  // Generate CSS custom properties
  const cssProperties: Record<string, string> = {
    '--seasonal-blur-intensity': `${enhancedEffect.blurIntensity}px`,
    '--seasonal-opacity-level': enhancedEffect.opacityLevel.toString(),
    '--seasonal-saturation': enhancedEffect.saturation.toString(),
    '--seasonal-particle-effect': enhancedEffect.particleEffect,
    '--seasonal-gradient-start': enhancedEffect.backgroundGradient[0],
    '--seasonal-gradient-end': enhancedEffect.backgroundGradient[1],
    '--seasonal-transition-duration': `${transitionDuration}ms`,
    '--seasonal-performance-mode': performanceMode,
    '--seasonal-particles-enabled': enableParticles.toString(),
    '--seasonal-gradients-enabled': enableGradients.toString()
  };

  // Add particle-specific properties
  if (enableParticles && perfTier.enableComplexEffects) {
    const calculatedParticleCount = particleCount || 
      Math.round(getDefaultParticleCount(enhancedEffect.particleEffect) * perfTier.particleMultiplier);
    
    cssProperties['--seasonal-particle-count'] = calculatedParticleCount.toString();
    cssProperties['--seasonal-animation-speed'] = 
      (animationSpeed || 1.0 * perfTier.animationSpeedMultiplier).toString();
  }

  // Add GPU acceleration properties
  if (performanceMode === 'gpu-accelerated') {
    cssProperties['--seasonal-will-change'] = 'transform, opacity, filter, backdrop-filter';
    cssProperties['--seasonal-transform-style'] = 'preserve-3d';
    cssProperties['--seasonal-backface-visibility'] = 'hidden';
  }

  // Performance metrics estimation
  const performanceMetrics = calculatePerformanceMetrics(config, enhancedEffect, perfTier);

  return {
    glassEffect: enhancedEffect,
    cssProperties,
    performanceMetrics
  };
}

/**
 * Gets default particle count for different particle effects
 */
function getDefaultParticleCount(particleEffect: string): number {
  const particleCounts: Record<string, number> = {
    sakura: 50,
    waterdrops: 30,
    leaves: 40,
    snow: 60,
    rain: 80,
    clouds: 20,
    storm: 100,
    sparkle: 25,
    fog: 15,
    none: 0
  };
  
  return particleCounts[particleEffect] || 30;
}

/**
 * Calculates performance metrics based on configuration
 */
function calculatePerformanceMetrics(
  config: AdvancedSeasonalConfig,
  effect: SeasonalGlassEffect,
  perfTier: typeof PERFORMANCE_TIERS[keyof typeof PERFORMANCE_TIERS]
): {
  expectedFPS: number;
  memoryUsage: 'low' | 'medium' | 'high';
  gpuUsage: 'none' | 'minimal' | 'moderate' | 'intensive';
} {
  const {
    performanceMode = 'standard',
    enableParticles = true,
    particleCount
  } = config;

  // Calculate expected FPS
  let expectedFPS = 60;
  
  if (performanceMode === 'low-power') {
    expectedFPS = 30;
  } else if (performanceMode === 'gpu-accelerated') {
    expectedFPS = 60;
  } else {
    expectedFPS = 45; // Standard mode
  }

  // Adjust for particle complexity
  if (enableParticles) {
    const particles = particleCount || getDefaultParticleCount(effect.particleEffect);
    if (particles > 50) expectedFPS -= 10;
    if (particles > 100) expectedFPS -= 10;
  }

  // Memory usage estimation
  let memoryUsage: 'low' | 'medium' | 'high' = 'medium';
  
  if (performanceMode === 'low-power' || !enableParticles) {
    memoryUsage = 'low';
  } else if (performanceMode === 'gpu-accelerated' && enableParticles) {
    memoryUsage = 'high';
  }

  // GPU usage estimation
  let gpuUsage: 'none' | 'minimal' | 'moderate' | 'intensive' = 'minimal';
  
  if (performanceMode === 'low-power') {
    gpuUsage = 'none';
  } else if (performanceMode === 'gpu-accelerated') {
    gpuUsage = enableParticles ? 'intensive' : 'moderate';
  } else {
    gpuUsage = enableParticles ? 'moderate' : 'minimal';
  }

  return {
    expectedFPS: Math.max(15, expectedFPS), // Minimum 15 FPS
    memoryUsage,
    gpuUsage
  };
}

/**
 * Creates optimized seasonal glass effect for different device capabilities
 */
export function createOptimizedSeasonalEffect(
  params: SeasonalGlassParams,
  deviceCapabilities?: {
    supportsGPU: boolean;
    maxParticles: number;
    targetFPS: number;
    memoryLimit: number;
  }
): ReturnType<typeof configureSeasonalEffect> {
  const capabilities = {
    supportsGPU: true,
    maxParticles: 100,
    targetFPS: 60,
    memoryLimit: 100, // MB
    ...deviceCapabilities
  };

  // Determine optimal performance mode
  let performanceMode: 'low-power' | 'standard' | 'gpu-accelerated' = 'standard';
  
  if (!capabilities.supportsGPU || capabilities.targetFPS < 30) {
    performanceMode = 'low-power';
  } else if (capabilities.supportsGPU && capabilities.targetFPS >= 60 && capabilities.memoryLimit > 50) {
    performanceMode = 'gpu-accelerated';
  }

  // Configure with optimal settings
  const config: AdvancedSeasonalConfig = {
    season: params.season,
    timeOfDay: params.timeOfDay,
    weatherCondition: params.weatherCondition,
    performanceMode,
    particleCount: Math.min(capabilities.maxParticles, getDefaultParticleCount('auto')),
    enableParticles: capabilities.maxParticles > 0,
    enableGradients: capabilities.memoryLimit > 20
  };

  return configureSeasonalEffect(config);
}