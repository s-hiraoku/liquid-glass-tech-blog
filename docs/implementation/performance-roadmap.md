# Performance Optimization Roadmap

## Core Web Vitals Strategy

### Target Metrics
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **INP (Interaction to Next Paint)**: < 200 milliseconds  
- **CLS (Cumulative Layout Shift)**: < 0.1

### Current Baseline Assessment
Based on similar liquid glass implementations:
- **Estimated Initial LCP**: 3.2-4.5s (without optimization)
- **Estimated Initial INP**: 250-400ms (with heavy animations)
- **Estimated Initial CLS**: 0.15-0.25 (with dynamic content)

## Phase 1: Foundation Performance (Day 1)

### 1.1 Next.js 15 App Router Optimization

#### Server-Side Optimization
```typescript
// /lib/performance/ssr-optimization.ts
export const dynamic = 'force-static' // Enable static generation
export const revalidate = 3600 // ISR with 1-hour revalidation

// Optimized data fetching
export async function getOptimizedArticles(limit: number = 12) {
  return unstable_cache(
    async () => {
      const articles = await fetchArticles({ limit })
      
      // Pre-generate blur data URLs
      const optimizedArticles = await Promise.all(
        articles.map(async (article) => ({
          ...article,
          eyecatch: article.eyecatch ? {
            ...article.eyecatch,
            blurDataURL: await generateBlurDataURL(article.eyecatch.src)
          } : undefined
        }))
      )
      
      return optimizedArticles
    },
    ['articles', limit.toString()],
    {
      revalidate: 3600,
      tags: ['articles']
    }
  )()
}
```

