/**
 * Phase 3.3: MDX Component Library (Library Integration) Tests
 * 
 * Tests shadcn/ui + @developer-hub/liquid-glass integrated MDX components
 * with WCAG 2.1 AA compliance and interactive functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi } from 'vitest';
import {
  defaultMDXComponents,
  Typography,
  CodeComponents,
  ShadcnComponents,
  LiquidGlassComponents,
  SemanticComponents
} from '../../components/content/MDXComponents';

expect.extend(toHaveNoViolations);

describe('Phase 3.3: MDX Components Library (shadcn/ui + @developer-hub/liquid-glass Integration)', () => {
  describe('GIVEN shadcn/ui Typography Extensions', () => {
    describe('WHEN rendering enhanced heading elements', () => {
      test('THEN should render h1 with liquid glass text effects', async () => {
        const { container } = render(
          <Typography.h1 className="liquid-glass-text">Test Heading</Typography.h1>
        );

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Test Heading');
        expect(heading).toHaveClass('text-4xl', 'font-bold', 'mb-6', 'liquid-glass-text');

        // Accessibility check
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      test('THEN should render h2 with proper semantic hierarchy', async () => {
        const { container } = render(
          <Typography.h2>Secondary Heading</Typography.h2>
        );

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveClass('text-3xl', 'font-semibold', 'mb-4');

        // Accessibility check
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      test('THEN should render h3 with consistent styling', () => {
        render(<Typography.h3>Tertiary Heading</Typography.h3>);

        const heading = screen.getByRole('heading', { level: 3 });
        expect(heading).toHaveClass('text-2xl', 'font-semibold', 'mb-3');
      });
    });

    describe('WHEN rendering enhanced text elements', () => {
      test('THEN should render paragraphs with proper spacing', () => {
        render(<Typography.p>Test paragraph content</Typography.p>);

        const paragraph = screen.getByText('Test paragraph content');
        expect(paragraph).toHaveClass('mb-4', 'leading-relaxed');
      });

      test('THEN should render blockquotes with liquid glass styling', async () => {
        const { container } = render(
          <Typography.blockquote>Important quote</Typography.blockquote>
        );

        const blockquote = screen.getByText('Important quote');
        expect(blockquote).toHaveClass('liquid-glass-card', 'border-l-4', 'border-blue-500', 'pl-6', 'py-4', 'my-6', 'italic');

        // Accessibility check
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      test('THEN should render lists with proper semantic structure', () => {
        render(
          <Typography.ul>
            <Typography.li>Item 1</Typography.li>
            <Typography.li>Item 2</Typography.li>
          </Typography.ul>
        );

        const list = screen.getByRole('list');
        const listItems = screen.getAllByRole('listitem');

        expect(list).toHaveClass('list-disc', 'list-inside', 'mb-4', 'space-y-2');
        expect(listItems).toHaveLength(2);
        listItems.forEach(item => {
          expect(item).toHaveClass('ml-4');
        });
      });
    });
  });

  describe('GIVEN @developer-hub/liquid-glass Code Integration', () => {
    describe('WHEN rendering enhanced code blocks', () => {
      test('THEN should render pre elements with liquid glass background', async () => {
        const { container } = render(
          <CodeComponents.pre>
            <code>console.log('Hello World');</code>
          </CodeComponents.pre>
        );

        const preElement = container.querySelector('pre');
        expect(preElement).toHaveClass('liquid-glass-code', 'bg-glass-dark', 'text-glass-light', 'p-6', 'rounded-lg', 'overflow-x-auto');

        // Accessibility check
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      test('THEN should render inline code with proper contrast', () => {
        render(<CodeComponents.code>inline code</CodeComponents.code>);

        const codeElement = screen.getByText('inline code');
        expect(codeElement).toHaveClass('bg-gray-100', 'dark:bg-gray-800', 'px-1.5', 'py-0.5', 'rounded', 'text-sm');
      });

      test('THEN should render CodeBlock with copy functionality', async () => {
        const mockOnCopy = vi.fn();
        const testCode = 'const greeting = "Hello, World!";';

        render(
          <CodeComponents.CodeBlock
            code={testCode}
            language="javascript"
            showCopyButton={true}
            showLineNumbers={true}
            onCopy={mockOnCopy}
          />
        );

        // Check language indicator
        expect(screen.getByText('JAVASCRIPT')).toBeInTheDocument();

        // Check copy button
        const copyButton = screen.getByText('Copy');
        expect(copyButton).toBeInTheDocument();

        // Test copy functionality
        await userEvent.click(copyButton);
        expect(mockOnCopy).toHaveBeenCalledWith(testCode);

        // Check line numbers
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      test('THEN should render CodeBlock with theme variants', () => {
        render(
          <CodeComponents.CodeBlock
            code="test code"
            theme="dark"
            className="custom-class"
          />
        );

        const container = document.querySelector('.theme-dark.custom-class');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN shadcn/ui Component Integration', () => {
    describe('WHEN rendering UI components', () => {
      test('THEN should render Button with proper styling and interactions', async () => {
        const mockClick = vi.fn();
        const { container } = render(
          <ShadcnComponents.Button onClick={mockClick}>Click me</ShadcnComponents.Button>
        );

        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-md');

        await userEvent.click(button);
        expect(mockClick).toHaveBeenCalled();

        // Accessibility check
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      test('THEN should render Card components with proper structure', async () => {
        const { container } = render(
          <ShadcnComponents.Card>
            <ShadcnComponents.CardHeader>
              <ShadcnComponents.CardTitle>Test Card</ShadcnComponents.CardTitle>
            </ShadcnComponents.CardHeader>
            <ShadcnComponents.CardContent>
              Card content here
            </ShadcnComponents.CardContent>
          </ShadcnComponents.Card>
        );

        const card = container.querySelector('.rounded-lg.border.bg-card');
        expect(card).toBeInTheDocument();

        const title = screen.getByText('Test Card');
        expect(title).toHaveClass('text-2xl', 'font-semibold');

        const content = screen.getByText('Card content here');
        expect(content).toBeInTheDocument();

        // Accessibility check
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });

  describe('GIVEN Liquid Glass Enhanced Components', () => {
    describe('WHEN rendering LiquidGlassCard', () => {
      test('THEN should render with variant support', () => {
        const { container } = render(
          <LiquidGlassComponents.LiquidGlassCard variant="intense" className="custom-glass">
            Glass card content
          </LiquidGlassComponents.LiquidGlassCard>
        );

        const card = container.querySelector('[data-variant="intense"]');
        expect(card).toBeInTheDocument();
        expect(card).toHaveAttribute('data-variant', 'intense');
        expect(card).toHaveClass('p-6', 'rounded-lg', 'border', 'bg-card', 'custom-glass');
      });

      test('THEN should have default variant when not specified', () => {
        const { container } = render(
          <LiquidGlassComponents.LiquidGlassCard>
            Default glass card
          </LiquidGlassComponents.LiquidGlassCard>
        );

        const card = container.querySelector('[data-variant="default"]');
        expect(card).toBeInTheDocument();
        expect(card).toHaveAttribute('data-variant', 'default');
        expect(card).toHaveClass('p-6', 'rounded-lg', 'border', 'bg-card');
      });
    });

    describe('WHEN rendering TechSpec component', () => {
      test('THEN should display technical specifications', () => {
        const specs = {
          framework: 'Next.js 15',
          library: 'React 19',
          styling: 'Tailwind CSS'
        };

        render(
          <LiquidGlassComponents.TechSpec
            title="Technical Specifications"
            specs={specs}
          />
        );

        expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
        expect(screen.getByText('framework:')).toBeInTheDocument();
        expect(screen.getByText('Next.js 15')).toBeInTheDocument();
        expect(screen.getByText('library:')).toBeInTheDocument();
        expect(screen.getByText('React 19')).toBeInTheDocument();
      });

      test('THEN should handle empty specs gracefully', () => {
        render(
          <LiquidGlassComponents.TechSpec
            title="Empty Specs"
            specs={{}}
          />
        );

        expect(screen.getByText('Empty Specs')).toBeInTheDocument();
      });
    });

    describe('WHEN rendering PerformanceMetrics component', () => {
      test('THEN should display metrics in grid layout', () => {
        const metrics = {
          lcp: '1.2s',
          fid: '10ms',
          cls: '0.05',
          ttfb: '200ms'
        };

        render(
          <LiquidGlassComponents.PerformanceMetrics metrics={metrics} />
        );

        expect(screen.getByText('1.2s')).toBeInTheDocument();
        expect(screen.getByText('lcp')).toBeInTheDocument();
        expect(screen.getByText('10ms')).toBeInTheDocument();
        expect(screen.getByText('fid')).toBeInTheDocument();
      });

      test('THEN should have responsive grid classes', () => {
        render(
          <LiquidGlassComponents.PerformanceMetrics
            metrics={{ test: '100' }}
            className="custom-metrics"
          />
        );

        const container = screen.getByText('100').closest('.grid');
        expect(container).toHaveClass('grid-cols-2', 'md:grid-cols-4', 'gap-4', 'my-4', 'custom-metrics');
      });
    });

    describe('WHEN rendering CodeDemo component', () => {
      test('THEN should support editable and preview modes', () => {
        render(
          <LiquidGlassComponents.CodeDemo
            code="const demo = true;"
            language="typescript"
            editable={true}
            preview={true}
          />
        );

        expect(screen.getByText('TYPESCRIPT')).toBeInTheDocument();
        expect(screen.getByText('const demo = true;')).toBeInTheDocument();
        expect(screen.getByText('Editable')).toBeInTheDocument();
        expect(screen.getByText('Preview enabled')).toBeInTheDocument();
      });

      test('THEN should render minimal version without extras', () => {
        render(
          <LiquidGlassComponents.CodeDemo
            code="simple code"
            language="text"
          />
        );

        expect(screen.getByText('TEXT')).toBeInTheDocument();
        expect(screen.getByText('simple code')).toBeInTheDocument();
        expect(screen.queryByText('Editable')).not.toBeInTheDocument();
        expect(screen.queryByText('Preview enabled')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN Semantic HTML Integration', () => {
    describe('WHEN rendering semantic elements', () => {
      test('THEN should render article and section elements', async () => {
        const { container } = render(
          <SemanticComponents.article>
            <SemanticComponents.section>
              Section content
            </SemanticComponents.section>
          </SemanticComponents.article>
        );

        const article = container.querySelector('article');
        const section = container.querySelector('section');

        expect(article).toBeInTheDocument();
        expect(section).toBeInTheDocument();
        expect(screen.getByText('Section content')).toBeInTheDocument();

        // Accessibility check
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });

  describe('GIVEN Complete MDX Components Integration', () => {
    describe('WHEN using defaultMDXComponents export', () => {
      test('THEN should include all component categories', () => {
        // Check that all component categories are included
        expect(defaultMDXComponents.h1).toBeDefined();
        expect(defaultMDXComponents.h2).toBeDefined();
        expect(defaultMDXComponents.p).toBeDefined();
        expect(defaultMDXComponents.blockquote).toBeDefined();
        expect(defaultMDXComponents.pre).toBeDefined();
        expect(defaultMDXComponents.code).toBeDefined();
        expect(defaultMDXComponents.CodeBlock).toBeDefined();
        expect(defaultMDXComponents.Button).toBeDefined();
        expect(defaultMDXComponents.Card).toBeDefined();
        expect(defaultMDXComponents.LiquidGlassCard).toBeDefined();
        expect(defaultMDXComponents.TechSpec).toBeDefined();
        expect(defaultMDXComponents.PerformanceMetrics).toBeDefined();
        expect(defaultMDXComponents.CodeDemo).toBeDefined();
        expect(defaultMDXComponents.article).toBeDefined();
        expect(defaultMDXComponents.section).toBeDefined();
      });

      test('THEN should render complete MDX content structure', async () => {
        const { container } = render(
          <div>
            <defaultMDXComponents.h1>Main Title</defaultMDXComponents.h1>
            <defaultMDXComponents.p>Introduction paragraph</defaultMDXComponents.p>
            <defaultMDXComponents.LiquidGlassCard variant="medium">
              <defaultMDXComponents.h2>Card Title</defaultMDXComponents.h2>
              <defaultMDXComponents.CodeBlock
                code="console.log('Hello');"
                language="javascript"
                showCopyButton={true}
              />
            </defaultMDXComponents.LiquidGlassCard>
          </div>
        );

        // Check all elements are rendered
        expect(screen.getByRole('heading', { level: 1, name: 'Main Title' })).toBeInTheDocument();
        expect(screen.getByText('Introduction paragraph')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Card Title' })).toBeInTheDocument();
        expect(screen.getByText('JAVASCRIPT')).toBeInTheDocument();
        expect(screen.getByText('Copy')).toBeInTheDocument();

        // Accessibility check for complete structure
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });

  describe('GIVEN ARIA and Keyboard Navigation Support', () => {
    describe('WHEN interacting with components via keyboard', () => {
      test('THEN should support keyboard navigation for interactive elements', async () => {
        const mockClick = vi.fn();

        render(
          <div>
            <ShadcnComponents.Button onClick={mockClick}>Button 1</ShadcnComponents.Button>
            <CodeComponents.CodeBlock
              code="test"
              showCopyButton={true}
              onCopy={mockClick}
            />
          </div>
        );

        const button1 = screen.getByRole('button', { name: 'Button 1' });
        const copyButton = screen.getByRole('button', { name: 'Copy' });

        // Test Tab navigation
        await userEvent.tab();
        expect(button1).toHaveFocus();

        await userEvent.tab();
        expect(copyButton).toHaveFocus();

        // Test Enter activation
        await userEvent.keyboard('{Enter}');
        expect(mockClick).toHaveBeenCalled();
      });

      test('THEN should provide proper ARIA labels for complex components', () => {
        render(
          <LiquidGlassComponents.TechSpec
            title="Specifications"
            specs={{ version: '1.0' }}
            aria-label="Technical specifications list"
          />
        );

        const container = screen.getByLabelText('Technical specifications list');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN Color Contrast and High Contrast Support', () => {
    describe('WHEN components are rendered in different themes', () => {
      test('THEN should maintain proper contrast ratios', async () => {
        const { container } = render(
          <div className="dark">
            <Typography.blockquote>Dark theme quote</Typography.blockquote>
            <CodeComponents.code>dark theme code</CodeComponents.code>
          </div>
        );

        const blockquote = screen.getByText('Dark theme quote');
        const code = screen.getByText('dark theme code');

        expect(blockquote).toHaveClass('liquid-glass-card', 'bg-glass-subtle');
        expect(code).toHaveClass('dark:bg-gray-800');

        // Accessibility check for dark theme
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });
});