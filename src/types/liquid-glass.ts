/**
 * Liquid Glass Core Interfaces and Type Definitions
 * 
 * This module provides comprehensive TypeScript definitions for the Liquid Glass
 * Tech Blog project, ensuring compatibility with @developer-hub/liquid-glass library
 * and establishing a robust type system for glass morphism effects.
 * 
 * @module LiquidGlassTypes
 * @author Liquid Glass Tech Blog Team
 * @version 1.0.0
 * @since 2024-01-15
 */

/**
 * Liquid Glass Effect Variants
 * 
 * Defines the available glass morphism effect variants that are compatible
 * with @developer-hub/liquid-glass library. Each variant provides a different
 * intensity and visual style of the glass effect.
 * 
 * @typedef {string} LiquidGlassVariant
 * @property {'glass-subtle'} glass-subtle - Minimal glass effect with light blur
 * @property {'glass-medium'} glass-medium - Balanced glass effect (default)
 * @property {'glass-intense'} glass-intense - Strong glass effect with heavy blur
 * @property {'glass-outlined'} glass-outlined - Glass effect with visible border
 * @property {'glass-filled'} glass-filled - Glass effect with background fill
 */
export type LiquidGlassVariant = 
  | 'glass-subtle'
  | 'glass-medium' 
  | 'glass-intense'
  | 'glass-outlined'
  | 'glass-filled';

/**
 * Seasonal Theme System Types
 * 
 * These types define the temporal and environmental contexts for
 * the dynamic seasonal theming system.
 */

/** @typedef {string} Season - Four seasons for theme variation */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/** @typedef {string} TimeOfDay - Time-based theme adjustments */
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

/** @typedef {string} Weather - Weather-based visual effects */
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

/** @typedef {string} ParticleType - Animated particle effects per season */
export type ParticleType = 'sakura' | 'waterdrops' | 'leaves' | 'snow';

/**
 * Effect Parameters Interface
 * 
 * Core parameters for controlling glass morphism effects. These parameters
 * are compatible with @developer-hub/liquid-glass library and provide
 * fine-grained control over visual appearance.
 * 
 * @interface EffectParameters
 * @property {number} blur - Backdrop blur intensity in pixels (0-50)
 * @property {number} opacity - Background opacity (0.0-1.0)
 * @property {number} saturation - Color saturation multiplier (0.5-3.0)
 * @property {number} brightness - Brightness adjustment (0.5-2.0)
 * @property {number} [hue] - Optional hue rotation in degrees (0-360)
 * @property {number} [contrast] - Optional contrast adjustment (0.5-2.0)
 * @property {number} [borderRadius] - Optional border radius in pixels
 * @property {number} [animationSpeed] - Optional animation speed multiplier
 */
export interface EffectParameters {
  blur: number;
  opacity: number;
  saturation: number;
  brightness: number;
  hue?: number;
  contrast?: number;
  borderRadius?: number;
  animationSpeed?: number;
}

/**
 * Liquid Glass Card Component Props
 * 
 * Props interface for the main LiquidGlassCard component, providing
 * a comprehensive set of customization options for glass morphism effects.
 * 
 * @interface LiquidGlassCardProps
 * @property {LiquidGlassVariant} [variant='glass-medium'] - Glass effect variant
 * @property {number} [blur=15] - Custom blur intensity override
 * @property {number} [opacity=0.1] - Custom opacity override  
 * @property {number} [saturation=1.8] - Custom saturation override
 * @property {number} [brightness=1.0] - Custom brightness override
 * @property {React.ReactNode} children - Child components to render
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [interactive=false] - Enable hover/click interactions
 * @property {boolean} [seasonalTheme=false] - Apply automatic seasonal theming
 * @property {'subtle'|'smooth'|'spring'} [motionPreset='smooth'] - Animation preset
 * @property {string} [data-testid] - Test identifier for testing frameworks
 */
export interface LiquidGlassCardProps {
  variant?: LiquidGlassVariant;
  blur?: number;
  opacity?: number;
  saturation?: number;
  brightness?: number;
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  seasonalTheme?: boolean;
  motionPreset?: 'subtle' | 'smooth' | 'spring';
  'data-testid'?: string;
}

