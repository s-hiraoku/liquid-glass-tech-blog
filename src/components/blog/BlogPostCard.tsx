"use client";

/**
 * Blog Post Card Component
 * 
 * A modern blog post card component with liquid-glass effects, shadcn/ui integration,
 * and Motion framework animations. Displays MDX metadata and supports interactive features.
 * 
 * Phase 3.3 Implementation:
 * - Liquid-glass enhanced design using @developer-hub/liquid-glass
 * - Modern UI using shadcn/ui components (Card, Badge, Typography, Button)
 * - MDX metadata display (title, description, tags, publishedAt, author, readingTime, eyeCatch)
 * - Hover effects and click animations using Motion framework
 * - Full accessibility support and keyboard navigation
 * 
 * @module BlogPostCard
 */

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, Eye } from 'lucide-react';

// shadcn/ui components
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Liquid glass components
import { LiquidGlass } from '@/components/liquid-glass/LiquidGlassCard';

// Types
import type { BlogPost } from '@/types/content';
import type { LiquidGlassVariant } from '@/types/liquid-glass';

// Utilities
import { cn } from '@/lib/utils';
import { useDeviceOptimization } from '@/hooks/useDeviceOptimization';

/**
 * Motion configuration presets for different animation styles
 */
const MOTION_PRESETS = {
  subtle: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  smooth: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.4, 
      ease: "easeOut",
      type: "tween"
    }
  },
  spring: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      type: "spring", 
      damping: 20, 
      stiffness: 300,
      mass: 0.8
    }
  }
} as const;

export interface BlogPostCardProps {
  /** The blog post data to display */
  post: BlogPost;
  /** Liquid glass effect variant */
  variant?: LiquidGlassVariant;
  /** Backdrop blur intensity (0-50px) */
  blur?: number;
  /** Background opacity (0-1) */
  opacity?: number;
  /** Whether to show author information */
  showAuthor?: boolean;
  /** Whether to show tags */
  showTags?: boolean;
  /** Whether to show reading time */
  showReadingTime?: boolean;
  /** Whether to enable interactive hover effects */
  interactive?: boolean;
  /** Whether to apply seasonal theme */
  seasonalTheme?: boolean;
  /** Animation preset for motion effects */
  motionPreset?: keyof typeof MOTION_PRESETS;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a tag is clicked */
  onTagClick?: (tagSlug: string) => void;
  /** Callback when category is clicked */
  onCategoryClick?: (categorySlug: string) => void;
  /** Callback when card is clicked */
  onCardClick?: () => void;
  /** Whether card is in loading state */
  loading?: boolean;
}

/**
 * Format date to readable string
 */
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Format reading time
 */
const formatReadingTime = (minutes: number): string => {
  return `${minutes} min read`;
};

/**
 * BlogPostCard Component
 * 
 * Displays a blog post in a beautiful card format with liquid-glass effects.
 * Integrates shadcn/ui components for modern design and Motion framework for animations.
 */
