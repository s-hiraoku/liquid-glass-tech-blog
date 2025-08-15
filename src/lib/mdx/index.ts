/**
 * MDX Processing Library
 * 
 * Central export point for all MDX processing functionality.
 * Provides easy access to all processor functions and types.
 * 
 * @module MDXLibrary
 */

// Main processor functions
export {
  processMarkdownToMDX,
  parseFrontmatter,
  generateTableOfContents,
  applySyntaxHighlighting,
  extractMetadata
} from './mdxProcessor';

// Type definitions
export type {
  FrontmatterData,
  ParsedFrontmatter,
  ExtractedMetadata,
  TOCItem,
  ProcessedMDXContent
} from './mdxProcessor';

// Mock implementations for testing and development
export async function getAllPosts() {
  // Return immediately for testing
  return Promise.resolve([
    {
      slug: 'liquid-glass-effects-guide',
      title: 'Complete Guide to Liquid Glass Effects',
      excerpt: 'Learn how to create stunning liquid glass effects with CSS and JavaScript',
      content: `# Introduction

This is a comprehensive guide to creating liquid glass effects.

## Basic Effects

Here's how to create basic liquid glass effects:

\`\`\`css
.liquid-glass {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
\`\`\`

## Advanced Techniques

Advanced liquid glass effects require more sophisticated approaches.`,
      date: '2024-08-14',
      author: 'Tech Blog Team',
      category: 'tutorial',
      tags: ['css', 'effects', 'tutorial', 'liquid-glass'],
      eyecatch: '/images/liquid-glass-guide.jpg',
      socialImage: '/images/social/liquid-glass-guide.jpg',
      featured: true,
      readingTime: 8,
      metadata: {
        title: 'Complete Guide to Liquid Glass Effects | Liquid Glass Tech Blog',
        description: 'Learn how to create stunning liquid glass effects with CSS and JavaScript. Complete tutorial with examples.',
        keywords: ['liquid glass', 'CSS effects', 'backdrop-filter', 'web design'],
        publishedTime: '2024-08-14T10:00:00Z',
        modifiedTime: '2024-08-14T15:30:00Z',
      }
    },
    {
      slug: 'mastering-liquid-glass-effects',
      title: 'Mastering Liquid Glass Effects in Modern Web Design',
      excerpt: 'Learn how to create stunning liquid glass effects using CSS and modern web technologies.',
      content: `# Mastering Liquid Glass Effects

Advanced techniques for creating professional liquid glass effects.

## Performance Considerations

When implementing glass effects, consider these performance tips:

\`\`\`javascript
// Optimize backdrop-filter usage
const glassMorphism = {
  backdropFilter: 'blur(10px)',
  willChange: 'backdrop-filter'
};
\`\`\``,
      date: '2024-08-14',
      author: 'Design Team',
      category: 'tutorial',
      tags: ['css', 'liquid-glass', 'effects'],
      eyecatch: '/images/liquid-glass-tutorial.jpg',
      featured: true,
      readingTime: 6,
    },
    {
      slug: 'advanced-backdrop-filters',
      title: 'Advanced Backdrop Filter Techniques',
      excerpt: 'Explore advanced backdrop filter techniques',
      content: `# Advanced Backdrop Filter Techniques

Deep dive into advanced backdrop filter implementations.`,
      date: '2024-08-12',
      author: 'Tech Team',
      category: 'advanced',
      tags: ['css', 'backdrop-filter', 'performance'],
      eyecatch: '/images/backdrop-filters.jpg',
      featured: false,
      readingTime: 5,
    },
    {
      slug: 'performance-optimization-tips',
      title: 'Performance Optimization for Glass Effects',
      excerpt: 'Optimize your glass effects for 60fps performance',
      content: `# Performance Optimization for Glass Effects

Essential techniques for optimizing glass effects.`,
      date: '2024-08-10',
      author: 'Performance Team',
      category: 'performance',
      tags: ['performance', 'optimization', 'css'],
      eyecatch: '/images/performance-tips.jpg',
      featured: true,
      readingTime: 7,
    },
    {
      slug: 'glassmorphism-design-principles',
      title: 'Glassmorphism Design Principles',
      excerpt: 'Understanding the fundamental principles behind glassmorphism in modern UI design.',
      content: `# Glassmorphism Design Principles

Core principles for effective glassmorphism design.`,
      date: '2024-08-05',
      author: 'Design Team',
      category: 'design',
      tags: ['design', 'glassmorphism', 'ui'],
      eyecatch: '/images/glassmorphism-principles.jpg',
      featured: false,
      readingTime: 4,
    }
  ]);
}

export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

export async function getFeaturedPosts() {
  const posts = await getAllPosts();
  return posts.filter(post => post.featured);
}

export async function getRelatedPosts(currentSlug: string, limit: number = 3) {
  const posts = await getAllPosts();
  const currentPost = posts.find(post => post.slug === currentSlug);
  
  if (!currentPost) {
    return [];
  }
  
  // Find posts with similar tags or same category
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      let score = 0;
      
      // Same category gets higher score
      if (post.category === currentPost.category) {
        score += 3;
      }
      
      // Shared tags get points
      const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      score += sharedTags.length;
      
      return { ...post, score };
    })
    .filter(post => post.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
    
  return relatedPosts;
}

// Convenience re-exports from content types (if they exist)
// export type {
//   MDXContent,
//   TableOfContentsItem
// } from '../../types/content';