/**
 * Core Type Definitions for Liquid Glass Tech Blog
 * 
 * Comprehensive type system supporting:
 * - Liquid Glass effects and GPU acceleration
 * - Seasonal theme system with weather integration
 * - MDX content with embedded React components
 * - AI-generated eyecatch images with optimization
 * - Performance monitoring and accessibility
 * - TDD testing patterns and quality assurance
 */

// =============================================================================
// LIQUID GLASS & VISUAL EFFECTS
// =============================================================================

export type LiquidGlassVariant = 'subtle' | 'medium' | 'intense';

export interface LiquidGlassProps {
  variant?: LiquidGlassVariant;
  blur?: number;
  opacity?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  seasonalTheme?: boolean;
  interactive?: boolean;
  motionPreset?: MotionPreset;
}

export type MotionPreset = 'subtle' | 'smooth' | 'spring';

export interface MotionConfig {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  transition: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
}

// =============================================================================
// SEASONAL THEME SYSTEM
// =============================================================================

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'storm';
export type ParticleType = 'sakura' | 'waterdrops' | 'leaves' | 'snow' | 'none';

export interface SeasonalTheme {
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
    text: string;
    muted: string;
  };
  
  glassMorphism: {
    backdropFilter: string;
    backgroundColor: string;
    borderColor: string;
    shadowColor: string;
    gradientOverlay?: string;
  };
  
  particles: {
    type: ParticleType;
    count: number;
    size: [number, number]; // [min, max]
    speed: number;
    opacity: number;
    color?: string;
  };
  
  animations: {
    transition: string;
    easing: string;
    duration: number;
  };
}

export interface WeatherData {
  location: string;
  weather: Weather;
  temperature: number;
  humidity: number;
  timestamp: Date;
}

// =============================================================================
// CONTENT MANAGEMENT
// =============================================================================

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
  status: PostStatus;
  seoData: SEOData;
  liquidGlassEffects?: EffectData[];
  readingTime: number;
  viewCount: number;
  metadata: PostMetadata;
}

export type PostStatus = 'draft' | 'published' | 'archived';

export interface PostMetadata {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  codeExamples: boolean;
  interactiveDemo: boolean;
  performanceNotes: boolean;
  accessibilityInfo: boolean;
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
  optimizationMetrics: ImageOptimizationMetrics;
}

export interface ImageOptimizationMetrics {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  quality: number;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon?: string;
  postCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  postCount: number;
}

// =============================================================================
// LIQUID GLASS EFFECT LIBRARY
// =============================================================================

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
  updatedAt: Date;
  downloads: number;
  likes: number;
  tags: string[];
}

export interface EffectParameters {
  blur: number;
  opacity: number;
  saturation: number;
  brightness: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  animation?: {
    type: 'none' | 'pulse' | 'float' | 'rotate' | 'scale';
    duration: number;
    easing: string;
  };
}

export type EffectCategory = 
  | 'buttons'
  | 'cards'
  | 'navigation'
  | 'overlays'
  | 'backgrounds'
  | 'text-effects'
  | 'interactive'
  | 'particles';

export interface BrowserCompatibility {
  chrome: string;
  firefox: string;
  safari: string;
  edge: string;
  mobile: {
    ios: string;
    android: string;
  };
  fallback: boolean;
  notes?: string;
}

// =============================================================================
// PERFORMANCE & MONITORING
// =============================================================================

export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  inp: number; // Interaction to Next Paint
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  effectRenderTime: number;
  gpuUsage: number;
  memoryUsage: number;
  fps: number;
  frameDrops: number;
}

export interface DeviceInfo {
  userAgent: string;
  screen: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  gpu?: {
    renderer: string;
    vendor: string;
  };
  memory?: number; // GB
  cores?: number;
  connection?: {
    effectiveType: string;
    downlink: number;
  };
}

export interface AnalyticsData {
  pageView: {
    path: string;
    timestamp: Date;
    userAgent: string;
    referrer?: string;
    duration: number;
    device: DeviceInfo;
  };
  
  effectInteraction: {
    effectId: string;
    action: 'view' | 'customize' | 'download' | 'share' | 'copy';
    parameters?: EffectParameters;
    timestamp: Date;
    performance: PerformanceMetrics;
  };

  performanceEntry: {
    metrics: PerformanceMetrics;
    deviceInfo: DeviceInfo;
    timestamp: Date;
    page: string;
  };
}

// =============================================================================
// SEO & ACCESSIBILITY
// =============================================================================

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  structuredData: Record<string, unknown>;
}

export interface AccessibilityFeatures {
  altText: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
  keyboardShortcuts?: string[];
  screenReaderInstructions?: string;
  reducedMotion?: boolean;
  highContrast?: boolean;
  focusManagement?: boolean;
}

// =============================================================================
// ADMIN & AUTHENTICATION
// =============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  preferences: UserPreferences;
}

export type UserRole = 'admin' | 'editor' | 'contributor' | 'viewer';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  seasonalThemes: boolean;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    browser: boolean;
  };
}

// =============================================================================
// TESTING & QUALITY ASSURANCE
// =============================================================================

export interface TestResult {
  id: string;
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  coverage: CoverageMetrics;
  performance?: PerformanceMetrics;
  accessibility?: AccessibilityReport;
  errors?: TestError[];
}

export interface CoverageMetrics {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
}

export interface AccessibilityReport {
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
  score: number; // 0-100
}

export interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: AccessibilityNode[];
}

export interface AccessibilityNode {
  target: string;
  html: string;
  failureSummary: string;
}

export interface TestError {
  message: string;
  stack?: string;
  file?: string;
  line?: number;
  column?: number;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type EventHandler<T = void> = (data: T) => void | Promise<void>;
export type AsyncEventHandler<T = void> = (data: T) => Promise<void>;

// =============================================================================
// API & RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: Record<string, unknown>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  path?: string;
  method?: string;
  statusCode: number;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
  constraint?: string;
}

// =============================================================================
// TYPE GUARDS FOR RUNTIME VALIDATION
// =============================================================================

export const isLiquidGlassVariant = (value: unknown): value is LiquidGlassVariant => {
  return typeof value === 'string' && ['subtle', 'medium', 'intense'].includes(value);
};

export const isSeason = (value: unknown): value is Season => {
  return typeof value === 'string' && ['spring', 'summer', 'autumn', 'winter'].includes(value);
};

export const isPostStatus = (value: unknown): value is PostStatus => {
  return typeof value === 'string' && ['draft', 'published', 'archived'].includes(value);
};

export const isUserRole = (value: unknown): value is UserRole => {
  return typeof value === 'string' && ['admin', 'editor', 'contributor', 'viewer'].includes(value);
};

export const isMotionPreset = (value: unknown): value is MotionPreset => {
  return typeof value === 'string' && ['subtle', 'smooth', 'spring'].includes(value);
};

export const isEffectCategory = (value: unknown): value is EffectCategory => {
  return typeof value === 'string' && [
    'buttons', 'cards', 'navigation', 'overlays', 'backgrounds', 
    'text-effects', 'interactive', 'particles'
  ].includes(value);
};