export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  variant = 'glass-medium',
  blur = 15,
  opacity = 0.1,
  showAuthor = true,
  showTags = true,
  showReadingTime = true,
  interactive = true,
  seasonalTheme = false,
  motionPreset = 'smooth',
  className,
  onTagClick,
  onCategoryClick,
  onCardClick,
  loading = false
}) => {
  // Phase 6 Refactor: Enhanced device optimization and seasonal theme integration
  const { performanceTier, deviceCapabilities, viewport } = useDeviceOptimization();
  
  // Enhanced seasonal theme context with proper integration patterns
  const seasonalThemeContext = React.useMemo(() => {
    if (!seasonalTheme) return null;
    
    // Dynamic seasonal context based on current date/time for more realistic behavior
    const now = new Date();
    const month = now.getMonth();
    const hour = now.getHours();
    
    // Determine current season with accurate seasonal boundaries
    let currentSeason: 'spring' | 'summer' | 'autumn' | 'winter' = 'spring';
    if (month >= 2 && month <= 4) currentSeason = 'spring';
    else if (month >= 5 && month <= 7) currentSeason = 'summer';
    else if (month >= 8 && month <= 10) currentSeason = 'autumn';
    else currentSeason = 'winter';
    
    // Determine time of day for dynamic effects
    let timeOfDay: 'morning' | 'day' | 'evening' | 'night' = 'morning';
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'day';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    // Season-specific glass effects with performance optimization
    const seasonalEffects = {
      spring: {
        blurIntensity: Math.min(deviceCapabilities.maxBlurRadius, 15),
        opacityLevel: Math.min(deviceCapabilities.transparencyLevel, 0.12),
        saturation: deviceCapabilities.saturationLevel,
        backgroundGradient: ['#f0fdf4', '#ecfccb'],
        particleEffect: 'sakura'
      },
      summer: {
        blurIntensity: Math.min(deviceCapabilities.maxBlurRadius, 20),
        opacityLevel: Math.min(deviceCapabilities.transparencyLevel, 0.15),
        saturation: Math.min(deviceCapabilities.saturationLevel, 1.3),
        backgroundGradient: ['#fef3c7', '#fde68a'],
        particleEffect: 'sunbeam'
      },
      autumn: {
        blurIntensity: Math.min(deviceCapabilities.maxBlurRadius, 12),
        opacityLevel: Math.min(deviceCapabilities.transparencyLevel, 0.10),
        saturation: Math.min(deviceCapabilities.saturationLevel, 1.1),
        backgroundGradient: ['#fed7aa', '#fdba74'],
        particleEffect: 'leaves'
      },
      winter: {
        blurIntensity: Math.min(deviceCapabilities.maxBlurRadius, 8),
        opacityLevel: Math.min(deviceCapabilities.transparencyLevel, 0.08),
        saturation: Math.max(1, deviceCapabilities.saturationLevel * 0.9),
        backgroundGradient: ['#e0f2fe', '#bae6fd'],
        particleEffect: 'snow'
      }
    };
    
    return {
      currentSeason,
      timeOfDay,
      weatherCondition: 'sunny', // Default - would be fetched from weather API in production
      glassEffect: {
        ...seasonalEffects[currentSeason],
        performanceOptimized: performanceTier !== 'fallback-static'
      },
      isTransitioning: false
    };
  }, [seasonalTheme, deviceCapabilities, performanceTier]);
  
  // Refactor: Enhanced intersection observer with performance optimization
  const [isIntersecting, setIsIntersecting] = React.useState(() => {
    // Start with true for immediate rendering, but allow lazy loading for better performance
    return performanceTier === 'desktop-enhanced';
  });
  const [hasIntersected, setHasIntersected] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const intersectionObserverRef = React.useRef<IntersectionObserver | null>(null);
  
  React.useEffect(() => {
    if (!cardRef.current || typeof window === 'undefined' || hasIntersected) return;
    
    try {
      intersectionObserverRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            setHasIntersected(true);
            intersectionObserverRef.current?.disconnect();
          }
        },
        { 
          threshold: 0.1, 
          rootMargin: performanceTier === 'mobile-optimized' ? '50px' : '100px'
        }
      );
      
      intersectionObserverRef.current.observe(cardRef.current);
    } catch (error) {
      // Fallback for environments without IntersectionObserver support
      setIsIntersecting(true);
      setHasIntersected(true);
    }
    
    return () => {
      intersectionObserverRef.current?.disconnect();
    };
  }, [hasIntersected, performanceTier]);

  // Reduced motion detection
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener?.('change', handler);
      
      return () => mediaQuery.removeEventListener?.('change', handler);
    } catch (error) {
      // Handle test environment or unsupported browsers
      setPrefersReducedMotion(false);
    }
  }, []);

  // Memoized motion configuration
  const selectedMotionConfig = React.useMemo(() => 
    MOTION_PRESETS[motionPreset], 
    [motionPreset]
  );

  // Interactive configuration
  const interactiveConfig = React.useMemo(() => {
    if (!interactive) {
      return {};
    }
    
    return {
      whileHover: { scale: 1.02, y: -4 },
      whileTap: { scale: 0.98 },
      className: cn(
        "cursor-pointer",
        "hover:shadow-xl hover:shadow-black/10", 
        "transition-shadow duration-200",
        "transform-gpu",
        "will-change-transform"
      )
    };
  }, [interactive]);

  // Handle card click
  const handleCardClick = React.useCallback(() => {
    if (onCardClick) {
      onCardClick();
    }
  }, [onCardClick]);

  // Handle tag click
  const handleTagClick = React.useCallback((e: React.MouseEvent, tagSlug: string) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tagSlug);
    }
  }, [onTagClick]);

  // Handle category click
  const handleCategoryClick = React.useCallback((e: React.MouseEvent, categorySlug: string) => {
    e.stopPropagation();
    if (onCategoryClick) {
      onCategoryClick(categorySlug);
    }
  }, [onCategoryClick]);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  // Refactor: Sophisticated adaptive configuration with multiple optimization layers
  const adaptiveConfig = React.useMemo(() => {
    let blurRadius = deviceCapabilities.maxBlurRadius;
    let opacityLevel = deviceCapabilities.transparencyLevel;
    let saturationLevel = deviceCapabilities.saturationLevel;
    
    // Apply seasonal adjustments if enabled
    if (seasonalThemeContext) {
      blurRadius = seasonalThemeContext.glassEffect.blurIntensity;
      opacityLevel = seasonalThemeContext.glassEffect.opacityLevel;
      saturationLevel = seasonalThemeContext.glassEffect.saturation;
    }
    
    // Performance-based adjustments
    if (performanceTier === 'fallback-static') {
      blurRadius = 0;
      opacityLevel = 0;
      saturationLevel = 1;
    } else if (performanceTier === 'mobile-optimized' && prefersReducedMotion) {
      blurRadius = Math.min(blurRadius, 5);
      opacityLevel = Math.min(opacityLevel, 0.05);
    }
    
    return {
      blurRadius,
      opacityLevel,
      saturationLevel,
      shouldUseGPU: deviceCapabilities.gpuAcceleration && !prefersReducedMotion
    };
  }, [
    deviceCapabilities,
    seasonalThemeContext,
    performanceTier,
    prefersReducedMotion
  ]);

  // Refactor: Comprehensive LiquidGlass props with advanced optimization
  const liquidGlassProps = React.useMemo(() => {
    const baseProps = {
      variant,
      className: cn(
        "h-full transition-all duration-300 ease-out",
        adaptiveConfig.shouldUseGPU && "transform-gpu will-change-transform",
        prefersReducedMotion && "transition-none",
        className
      ),
      'data-testid': "liquid-glass",
      'data-performance-tier': performanceTier,
      'data-viewport': viewport.isMobile ? 'mobile' : viewport.isTablet ? 'tablet' : 'desktop',
      'data-blur-radius': adaptiveConfig.blurRadius.toString(),
      'data-opacity-level': adaptiveConfig.opacityLevel.toString(),
      'data-gpu-acceleration': adaptiveConfig.shouldUseGPU.toString(),
      'data-reduced-motion': prefersReducedMotion.toString(),
      'data-fallback-mode': (performanceTier === 'fallback-static').toString()
    };

    if (seasonalTheme && seasonalThemeContext) {
      return {
        ...baseProps,
        'data-season': seasonalThemeContext.currentSeason,
        'data-time-of-day': seasonalThemeContext.timeOfDay,
        'data-weather-condition': seasonalThemeContext.weatherCondition,
        'data-particle-type': seasonalThemeContext.glassEffect.particleEffect,
        'data-transitioning': seasonalThemeContext.isTransitioning.toString(),
        style: {
          '--seasonal-blur': `${adaptiveConfig.blurRadius}px`,
          '--seasonal-opacity': adaptiveConfig.opacityLevel.toString(),
          '--seasonal-saturation': adaptiveConfig.saturationLevel.toString(),
          '--seasonal-bg-start': seasonalThemeContext.glassEffect.backgroundGradient[0],
          '--seasonal-bg-end': seasonalThemeContext.glassEffect.backgroundGradient[1],
          ...(adaptiveConfig.shouldUseGPU && {
            'transform': 'translateZ(0)',
            'backfaceVisibility': 'hidden'
          })
        }
      };
    }

    return baseProps;
  }, [
    variant,
    className,
    adaptiveConfig,
    performanceTier,
    viewport,
    prefersReducedMotion,
    seasonalTheme,
    seasonalThemeContext
  ]);

  // Refactor: Smart rendering with performance optimization and accessibility
  if (!isIntersecting && !loading) {
    return (
      <div 
        ref={cardRef} 
        className={cn(
          "h-64 rounded-lg",
          performanceTier === 'fallback-static' 
            ? "bg-card border" 
            : "bg-muted/50 animate-pulse",
          "flex items-center justify-center"
        )}
        data-testid="liquid-glass-placeholder"
        aria-label={`Loading blog post: ${post.title}`}
        role="status"
      >
        {performanceTier !== 'fallback-static' && (
          <div className="text-sm text-muted-foreground" aria-hidden="true">
            Loading...
          </div>
        )}
      </div>
    );
  }

  return (
    <LiquidGlass
      ref={cardRef}
      {...liquidGlassProps}
    >
      <motion.article
        className={cn(
          "h-full",
          interactiveConfig.className
        )}
        {...selectedMotionConfig}
        {...(interactive && !prefersReducedMotion && {
          whileHover: interactiveConfig.whileHover,
          whileTap: interactiveConfig.whileTap
        })}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="article"
        aria-label={`Blog post: ${post.title}. Published on ${formatDate(post.publishedAt)}${seasonalThemeContext ? `. ${seasonalThemeContext.currentSeason} theme` : ''}`}
        data-testid="motion-article"
        data-reduced-motion={prefersReducedMotion}
      >
        <Card 
          className={cn(
            "h-full flex flex-col bg-card text-card-foreground border-0 bg-transparent shadow-none overflow-hidden",
            "backface-visibility-hidden transform-gpu"
          )}
          data-testid="blog-post-card"
        >
          {/* Eyecatch Image */}
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <Link href={`/posts/${post.slug}`} data-testid="next-link">
              <Image
                src={post.eyecatchImage.url || '/placeholder-image.jpg'}
                alt={post.eyecatchImage.alt || post.title}
                width={post.eyecatchImage.width}
                height={post.eyecatchImage.height}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                placeholder="blur"
                blurDataURL={post.eyecatchImage.blurDataURL}
                loading="lazy"
                decoding="async"
                data-testid="next-image"
              />
            </Link>
            
            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: post.category.color, color: 'white' }}
              onClick={(e) => handleCategoryClick(e, post.category.slug)}
              data-testid="category-badge"
            >
              {post.category.name}
            </Badge>
          </div>

          <CardHeader className="pb-2">
            {/* Post Title */}
            <Link href={`/posts/${post.slug}`} data-testid="next-link">
              <h3 
                className="scroll-m-20 text-2xl font-semibold tracking-tight line-clamp-2 hover:text-primary transition-colors"
                data-testid="post-title"
              >
                {post.title}
              </h3>
            </Link>

            {/* Post Description */}
            <p 
              className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mt-2"
              data-testid="post-description"
            >
              {post.description}
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-between pt-0">
            {/* Tags */}
            {showTags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs inline-flex items-center rounded-full cursor-pointer hover:bg-muted transition-colors"
                    onClick={(e) => handleTagClick(e, tag.slug)}
                    data-testid={`tag-badge-${tag.slug}`}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Metadata Row */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-4">
                {/* Publication Date */}
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <time dateTime={post.publishedAt.toISOString()}>
                    {formatDate(post.publishedAt)}
                  </time>
                </div>

                {/* Reading Time */}
                {showReadingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatReadingTime(post.readingTime)}</span>
                  </div>
                )}

                {/* View Count */}
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.viewCount}</span>
                </div>
              </div>
            </div>

            {/* Author & Read More */}
            <div className="flex items-center justify-between">
              {/* Author */}
              {showAuthor && (
                <div className="flex items-center gap-2">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={`${post.author.name} avatar`}
                      width={24}
                      height={24}
                      className="rounded-full"
                      data-testid="author-avatar"
                    />
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>{post.author.name}</span>
                  </div>
                </div>
              )}

              {/* Read More Button */}
              <Link href={`/posts/${post.slug}`} data-testid="next-link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="inline-flex items-center justify-center text-xs p-2 h-8"
                  data-testid="read-more-button"
                >
                  Read More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.article>
    </LiquidGlass>
  );
};

/**
 * Default export for easier importing
 */
export default BlogPostCard;