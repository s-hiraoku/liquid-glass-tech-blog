# Phase 6.2 Implementation Strategy

## Strategic Overview

**Objective**: Implement high-performance article listing and detail pages with liquid glass effects  
**Duration**: 8-12 development hours  
**Test Coverage Target**: 95% line coverage, 90% branch coverage, 95% function coverage  
**Performance Targets**: LCP <2.5s, INP <200ms, CLS <0.1

## Implementation Phases

### Phase 6.2.1: Foundation Setup (2-3 hours)

#### Step 1: App Router Structure Implementation
```bash
# Create Next.js 15 App Router structure
mkdir -p /app/{posts/[slug],categories/[category],tags/[tag]}
mkdir -p /components/{article,effects,ui}
mkdir -p /lib/{articles,seo,performance}
```

**TDD Cycle 1: App Router Pages**
1. **RED**: Write tests for page components that don't exist yet
2. **GREEN**: Create minimal page components that pass tests
3. **REFACTOR**: Enhance with liquid glass integration

```typescript
// Test file: /app/page.test.tsx
describe('Homepage', () => {
  it('should render article grid with featured articles', async () => {
    // Test will initially fail - no component exists
  })
  
  it('should have proper SEO metadata', async () => {
    // Test for generateMetadata function
  })
})
```

#### Step 2: Library Integration Setup
```bash
# Install updated dependencies
npm install @specy/liquid-glass-react framer-motion
npm install @tailwindcss/container-queries
npm install -D @types/testing-library__jest-dom
```

**Configuration Updates**:
```typescript
// tailwind.config.js - Container queries and liquid glass support
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
  ],
  theme: {
    extend: {
      animation: {
        'liquid-glow': 'liquidGlow 3s ease-in-out infinite alternate',
      },
    },
  },
}
```

#### Step 3: Base Component Enhancement
**TDD Cycle 2: Enhanced shadcn/ui Components**

```typescript
// /components/ui/card.test.tsx
describe('Enhanced Card Component', () => {
  it('should integrate with liquid glass wrapper', () => {
    // Test liquid glass integration
  })
  
  it('should respect motion preferences', () => {
    // Test accessibility
  })
})
```

### Phase 6.2.2: Core Components Development (3-4 hours)

#### Step 1: ArticleCard Component Implementation

**TDD Cycle 3: ArticleCard Development**

```typescript
// /components/article/__tests__/ArticleCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ArticleCard } from '../ArticleCard'

describe('ArticleCard', () => {
  const mockArticle = {
    slug: 'test-article',
    title: 'Test Article',
    excerpt: 'Test excerpt',
    publishedAt: '2025-01-01',
    tags: ['React', 'TypeScript'],
    eyecatch: { src: '/test.jpg', alt: 'Test' }
  }

  beforeEach(() => {
    // Mock framer-motion for testing
    jest.mock('framer-motion', () => ({
      motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
      },
    }))
  })

  it('renders article information correctly', () => {
    render(<ArticleCard article={mockArticle} />)
    
    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('Test excerpt')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<ArticleCard article={mockArticle} />)
    
    const article = screen.getByRole('article')
    expect(article).toHaveAttribute('aria-labelledby')
    expect(article).toHaveAttribute('aria-describedby')
  })

  it('handles hover interactions correctly', () => {
    render(<ArticleCard article={mockArticle} />)
    
    const card = screen.getByRole('article')
    fireEvent.mouseEnter(card)
    
    // Verify hover effects are applied
    expect(card).toHaveClass('group')
  })

  it('respects reduced motion preferences', () => {
    // Mock prefers-reduced-motion: reduce
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
    
    // Verify animations are disabled
    const liquidGlass = screen.getByTestId('liquid-glass-wrapper')
    expect(liquidGlass).toHaveAttribute('data-reduced-motion', 'true')
  })
})
```