#### Image Optimization Strategy
```typescript
// /components/ui/OptimizedImage.tsx
import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  blurDataURL?: string
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      sizes={sizes}
      className={`
        transition-all duration-300 ease-in-out
        ${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
        ${hasError ? 'bg-muted' : ''}
      `}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setIsLoading(false)
        setHasError(true)
      }}
      // Modern image formats
      quality={85}
      style={{
        objectFit: 'cover',
        aspectRatio: `${width}/${height}`
      }}
    />
  )
}
```

#### Bundle Optimization Configuration
```typescript
// next.config.js
import { withBundleAnalyzer } from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true, // Partial Pre-rendering
    reactCompiler: true, // React 19 compiler
    optimizePackageImports: [
      '@specy/liquid-glass-react',
      'framer-motion',
      'lucide-react'
    ]
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Tree shaking optimization
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Liquid glass specific optimizations
      config.resolve.alias = {
        ...config.resolve.alias,
        '@specy/liquid-glass-react$': '@specy/liquid-glass-react/dist/index.esm.js'
      }
    }
    
    return config
  },
  
  // Performance budgets
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  }
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})(nextConfig)
```

### 1.2 Liquid Glass Performance Optimization

#### GPU Acceleration Configuration
```typescript
// /lib/performance/gpu-acceleration.ts
export interface PerformanceConfig {
  deviceTier: 'low' | 'medium' | 'high'
  gpuAcceleration: boolean
  maxConcurrentEffects: number
  effectQuality: 'low' | 'medium' | 'high'
}

export function detectDeviceCapabilities(): PerformanceConfig {
  // Check hardware acceleration support
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  const hasWebGL = !!gl
  
  // Check device memory (if available)
  const deviceMemory = (navigator as any).deviceMemory || 4
  
  // Check CPU cores
  const cpuCores = navigator.hardwareConcurrency || 2
  
  // Check network speed
  const connection = (navigator as any).connection
  const isSlowNetwork = connection?.effectiveType === 'slow-2g' || 
                       connection?.effectiveType === '2g'
  
  // Determine device tier
  let deviceTier: 'low' | 'medium' | 'high' = 'medium'
  
  if (deviceMemory >= 8 && cpuCores >= 4 && hasWebGL && !isSlowNetwork) {
    deviceTier = 'high'
  } else if (deviceMemory < 4 || cpuCores < 2 || isSlowNetwork) {
    deviceTier = 'low'
  }
  
  return {
    deviceTier,
    gpuAcceleration: hasWebGL && deviceTier !== 'low',
    maxConcurrentEffects: deviceTier === 'high' ? 10 : deviceTier === 'medium' ? 5 : 2,
    effectQuality: deviceTier
  }
}

export const performanceConfig = detectDeviceCapabilities()
```

#### Smart Effect Loading
```typescript
// /components/effects/SmartLiquidGlass.tsx
import React, { Suspense, useMemo } from 'react'
import { performanceConfig } from '@/lib/performance/gpu-acceleration'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const LiquidGlass = React.lazy(() => 
  import('@specy/liquid-glass-react').then(module => ({
    default: module.LiquidGlass
  }))
)

interface SmartLiquidGlassProps {
  children: React.ReactNode
  blur?: number
  opacity?: number
  saturation?: number
  interactive?: boolean
  priority?: boolean
}

export function SmartLiquidGlass({
  children,
  blur = 8,
  opacity = 0.15,
  saturation = 1.2,
  interactive = true,
  priority = false
}: SmartLiquidGlassProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '100px' })
  
  // Optimize based on device capabilities
  const optimizedConfig = useMemo(() => {
    const { deviceTier, gpuAcceleration, effectQuality } = performanceConfig
    
    if (!gpuAcceleration || deviceTier === 'low') {
      return null // No effects on low-end devices
    }
    
    const qualityMultipliers = {
      low: { blur: 0.5, opacity: 0.7, saturation: 0.9 },
      medium: { blur: 1, opacity: 1, saturation: 1 },
      high: { blur: 1.2, opacity: 1.1, saturation: 1.1 }
    }
    
    const multiplier = qualityMultipliers[effectQuality]
    
    return {
      blur: Math.round(blur * multiplier.blur),
      opacity: opacity * multiplier.opacity,
      saturation: saturation * multiplier.saturation,
      interactive: interactive && deviceTier !== 'low'
    }
  }, [blur, opacity, saturation, interactive])
  
  // Fallback for no effects
  if (!optimizedConfig) {
    return <div ref={ref}>{children}</div>
  }
  
  // Lazy load effects only when in view (unless priority)
  if (!priority && !isInView) {
    return <div ref={ref}>{children}</div>
  }
  
  return (
    <div ref={ref}>
      <Suspense fallback={children}>
        <LiquidGlass {...optimizedConfig}>
          {children}
        </LiquidGlass>
      </Suspense>
    </div>
  )
}
```

## Phase 2: Core Web Vitals Optimization (Day 2)

### 2.1 LCP Optimization (Target: < 2.5s)

#### Critical Resource Preloading
```typescript
// /app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/api/articles/featured"
          as="fetch"
          crossOrigin="anonymous"
        />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Preconnect to critical third parties */}
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  )
}
```

#### Above-the-fold Optimization
```typescript
// /app/page.tsx
import { Suspense } from 'react'
import { unstable_noStore as noStore } from 'next/cache'

// Critical components loaded immediately
import { ArticleHero } from '@/components/article/ArticleHero'
import { Navigation } from '@/components/layout/Navigation'

// Non-critical components loaded with Suspense
const ArticleGrid = lazy(() => import('@/components/article/ArticleGrid'))
const Footer = lazy(() => import('@/components/layout/Footer'))

export default async function HomePage() {
  // Load critical data immediately
  const featuredArticle = await getFeaturedArticle()
  
  return (
    <>
      {/* Critical above-the-fold content */}
      <Navigation />
      <ArticleHero article={featuredArticle} priority />
      
      {/* Non-critical content with streaming */}
      <Suspense fallback={<ArticleGridSkeleton />}>
        <ArticleGridServer />
      </Suspense>
      
      <Suspense fallback={<div className="h-32" />}>
        <Footer />
      </Suspense>
    </>
  )
}

// Server component for streaming
async function ArticleGridServer() {
  noStore() // Don't cache this component
  const articles = await getLatestArticles({ limit: 12 })
  return <ArticleGrid articles={articles} />
}
```

### 2.2 INP Optimization (Target: < 200ms)

#### Debounced Interactions
```typescript
// /hooks/useOptimizedInteraction.ts
import { useCallback, useRef } from 'react'

export function useOptimizedInteraction<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 16 // One frame at 60fps
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastCallRef = useRef<number>(0)
  
  return useCallback((...args: any[]) => {
    const now = Date.now()
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // If enough time has passed, execute immediately
    if (now - lastCallRef.current > delay * 2) {
      lastCallRef.current = now
      callback(...args)
    } else {
      // Otherwise, debounce
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now()
        callback(...args)
      }, delay)
    }
  }, [callback, delay]) as T
}
```

#### Optimized Hover Effects
```typescript
// /components/article/OptimizedArticleCard.tsx
import { useOptimizedInteraction } from '@/hooks/useOptimizedInteraction'
import { useState, useCallback } from 'react'

export function OptimizedArticleCard({ article }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Debounce hover effects to prevent excessive re-renders
  const handleMouseEnter = useOptimizedInteraction(
    useCallback(() => setIsHovered(true), []),
    16
  )
  
  const handleMouseLeave = useOptimizedInteraction(
    useCallback(() => setIsHovered(false), []),
    16
  )
  
  return (
    <motion.article
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: isHovered ? -4 : 0,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeOut'
      }}
    >
      {/* Card content */}
    </motion.article>
  )
}
```

### 2.3 CLS Optimization (Target: < 0.1)

#### Layout Stabilization
```typescript
// /components/ui/StabilizedImage.tsx
import { useState } from 'react'
import Image from 'next/image'

interface StabilizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
}

export function StabilizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority 
}: StabilizedImageProps) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <div 
      style={{ 
        aspectRatio: `${width}/${height}`,
        backgroundColor: 'hsl(var(--muted))',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {!imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">画像を読み込めませんでした</span>
        </div>
      )}
    </div>
  )
}
```

#### Skeleton Loading with Exact Dimensions
```typescript
// /components/article/PreciseArticleCardSkeleton.tsx
export function PreciseArticleCardSkeleton({ variant }: { variant?: string }) {
  // Use exact dimensions to prevent layout shift
  const dimensions = {
    default: { height: 384 }, // 24rem
    featured: { height: 512 }, // 32rem
    compact: { height: 320 }   // 20rem
  }
  
  const cardHeight = dimensions[variant as keyof typeof dimensions] || dimensions.default
  
  return (
    <div 
      className="rounded-lg border bg-card"
      style={{ minHeight: cardHeight.height }}
    >
      {/* Image skeleton with exact aspect ratio */}
      <div 
        className="w-full bg-muted animate-pulse"
        style={{ aspectRatio: '16/9' }}
      />
      
      {/* Content skeleton with measured spacing */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-muted animate-pulse rounded w-4/5" />
          <div className="h-6 bg-muted animate-pulse rounded w-3/5" />
        </div>
        
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        </div>
        
        <div className="flex gap-2">
          <div className="h-6 bg-muted animate-pulse rounded w-16" />
          <div className="h-6 bg-muted animate-pulse rounded w-20" />
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-muted animate-pulse rounded w-24" />
          <div className="h-9 bg-muted animate-pulse rounded w-20" />
        </div>
      </div>
    </div>
  )
}
```

## Phase 3: Advanced Performance Monitoring (Day 3)

### 3.1 Real-time Web Vitals Monitoring

```typescript
// /components/performance/WebVitalsReporter.tsx
'use client'

import { useEffect, useRef } from 'react'
import { onCLS, onLCP, onINP, onTTFB, onFCP } from 'web-vitals'

interface WebVitalsData {
  name: string
  value: number
  delta: number
  id: string
  navigationType: string
}

export function WebVitalsReporter() {
  const vitalsData = useRef<Map<string, WebVitalsData>>(new Map())
  
  useEffect(() => {
    const reportWebVital = (metric: WebVitalsData) => {
      vitalsData.current.set(metric.name, metric)
      
      // Send to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }
      
      // Log performance warnings
      const thresholds = {
        LCP: 2500,
        INP: 200,
        CLS: 0.1,
        TTFB: 800,
        FCP: 1800
      }
      
      if (metric.value > thresholds[metric.name as keyof typeof thresholds]) {
        console.warn(`🚨 Performance Warning: ${metric.name} exceeded threshold`, {
          value: metric.value,
          threshold: thresholds[metric.name as keyof typeof thresholds],
          metric
        })
      }
      
      // Development-only detailed logging
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Web Vital: ${metric.name}`, {
          value: metric.value,
          delta: metric.delta,
          id: metric.id
        })
      }
    }
    
    // Register all web vitals
    onLCP(reportWebVital)
    onINP(reportWebVital)
    onCLS(reportWebVital)
    onTTFB(reportWebVital)
    onFCP(reportWebVital)
    
  }, [])
  
  return null
}
```

### 3.2 Performance Budget Monitoring

```typescript
// /lib/performance/budget-monitor.ts
export interface PerformanceBudget {
  lcp: number
  inp: number
  cls: number
  ttfb: number
  fcp: number
  bundleSize: number
  imageSize: number
}

