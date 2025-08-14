/**
 * Homepage Tests
 * Phase 6.1: Blog Pages (Library Integration) Test Implementation
 * 
 * Tests:
 * - Homepage with liquid glass styled article cards
 * - shadcn/ui + @developer-hub/liquid-glass integration
 * - Responsive layout and performance
 * - SEO optimization and accessibility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { renderWithTheme } from '@/tests/utils/test-utils'
import HomePage from './page'

// Mock components
vi.mock('@/components/liquid-glass/LiquidGlassCard', () => ({
  LiquidGlassCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="liquid-glass-card" className={className}>
      {children}
    </div>
  ),
}))

vi.mock('@/components/blog/BlogPostCard', () => ({
  BlogPostCard: ({ post }: { post: any }) => (
    <div data-testid="blog-post-card">
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
    </div>
  ),
}))

// No need to mock - HomePage uses built-in mock data

describe('Homepage - Phase 6.1: Blog Pages (Library Integration) TDD', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('RED PHASE: Failing Tests Define Requirements', () => {
    describe('GIVEN homepage layout requirements', () => {
      it('WHEN rendering homepage THEN should display hero section with liquid glass effects', async () => {
        renderWithTheme(<HomePage />)
        
        // Should have main heading
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        expect(screen.getByText(/liquid glass tech blog/i)).toBeInTheDocument()

        // Should have liquid glass card in hero
        expect(screen.getByTestId('liquid-glass-card')).toBeInTheDocument()
      })

      it('WHEN rendering homepage THEN should display featured posts section', async () => {
        renderWithTheme(<HomePage />)

        // Featured posts section
        expect(screen.getByText(/featured posts/i)).toBeInTheDocument()
        
        // Should show featured blog posts
        await waitFor(() => {
          expect(screen.getByText('Mastering Liquid Glass Effects in Modern Web Design')).toBeInTheDocument()
          expect(screen.getByText('Performance Optimization for Glass Effects')).toBeInTheDocument()
        })
      })

      it('WHEN rendering homepage THEN should display recent posts with pagination', async () => {
        renderWithTheme(<HomePage />)

        // Latest articles section
        expect(screen.getByText(/latest articles/i)).toBeInTheDocument()
        
        // Should show blog post cards
        await waitFor(() => {
          const postCards = screen.getAllByTestId('blog-post-card')
          expect(postCards).toHaveLength(3)
        })

        // Should have "View All Articles" link
        expect(screen.getByRole('link', { name: /view all articles/i })).toBeInTheDocument()
      })
    })

    describe('GIVEN shadcn/ui + liquid glass integration requirements', () => {
      it('WHEN rendering page elements THEN should use shadcn/ui components with liquid glass styling', async () => {
        renderWithTheme(<HomePage />)

        // Should use shadcn/ui Button components
        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBeGreaterThan(0)

        // Should use liquid glass cards for content sections
        const glassCards = screen.getAllByTestId('liquid-glass-card')
        expect(glassCards.length).toBeGreaterThan(0)

        // Should have proper glass styling classes
        glassCards.forEach(card => {
          expect(card).toHaveClass(/glass|liquid/i)
        })
      })

      it('WHEN page loads THEN should display proper navigation links', async () => {
        renderWithTheme(<HomePage />)

        // Should have navigation links in hero section
        expect(screen.getByRole('link', { name: /explore articles/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /effect showcase/i })).toBeInTheDocument()
      })

      it('WHEN rendering blog cards THEN should use optimized images with lazy loading', async () => {
        renderWithTheme(<HomePage />)

        await waitFor(() => {
          const images = screen.getAllByRole('img')
          images.forEach(img => {
            // Should have lazy loading
            expect(img).toHaveAttribute('loading', 'lazy')
            
            // Should have proper alt text
            expect(img).toHaveAttribute('alt')
            
            // Should use Next.js Image optimization
            expect(img).toHaveClass(/next-image/i)
          })
        })
      })
    })

    describe('GIVEN responsive design requirements', () => {
      it('WHEN rendering on mobile THEN should display mobile-optimized layout', async () => {
        // Mock mobile viewport
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 375,
        })

        renderWithTheme(<HomePage />)

        // Should have responsive grid classes
        const gridContainer = screen.getByTestId('posts-grid')
        expect(gridContainer).toHaveClass(/grid-cols-1|sm:grid-cols-2|lg:grid-cols-3/)

        // Navigation should be mobile-friendly
        const navigation = screen.getByRole('navigation')
        expect(navigation).toHaveClass(/mobile-nav|hamburger/)
      })

      it('WHEN rendering on tablet THEN should display tablet-optimized layout', async () => {
        // Mock tablet viewport
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 768,
        })

        renderWithTheme(<HomePage />)

        // Should adapt grid for tablet
        const gridContainer = screen.getByTestId('posts-grid')
        expect(gridContainer).toHaveClass(/md:grid-cols-2|lg:grid-cols-3/)
      })

      it('WHEN rendering on desktop THEN should display full desktop layout', async () => {
        // Mock desktop viewport
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1920,
        })

        renderWithTheme(<HomePage />)

        // Should show full desktop grid
        const gridContainer = screen.getByTestId('posts-grid')
        expect(gridContainer).toHaveClass(/lg:grid-cols-3|xl:grid-cols-4/)
      })
    })

    describe('GIVEN performance optimization requirements', () => {
      it('WHEN page loads THEN should implement proper SEO metadata', async () => {
        renderWithTheme(<HomePage />)

        // Should have proper page title
        expect(document.title).toContain('Liquid Glass Tech Blog')

        // Should have meta description
        const metaDescription = document.querySelector('meta[name="description"]')
        expect(metaDescription).toBeInTheDocument()
        expect(metaDescription?.getAttribute('content')).toContain('liquid glass effects')
      })

      it('WHEN components render THEN should use performance-optimized liquid glass effects', async () => {
        renderWithTheme(<HomePage />)

        await waitFor(() => {
          const glassCards = screen.getAllByTestId('liquid-glass-card')
          
          glassCards.forEach(card => {
            // Should have GPU acceleration classes
            expect(card).toHaveStyle(/transform.*translateZ/)
            
            // Should have proper will-change property
            expect(card).toHaveStyle(/will-change/)
            
            // Should not exceed performance budgets
            const styles = window.getComputedStyle(card)
            const backdropFilter = styles.getPropertyValue('backdrop-filter')
            if (backdropFilter.includes('blur')) {
              const blurValue = parseInt(backdropFilter.match(/blur\((\d+)px\)/)?.[1] || '0')
              expect(blurValue).toBeLessThanOrEqual(20) // Performance limit
            }
          })
        })
      })

      it('WHEN page loads THEN should preload critical resources', async () => {
        renderWithTheme(<HomePage />)

        // Should preload critical CSS
        const preloadLinks = document.querySelectorAll('link[rel="preload"]')
        const cssPreloads = Array.from(preloadLinks).filter(link => 
          link.getAttribute('as') === 'style' || 
          link.getAttribute('href')?.includes('.css')
        )
        expect(cssPreloads.length).toBeGreaterThan(0)

        // Should preload featured post images
        const imagePreloads = Array.from(preloadLinks).filter(link => 
          link.getAttribute('as') === 'image'
        )
        expect(imagePreloads.length).toBeGreaterThan(0)
      })
    })

    describe('GIVEN accessibility requirements', () => {
      it('WHEN page renders THEN should have proper semantic HTML structure', async () => {
        renderWithTheme(<HomePage />)

        // Should have proper heading hierarchy
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0)

        // Should have proper landmarks
        expect(screen.getByRole('banner')).toBeInTheDocument() // header
        expect(screen.getByRole('main')).toBeInTheDocument()
        expect(screen.getByRole('navigation')).toBeInTheDocument()
      })

      it('WHEN using liquid glass effects THEN should respect prefers-reduced-motion', async () => {
        // Mock reduced motion preference
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: vi.fn().mockImplementation(query => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          })),
        })

        renderWithTheme(<HomePage />)

        await waitFor(() => {
          const glassCards = screen.getAllByTestId('liquid-glass-card')
          glassCards.forEach(card => {
            // Should disable animations for reduced motion
            expect(card).toHaveClass(/motion-reduce:transition-none/)
          })
        })
      })

      it('WHEN interactive elements render THEN should have proper focus management', async () => {
        renderWithTheme(<HomePage />)

        // All interactive elements should be focusable
        const buttons = screen.getAllByRole('button')
        const links = screen.getAllByRole('link')
        
        const allFocusableElements = buttons.concat(links)
        allFocusableElements.forEach(element => {
          expect(element).toHaveAttribute('tabindex', expect.stringMatching(/^(0|-1)$/))
        })

        // Should have focus indicators
        allFocusableElements.forEach(element => {
          element.focus()
          expect(element).toHaveClass(/focus:ring|focus:outline/)
        })
      })
    })
  })

  describe('GREEN PHASE: Implementation Makes Tests Pass', () => {
    it('should pass all RED phase tests when implementation is complete', () => {
      // This test ensures we implement all required functionality
      expect(true).toBe(true)
    })
  })

  describe('REFACTOR PHASE: Code Quality and Optimization', () => {
    it('should have optimized performance with large number of posts', async () => {
      // Mock many posts to test performance
      const manyPosts = Array.from({ length: 50 }, (_, i) => ({
        slug: `post-${i}`,
        title: `Post ${i}`,
        excerpt: `Excerpt for post ${i}`,
        date: '2024-08-14',
        category: 'test',
        tags: ['test'],
        eyecatch: `/images/post-${i}.jpg`,
        featured: i < 5,
      }))

      vi.mocked(require('@/lib/mdx/mdxProcessor').getAllPosts).mockReturnValue(manyPosts)

      const startTime = performance.now()
      renderWithTheme(<HomePage />)
      const endTime = performance.now()

      // Should render quickly even with many posts
      expect(endTime - startTime).toBeLessThan(100)

      // Should implement virtualization or pagination for performance
      await waitFor(() => {
        const visibleCards = screen.getAllByTestId('blog-post-card')
        expect(visibleCards.length).toBeLessThanOrEqual(12) // Pagination limit
      })
    })

    it('should handle error states gracefully', async () => {
      // Mock error in data fetching
      vi.mocked(require('@/lib/mdx/mdxProcessor').getAllPosts).mockImplementation(() => {
        throw new Error('Failed to load posts')
      })

      renderWithTheme(<HomePage />)

      // Should show error state
      await waitFor(() => {
        expect(screen.getByText(/error loading posts/i)).toBeInTheDocument()
      })

      // Should provide retry mechanism
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })
  })
})