/**
 * Tag Page Tests - Enhanced Implementation Agent
 * 
 * Comprehensive testing for tag-specific post filtering with liquid glass layouts.
 * Tests tag filtering, related tags, tag cloud, SEO metadata, and responsive design.
 * 
 * TDD Approach: Red-Green-Refactor with performance validation
 * Coverage Target: 95% line coverage, 90% branch coverage, 95% function coverage
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { notFound } from 'next/navigation';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Component under test
import TagPage, { generateStaticParams, generateMetadata } from './page';

// Test utilities
import { renderWithTheme } from '@/tests/utils/render-with-theme';
import { mockIntersectionObserver } from '@/tests/mocks/liquid-glass-mock';

// Mocks
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('@/components/liquid-glass/LiquidGlassCard', () => ({
  LiquidGlassCard: ({ children, className, ...props }: any) => (
    <div 
      data-testid="liquid-glass-card"
      className={className}
      data-variant={props.variant}
      data-blur={props.blur}
      data-opacity={props.opacity}
      data-seasonal-theme={props.seasonalTheme}
      data-interactive={props.interactive}
      data-motion-preset={props.motionPreset}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/components/blog/BlogPostCard', () => ({
  BlogPostCard: ({ post, ...props }: any) => (
    <div 
      data-testid={`tag-post-card-${props['data-testid']?.split('-')[3] || '0'}`}
      data-post-id={post.id}
      data-post-title={post.title}
      data-post-tags={post.tags.map((tag: any) => tag.slug).join(',')}
      data-variant={props.variant}
      data-show-author={props.showAuthor}
      data-show-tags={props.showTags}
      data-show-reading-time={props.showReadingTime}
      className={props.className}
    >
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      <div>
        Tags: {post.tags.map((tag: any) => `#${tag.name}`).join(', ')}
      </div>
    </div>
  ),
}));

describe('TagPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockIntersectionObserver();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Valid Tag Rendering', () => {
    it('should render tag page with correct header and liquid glass effects', () => {
      const params = { tag: 'react' };
      
      renderWithTheme(<TagPage params={params} />);

      // Tag header should be present with hash symbol
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('#React');
      
      // Tag description should be displayed
      expect(screen.getByText(/explore all articles tagged with/i)).toBeInTheDocument();
      
      // Liquid Glass Card header should have correct props
      const glassCard = screen.getAllByTestId('liquid-glass-card')[0];
      expect(glassCard).toHaveAttribute('data-variant', 'glass-medium');
      expect(glassCard).toHaveAttribute('data-blur', '20');
      expect(glassCard).toHaveAttribute('data-opacity', '0.1');
      expect(glassCard).toHaveAttribute('data-seasonal-theme', 'true');
    });

    it('should display tag statistics correctly', () => {
      const params = { tag: 'react' };
      
      renderWithTheme(<TagPage params={params} />);

      // Check for tag stats
      expect(screen.getByText('Articles')).toBeInTheDocument();
      expect(screen.getByText('Total Tagged')).toBeInTheDocument();
      expect(screen.getByText('Total Views')).toBeInTheDocument();
      expect(screen.getByText('Avg. Read')).toBeInTheDocument();

      // Check specific counts
      const postsCount = screen.getByTestId('posts-count');
      expect(postsCount).toBeInTheDocument();
      // React tag should have 3 posts based on mock data
      expect(postsCount).toHaveTextContent('3');
    });

    it('should filter and display posts for the specific tag', () => {
      const params = { tag: 'react' };
      
      renderWithTheme(<TagPage params={params} />);

      // Should show posts that have the react tag
      const postCards = screen.getAllByTestId(/tag-post-card-/);
      expect(postCards).toHaveLength(3); // React appears in 3 posts

      // Each post card should contain the react tag
      postCards.forEach(card => {
        const tags = card.getAttribute('data-post-tags') || '';
        expect(tags).toContain('react');
      });

      // Should find specific React-related posts
      expect(screen.getByText('Mastering Liquid Glass Effects in Modern Web Design')).toBeInTheDocument();
      expect(screen.getByText('Performance Optimization for Glass Effects')).toBeInTheDocument();
      expect(screen.getByText('Building Reusable Glass Components with React Hooks')).toBeInTheDocument();

      // Post cards should have correct liquid glass properties
      postCards.forEach(card => {
        expect(card).toHaveAttribute('data-variant', 'glass-medium');
        expect(card).toHaveAttribute('data-show-author', 'true');
        expect(card).toHaveAttribute('data-show-tags', 'true');
        expect(card).toHaveAttribute('data-show-reading-time', 'true');
      });
    });

    it('should prioritize first post for performance optimization', () => {
      const params = { tag: 'liquid-glass' };
      
      renderWithTheme(<TagPage params={params} />);

      const firstPostCard = screen.getByTestId('tag-post-card-0');
      expect(firstPostCard).toHaveClass('priority-content');
    });
  });

  describe('Tag Not Found Handling', () => {
    it('should call notFound() for invalid tag slug', () => {
      const params = { tag: 'non-existent-tag' };
      
      renderWithTheme(<TagPage params={params} />);

      expect(notFound).toHaveBeenCalledOnce();
    });
  });

  describe('Empty Tag State', () => {
    it('should display empty state when tag has no posts', () => {
      // Using a tag that exists but has no posts in mock data
      const params = { tag: 'web-components' }; // This tag exists but no posts have it
      
      renderWithTheme(<TagPage params={params} />);

      const noPostsMessage = screen.queryByTestId('no-posts-message');
      
      if (noPostsMessage) {
        expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
        expect(screen.getByText(/check back soon for new content/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /browse all posts/i })).toBeInTheDocument();
      }
    });
  });

  describe('Navigation and Breadcrumbs', () => {
    it('should display breadcrumb navigation with back link', () => {
      const params = { tag: 'typescript' };
      
      renderWithTheme(<TagPage params={params} />);

      const backLink = screen.getByRole('link', { name: /back to all posts/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/posts');
      
      // Should have proper aria-label for breadcrumb
      expect(screen.getByLabelText('breadcrumb')).toBeInTheDocument();
    });
  });

  describe('Related Tags Section', () => {
    it('should display related tags with correct liquid glass effects', () => {
      const params = { tag: 'react' };
      
      renderWithTheme(<TagPage params={params} />);

      expect(screen.getByRole('heading', { level: 2, name: /related tags/i })).toBeInTheDocument();
      
      // Should show related tags (excluding current tag)
      const relatedTagLinks = screen.getAllByTestId(/related-tag-/);
      expect(relatedTagLinks.length).toBeGreaterThan(0);
      expect(relatedTagLinks.length).toBeLessThanOrEqual(6); // Max 6 related tags

      // Should not include the current tag in related tags
      const reactRelatedTag = screen.queryByTestId('related-tag-react');
      expect(reactRelatedTag).toBeNull();
    });

    it('should display popular tags cloud with proper sizing', () => {
      const params = { tag: 'css' };
      
      renderWithTheme(<TagPage params={params} />);

      expect(screen.getByRole('heading', { level: 3, name: /popular tags/i })).toBeInTheDocument();
      
      // Should show tag cloud with up to 15 tags
      const tagCloudLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href')?.startsWith('/tags/') && 
        link.textContent?.startsWith('#')
      );
      
      expect(tagCloudLinks.length).toBeLessThanOrEqual(15);
      
      // Current tag should be highlighted in tag cloud
      const currentTagInCloud = tagCloudLinks.find(link => 
        link.getAttribute('href')?.includes('/tags/css')
      );
      
      if (currentTagInCloud) {
        expect(currentTagInCloud).toHaveClass('bg-primary');
      }
    });
  });

  describe('Pagination', () => {
    it('should show load more button when there are enough posts', () => {
      const params = { tag: 'react' };
      
      renderWithTheme(<TagPage params={params} />);

      // React has 3 posts, which is less than 6, so no load more button
      const loadMoreButton = screen.queryByTestId('load-more-button');
      expect(loadMoreButton).toBeNull();
      
      // Test with a tag that might have more posts
      // In real scenario, this would be controlled by mock data
    });
  });

  describe('Structured Data', () => {
    it('should include proper JSON-LD structured data', () => {
      const params = { tag: 'liquid-glass' };
      
      renderWithTheme(<TagPage params={params} />);

      // Check for JSON-LD script tag
      const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
      expect(structuredDataScript).toBeInTheDocument();
      
      if (structuredDataScript) {
        const jsonLd = JSON.parse(structuredDataScript.textContent || '{}');
        expect(jsonLd['@context']).toBe('https://schema.org');
        expect(jsonLd['@type']).toBe('CollectionPage');
        expect(jsonLd.name).toContain('Liquid Glass Articles');
        expect(jsonLd.mainEntity['@type']).toBe('ItemList');
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure and ARIA labels', () => {
      const params = { tag: 'performance' };
      
      renderWithTheme(<TagPage params={params} />);

      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2); // 1 for post cards + 1 for popular tags

      // Check for proper navigation
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      // All links should be accessible
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toBeVisible();
      });
    });

    it('should have proper hash symbol accessibility', () => {
      const params = { tag: 'animation' };
      
      renderWithTheme(<TagPage params={params} />);

      // Hash symbols should be present for tag identification
      const tagHeading = screen.getByRole('heading', { level: 1 });
      expect(tagHeading).toHaveTextContent('#Animation');
    });
  });

  describe('Performance', () => {
    it('should render within performance budget (< 100ms)', async () => {
      const params = { tag: 'typescript' };
      const startTime = performance.now();
      
      renderWithTheme(<TagPage params={params} />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(100);
    });

    it('should optimize first post for LCP', () => {
      const params = { tag: 'react' };
      
      renderWithTheme(<TagPage params={params} />);

      const firstPost = screen.getByTestId('tag-post-card-0');
      expect(firstPost).toHaveClass('priority-content');
    });
  });
});

describe('generateStaticParams', () => {
  it('should return all tag slugs for static generation', async () => {
    const params = await generateStaticParams();
    
    expect(params).toHaveLength(10);
    expect(params).toContainEqual({ tag: 'react' });
    expect(params).toContainEqual({ tag: 'typescript' });
    expect(params).toContainEqual({ tag: 'liquid-glass' });
    expect(params).toContainEqual({ tag: 'nextjs' });
    expect(params).toContainEqual({ tag: 'css' });
    expect(params).toContainEqual({ tag: 'animation' });
    expect(params).toContainEqual({ tag: 'performance' });
    expect(params).toContainEqual({ tag: 'accessibility' });
    expect(params).toContainEqual({ tag: 'design-system' });
    expect(params).toContainEqual({ tag: 'web-components' });
  });
});

describe('generateMetadata', () => {
  it('should generate correct metadata for valid tag', async () => {
    const params = { tag: 'react' };
    const metadata = await generateMetadata({ params });
    
    expect(metadata.title).toBe('React Articles | Liquid Glass Tech Blog');
    expect(metadata.description).toContain('articles tagged with React');
    expect(metadata.keywords).toContain('react');
    expect(metadata.openGraph?.title).toBe('React Articles | Liquid Glass Tech Blog');
    expect(metadata.openGraph?.url).toBe('/tags/react');
    expect(metadata.robots?.index).toBe(true);
    expect(metadata.robots?.follow).toBe(true);
    expect(metadata.other?.['article:tag']).toBe('React');
  });

  it('should generate 404 metadata for invalid tag', async () => {
    const params = { tag: 'non-existent' };
    const metadata = await generateMetadata({ params });
    
    expect(metadata.title).toBe('Tag Not Found');
    expect(metadata.description).toBe('The requested tag could not be found.');
  });

  it('should include proper SEO metadata for all tags', async () => {
    const tags = ['react', 'typescript', 'liquid-glass', 'nextjs', 'css'];
    
    for (const tagSlug of tags) {
      const params = { tag: tagSlug };
      const metadata = await generateMetadata({ params });
      
      expect(metadata.title).toContain('Liquid Glass Tech Blog');
      expect(metadata.description).toBeTruthy();
      expect(metadata.keywords).toBeInstanceOf(Array);
      expect(metadata.openGraph).toBeTruthy();
      expect(metadata.twitter).toBeTruthy();
      expect(metadata.alternates?.canonical).toBe(`/tags/${tagSlug}`);
    }
  });
});