export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  inp: number; // Interaction to Next Paint  
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  effectRenderTime: number;
  gpuUsage: number;
  memoryUsage: number;
}

export interface DeviceInfo {
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  deviceMemory?: number;
  hardwareConcurrency?: number;
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
  };
  
  effectInteraction: {
    effectId: string;
    action: 'view' | 'customize' | 'download' | 'share';
    parameters?: Record<string, unknown>;
    timestamp: Date;
  };

  performanceEntry: {
    metrics: PerformanceMetrics;
    deviceInfo: DeviceInfo;
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