export interface LiquidGlassButtonProps {
  variant?: 'glass' | 'glass-solid' | 'glass-outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  'data-testid'?: string;
}

/**
 * Seasonal Theme Configuration System
 * 
 * Comprehensive configuration interface for the dynamic seasonal theming system.
 * This system automatically adapts the visual appearance based on season, time of day,
 * and weather conditions, providing an immersive and contextual user experience.
 * 
 * The seasonal theme system is designed to:
 * - Automatically detect and apply seasonal themes
 * - Provide smooth transitions between theme changes
 * - Support manual overrides for specific seasons
 * - Integrate seamlessly with glass morphism effects
 * - Enhance user engagement through environmental storytelling
 * 
 * @interface SeasonalThemeConfig
 * @property {string} id - Unique identifier for the theme configuration
 * @property {Season} season - Season this theme represents
 * @property {TimeOfDay} timeOfDay - Time of day for this theme variant
 * @property {Weather} [weather] - Optional weather condition modifier
 * @property {object} colors - Color palette for the theme
 * @property {string} colors.primary - Primary theme color
 * @property {string} colors.secondary - Secondary theme color  
 * @property {string} colors.accent - Accent color for highlights
 * @property {string} colors.background - Background color or gradient
 * @property {string} colors.surface - Surface color for cards/panels
 * @property {object} glassMorphism - Glass morphism effect settings
 * @property {string} glassMorphism.backdropFilter - CSS backdrop-filter value
 * @property {string} glassMorphism.backgroundColor - Glass background color
 * @property {string} glassMorphism.borderColor - Glass border color
 * @property {string} glassMorphism.shadowColor - Glass shadow color
 * @property {object} particles - Animated particle system configuration
 * @property {ParticleType} particles.type - Type of particles to display
 * @property {number} particles.count - Number of particles
 * @property {[number, number]} particles.size - Min/max particle size range
 * @property {number} particles.speed - Particle animation speed multiplier
 * @property {number} particles.opacity - Particle opacity (0.0-1.0)
 * @property {object} animations - Animation and transition settings
 * @property {string} animations.transition - CSS transition property
 * @property {string} animations.easing - Animation easing function
 * @property {number} animations.duration - Animation duration in milliseconds
 */
export interface SeasonalThemeConfig {
  id: string;
  season: Season;
  timeOfDay: TimeOfDay;
  weather?: Weather;
  
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
    type: ParticleType;
    count: number;
    size: [number, number];
    speed: number;
    opacity: number;
  };
  
  animations: {
    transition: string;
    easing: string;
    duration: number;
  };
}

export interface SeasonalThemeHookReturn {
  currentTheme: SeasonalThemeConfig;
  season: Season;
  timeOfDay: TimeOfDay;
  weather?: Weather;
  isTransitioning: boolean;
  setManualTheme: (theme: Partial<SeasonalThemeConfig>) => void;
  resetToAutomatic: () => void;
}

// Performance Metrics
export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  inp: number; // Interaction to Next Paint  
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  effectRenderTime: number;
  gpuUsage: number;
  memoryUsage: number;
  frameRate: number;
}

export interface GPUMetrics {
  renderTime: number;
  gpuUsage: number;
  frameRate: number;
  memoryUsage: number;
  fallbacksTriggered: number;
  complexity: 'low' | 'medium' | 'high';
}

// Content Management Types
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string; // MDX content
  eyecatchImage: EyecatchImage;
  author: Author;
  category: Category;
  tags: Tag[];
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  seoData: SEOData;
  liquidGlassEffects?: EffectData[];
  readingTime: number;
  viewCount: number;
}

export interface EyecatchImage {
  id: string;
  url: string;
  webpUrl: string;
  avifUrl?: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string; // Base64 placeholder
  generatedBy: 'ai' | 'upload';
  aiPrompt?: string;
  optimizationMetrics: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  };
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  postCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
}

// Effect Library Types
export interface EffectData {
  id: string;
  name: string;
  description: string;
  code: string;
  parameters: EffectParameters;
  previewImage: string;
  category: EffectCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  performance: PerformanceMetrics;
  compatibility: BrowserCompatibility;
  createdBy: string;
  createdAt: Date;
  downloads: number;
  likes: number;
  tags: string[];
}

