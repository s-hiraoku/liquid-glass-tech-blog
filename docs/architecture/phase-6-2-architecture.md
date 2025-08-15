# Phase 6.2 Architecture: Article Pages Implementation

## Overview

**Phase**: 6.2 - 記事一覧・詳細ページ（ライブラリ統合）実装  
**Technology Stack**: Next.js 15, React 19, TypeScript, shadcn/ui, glasscn-ui, @specy/liquid-glass-react  
**Focus**: High-performance article listing and detail pages with liquid glass effects

## Architecture Decisions

### 1. Library Selection Updates

Based on research findings, we've updated our liquid glass library choice:

- **Previous**: `@developer-hub/liquid-glass` (not maintained)
- **New**: `@specy/liquid-glass-react` (actively maintained, better React 19 compatibility)
- **Integration**: Combines seamlessly with shadcn/ui and glasscn-ui components

### 2. Next.js 15 App Router Structure

```
/app/
├── page.tsx                     # Article listing homepage
├── posts/
│   ├── page.tsx                # All posts listing
│   └── [slug]/
│       ├── page.tsx            # Individual article page
│       ├── loading.tsx         # Loading UI with liquid glass effects
│       └── not-found.tsx       # 404 page with liquid glass design
├── categories/
│   └── [category]/
│       └── page.tsx            # Category-specific listings
├── tags/
│   └── [tag]/
│       └── page.tsx            # Tag-specific listings
└── globals.css                 # Liquid glass theme integration
```

### 3. Component Architecture

#### Core Components Hierarchy

```
components/
├── ui/                         # shadcn/ui base components
│   ├── card.tsx               # Base Card (enhanced with liquid glass)
│   ├── badge.tsx              # Enhanced Badge component
│   ├── button.tsx             # Liquid glass enhanced buttons
│   └── skeleton.tsx           # Loading skeletons with glass effects
├── article/
│   ├── ArticleCard.tsx        # Liquid glass enhanced article cards
│   ├── ArticleGrid.tsx        # Responsive grid layout
│   ├── ArticleHero.tsx        # Featured article hero section
│   └── ArticleContent.tsx     # MDX content renderer
├── layout/
│   ├── Header.tsx             # Site navigation with glass effects
│   ├── Footer.tsx             # Site footer
│   └── Navigation.tsx         # Mobile/desktop navigation
└── effects/
    ├── LiquidGlassWrapper.tsx # Glass effects container
    ├── ParticleSystem.tsx     # Seasonal particle effects
    └── GlassCard.tsx          # Enhanced glass card component
```

## File Structure Implementation

### 1. App Router Pages Structure

```typescript
// /app/page.tsx - Homepage with featured articles
import { ArticleGrid } from '@/components/article/ArticleGrid'
import { ArticleHero } from '@/components/article/ArticleHero'
import { LiquidGlassWrapper } from '@/components/effects/LiquidGlassWrapper'

export default async function HomePage() {
  const featuredArticles = await getFeaturedArticles()
  const latestArticles = await getLatestArticles()
  
  return (
    <LiquidGlassWrapper>
      <ArticleHero article={featuredArticles[0]} />
      <ArticleGrid articles={latestArticles} />
    </LiquidGlassWrapper>
  )
}
```

```typescript
// /app/posts/[slug]/page.tsx - Individual article page
import { ArticleContent } from '@/components/article/ArticleContent'
import { LiquidGlassWrapper } from '@/components/effects/LiquidGlassWrapper'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params // Next.js 15 Promise-based params
  const article = await getArticleBySlug(slug)
  
  return (
    <LiquidGlassWrapper>
      <ArticleContent article={article} />
    </LiquidGlassWrapper>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.eyecatch?.src || '/default-og.jpg'],
    },
  }
}
```

### 2. ArticleCard Component Architecture

```typescript
// /components/article/ArticleCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LiquidGlass } from '@specy/liquid-glass-react'
import { motion } from 'framer-motion'

interface ArticleCardProps {
  article: {
    slug: string
    title: string
    excerpt: string
    publishedAt: string
    tags: string[]
    eyecatch?: {
      src: string
      alt: string
    }
  }
  variant?: 'default' | 'featured' | 'compact'
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <LiquidGlass
        blur={8}
        opacity={0.15}
        saturation={1.2}
        interactive
      >
        <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300">
          {article.eyecatch && (
            <div className="relative overflow-hidden">
              <Image
                src={article.eyecatch.src}
                alt={article.eyecatch.alt}
                width={400}
                height={200}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          <CardHeader>
            <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </CardHeader>
          
          <CardContent>
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {article.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <div className="flex items-center justify-between w-full">
              <time className="text-sm text-muted-foreground">
                {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
              </time>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/posts/${article.slug}`}>
                  読む
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </LiquidGlass>
    </motion.div>
  )
}
```

### 3. ArticleGrid Component with Performance Optimization

```typescript
// /components/article/ArticleGrid.tsx
import { ArticleCard } from './ArticleCard'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface ArticleGridProps {
  articles: Article[]
  className?: string
}

