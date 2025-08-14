/**
 * Liquid Glass Constants and Configuration
 * 
 * Central configuration constants for the Liquid Glass Tech Blog project.
 * Includes performance thresholds, seasonal themes, effect settings, and
 * browser compatibility data.
 * 
 * @module Constants
 * @author Liquid Glass Tech Blog Team
 * @version 1.0.0
 */

import type { SeasonalThemeConfig, EffectParameters } from '@/types/liquid-glass';

/**
 * Performance Thresholds for Quality Assessment
 * 
 * Defines performance benchmarks based on Core Web Vitals and glass effect
 * specific metrics. Used for automated quality assessment and performance
 * optimization decisions.
 * 
 * @constant {Object} PERFORMANCE_THRESHOLDS
 * @property {Object} CORE_WEB_VITALS - Standard web performance thresholds
 * @property {Object} GLASS_EFFECTS - Glass effect specific performance limits
 * @property {Object} DEVICE_LIMITS - Device capability thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  CORE_WEB_VITALS: {
    LCP: {
      GOOD: 2500,
      NEEDS_IMPROVEMENT: 4000,
    },
    INP: {
      GOOD: 200,
      NEEDS_IMPROVEMENT: 500,
    },
    CLS: {
      GOOD: 0.1,
      NEEDS_IMPROVEMENT: 0.25,
    },
    FCP: {
      GOOD: 1800,
      NEEDS_IMPROVEMENT: 3000,
    },
    TTFB: {
      GOOD: 800,
      NEEDS_IMPROVEMENT: 1800,
    },
  },
  GLASS_EFFECTS: {
    MAX_RENDER_TIME: 16.67, // 60fps target
    MIN_FRAME_RATE: 30,
    MAX_GPU_USAGE: 50,
    MAX_MEMORY_USAGE: 256,
  },
  DEVICE_LIMITS: {
    LOW_END_MEMORY: 2048,
    LOW_END_CORES: 2,
    MOBILE_SCREEN_WIDTH: 768,
  },
} as const;

// Seasonal theme configurations
export const SEASONAL_THEMES = {
  spring: {
    id: 'spring',
    season: 'spring',
    timeOfDay: 'day',
    colors: {
      primary: '#FFB7C5',
      secondary: '#FFC0CB',
      accent: '#FF69B4',
      background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE4E1 100%)',
      surface: 'rgba(255, 183, 197, 0.1)',
    },
    glassMorphism: {
      backdropFilter: 'blur(15px) saturate(180%) brightness(110%)',
      backgroundColor: 'rgba(255, 183, 197, 0.1)',
      borderColor: 'rgba(255, 105, 180, 0.2)',
      shadowColor: 'rgba(255, 105, 180, 0.15)',
    },
    particles: {
      type: 'sakura',
      count: 25,
      size: [4, 8],
      speed: 1.5,
      opacity: 0.7,
    },
    animations: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      duration: 300,
    },
  },
  summer: {
    id: 'summer',
    season: 'summer',
    timeOfDay: 'day',
    colors: {
      primary: '#00BFFF',
      secondary: '#87CEEB',
      accent: '#1E90FF',
      background: 'linear-gradient(135deg, #E0F6FF 0%, #B0E0E6 100%)',
      surface: 'rgba(0, 191, 255, 0.1)',
    },
    glassMorphism: {
      backdropFilter: 'blur(20px) saturate(200%) brightness(105%)',
      backgroundColor: 'rgba(0, 191, 255, 0.08)',
      borderColor: 'rgba(30, 144, 255, 0.2)',
      shadowColor: 'rgba(30, 144, 255, 0.1)',
    },
    particles: {
      type: 'waterdrops',
      count: 15,
      size: [3, 6],
      speed: 2.0,
      opacity: 0.6,
    },
    animations: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      duration: 300,
    },
  },
  autumn: {
    id: 'autumn',
    season: 'autumn',
    timeOfDay: 'day',
    colors: {
      primary: '#FF8C00',
      secondary: '#FFA500',
      accent: '#FF6347',
      background: 'linear-gradient(135deg, #FFF8DC 0%, #FFEFD5 100%)',
      surface: 'rgba(255, 140, 0, 0.1)',
    },
    glassMorphism: {
      backdropFilter: 'blur(18px) saturate(160%) brightness(108%)',
      backgroundColor: 'rgba(255, 140, 0, 0.09)',
      borderColor: 'rgba(255, 99, 71, 0.2)',
      shadowColor: 'rgba(255, 99, 71, 0.12)',
    },
    particles: {
      type: 'leaves',
      count: 20,
      size: [5, 10],
      speed: 1.8,
      opacity: 0.8,
    },
    animations: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      duration: 300,
    },
  },
  winter: {
    id: 'winter',
    season: 'winter',
    timeOfDay: 'day',
    colors: {
      primary: '#B0E0E6',
      secondary: '#E6F3FF',
      accent: '#4682B4',
      background: 'linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 100%)',
      surface: 'rgba(176, 224, 230, 0.1)',
    },
    glassMorphism: {
      backdropFilter: 'blur(25px) saturate(120%) brightness(115%)',
      backgroundColor: 'rgba(176, 224, 230, 0.08)',
      borderColor: 'rgba(70, 130, 180, 0.15)',
      shadowColor: 'rgba(70, 130, 180, 0.08)',
    },
    particles: {
      type: 'snow',
      count: 30,
      size: [2, 5],
      speed: 1.2,
      opacity: 0.9,
    },
    animations: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      duration: 300,
    },
  },
} as const;

// Effect settings
export const EFFECT_SETTINGS = {
  DEFAULT_BLUR: 15,
  DEFAULT_OPACITY: 0.1,
  DEFAULT_SATURATION: 1.8,
  MIN_BLUR: 0,
  MAX_BLUR: 50,
  MIN_OPACITY: 0,
  MAX_OPACITY: 1,
  MIN_SATURATION: 0.5,
  MAX_SATURATION: 3.0,
} as const;

// Default blur values for different variants
export const DEFAULT_BLUR_VALUES = {
  'glass-subtle': 10,
  'glass-medium': 15,
  'glass-intense': 25,
  'glass-outlined': 8,
  'glass-filled': 20,
} as const;

// Animation presets
export const ANIMATION_PRESETS = {
  subtle: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  smooth: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  spring: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring", damping: 20, stiffness: 300 }
  }
} as const;

// Default effect parameters
export const DEFAULT_EFFECT_PARAMETERS: EffectParameters = {
  blur: 15,
  opacity: 0.1,
  saturation: 1.8,
  brightness: 1.1,
  contrast: 1.0,
  hueRotate: 0,
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
};

// Effect categories
export const EFFECT_CATEGORIES = [
  { id: 'button', name: 'Button Effects', description: 'Interactive button designs' },
  { id: 'card', name: 'Card Effects', description: 'Content card layouts' },
  { id: 'navigation', name: 'Navigation', description: 'Menu and navigation components' },
  { id: 'overlay', name: 'Overlay Effects', description: 'Modal and overlay designs' },
  { id: 'background', name: 'Background Effects', description: 'Full background implementations' },
  { id: 'text', name: 'Text Effects', description: 'Typography enhancements' },
] as const;

// Browser compatibility data
export const BROWSER_SUPPORT = {
  backdropFilter: {
    chrome: 76,
    firefox: 103,
    safari: 14,
    edge: 79,
    hasPolyfill: true,
    fallbackAvailable: true,
  },
  cssGrid: {
    chrome: 57,
    firefox: 52,
    safari: 10.1,
    edge: 16,
    hasPolyfill: false,
    fallbackAvailable: true,
  },
  customProperties: {
    chrome: 49,
    firefox: 31,
    safari: 9.1,
    edge: 15,
    hasPolyfill: true,
    fallbackAvailable: false,
  },
} as const;

// Image optimization settings
export const IMAGE_CONFIG = {
  formats: ['avif', 'webp', 'jpeg'] as const,
  sizes: [640, 768, 1024, 1280, 1920] as const,
  quality: 80,
  placeholder: 'blur',
  eyecatchRatio: 16 / 9, // 16:9 aspect ratio
  maxFileSize: 5 * 1024 * 1024, // 5MB
} as const;

// Animation and motion settings
export const ANIMATION_CONFIG = {
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  smooth: {
    type: 'tween',
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.3,
  },
  slow: {
    type: 'tween',
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.6,
  },
} as const;

// API rate limits
export const API_LIMITS = {
  imageGeneration: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per hour
  },
  effectGeneration: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per 15 minutes
  },
  search: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
  },
} as const;