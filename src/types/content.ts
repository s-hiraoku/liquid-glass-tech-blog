/**
 * Blog Content Management Types
 * 
 * Comprehensive type definitions for blog content management, including
 * posts, media, authors, and metadata. These types support both traditional
 * blog functionality and advanced features like AI-generated content,
 * performance optimization, and liquid glass effects integration.
 * 
 * @module ContentTypes
 * @author Liquid Glass Tech Blog Team
 * @version 1.0.0
 */

/**
 * Blog Post Interface
 * 
 * Complete representation of a blog post with metadata, content, and
 * associated resources. Supports both traditional and AI-enhanced features.
 * 
 * @interface BlogPost
 * @property {string} id - Unique post identifier
 * @property {string} slug - URL-friendly post identifier
 * @property {string} title - Post title
 * @property {string} description - Post description/excerpt
 * @property {string} content - Full MDX content
 * @property {EyecatchImage} eyecatchImage - Featured image with optimizations
 * @property {Author} author - Post author information
 * @property {Category} category - Post category
 * @property {Tag[]} tags - Associated tags
 * @property {Date} publishedAt - Publication date
 * @property {Date} updatedAt - Last update date
 * @property {'draft'|'published'|'archived'} status - Publication status
 * @property {SEOData} seoData - SEO metadata
 * @property {EffectData[]} [liquidGlassEffects] - Optional glass effects
 * @property {number} readingTime - Estimated reading time in minutes
 * @property {number} viewCount - View count analytics
 */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  content: string; // MDX content
  eyecatch?: {
    url: string;
    alt: string;
  };
  eyecatchImage?: EyecatchImage;
  author: Author;
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt?: Date;
  status?: 'draft' | 'published' | 'archived';
  seoData?: SEOData;
  liquidGlassEffects?: EffectData[];
  readingTime: number;
  viewCount?: number;
  likes?: number;
  views?: number;
}

export interface EyecatchImage {
  id: string;
  url: string;
  webpUrl: string;
  avifUrl?: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string; // Base64 placeholder
  generatedBy: 'ai' | 'upload';
  aiPrompt?: string;
  optimizationMetrics: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  };
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  postCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
}

// Import EffectData from liquid-glass types
import type { EffectData } from './liquid-glass';

export interface MDXContent {
  source: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    [key: string]: any;
  };
  scope: Record<string, any>;
  compiledSource: string;
  tableOfContents: TableOfContentsItem[];
  readingTime: number;
  wordCount: number;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children: TableOfContentsItem[];
}