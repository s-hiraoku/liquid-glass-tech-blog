import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../tests/mocks/seasonal-theme-provider';
import { MDXRenderer } from './MDXRenderer';

// Mock @next/mdx
vi.mock('@next/mdx', () => ({
  default: vi.fn(() => (config: any) => config),
}));

// Mock liquid glass components
vi.mock('../liquid-glass/LiquidGlassCard', () => ({
  LiquidGlassCard: ({ children, className, ...props }: any) => (
    <div data-testid="liquid-glass-card" className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock shadcn/ui components
vi.mock('../ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="shadcn-button" {...props}>
      {children}
    </button>
  ),
}));

// Mock Prism.js syntax highlighting
vi.mock('prismjs', () => ({
  highlight: vi.fn((code: string, grammar: any, language: string) => 
    `<span class="token keyword">${code}</span>`
  ),
  languages: {
    javascript: {},
    typescript: {},
    jsx: {},
    tsx: {},
  },
}));

interface MDXContentProps {
  components?: Record<string, React.ComponentType<any>>;
}

// Mock MDX content component
const createMockMDXContent = (content: string) => {
  return ({ components }: MDXContentProps) => {
    if (content.includes('LiquidGlassCard')) {
      const Card = components?.LiquidGlassCard || 'div';
      return (
        <div data-testid="mdx-content">
          <Card variant="subtle">Liquid Glass Card in MDX</Card>
        </div>
      );
    }
    
    if (content.includes('Button')) {
      const Button = components?.Button || 'button';
      return (
        <div data-testid="mdx-content">
          <Button>Click me</Button>
        </div>
      );
    }
    
    if (content.includes('```typescript')) {
      return (
        <div data-testid="mdx-content">
          <pre data-testid="code-block">
            <code className="language-typescript">
              const example = "typescript code";
            </code>
          </pre>
        </div>
      );
    }
    
    return <div data-testid="mdx-content">{content}</div>;
  };
};

describe('MDXRenderer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('@next/mdx Integration', () => {
    it('should render MDX content with @next/mdx integration', async () => {
      const mdxContent = 'This is MDX content';
      const MockContent = createMockMDXContent(mdxContent);
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{}}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('mdx-content')).toBeInTheDocument();
      expect(screen.getByText('This is MDX content')).toBeInTheDocument();
    });

    it('should handle MDX compilation errors gracefully', async () => {
      const ErrorContent = () => {
        throw new Error('MDX compilation failed');
      };
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={ErrorContent}
            components={{}}
            fallback="Error loading content"
          />
        </ThemeProvider>
      );
      
      expect(screen.getByText('Error loading content')).toBeInTheDocument();
    });

    it('should support frontmatter extraction', async () => {
      const frontmatter = {
        title: 'Test Article',
        tags: ['react', 'mdx'],
        date: '2024-01-01',
        author: 'Test Author'
      };
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={createMockMDXContent('Content')}
            frontmatter={frontmatter}
            components={{}}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('mdx-content')).toBeInTheDocument();
    });
  });

  describe('React Component Embedding', () => {
    it('should embed React components in MDX content', async () => {
      const MockContent = createMockMDXContent('Button content');
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              Button: ({ children }) => (
                <button data-testid="embedded-button">{children}</button>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('embedded-button')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should pass props to embedded components', async () => {
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.CustomComponent && (
            <components.CustomComponent 
              title="Test Title"
              variant="primary"
              onClick={vi.fn()}
            />
          )}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              CustomComponent: (props) => (
                <div data-testid="custom-component" {...props}>
                  {props.title}
                </div>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('custom-component')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should handle dynamic component loading', async () => {
      const DynamicComponent = () => (
        <div data-testid="dynamic-component">Dynamic Content</div>
      );
      
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.DynamicComponent && <components.DynamicComponent />}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              DynamicComponent
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('dynamic-component')).toBeInTheDocument();
      expect(screen.getByText('Dynamic Content')).toBeInTheDocument();
    });
  });

  describe('shadcn/ui Components Integration', () => {
    it('should render shadcn/ui Button component in MDX', async () => {
      const MockContent = createMockMDXContent('Button content');
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              Button: ({ children, ...props }) => (
                <button data-testid="shadcn-button" {...props}>
                  {children}
                </button>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('shadcn-button')).toBeInTheDocument();
    });

    it('should render shadcn/ui Card component in MDX', async () => {
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.Card && (
            <components.Card className="custom-card">
              <components.CardHeader>
                <components.CardTitle>Card Title</components.CardTitle>
              </components.CardHeader>
              <components.CardContent>Card content</components.CardContent>
            </components.Card>
          )}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              Card: ({ children, className }) => (
                <div data-testid="shadcn-card" className={className}>
                  {children}
                </div>
              ),
              CardHeader: ({ children }) => (
                <div data-testid="card-header">{children}</div>
              ),
              CardTitle: ({ children }) => (
                <h3 data-testid="card-title">{children}</h3>
              ),
              CardContent: ({ children }) => (
                <div data-testid="card-content">{children}</div>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('shadcn-card')).toBeInTheDocument();
      expect(screen.getByTestId('card-header')).toBeInTheDocument();
      expect(screen.getByTestId('card-title')).toBeInTheDocument();
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render Typography components with proper styling', async () => {
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.h1 && <components.h1>Main Heading</components.h1>}
          {components?.h2 && <components.h2>Sub Heading</components.h2>}
          {components?.blockquote && (
            <components.blockquote>Quote content</components.blockquote>
          )}
          {components?.p && <components.p>Paragraph content</components.p>}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              h1: ({ children }) => (
                <h1 data-testid="typography-h1" className="text-4xl font-bold">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 data-testid="typography-h2" className="text-2xl font-semibold">
                  {children}
                </h2>
              ),
              blockquote: ({ children }) => (
                <blockquote data-testid="typography-blockquote" className="border-l-4 pl-4">
                  {children}
                </blockquote>
              ),
              p: ({ children }) => (
                <p data-testid="typography-p" className="text-base">
                  {children}
                </p>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('typography-h1')).toBeInTheDocument();
      expect(screen.getByTestId('typography-h2')).toBeInTheDocument();
      expect(screen.getByTestId('typography-blockquote')).toBeInTheDocument();
      expect(screen.getByTestId('typography-p')).toBeInTheDocument();
    });
  });

  describe('Liquid Glass MDX Components', () => {
    it('should render LiquidGlassCard component in MDX', async () => {
      const MockContent = createMockMDXContent('LiquidGlassCard content');
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              LiquidGlassCard: ({ children, variant, className }) => (
                <div 
                  data-testid="liquid-glass-card" 
                  data-variant={variant}
                  className={className}
                >
                  {children}
                </div>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('liquid-glass-card')).toBeInTheDocument();
      expect(screen.getByText('Liquid Glass Card in MDX')).toBeInTheDocument();
    });

    it('should render TechSpec component with specifications', async () => {
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.TechSpec && (
            <components.TechSpec 
              title="React Component"
              specs={{
                framework: 'React 19',
                language: 'TypeScript',
                bundler: 'Next.js 15'
              }}
            />
          )}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              TechSpec: ({ title, specs }) => (
                <div data-testid="tech-spec">
                  <h3 data-testid="tech-spec-title">{title}</h3>
                  <ul data-testid="tech-spec-list">
                    {Object.entries(specs).map(([key, value]) => (
                      <li key={key} data-testid={`spec-${key}`}>
                        {key}: {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('tech-spec')).toBeInTheDocument();
      expect(screen.getByTestId('tech-spec-title')).toBeInTheDocument();
      expect(screen.getByText('React Component')).toBeInTheDocument();
      expect(screen.getByTestId('spec-framework')).toBeInTheDocument();
      expect(screen.getByText('framework: React 19')).toBeInTheDocument();
    });

    it('should render PerformanceMetrics component', async () => {
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.PerformanceMetrics && (
            <components.PerformanceMetrics 
              metrics={{
                lcp: '1.2s',
                fid: '15ms',
                cls: '0.05',
                ttfb: '150ms'
              }}
            />
          )}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              PerformanceMetrics: ({ metrics }) => (
                <div data-testid="performance-metrics">
                  {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} data-testid={`metric-${key}`}>
                      {key.toUpperCase()}: {value}
                    </div>
                  ))}
                </div>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('performance-metrics')).toBeInTheDocument();
      expect(screen.getByTestId('metric-lcp')).toBeInTheDocument();
      expect(screen.getByText('LCP: 1.2s')).toBeInTheDocument();
    });

    it('should render CodeDemo component with interactive features', async () => {
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.CodeDemo && (
            <components.CodeDemo 
              code="const example = 'Hello World';"
              language="javascript"
              editable={true}
              preview={true}
            />
          )}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              CodeDemo: ({ code, language, editable, preview }) => (
                <div data-testid="code-demo">
                  <div data-testid="code-editor" data-editable={editable}>
                    <code className={`language-${language}`}>{code}</code>
                  </div>
                  {preview && (
                    <div data-testid="code-preview">Preview enabled</div>
                  )}
                </div>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('code-demo')).toBeInTheDocument();
      expect(screen.getByTestId('code-editor')).toBeInTheDocument();
      expect(screen.getByTestId('code-preview')).toBeInTheDocument();
      expect(screen.getByText("const example = 'Hello World';")).toBeInTheDocument();
    });
  });

  describe('Syntax Highlighting with Prism.js', () => {
    it('should apply syntax highlighting to code blocks', async () => {
      const MockContent = createMockMDXContent('```typescript\nconst example = "test";\n```');
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              pre: ({ children }) => (
                <pre data-testid="highlighted-pre">{children}</pre>
              ),
              code: ({ children, className }) => (
                <code data-testid="highlighted-code" className={className}>
                  {children}
                </code>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('code-block')).toBeInTheDocument();
      expect(screen.getByText('const example = "typescript code";')).toBeInTheDocument();
    });

    it('should show line numbers for code blocks', async () => {
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.CodeBlock && (
            <components.CodeBlock 
              code="const line1 = 'first';\nconst line2 = 'second';"
              language="javascript"
              showLineNumbers={true}
            />
          )}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              CodeBlock: ({ code, language, showLineNumbers }) => (
                <div data-testid="code-block-with-lines">
                  {showLineNumbers && (
                    <div data-testid="line-numbers">
                      <span data-testid="line-1">1</span>
                      <span data-testid="line-2">2</span>
                    </div>
                  )}
                  <code className={`language-${language}`}>{code}</code>
                </div>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('code-block-with-lines')).toBeInTheDocument();
      expect(screen.getByTestId('line-numbers')).toBeInTheDocument();
      expect(screen.getByTestId('line-1')).toBeInTheDocument();
      expect(screen.getByTestId('line-2')).toBeInTheDocument();
    });

    it('should provide copy functionality for code blocks', async () => {
      const mockCopyToClipboard = vi.fn();
      
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.CodeBlock && (
            <components.CodeBlock 
              code="const copyMe = 'test';"
              language="javascript"
              showCopyButton={true}
              onCopy={mockCopyToClipboard}
            />
          )}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              CodeBlock: ({ code, language, showCopyButton, onCopy }) => (
                <div data-testid="code-block-with-copy">
                  <code className={`language-${language}`}>{code}</code>
                  {showCopyButton && (
                    <button 
                      data-testid="copy-button"
                      onClick={() => onCopy?.(code)}
                    >
                      Copy
                    </button>
                  )}
                </div>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('code-block-with-copy')).toBeInTheDocument();
      expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    });

    it('should support multiple programming languages', async () => {
      const languages = ['javascript', 'typescript', 'jsx', 'tsx', 'css', 'html'];
      
      languages.forEach(language => {
        const MockContent = ({ components }: MDXContentProps) => (
          <div data-testid="mdx-content">
            {components?.CodeBlock && (
              <components.CodeBlock 
                code={`// ${language} code example`}
                language={language}
              />
            )}
          </div>
        );
        
        const { unmount } = render(
          <ThemeProvider>
            <MDXRenderer 
              content={MockContent}
              components={{
                CodeBlock: ({ code, language }) => (
                  <code 
                    data-testid={`code-${language}`}
                    className={`language-${language}`}
                  >
                    {code}
                  </code>
                )
              }}
            />
          </ThemeProvider>
        );
        
        expect(screen.getByTestId(`code-${language}`)).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle custom themes for syntax highlighting', async () => {
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.CodeBlock && (
            <components.CodeBlock 
              code="const theme = 'dark';"
              language="javascript"
              theme="dark"
            />
          )}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              CodeBlock: ({ code, language, theme }) => (
                <div 
                  data-testid="themed-code-block"
                  data-theme={theme}
                  className={`theme-${theme}`}
                >
                  <code className={`language-${language}`}>{code}</code>
                </div>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('themed-code-block')).toBeInTheDocument();
      expect(screen.getByTestId('themed-code-block')).toHaveAttribute('data-theme', 'dark');
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should handle missing components gracefully', async () => {
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.NonExistentComponent ? (
            <components.NonExistentComponent />
          ) : (
            <div data-testid="fallback-content">Component not available</div>
          )}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{}}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
      expect(screen.getByText('Component not available')).toBeInTheDocument();
    });

    it('should handle component rendering errors', async () => {
      const ErrorComponent = () => {
        throw new Error('Component error');
      };
      
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.ErrorComponent && <components.ErrorComponent />}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              ErrorComponent
            }}
            errorBoundary={true}
            fallback="Error loading content"
          />
        </ThemeProvider>
      );
      
      // Should render error boundary fallback instead of crashing
      expect(screen.getByText('Error loading content')).toBeInTheDocument();
    });
  });

  describe('Performance and Accessibility', () => {
    it('should support lazy loading of heavy components', async () => {
      const HeavyComponent = () => (
        <div data-testid="heavy-component">Heavy content loaded</div>
      );
      
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.HeavyComponent && <components.HeavyComponent />}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              HeavyComponent
            }}
            lazyLoad={true}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('heavy-component')).toBeInTheDocument();
    });

    it('should maintain semantic HTML structure', async () => {
      const MockContent = ({ components }: MDXContentProps) => (
        <div data-testid="mdx-content">
          {components?.article && (
            <components.article>
              {components?.h1 && <components.h1>Article Title</components.h1>}
              {components?.section && (
                <components.section>
                  {components?.h2 && <components.h2>Section Title</components.h2>}
                  {components?.p && <components.p>Section content</components.p>}
                </components.section>
              )}
            </components.article>
          )}
        </div>
      );
      
      render(
        <ThemeProvider>
          <MDXRenderer 
            content={MockContent}
            components={{
              article: ({ children }) => (
                <article data-testid="semantic-article">{children}</article>
              ),
              section: ({ children }) => (
                <section data-testid="semantic-section">{children}</section>
              ),
              h1: ({ children }) => (
                <h1 data-testid="semantic-h1">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 data-testid="semantic-h2">{children}</h2>
              ),
              p: ({ children }) => (
                <p data-testid="semantic-p">{children}</p>
              )
            }}
          />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('semantic-article')).toBeInTheDocument();
      expect(screen.getByTestId('semantic-section')).toBeInTheDocument();
      expect(screen.getByTestId('semantic-h1')).toBeInTheDocument();
      expect(screen.getByTestId('semantic-h2')).toBeInTheDocument();
      expect(screen.getByTestId('semantic-p')).toBeInTheDocument();
    });
  });
});