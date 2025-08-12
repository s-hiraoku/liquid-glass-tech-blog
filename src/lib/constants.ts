import type { SeasonalThemeConfig, EffectParameters } from '@/types/liquid-glass';

// Performance thresholds based on Core Web Vitals
export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // 2.5 seconds
  INP: 200,  // 200 milliseconds
  CLS: 0.1,  // 0.1
  FCP: 1800, // 1.8 seconds
  TTFB: 800, // 800 milliseconds
  FPS: 60,   // 60 FPS for smooth animations
} as const;

// Seasonal theme configurations
export const SEASONAL_THEMES: Record<string, SeasonalThemeConfig> = {
  spring_day: {
    id: 'spring_day',
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
  summer_day: {
    id: 'summer_day',
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
  autumn_day: {
    id: 'autumn_day',
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
  winter_day: {
    id: 'winter_day',
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