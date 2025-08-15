/**
 * MDX Components Configuration
 * Next.js 15 MDX Support
 * 
 * This file provides custom React components for MDX content rendering.
 * It integrates liquid glass effects with MDX content seamlessly.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/configuring/mdx
 */

import type { MDXComponents } from 'mdx/types'
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Base HTML elements with liquid glass styling
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-6 text-white/90 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mb-4 text-white/85 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium mb-3 text-white/80">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-white/70 leading-relaxed mb-4">
        {children}
      </p>
    ),
    
    // Code elements with liquid glass styling
    code: ({ children }) => (
      <code className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded border border-white/20 text-blue-200 font-mono text-sm">
        {children}
      </code>
    ),
    
    pre: ({ children }) => (
      <LiquidGlassCard 
        className="p-4 mb-6 overflow-x-auto"
        variant="glass-medium"
        blur={15}
        opacity={0.1}
      >
        <pre className="text-sm leading-relaxed text-blue-100 font-mono">
          {children}
        </pre>
      </LiquidGlassCard>
    ),
    
    // List elements
    ul: ({ children }) => (
      <ul className="space-y-2 mb-4 text-white/70">
        {children}
      </ul>
    ),
    
    li: ({ children }) => (
      <li className="flex items-start space-x-2">
        <span className="text-blue-400 mt-1.5 block w-1 h-1 bg-blue-400 rounded-full flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
    
    // Block elements with glass effects
    blockquote: ({ children }) => (
      <LiquidGlassCard 
        className="border-l-4 border-blue-400/50 pl-4 py-3 mb-6"
        variant="glass-subtle"
        blur={8}
        opacity={0.06}
      >
        <blockquote className="italic text-white/60">
          {children}
        </blockquote>
      </LiquidGlassCard>
    ),
    
    // Link styling
    a: ({ href, children }) => (
      <a 
        href={href} 
        className="text-blue-300 hover:text-blue-200 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors duration-200"
      >
        {children}
      </a>
    ),
    
    // Image with glass container
    img: ({ src, alt, ...props }) => (
      <LiquidGlassCard className="overflow-hidden mb-6">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto object-cover"
          {...props}
        />
      </LiquidGlassCard>
    ),
    
    // Table with glass styling
    table: ({ children }) => (
      <LiquidGlassCard className="overflow-x-auto mb-6">
        <table className="w-full text-white/70">
          {children}
        </table>
      </LiquidGlassCard>
    ),
    
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-semibold text-white/80 border-b border-white/20">
        {children}
      </th>
    ),
    
    td: ({ children }) => (
      <td className="px-4 py-2 border-b border-white/10">
        {children}
      </td>
    ),
    
    // Custom components can be overridden
    ...components,
  }
}