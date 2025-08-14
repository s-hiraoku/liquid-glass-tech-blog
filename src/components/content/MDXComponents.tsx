'use client';

import React from 'react';

/**
 * Default MDX Components Library
 * 
 * Provides a comprehensive set of styled components for MDX content rendering,
 * including typography, code blocks, and custom interactive components.
 */

interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface CodeBlockProps extends ComponentProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  theme?: string;
  onCopy?: (code: string) => void;
}

interface TechSpecProps extends ComponentProps {
  title: string;
  specs: Record<string, string>;
}

interface PerformanceMetricsProps extends ComponentProps {
  metrics: Record<string, string>;
}

interface CodeDemoProps extends ComponentProps {
  code: string;
  language?: string;
  editable?: boolean;
  preview?: boolean;
}

interface EffectDemoProps extends ComponentProps {
  effect: string;
  parameters?: Record<string, any>;
  interactive?: boolean;
  showCode?: boolean;
}

// Typography Components
export const Typography = {
  h1: ({ children, className, ...props }: ComponentProps) => (
    <h1 
      className={`text-4xl font-bold mb-6 liquid-glass-text-effect transition-all duration-300 ${className || ''}`} 
      role="heading"
      aria-level={1}
      {...props}
    >
      {children}
    </h1>
  ),

  h2: ({ children, className, ...props }: ComponentProps) => (
    <h2 
      className={`text-3xl font-semibold mb-4 liquid-glass-text-subtle transition-all duration-300 ${className || ''}`} 
      role="heading"
      aria-level={2}
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ children, className, ...props }: ComponentProps) => (
    <h3 className={`text-2xl font-semibold mb-3 ${className || ''}`} {...props}>
      {children}
    </h3>
  ),

  p: ({ children, className, ...props }: ComponentProps) => (
    <p className={`mb-4 leading-relaxed ${className || ''}`} {...props}>
      {children}
    </p>
  ),

  blockquote: ({ children, className, ...props }: ComponentProps) => (
    <blockquote 
      className={`liquid-glass-card border-l-4 border-blue-500 pl-6 py-4 my-6 italic bg-glass-subtle backdrop-blur-sm rounded-r-lg shadow-liquid ${className || ''}`}
      role="blockquote"
      aria-label="Quote"
      {...props}
    >
      {children}
    </blockquote>
  ),

  ul: ({ children, className, ...props }: ComponentProps) => (
    <ul className={`list-disc list-inside mb-4 space-y-2 ${className || ''}`} {...props}>
      {children}
    </ul>
  ),

  ol: ({ children, className, ...props }: ComponentProps) => (
    <ol className={`list-decimal list-inside mb-4 space-y-2 ${className || ''}`} {...props}>
      {children}
    </ol>
  ),

  li: ({ children, className, ...props }: ComponentProps) => (
    <li className={`ml-4 ${className || ''}`} {...props}>
      {children}
    </li>
  ),
};

// Code Components
export const CodeComponents = {
  pre: ({ children, className, ...props }: ComponentProps) => (
    <div className="liquid-glass-card-wrapper my-6">
      <pre 
        className={`liquid-glass-code bg-glass-dark text-glass-light p-6 rounded-lg overflow-x-auto backdrop-blur-md shadow-liquid border border-glass-border ${className || ''}`}
        role="presentation"
        tabIndex={0}
        aria-label="Code block"
        {...props}
      >
        {children}
      </pre>
    </div>
  ),

  code: ({ children, className, ...props }: ComponentProps) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code 
          className={`bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm ${className || ''}`}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  CodeBlock: ({ 
    code, 
    language = 'javascript', 
    showLineNumbers = false, 
    showCopyButton = false,
    theme = 'default',
    onCopy,
    className,
    ...props 
  }: CodeBlockProps) => (
    <div className={`relative my-4 theme-${theme} ${className || ''}`} {...props}>
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2">
        <span className="text-sm font-medium">{language.toUpperCase()}</span>
        {showCopyButton && (
          <button 
            onClick={() => onCopy?.(code)}
            className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy
          </button>
        )}
      </div>
      <div className="flex">
        {showLineNumbers && (
          <div className="bg-gray-200 dark:bg-gray-700 px-2 py-4 text-sm text-gray-600 select-none">
            {code.split('\n').map((_: any, index: number) => (
              <div key={index + 1} className="leading-6">
                {index + 1}
              </div>
            ))}
          </div>
        )}
        <pre className="flex-1 p-4 overflow-x-auto">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  ),
};

