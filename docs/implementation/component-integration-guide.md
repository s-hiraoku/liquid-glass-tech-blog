# Component Integration Guide: Liquid Glass + shadcn/ui + glasscn-ui

## Integration Strategy Overview

This guide provides detailed implementation patterns for integrating @specy/liquid-glass-react with shadcn/ui and glasscn-ui components, ensuring optimal performance, accessibility, and visual consistency.

## Core Integration Patterns

### 1. Enhanced Base Components

#### shadcn/ui Card Enhancement
```typescript
// /components/ui/enhanced-card.tsx
import * as React from 'react'
import { Card, CardProps } from '@/components/ui/card'
import { LiquidGlass } from '@specy/liquid-glass-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface EnhancedCardProps extends CardProps {
  glassEffect?: {
    blur?: number
    opacity?: number
    saturation?: number
    interactive?: boolean
  }
  variant?: 'default' | 'glass' | 'subtle'
}

const EnhancedCard = React.forwardRef<
  HTMLDivElement,
  EnhancedCardProps
>(({ className, glassEffect, variant = 'default', children, ...props }, ref) => {
  const prefersReducedMotion = useReducedMotion()
  
  // Glass effect configuration based on variant
  const glassConfig = {
    default: { blur: 0, opacity: 0, saturation: 1, interactive: false },
    glass: { blur: 8, opacity: 0.15, saturation: 1.2, interactive: true },
    subtle: { blur: 4, opacity: 0.08, saturation: 1.1, interactive: true },
    ...glassEffect
  }

  const effectConfig = variant !== 'default' ? glassConfig : null

  if (!effectConfig || prefersReducedMotion) {
    return (
      <Card
        ref={ref}
        className={cn(
          variant === 'glass' && 'bg-background/80 backdrop-blur-sm border-border/50',
          variant === 'subtle' && 'bg-background/90 backdrop-blur-sm',
          className
        )}
        {...props}
      >
        {children}
      </Card>
    )
  }

  return (
    <LiquidGlass
      blur={effectConfig.blur}
      opacity={effectConfig.opacity}
      saturation={effectConfig.saturation}
      interactive={effectConfig.interactive && !prefersReducedMotion}
    >
      <Card
        ref={ref}
        className={cn(
          'transition-all duration-300',
          variant === 'glass' && 'hover:shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </LiquidGlass>
  )
})

EnhancedCard.displayName = 'EnhancedCard'

export { EnhancedCard, type EnhancedCardProps }
```

#### Enhanced Button Component
```typescript
// /components/ui/enhanced-button.tsx
import * as React from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { LiquidGlass } from '@specy/liquid-glass-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface EnhancedButtonProps extends ButtonProps {
  glassEffect?: boolean
  glassIntensity?: 'subtle' | 'medium' | 'intense'
}

const EnhancedButton = React.forwardRef<
  HTMLButtonElement,
  EnhancedButtonProps
>(({ 
  className, 
  glassEffect = false, 
  glassIntensity = 'medium',
  children, 
  ...props 
}, ref) => {
  const prefersReducedMotion = useReducedMotion()

  const glassConfig = {
    subtle: { blur: 2, opacity: 0.05, saturation: 1.05 },
    medium: { blur: 4, opacity: 0.1, saturation: 1.1 },
    intense: { blur: 6, opacity: 0.15, saturation: 1.2 }
  }

  if (!glassEffect || prefersReducedMotion) {
    return (
      <Button
        ref={ref}
        className={cn(
          glassEffect && 'bg-primary/90 backdrop-blur-sm hover:bg-primary',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }

  return (
    <LiquidGlass
      {...glassConfig[glassIntensity]}
      interactive={true}
    >
      <Button
        ref={ref}
        className={cn(
          'transition-all duration-300 hover:scale-105',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </LiquidGlass>
  )
})

EnhancedButton.displayName = 'EnhancedButton'

export { EnhancedButton, type EnhancedButtonProps }
```

### 2. Article-Specific Components

