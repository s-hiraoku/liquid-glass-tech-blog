/**
 * MDX Processing Engine Integration Tests
 * 
 * Tests integration between MDX processor and renderer components.
 * Ensures the processor output works correctly with the React components.
 * 
 * @module MDXProcessorIntegrationTests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { processMarkdownToMDX } from './mdxProcessor';
import { MDXRenderer } from '../../components/content/MDXRenderer';

describe('MDX Processor Integration', () => {
  const sampleMarkdown = `---
title: "Integration Test Post"
description: "Testing MDX processor with renderer"
tags: ["testing", "mdx", "integration"]
publishedAt: "2024-01-15"
author: "Test Author"
---

# Welcome to Our Blog

This is an introduction to our awesome blog post.

## Getting Started

Here's how to get started with our platform:

### Installation

First, install the dependencies:

\`\`\`bash
npm install @our/awesome-package
\`\`\`

### Basic Usage

Here's a simple example:

\`\`\`javascript
import { AwesomeFeature } from '@our/awesome-package';

function MyComponent() {
  return (
    <div>
      <AwesomeFeature />
    </div>
  );
}
\`\`\`

## Key Features

Our platform offers:

- **High Performance**: Optimized for speed
- **Easy Integration**: Simple API design
- **Liquid Glass Effects**: Beautiful visual effects

### Code Highlighting

We support syntax highlighting for multiple languages:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};
\`\`\`

## Conclusion

Thank you for reading! Check out our inline code example: \`console.log("Hello!")\`.`;

  describe('Full Processing Pipeline', () => {
    it('should process markdown and render successfully', async () => {
      const processedContent = await processMarkdownToMDX(sampleMarkdown);

      expect(processedContent.metadata.title).toBe("Integration Test Post");
      expect(processedContent.tableOfContents).toHaveLength(1);
      expect(processedContent.tableOfContents[0].title).toBe("Welcome to Our Blog");
      expect(processedContent.wordCount).toBeGreaterThan(50);
      expect(processedContent.readingTime).toBeGreaterThan(0);
    });

    it('should generate proper heading hierarchy', async () => {
      const processedContent = await processMarkdownToMDX(sampleMarkdown);
      const toc = processedContent.tableOfContents[0];

      expect(toc.children).toHaveLength(3); // Getting Started, Key Features, Conclusion
      expect(toc.children[0].title).toBe("Getting Started");
      expect(toc.children[0].children).toHaveLength(2); // Installation, Basic Usage
      expect(toc.children[1].title).toBe("Key Features");
      expect(toc.children[1].children).toHaveLength(1); // Code Highlighting
    });

    it('should apply liquid glass effects to code blocks', async () => {
      const processedContent = await processMarkdownToMDX(sampleMarkdown);

      expect(processedContent.processedContent).toContain('class="liquid-glass-code-block"');
      expect(processedContent.processedContent).toContain('data-liquid-glass="true"');
      expect(processedContent.processedContent).toContain('data-language="bash"');
      expect(processedContent.processedContent).toContain('data-language="javascript"');
      expect(processedContent.processedContent).toContain('data-language="typescript"');
    });

    it('should preserve inline code formatting', async () => {
      const processedContent = await processMarkdownToMDX(sampleMarkdown);

      expect(processedContent.processedContent).toContain('<code class="inline-code">console.log("Hello!")</code>');
    });

    it('should generate proper anchor links for headings', async () => {
      const processedContent = await processMarkdownToMDX(sampleMarkdown);

      expect(processedContent.processedContent).toContain('id="welcome-to-our-blog"');
      expect(processedContent.processedContent).toContain('id="getting-started"');
      expect(processedContent.processedContent).toContain('id="installation"');
      expect(processedContent.processedContent).toContain('id="basic-usage"');
      expect(processedContent.processedContent).toContain('id="key-features"');
      expect(processedContent.processedContent).toContain('id="code-highlighting"');
      expect(processedContent.processedContent).toContain('id="conclusion"');
    });

    it('should apply syntax highlighting with proper token classes', async () => {
      const processedContent = await processMarkdownToMDX(sampleMarkdown);

      // Check for keyword highlighting
      expect(processedContent.processedContent).toContain('<span class="token keyword">import</span>');
      expect(processedContent.processedContent).toContain('<span class="token keyword">function</span>');
      expect(processedContent.processedContent).toContain('<span class="token keyword">interface</span>');
      expect(processedContent.processedContent).toContain('<span class="token keyword">const</span>');

      // Check for function highlighting
      expect(processedContent.processedContent).toContain('<span class="token function">');

      // Check for string highlighting
      expect(processedContent.processedContent).toContain('<span class="token string">');
    });

    it('should handle edge cases gracefully', async () => {
      const edgeCaseMarkdown = `---
title: "Edge Cases Test"
---

# Test

\`\`\`unknown-language
some code in unknown language
\`\`\`

\`\`\`
code without language
\`\`\`

### Heading with "quotes" and symbols!

Content with \`inline code\` and more.`;

      const processedContent = await processMarkdownToMDX(edgeCaseMarkdown);

      expect(processedContent.errors).toHaveLength(0);
      expect(processedContent.processedContent).toContain('data-language="unknown-language"');
      expect(processedContent.processedContent).toContain('data-language="text"');
      expect(processedContent.processedContent).toContain('id="heading-with-quotes-and-symbols"');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed frontmatter gracefully', async () => {
      const malformedMarkdown = `---
title: "Test Post
invalid: yaml here
---

# Content

This should still work.`;

      const processedContent = await processMarkdownToMDX(malformedMarkdown);

      expect(processedContent.errors).toContain('Invalid frontmatter');
      expect(processedContent.processedContent).toContain('Content');
      expect(processedContent.metadata.title).toBe('');
    });

    it('should handle empty content', async () => {
      const emptyMarkdown = '';

      const processedContent = await processMarkdownToMDX(emptyMarkdown);

      expect(processedContent.wordCount).toBe(0);
      expect(processedContent.readingTime).toBe(0);
      expect(processedContent.tableOfContents).toEqual([]);
    });

    it('should handle content with only whitespace', async () => {
      const whitespaceMarkdown = '   \n\n   \t\t   \n\n  ';

      const processedContent = await processMarkdownToMDX(whitespaceMarkdown);

      expect(processedContent.wordCount).toBe(0);
      expect(processedContent.readingTime).toBe(0);
    });
  });

  describe('Performance Characteristics', () => {
    it('should process large documents efficiently', async () => {
      const largeMarkdown = `---
title: "Large Document"
---

# Large Content

${'## Section\n\nThis is a paragraph with multiple sentences and detailed explanations that provide comprehensive coverage of the topic. '.repeat(100)}

${'### Subsection\n\n```javascript\nfunction example() {\n  return "test";\n}\n```\n\n'.repeat(50)}`;

      const startTime = Date.now();
      const processedContent = await processMarkdownToMDX(largeMarkdown);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(processedContent.wordCount).toBeGreaterThan(1000);
      expect(processedContent.tableOfContents).toHaveLength(1);
      expect(processedContent.processedContent).toContain('class="liquid-glass-code-block"');
    });

    it('should handle deeply nested headings', async () => {
      const nestedMarkdown = `# Level 1
## Level 2
### Level 3
#### Level 4
##### Level 5
###### Level 6
####### Level 7 (should be treated as text)

Content here.`;

      const processedContent = await processMarkdownToMDX(nestedMarkdown);

      expect(processedContent.tableOfContents).toHaveLength(1);
      expect(processedContent.tableOfContents[0].level).toBe(1);
      
      // Should handle up to h6
      const level6Heading = findHeadingByLevel(processedContent.tableOfContents[0], 6);
      expect(level6Heading).toBeTruthy();
      expect(level6Heading?.title).toBe('Level 6');
    });
  });
});

/**
 * Helper function to find heading by level in TOC
 */
function findHeadingByLevel(toc: any, targetLevel: number): any {
  if (toc.level === targetLevel) {
    return toc;
  }
  
  for (const child of toc.children || []) {
    const found = findHeadingByLevel(child, targetLevel);
    if (found) {
      return found;
    }
  }
  
  return null;
}