export interface EffectCategory {
  id: string;
  name: string;
  description: string;
  effectCount: number;
}

export interface BrowserCompatibility {
  chrome: string; // Minimum version
  firefox: string;
  safari: string;
  edge: string;
  mobile: boolean;
  fallbackStrategy: 'graceful' | 'disabled' | 'alternative';
}

// Real-time Editor Types
export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'typescript' | 'javascript' | 'css' | 'html';
  theme?: 'light' | 'dark' | 'seasonal';
  className?: string;
  options?: EditorOptions;
}

export interface EditorOptions {
  minimap?: { enabled: boolean };
  wordWrap?: 'on' | 'off';
  fontSize?: number;
  fontFamily?: string;
  lineNumbers?: 'on' | 'off';
  syntaxHighlight?: boolean;
  autocompletion?: boolean;
  bracketPairColorization?: boolean;
  smoothScrolling?: boolean;
  readOnly?: boolean;
}

export interface LivePreviewProps {
  code: string;
  parameters: EffectParameters;
  onParameterChange: (parameters: EffectParameters) => void;
  showControls?: boolean;
  className?: string;
}

// Analytics Types
export interface AnalyticsData {
  pageView: {
    path: string;
    timestamp: Date;
    userAgent: string;
    referrer?: string;
    duration: number;
  };
  
  effectInteraction: {
    effectId: string;
    action: 'view' | 'customize' | 'download' | 'share';
    parameters?: EffectParameters;
    timestamp: Date;
  };

  performanceEntry: {
    metrics: PerformanceMetrics;
    deviceInfo: DeviceInfo;
    timestamp: Date;
  };

  searchQuery: {
    query: string;
    results: number;
    timestamp: Date;
  };
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  connection?: {
    effectiveType: string;
    downlink: number;
  };
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
}

// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'author' | 'viewer';
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  reducedMotion: boolean;
  seasonalTheme: boolean;
  language: string;
  notifications: {
    comments: boolean;
    updates: boolean;
    newsletter: boolean;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchResults {
  posts: BlogPost[];
  effects: EffectData[];
  categories: Category[];
  tags: Tag[];
  total: number;
  query: string;
  suggestions?: string[];
}

// Export Format Types
export type ExportFormat = 'react' | 'vue' | 'css' | 'npm' | 'cdn' | 'source';

export interface ExportOptions {
  format: ExportFormat;
  includePreview: boolean;
  includeDocumentation: boolean;
  minify: boolean;
  bundleAssets: boolean;
}

export interface ExportResult {
  files: {
    name: string;
    content: string;
    type: 'code' | 'config' | 'asset' | 'documentation';
  }[];
  metadata: {
    effectId: string;
    format: ExportFormat;
    generatedAt: Date;
    version: string;
  };
}

// Error Types
export interface LiquidGlassError {
  code: string;
  message: string;
  context?: Record<string, any>;
  suggestions?: string[];
  timestamp: Date;
}

export type ErrorCode = 
  | 'EFFECT_COMPILATION_ERROR'
  | 'PERFORMANCE_WARNING'
  | 'COMPATIBILITY_INFO'
  | 'BROWSER_NOT_SUPPORTED'
  | 'GPU_ACCELERATION_FAILED'
  | 'AUTHENTICATION_REQUIRED'
  | 'RATE_LIMIT_EXCEEDED';

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Component State Types
export interface ComponentState<T = any> {
  loading: boolean;
  error: LiquidGlassError | null;
  data: T | null;
  initialized: boolean;
}

export interface AsyncState<T> extends ComponentState<T> {
  refetch: () => Promise<void>;
  reset: () => void;
}

// Event Types
export interface EffectInteractionEvent {
  type: 'hover' | 'click' | 'focus' | 'scroll';
  target: HTMLElement;
  parameters: EffectParameters;
  timestamp: number;
}

export interface ThemeChangeEvent {
  oldTheme: SeasonalThemeConfig;
  newTheme: SeasonalThemeConfig;
  reason: 'automatic' | 'manual' | 'system' | 'time' | 'weather';
  timestamp: number;
}