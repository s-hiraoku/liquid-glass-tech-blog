"use client";

/**
 * Effect Showcase Page
 * 
 * Interactive gallery showcasing all available liquid glass effects.
 * Features filtering, live preview, and customization options.
 * 
 * Phase 7.2 Implementation:
 * - @developer-hub/liquid-glass showcase integration
 * - shadcn/ui components for filtering and layout
 * - glasscn-ui styling throughout
 * - Real-time filtering and search
 * - Interactive effect demonstrations
 */

import React from 'react';
import { Filter, Search, Sparkles, Download, Eye, Heart } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

// Liquid Glass Components
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard';

// Types
import type { EffectData, EffectCategory } from '@/types/liquid-glass';

// Mock data - replace with real data
const mockCategories: EffectCategory[] = [
  { id: 'buttons', name: 'Buttons', description: 'Interactive button effects', effectCount: 12 },
  { id: 'cards', name: 'Cards', description: 'Card component effects', effectCount: 18 },
  { id: 'navigation', name: 'Navigation', description: 'Navigation menu effects', effectCount: 8 },
  { id: 'overlays', name: 'Overlays', description: 'Modal and popup effects', effectCount: 15 },
  { id: 'backgrounds', name: 'Backgrounds', description: 'Background patterns', effectCount: 22 }
];

const mockEffects: EffectData[] = [
  {
    id: 'glass-button-1',
    name: 'Subtle Glass Button',
    description: 'A lightweight glass effect perfect for primary actions',
    code: `<button class="glass-button-subtle">Click me</button>`,
    parameters: {
      blur: 12,
      opacity: 0.1,
      saturation: 1.2,
      brightness: 1.0
    },
    previewImage: '/effects/glass-button-1.jpg',
    category: mockCategories[0],
    difficulty: 'beginner',
    performance: {
      lcp: 1.2,
      inp: 45,
      cls: 0.05,
      fcp: 0.8,
      ttfb: 0.3,
      effectRenderTime: 2.5,
      gpuUsage: 15,
      memoryUsage: 8,
      frameRate: 60
    },
    compatibility: {
      chrome: '88+',
      firefox: '85+',
      safari: '14+',
      edge: '88+',
      mobile: true,
      fallbackStrategy: 'graceful'
    },
    createdBy: 'Alex Chen',
    createdAt: new Date('2024-01-15'),
    downloads: 1247,
    likes: 89,
    tags: ['button', 'subtle', 'interactive']
  },
  {
    id: 'glass-card-1',
    name: 'Modern Glass Card',
    description: 'A sophisticated card design with adaptive glass effects',
    code: `<div class="glass-card-modern">Content here</div>`,
    parameters: {
      blur: 20,
      opacity: 0.15,
      saturation: 1.8,
      brightness: 1.1
    },
    previewImage: '/effects/glass-card-1.jpg',
    category: mockCategories[1],
    difficulty: 'intermediate',
    performance: {
      lcp: 1.8,
      inp: 52,
      cls: 0.02,
      fcp: 1.1,
      ttfb: 0.4,
      effectRenderTime: 3.2,
      gpuUsage: 22,
      memoryUsage: 12,
      frameRate: 58
    },
    compatibility: {
      chrome: '90+',
      firefox: '87+',
      safari: '14.5+',
      edge: '90+',
      mobile: true,
      fallbackStrategy: 'graceful'
    },
    createdBy: 'Sarah Kim',
    createdAt: new Date('2024-01-12'),
    downloads: 892,
    likes: 67,
    tags: ['card', 'modern', 'adaptive']
  },
  {
    id: 'glass-nav-1',
    name: 'Floating Navigation',
    description: 'A sleek navigation bar with seasonal theme integration',
    code: `<nav class="glass-nav-floating">Navigation items</nav>`,
    parameters: {
      blur: 25,
      opacity: 0.12,
      saturation: 1.5,
      brightness: 0.95
    },
    previewImage: '/effects/glass-nav-1.jpg',
    category: mockCategories[2],
    difficulty: 'advanced',
    performance: {
      lcp: 2.1,
      inp: 48,
      cls: 0.08,
      fcp: 1.3,
      ttfb: 0.5,
      effectRenderTime: 4.1,
      gpuUsage: 28,
      memoryUsage: 15,
      frameRate: 55
    },
    compatibility: {
      chrome: '92+',
      firefox: '89+',
      safari: '15+',
      edge: '92+',
      mobile: false,
      fallbackStrategy: 'alternative'
    },
    createdBy: 'Mike Johnson',
    createdAt: new Date('2024-01-10'),
    downloads: 1456,
    likes: 142,
    tags: ['navigation', 'floating', 'seasonal']
  }
];

const ShowcasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<string>('latest');

  // Filter effects based on search and category
  const filteredEffects = React.useMemo(() => {
    return mockEffects.filter(effect => {
      const matchesSearch = effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           effect.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           effect.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || effect.category.id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Sort effects
  const sortedEffects = React.useMemo(() => {
    const sorted = [...filteredEffects];
    
    switch (sortBy) {
      case 'popular':
        return sorted.sort((a, b) => b.downloads - a.downloads);
      case 'likes':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'latest':
      default:
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }, [filteredEffects, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary mr-3" />
            <Badge variant="outline">Interactive Effect Gallery</Badge>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Liquid Glass Effects Showcase
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our comprehensive collection of liquid glass effects. 
            Preview, customize, and download ready-to-use components for your projects.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{mockEffects.length}</div>
              <div className="text-sm text-muted-foreground">Effects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{mockCategories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {mockEffects.reduce((sum, effect) => sum + effect.downloads, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {mockEffects.reduce((sum, effect) => sum + effect.likes, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b">
        <div className="max-w-7xl mx-auto">
          <LiquidGlassCard
            variant="glass-subtle"
            blur={10}
            opacity={0.05}
            className="p-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search effects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  {mockCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.effectCount})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory('all')}
              >
                All Effects
              </Badge>
              {mockCategories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </LiquidGlassCard>
        </div>
      </section>

      {/* Effects Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {sortedEffects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No effects found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEffects.map((effect) => (
                <LiquidGlassCard
                  key={effect.id}
                  variant="glass-medium"
                  blur={15}
                  opacity={0.1}
                  interactive
                  className="p-6 h-full flex flex-col"
                >
                  {/* Preview Image */}
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Effect Preview</div>
                  </div>

                  {/* Effect Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{effect.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {effect.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {effect.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {effect.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{effect.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{effect.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </LiquidGlassCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShowcasePage;