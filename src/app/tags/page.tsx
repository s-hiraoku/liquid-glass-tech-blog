/**
 * Tags Overview Page
 * 
 * Comprehensive listing of all available tags with post counts and filtering.
 * Features tag cloud visualization, search functionality, and liquid glass design.
 * 
 * Features:
 * - Interactive tag cloud with size-based post counts
 * - Search and filter functionality
 * - Liquid glass card layouts with seasonal theming
 * - Responsive grid with performance optimization
 * - SEO optimized with structured data
 */

import React from 'react';
import { Hash, Search, TrendingUp, Calendar, Tag as TagIcon } from 'lucide-react';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Liquid Glass Components
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard';

// Types
import type { Tag } from '@/types/content';

// Mock tags data with enhanced information
const mockTags: (Tag & { description?: string; color?: string; trending?: boolean })[] = [
  { 
    id: '1', 
    name: 'React', 
    slug: 'react', 
    postCount: 8,
    description: 'Modern React development, hooks, and component patterns',
    color: '#61dafb',
    trending: true
  },
  { 
    id: '2', 
    name: 'TypeScript', 
    slug: 'typescript', 
    postCount: 6,
    description: 'Type-safe JavaScript development and best practices',
    color: '#3178c6',
    trending: true
  },
  { 
    id: '3', 
    name: 'Liquid Glass', 
    slug: 'liquid-glass', 
    postCount: 4,
    description: 'Glassmorphism effects and liquid design techniques',
    color: '#8b5cf6',
    trending: true
  },
  { 
    id: '4', 
    name: 'Next.js', 
    slug: 'nextjs', 
    postCount: 7,
    description: 'Full-stack React framework and App Router patterns',
    color: '#000000',
    trending: true
  },
  { 
    id: '5', 
    name: 'CSS', 
    slug: 'css', 
    postCount: 9,
    description: 'Modern CSS techniques, animations, and responsive design',
    color: '#1572b6'
  },
  { 
    id: '6', 
    name: 'Animation', 
    slug: 'animation', 
    postCount: 5,
    description: 'Web animations, motion design, and performance optimization',
    color: '#ff6b6b'
  },
  { 
    id: '7', 
    name: 'Performance', 
    slug: 'performance', 
    postCount: 4,
    description: 'Web performance optimization and Core Web Vitals',
    color: '#f59e0b'
  },
  { 
    id: '8', 
    name: 'Accessibility', 
    slug: 'accessibility', 
    postCount: 3,
    description: 'WCAG compliance, inclusive design, and usability',
    color: '#10b981'
  },
  { 
    id: '9', 
    name: 'Design System', 
    slug: 'design-system', 
    postCount: 5,
    description: 'Component libraries, design tokens, and scalable UI',
    color: '#6366f1'
  },
  { 
    id: '10', 
    name: 'Web Components', 
    slug: 'web-components', 
    postCount: 3,
    description: 'Custom elements, Shadow DOM, and component architecture',
    color: '#e11d48'
  },
  { 
    id: '11', 
    name: 'Tailwind CSS', 
    slug: 'tailwind-css', 
    postCount: 6,
    description: 'Utility-first CSS framework and design patterns',
    color: '#06b6d4'
  },
  { 
    id: '12', 
    name: 'JavaScript', 
    slug: 'javascript', 
    postCount: 8,
    description: 'Modern JavaScript features, ES6+, and best practices',
    color: '#f7df1e'
  }
];

const TagsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'popularity' | 'alphabetical' | 'recent'>('popularity');

  // Filter and sort tags
  const filteredTags = React.useMemo(() => {
    let filtered = mockTags.filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tag.description && tag.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort tags
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        // In a real app, this would sort by latest posts or tag creation date
        filtered.sort((a, b) => b.postCount - a.postCount);
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.postCount - a.postCount);
    }

    return filtered;
  }, [searchQuery, sortBy]);

  // Calculate stats
  const totalTags = mockTags.length;
  const totalPosts = mockTags.reduce((sum, tag) => sum + tag.postCount, 0);
  const trendingTags = mockTags.filter(tag => tag.trending).length;

  // Get tag categories for better organization
  const popularTags = filteredTags.filter(tag => tag.postCount >= 6);
  const moderateTags = filteredTags.filter(tag => tag.postCount >= 3 && tag.postCount < 6);
  const emergingTags = filteredTags.filter(tag => tag.postCount < 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Blog Tags',
            description: 'Browse all topics and tags available on our blog',
            url: 'https://liquid-glass-tech.com/tags',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: mockTags.length,
              itemListElement: mockTags.map((tag, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'DefinedTerm',
                  name: tag.name,
                  description: tag.description,
                  url: `/tags/${tag.slug}`,
                }
              }))
            }
          }),
        }}
      />

      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Hash className="w-8 h-8 text-primary mr-3" />
              <Badge variant="outline">All Topics</Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Explore All Tags
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover articles by topic. From React and TypeScript to liquid glass effects 
              and performance optimization - find exactly what you're looking for.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalTags}</div>
                <div className="text-sm text-muted-foreground">Total Tags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalPosts}</div>
                <div className="text-sm text-muted-foreground">Tagged Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{trendingTags}</div>
                <div className="text-sm text-muted-foreground">Trending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Math.round(totalPosts / totalTags)}</div>
                <div className="text-sm text-muted-foreground">Avg. Posts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b">
        <div className="max-w-7xl mx-auto">
          <LiquidGlassCard
            variant="glass-subtle"
            blur={10}
            opacity={0.05}
            className="p-6"
            data-testid="search-filter-card"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="tag-search-input"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 bg-background border border-border rounded-md text-sm min-w-[120px]"
                  data-testid="sort-select"
                >
                  <option value="popularity">Popularity</option>
                  <option value="alphabetical">A-Z</option>
                  <option value="recent">Recent</option>
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTags.length} of {totalTags} tags
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
          </LiquidGlassCard>
        </div>
      </section>

      {/* Tags Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredTags.length === 0 ? (
            <div className="text-center py-12" data-testid="no-tags-message">
              <Hash className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tags found</h3>
              <p className="text-muted-foreground mb-6">
                No tags match your search criteria. Try adjusting your search.
              </p>
              <Button onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Popular Tags</h2>
                    <Badge variant="secondary">{popularTags.length}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularTags.map((tag) => (
                      <Link key={tag.id} href={`/tags/${tag.slug}`} className="block">
                        <LiquidGlassCard
                          variant="glass-medium"
                          blur={12}
                          opacity={0.08}
                          className="p-6 h-full"
                          interactive
                          motionPreset="spring"
                          data-testid={`popular-tag-${tag.slug}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ 
                                  backgroundColor: tag.color ? `${tag.color}20` : '#8b5cf620',
                                  border: `2px solid ${tag.color || '#8b5cf6'}40`
                                }}
                              >
                                <Hash 
                                  className="w-5 h-5" 
                                  style={{ color: tag.color || '#8b5cf6' }}
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{tag.name}</h3>
                                {tag.trending && (
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    Trending
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className="font-mono">
                              {tag.postCount}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground text-sm mb-4">
                            {tag.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{tag.postCount} articles</span>
                            <span className="text-primary">View all →</span>
                          </div>
                        </LiquidGlassCard>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Moderate Tags */}
              {moderateTags.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <TagIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">More Topics</h2>
                    <Badge variant="secondary">{moderateTags.length}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {moderateTags.map((tag) => (
                      <Link key={tag.id} href={`/tags/${tag.slug}`} className="block">
                        <LiquidGlassCard
                          variant="glass-subtle"
                          blur={8}
                          opacity={0.06}
                          className="p-4 text-center"
                          interactive
                          motionPreset="subtle"
                          data-testid={`moderate-tag-${tag.slug}`}
                        >
                          <Hash className="w-5 h-5 text-primary mx-auto mb-2" />
                          <div className="font-medium text-sm mb-1">{tag.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {tag.postCount}
                          </Badge>
                        </LiquidGlassCard>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Emerging Tags */}
              {emergingTags.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <Calendar className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Emerging Topics</h2>
                    <Badge variant="secondary">{emergingTags.length}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {emergingTags.map((tag) => (
                      <Link key={tag.id} href={`/tags/${tag.slug}`}>
                        <LiquidGlassCard
                          variant="glass-subtle"
                          blur={6}
                          opacity={0.04}
                          className="px-4 py-2"
                          interactive
                          motionPreset="subtle"
                          data-testid={`emerging-tag-${tag.slug}`}
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <Hash className="w-3 h-3 text-primary" />
                            <span>{tag.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {tag.postCount}
                            </Badge>
                          </div>
                        </LiquidGlassCard>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Cloud Visualization */}
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Tag Cloud
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Visual representation of all our topics
                  </p>
                </div>
                
                <LiquidGlassCard
                  variant="glass-subtle"
                  blur={10}
                  opacity={0.05}
                  className="p-8"
                  data-testid="tag-cloud"
                >
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    {filteredTags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.slug}`}
                        className="inline-block transition-all duration-200 hover:scale-110"
                        style={{
                          fontSize: `${Math.max(0.75, Math.min(2, tag.postCount / 5 + 0.8))}rem`,
                          fontWeight: tag.postCount > 6 ? 'bold' : tag.postCount > 3 ? 'semibold' : 'normal',
                          color: tag.trending ? '#8b5cf6' : undefined
                        }}
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </LiquidGlassCard>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TagsPage;

// Metadata for SEO
export const metadata = {
  title: 'All Tags | Liquid Glass Tech Blog',
  description: 'Explore all topics and tags on our blog. Find articles about React, TypeScript, liquid glass effects, performance optimization, and more.',
  keywords: ['blog tags', 'topics', 'categories', 'React', 'TypeScript', 'liquid glass', 'web development'],
  openGraph: {
    title: 'All Tags | Liquid Glass Tech Blog',
    description: 'Explore all topics and tags on our blog. Find articles about React, TypeScript, liquid glass effects, performance optimization, and more.',
    type: 'website',
    url: '/tags',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Tags | Liquid Glass Tech Blog',
    description: 'Explore all topics and tags on our blog. Find articles about React, TypeScript, liquid glass effects, performance optimization, and more.',
  },
  alternates: {
    canonical: '/tags',
  },
  robots: {
    index: true,
    follow: true,
  }
};