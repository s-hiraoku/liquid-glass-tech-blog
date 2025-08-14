/**
 * Performance Monitoring and Analytics Types
 * 
 * Comprehensive type definitions for performance monitoring, analytics,
 * and device capability tracking. These types enable data-driven optimization
 * of glass effects and overall application performance.
 * 
 * @module PerformanceTypes
 * @author Liquid Glass Tech Blog Team
 * @version 1.0.0
 */

/**
 * Core Web Vitals and Glass Effects Performance Metrics
 * 
 * Tracks both standard web performance metrics (Core Web Vitals) and
 * glass effect specific performance indicators. Used for performance
 * monitoring, optimization decisions, and user experience analytics.
 * 
 * @interface PerformanceMetrics
 * @property {number} lcp - Largest Contentful Paint in milliseconds
 * @property {number} inp - Interaction to Next Paint in milliseconds
 * @property {number} cls - Cumulative Layout Shift (0.0-1.0+)
 * @property {number} fcp - First Contentful Paint in milliseconds
 * @property {number} ttfb - Time to First Byte in milliseconds
 * @property {number} effectRenderTime - Glass effect render time in ms
 * @property {number} gpuUsage - GPU usage percentage (0-100)
 * @property {number} memoryUsage - Memory usage in MB
 * @property {number} frameRate - Current frame rate in FPS
 */
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

export interface GPUMetrics {
  renderTime: number;
  gpuUsage: number;
  frameRate: number;
  memoryUsage: number;
  fallbacksTriggered: number;
  complexity: 'low' | 'medium' | 'high';
}

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
    parameters?: any;
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

export interface WebVitalEntry {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

export interface PerformanceReport {
  url: string;
  timestamp: Date;
  metrics: PerformanceMetrics;
  deviceInfo: DeviceInfo;
  errors?: Error[];
  warnings?: string[];
}