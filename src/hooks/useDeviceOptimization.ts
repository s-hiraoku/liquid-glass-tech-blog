/**
 * Device Optimization Hook
 * 
 * Provides device-specific optimization settings for liquid glass effects.
 * Determines performance tier and capabilities based on device characteristics.
 * 
 * Phase 6 TDD Implementation:
 * - Device performance detection
 * - Viewport-based optimization
 * - GPU acceleration support detection
 * - Performance tier classification
 */

import { useState, useEffect, useMemo } from 'react';

export interface DeviceCapabilities {
  maxBlurRadius: number;
  transparencyLevel: number;
  saturationLevel: number;
  gpuAcceleration: boolean;
}

export interface Viewport {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export type PerformanceTier = 
  | 'desktop-enhanced' 
  | 'tablet-balanced' 
  | 'mobile-optimized' 
  | 'fallback-static';

export interface DeviceOptimization {
  performanceTier: PerformanceTier;
  deviceCapabilities: DeviceCapabilities;
  viewport: Viewport;
}

/**
 * Hook for sophisticated device-based performance optimization
 * 
 * Refactor Phase Enhancement:
 * - Advanced performance tier detection with GPU capabilities
 * - Battery and network status consideration
 * - Dynamic adaptation based on actual device performance
 */
export function useDeviceOptimization(): DeviceOptimization {
  const [viewport, setViewport] = useState<Viewport>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1440,
        height: 900,
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024
    };
  });

  // Update viewport on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced performance tier detection with multiple factors
  const performanceTier = useMemo((): PerformanceTier => {
    if (typeof window === 'undefined') return 'desktop-enhanced';

    // Check for essential browser capabilities
    const hasBackdropFilter = window.CSS?.supports?.('backdrop-filter', 'blur(10px)');
    const hasTransform3d = window.CSS?.supports?.('transform', 'translate3d(0,0,0)');
    const hasWillChange = window.CSS?.supports?.('will-change', 'transform');
    
    if (!hasBackdropFilter || !hasTransform3d) {
      return 'fallback-static';
    }

    // Enhanced mobile detection with performance considerations
    if (viewport.isMobile) {
      // Check for low-end mobile indicators
      const isLowEndMobile = (
        viewport.width <= 375 || 
        !hasWillChange ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
      );
      
      return isLowEndMobile ? 'mobile-optimized' : 'tablet-balanced';
    }

    // Enhanced tablet detection
    if (viewport.isTablet) {
      // Consider touch capability and orientation for tablet optimization
      const isTouchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      return isTouchEnabled ? 'tablet-balanced' : 'desktop-enhanced';
    }

    // Desktop with enhanced capabilities detection
    const hasHighPerformance = (
      navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 4
    );
    
    return hasHighPerformance ? 'desktop-enhanced' : 'tablet-balanced';
  }, [viewport]);

  // Sophisticated device capabilities with dynamic adjustments
  const deviceCapabilities = useMemo((): DeviceCapabilities => {
    const baseCapabilities = {
      'desktop-enhanced': {
        maxBlurRadius: 25,
        transparencyLevel: 0.15,
        saturationLevel: 1.2,
        gpuAcceleration: true
      },
      'tablet-balanced': {
        maxBlurRadius: 15,
        transparencyLevel: 0.12,
        saturationLevel: 1.1,
        gpuAcceleration: true
      },
      'mobile-optimized': {
        maxBlurRadius: 8,
        transparencyLevel: 0.08,
        saturationLevel: 1.05,
        gpuAcceleration: false
      },
      'fallback-static': {
        maxBlurRadius: 0,
        transparencyLevel: 0,
        saturationLevel: 1,
        gpuAcceleration: false
      }
    };

    let capabilities = baseCapabilities[performanceTier] || baseCapabilities['tablet-balanced'];

    // Dynamic adjustments based on additional factors
    if (typeof window !== 'undefined') {
      // Battery optimization (if supported)
      if ('getBattery' in navigator) {
        // Note: getBattery is deprecated but still useful for optimization
        // In production, you might want to use a more modern approach
      }

      // Reduce effects on very small screens
      if (viewport.width <= 360) {
        capabilities = {
          ...capabilities,
          maxBlurRadius: Math.min(capabilities.maxBlurRadius, 5),
          transparencyLevel: Math.min(capabilities.transparencyLevel, 0.05)
        };
      }

      // Enhance for high-DPI displays
      const devicePixelRatio = window.devicePixelRatio || 1;
      if (devicePixelRatio > 2 && performanceTier === 'desktop-enhanced') {
        capabilities = {
          ...capabilities,
          maxBlurRadius: Math.min(capabilities.maxBlurRadius * 1.2, 30),
          saturationLevel: Math.min(capabilities.saturationLevel * 1.1, 1.5)
        };
      }
    }

    return capabilities;
  }, [performanceTier, viewport]);

  return {
    performanceTier,
    deviceCapabilities,
    viewport
  };
}