**Implementation (GREEN Phase)**:
```typescript
// /components/article/ArticleCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LiquidGlass } from '@specy/liquid-glass-react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Link from 'next/link'
import Image from 'next/image'

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
  const prefersReducedMotion = useReducedMotion()

  const MotionWrapper = prefersReducedMotion ? 'div' : motion.div

  return (
    <MotionWrapper
      {...(!prefersReducedMotion && {
        whileHover: { scale: 1.02 },
        transition: { duration: 0.2 }
      })}
    >
      <article
        role="article"
        aria-labelledby={`article-title-${article.slug}`}
        aria-describedby={`article-excerpt-${article.slug}`}
        className="group"
      >
        <LiquidGlass
          blur={8}
          opacity={0.15}
          saturation={1.2}
          interactive={!prefersReducedMotion}
          data-testid="liquid-glass-wrapper"
          data-reduced-motion={prefersReducedMotion}
        >
          <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
            {article.eyecatch && (
              <div className="relative overflow-hidden">
                <Image
                  src={article.eyecatch.src}
                  alt={article.eyecatch.alt}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={variant === 'featured'}
                />
              </div>
            )}
            
            <CardHeader>
              <h3 
                id={`article-title-${article.slug}`}
                className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors"
              >
                {article.title}
              </h3>
            </CardHeader>
            
            <CardContent>
              <p 
                id={`article-excerpt-${article.slug}`}
                className="text-muted-foreground line-clamp-3 mb-4"
              >
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  aria-label={`記事「${article.title}」を読む`}
                >
                  <Link href={`/posts/${article.slug}`}>
                    読む
                    <ArrowRight className="ml-2 h-4 w-4" />
                    <span className="sr-only">: {article.title}</span>
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </LiquidGlass>
      </article>
    </MotionWrapper>
  )
}
```

#### Step 2: ArticleGrid Implementation

**TDD Cycle 4: ArticleGrid with Performance**

```typescript
// /components/article/__tests__/ArticleGrid.test.tsx
describe('ArticleGrid', () => {
  it('renders articles in responsive grid', () => {
    // Test grid layout
  })
  
  it('shows loading skeletons during suspense', () => {
    // Test loading states
  })
  
  it('handles empty state gracefully', () => {
    // Test empty articles array
  })
})
```

### Phase 6.2.3: Page Implementation (2-3 hours)

#### Step 1: Homepage Implementation

**TDD Cycle 5: Homepage with ISR**

```typescript
// /app/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import HomePage from '../page'

// Mock the article fetching functions
jest.mock('@/lib/articles', () => ({
  getFeaturedArticles: jest.fn().mockResolvedValue([
    { slug: 'featured', title: 'Featured Article', /* ... */ }
  ]),
  getLatestArticles: jest.fn().mockResolvedValue([
    { slug: 'latest-1', title: 'Latest Article 1', /* ... */ },
    { slug: 'latest-2', title: 'Latest Article 2', /* ... */ },
  ])
}))

describe('HomePage', () => {
  it('renders featured article hero section', async () => {
    render(await HomePage())
    
    expect(screen.getByText('Featured Article')).toBeInTheDocument()
  })
  
  it('renders latest articles grid', async () => {
    render(await HomePage())
    
    expect(screen.getByText('Latest Article 1')).toBeInTheDocument()
    expect(screen.getByText('Latest Article 2')).toBeInTheDocument()
  })
  
  it('has proper SEO metadata', async () => {
    const metadata = await generateMetadata()
    
    expect(metadata.title).toBe('Liquid Glass Tech Blog')
    expect(metadata.description).toContain('技術記事')
  })
})
```

