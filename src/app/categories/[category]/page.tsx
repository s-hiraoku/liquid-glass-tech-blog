/**
 * Category Page - Dynamic Route Handler
 * 
 * Displays posts filtered by category with liquid glass effects and pagination.
 * Features advanced filtering, search functionality, and responsive design.
 * 
 * Features:
 * - Category-specific post filtering
 * - Liquid glass card layouts
 * - Seasonal theme integration
 * - SEO optimized with structured data
 * - Responsive grid with performance optimization
 */

import React from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Tag, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Liquid Glass Components
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard';
import { BlogPostCard } from '@/components/blog/BlogPostCard';

// Types
import type { BlogPost, Category } from '@/types/content';

// Mock categories and posts data
const mockCategories: Category[] = [
  { 
    id: 'web-dev', 
    name: 'Web Development', 
    slug: 'web-dev', 
    description: 'Modern web development techniques, frameworks, and best practices', 
    color: '#3b82f6', 
    postCount: 12 
  },
  { 
    id: 'design', 
    name: 'Design', 
    slug: 'design', 
    description: 'UI/UX Design principles, liquid glass effects, and visual aesthetics', 
    color: '#10b981', 
    postCount: 8 
  },
  { 
    id: 'performance', 
    name: 'Performance', 
    slug: 'performance', 
    description: 'Web performance optimization, Core Web Vitals, and speed improvements', 
    color: '#f59e0b', 
    postCount: 6 
  },
  { 
    id: 'tutorials', 
    name: 'Tutorials', 
    slug: 'tutorials', 
    description: 'Step-by-step guides and practical implementations', 
    color: '#8b5cf6', 
    postCount: 15 
  }
];

// Mock posts data (same as posts/page.tsx but would be filtered by category in production)
const getAllPostsByCategory = (categorySlug: string): BlogPost[] => {
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
      category: mockCategories.find(c => c.slug === 'design')!,
      tags: [
        { id: '1', name: 'React', slug: 'react', postCount: 8 },
        { id: '3', name: 'Liquid Glass', slug: 'liquid-glass', postCount: 4 },
        { id: '5', name: 'CSS', slug: 'css', postCount: 9 }
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
      category: mockCategories.find(c => c.slug === 'performance')!,
      tags: [
        { id: '1', name: 'React', slug: 'react', postCount: 8 },
        { id: '3', name: 'Liquid Glass', slug: 'liquid-glass', postCount: 4 },
        { id: '6', name: 'Animation', slug: 'animation', postCount: 5 }
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
      slug: 'next-js-15-liquid-glass-integration',
      title: 'Next.js 15 and Liquid Glass: Perfect Integration',
      description: 'Discover how to seamlessly integrate liquid glass effects with Next.js 15 App Router for optimal performance.',
      content: '# Next.js 15 Integration...',
      eyecatchImage: {
        id: 'img4',
        url: '/images/nextjs-hero.jpg',
        webpUrl: '/images/nextjs-hero.webp',
        alt: 'Next.js 15 integration showcase',
        width: 1200,
        height: 630,
        blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
        generatedBy: 'ai',
        optimizationMetrics: {
          originalSize: 312456,
          compressedSize: 98765,
          compressionRatio: 0.316
        }
      },
      author: {
        id: '1',
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg',
        bio: 'Frontend developer passionate about modern web technologies'
      },
      category: mockCategories.find(c => c.slug === 'web-dev')!,
      tags: [
        { id: '1', name: 'React', slug: 'react', postCount: 8 },
        { id: '4', name: 'Next.js', slug: 'nextjs', postCount: 7 },
        { id: '3', name: 'Liquid Glass', slug: 'liquid-glass', postCount: 4 }
      ],
      publishedAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      status: 'published',
      seoData: {
        title: 'Next.js 15 and Liquid Glass: Perfect Integration',
        description: 'Discover how to seamlessly integrate liquid glass effects with Next.js 15 App Router for optimal performance.',
        keywords: ['Next.js 15', 'integration', 'App Router', 'performance']
      },
      readingTime: 12,
      viewCount: 2103
    }
  ];

  // Filter posts by category
  return mockPosts.filter(post => post.category.slug === categorySlug);
};

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  const categorySlug = params.category;
  
  // Find the category
  const category = mockCategories.find(cat => cat.slug === categorySlug);
  
  // Return 404 if category doesn't exist
  if (!category) {
    notFound();
  }

  // Get posts for this category
  const posts = getAllPostsByCategory(categorySlug);
  
  // Calculate category stats
  const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0);
  const averageReadingTime = posts.length > 0 
    ? Math.round(posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length)
    : 0;

  // Get related categories (other categories)
  const relatedCategories = mockCategories.filter(cat => cat.slug !== categorySlug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <Link href="/posts" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Posts
            </Link>
          </div>

          <LiquidGlassCard
            variant="glass-medium"
            blur={20}
            opacity={0.1}
            seasonalTheme
            className="p-12"
          >
            {/* Category Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: `${category.color}20`, border: `2px solid ${category.color}` }}
                >
                  <Tag className="w-8 h-8" style={{ color: category.color }} />
                </div>
                <div>
                  <Badge 
                    variant="outline" 
                    className="mb-2"
                    style={{ borderColor: category.color, color: category.color }}
                  >
                    Category
                  </Badge>
                  <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                    {category.name}
                  </h1>
                </div>
              </div>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {category.description}
              </p>

              {/* Category Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{posts.length}</div>
                  <div className="text-sm text-muted-foreground">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalViews.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{averageReadingTime}m</div>
                  <div className="text-sm text-muted-foreground">Avg. Read</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">#{mockCategories.findIndex(c => c.slug === categorySlug) + 1}</div>
                  <div className="text-sm text-muted-foreground">Category</div>
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
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">
                We haven't published any articles in this category yet. 
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
                {posts.map((post) => (
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
                  />
                ))}
              </div>

              {/* Pagination placeholder */}
              {posts.length >= 6 && (
                <div className="text-center">
                  <Button variant="outline" size="lg">
                    Load More Articles
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Related Categories Section */}
      {relatedCategories.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Explore Other Categories
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover more topics and expand your knowledge
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedCategories.map((relatedCategory) => (
                <Link 
                  key={relatedCategory.id} 
                  href={`/categories/${relatedCategory.slug}`}
                  className="block"
                >
                  <LiquidGlassCard
                    variant="glass-subtle"
                    blur={12}
                    opacity={0.08}
                    className="p-6 text-center h-full"
                    interactive
                    motionPreset="spring"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${relatedCategory.color}20`, border: `2px solid ${relatedCategory.color}` }}
                    >
                      <Tag className="w-6 h-6" style={{ color: relatedCategory.color }} />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{relatedCategory.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {relatedCategory.description}
                    </p>
                    
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{relatedCategory.postCount} posts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Popular</span>
                      </div>
                    </div>
                  </LiquidGlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CategoryPage;

// Generate static params for all categories
export async function generateStaticParams() {
  return mockCategories.map((category) => ({
    category: category.slug,
  }));
}

// Metadata generation for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const categorySlug = params.category;
  const category = mockCategories.find(cat => cat.slug === categorySlug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const posts = getAllPostsByCategory(categorySlug);

  return {
    title: `${category.name} Articles | Liquid Glass Tech Blog`,
    description: `${category.description} - Browse ${posts.length} articles about ${category.name.toLowerCase()}.`,
    keywords: [category.name.toLowerCase(), 'blog', 'articles', 'liquid glass', 'web development'],
    openGraph: {
      title: `${category.name} Articles | Liquid Glass Tech Blog`,
      description: `${category.description} - Browse ${posts.length} articles about ${category.name.toLowerCase()}.`,
      type: 'website',
      url: `/categories/${categorySlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Articles | Liquid Glass Tech Blog`,
      description: `${category.description} - Browse ${posts.length} articles about ${category.name.toLowerCase()}.`,
    },
    alternates: {
      canonical: `/categories/${categorySlug}`,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}