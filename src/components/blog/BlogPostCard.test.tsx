/**
 * Blog Post Card Component Tests
 * 
 * Tests for liquid-glass enhanced blog post card component using shadcn/ui.
 * Verifies MDX metadata display, Motion framework animations, and component interactions.
 * 
 * Phase 3.3 Implementation:
 * - Tests BlogPostCard component with liquid-glass effects
 * - Tests modern design using shadcn/ui components (Card, Badge, Typography, Button)
 * - Tests MDX metadata display (title, description, tags, publishedAt, author, readingTime, eyeCatch)
 * - Tests hover effects and click animations using Motion framework
 * 
 * @module BlogPostCardTests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BlogPostCard } from './BlogPostCard';
import { renderWithTheme } from '@/tests/utils/render-with-theme';
import type { BlogPost } from '@/types/content';

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock intersection observer for compatibility
const mockObserve = vi.fn();
const mockUnobserve = vi.fn(); 
const mockDisconnect = vi.fn();

const mockIntersectionObserver = vi.fn().mockImplementation((callback) => {
  // Immediately call callback with intersecting = true for compatibility
  setTimeout(() => callback([{ isIntersecting: true, target: {} }]), 0);
  return {
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
    root: null,
    rootMargin: '',
    thresholds: []
  };
});

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver
});

// Mock framer-motion for consistent testing
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props} data-testid="motion-div">{children}</div>
    )),
    article: React.forwardRef<HTMLElement, any>(({ children, ...props }, ref) => (
      <article ref={ref} {...props} data-testid="motion-article">{children}</article>
    ))
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock @developer-hub/liquid-glass library
vi.mock('@developer-hub/liquid-glass', () => ({
  LiquidGlass: ({ children, ...props }: any) => (
    <div data-testid="liquid-glass" {...props}>{children}</div>
  ),
  createLiquidGlass: vi.fn(() => ({
    updateParams: vi.fn(),
    destroy: vi.fn()
  })),
  withGlassEffect: (Component: any) => Component
}));

// Mock next/image for testing
vi.mock('next/image', () => ({
  default: ({ src, alt, 'data-testid': testId, ...props }: any) => (
    <img src={src} alt={alt} data-testid={testId || "next-image"} {...props} />
  )
}));

// Mock next/link for testing
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props} data-testid="next-link">{children}</a>
  )
}));

// Mock device optimization hook for Phase 6 compatibility
vi.mock('@/hooks/useDeviceOptimization', () => ({
  useDeviceOptimization: () => ({
    performanceTier: 'desktop-enhanced',
    deviceCapabilities: {
      maxBlurRadius: 25,
      transparencyLevel: 0.15,
      saturationLevel: 1.2,
      gpuAcceleration: true
    },
    viewport: {
      width: 1440,
      height: 900,
      isMobile: false,
      isTablet: false,
      isDesktop: true
    }
  })
}));

describe('BlogPostCard Component', () => {
  // Sample blog post data for testing
  const mockBlogPost: BlogPost = {
    id: 'test-post-1',
    slug: 'test-blog-post',
    title: 'Test Blog Post Title',
    description: 'This is a test blog post description that showcases the BlogPostCard component functionality.',
    content: '# Test Content\n\nThis is test MDX content.',
    eyecatchImage: {
      id: 'img-1',
      url: 'https://example.com/test-image.jpg',
      webpUrl: 'https://example.com/test-image.webp',
      avifUrl: 'https://example.com/test-image.avif',
      alt: 'Test blog post image',
      width: 1200,
      height: 630,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      generatedBy: 'upload',
      optimizationMetrics: {
        originalSize: 1024000,
        compressedSize: 256000,
        compressionRatio: 0.25
      }
    },
    author: {
      id: 'author-1',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      bio: 'Test author bio',
      social: {
        twitter: '@johndoe',
        github: 'johndoe',
        linkedin: 'johndoe'
      }
    },
    category: {
      id: 'cat-1',
      name: 'Technology',
      slug: 'technology',
      description: 'Technology posts',
      color: '#3B82F6',
      postCount: 15
    },
    tags: [
      { id: 'tag-1', name: 'React', slug: 'react', postCount: 25 },
      { id: 'tag-2', name: 'TypeScript', slug: 'typescript', postCount: 30 },
      { id: 'tag-3', name: 'Testing', slug: 'testing', postCount: 12 }
    ],
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    status: 'published',
    seoData: {
      title: 'Test Blog Post Title - Liquid Glass Tech Blog',
      description: 'This is a test blog post description',
      keywords: ['react', 'typescript', 'testing']
    },
    liquidGlassEffects: [
      {
        id: 'effect-1',
        name: 'Subtle Glow',
        type: 'glow',
        properties: { intensity: 0.5, color: '#3B82F6' }
      }
    ],
    readingTime: 5,
    viewCount: 142
  };

  const defaultProps = {
    post: mockBlogPost,
    variant: 'glass-medium' as const,
    showAuthor: true,
    showTags: true,
    showReadingTime: true,
    interactive: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
    mockIntersectionObserver.mockClear();
    // Reset mock implementation to ensure cards are always intersecting
    mockIntersectionObserver.mockImplementation((callback) => {
      setTimeout(() => callback([{ isIntersecting: true, target: {} }]), 0);
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
        root: null,
        rootMargin: '',
        thresholds: []
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders BlogPostCard with all required elements', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      // Check basic structure
      expect(screen.getByTestId('blog-post-card')).toBeInTheDocument();
      expect(screen.getByTestId('liquid-glass')).toBeInTheDocument();
      expect(screen.getByTestId('motion-article')).toBeInTheDocument();

      // Check content elements
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
      expect(screen.getByText(/This is a test blog post description/)).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('5 min read')).toBeInTheDocument();
    });

    it('renders eyecatch image with proper attributes', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const images = screen.getAllByTestId('next-image');
      const eyecatchImage = images.find(img => img.getAttribute('alt') === 'Test blog post image');
      expect(eyecatchImage).toBeDefined();
      expect(eyecatchImage).toHaveAttribute('src', mockBlogPost.eyecatchImage.url);
      expect(eyecatchImage).toHaveAttribute('alt', mockBlogPost.eyecatchImage.alt);
      expect(eyecatchImage).toHaveAttribute('width', '1200');
      expect(eyecatchImage).toHaveAttribute('height', '630');
    });

    it('renders category badge with correct styling', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const categoryBadge = screen.getByTestId('category-badge');
      expect(categoryBadge).toBeInTheDocument();
      expect(categoryBadge).toHaveTextContent('Technology');
      expect(categoryBadge).toHaveStyle(`background-color: ${mockBlogPost.category.color}`);
    });

    it('renders tags when showTags is true', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Testing')).toBeInTheDocument();
    });

    it('hides tags when showTags is false', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} showTags={false} />);

      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    });

    it('renders author information when showAuthor is true', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByTestId('author-avatar')).toBeInTheDocument();
    });

    it('hides author when showAuthor is false', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} showAuthor={false} />);

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.queryByTestId('author-avatar')).not.toBeInTheDocument();
    });

    it('renders reading time when showReadingTime is true', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      expect(screen.getByText('5 min read')).toBeInTheDocument();
    });

    it('hides reading time when showReadingTime is false', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} showReadingTime={false} />);

      expect(screen.queryByText('5 min read')).not.toBeInTheDocument();
    });
  });

  describe('Liquid Glass Effects Integration', () => {
    it('renders with LiquidGlass wrapper component', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const liquidGlass = screen.getByTestId('liquid-glass');
      expect(liquidGlass).toBeInTheDocument();
      expect(liquidGlass).toHaveAttribute('variant', 'glass-medium');
    });

    it('applies different liquid glass variants correctly', () => {
      const { rerender } = renderWithTheme(<BlogPostCard {...defaultProps} variant="glass-subtle" />);
      
      expect(screen.getByTestId('liquid-glass')).toHaveAttribute('variant', 'glass-subtle');

      rerender(<BlogPostCard {...defaultProps} variant="glass-intense" />);
      expect(screen.getByTestId('liquid-glass')).toHaveAttribute('variant', 'glass-intense');
    });

    it('passes correct props to LiquidGlass component', () => {
      renderWithTheme(
        <BlogPostCard 
          {...defaultProps} 
          variant="glass-medium"
          blur={20}
          opacity={0.2}
          interactive={true}
        />
      );

      const liquidGlass = screen.getByTestId('liquid-glass');
      expect(liquidGlass).toHaveAttribute('variant', 'glass-medium');
      // Phase 6: blur and opacity are now computed from device capabilities
      expect(liquidGlass).toHaveAttribute('data-blur-radius', expect.any(String));
      expect(liquidGlass).toHaveAttribute('data-opacity-level', expect.any(String));
      expect(liquidGlass).toHaveAttribute('data-performance-tier', 'desktop-enhanced');
    });

    it('integrates seasonal theme when enabled', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} seasonalTheme={true} />);

      const liquidGlass = screen.getByTestId('liquid-glass');
      // Phase 6: seasonal theme creates data-season attribute (dynamic based on current date)
      expect(liquidGlass).toHaveAttribute('data-season', expect.stringMatching(/^(spring|summer|autumn|winter)$/));
    });
  });

  describe('shadcn/ui Components Integration', () => {
    it('renders using shadcn/ui Card component structure', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      // Check for Card component classes/structure
      const cardElement = screen.getByTestId('blog-post-card');
      expect(cardElement).toHaveClass('text-card-foreground');
    });

    it('renders shadcn/ui Badge components for category and tags', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      // Category badge
      const categoryBadge = screen.getByTestId('category-badge');
      expect(categoryBadge).toHaveClass('inline-flex', 'items-center', 'rounded-full');

      // Tag badges
      const tagBadges = screen.getAllByTestId(/tag-badge-/);
      expect(tagBadges).toHaveLength(3);
      tagBadges.forEach(badge => {
        expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full');
      });
    });

    it('renders shadcn/ui Button for read more action', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const readMoreButton = screen.getByTestId('read-more-button');
      expect(readMoreButton).toBeInTheDocument();
      expect(readMoreButton).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    it('uses proper shadcn/ui Typography components', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const title = screen.getByTestId('post-title');
      expect(title).toHaveClass('scroll-m-20', 'text-2xl', 'font-semibold');

      const description = screen.getByTestId('post-description');
      expect(description).toHaveClass('text-muted-foreground');
    });
  });

  describe('Motion Framework Animations', () => {
    it('wraps content in Motion components', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      expect(screen.getByTestId('motion-article')).toBeInTheDocument();
    });

    it('handles motion preset configurations', () => {
      const { rerender } = renderWithTheme(
        <BlogPostCard {...defaultProps} motionPreset="subtle" />
      );

      let motionElement = screen.getByTestId('motion-article');
      expect(motionElement).toBeInTheDocument();

      rerender(<BlogPostCard {...defaultProps} motionPreset="spring" />);
      motionElement = screen.getByTestId('motion-article');
      expect(motionElement).toBeInTheDocument();
    });

    it('applies interactive hover animations when interactive is true', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} interactive={true} />);

      const articleElement = screen.getByTestId('motion-article');
      expect(articleElement).toHaveClass('cursor-pointer');
    });

    it('removes interactive styles when interactive is false', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} interactive={false} />);

      const articleElement = screen.getByTestId('motion-article');
      expect(articleElement).not.toHaveClass('cursor-pointer');
    });
  });

  describe('User Interactions', () => {
    it('handles card click events with navigation', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const card = screen.getByTestId('blog-post-card');
      fireEvent.click(card);

      const links = screen.getAllByTestId('next-link');
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute('href', '/posts/test-blog-post');
    });

    it('handles hover events for interactive cards', async () => {
      renderWithTheme(<BlogPostCard {...defaultProps} interactive={true} />);

      const card = screen.getByTestId('blog-post-card');
      
      fireEvent.mouseEnter(card);
      await waitFor(() => {
        expect(card).toHaveClass('transform-gpu');
      });

      fireEvent.mouseLeave(card);
    });

    it('handles read more button clicks', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const readMoreButton = screen.getByTestId('read-more-button');
      fireEvent.click(readMoreButton);

      // Should navigate to post detail page
      const links = screen.getAllByTestId('next-link');
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute('href', '/posts/test-blog-post');
    });

    it('handles tag clicks for filtering', () => {
      const onTagClick = vi.fn();
      renderWithTheme(<BlogPostCard {...defaultProps} onTagClick={onTagClick} />);

      const reactTag = screen.getByText('React');
      fireEvent.click(reactTag);

      expect(onTagClick).toHaveBeenCalledWith('react');
    });

    it('handles category clicks for filtering', () => {
      const onCategoryClick = vi.fn();
      renderWithTheme(<BlogPostCard {...defaultProps} onCategoryClick={onCategoryClick} />);

      const categoryBadge = screen.getByTestId('category-badge');
      fireEvent.click(categoryBadge);

      expect(onCategoryClick).toHaveBeenCalledWith('technology');
    });
  });

  describe('Date and Time Formatting', () => {
    it('displays formatted publication date', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      // Should format date properly
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    });

    it('displays reading time in correct format', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      expect(screen.getByText('5 min read')).toBeInTheDocument();
    });

    it('handles different reading time values', () => {
      const postWithLongerReadTime = {
        ...mockBlogPost,
        readingTime: 12
      };

      renderWithTheme(<BlogPostCard {...defaultProps} post={postWithLongerReadTime} />);

      expect(screen.getByText('12 min read')).toBeInTheDocument();
    });
  });

  describe('Accessibility Features', () => {
    it('has proper ARIA labels and roles', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const article = screen.getByRole('article');
      // Phase 6: Enhanced ARIA label now includes publication date
      expect(article).toHaveAttribute('aria-label', expect.stringContaining('Blog post: Test Blog Post Title'));
      expect(article).toHaveAttribute('aria-label', expect.stringContaining('Published on'));

      const link = screen.getByRole('link', { name: /test blog post title/i });
      expect(link).toBeInTheDocument();
    });

    it('provides alt text for images', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const images = screen.getAllByRole('img');
      const eyecatchImage = images.find(img => img.getAttribute('alt') === 'Test blog post image');
      expect(eyecatchImage).toHaveAttribute('alt', 'Test blog post image');
    });

    it('has keyboard navigation support', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const article = screen.getByTestId('motion-article');
      expect(article).toHaveAttribute('tabIndex', '0');
    });

    it('supports focus management', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const article = screen.getByTestId('motion-article');
      article.focus();
      expect(article).toHaveFocus();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles missing eyecatch image gracefully', () => {
      const postWithoutImage = {
        ...mockBlogPost,
        eyecatchImage: {
          ...mockBlogPost.eyecatchImage,
          url: '',
          alt: ''
        }
      };

      renderWithTheme(<BlogPostCard {...defaultProps} post={postWithoutImage} />);

      // Should render fallback or placeholder
      expect(screen.getByTestId('blog-post-card')).toBeInTheDocument();
    });

    it('handles empty tags array', () => {
      const postWithoutTags = {
        ...mockBlogPost,
        tags: []
      };

      renderWithTheme(<BlogPostCard {...defaultProps} post={postWithoutTags} />);

      expect(screen.getByTestId('blog-post-card')).toBeInTheDocument();
      expect(screen.queryByTestId(/tag-badge-/)).not.toBeInTheDocument();
    });

    it('handles missing author information', () => {
      const postWithoutAuthor = {
        ...mockBlogPost,
        author: {
          id: 'author-1',
          name: 'Unknown Author'
        }
      };

      renderWithTheme(<BlogPostCard {...defaultProps} post={postWithoutAuthor} />);

      expect(screen.getByText('Unknown Author')).toBeInTheDocument();
      expect(screen.queryByTestId('author-avatar')).not.toBeInTheDocument();
    });

    it('handles long titles and descriptions gracefully', () => {
      const postWithLongContent = {
        ...mockBlogPost,
        title: 'This is a very long blog post title that should be handled gracefully by the component without breaking the layout or causing overflow issues',
        description: 'This is a very long description that contains a lot of text and should be truncated or handled properly to maintain the card layout integrity without causing any visual issues.'
      };

      renderWithTheme(<BlogPostCard {...defaultProps} post={postWithLongContent} />);

      expect(screen.getByTestId('blog-post-card')).toBeInTheDocument();
      expect(screen.getByTestId('post-title')).toHaveClass('line-clamp-2');
      expect(screen.getByTestId('post-description')).toHaveClass('line-clamp-3');
    });
  });

  describe('Performance Optimizations', () => {
    it('uses proper memoization for expensive computations', () => {
      const { rerender } = renderWithTheme(<BlogPostCard {...defaultProps} />);

      // Re-render with same props should not cause unnecessary re-computation
      rerender(<BlogPostCard {...defaultProps} />);

      expect(screen.getByTestId('blog-post-card')).toBeInTheDocument();
    });

    it('lazy loads images with proper attributes', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} />);

      const images = screen.getAllByTestId('next-image');
      const eyecatchImage = images.find(img => img.getAttribute('alt') === 'Test blog post image');
      expect(eyecatchImage).toHaveAttribute('loading', 'lazy');
      expect(eyecatchImage).toHaveAttribute('decoding', 'async');
    });

    it('applies GPU acceleration hints for animations', () => {
      renderWithTheme(<BlogPostCard {...defaultProps} interactive={true} />);

      const card = screen.getByTestId('blog-post-card');
      expect(card).toHaveClass('transform-gpu');
    });
  });
});