#### ArticleCard with Integrated Effects
```typescript
// /components/article/ArticleCard.tsx
import React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Badge } from '@/components/ui/badge'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { OptimizedImage } from '@/components/ui/optimized-image'
import Link from 'next/link'

interface ArticleCardProps {
  article: {
    slug: string
    title: string
    excerpt: string
    publishedAt: string
    readingTime: string
    tags: string[]
    eyecatch?: {
      src: string
      alt: string
      blurDataURL?: string
    }
    category: string
  }
  variant?: 'default' | 'featured' | 'compact'
  priority?: boolean
}

export function ArticleCard({ 
  article, 
  variant = 'default',
  priority = false 
}: ArticleCardProps) {
  const prefersReducedMotion = useReducedMotion()

  // Animation variants for framer-motion
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      y: -4,
      transition: { duration: 0.2 }
    }
  }

  const MotionWrapper = prefersReducedMotion ? React.Fragment : motion.div

  const motionProps = prefersReducedMotion ? {} : {
    variants: cardVariants,
    initial: "initial",
    animate: "animate",
    whileHover: "hover",
    layout: true
  }

  return (
    <article
      role="article"
      aria-labelledby={`article-title-${article.slug}`}
      aria-describedby={`article-excerpt-${article.slug}`}
      className="group h-full"
    >
      <MotionWrapper {...motionProps}>
        <EnhancedCard 
          variant={variant === 'featured' ? 'glass' : 'subtle'}
          className={cn(
            'h-full overflow-hidden cursor-pointer',
            'hover:shadow-xl transition-shadow duration-300',
            variant === 'featured' && 'border-primary/20',
            variant === 'compact' && 'max-w-sm'
          )}
        >
          {article.eyecatch && (
            <div className="relative overflow-hidden">
              <OptimizedImage
                src={article.eyecatch.src}
                alt={article.eyecatch.alt}
                width={variant === 'featured' ? 800 : 400}
                height={variant === 'featured' ? 400 : 200}
                priority={priority}
                className={cn(
                  'w-full object-cover transition-transform duration-300',
                  'group-hover:scale-105',
                  variant === 'featured' ? 'h-64' : 'h-48',
                  variant === 'compact' && 'h-32'
                )}
                blurDataURL={article.eyecatch.blurDataURL}
              />
              
              {/* Category badge overlay */}
              <div className="absolute top-3 left-3">
                <Badge 
                  variant="secondary" 
                  className="bg-background/80 backdrop-blur-sm"
                >
                  {article.category}
                </Badge>
              </div>
            </div>
          )}
          
          <CardHeader className={variant === 'compact' ? 'pb-2' : undefined}>
            <h3 
              id={`article-title-${article.slug}`}
              className={cn(
                'font-semibold line-clamp-2 group-hover:text-primary transition-colors',
                variant === 'featured' ? 'text-2xl' : 'text-xl',
                variant === 'compact' && 'text-lg'
              )}
            >
              {article.title}
            </h3>
          </CardHeader>
          
          <CardContent className={variant === 'compact' ? 'pt-0 pb-2' : 'pt-0'}>
            <p 
              id={`article-excerpt-${article.slug}`}
              className={cn(
                'text-muted-foreground mb-4',
                variant === 'compact' ? 'line-clamp-2 text-sm' : 'line-clamp-3'
              )}
            >
              {article.excerpt}
            </p>
            
            {/* Article metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{article.readingTime}</span>
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, variant === 'compact' ? 2 : 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs hover:bg-primary/10 transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
              {article.tags.length > (variant === 'compact' ? 2 : 3) && (
                <Badge variant="outline" className="text-xs">
                  +{article.tags.length - (variant === 'compact' ? 2 : 3)}
                </Badge>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex-1" />
              <EnhancedButton 
                variant="ghost" 
                size="sm" 
                glassEffect={true}
                glassIntensity="subtle"
                asChild
              >
                <Link 
                  href={`/posts/${article.slug}`}
                  aria-label={`記事「${article.title}」を読む`}
                  className="group/button"
                >
                  続きを読む
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                  <span className="sr-only">: {article.title}</span>
                </Link>
              </EnhancedButton>
            </div>
          </CardFooter>
        </EnhancedCard>
      </MotionWrapper>
    </article>
  )
}
```

