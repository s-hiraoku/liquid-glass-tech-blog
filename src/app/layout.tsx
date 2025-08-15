/**
 * Root Layout - Phase 6.7-6.8 Responsive Design Enhancement
 * 
 * Production-ready layout with comprehensive responsive design:
 * - Mobile-first responsive approach with Tailwind breakpoints
 * - Touch gesture optimization for liquid glass effects
 * - Progressive enhancement for low-end devices
 * - Viewport-specific performance optimizations
 * - Enhanced accessibility with WCAG 2.1 AA compliance
 * - Core Web Vitals optimization (LCP <2.5s, INP <200ms, CLS <0.1)
 */

import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navigation } from "@/components/layout";
import { SeasonalThemeProvider } from "@/lib/theme/seasonalTheme";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { Suspense } from "react";
import "./globals.css";

// Enhanced fonts with preloading and fallbacks
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['Monaco', 'Consolas', 'monospace'],
  adjustFontFallback: true,
});

// Viewport configuration for responsive design
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
  colorScheme: 'light dark',
  viewportFit: 'cover'
};

// Enhanced metadata with comprehensive SEO and PWA support
export const metadata: Metadata = {
  metadataBase: new URL('https://liquid-glass-tech.com'),
  title: {
    default: "Liquid Glass Tech Blog",
    template: "%s | Liquid Glass Tech Blog",
  },
  description: "Discover the art of modern web development with liquid glass effects, seasonal theming, and performance-optimized animations. Learn cutting-edge techniques for creating stunning glassmorphism interfaces.",
  keywords: [
    "liquid glass", "glassmorphism", "web development", "React", "Next.js", 
    "TypeScript", "modern web design", "performance optimization", "accessibility",
    "responsive design", "CSS animations", "user interface", "frontend development"
  ],
  authors: [{ name: "Liquid Glass Tech Team", url: "https://liquid-glass-tech.com" }],
  creator: "Liquid Glass Tech Blog",
  publisher: "Liquid Glass Tech Blog",
  category: 'Technology',
  classification: 'Web Development Blog',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://liquid-glass-tech.com",
    siteName: "Liquid Glass Tech Blog",
    title: "Liquid Glass Tech Blog - Modern Web Development",
    description: "Discover the art of modern web development with liquid glass effects, seasonal theming, and performance-optimized animations. Learn cutting-edge techniques for creating stunning glassmorphism interfaces.",
    images: [
      {
        url: "/api/og/home",
        width: 1200,
        height: 630,
        alt: "Liquid Glass Tech Blog - Modern Web Development with Glassmorphism",
        type: "image/png",
      },
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Liquid Glass Tech Blog Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@liquidglasstech",
    creator: "@liquidglasstech",
    title: "Liquid Glass Tech Blog - Modern Web Development",
    description: "Discover the art of modern web development with liquid glass effects, seasonal theming, and performance-optimized animations.",
    images: ["/api/og/home"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
      noimageindex: false,
    },
  },
  alternates: {
    canonical: 'https://liquid-glass-tech.com',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'RSS Feed' }],
      'application/atom+xml': [{ url: '/atom.xml', title: 'Atom Feed' }],
      'application/json': [{ url: '/feed.json', title: 'JSON Feed' }],
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_VERIFICATION || '',
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Liquid Glass Tech Blog',
    startupImage: [
      {
        url: '/apple-touch-startup-image-768x1004.png',
        media: '(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)',
      },
      {
        url: '/apple-touch-startup-image-1536x2008.png',
        media: '(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'Liquid Glass Tech Blog',
    'msapplication-TileColor': '#0a0a0a',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#ffffff',
  },
};

// Loading component for navigation
function NavigationLoading() {
  return (
    <div className="h-16 bg-background/80 backdrop-blur-sm border-b border-border animate-pulse" />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="scroll-smooth"
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for potential external resources */}
        <link rel="dns-prefetch" href="//analytics.google.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Preload critical CSS */}
        <link 
          rel="preload" 
          href="/fonts/inter-var.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
        
        {/* Progressive Web App meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Liquid Glass Tech" />
        
        {/* Touch icons for iOS */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Microsoft tiles */}
        <meta name="msapplication-TileImage" content="/mstile-150x150.png" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
      </head>
      <body
        className={`
          ${inter.variable} ${jetbrainsMono.variable} 
          antialiased min-h-screen bg-background font-sans
          selection:bg-primary/20 selection:text-primary-foreground
          focus-within:scroll-smooth
          motion-reduce:transition-none motion-reduce:animate-none
        `}
        suppressHydrationWarning
      >
        <ErrorBoundary
          fallback={
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                <p className="text-muted-foreground mb-6">
                  We encountered an unexpected error. Please refresh the page to try again.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          }
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            enableColorScheme
            storageKey="liquid-glass-theme"
          >
            <SeasonalThemeProvider>
              <ClientProviders>
                <div className="relative flex min-h-screen flex-col">
                  {/* Skip link for accessibility */}
                  <a 
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Skip to main content
                  </a>
                  
                  {/* Enhanced Navigation with performance optimization */}
                  <Suspense fallback={<NavigationLoading />}>
                    <Navigation 
                      variant="glass-medium"
                    />
                  </Suspense>
                  
                  {/* Main content area with improved focus management */}
                  <main 
                    id="main-content"
                    className="flex-1 focus:outline-none"
                    tabIndex={-1}
                    role="main"
                    aria-label="Main content"
                  >
                    <ErrorBoundary
                      fallback={
                        <div className="container mx-auto px-4 py-16 text-center">
                          <h2 className="text-xl font-semibold mb-4">Content Error</h2>
                          <p className="text-muted-foreground mb-6">
                            There was an issue loading this page content.
                          </p>
                          <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                          >
                            Try Again
                          </button>
                        </div>
                      }
                    >
                      {children}
                    </ErrorBoundary>
                  </main>
                  
                  {/* Footer placeholder for future implementation */}
                  <footer className="border-t border-border bg-muted/30 py-8">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                      © 2024 Liquid Glass Tech Blog. Built with Next.js 15 and passion for modern web development.
                    </div>
                  </footer>
                </div>
              </ClientProviders>
            </SeasonalThemeProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}