export function ArticleGrid({ articles, className }: ArticleGridProps) {
  return (
    <div className={cn(
      "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 
      className
    )}>
      {articles.map((article) => (
        <Suspense 
          key={article.slug} 
          fallback={<ArticleCardSkeleton />}
        >
          <ArticleCard article={article} />
        </Suspense>
      ))}
    </div>
  )
}

function ArticleCardSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}
```

## Data Flow Architecture

### 1. Data Fetching Strategy

```typescript
// /lib/articles.ts - Article data layer
export async function getArticles(options?: {
  limit?: number
  category?: string
  tag?: string
  page?: number
}): Promise<Article[]> {
  // Implementation with ISR caching
  return articles
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // Individual article fetching with revalidation
  return article
}

export async function getFeaturedArticles(): Promise<Article[]> {
  // Featured articles with longer cache
  return featuredArticles
}
```

### 2. ISR Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true, // Partial Pre-rendering
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
```

## Performance Strategy

### 1. Core Web Vitals Optimization

```typescript
// Performance monitoring integration
export function WebVitalsReporter() {
  useEffect(() => {
    import('web-vitals').then(({ onCLS, onLCP, onINP }) => {
      onLCP((metric) => {
        // LCP target: <2.5s
        console.log('LCP:', metric)
      })
      onINP((metric) => {
        // INP target: <200ms
        console.log('INP:', metric)
      })
      onCLS((metric) => {
        // CLS target: <0.1
        console.log('CLS:', metric)
      })
    })
  }, [])

  return null
}
```

### 2. Image Optimization Strategy

```typescript
// /components/ui/OptimizedImage.tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className 
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
      className={cn("transition-all duration-300", className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### 3. Bundle Optimization

```typescript
// Dynamic imports for liquid glass effects
const LiquidGlass = dynamic(
  () => import('@specy/liquid-glass-react').then(mod => mod.LiquidGlass),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 rounded" />
  }
)