// shadcn/ui Components
export const ShadcnComponents = {
  Button: ({ children, className, ...props }: ComponentProps) => (
    <button 
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  ),

  Card: ({ children, className, ...props }: ComponentProps) => (
    <div 
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  ),

  CardHeader: ({ children, className, ...props }: ComponentProps) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`} {...props}>
      {children}
    </div>
  ),

  CardTitle: ({ children, className, ...props }: ComponentProps) => (
    <h3 
      className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}
      {...props}
    >
      {children}
    </h3>
  ),

  CardContent: ({ children, className, ...props }: ComponentProps) => (
    <div className={`p-6 pt-0 ${className || ''}`} {...props}>
      {children}
    </div>
  ),
};

// Liquid Glass Components
export const LiquidGlassComponents = {
  LiquidGlassCard: ({ children, variant = 'default', className, ...props }: ComponentProps & { variant?: string }) => (
    <div 
      className={`p-6 rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}
      data-variant={variant}
      {...props}
    >
      {children}
    </div>
  ),

  TechSpec: ({ title, specs, className, ...props }: TechSpecProps) => (
    <div className={`border rounded-lg p-4 my-4 ${className || ''}`} {...props}>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-1">
        {Object.entries(specs || {}).map(([key, value]) => (
          <li key={key} className="flex justify-between">
            <span className="capitalize">{key}:</span>
            <span className="font-medium">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  ),

  PerformanceMetrics: ({ metrics, className, ...props }: PerformanceMetricsProps) => (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 my-4 ${className || ''}`} {...props}>
      {Object.entries(metrics || {}).map(([key, value]) => (
        <div key={key} className="text-center p-3 border rounded">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-600 uppercase">{key}</div>
        </div>
      ))}
    </div>
  ),

  CodeDemo: ({ 
    code, 
    language = 'javascript', 
    editable = false, 
    preview = false, 
    className,
    ...props 
  }: CodeDemoProps) => (
    <div className={`border rounded-lg overflow-hidden my-4 ${className || ''}`} {...props}>
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium">
        {language.toUpperCase()}
      </div>
      <div className="relative">
        <pre className="p-4 overflow-x-auto">
          <code className={`language-${language}`}>{code}</code>
        </pre>
        {editable && (
          <div className="absolute top-2 right-2 text-xs text-gray-500">
            Editable
          </div>
        )}
      </div>
      {preview && (
        <div className="border-t p-4 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-600">Preview enabled</div>
        </div>
      )}
    </div>
  ),

  EffectDemo: ({ 
    effect, 
    parameters = {}, 
    interactive = true, 
    showCode = true, 
    className,
    ...props 
  }: EffectDemoProps) => {
    const [currentParams, setCurrentParams] = React.useState(parameters);
    const [showSourceCode, setShowSourceCode] = React.useState(showCode);

    const handleParameterChange = (key: string, value: any) => {
      if (interactive) {
        setCurrentParams(prev => ({ ...prev, [key]: value }));
      }
    };

    return (
      <div 
        className={`liquid-glass-card border rounded-lg overflow-hidden my-6 ${className || ''}`} 
        role="application"
        aria-label={`${effect} effect demonstration`}
        {...props}
      >
        {/* Header */}
        <div className="bg-glass-header border-b border-glass-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{effect} Demo</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSourceCode(!showSourceCode)}
              className="text-sm px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              aria-label={`${showSourceCode ? 'Hide' : 'Show'} source code`}
            >
              {showSourceCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
        </div>

        {/* Effect Preview */}
        <div className="p-6 bg-glass-preview min-h-[200px] flex items-center justify-center">
          <div 
            className={`liquid-glass-effect effect-${effect}`}
            style={currentParams}
            data-effect={effect}
            aria-label="Effect preview"
          >
            <div className="effect-content">
              {effect.charAt(0).toUpperCase() + effect.slice(1)} Effect Preview
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        {interactive && Object.keys(parameters).length > 0 && (
          <div className="border-t border-glass-border p-6 bg-glass-controls">
            <h4 className="text-sm font-medium mb-3">Parameters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(parameters).map(([key, defaultValue]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize" htmlFor={`param-${key}`}>
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                  <input
                    id={`param-${key}`}
                    type={typeof defaultValue === 'number' ? 'range' : 'text'}
                    min={typeof defaultValue === 'number' ? 0 : undefined}
                    max={typeof defaultValue === 'number' ? 100 : undefined}
                    value={currentParams[key] || defaultValue}
                    onChange={(e) => {
                      const value = typeof defaultValue === 'number' 
                        ? parseInt(e.target.value, 10) 
                        : e.target.value;
                      handleParameterChange(key, value);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={`param-${key}-description`}
                  />
                  <div id={`param-${key}-description`} className="sr-only">
                    Adjust {key} parameter for the {effect} effect
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source Code */}
        {showSourceCode && (
          <div className="border-t border-glass-border">
            <div className="bg-glass-code text-sm">
              <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 font-medium">
                Generated Code
              </div>
              <pre className="p-6 overflow-x-auto text-gray-800 dark:text-gray-200">
                <code>{`// ${effect} effect with current parameters
const effectConfig = ${JSON.stringify(currentParams, null, 2)};

// Apply to element
element.classList.add('liquid-glass-effect', 'effect-${effect}');
Object.assign(element.style, effectConfig);`}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  },
};

// Semantic HTML Components
export const SemanticComponents = {
  article: ({ children, ...props }: ComponentProps) => (
    <article {...props}>{children}</article>
  ),
  
  section: ({ children, ...props }: ComponentProps) => (
    <section {...props}>{children}</section>
  ),
};

// Combined default components export
export const defaultMDXComponents = {
  ...Typography,
  ...CodeComponents,
  ...ShadcnComponents,
  ...LiquidGlassComponents,
  ...SemanticComponents,
  
  // Alias for convenient access
  EffectDemo: LiquidGlassComponents.EffectDemo,
};