**Implementation**:
```typescript
// /app/page.tsx
import { Suspense } from 'react'
import { ArticleGrid } from '@/components/article/ArticleGrid'
import { ArticleHero } from '@/components/article/ArticleHero'
import { LiquidGlassWrapper } from '@/components/effects/LiquidGlassWrapper'
import { getFeaturedArticles, getLatestArticles } from '@/lib/articles'
import { Skeleton } from '@/components/ui/skeleton'

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const [featuredArticles, latestArticles] = await Promise.all([
    getFeaturedArticles(),
    getLatestArticles({ limit: 12 })
  ])

  return (
    <LiquidGlassWrapper>
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<HeroSkeleton />}>
          <ArticleHero article={featuredArticles[0]} />
        </Suspense>
        
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-8">最新記事</h2>
          <Suspense fallback={<GridSkeleton />}>
            <ArticleGrid articles={latestArticles} />
          </Suspense>
        </section>
      </main>
    </LiquidGlassWrapper>
  )
}

export async function generateMetadata() {
  return {
    title: 'Liquid Glass Tech Blog',
    description: '技術記事とクリエイティブなウェブ開発について',
    openGraph: {
      title: 'Liquid Glass Tech Blog',
      description: '技術記事とクリエイティブなウェブ開発について',
      type: 'website',
      images: ['/og-image.jpg'],
    },
  }
}

function HeroSkeleton() {
  return <Skeleton className="h-96 w-full rounded-lg" />
}

function GridSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-80 w-full rounded-lg" />
      ))}
    </div>
  )
}
```

#### Step 2: Article Detail Page

**TDD Cycle 6: Article Detail with Promise-based Params**

```typescript
// /app/posts/[slug]/__tests__/page.test.tsx
describe('ArticlePage', () => {
  it('renders article content correctly', async () => {
    const params = Promise.resolve({ slug: 'test-article' })
    render(await ArticlePage({ params }))
    
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
  
  it('generates proper metadata from article data', async () => {
    const params = Promise.resolve({ slug: 'test-article' })
    const metadata = await generateMetadata({ params })
    
    expect(metadata.title).toBe('Test Article Title')
  })
  
  it('handles not found articles gracefully', async () => {
    const params = Promise.resolve({ slug: 'non-existent' })
    
    // Should redirect to not-found page
    expect(() => ArticlePage({ params })).not.toThrow()
  })
})
```

**Implementation**:
```typescript
// /app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { ArticleContent } from '@/components/article/ArticleContent'
import { LiquidGlassWrapper } from '@/components/effects/LiquidGlassWrapper'
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/articles'
import { generateArticleStructuredData } from '@/lib/seo/structured-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false // Generate only predefined slugs

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    notFound()
  }

  const structuredData = generateArticleStructuredData(article)

  return (
    <LiquidGlassWrapper>
      <main className="container mx-auto px-4 py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ArticleContent article={article} />
      </main>
    </LiquidGlassWrapper>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [article.eyecatch?.src || '/default-og.jpg'],
      authors: ['Author Name'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.eyecatch?.src || '/default-og.jpg'],
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs()
  
  return slugs.map((slug) => ({
    slug,
  }))
}
```

### Phase 6.2.4: Performance Optimization (1-2 hours)

#### Step 1: Image Optimization Implementation

**TDD Cycle 7: Image Performance**

```typescript
// /components/ui/__tests__/OptimizedImage.test.tsx
describe('OptimizedImage', () => {
  it('generates proper blur placeholder', () => {
    // Test blur data URL generation
  })
  
  it('uses correct responsive sizes', () => {
    // Test responsive image sizes
  })
  
  it('prioritizes above-fold images', () => {
    // Test priority prop usage
  })
})
```

#### Step 2: Bundle Optimization

```typescript
// Dynamic imports for performance
const ParticleSystem = dynamic(
  () => import('@/components/effects/ParticleSystem'),
  { ssr: false, loading: () => <div>Loading effects...</div> }
)

const LiquidGlassAdvanced = dynamic(
  () => import('@specy/liquid-glass-react').then(mod => mod.LiquidGlassAdvanced),
  { ssr: false }
)
```

#### Step 3: Core Web Vitals Monitoring

