/**
 * MDX Processing Engine
 * 
 * Comprehensive MDX processing functionality for converting Markdown content
 * to processed MDX with frontmatter parsing, table of contents generation,
 * syntax highlighting, and liquid glass effects integration.
 * 
 * @module MDXProcessor
 * @author Liquid Glass Tech Blog Team
 * @version 1.0.0
 */

import matter from 'gray-matter';

/**
 * Frontmatter data structure extracted from YAML headers
 */
export interface FrontmatterData {
  title?: string;
  description?: string;
  tags?: string[];
  publishedAt?: string;
  author?: string;
  category?: string;
  slug?: string;
  [key: string]: any;
}

/**
 * Parsed frontmatter result
 */
export interface ParsedFrontmatter {
  data: FrontmatterData;
  content: string;
}

/**
 * Extracted and validated metadata
 */
export interface ExtractedMetadata {
  title: string;
  description: string;
  tags: string[];
  publishedAt: Date;
  author: string;
  category: string;
  slug: string;
}

/**
 * Table of contents item
 */
export interface TOCItem {
  id: string;
  title: string;
  level: number;
  children: TOCItem[];
}

/**
 * Complete processed MDX content result
 */
export interface ProcessedMDXContent {
  metadata: ExtractedMetadata;
  processedContent: string;
  tableOfContents: TOCItem[];
  readingTime: number;
  wordCount: number;
  errors: string[];
}

/**
 * Parse YAML frontmatter from markdown content
 * 
 * @param markdown - Raw markdown content with optional frontmatter
 * @returns Parsed frontmatter data and content
 */
export function parseFrontmatter(markdown: string): ParsedFrontmatter {
  try {
    const parsed = matter(markdown);
    return {
      data: parsed.data as FrontmatterData,
      content: parsed.content
    };
  } catch (error) {
    return {
      data: {},
      content: markdown
    };
  }
}

/**
 * Extract and validate metadata from frontmatter data
 * 
 * @param frontmatterData - Raw frontmatter data
 * @returns Validated and processed metadata
 */
export function extractMetadata(frontmatterData: FrontmatterData): ExtractedMetadata {
  const title = frontmatterData.title || '';
  const slug = frontmatterData.slug || generateSlug(title);
  
  return {
    title,
    description: frontmatterData.description || '',
    tags: frontmatterData.tags || [],
    publishedAt: frontmatterData.publishedAt ? new Date(frontmatterData.publishedAt) : new Date(),
    author: frontmatterData.author || '',
    category: frontmatterData.category || '',
    slug
  };
}

/**
 * Generate URL-friendly slug from title
 * 
 * @param title - Post title
 * @returns URL-friendly slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Generate table of contents from markdown headings
 * 
 * @param markdownContent - Markdown content to parse
 * @returns Hierarchical table of contents
 */
export function generateTableOfContents(markdownContent: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; title: string; id: string }> = [];
  const usedIds = new Set<string>();
  
  let match;
  while ((match = headingRegex.exec(markdownContent)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    let id = generateSlug(title);
    
    // Handle duplicate IDs
    let counter = 0;
    let uniqueId = id;
    while (usedIds.has(uniqueId)) {
      counter++;
      uniqueId = `${id}-${counter}`;
    }
    usedIds.add(uniqueId);
    
    headings.push({ level, title, id: uniqueId });
  }
  
  if (headings.length === 0) {
    return [];
  }
  
  return buildTOCHierarchy(headings);
}

/**
 * Build hierarchical structure from flat heading list
 * 
 * @param headings - Flat list of headings
 * @returns Hierarchical TOC structure
 */
function buildTOCHierarchy(headings: Array<{ level: number; title: string; id: string }>): TOCItem[] {
  const toc: TOCItem[] = [];
  const stack: TOCItem[] = [];
  
  for (const heading of headings) {
    const item: TOCItem = {
      id: heading.id,
      title: heading.title,
      level: heading.level,
      children: []
    };
    
    // Pop from stack until we find appropriate parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      toc.push(item);
    } else {
      stack[stack.length - 1].children.push(item);
    }
    
    stack.push(item);
  }
  
  return toc;
}

