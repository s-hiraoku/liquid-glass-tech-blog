/**
 * Phase 3.6: Content Search System Implementation (REFACTORED)
 * 
 * TDD-driven search engine with full-text search, relevance scoring,
 * and performance optimization. Built following t-wada methodology.
 * 
 * REFACTORED IMPROVEMENTS:
 * - Optimized token processing and index management
 * - Enhanced TF-IDF algorithm with better scoring accuracy
 * - Improved memory usage for large datasets
 * - Better error handling and edge case management
 * - More maintainable code structure with cleaner separation of concerns
 * 
 * Features:
 * - Full-text search across title, content, and tags
 * - TF-IDF relevance scoring with custom weighting
 * - Search result highlighting with configurable snippets
 * - Performance optimization (< 200ms response time)
 * - Search history and autocomplete suggestions
 * - Advanced filtering by category, tags, date range
 * 
 * Requirements: REQ-1.5, REQ-4.5 (Phase 3.5-3.6)
 */

import type { BlogPost } from '@/types/content';

/**
 * Search query interface defining all search parameters
 */
export interface SearchQuery {
  text: string;
  fields: string[];
  limit: number;
  highlight?: boolean;
  exactMatch?: boolean;
  filters?: {
    category?: string;
    tags?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
}

/**
 * Search result with scoring and highlighting
 */
export interface SearchResult {
  document: BlogPost;
  score: number;
  highlights?: SearchHighlight[];
  relevanceFactors: {
    titleMatch: number;
    contentMatch: number;
    tagMatch: number;
    uniqueness: number;
    recency: number;
  };
}

/**
 * Highlighted text snippet
 */
export interface SearchHighlight {
  field: string;
  snippet: string;
  matchCount: number;
}

/**
 * Search index entry
 */
export interface SearchIndex {
  documentId: string;
  field: string;
  tokens: string[];
  termFrequencies: Map<string, number>;
}

/**
 * Search history entry
 */
export interface SearchHistoryEntry {
  text: string;
  timestamp: number;
  frequency?: number;
}

/**
 * High-performance search engine with TF-IDF scoring
 */
export class SearchEngine {
  private index: Map<string, SearchIndex[]> = new Map();
  private documents: Map<string, BlogPost> = new Map();
  private termDocumentFrequency: Map<string, number> = new Map();
  private totalDocuments = 0;
  
  /**
   * Field weights for relevance scoring
   */
  private fieldWeights = {
    title: 3.0,
    content: 1.0,
    tags: 2.0
  };

  /**
   * Get the current index size
   */
  getIndexSize(): number {
    return this.documents.size;
  }

  /**
   * Index documents for search
   */
  indexDocuments(posts: BlogPost[]): void {
    this.documents.clear();
    this.index.clear();
    this.termDocumentFrequency.clear();
    this.totalDocuments = posts.length;

    // First pass: index all documents
    for (const post of posts) {
      this.documents.set(post.id, post);
      this.indexDocument(post);
    }

    // Second pass: calculate document frequencies
    this.calculateDocumentFrequencies();
  }

  /**
   * Index a single document
   */
  private indexDocument(post: BlogPost): void {
    const fields = {
      title: post.title,
      content: post.content,
      tags: post.tags.join(' ')
    };

    Object.entries(fields).forEach(([field, text]) => {
      if (!text) return;
      
      const tokens = this.tokenize(text);
      const termFreq = new Map<string, number>();
      
      // Count term frequencies
      tokens.forEach(token => {
        termFreq.set(token, (termFreq.get(token) || 0) + 1);
      });

      const indexEntry: SearchIndex = {
        documentId: post.id,
        field,
        tokens,
        termFrequencies: termFreq
      };

      if (!this.index.has(post.id)) {
        this.index.set(post.id, []);
      }
      this.index.get(post.id)!.push(indexEntry);
    });
  }

  /**
   * Calculate document frequencies for TF-IDF
   */
  private calculateDocumentFrequencies(): void {
    this.termDocumentFrequency.clear();
    
    this.index.forEach(entries => {
      const uniqueTerms = new Set<string>();
      
      entries.forEach(entry => {
        entry.termFrequencies.forEach((freq, term) => {
          uniqueTerms.add(term);
        });
      });
      
      uniqueTerms.forEach(term => {
        this.termDocumentFrequency.set(
          term,
          (this.termDocumentFrequency.get(term) || 0) + 1
        );
      });
    });
  }