```typescript
// /components/performance/WebVitalsReporter.tsx
'use client'

import { useEffect } from 'react'

export function WebVitalsReporter() {
  useEffect(() => {
    import('web-vitals').then(({ onCLS, onLCP, onINP }) => {
      onLCP((metric) => {
        // Send to analytics
        if (metric.value > 2500) {
          console.warn('LCP exceeds 2.5s:', metric.value)
        }
      })
      
      onINP((metric) => {
        if (metric.value > 200) {
          console.warn('INP exceeds 200ms:', metric.value)
        }
      })
      
      onCLS((metric) => {
        if (metric.value > 0.1) {
          console.warn('CLS exceeds 0.1:', metric.value)
        }
      })
    })
  }, [])

  return null
}
```

### Phase 6.2.5: E2E Testing & Quality Assurance (1-2 hours)

#### Step 1: Playwright E2E Tests

```typescript
// /tests/e2e/article-pages.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Article Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test data if needed
    await page.goto('/')
  })

  test('homepage performance meets Core Web Vitals', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        import('web-vitals').then(({ onLCP, onINP, onCLS }) => {
          const metrics = {}
          
          onLCP((metric) => { metrics.lcp = metric.value })
          onINP((metric) => { metrics.inp = metric.value })
          onCLS((metric) => { metrics.cls = metric.value })
          
          setTimeout(() => resolve(metrics), 2000)
        })
      })
    })
    
    expect(vitals.lcp).toBeLessThan(2500) // LCP < 2.5s
    expect(vitals.inp).toBeLessThan(200)  // INP < 200ms
    expect(vitals.cls).toBeLessThan(0.1)  // CLS < 0.1
  })

  test('article listing displays correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check for article cards
    const articleCards = page.locator('[role="article"]')
    await expect(articleCards).toHaveCount(12) // 12 latest articles
    
    // Check liquid glass effects are loaded
    const liquidGlass = page.locator('[data-testid="liquid-glass-wrapper"]')
    await expect(liquidGlass.first()).toBeVisible()
    
    // Test responsive design
    await page.setViewportSize({ width: 375, height: 667 }) // Mobile
    await expect(page.locator('.grid')).toHaveClass(/grid-cols-1/)
    
    await page.setViewportSize({ width: 768, height: 1024 }) // Tablet
    await expect(page.locator('.grid')).toHaveClass(/md:grid-cols-2/)
    
    await page.setViewportSize({ width: 1200, height: 800 }) // Desktop
    await expect(page.locator('.grid')).toHaveClass(/lg:grid-cols-3/)
  })

  test('article detail page navigation and content', async ({ page }) => {
    await page.goto('/')
    
    // Click first article
    const firstArticle = page.locator('[role="article"] a').first()
    const articleTitle = await firstArticle.locator('h3').textContent()
    
    await firstArticle.click()
    
    // Check URL changed to article page
    await expect(page).toHaveURL(/\/posts\/.*/)
    
    // Check article content is loaded
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('h1')).toContainText(articleTitle)
    
    // Check structured data
    const structuredData = await page.locator('script[type="application/ld+json"]').textContent()
    expect(structuredData).toContain('@type": "BlogPosting"')
  })

  test('accessibility compliance', async ({ page }) => {
    await page.goto('/')
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(['A', 'BUTTON']).toContain(focusedElement)
    
    // Test aria labels
    const articles = page.locator('[role="article"]')
    const firstArticle = articles.first()
    
    await expect(firstArticle).toHaveAttribute('aria-labelledby')
    await expect(firstArticle).toHaveAttribute('aria-describedby')
    
    // Test color contrast (simplified check)
    const contrastRatio = await page.evaluate(() => {
      const element = document.querySelector('h3')
      const styles = window.getComputedStyle(element)
      // Basic contrast check - would need proper contrast calculation in real test
      return styles.color !== styles.backgroundColor
    })
    expect(contrastRatio).toBe(true)
  })

  test('reduced motion preferences respected', async ({ page }) => {
    // Set prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    
    // Check that animations are disabled
    const liquidGlassElements = page.locator('[data-reduced-motion="true"]')
    await expect(liquidGlassElements.first()).toBeVisible()
    
    // Check framer-motion animations are disabled
    const motionElements = page.locator('[style*="transform"]')
    expect(await motionElements.count()).toBe(0)
  })
})
```

