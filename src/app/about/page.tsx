import React from 'react';
import { Metadata } from 'next';
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'About - Liquid Glass Tech Blog',
  description: 'Learn about our modern blog platform showcasing liquid glass effects with cutting-edge web technologies and accessible design.',
  keywords: 'about, liquid glass, Next.js, React, TypeScript, web development, GPU acceleration, MDX, performance optimization',
  openGraph: {
    title: 'About - Liquid Glass Tech Blog',
    description: 'Modern blog platform showcasing liquid glass effects with cutting-edge web technologies and accessible design.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - Liquid Glass Tech Blog',
    description: 'Modern blog platform showcasing liquid glass effects with cutting-edge web technologies.',
  },
};

interface TechBadgeProps {
  name: string;
  category: 'framework' | 'language' | 'styling' | 'ui';
}

interface FeatureItemProps {
  title: string;
  description: string;
  icon: string;
}

export default function AboutPage() {
  const technologies: TechBadgeProps[] = [
    { name: 'Next.js 15', category: 'framework' },
    { name: 'React 19', category: 'framework' },
    { name: 'TypeScript', category: 'language' },
    { name: 'Tailwind CSS 4', category: 'styling' },
    { name: 'shadcn/ui', category: 'ui' },
  ];

  const features: FeatureItemProps[] = [
    {
      title: 'GPU-accelerated effects',
      description: 'Smooth 60FPS animations with hardware acceleration',
      icon: '⚡',
    },
    {
      title: 'MDX content support',
      description: 'Rich interactive content with React components',
      icon: '📝',
    },
    {
      title: 'Performance optimization',
      description: 'Core Web Vitals compliance and lightning-fast loading',
      icon: '🚀',
    },
  ];

  const getBadgeVariant = (category: TechBadgeProps['category']) => {
    const variants = {
      framework: 'default',
      language: 'secondary',
      styling: 'outline',
      ui: 'destructive',
    } as const;
    return variants[category] || 'outline';
  };

  return (
    <main className="container mx-auto px-4 py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <LiquidGlassCard 
          variant="glass-intense" 
          motionPreset="spring" 
          interactive
          className="py-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            About
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Liquid Glass Tech Blog
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Modern blog platform showcasing liquid glass effects with cutting-edge web technologies and accessible design patterns.
          </p>
        </LiquidGlassCard>
      </section>

      {/* Technology Stack Section */}
      <section className="space-y-6">
        <LiquidGlassCard 
          variant="glass-medium" 
          motionPreset="smooth"
          seasonalTheme
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {technologies.map((tech) => (
              <div key={tech.name} className="flex flex-col items-center space-y-2">
                <Badge 
                  variant={getBadgeVariant(tech.category)}
                  className="px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  {tech.name}
                </Badge>
              </div>
            ))}
          </div>
        </LiquidGlassCard>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <LiquidGlassCard variant="glass-medium" motionPreset="smooth">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <LiquidGlassCard 
                key={feature.title}
                variant="glass-subtle" 
                interactive
                className="p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  {feature.description}
                </p>
              </LiquidGlassCard>
            ))}
          </div>
        </LiquidGlassCard>
      </section>

      {/* Mission Statement Section */}
      <section className="space-y-6">
        <LiquidGlassCard 
          variant="glass-intense" 
          motionPreset="spring" 
          seasonalTheme
          className="text-center py-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Our Mission
          </h2>
          <blockquote className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed italic">
            "Demonstrate cutting-edge web technologies with accessible design, 
            creating beautiful and performant experiences for everyone."
          </blockquote>
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-500">
            — Liquid Glass Tech Blog Team
          </div>
        </LiquidGlassCard>
      </section>

      {/* Additional Info Section */}
      <section className="grid md:grid-cols-2 gap-8">
        <LiquidGlassCard 
          variant="glass-medium" 
          interactive
          className="p-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Performance First
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Built with performance in mind, achieving Core Web Vitals excellence 
            while delivering stunning visual effects through GPU acceleration 
            and optimized rendering pipelines.
          </p>
        </LiquidGlassCard>

        <LiquidGlassCard 
          variant="glass-medium" 
          interactive
          className="p-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Accessibility Focused
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Designed with WCAG 2.1 AA compliance, respecting user preferences 
            for reduced motion, high contrast, and providing excellent keyboard 
            navigation and screen reader support.
          </p>
        </LiquidGlassCard>
      </section>
    </main>
  );
}