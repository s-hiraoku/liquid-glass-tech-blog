/**
 * Posts List Page
 * 
 * Main blog posts listing page with filtering, search, and pagination.
 * Features liquid glass design, seasonal theming, and responsive layout.
 * 
 * Features:
 * - Modern grid layout with liquid glass cards
 * - Advanced filtering by category, tags, and date
 * - Real-time search functionality
 * - Responsive design with glassmorphism effects
 * - SEO optimized with structured data
 */

import React from 'react';
import { Search, Calendar, Filter, ArrowRight, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Liquid Glass Components
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard';
import { BlogPostCard } from '@/components/blog/BlogPostCard';

// Types
import type { BlogPost, Author, Category, Tag } from '@/types/liquid-glass';

// Mock data - replace with real data fetching in production
const mockAuthor: Author = {
  id: '1',
  name: 'Alex Chen',
  avatar: '/avatars/alex.jpg',
  bio: 'Frontend developer passionate about modern web technologies'
};

const mockCategories: Category[] = [
  { id: 'web-dev', name: 'Web Development', slug: 'web-dev', description: 'Modern web development', color: '#3b82f6', postCount: 12 },
  { id: 'design', name: 'Design', slug: 'design', description: 'UI/UX Design', color: '#10b981', postCount: 8 },
  { id: 'performance', name: 'Performance', slug: 'performance', description: 'Web Performance', color: '#f59e0b', postCount: 6 },
  { id: 'tutorials', name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step guides', color: '#8b5cf6', postCount: 15 }
];

const mockTags: Tag[] = [
  { id: '1', name: 'React', slug: 'react', postCount: 8 },
  { id: '2', name: 'TypeScript', slug: 'typescript', postCount: 6 },
  { id: '3', name: 'Liquid Glass', slug: 'liquid-glass', postCount: 4 },
  { id: '4', name: 'Next.js', slug: 'nextjs', postCount: 7 },
  { id: '5', name: 'CSS', slug: 'css', postCount: 9 },
  { id: '6', name: 'Animation', slug: 'animation', postCount: 5 }
];

// Extended mock posts for demonstration
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
    author: mockAuthor,
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[2], mockTags[4]],
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
    author: mockAuthor,
    category: mockCategories[2],
    tags: [mockTags[0], mockTags[2], mockTags[5]],
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
    slug: 'seasonal-theming-guide',
    title: 'Creating Dynamic Seasonal Themes',
    description: 'Build responsive themes that adapt to seasons, time of day, and weather conditions automatically.',
    content: '# Creating Dynamic Seasonal Themes...',
    eyecatchImage: {
      id: 'img3',
      url: '/images/seasonal-hero.jpg',
      webpUrl: '/images/seasonal-hero.webp',
      alt: 'Seasonal theming showcase',
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
    author: mockAuthor,
    category: mockCategories[1],
    tags: [mockTags[1], mockTags[2], mockTags[4]],
    publishedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    status: 'published',
    seoData: {
      title: 'Creating Dynamic Seasonal Themes',
      description: 'Build responsive themes that adapt to seasons, time of day, and weather conditions automatically.',
      keywords: ['seasonal themes', 'dynamic themes', 'responsive design']
    },
    readingTime: 10,
    viewCount: 1456
  },
  {
    id: '4',
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
    author: mockAuthor,
    category: mockCategories[3],
    tags: [mockTags[0], mockTags[3], mockTags[2]],
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

const PostsListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<string>('latest');

  // Filter and sort posts
  const filteredPosts = React.useMemo(() => {
    let filtered = mockPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || post.category.id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort posts
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'reading-time':
        filtered.sort((a, b) => a.readingTime - b.readingTime);
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Calculate stats
  const totalPosts = mockPosts.length;
  const totalViews = mockPosts.reduce((sum, post) => sum + post.viewCount, 0);
  const averageReadingTime = Math.round(mockPosts.reduce((sum, post) => sum + post.readingTime, 0) / mockPosts.length);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-primary mr-3" />
              <Badge variant="outline">Tech Blog</Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              All Blog Posts
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore our complete collection of articles on liquid glass effects, 
              modern web development, performance optimization, and design techniques.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalPosts}</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mockCategories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalViews.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{averageReadingTime}m</div>
                <div className="text-sm text-muted-foreground">Avg. Read</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b">
        <div className="max-w-7xl mx-auto">
          <LiquidGlassCard
            variant="glass-subtle"
            blur={10}
            opacity={0.05}
            className="p-6"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-background border border-border rounded-md text-sm min-w-[150px]"
                  >
                    <option value="all">All Categories</option>
                    {mockCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-md text-sm min-w-[120px]"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="reading-time">Quick Read</option>
                </select>
              </div>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
              <Badge
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory('all')}
              >
                All Posts
              </Badge>
              {mockCategories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                  style={
                    selectedCategory === category.id 
                      ? { backgroundColor: category.color, borderColor: category.color }
                      : {}
                  }
                >
                  {category.name} ({category.postCount})
                </Badge>
              ))}
            </div>
          </LiquidGlassCard>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                No articles match your current search and filter criteria.
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredPosts.length} of {totalPosts} articles
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedCategory !== 'all' && ` in ${mockCategories.find(c => c.id === selectedCategory)?.name}`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
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

              {/* Load More (placeholder for pagination) */}
              {filteredPosts.length >= 6 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" className="gap-2">
                    Load More Articles
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostsListPage;