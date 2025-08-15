import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debounce function for performance optimization
 * Delays execution of a function until after a specified delay
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function for performance optimization
 * Limits execution of a function to once per specified interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  interval: number
): (...args: Parameters<T>) => void {
  let isThrottled = false;
  
  return (...args: Parameters<T>) => {
    if (!isThrottled) {
      func(...args);
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, interval);
    }
  };
}

/**
 * Generate a random ID string
 * Useful for component keys and unique identifiers
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a value is a valid number
 * More strict than isNaN for component prop validation
 */
export function isValidNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Clamp a number between min and max values
 * Useful for constraining animation parameters
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Convert a number to a percentage string
 * Useful for CSS values and progress indicators
 */
export function toPercentage(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Check if the current environment supports a CSS feature
 * Useful for progressive enhancement and graceful degradation
 */
export function supportsCSSFeature(property: string, value?: string): boolean {
  if (typeof CSS === 'undefined' || !CSS.supports) {
    return false;
  }
  
  return value ? CSS.supports(property, value) : CSS.supports(property);
}

/**
 * Check if the user prefers reduced motion
 * Important for accessibility compliance
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the user prefers reduced transparency
 * Important for accessibility compliance
 */
export function prefersReducedTransparency(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
}

/**
 * Get the current time of day based on hours
 * Useful for seasonal theme calculations
 */
export function getTimeOfDay(): 'morning' | 'day' | 'evening' | 'night' {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

/**
 * Get the current season based on date
 * Useful for seasonal theme calculations
 */
export function getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth(); // 0-11
  
  if (month >= 2 && month <= 4) return 'spring';   // Mar, Apr, May
  if (month >= 5 && month <= 7) return 'summer';   // Jun, Jul, Aug
  if (month >= 8 && month <= 10) return 'autumn';  // Sep, Oct, Nov
  return 'winter';                                  // Dec, Jan, Feb
}

/**
 * Calculate reading time for a text
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format a date for display
 * Provides consistent date formatting across the application
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Sanitize HTML content for safe rendering
 * Basic XSS prevention for user-generated content
 */
export function sanitizeHtml(html: string): string {
  // This is a basic implementation - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

/**
 * Create a slug from a string
 * Useful for URL generation from titles
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
}

/**
 * Deep merge objects
 * Useful for merging configuration objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as any, source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Check if a value is an object
 * Helper function for deepMerge
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Get glass variant class name for liquid-glass integration
 * Maps variant names to Tailwind CSS classes
 */
export function getGlassVariant(variant: 'subtle' | 'medium' | 'intense' = 'medium'): string {
  const variants = {
    subtle: 'bg-white/5 backdrop-blur-sm border-white/10',
    medium: 'bg-white/10 backdrop-blur-md border-white/20',
    intense: 'bg-white/20 backdrop-blur-lg border-white/30',
  };
  
  return variants[variant];
}

/**
 * Apply liquid-glass theme integration
 * Combines glasscn-ui classes with liquid-glass styling
 */
export function applyLiquidGlassTheme(
  baseClasses: string,
  glassVariant: 'subtle' | 'medium' | 'intense' = 'medium',
  additionalClasses?: string
): string {
  const glassClasses = getGlassVariant(glassVariant);
  
  return cn(
    baseClasses,
    glassClasses,
    'transition-all duration-300 ease-in-out',
    'hover:backdrop-blur-xl hover:bg-white/15',
    'supports-[backdrop-filter]:bg-white/10',
    'supports-[backdrop-filter]:backdrop-blur-md',
    additionalClasses
  );
}