#### ArticleGrid with Responsive Layout
```typescript
// /components/article/ArticleGrid.tsx
import React, { Suspense } from 'react'
import { ArticleCard } from './ArticleCard'
import { ArticleCardSkeleton } from './ArticleCardSkeleton'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface ArticleGridProps {
  articles: Article[]
  variant?: 'default' | 'featured-first' | 'compact'
  className?: string
  showLoadMore?: boolean
  onLoadMore?: () => void
}

export function ArticleGrid({ 
  articles, 
  variant = 'default',
  className,
  showLoadMore = false,
  onLoadMore
}: ArticleGridProps) {
  const prefersReducedMotion = useReducedMotion()

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  const MotionContainer = prefersReducedMotion ? 'div' : motion.div

  const containerProps = prefersReducedMotion ? {} : {
    variants: containerVariants,
    initial: "hidden",
    animate: "visible"
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground">
          記事がありません
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          新しい記事が投稿されるまでお待ちください
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <MotionContainer 
        className={cn(
          'grid gap-6',
          // Grid layout based on variant
          variant === 'compact' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          // Featured first layout
          variant === 'featured-first' && 
            '[&>*:first-child]:md:col-span-2 [&>*:first-child]:lg:col-span-2',
          className
        )}
        {...containerProps}
      >
        {articles.map((article, index) => {
          const isFeatured = variant === 'featured-first' && index === 0
          const ItemWrapper = prefersReducedMotion ? React.Fragment : motion.div
          const itemProps = prefersReducedMotion ? {} : { variants: itemVariants }

          return (
            <ItemWrapper key={article.slug} {...itemProps}>
              <Suspense fallback={<ArticleCardSkeleton variant={isFeatured ? 'featured' : 'default'} />}>
                <ArticleCard 
                  article={article}
                  variant={isFeatured ? 'featured' : variant}
                  priority={index < 3} // Prioritize first 3 images
                />
              </Suspense>
            </ItemWrapper>
          )
        })}
      </MotionContainer>

      {/* Load more section */}
      {showLoadMore && onLoadMore && (
        <div className="text-center pt-8">
          <EnhancedButton 
            onClick={onLoadMore}
            glassEffect={true}
            glassIntensity="medium"
            size="lg"
            className="min-w-[200px]"
          >
            さらに記事を読み込む
          </EnhancedButton>
        </div>
      )}
    </div>
  )
}
```

### 3. Loading States with Glass Effects

#### ArticleCardSkeleton
```typescript
// /components/article/ArticleCardSkeleton.tsx
import React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ArticleCardSkeletonProps {
  variant?: 'default' | 'featured' | 'compact'
}

export function ArticleCardSkeleton({ variant = 'default' }: ArticleCardSkeletonProps) {
  return (
    <EnhancedCard 
      variant="subtle"
      className={cn(
        'h-full overflow-hidden',
        variant === 'compact' && 'max-w-sm'
      )}
    >
      {/* Image skeleton */}
      <Skeleton 
        className={cn(
          'w-full',
          variant === 'featured' ? 'h-64' : 'h-48',
          variant === 'compact' && 'h-32'
        )}
      />
      
      <CardHeader className={variant === 'compact' ? 'pb-2' : undefined}>
        {/* Title skeleton */}
        <Skeleton 
          className={cn(
            'w-4/5',
            variant === 'featured' ? 'h-8' : 'h-6',
            variant === 'compact' && 'h-5'
          )}
        />
        <Skeleton 
          className={cn(
            'w-3/5',
            variant === 'featured' ? 'h-8' : 'h-6',
            variant === 'compact' && 'h-5'
          )}
        />
      </CardHeader>
      
      <CardContent className={variant === 'compact' ? 'pt-0 pb-2' : 'pt-0'}>
        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Metadata skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardFooter>
    </EnhancedCard>
  )
}
```

### 4. Global Liquid Glass Context

