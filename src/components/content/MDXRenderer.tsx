'use client';

import React, { Suspense } from 'react';
import { defaultMDXComponents } from './MDXComponents';

interface Frontmatter {
  title?: string;
  tags?: string[];
  date?: string;
  author?: string;
  [key: string]: any;
}

interface MDXRendererProps {
  content: React.ComponentType<{ components?: Record<string, React.ComponentType<any>> }>;
  components?: Record<string, React.ComponentType<any>>;
  frontmatter?: Frontmatter;
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
  lazyLoad?: boolean;
}

class MDXErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MDX Rendering Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong while rendering content.</div>;
    }

    return this.props.children;
  }
}

export function MDXRenderer({
  content: Content,
  components = {},
  frontmatter,
  fallback = 'Loading content...',
  errorBoundary = true,
  lazyLoad = false
}: MDXRendererProps) {
  // Merge default components with provided components
  const mergedComponents = {
    ...defaultMDXComponents,
    ...components,
  };

  const renderContent = () => {
    try {
      return <Content components={mergedComponents} />;
    } catch (error) {
      if (fallback) {
        return typeof fallback === 'string' ? <div>{fallback}</div> : fallback;
      }
      throw error;
    }
  };

  const content = errorBoundary ? (
    <MDXErrorBoundary fallback={fallback}>
      {renderContent()}
    </MDXErrorBoundary>
  ) : (
    renderContent()
  );

  if (lazyLoad) {
    return (
      <Suspense fallback={typeof fallback === 'string' ? <div>{fallback}</div> : fallback}>
        {content}
      </Suspense>
    );
  }

  return content;
}