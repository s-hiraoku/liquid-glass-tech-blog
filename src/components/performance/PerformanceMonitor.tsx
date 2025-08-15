/**
 * Performance Monitor Component - Phase 6.7-6.8 Responsive Design Enhancement
 * 
 * Real-time performance monitoring with Core Web Vitals tracking.
 * Provides visual feedback for development and staging environments.
 * 
 * Features:
 * - Core Web Vitals (LCP, INP, CLS) real-time monitoring
 * - FPS tracking with visual indicators
 * - Memory usage monitoring
 * - GPU acceleration status
 * - Device-specific performance tier detection
 * - Visual performance overlay for development
 * - Accessibility compliant performance indicators
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Cpu, 
  Gauge, 
  HardDrive, 
  Monitor, 
  Wifi, 
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PerformanceMetrics {
  lcp: number | null;
  inp: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  fps: number;
  memoryUsage: number;
  connectionType: string;
  devicePixelRatio: number;
  isGPUAccelerated: boolean;
}

interface PerformanceMonitorProps {
  className?: string;
  position?: 'fixed' | 'absolute' | 'relative';
  minimized?: boolean;
  showOnlyErrors?: boolean;
  updateInterval?: number;
}

export function PerformanceMonitor({
  className,
  position = 'fixed',
  minimized = false,
  showOnlyErrors = false,
  updateInterval = 1000
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    inp: null,
    cls: null,
    fcp: null,
    ttfb: null,
    fps: 0,
    memoryUsage: 0,
    connectionType: 'unknown',
    devicePixelRatio: 1,
    isGPUAccelerated: false
  });

  const [isVisible, setIsVisible] = useState(!minimized);
  const [hasErrors, setHasErrors] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Core Web Vitals thresholds
  const THRESHOLDS = {
    lcp: { good: 2500, poor: 4000 },
    inp: { good: 200, poor: 500 },
    cls: { good: 0.1, poor: 0.25 },
    fcp: { good: 1800, poor: 3000 },
    ttfb: { good: 800, poor: 1800 }
  };

  // Performance monitoring setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Web Vitals
    const initWebVitals = async () => {
      try {
        const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals');
        
        onCLS((metric) => {
          setMetrics(prev => ({ ...prev, cls: metric.value }));
        });
        
        onFCP((metric) => {
          setMetrics(prev => ({ ...prev, fcp: metric.value }));
        });
        
        onINP((metric) => {
          setMetrics(prev => ({ ...prev, inp: metric.value }));
        });
        
        onLCP((metric) => {
          setMetrics(prev => ({ ...prev, lcp: metric.value }));
        });
        
        onTTFB((metric) => {
          setMetrics(prev => ({ ...prev, ttfb: metric.value }));
        });
      } catch (error) {
        console.warn('Web Vitals library not available:', error);
      }
    };

    // FPS monitoring
    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      
      if (delta >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / delta);
        setMetrics(prev => ({ ...prev, fps }));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      requestAnimationFrame(measureFPS);
    };

    // Device and connection info
    const updateDeviceInfo = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const connection = (navigator as any).connection;
      const connectionType = connection?.effectiveType || 'unknown';
      
      // Check GPU acceleration (basic detection)
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const isGPUAccelerated = !!gl;

      setMetrics(prev => ({
        ...prev,
        devicePixelRatio,
        connectionType,
        isGPUAccelerated
      }));
    };

    // Memory usage monitoring
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    // Initialize monitoring
    initWebVitals();
    updateDeviceInfo();
    requestAnimationFrame(measureFPS);

    // Regular updates
    const interval = setInterval(() => {
      updateMemoryUsage();
    }, updateInterval);

    return () => {
      clearInterval(interval);
    };
  }, [updateInterval]);

  // Check for performance issues
  useEffect(() => {
    const errors = [
      metrics.lcp && metrics.lcp > THRESHOLDS.lcp.poor,
      metrics.inp && metrics.inp > THRESHOLDS.inp.poor,
      metrics.cls && metrics.cls > THRESHOLDS.cls.poor,
      metrics.fps < 50,
      metrics.memoryUsage > 80
    ].some(Boolean);

    setHasErrors(errors);
  }, [metrics]);

  // Get metric status
  const getMetricStatus = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return 'unknown';
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-3 h-3" />;
      case 'needs-improvement': return <AlertTriangle className="w-3 h-3" />;
      case 'poor': return <XCircle className="w-3 h-3" />;
      default: return <Monitor className="w-3 h-3" />;
    }
  };

  // Format metric value
  const formatMetric = (value: number | null, unit: string = 'ms') => {
    if (value === null) return 'N/A';
    if (unit === 'ms') return `${Math.round(value)}ms`;
    if (unit === '%') return `${Math.round(value)}%`;
    if (unit === 'fps') return `${Math.round(value)} fps`;
    return `${value.toFixed(3)}`;
  };

  // Don't render if showOnlyErrors is true and no errors
  if (showOnlyErrors && !hasErrors) return null;

  return (
    <div
      className={cn(
        "bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg",
        "text-xs font-mono z-50",
        position === 'fixed' && "fixed bottom-4 right-4",
        position === 'absolute' && "absolute bottom-4 right-4",
        !isVisible && "opacity-50 hover:opacity-100 transition-opacity",
        className
      )}
      role="complementary"
      aria-label="Performance Monitor"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-semibold">Performance</span>
          {hasErrors && (
            <Badge variant="destructive" className="text-xs">
              Issues
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="h-6 w-6 p-0"
            aria-label={isVisible ? 'Minimize monitor' : 'Show monitor'}
          >
            {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* Metrics */}
      {isVisible && (
        <div className="p-3 space-y-3">
          {/* Core Web Vitals */}
          <div>
            <h4 className="font-semibold mb-2 text-xs">Core Web Vitals</h4>
            <div className="grid grid-cols-2 gap-2">
              {/* LCP */}
              <div className="flex items-center justify-between">
                <span>LCP:</span>
                <div className={cn(
                  "flex items-center gap-1",
                  getStatusColor(getMetricStatus(metrics.lcp, THRESHOLDS.lcp))
                )}>
                  {getStatusIcon(getMetricStatus(metrics.lcp, THRESHOLDS.lcp))}
                  <span>{formatMetric(metrics.lcp)}</span>
                </div>
              </div>

              {/* INP */}
              <div className="flex items-center justify-between">
                <span>INP:</span>
                <div className={cn(
                  "flex items-center gap-1",
                  getStatusColor(getMetricStatus(metrics.inp, THRESHOLDS.inp))
                )}>
                  {getStatusIcon(getMetricStatus(metrics.inp, THRESHOLDS.inp))}
                  <span>{formatMetric(metrics.inp)}</span>
                </div>
              </div>

              {/* CLS */}
              <div className="flex items-center justify-between">
                <span>CLS:</span>
                <div className={cn(
                  "flex items-center gap-1",
                  getStatusColor(getMetricStatus(metrics.cls, THRESHOLDS.cls))
                )}>
                  {getStatusIcon(getMetricStatus(metrics.cls, THRESHOLDS.cls))}
                  <span>{formatMetric(metrics.cls, '')}</span>
                </div>
              </div>

              {/* FCP */}
              <div className="flex items-center justify-between">
                <span>FCP:</span>
                <div className={cn(
                  "flex items-center gap-1",
                  getStatusColor(getMetricStatus(metrics.fcp, THRESHOLDS.fcp))
                )}>
                  {getStatusIcon(getMetricStatus(metrics.fcp, THRESHOLDS.fcp))}
                  <span>{formatMetric(metrics.fcp)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Runtime Metrics */}
          <div>
            <h4 className="font-semibold mb-2 text-xs">Runtime</h4>
            <div className="grid grid-cols-2 gap-2">
              {/* FPS */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  FPS:
                </span>
                <span className={cn(
                  metrics.fps >= 55 ? 'text-green-600' : 
                  metrics.fps >= 30 ? 'text-yellow-600' : 'text-red-600'
                )}>
                  {formatMetric(metrics.fps, 'fps')}
                </span>
              </div>

              {/* Memory */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  Memory:
                </span>
                <span className={cn(
                  metrics.memoryUsage < 70 ? 'text-green-600' : 
                  metrics.memoryUsage < 85 ? 'text-yellow-600' : 'text-red-600'
                )}>
                  {formatMetric(metrics.memoryUsage, '%')}
                </span>
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div>
            <h4 className="font-semibold mb-2 text-xs">Device</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  GPU:
                </span>
                <span className={metrics.isGPUAccelerated ? 'text-green-600' : 'text-yellow-600'}>
                  {metrics.isGPUAccelerated ? 'Accelerated' : 'Software'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  DPR:
                </span>
                <span>{metrics.devicePixelRatio}x</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  Network:
                </span>
                <span className="capitalize">{metrics.connectionType}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen reader info */}
      <div className="sr-only" aria-live="polite">
        Performance monitor showing Core Web Vitals: 
        LCP {formatMetric(metrics.lcp)}, 
        INP {formatMetric(metrics.inp)}, 
        CLS {formatMetric(metrics.cls, '')}. 
        Current FPS: {formatMetric(metrics.fps, 'fps')}. 
        Memory usage: {formatMetric(metrics.memoryUsage, '%')}.
        {hasErrors && ' Performance issues detected.'}
      </div>
    </div>
  );
}

export default PerformanceMonitor;