/**
 * Apply syntax highlighting to code blocks with liquid glass effects
 * 
 * @param markdownContent - Markdown content with code blocks
 * @returns Content with syntax highlighting applied
 */
export function applySyntaxHighlighting(markdownContent: string): string {
  // Store code blocks temporarily to avoid conflicts
  const codeBlocks: string[] = [];
  const codeBlockPlaceholder = '___CODE_BLOCK_PLACEHOLDER___';
  
  // First, extract and replace code blocks with placeholders
  const codeBlockRegex = /```([a-zA-Z0-9_-]+)?\s*\n?([\s\S]*?)```/g;
  let processedContent = markdownContent.replace(codeBlockRegex, (match, language, code) => {
    const lang = language || 'text';
    const highlightedCode = highlightCode(code.trim(), lang);
    
    const block = `<div class="liquid-glass-code-block" data-language="${lang}" data-liquid-glass="true" data-effect-intensity="medium">
<pre><code class="language-${lang}">${highlightedCode}</code></pre>
</div>`;
    
    codeBlocks.push(block);
    return `${codeBlockPlaceholder}${codeBlocks.length - 1}${codeBlockPlaceholder}`;
  });
  
  // Process inline code
  const inlineCodeRegex = /`([^`\n]+)`/g;
  processedContent = processedContent.replace(inlineCodeRegex, (match, code) => {
    return `<code class="inline-code">${code}</code>`;
  });
  
  // Restore code blocks
  for (let i = 0; i < codeBlocks.length; i++) {
    const placeholder = `${codeBlockPlaceholder}${i}${codeBlockPlaceholder}`;
    processedContent = processedContent.replace(placeholder, codeBlocks[i]);
  }
  
  return processedContent;
}

/**
 * Language configuration for syntax highlighting
 */
const SYNTAX_PATTERNS = {
  javascript: {
    keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'class', 'extends', 'async', 'await', 'try', 'catch'],
    builtins: ['console', 'window', 'document', 'process'],
    operators: ['===', '!==', '==', '!=', '<=', '>=', '&&', '||', '=>']
  },
  typescript: {
    keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'class', 'extends', 'interface', 'type', 'enum', 'public', 'private', 'protected'],
    builtins: ['console', 'window', 'document', 'process'],
    operators: ['===', '!==', '==', '!=', '<=', '>=', '&&', '||', '=>', ':']
  },
  bash: {
    keywords: ['npm', 'install', 'cd', 'ls', 'mkdir', 'rm', 'cp', 'mv', 'git', 'echo', 'cat', 'grep'],
    builtins: ['sudo', 'chmod', 'chown'],
    operators: ['&&', '||', '|', '>>', '>', '<']
  }
} as const;

/**
 * Apply basic syntax highlighting to code
 * 
 * @param code - Code content
 * @param language - Programming language
 * @returns Highlighted code with tokens
 */
function highlightCode(code: string, language: string): string {
  const patterns = SYNTAX_PATTERNS[language as keyof typeof SYNTAX_PATTERNS];
  let highlighted = code;
  
  // Escape HTML first to prevent double-encoding
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  if (!patterns) {
    return highlighted;
  }
  
  // Highlight strings first (to avoid conflicts with other patterns)
  highlighted = highlighted.replace(
    /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, 
    '<span class="token string">$1$2$1</span>'
  );
  
  // Highlight comments
  if (language === 'javascript' || language === 'typescript') {
    highlighted = highlighted.replace(
      /\/\/.*$/gm, 
      '<span class="token comment">$&</span>'
    );
    highlighted = highlighted.replace(
      /\/\*[\s\S]*?\*\//g, 
      '<span class="token comment">$&</span>'
    );
  } else if (language === 'bash') {
    highlighted = highlighted.replace(
      /#.*$/gm, 
      '<span class="token comment">$&</span>'
    );
  }
  
  // Highlight keywords
  for (const keyword of patterns.keywords) {
    const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b(?![^<]*>)`, 'g');
    highlighted = highlighted.replace(regex, `<span class="token keyword">${keyword}</span>`);
  }
  
  // Highlight built-ins
  for (const builtin of patterns.builtins) {
    const regex = new RegExp(`\\b${escapeRegex(builtin)}\\b(?![^<]*>)`, 'g');
    highlighted = highlighted.replace(regex, `<span class="token builtin">${builtin}</span>`);
  }
  
  // Highlight function calls (basic pattern) - avoid already highlighted content
  highlighted = highlighted.replace(
    /\b(\w+)(\()(?![^<]*>)/g, 
    '<span class="token function">$1</span>$2'
  );
  
  // Highlight numbers
  highlighted = highlighted.replace(
    /\b\d+\.?\d*\b(?![^<]*>)/g, 
    '<span class="token number">$&</span>'
  );
  
  return highlighted;
}

