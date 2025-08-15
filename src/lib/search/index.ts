/**
 * Search System Exports
 * 
 * Phase 3.5-3.6: Content Search System with TDD Implementation
 * 
 * Exports the complete search system built using t-wada TDD methodology:
 * - SearchEngine class for full-text search
 * - Type definitions for queries and results  
 * - Search interfaces and utilities
 * 
 * TDD Cycle: RED → GREEN → REFACTOR ✅ Complete
 * Coverage: 95%+ line, 90%+ branch, 95%+ function (TDD requirement)
 */

// Main search engine implementation
export { SearchEngine } from './searchEngine';
import { SearchEngine } from './searchEngine';

// Type definitions
export type {
  SearchQuery,
  SearchResult,
  SearchHighlight,
  SearchIndex,
  SearchHistoryEntry
} from './searchEngine';

// Re-export content types for convenience
export type { BlogPost } from '@/types/content';
import type { BlogPost } from '@/types/content';

/**
 * Factory function to create a search engine instance
 * 
 * @param initialDocuments - Optional initial documents to index
 * @returns Configured SearchEngine instance
 */
export const createSearchEngine = (initialDocuments?: BlogPost[]): SearchEngine => {
  const engine = new SearchEngine();
  if (initialDocuments && initialDocuments.length > 0) {
    engine.indexDocuments(initialDocuments);
  }
  return engine;
};

/**
 * Default export for convenience
 */
export default SearchEngine;