/**
 * Tag Page - Dynamic Route Handler
 * 
 * Displays posts filtered by tag with liquid glass effects and pagination.
 * Features advanced filtering, search functionality, and responsive design.
 * 
 * Features:
 * - Tag-specific post filtering
 * - Liquid glass card layouts with seasonal theming
 * - Related tags suggestions
 * - SEO optimized with structured data
 * - Responsive grid with Core Web Vitals optimization
 */

import React from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Hash, Calendar, TrendingUp, Eye } from 'lucide-react';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Liquid Glass Components
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard';
import { BlogPostCard } from '@/components/blog/BlogPostCard';

// Types
import type { BlogPost, Tag } from '@/types/content';

// Mock tags data
const mockTags: Tag[] = [
  { id: '1', name: 'React', slug: 'react', postCount: 8 },
  { id: '2', name: 'TypeScript', slug: 'typescript', postCount: 6 },
  { id: '3', name: 'Liquid Glass', slug: 'liquid-glass', postCount: 4 },
  { id: '4', name: 'Next.js', slug: 'nextjs', postCount: 7 },
  { id: '5', name: 'CSS', slug: 'css', postCount: 9 },
  { id: '6', name: 'Animation', slug: 'animation', postCount: 5 },
  { id: '7', name: 'Performance', slug: 'performance', postCount: 4 },
  { id: '8', name: 'Accessibility', slug: 'accessibility', postCount: 3 },
  { id: '9', name: 'Design System', slug: 'design-system', postCount: 5 },
  { id: '10', name: 'Web Components', slug: 'web-components', postCount: 3 }
];

// Mock posts data filtered by tag
const getAllPostsByTag = (tagSlug: string): BlogPost[] => {
  // In production, this would fetch from CMS/API
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      slug: 'mastering-liquid-glass-effects',
      title: 'Mastering Liquid Glass Effects in Modern Web Design',
      description: 'Learn how to create stunning glassmorphism effects that enhance user experience while maintaining performance.',
      content: '# Mastering Liquid Glass Effects...',
      eyecatchImage: {
        id: 'img1',
        url: '/images/liquid-glass-hero.jpg',
        webpUrl: '/images/liquid-glass-hero.webp',
        alt: 'Liquid glass effect demonstration',
        width: 1200,
        height: 630,
        blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
        generatedBy: 'ai',
        optimizationMetrics: {
          originalSize: 245760,
          compressedSize: 89432,
          compressionRatio: 0.364
        }
      },
      author: {
        id: '1',
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg',
        bio: 'Frontend developer passionate about modern web technologies'
      },
      category: {
        id: 'design',
        name: 'Design',
        slug: 'design',
        description: 'UI/UX Design principles',
        color: '#10b981',
        postCount: 8
      },
      tags: [
        mockTags.find(t => t.slug === 'react')!,
        mockTags.find(t => t.slug === 'liquid-glass')!,
        mockTags.find(t => t.slug === 'css')!
      ],
      publishedAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      status: 'published',
      seoData: {
        title: 'Mastering Liquid Glass Effects | Liquid Glass Tech Blog',
        description: 'Learn how to create stunning glassmorphism effects that enhance user experience while maintaining performance.',
        keywords: ['liquid glass', 'glassmorphism', 'web design', 'CSS effects']
      },
      readingTime: 8,
      viewCount: 1247
    },
    {
      id: '2',
      slug: 'performance-optimization-glass-effects',
      title: 'Performance Optimization for Glass Effects',
      description: 'Essential techniques for keeping your liquid glass effects smooth and performant across all devices.',
      content: '# Performance Optimization...',
      eyecatchImage: {
        id: 'img2',
        url: '/images/performance-hero.jpg',
        webpUrl: '/images/performance-hero.webp',
        alt: 'Performance optimization visualization',
        width: 1200,
        height: 630,
        blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
        generatedBy: 'ai',
        optimizationMetrics: {
          originalSize: 198432,
          compressedSize: 67234,
          compressionRatio: 0.339
        }
      },
      author: {
        id: '1',
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg',
        bio: 'Frontend developer passionate about modern web technologies'
      },
      category: {
        id: 'performance',
        name: 'Performance',
        slug: 'performance',
        description: 'Web performance optimization',
        color: '#f59e0b',
        postCount: 6
      },
      tags: [
        mockTags.find(t => t.slug === 'react')!,
        mockTags.find(t => t.slug === 'performance')!,
        mockTags.find(t => t.slug === 'animation')!
      ],
      publishedAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      status: 'published',
      seoData: {
        title: 'Performance Optimization for Glass Effects',
        description: 'Essential techniques for keeping your liquid glass effects smooth and performant across all devices.',
        keywords: ['performance', 'optimization', 'glass effects', 'web performance']
      },
      readingTime: 6,
      viewCount: 892
    },
    {
      id: '3',
      slug: 'react-hooks-glass-components',
      title: 'Building Reusable Glass Components with React Hooks',
      description: 'Learn how to create modular, reusable liquid glass components using modern React patterns and hooks.',
      content: '# Building Reusable Glass Components...',
      eyecatchImage: {
        id: 'img3',
        url: '/images/react-hooks-hero.jpg',
        webpUrl: '/images/react-hooks-hero.webp',
        alt: 'React hooks and glass components',
        width: 1200,
        height: 630,
        blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
        generatedBy: 'ai',
        optimizationMetrics: {
          originalSize: 287654,
          compressedSize: 95321,
          compressionRatio: 0.331
        }
      },
      author: {
        id: '1',
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg',
        bio: 'Frontend developer passionate about modern web technologies'
      },
      category: {
        id: 'web-dev',
        name: 'Web Development',
        slug: 'web-dev',
        description: 'Modern web development techniques',
        color: '#3b82f6',
        postCount: 12
      },
      tags: [
        mockTags.find(t => t.slug === 'react')!,
        mockTags.find(t => t.slug === 'typescript')!,
        mockTags.find(t => t.slug === 'liquid-glass')!
      ],
      publishedAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      status: 'published',
      seoData: {
        title: 'Building Reusable Glass Components with React Hooks',
        description: 'Learn how to create modular, reusable liquid glass components using modern React patterns and hooks.',
        keywords: ['React hooks', 'components', 'reusable', 'liquid glass']
      },
      readingTime: 10,
      viewCount: 1456
    }
  ];

  // Filter posts by tag - posts that have this tag
  return mockPosts.filter(post => 
    post.tags.some(tag => tag.slug === tagSlug)
  );
};

