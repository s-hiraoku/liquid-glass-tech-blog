/**
 * ArticleCard Component - Phase 6.2 TDD Implementation
 * GREEN PHASE: Minimal implementation to pass failing tests
 * 
 * Following t-wada's TDD methodology - write just enough code to make tests pass
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, Eye } from 'lucide-react';

// shadcn/ui components
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Types
import type { BlogPost } from '@/types/content';
import type { LiquidGlassVariant } from '@/types/liquid-glass';

// Utilities
import { cn } from '@/lib/utils';
import { useDeviceOptimization } from '@/hooks/useDeviceOptimization';

export interface ArticleCardProps {
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
 * ArticleCard Component - Minimal implementation for GREEN phase
 */
export const ArticleCard: React.FC<ArticleCardProps> = ({
  post,
  variant = 'glass-medium',
  blur = 15,
  opacity = 0.1,
  showAuthor = true,
  showTags = true,
  showReadingTime = true,
  interactive = true,
  seasonalTheme = false,
  className,
  onTagClick,
  onCategoryClick,
  onCardClick,
  loading = false
}) => {
  // Device optimization hook
  const { performanceTier, deviceCapabilities, viewport } = useDeviceOptimization();
  
  // Seasonal theme logic (minimal implementation)
  const seasonalThemeContext = React.useMemo(() => {
    if (!seasonalTheme) return null;
    
    const now = new Date();
    const month = now.getMonth();
    const hour = now.getHours();
    
    let currentSeason: 'spring' | 'summer' | 'autumn' | 'winter' = 'spring';
    if (month >= 2 && month <= 4) currentSeason = 'spring';
    else if (month >= 5 && month <= 7) currentSeason = 'summer';
    else if (month >= 8 && month <= 10) currentSeason = 'autumn';
    else currentSeason = 'winter';
    
    let timeOfDay: 'morning' | 'day' | 'evening' | 'night' = 'morning';
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'day';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    return {
      currentSeason,
      timeOfDay,
      weatherCondition: 'sunny'
    };
  }, [seasonalTheme]);
  
  // Intersection observer for lazy loading
  const [isIntersecting, setIsIntersecting] = React.useState(() => {
    return performanceTier === 'desktop-enhanced' || className?.includes('priority-content');
  });
  const [hasIntersected, setHasIntersected] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (!cardRef.current || hasIntersected || className?.includes('priority-content')) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    observer.observe(cardRef.current);
    
    return () => observer.disconnect();
  }, [hasIntersected, className]);

  // Reduced motion detection
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Adaptive configuration
  const adaptiveConfig = React.useMemo(() => {
    let blurRadius = deviceCapabilities.maxBlurRadius;
    let opacityLevel = deviceCapabilities.transparencyLevel;
    let saturationLevel = deviceCapabilities.saturationLevel;
    
    if (performanceTier === 'fallback-static') {
      blurRadius = 0;
      opacityLevel = 0;
      saturationLevel = 1;
    }
    
    return {
      blurRadius,
      opacityLevel,
      saturationLevel,
      shouldUseGPU: deviceCapabilities.gpuAcceleration && !prefersReducedMotion
    };
  }, [deviceCapabilities, performanceTier, prefersReducedMotion]);

  // Handle interactions
  const handleCardClick = React.useCallback(() => {
    if (onCardClick) {
      onCardClick();
    }
  }, [onCardClick]);

  const handleTagClick = React.useCallback((e: React.MouseEvent, tagSlug: string) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tagSlug);
    }
  }, [onTagClick]);

  const handleCategoryClick = React.useCallback((e: React.MouseEvent, categorySlug: string) => {
    e.stopPropagation();
    if (onCategoryClick) {
      onCategoryClick(categorySlug);
    }
  }, [onCategoryClick]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  // Show placeholder for lazy loading
  if (!isIntersecting && !loading && !className?.includes('priority-content')) {
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
          <div className="text-sm text-muted-foreground">
            Loading...
          </div>
        )}
      </div>
    );
  }

  // Liquid glass container props
  const liquidGlassProps = {
    className: cn(
      "h-full transition-all duration-300 ease-out",
      adaptiveConfig.shouldUseGPU && "transform-gpu will-change-transform",
      prefersReducedMotion && "transition-none",
      className
    ),
    'data-testid': "liquid-glass-card",
    'data-performance-tier': performanceTier,
    'data-viewport': viewport.isMobile ? 'mobile' : viewport.isTablet ? 'tablet' : 'desktop',
    'data-blur-radius': adaptiveConfig.blurRadius.toString(),
    'data-opacity-level': adaptiveConfig.opacityLevel.toString(),
    'data-gpu-acceleration': adaptiveConfig.shouldUseGPU.toString(),
    'data-reduced-motion': prefersReducedMotion.toString(),
    'data-fallback-mode': (performanceTier === 'fallback-static').toString(),
    ...(seasonalTheme && seasonalThemeContext && {
      'data-season': seasonalThemeContext.currentSeason,
      'data-time-of-day': seasonalThemeContext.timeOfDay,
      'data-weather-condition': seasonalThemeContext.weatherCondition,
    })
  };

  return (
    <div ref={cardRef} {...liquidGlassProps}>
      <motion.article
        className={cn(
          "h-full",
          interactive && "cursor-pointer hover:shadow-xl hover:shadow-black/10 transition-shadow duration-200 transform-gpu will-change-transform"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...(interactive && !prefersReducedMotion && {
          whileHover: { scale: 1.02, y: -4 },
          whileTap: { scale: 0.98 }
        })}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="article"
        aria-label={`Blog post: ${post.title}. Published on ${formatDate(post.publishedAt)}${seasonalThemeContext ? `. ${seasonalThemeContext.currentSeason} theme` : ''}`}
        data-testid="motion-article"
        data-reduced-motion={prefersReducedMotion}
      >
        <Card className="h-full flex flex-col bg-card text-card-foreground border-0 bg-transparent shadow-none overflow-hidden backface-visibility-hidden transform-gpu">
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
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight line-clamp-2 hover:text-primary transition-colors">
                {post.title}
              </h3>
            </Link>

            {/* Post Description */}
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mt-2">
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
                  <time dateTime={post.publishedAt.toISOString()} role="time">
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
                      loading="lazy"
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
    </div>
  );
};

export default ArticleCard;