  /**
   * Tokenize text for indexing with improved processing
   * REFACTORED: Better normalization and stopword handling
   */
  private tokenize(text: string): string[] {
    if (!text || typeof text !== 'string') {
      return [];
    }
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 1 && !this.isStopWord(token))
      .slice(0, 500); // Prevent excessive tokens from very long content
  }
  
  /**
   * Check if a token is a stop word
   * REFACTORED: Added stop word filtering for better relevance
   */
  private isStopWord(token: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must'
    ]);
    return stopWords.has(token);
  }

  /**
   * Perform search with TF-IDF scoring
   * REFACTORED: Enhanced error handling and input validation
   */
  async search(query: SearchQuery): Promise<SearchResult[]> {
    try {
      const startTime = performance.now();
      
      // Input validation
      if (!query || !query.text || typeof query.text !== 'string') {
        return [];
      }
      
      if (!query.fields || !Array.isArray(query.fields) || query.fields.length === 0) {
        return [];
      }
      
      const queryTokens = this.tokenize(query.text);
      if (queryTokens.length === 0) {
        return [];
      }
      
      // Performance optimization: Early return for empty index
      if (this.totalDocuments === 0) {
        return [];
      }

      const results = new Map<string, SearchResult>();

      // Search through index
    this.index.forEach((entries, documentId) => {
      const document = this.documents.get(documentId);
      if (!document) return;

      // Apply filters
      if (!this.passesFilters(document, query.filters)) {
        return;
      }

      let totalScore = 0;
      const relevanceFactors = {
        titleMatch: 0,
        contentMatch: 0,
        tagMatch: 0,
        uniqueness: 0,
        recency: 0
      };

      // Calculate score for each field
      entries.forEach(entry => {
        if (!query.fields.includes(entry.field)) return;

        let fieldScore = 0;
        let matchedTerms = 0;

        queryTokens.forEach(queryToken => {
          const termFreq = entry.termFrequencies.get(queryToken) || 0;
          if (termFreq > 0) {
            matchedTerms++;
            
            // Calculate TF-IDF score
            const tf = termFreq / entry.tokens.length;
            const docFreq = this.termDocumentFrequency.get(queryToken) || 1;
            const idf = Math.log(this.totalDocuments / docFreq);
            const tfIdf = tf * idf;

            fieldScore += tfIdf;
            
            // Track uniqueness (rare terms score higher)
            relevanceFactors.uniqueness += idf / queryTokens.length;
          }
        });

        // Apply field weights
        const fieldWeight = this.fieldWeights[entry.field as keyof typeof this.fieldWeights] || 1.0;
        fieldScore *= fieldWeight;
        totalScore += fieldScore;

        // Track field-specific matches
        if (fieldScore > 0) {
          relevanceFactors[`${entry.field}Match` as keyof typeof relevanceFactors] = fieldScore;
        }
      });

      // Boost score for exact matches
      if (query.exactMatch && this.hasExactMatch(document, query.text, query.fields)) {
        totalScore *= 2.0;
      }

      // Recency boost (newer posts score slightly higher)
      const ageInDays = (Date.now() - document.publishedAt.getTime()) / (1000 * 60 * 60 * 24);
      relevanceFactors.recency = Math.max(0, 1 - ageInDays / 365); // Decay over a year
      totalScore += relevanceFactors.recency * 0.1;

      if (totalScore > 0) {
        const result: SearchResult = {
          document,
          score: totalScore,
          relevanceFactors,
          highlights: query.highlight ? this.generateHighlights(document, queryTokens, query.fields) : undefined
        };
        
        results.set(documentId, result);
      }
    });

    // Sort by relevance score and apply limit
    const sortedResults = Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, query.limit);

    // Save search to history
    this.saveSearchHistory(query.text);

      const endTime = performance.now();
      console.debug(`Search completed in ${endTime - startTime}ms`);

      return sortedResults;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  /**
   * Check if document passes filters
   */
  private passesFilters(document: BlogPost, filters?: SearchQuery['filters']): boolean {
    if (!filters) return true;

    // Category filter
    if (filters.category && document.category !== filters.category) {
      return false;
    }

    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => document.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const publishDate = new Date(document.publishedAt);
      if (publishDate < filters.dateRange.start || publishDate > filters.dateRange.end) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check for exact phrase matches
   */
  private hasExactMatch(document: BlogPost, queryText: string, fields: string[]): boolean {
    const lowercaseQuery = queryText.toLowerCase();
    
    for (const field of fields) {
      let content = '';
      switch (field) {
        case 'title':
          content = document.title.toLowerCase();
          break;
        case 'content':
          content = document.content.toLowerCase();
          break;
        case 'tags':
          content = document.tags.join(' ').toLowerCase();
          break;
      }
      
      if (content.includes(lowercaseQuery)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Generate highlighted snippets
   */
  private generateHighlights(document: BlogPost, queryTokens: string[], fields: string[]): SearchHighlight[] {
    const highlights: SearchHighlight[] = [];

    fields.forEach(field => {
      let content = '';
      switch (field) {
        case 'title':
          content = document.title;
          break;
        case 'content':
          content = document.content;
          break;
        case 'tags':
          content = document.tags.join(' ');
          break;
      }

      if (!content) return;

      let highlightedContent = content;
      let matchCount = 0;

      // Highlight each query token
      queryTokens.forEach(token => {
        const regex = new RegExp(`\\b${token}\\b`, 'gi');
        const matches = content.match(regex);
        if (matches) {
          matchCount += matches.length;
          highlightedContent = highlightedContent.replace(regex, `<mark>$&</mark>`);
        }
      });

      if (matchCount > 0) {
        // Create snippet (first 200 characters around matches)
        const firstMatch = highlightedContent.indexOf('<mark>');
        const start = Math.max(0, firstMatch - 100);
        const end = Math.min(highlightedContent.length, firstMatch + 300);
        let snippet = highlightedContent.substring(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < highlightedContent.length) snippet = snippet + '...';

        highlights.push({
          field,
          snippet,
          matchCount
        });
      }
    });

    return highlights;
  }

  /**
   * Save search query to history
   * REFACTORED: Better error handling and data validation
   */
  private saveSearchHistory(query: string): void {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return;
    }
    
    try {
      const history = this.getSearchHistory();
      const trimmedQuery = query.trim().toLowerCase();
      const existingEntry = history.find(entry => 
        entry.text && entry.text.toLowerCase() === trimmedQuery
      );
      
      if (existingEntry) {
        existingEntry.timestamp = Date.now();
        existingEntry.frequency = Math.max((existingEntry.frequency || 1) + 1, 1);
      } else {
        history.unshift({
          text: trimmedQuery,
          timestamp: Date.now(),
          frequency: 1
        });
      }

      // Keep only last 50 searches, filter out invalid entries
      const trimmedHistory = history
        .filter(entry => entry.text && typeof entry.text === 'string')
        .slice(0, 50);
      
      localStorage.setItem('search_history', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }

  /**
   * Get search history
   */
  getSearchHistory(): SearchHistoryEntry[] {
    try {
      const history = localStorage.getItem('search_history');
      if (!history) return [];
      
      return JSON.parse(history).sort((a: SearchHistoryEntry, b: SearchHistoryEntry) => 
        b.timestamp - a.timestamp
      );
    } catch (error) {
      console.warn('Failed to load search history:', error);
      return [];
    }
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(partialQuery: string): Promise<string[]> {
    const lowercaseQuery = partialQuery.toLowerCase();
    const suggestions = new Set<string>();

    // Get suggestions from search history
    const history = this.getSearchHistory();
    history
      .filter(entry => entry.text.toLowerCase().includes(lowercaseQuery))
      .sort((a, b) => (b.frequency || 1) - (a.frequency || 1))
      .slice(0, 5)
      .forEach(entry => suggestions.add(entry.text));

    // Get suggestions from indexed content
    const tokens = new Set<string>();
    this.index.forEach(entries => {
      entries.forEach(entry => {
        entry.tokens
          .filter(token => token.startsWith(lowercaseQuery))
          .forEach(token => tokens.add(token));
      });
    });

    // Add top matching tokens
    Array.from(tokens)
      .slice(0, 5)
      .forEach(token => suggestions.add(token));

    return Array.from(suggestions).slice(0, 10);
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    localStorage.removeItem('search_history');
  }
}