interface TagPageProps {
  params: {
    tag: string;
  };
}

const TagPage: React.FC<TagPageProps> = ({ params }) => {
  const tagSlug = params.tag;
  
  // Find the tag
  const tag = mockTags.find(t => t.slug === tagSlug);
  
  // Return 404 if tag doesn't exist
  if (!tag) {
    notFound();
  }

  // Get posts for this tag
  const posts = getAllPostsByTag(tagSlug);
  
  // Calculate tag stats
  const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0);
  const averageReadingTime = posts.length > 0 
    ? Math.round(posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length)
    : 0;

  // Get related tags (other popular tags)
  const relatedTags = mockTags
    .filter(t => t.slug !== tagSlug)
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${tag.name} Articles`,
            description: `Collection of articles tagged with ${tag.name}`,
            url: `https://liquid-glass-tech.com/tags/${tagSlug}`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: posts.length,
              itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Article',
                  headline: post.title,
                  url: `/posts/${post.slug}`,
                  datePublished: post.publishedAt.toISOString(),
                  author: {
                    '@type': 'Person',
                    name: post.author.name
                  }
                }
              }))
            }
          }),
        }}
      />

      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <nav aria-label="breadcrumb">
              <Link 
                href="/posts" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Posts
              </Link>
            </nav>
          </div>

          <LiquidGlassCard
            variant="glass-medium"
            blur={20}
            opacity={0.1}
            seasonalTheme
            className="p-12"
            data-testid="tag-header-card"
          >
            {/* Tag Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mr-4">
                  <Hash className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 border-primary text-primary">
                    Tag
                  </Badge>
                  <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                    #{tag.name}
                  </h1>
                </div>
              </div>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Explore all articles tagged with <strong>{tag.name}</strong>. 
                From beginner-friendly tutorials to advanced techniques, 
                discover everything related to {tag.name.toLowerCase()}.
              </p>

              {/* Tag Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="posts-count">
                    {posts.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {tag.postCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Tagged</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {totalViews.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {averageReadingTime}m
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Read</div>
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12" data-testid="no-posts-message">
              <Hash className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                We haven't published any articles with this tag yet. 
                Check back soon for new content!
              </p>
              <Link href="/posts">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Browse All Posts
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post, index) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    variant="glass-medium"
                    blur={15}
                    opacity={0.1}
                    interactive
                    seasonalTheme
                    motionPreset="smooth"
                    showAuthor
                    showTags
                    showReadingTime
                    // Phase 6: Enhanced performance optimization
                    className={index === 0 ? "priority-content" : ""}
                    data-testid={`tag-post-card-${index}`}
                  />
                ))}
              </div>

              {/* Pagination placeholder */}
              {posts.length >= 6 && (
                <div className="text-center">
                  <Button variant="outline" size="lg" data-testid="load-more-button">
                    Load More Articles
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Related Tags Section */}
      {relatedTags.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Related Tags
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover more topics and expand your knowledge
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {relatedTags.map((relatedTag) => (
                <Link 
                  key={relatedTag.id} 
                  href={`/tags/${relatedTag.slug}`}
                  className="block"
                  data-testid={`related-tag-${relatedTag.slug}`}
                >
                  <LiquidGlassCard
                    variant="glass-subtle"
                    blur={8}
                    opacity={0.06}
                    className="px-4 py-3 text-center"
                    interactive
                    motionPreset="subtle"
                  >
                    <div className="flex items-center gap-3">
                      <Hash className="w-4 h-4 text-primary" />
                      <span className="font-medium">{relatedTag.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {relatedTag.postCount}
                      </Badge>
                    </div>
                  </LiquidGlassCard>
                </Link>
              ))}
            </div>

            {/* Tag Cloud Section */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-6">Popular Tags</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {mockTags
                  .sort((a, b) => b.postCount - a.postCount)
                  .slice(0, 15)
                  .map((popularTag) => (
                    <Link
                      key={popularTag.id}
                      href={`/tags/${popularTag.slug}`}
                      className={`
                        inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                        transition-colors duration-200
                        ${popularTag.slug === tagSlug 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                        }
                      `}
                      style={{
                        fontSize: `${Math.max(0.75, Math.min(1.1, popularTag.postCount / 10 + 0.7))}rem`
                      }}
                    >
                      #{popularTag.name}
                      <span className="text-xs opacity-70">
                        {popularTag.postCount}
                      </span>
                    </Link>
                  ))
                }
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default TagPage;

// Generate static params for all tags
export async function generateStaticParams() {
  return mockTags.map((tag) => ({
    tag: tag.slug,
  }));
}

// Metadata generation for SEO
export async function generateMetadata({ params }: TagPageProps) {
  const tagSlug = params.tag;
  const tag = mockTags.find(t => t.slug === tagSlug);
  
  if (!tag) {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.',
    };
  }

  const posts = getAllPostsByTag(tagSlug);

  return {
    title: `${tag.name} Articles | Liquid Glass Tech Blog`,
    description: `Browse ${posts.length} articles tagged with ${tag.name}. Learn about ${tag.name.toLowerCase()} with our comprehensive guides and tutorials.`,
    keywords: [tag.name.toLowerCase(), 'blog', 'articles', 'liquid glass', 'web development', 'tutorials'],
    openGraph: {
      title: `${tag.name} Articles | Liquid Glass Tech Blog`,
      description: `Browse ${posts.length} articles tagged with ${tag.name}. Learn about ${tag.name.toLowerCase()} with our comprehensive guides and tutorials.`,
      type: 'website',
      url: `/tags/${tagSlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tag.name} Articles | Liquid Glass Tech Blog`,
      description: `Browse ${posts.length} articles tagged with ${tag.name}. Learn about ${tag.name.toLowerCase()} with our comprehensive guides and tutorials.`,
    },
    alternates: {
      canonical: `/tags/${tagSlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      'article:tag': tag.name,
    }
  };
}