const ParticleSystem = dynamic(
  () => import('@/components/effects/ParticleSystem'),
  { ssr: false }
)
```

## SEO Implementation

### 1. Structured Data

```typescript
// /lib/seo/structured-data.ts
export function generateArticleStructuredData(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.eyecatch?.src,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: 'Author Name',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Liquid Glass Tech Blog',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
  }
}
```

### 2. Dynamic Sitemap

```typescript
// /app/sitemap.xml/route.ts
export async function GET() {
  const articles = await getArticles()
  
  const articleUrls = articles.map((article) => ({
    url: `https://yourdomain.com/posts/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const sitemap = [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...articleUrls,
  ]

  return new Response(
    generateSitemapXML(sitemap),
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    }
  )
}
```

## Accessibility Strategy

### 1. WCAG 2.1 AA Compliance

```typescript
// Accessibility enhancements in ArticleCard
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article
      role="article"
      aria-labelledby={`article-title-${article.slug}`}
      aria-describedby={`article-excerpt-${article.slug}`}
    >
      <LiquidGlass
        reduceMotion={true} // Respects prefers-reduced-motion
        aria-hidden="true" // Glass effects are decorative
      >
        <Card>
          <CardHeader>
            <h3 
              id={`article-title-${article.slug}`}
              className="text-xl font-semibold"
            >
              {article.title}
            </h3>
          </CardHeader>
          
          <CardContent>
            <p 
              id={`article-excerpt-${article.slug}`}
              className="text-muted-foreground"
            >
              {article.excerpt}
            </p>
          </CardContent>
          
          <CardFooter>
            <Button 
              asChild
              aria-label={`記事「${article.title}」を読む`}
            >
              <Link href={`/posts/${article.slug}`}>
                読む
                <span className="sr-only">: {article.title}</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </LiquidGlass>
    </article>
  )
}
```

### 2. Motion Preferences

```typescript
// /hooks/useReducedMotion.ts
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}
```

## Testing Strategy

### 1. Component Testing Structure

```typescript
// /components/article/__tests__/ArticleCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ArticleCard } from '../ArticleCard'

const mockArticle = {
  slug: 'test-article',
  title: 'Test Article Title',
  excerpt: 'Test article excerpt',
  publishedAt: '2025-01-01',
  tags: ['React', 'TypeScript'],
  eyecatch: {
    src: '/test-image.jpg',
    alt: 'Test image',
  },
}

describe('ArticleCard', () => {
  it('renders article information correctly', () => {
    render(<ArticleCard article={mockArticle} />)
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.getByText('Test article excerpt')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<ArticleCard article={mockArticle} />)
    
    const article = screen.getByRole('article')
    expect(article).toHaveAttribute('aria-labelledby', 'article-title-test-article')
    expect(article).toHaveAttribute('aria-describedby', 'article-excerpt-test-article')
  })

  it('respects reduced motion preferences', () => {
    // Mock prefers-reduced-motion
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

    render(<ArticleCard article={mockArticle} />)
    // Verify liquid glass effects are disabled
  })
})
```

### 2. E2E Testing with Playwright

```typescript
// /tests/e2e/article-pages.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Article Pages', () => {
  test('homepage loads and displays articles', async ({ page }) => {
    await page.goto('/')
    
    // Check for article cards
    await expect(page.locator('[role="article"]')).toHaveCount(6)
    
    // Check liquid glass effects are loaded
    await expect(page.locator('.liquid-glass-wrapper')).toBeVisible()
    
    // Performance checks
    const navigation = await page.evaluate(() => {
      return performance.getEntriesByType('navigation')[0]
    })
    expect(navigation.loadEventEnd - navigation.fetchStart).toBeLessThan(2500) // LCP < 2.5s
  })

  test('article detail page navigation works', async ({ page }) => {
    await page.goto('/')
    
    // Click first article
    await page.locator('[role="article"] a').first().click()
    
    // Check we're on article page
    await expect(page).toHaveURL(/\/posts\/.*/)
    
    // Check article content is loaded
    await expect(page.locator('article')).toBeVisible()
    
    // Check accessibility
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('main')).toHaveAttribute('role', 'main')
  })

  test('responsive design works correctly', async ({ page }) => {
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check mobile layout
    await expect(page.locator('.grid')).toHaveClass(/grid-cols-1/)
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    
    // Check tablet layout
    await expect(page.locator('.grid')).toHaveClass(/md:grid-cols-2/)
    
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.reload()
    
    // Check desktop layout
    await expect(page.locator('.grid')).toHaveClass(/lg:grid-cols-3/)
  })
})
```

## Integration Points

### 1. Liquid Glass Library Integration

```typescript
// /components/effects/LiquidGlassWrapper.tsx
import { LiquidGlass } from '@specy/liquid-glass-react'
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface LiquidGlassWrapperProps {
  children: React.ReactNode
  variant?: 'subtle' | 'medium' | 'intense'
}

export function LiquidGlassWrapper({ 
  children, 
  variant = 'medium' 
}: LiquidGlassWrapperProps) {
  const { currentTheme } = useSeasonalTheme()
  const prefersReducedMotion = useReducedMotion()

  const glassSettings = {
    blur: variant === 'subtle' ? 4 : variant === 'medium' ? 8 : 12,
    opacity: variant === 'subtle' ? 0.1 : variant === 'medium' ? 0.15 : 0.2,
    saturation: currentTheme.saturation,
    interactive: !prefersReducedMotion,
    reduceMotion: prefersReducedMotion,
  }

  return (
    <LiquidGlass {...glassSettings}>
      {children}
    </LiquidGlass>
  )
}
```

### 2. Theme Integration

```typescript
// /lib/theme/seasonal-theme.ts
export const seasonalThemes = {
  spring: {
    colors: ['#E8F5E8', '#F0FFF0', '#F5FFFA'],
    saturation: 1.1,
    blur: 6,
    particles: 'sakura',
  },
  summer: {
    colors: ['#E0F6FF', '#E6FFFA', '#F0FFFF'],
    saturation: 1.3,
    blur: 8,
    particles: 'bubbles',
  },
  autumn: {
    colors: ['#FFF8DC', '#FFEFD5', '#FFE4B5'],
    saturation: 1.2,
    blur: 7,
    particles: 'leaves',
  },
  winter: {
    colors: ['#F8F8FF', '#F5F5F5', '#FFFAFA'],
    saturation: 0.9,
    blur: 10,
    particles: 'snow',
  },
}
```

This architecture provides a solid foundation for Phase 6.2 implementation, focusing on performance, accessibility, and seamless integration of liquid glass effects with modern React/Next.js patterns.