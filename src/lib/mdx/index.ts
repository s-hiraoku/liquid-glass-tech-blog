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

// Convenience re-exports from content types
export type {
  MDXContent,
  TableOfContentsItem
} from '../../types/content';