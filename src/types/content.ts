export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string; // MDX content
  eyecatchImage: EyecatchImage;
  author: Author;
  category: Category;
  tags: Tag[];
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  seoData: SEOData;
  liquidGlassEffects?: EffectData[];
  readingTime: number;
  viewCount: number;
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
  email: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
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
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  noindex?: boolean;
}

// Import EffectData from liquid-glass types
import type { EffectData } from './liquid-glass';

export interface MDXContent {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    tags: string[];
    category: string;
    eyecatch?: string;
    author: string;
  };
  content: string;
  readingTime: number;
  headings: TableOfContentsItem[];
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children: TableOfContentsItem[];
}