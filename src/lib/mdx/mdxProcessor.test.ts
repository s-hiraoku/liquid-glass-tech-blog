/**
 * MDX Processing Engine Tests
 * 
 * Test suite for comprehensive MDX processing functionality including:
 * - Markdown to MDX conversion
 * - Frontmatter parsing and metadata extraction
 * - Automatic table of contents (TOC) generation
 * - Syntax highlighting with liquid glass effects
 * 
 * Follows t-wada TDD methodology with Red-Green-Refactor cycles.
 * 
 * @module MDXProcessorTests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  processMarkdownToMDX,
  parseFrontmatter,
  generateTableOfContents,
  applySyntaxHighlighting,
  extractMetadata,
  type ProcessedMDXContent,
  type FrontmatterData,
  type TOCItem
} from './mdxProcessor';

describe('MDX Processing Engine', () => {
  describe('Frontmatter Parsing', () => {
    it('should parse YAML frontmatter from markdown content', () => {
      const markdownWithFrontmatter = `---
title: "Test Blog Post"
description: "A comprehensive guide to testing"
tags: ["testing", "javascript", "vitest"]
publishedAt: "2024-01-15"
author: "John Doe"
category: "Development"
---

# Main Content

This is the main content of the blog post.`;

      const result = parseFrontmatter(markdownWithFrontmatter);

      expect(result.data).toEqual({
        title: "Test Blog Post",
        description: "A comprehensive guide to testing",
        tags: ["testing", "javascript", "vitest"],
        publishedAt: "2024-01-15",
        author: "John Doe",
        category: "Development"
      });
      expect(result.content).toContain('# Main Content');
      expect(result.content).not.toContain('---');
    });

    it('should handle markdown without frontmatter', () => {
      const plainMarkdown = `# Blog Post Title

This is a blog post without frontmatter.`;

      const result = parseFrontmatter(plainMarkdown);

      expect(result.data).toEqual({});
      expect(result.content).toBe(plainMarkdown);
    });

    it('should handle invalid YAML frontmatter gracefully', () => {
      const invalidFrontmatter = `---
title: "Test Post
invalid: yaml: content:
---

# Content`;

      const result = parseFrontmatter(invalidFrontmatter);

      expect(result.data).toEqual({});
      expect(result.content).toContain('# Content');
    });
  });

  describe('Metadata Extraction', () => {
    it('should extract and validate required metadata fields', () => {
      const frontmatterData: FrontmatterData = {
        title: "Advanced React Patterns",
        description: "Exploring advanced patterns in React development",
        tags: ["react", "javascript", "patterns"],
        publishedAt: "2024-01-15",
        author: "Jane Smith",
        category: "Frontend"
      };

      const metadata = extractMetadata(frontmatterData);

      expect(metadata).toEqual({
        title: "Advanced React Patterns",
        description: "Exploring advanced patterns in React development",
        tags: ["react", "javascript", "patterns"],
        publishedAt: new Date("2024-01-15"),
        author: "Jane Smith",
        category: "Frontend",
        slug: "advanced-react-patterns"
      });
    });

    it('should generate slug from title when not provided', () => {
      const frontmatterData: FrontmatterData = {
        title: "Building Modern Web Apps with Next.js",
        description: "A comprehensive guide",
        tags: ["nextjs", "react"],
        publishedAt: "2024-01-15",
        author: "Dev Author"
      };

      const metadata = extractMetadata(frontmatterData);

      expect(metadata.slug).toBe("building-modern-web-apps-with-nextjs");
    });

    it('should handle missing optional fields', () => {
      const frontmatterData: FrontmatterData = {
        title: "Minimal Post",
        publishedAt: "2024-01-15"
      };

      const metadata = extractMetadata(frontmatterData);

      expect(metadata.title).toBe("Minimal Post");
      expect(metadata.description).toBe("");
      expect(metadata.tags).toEqual([]);
      expect(metadata.author).toBe("");
      expect(metadata.category).toBe("");
    });
  });

  describe('Table of Contents Generation', () => {
    it('should generate TOC from markdown headings', () => {
      const markdownContent = `# Introduction

Some content here.

## Getting Started

More content.

### Installation

Installation steps.

### Configuration

Configuration details.

## Advanced Usage

Advanced topics.

### Performance Optimization

Performance tips.

#### Memory Management

Memory details.

## Conclusion

Final thoughts.`;

      const toc = generateTableOfContents(markdownContent);

      expect(toc).toEqual([
        {
          id: "introduction",
          title: "Introduction",
          level: 1,
          children: [
            {
              id: "getting-started",
              title: "Getting Started",
              level: 2,
              children: [
                {
                  id: "installation",
                  title: "Installation",
                  level: 3,
                  children: []
                },
                {
                  id: "configuration",
                  title: "Configuration",
                  level: 3,
                  children: []
                }
              ]
            },
            {
              id: "advanced-usage",
              title: "Advanced Usage",
              level: 2,
              children: [
                {
                  id: "performance-optimization",
                  title: "Performance Optimization",
                  level: 3,
                  children: [
                    {
                      id: "memory-management",
                      title: "Memory Management",
                      level: 4,
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              id: "conclusion",
              title: "Conclusion",
              level: 2,
              children: []
            }
          ]
        }
      ]);
    });

    it('should handle markdown without headings', () => {
      const markdownContent = `This is just plain text without any headings.

Some more content here.`;

      const toc = generateTableOfContents(markdownContent);

      expect(toc).toEqual([]);
    });

    it('should handle duplicate heading titles', () => {
      const markdownContent = `# Overview

Content

## Installation

First installation section.

## Installation

Second installation section.`;

      const toc = generateTableOfContents(markdownContent);

      expect(toc[0].children).toEqual([
        {
          id: "installation",
          title: "Installation",
          level: 2,
          children: []
        },
        {
          id: "installation-1",
          title: "Installation",
          level: 2,
          children: []
        }
      ]);
    });
  });

  describe('Syntax Highlighting', () => {
    it('should apply syntax highlighting to code blocks', () => {
      const markdownWithCode = `# Code Example

Here's some JavaScript:

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

const result = hello("World");
\`\`\`

And some TypeScript:

\`\`\`typescript
interface User {
  id: number;
  name: string;
}

const user: User = {
  id: 1,
  name: "John"
};
\`\`\``;

      const result = applySyntaxHighlighting(markdownWithCode);

      expect(result).toContain('class="liquid-glass-code-block"');
      expect(result).toContain('data-language="javascript"');
      expect(result).toContain('data-language="typescript"');
      expect(result).toContain('class="token keyword"');
      expect(result).toContain('class="token function"');
    });

    it('should handle code blocks without language specification', () => {
      const markdownWithCode = `# Example

\`\`\`
plain code block
no syntax highlighting
\`\`\``;

      const result = applySyntaxHighlighting(markdownWithCode);

      expect(result).toContain('class="liquid-glass-code-block"');
      expect(result).toContain('data-language="text"');
    });

    it('should preserve inline code', () => {
      const markdownWithInlineCode = 'Use the `console.log()` function to debug.';

      const result = applySyntaxHighlighting(markdownWithInlineCode);

      expect(result).toContain('<code class="inline-code">console.log()</code>');
    });

    it('should integrate liquid glass effects with code blocks', () => {
      const markdownWithCode = `\`\`\`javascript
const effect = "liquid-glass";
\`\`\``;

      const result = applySyntaxHighlighting(markdownWithCode);

      expect(result).toContain('data-liquid-glass="true"');
      expect(result).toContain('class="liquid-glass-code-block"');
      expect(result).toContain('data-effect-intensity="medium"');
    });
  });

  describe('Full MDX Processing Pipeline', () => {
    it('should process complete markdown document to MDX', async () => {
      const fullMarkdown = `---
title: "Complete Guide to React Testing"
description: "Learn how to test React components effectively"
tags: ["react", "testing", "javascript"]
publishedAt: "2024-01-15"
author: "Testing Expert"
category: "Frontend"
---

# Introduction

Testing is crucial for React applications.

## Setup

First, install the dependencies:

\`\`\`bash
npm install @testing-library/react vitest
\`\`\`

### Configuration

Create a test configuration:

\`\`\`javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/test/setup.ts']
};
\`\`\`

## Writing Tests

Here's how to write effective tests:

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
\`\`\`

## Conclusion

Testing makes your code more reliable.`;

      const result = await processMarkdownToMDX(fullMarkdown);

      // Test metadata extraction
      expect(result.metadata.title).toBe("Complete Guide to React Testing");
      expect(result.metadata.tags).toEqual(["react", "testing", "javascript"]);
      expect(result.metadata.slug).toBe("complete-guide-to-react-testing");

      // Test TOC generation
      expect(result.tableOfContents).toHaveLength(1);
      expect(result.tableOfContents[0].title).toBe("Introduction");
      expect(result.tableOfContents[0].children).toHaveLength(3);

      // Test syntax highlighting
      expect(result.processedContent).toContain('class="liquid-glass-code-block"');
      expect(result.processedContent).toContain('data-language="bash"');
      expect(result.processedContent).toContain('data-language="javascript"');
      expect(result.processedContent).toContain('data-language="typescript"');

      // Test anchor links
      expect(result.processedContent).toContain('id="introduction"');
      expect(result.processedContent).toContain('id="setup"');
      expect(result.processedContent).toContain('id="configuration"');

      // Test reading time calculation
      expect(result.readingTime).toBeGreaterThan(0);
      expect(result.wordCount).toBeGreaterThan(20);
    });

    it('should handle processing errors gracefully', async () => {
      const invalidMarkdown = `---
invalid: yaml: content
---

# Content with invalid frontmatter`;

      const result = await processMarkdownToMDX(invalidMarkdown);

      expect(result.metadata.title).toBe("");
      expect(result.processedContent).toContain("Content with invalid frontmatter");
      expect(result.errors).toContain("Invalid frontmatter");
    });

    it('should calculate reading time and word count accurately', async () => {
      const mediumLengthPost = `---
title: "Medium Post"
---

# Introduction

${'This is a paragraph with multiple sentences. '.repeat(20)}

## Section One

${'More content here with detailed explanations. '.repeat(30)}

## Section Two

${'Additional content with examples and code snippets. '.repeat(25)}`;

      const result = await processMarkdownToMDX(mediumLengthPost);

      expect(result.wordCount).toBeGreaterThan(100);
      expect(result.readingTime).toBeGreaterThan(0);
      // Average reading speed is ~200 words per minute
      expect(result.readingTime).toBe(Math.ceil(result.wordCount / 200));
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed markdown gracefully', async () => {
      const malformedMarkdown = `# Heading

[Malformed link](

\`\`\`javascript
// Unclosed code block`;

      const result = await processMarkdownToMDX(malformedMarkdown);

      expect(result.processedContent).toBeTruthy();
      expect(result.errors).toHaveLength(0); // Should not throw errors
    });

    it('should handle extremely large markdown documents', async () => {
      const largeMarkdown = `---
title: "Large Document"
---

# Large Content

${'This is a very long paragraph. '.repeat(1000)}`;

      const result = await processMarkdownToMDX(largeMarkdown);

      expect(result.wordCount).toBeGreaterThan(5000);
      expect(result.processedContent).toBeTruthy();
    });
  });
});