export const performanceBudget: PerformanceBudget = {
  lcp: 2500,     // 2.5s
  inp: 200,      // 200ms
  cls: 0.1,      // 0.1
  ttfb: 800,     // 800ms
  fcp: 1800,     // 1.8s
  bundleSize: 87040,  // 85KB
  imageSize: 512000   // 500KB
}

export class PerformanceMonitor {
  private violations: Array<{
    metric: string
    value: number
    threshold: number
    timestamp: number
  }> = []
  
  checkBudget(metric: string, value: number): boolean {
    const threshold = performanceBudget[metric as keyof PerformanceBudget]
    
    if (value > threshold) {
      this.violations.push({
        metric,
        value,
        threshold,
        timestamp: Date.now()
      })
      
      // Alert in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ Performance Budget Violation: ${metric}`, {
          value,
          threshold,
          exceed: value - threshold
        })
      }
      
      return false
    }
    
    return true
  }
  
  getViolations() {
    return this.violations
  }
  
  getViolationsSummary() {
    const summary = this.violations.reduce((acc, violation) => {
      if (!acc[violation.metric]) {
        acc[violation.metric] = {
          count: 0,
          avgExceed: 0,
          maxExceed: 0
        }
      }
      
      const exceed = violation.value - violation.threshold
      acc[violation.metric].count++
      acc[violation.metric].avgExceed += exceed
      acc[violation.metric].maxExceed = Math.max(acc[violation.metric].maxExceed, exceed)
      
      return acc
    }, {} as Record<string, any>)
    
    // Calculate averages
    Object.keys(summary).forEach(metric => {
      summary[metric].avgExceed /= summary[metric].count
    })
    
    return summary
  }
}