#### LiquidGlassProvider
```typescript
// /components/providers/LiquidGlassProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme'

interface LiquidGlassConfig {
  globalEnabled: boolean
  performanceMode: 'auto' | 'high' | 'low'
  qualityLevel: 'low' | 'medium' | 'high'
  seasonalEffects: boolean
}

interface LiquidGlassContextType {
  config: LiquidGlassConfig
  updateConfig: (updates: Partial<LiquidGlassConfig>) => void
  isEffectEnabled: (intensity?: 'low' | 'medium' | 'high') => boolean
  getEffectConfig: (baseConfig: any) => any
}

const LiquidGlassContext = createContext<LiquidGlassContextType | undefined>(undefined)

export function useLiquidGlass() {
  const context = useContext(LiquidGlassContext)
  if (!context) {
    throw new Error('useLiquidGlass must be used within LiquidGlassProvider')
  }
  return context
}

interface LiquidGlassProviderProps {
  children: React.ReactNode
}

export function LiquidGlassProvider({ children }: LiquidGlassProviderProps) {
  const prefersReducedMotion = useReducedMotion()
  const { currentTheme } = useSeasonalTheme()
  
  const [config, setConfig] = useState<LiquidGlassConfig>({
    globalEnabled: true,
    performanceMode: 'auto',
    qualityLevel: 'medium',
    seasonalEffects: true
  })

  // Auto-detect performance mode
  useEffect(() => {
    if (config.performanceMode === 'auto') {
      const detectPerformance = () => {
        // Check device capabilities
        const hasGoodGPU = 'OffscreenCanvas' in window
        const hasGoodCPU = navigator.hardwareConcurrency >= 4
        const isLowBandwidth = 'connection' in navigator && 
          (navigator as any).connection?.effectiveType === 'slow-2g'

        if (isLowBandwidth || (!hasGoodGPU && !hasGoodCPU)) {
          setConfig(prev => ({ ...prev, qualityLevel: 'low' }))
        } else if (hasGoodGPU && hasGoodCPU) {
          setConfig(prev => ({ ...prev, qualityLevel: 'high' }))
        }
      }

      detectPerformance()
    }
  }, [config.performanceMode])

  const updateConfig = (updates: Partial<LiquidGlassConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const isEffectEnabled = (intensity: 'low' | 'medium' | 'high' = 'medium') => {
    if (!config.globalEnabled || prefersReducedMotion) return false
    
    // Disable high-intensity effects on low-performance devices
    if (config.qualityLevel === 'low' && intensity === 'high') return false
    
    return true
  }

  const getEffectConfig = (baseConfig: any) => {
    if (!isEffectEnabled()) return null

    const qualityMultipliers = {
      low: { blur: 0.5, opacity: 0.5, saturation: 0.8 },
      medium: { blur: 1, opacity: 1, saturation: 1 },
      high: { blur: 1.5, opacity: 1.2, saturation: 1.3 }
    }

    const multiplier = qualityMultipliers[config.qualityLevel]
    
    const enhancedConfig = {
      ...baseConfig,
      blur: Math.round((baseConfig.blur || 0) * multiplier.blur),
      opacity: (baseConfig.opacity || 0) * multiplier.opacity,
      saturation: (baseConfig.saturation || 1) * multiplier.saturation
    }

    // Apply seasonal theme if enabled
    if (config.seasonalEffects && currentTheme) {
      enhancedConfig.saturation *= currentTheme.saturation || 1
      enhancedConfig.hue = currentTheme.hue || 0
    }

    return enhancedConfig
  }

  return (
    <LiquidGlassContext.Provider value={{
      config,
      updateConfig,
      isEffectEnabled,
      getEffectConfig
    }}>
      {children}
    </LiquidGlassContext.Provider>
  )
}
```

### 5. Performance Optimization Patterns

