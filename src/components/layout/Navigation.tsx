'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn, applyLiquidGlassTheme, prefersReducedMotion } from '@/lib/utils';

interface NavigationProps {
  className?: string;
  variant?: 'default' | 'glass-subtle' | 'glass-medium' | 'glass-intense';
}

interface NavigationLink {
  href: string;
  label: string;
  external?: boolean;
}

export function Navigation({ className, variant = 'glass-medium' }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Handle hydration and setup
  useEffect(() => {
    setMounted(true);
    setCurrentPath(window.location.pathname);
    setReducedMotion(prefersReducedMotion());
  }, []);

  // Handle scroll effects for enhanced glass backdrop
  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isMobileMenuOpen]);

  const navigationLinks: NavigationLink[] = [
    { href: '/', label: 'Home' },
    { href: '/posts', label: 'Posts' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (href: string) => {
    return currentPath === href;
  };

  const getGlassVariant = () => {
    if (variant === 'default') return 'medium';
    return variant.replace('glass-', '') as 'subtle' | 'medium' | 'intense';
  };

  const getAnimationClasses = () => {
    if (reducedMotion) {
      return 'transition-none';
    }
    return 'transition-all duration-300 ease-in-out';
  };

  const renderNavigationLink = ({ href, label, external }: NavigationLink, isMobile = false) => {
    const active = isActiveLink(href);
    
    const linkClasses = cn(
      'text-sm font-medium px-3 py-2 rounded-md',
      getAnimationClasses(),
      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-transparent',
      'hover:text-primary hover:bg-primary/5',
      active 
        ? 'text-primary bg-primary/10 active' 
        : 'text-gray-700 dark:text-gray-300',
      isMobile && 'block w-full text-left text-base'
    );

    const linkProps = {
      href,
      className: linkClasses,
      tabIndex: 0,
      ...(external && {
        target: '_blank',
        rel: 'noopener noreferrer'
      }),
      ...(isMobile && {
        onClick: closeMobileMenu
      })
    };

    return (
      <Link key={href} {...linkProps}>
        {label}
        {external && (
          <span className="ml-1 inline-block w-3 h-3" aria-hidden="true">
            ↗
          </span>
        )}
      </Link>
    );
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const baseNavClasses = cn(
    'sticky top-0 z-50 w-full border-b',
    getAnimationClasses(),
    isScrolled && !reducedMotion && 'shadow-lg backdrop-saturate-150'
  );

  const enhancedNavClasses = variant.startsWith('glass-') 
    ? applyLiquidGlassTheme(
        baseNavClasses,
        getGlassVariant(),
        'border-white/10 dark:border-white/5'
      )
    : cn(
        baseNavClasses,
        'bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm',
        'border-gray-200 dark:border-gray-800'
      );

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={cn(enhancedNavClasses, className)}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'flex items-center space-x-2 font-bold text-xl',
              'text-gray-900 dark:text-gray-100',
              getAnimationClasses(),
              'hover:text-primary focus:text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm'
            )}
            tabIndex={0}
          >
            <span>Liquid Glass Tech Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => renderNavigationLink(link))}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Toggle theme (currently ${theme})`}
              className={cn(
                "h-9 w-9",
                getAnimationClasses(),
                'hover:bg-primary/5 focus:bg-primary/5'
              )}
              tabIndex={0}
            >
              <span className="sr-only">Toggle theme</span>
              <span className="text-lg" role="img" aria-hidden="true">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Toggle theme (currently ${theme})`}
              className={cn(
                "h-9 w-9",
                getAnimationClasses(),
                'hover:bg-primary/5 focus:bg-primary/5'
              )}
              tabIndex={0}
            >
              <span className="sr-only">Toggle theme</span>
              <span className="text-lg" role="img" aria-hidden="true">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "h-9 w-9",
                getAnimationClasses(),
                'hover:bg-primary/5 focus:bg-primary/5'
              )}
              tabIndex={0}
            >
              <span className="sr-only">Toggle mobile menu</span>
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <span
                  className={cn(
                    'block h-0.5 w-5 bg-current',
                    reducedMotion ? '' : 'transition-all duration-200',
                    isMobileMenuOpen ? 'rotate-45 translate-y-1' : 'translate-y-0'
                  )}
                />
                <span
                  className={cn(
                    'block h-0.5 w-5 bg-current mt-1',
                    reducedMotion ? '' : 'transition-all duration-200',
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  )}
                />
                <span
                  className={cn(
                    'block h-0.5 w-5 bg-current mt-1',
                    reducedMotion ? '' : 'transition-all duration-200',
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0'
                  )}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            data-testid="mobile-menu"
            className={cn(
              'md:hidden border-t',
              getAnimationClasses(),
              variant.startsWith('glass-')
                ? applyLiquidGlassTheme('', getGlassVariant(), 'border-white/10 dark:border-white/5')
                : 'bg-white/95 backdrop-blur-md dark:bg-gray-950/95 border-gray-200 dark:border-gray-800'
            )}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationLinks.map((link) => renderNavigationLink(link, true))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}