export const performanceMonitor = new PerformanceMonitor()
```

### 3.3 Automated Performance Testing

```typescript
// /tests/performance/lighthouse-ci.spec.ts
import { test, expect } from '@playwright/test'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

test.describe('Performance Monitoring', () => {
  test('homepage meets performance budget', async () => {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
    
    const options = {
      logLevel: 'info' as const,
      output: 'json' as const,
      onlyCategories: ['performance'],
      port: chrome.port,
    }
    
    const runnerResult = await lighthouse('http://localhost:3000', options)
    
    if (!runnerResult) {
      throw new Error('Lighthouse failed to run')
    }
    
    const { lhr } = runnerResult
    
    // Performance score should be > 90
    expect(lhr.categories.performance.score).toBeGreaterThan(0.9)
    
    // Core Web Vitals checks
    const lcp = lhr.audits['largest-contentful-paint'].numericValue
    const cls = lhr.audits['cumulative-layout-shift'].numericValue
    const fcp = lhr.audits['first-contentful-paint'].numericValue
    
    expect(lcp).toBeLessThan(2500) // LCP < 2.5s
    expect(cls).toBeLessThan(0.1)  // CLS < 0.1
    expect(fcp).toBeLessThan(1800) // FCP < 1.8s
    
    await chrome.kill()
  })
  
  test('article page performance', async () => {
    // Similar lighthouse test for article pages
    // ... implementation
  })
  
  test('bundle size within budget', async ({ page }) => {
    await page.goto('/')
    
    // Check bundle size via coverage API
    await page.coverage.startJSCoverage()
    await page.waitForLoadState('networkidle')
    const coverage = await page.coverage.stopJSCoverage()
    
    const totalBytes = coverage.reduce((sum, entry) => sum + entry.text.length, 0)
    const totalKB = totalBytes / 1024
    
    expect(totalKB).toBeLessThan(85) // 85KB budget
  })
})
```

## Performance Optimization Timeline

### Day 1: Foundation (4 hours)
- **09:00-10:30**: Next.js 15 optimization setup
- **10:30-12:00**: Image optimization implementation  
- **13:00-14:30**: Liquid glass performance tuning
- **14:30-16:00**: Bundle analysis and code splitting

### Day 2: Core Web Vitals (4 hours)
- **09:00-10:30**: LCP optimization (preloading, above-fold)
- **10:30-12:00**: INP optimization (interaction debouncing)
- **13:00-14:30**: CLS optimization (layout stabilization)
- **14:30-16:00**: Integration testing and validation

### Day 3: Monitoring & Testing (4 hours)
- **09:00-10:30**: Web Vitals monitoring setup
- **10:30-12:00**: Performance budget implementation
- **13:00-14:30**: Automated performance testing
- **14:30-16:00**: Performance optimization review and tuning

## Success Metrics

### Target Achievement
- ✅ **LCP**: < 2.5s (Target: 2.0s average)
- ✅ **INP**: < 200ms (Target: 150ms average)  
- ✅ **CLS**: < 0.1 (Target: 0.05 average)

### Performance Budget Compliance
- ✅ **First Load JS**: < 85KB
- ✅ **Total Bundle**: < 250KB
- ✅ **Image Optimization**: WebP/AVIF support
- ✅ **Lighthouse Score**: > 90

### Monitoring Coverage
- ✅ **Real-time Web Vitals**: All metrics tracked
- ✅ **Performance Budget**: Automated monitoring
- ✅ **Regression Testing**: CI/CD integration
- ✅ **User Experience**: 95th percentile tracking

This roadmap ensures systematic performance optimization while maintaining the rich visual experience of liquid glass effects.