#### Lazy Loading for Glass Effects
```typescript
// /components/effects/LazyLiquidGlass.tsx
import React, { Suspense, lazy } from 'react'
import { useLiquidGlass } from '@/components/providers/LiquidGlassProvider'

// Lazy load the actual liquid glass component
const LiquidGlass = lazy(() => 
  import('@specy/liquid-glass-react').then(module => ({
    default: module.LiquidGlass
  }))
)

interface LazyLiquidGlassProps {
  children: React.ReactNode
  blur?: number
  opacity?: number
  saturation?: number
  interactive?: boolean
  fallback?: React.ReactNode
}

export function LazyLiquidGlass({ 
  children, 
  fallback,
  ...glassProps 
}: LazyLiquidGlassProps) {
  const { isEffectEnabled, getEffectConfig } = useLiquidGlass()
  
  const effectConfig = getEffectConfig(glassProps)
  
  if (!isEffectEnabled() || !effectConfig) {
    return <>{children}</>
  }

  return (
    <Suspense fallback={fallback || children}>
      <LiquidGlass {...effectConfig}>
        {children}
      </LiquidGlass>
    </Suspense>
  )
}
```

#### Progressive Enhancement Component
```typescript
// /components/effects/ProgressiveGlassCard.tsx
import React, { useState, useEffect } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { LazyLiquidGlass } from './LazyLiquidGlass'
import { useLiquidGlass } from '@/components/providers/LiquidGlassProvider'

interface ProgressiveGlassCardProps {
  children: React.ReactNode
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function ProgressiveGlassCard({ 
  children, 
  className,
  intensity = 'medium'
}: ProgressiveGlassCardProps) {
  const { isEffectEnabled } = useLiquidGlass()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Server-side render fallback
  if (!isClient) {
    return (
      <EnhancedCard variant="default" className={className}>
        {children}
      </EnhancedCard>
    )
  }

  // Client-side progressive enhancement
  if (isEffectEnabled(intensity)) {
    const glassConfig = {
      low: { blur: 4, opacity: 0.08, saturation: 1.05 },
      medium: { blur: 8, opacity: 0.15, saturation: 1.15 },
      high: { blur: 12, opacity: 0.25, saturation: 1.3 }
    }

    return (
      <LazyLiquidGlass 
        {...glassConfig[intensity]}
        interactive={true}
        fallback={
          <EnhancedCard variant="default" className={className}>
            {children}
          </EnhancedCard>
        }
      >
        <EnhancedCard variant="default" className={className}>
          {children}
        </EnhancedCard>
      </LazyLiquidGlass>
    )
  }

  return (
    <EnhancedCard variant="subtle" className={className}>
      {children}
    </EnhancedCard>
  )
}
```

## Testing Integration Patterns

### Component Testing with Glass Effects
```typescript
// /components/article/__tests__/ArticleCard.integration.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ArticleCard } from '../ArticleCard'
import { LiquidGlassProvider } from '@/components/providers/LiquidGlassProvider'

// Mock liquid glass library
jest.mock('@specy/liquid-glass-react', () => ({
  LiquidGlass: ({ children, ...props }: any) => (
    <div data-testid="liquid-glass" {...props}>
      {children}
    </div>
  )
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LiquidGlassProvider>
    {children}
  </LiquidGlassProvider>
)

describe('ArticleCard Integration', () => {
  const mockArticle = {
    slug: 'test-article',
    title: 'Test Article',
    excerpt: 'Test excerpt',
    publishedAt: '2025-01-01',
    readingTime: '5 min read',
    tags: ['React', 'TypeScript'],
    category: 'Technology',
    eyecatch: {
      src: '/test.jpg',
      alt: 'Test image'
    }
  }

  it('renders with liquid glass effects when enabled', () => {
    render(
      <TestWrapper>
        <ArticleCard article={mockArticle} />
      </TestWrapper>
    )

    expect(screen.getByTestId('liquid-glass')).toBeInTheDocument()
  })

  it('gracefully degrades when effects are disabled', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    render(
      <TestWrapper>
        <ArticleCard article={mockArticle} />
      </TestWrapper>
    )

    expect(screen.queryByTestId('liquid-glass')).not.toBeInTheDocument()
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
```

This integration guide provides a comprehensive approach to combining liquid glass effects with shadcn/ui components while maintaining performance, accessibility, and user preferences.