/**
 * Escape special regex characters
 * 
 * @param str - String to escape
 * @returns Escaped string safe for regex
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculate reading time based on word count
 * 
 * @param wordCount - Total word count
 * @returns Reading time in minutes
 */
function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200; // Average reading speed
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Count words in text content with improved accuracy
 * 
 * @param content - Text content
 * @returns Word count
 */
function countWords(content: string): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }
  
  // Remove markdown syntax and count words more accurately
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`\n]+`/g, '') // Remove inline code
    .replace(/#{1,6}\s+/g, '') // Remove heading markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text only
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Replace images with alt text
    .replace(/[*_~`]/g, '') // Remove emphasis markers
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove ordered list markers
    .replace(/^\s*>\s+/gm, '') // Remove blockquote markers
    .replace(/---+/g, '') // Remove horizontal rules
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  if (cleanContent.length === 0) {
    return 0;
  }
  
  // Split by word boundaries and filter valid words
  return cleanContent
    .split(/\s+/)
    .filter(word => word.length > 0 && /\w/.test(word))
    .length;
}

/**
 * Add anchor IDs to headings in markdown content
 * 
 * @param content - Markdown content
 * @returns Content with anchor IDs added to headings
 */
function addHeadingAnchors(content: string): string {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const usedIds = new Set<string>();
  
  return content.replace(headingRegex, (match, hashes, title) => {
    let id = generateSlug(title);
    
    // Handle duplicate IDs
    let counter = 0;
    let uniqueId = id;
    while (usedIds.has(uniqueId)) {
      counter++;
      uniqueId = `${id}-${counter}`;
    }
    usedIds.add(uniqueId);
    
    const level = hashes.length;
    return `<h${level} id="${uniqueId}">${title}</h${level}>`;
  });
}

/**
 * Main processing function that converts markdown to processed MDX
 * 
 * @param markdownContent - Raw markdown content with frontmatter
 * @returns Complete processed MDX content
 */
export async function processMarkdownToMDX(markdownContent: string): Promise<ProcessedMDXContent> {
  const errors: string[] = [];
  
  try {
    // Parse frontmatter
    const { data: frontmatterData, content } = parseFrontmatter(markdownContent);
    
    // Validate frontmatter
    if (Object.keys(frontmatterData).length === 0 && markdownContent.includes('---')) {
      errors.push('Invalid frontmatter');
    }
    
    // Extract metadata
    const metadata = extractMetadata(frontmatterData);
    
    // Generate table of contents
    const tableOfContents = generateTableOfContents(content);
    
    // Apply syntax highlighting
    let processedContent = applySyntaxHighlighting(content);
    
    // Add heading anchors
    processedContent = addHeadingAnchors(processedContent);
    
    // Calculate reading metrics
    const wordCount = countWords(content);
    const readingTime = calculateReadingTime(wordCount);
    
    return {
      metadata,
      processedContent,
      tableOfContents,
      readingTime,
      wordCount,
      errors
    };
  } catch (error) {
    errors.push(`Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    // Return minimal valid result on error
    return {
      metadata: {
        title: '',
        description: '',
        tags: [],
        publishedAt: new Date(),
        author: '',
        category: '',
        slug: ''
      },
      processedContent: markdownContent,
      tableOfContents: [],
      readingTime: 0,
      wordCount: 0,
      errors
    };
  }
}