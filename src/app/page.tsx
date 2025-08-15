"use client";

/**
 * Homepage - Liquid Glass Tech Blog
 * 
 * Modern blog homepage showcasing latest posts with liquid glass effects.
 * Integrates shadcn/ui, @developer-hub/liquid-glass, and seasonal theming.
 * 
 * Features:
 * - Hero section with seasonal theme integration
 * - Latest blog posts grid with liquid glass cards
 * - Interactive effect showcase
 * - Responsive design with glassmorphism effects
 * - Performance optimized with lazy loading
 */

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, Zap } from 'lucide-react';
import { getAllPosts } from '@/lib/mdx/mdxProcessor';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Liquid Glass Components  
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard';
import { ArticleCard } from '@/components/ui/article-card';

// Types
import type { BlogPost, Author, Category, Tag } from '@/types/content';

// Mock data for demo - replace with real data fetching
const mockAuthor: Author = {
  id: '1',
  name: 'Alex Chen',
  avatar: '/avatars/alex.jpg',
  bio: 'Frontend developer passionate about modern web technologies'
};

const mockCategory: Category = {
  id: 'web-dev',
  name: 'Web Development', 
  slug: 'web-dev',
  description: 'Modern web development techniques',
  color: '#3b82f6',
  postCount: 12
};

const mockTags: Tag[] = [
  { id: '1', name: 'React', slug: 'react', postCount: 8 },
  { id: '2', name: 'TypeScript', slug: 'typescript', postCount: 6 },
  { id: '3', name: 'Liquid Glass', slug: 'liquid-glass', postCount: 4 }
];

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
      aiPrompt: 'Modern liquid glass effect with vibrant colors',
      optimizationMetrics: {
        originalSize: 245760,
        compressedSize: 89432,
        compressionRatio: 0.364
      }
    },
    author: mockAuthor,
    category: 'design',
    tags: ['react', 'liquid-glass', 'css'],
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
    category: 'performance',
    tags: ['performance', 'optimization'],
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
    category: 'web-dev',
    tags: ['typescript', 'animation'],
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
  }
];

// Simplified adapter function for working implementation
const adaptMdxPostToBlogPost = (mdxPost: any): BlogPost => ({
  id: mdxPost.slug,
  slug: mdxPost.slug,
  title: mdxPost.title,
  description: mdxPost.excerpt,
  content: mdxPost.content,
  eyecatchImage: {
    id: 'img1',
    url: mdxPost.eyecatch || '/images/default-post.jpg',
    webpUrl: mdxPost.eyecatch || '/images/default-post.webp',
    alt: mdxPost.title,
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
  category: 'tutorials',
  tags: mdxPost.tags || [],
  publishedAt: new Date(mdxPost.date || Date.now()),
  updatedAt: new Date(mdxPost.date || Date.now()),
  status: 'published' as const,
  seoData: {
    title: mdxPost.title,
    description: mdxPost.excerpt,
    keywords: mdxPost.tags || []
  },
  readingTime: mdxPost.readingTime || 5,
  viewCount: 0
});

const HomePage: React.FC = () => {
  // For testing compatibility, use React state
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const rawPosts = await getAllPosts();
        const adaptedPosts = rawPosts.map(adaptMdxPostToBlogPost);
        setPosts(adaptedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
        setError('Error loading posts. Please try again later.');
        // Don't fallback to mock posts when there's an error
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <LiquidGlassCard
            variant="glass-medium"
            blur={20}
            opacity={0.1}
            seasonalTheme
            className="p-12 text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-primary mr-3" />
              <Badge variant="outline" className="text-sm">
                Welcome to the Future of Web Design
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Liquid Glass Tech Blog
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the art of modern web development with liquid glass effects, 
              seasonal theming, and performance-optimized animations. 
              Transform your interfaces with cutting-edge glassmorphism techniques.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/posts">
                <Button size="lg" className="gap-2">
                  <BookOpen className="w-5 h-5" />
                  Explore Articles
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link href="/showcase">
                <Button variant="outline" size="lg" className="gap-2">
                  <Zap className="w-5 h-5" />
                  Effect Showcase
                </Button>
              </Link>
            </div>
          </LiquidGlassCard>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Latest Articles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay up to date with the latest techniques, tips, and best practices 
              for creating stunning liquid glass effects in modern web applications.
            </p>
          </div>
          
          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          )}

          {/* Posts Grid with Enhanced Performance Optimization */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <ArticleCard
                  key={post.id}
                  post={post}
                  variant="glass-medium"
                  interactive
                  seasonalTheme
                  showAuthor
                  showTags
                  showReadingTime
                  // Enhanced Phase 6: Device-adaptive performance configuration
                  className={index === 0 ? "priority-content" : ""} // LCP optimization for hero post
                />
              ))}
            </div>
          )}
          
          {/* View All Posts */}
          <div className="text-center mt-12">
            <Link href="/posts">
              <Button variant="outline" size="lg" className="gap-2">
                View All Articles
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Makes Us Special
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining cutting-edge technology with beautiful design to create 
              exceptional web experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LiquidGlassCard
              variant="glass-subtle"
              blur={12}
              opacity={0.08}
              className="p-8 text-center"
              interactive
            >
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Liquid Glass Effects</h3>
              <p className="text-muted-foreground">
                Master the art of glassmorphism with our comprehensive guides 
                and practical examples.
              </p>
            </LiquidGlassCard>
            
            <LiquidGlassCard
              variant="glass-subtle"
              blur={12}
              opacity={0.08}
              className="p-8 text-center"
              interactive
            >
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Performance Focused</h3>
              <p className="text-muted-foreground">
                Learn how to create beautiful effects without compromising 
                on performance or accessibility.
              </p>
            </LiquidGlassCard>
            
            <LiquidGlassCard
              variant="glass-subtle" 
              blur={12}
              opacity={0.08}
              className="p-8 text-center"
              interactive
            >
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Practical Guides</h3>
              <p className="text-muted-foreground">
                Step-by-step tutorials and real-world examples you can 
                implement in your projects today.
              </p>
            </LiquidGlassCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;