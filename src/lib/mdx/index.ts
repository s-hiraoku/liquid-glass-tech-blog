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
  extractMetadata,
  getAllPosts
} from './mdxProcessor';

// Type definitions
export type {
  FrontmatterData,
  ParsedFrontmatter,
  ExtractedMetadata,
  TOCItem,
  ProcessedMDXContent
} from './mdxProcessor';

// Post adapter utilities removed for simplicity

// Import getAllPosts for internal use in utility functions
import { getAllPosts as getAllPostsInternal } from './mdxProcessor';

// Utility functions that use the main getAllPosts function
export async function getPostBySlug(slug: string) {
  const posts = await getAllPostsInternal();
  return posts.find(post => post.slug === slug) || null;
}

export async function getFeaturedPosts() {
  const posts = await getAllPostsInternal();
  return posts.filter(post => post.featured);
}

export async function getRelatedPosts(currentSlug: string, limit: number = 3) {
  const posts = await getAllPostsInternal();
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