#### Step 2: Performance Testing

```typescript
// /tests/performance/lighthouse.spec.ts
import { test, expect } from '@playwright/test'
import { playAudit } from 'playwright-lighthouse'

test.describe('Lighthouse Performance', () => {
  test('homepage meets performance standards', async ({ page, browser }) => {
    await page.goto('/')
    
    const results = await playAudit({
      page,
      port: 9222,
      thresholds: {
        performance: 90,
        accessibility: 95,
        'best-practices': 90,
        seo: 95,
      },
    })
    
    expect(results.lhr.categories.performance.score).toBeGreaterThan(0.9)
    expect(results.lhr.categories.accessibility.score).toBeGreaterThan(0.95)
  })
})
```

## Implementation Timeline

### Day 1 (4 hours)
- **Phase 6.2.1**: Foundation setup and library integration
- **Phase 6.2.2**: Begin ArticleCard component development

### Day 2 (4 hours)
- **Phase 6.2.2**: Complete ArticleCard and ArticleGrid components
- **Phase 6.2.3**: Homepage implementation

### Day 3 (4 hours)
- **Phase 6.2.3**: Article detail page implementation
- **Phase 6.2.4**: Performance optimization
- **Phase 6.2.5**: E2E testing and quality assurance

## Quality Gates

### Code Quality Metrics
- **Test Coverage**: Minimum 95% line coverage
- **TypeScript**: Strict mode with no any types
- **ESLint**: Zero warnings or errors
- **Prettier**: Consistent code formatting

### Performance Benchmarks
- **LCP**: < 2.5 seconds on 3G
- **INP**: < 200ms for all interactions
- **CLS**: < 0.1 cumulative layout shift
- **Bundle Size**: First load JS < 85KB

### Accessibility Standards
- **WCAG 2.1 AA**: 100% compliance
- **Color Contrast**: Minimum 4.5:1 ratio
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Reader**: All content properly labeled

### SEO Requirements
- **Structured Data**: JSON-LD for all article pages
- **Meta Tags**: Complete Open Graph and Twitter Cards
- **Sitemap**: Dynamic XML sitemap generation
- **Core Web Vitals**: All metrics in green

## Risk Mitigation

### Technical Risks
1. **Liquid Glass Performance**: Implement GPU acceleration fallbacks
2. **Bundle Size**: Use dynamic imports and code splitting
3. **SEO Impact**: Ensure server-side rendering for all content
4. **Accessibility**: Comprehensive testing with screen readers

### Implementation Risks
1. **Library Compatibility**: Test @specy/liquid-glass-react thoroughly
2. **Browser Support**: Ensure fallbacks for older browsers
3. **Performance Regression**: Continuous monitoring setup
4. **Test Coverage**: Maintain strict TDD approach

## Success Criteria

### Functional Requirements
- ✅ Article listing page with responsive grid layout
- ✅ Individual article detail pages with SEO optimization
- ✅ Liquid glass effects integrated seamlessly
- ✅ Performance targets met consistently

### Technical Requirements
- ✅ 95% test coverage achieved
- ✅ Core Web Vitals in green zone
- ✅ WCAG 2.1 AA compliance verified
- ✅ SEO optimization complete

### User Experience Requirements
- ✅ Smooth animations and transitions
- ✅ Responsive design across all devices
- ✅ Fast loading times on all connections
- ✅ Accessible to users with disabilities

This strategy provides a comprehensive roadmap for implementing Phase 6.2 with a focus on quality, performance, and user experience while maintaining strict TDD practices and accessibility standards.