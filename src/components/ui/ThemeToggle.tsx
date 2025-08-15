/**
 * ThemeToggle Component - Phase 6.5-6.6 Production Enhancement
 * 
 * Advanced theme system with liquid glass effects and seasonal variations.
 * Complete theme toggle integration with enhanced accessibility and performance.
 * 
 * Phase 6.5-6.6 Features:
 * - Complete theme toggle integration with liquid glass effects
 * - Seasonal theme variations with smooth transitions
 * - localStorage persistence and system preference detection
 * - Theme compatibility across all components
 * - Advanced accessibility compliance (WCAG 2.1 AA)
 * - Performance optimization with reduced motion support
 * - Device-adaptive liquid glass intensity
 * - Smooth theme transition animations
 * - Error handling and fallback mechanisms
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import seasonal theme hook and performance optimization
import { useSeasonalTheme } from '@/lib/theme/seasonalTheme';
import { useDeviceOptimization } from '@/hooks/useDeviceOptimization';

// Icons for better visual feedback
import { Sun, Moon, Monitor, Palette, Sparkles } from 'lucide-react';

// Theme transition effects
const THEME_TRANSITIONS = {
  default: 'transition-all duration-300 ease-in-out',
  fast: 'transition-all duration-150 ease-out',
  smooth: 'transition-all duration-500 ease-in-out',
  spring: 'transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]'
} as const;

export interface ThemeToggleProps {
  variant?: 'default' | 'glass-subtle' | 'glass-medium' | 'glass-intense';
  size?: 'sm' | 'md' | 'lg';
  showSeasonalIndicator?: boolean;
  showSeasonalToggle?: boolean;
  showSystemIndicator?: boolean;
  interactive?: boolean;
  seasonalGlass?: boolean;
  persistTheme?: boolean;
  announceChanges?: boolean;
  animationDuration?: number;
  enableSoundFeedback?: boolean;
  showTooltips?: boolean;
  position?: 'fixed' | 'relative';
  hideLabels?: boolean;
  compactMode?: boolean;
  className?: string;
}

export function ThemeToggle({
  variant = 'default',
  size = 'md',
  showSeasonalIndicator = false,
  showSeasonalToggle = false,
  showSystemIndicator = false,
  interactive = true,
  seasonalGlass = true,
  persistTheme = true,
  announceChanges = true,
  animationDuration = 300,
  enableSoundFeedback = false,
  showTooltips = true,
  position = 'relative',
  hideLabels = false,
  compactMode = false,
  className,
}: ThemeToggleProps) {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const { 
    currentSeason, 
    seasonalTheme, 
    toggleSeasonalMode, 
    isSeasonalModeEnabled,
    weatherCondition,
    isTransitioning
  } = useSeasonalTheme();
  const { performanceTier, deviceCapabilities } = useDeviceOptimization();
  
  const [mounted, setMounted] = useState(false);
  const [announcement, setAnnouncement] = useState<string>('');
  const [isTransitioningTheme, setIsTransitioningTheme] = useState(false);
  const [lastThemeChange, setLastThemeChange] = useState<Date | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    // Prevent rapid theme switching
    if (isTransitioningTheme) return;
    
    setIsTransitioningTheme(true);
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setLastThemeChange(new Date());
    
    // Play sound feedback if enabled
    if (enableSoundFeedback && 'AudioContext' in window) {
      try {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(newTheme === 'dark' ? 800 : 1000, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        
        // Clean up
        setTimeout(() => audioContext.close(), 200);
      } catch (error) {
        // Ignore audio errors
      }
    }
    
    if (announceChanges) {
      const message = `Switched to ${newTheme} mode${seasonalGlass && currentSeason ? ` with ${currentSeason} theme` : ''}`;
      setAnnouncement(message);
    }
    
    // Reset transition state
    setTimeout(() => setIsTransitioningTheme(false), animationDuration);
  };

  const toggleSystemTheme = () => {
    const newTheme = theme === 'system' ? 'light' : 'system';
    setTheme(newTheme);
    
    if (announceChanges) {
      const message = newTheme === 'system' 
        ? `Switched to system theme (currently ${systemTheme})`
        : 'Switched to manual theme control';
      setAnnouncement(message);
    }
  };

  const getThemeIcon = () => {
    if (theme === 'system') {
      return <Monitor className="w-4 h-4" />;
    }
    return theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;
  };

  const getSeasonalIcon = () => {
    if (!isSeasonalModeEnabled) return <Palette className="w-4 h-4" />;
    
    const seasonIcons = {
      spring: '🌸',
      summer: '☀️',
      autumn: '🍂',
      winter: '❄️'
    };
    
    return (
      <span role="img" aria-label={`${currentSeason} theme`}>
        {seasonIcons[currentSeason] || '🎨'}
      </span>
    );
  };

  const getThemeLabel = () => {
    if (theme === 'system') {
      return `Toggle theme (currently system: ${resolvedTheme})`;
    }
    return theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  };

  const getSeasonalLabel = () => {
    return isSeasonalModeEnabled 
      ? `Seasonal themes enabled (${currentSeason})`
      : 'Enable seasonal themes';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8 text-sm';
      case 'lg': return 'h-12 w-12 text-lg';
      default: return 'h-9 w-9 text-base';
    }
  };

  const getVariantClasses = () => {
    if (variant.startsWith('glass-')) {
      const intensity = variant.replace('glass-', '');
      
      // Adapt glass effects based on device capabilities
      const adaptedIntensity = performanceTier === 'fallback-static' ? 'subtle' :
                              performanceTier === 'mobile-optimized' ? 'subtle' :
                              intensity;
      
      return cn(
        `liquid-glass-${adaptedIntensity}`,
        seasonalGlass && isSeasonalModeEnabled && 'seasonal-glass-colors',
        interactive && 'glass-interactive',
        isTransitioningTheme && 'glass-transitioning',
        currentSeason && seasonalGlass && `glass-${currentSeason}`
      );
    }
    return '';
  };

  const getMotionClasses = () => {
    const baseTransition = prefersReducedMotion 
      ? 'motion-reduce:transition-none'
      : THEME_TRANSITIONS.smooth;
      
    return cn(
      baseTransition,
      isTransitioningTheme && 'scale-95',
      interactive && !prefersReducedMotion && 'hover:scale-105 active:scale-95'
    );
  };

  const getContrastClasses = () => {
    return cn(
      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'high-contrast:border-2 high-contrast:border-current',
      theme === 'dark' && 'dark:focus-visible:ring-offset-background'
    );
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className={cn(
      'flex items-center gap-2',
      compactMode ? 'gap-1' : 'gap-2',
      position === 'fixed' && 'fixed top-4 right-4 z-50',
      className
    )}>
      {/* System Theme Indicator */}
      {showSystemIndicator && theme === 'system' && !hideLabels && (
        <div 
          data-testid="system-theme-indicator"
          className={cn(
            "text-xs text-muted-foreground",
            compactMode && "sr-only"
          )}
        >
          System ({resolvedTheme})
        </div>
      )}

      {/* Seasonal Theme Indicator */}
      {showSeasonalIndicator && isSeasonalModeEnabled && !hideLabels && (
        <div 
          data-testid="seasonal-indicator"
          className={cn(
            "text-xs text-muted-foreground capitalize flex items-center gap-1",
            compactMode && "sr-only"
          )}
        >
          {getSeasonalIcon()}
          <span>{currentSeason}</span>
          {weatherCondition && (
            <span className="opacity-70">({weatherCondition})</span>
          )}
        </div>
      )}

      {/* Main Theme Toggle Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          disabled={isTransitioningTheme}
          aria-label={getThemeLabel()}
          aria-pressed={theme === 'dark'}
          tabIndex={0}
          title={showTooltips ? getThemeLabel() : undefined}
          className={cn(
            getSizeClasses(),
            getVariantClasses(),
            getMotionClasses(),
            getContrastClasses(),
            'hover:bg-primary/5 focus:bg-primary/5',
            'relative overflow-hidden',
            isTransitioningTheme && 'pointer-events-none opacity-75'
          )}
          data-interactive={interactive}
          data-seasonal-glass={seasonalGlass}
          data-theme={theme}
          data-resolved-theme={resolvedTheme}
        >
          <span className="sr-only">{getThemeLabel()}</span>
          <span className="relative z-10" aria-hidden="true">
            {getThemeIcon()}
          </span>
          
          {/* Transition animation overlay */}
          {isTransitioningTheme && (
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          )}
        </Button>
        
        {/* System theme toggle (small indicator) */}
        {theme !== 'system' && (
          <button
            onClick={toggleSystemTheme}
            className="absolute -top-1 -right-1 w-3 h-3 bg-muted rounded-full border border-border hover:bg-muted/80 transition-colors"
            aria-label="Enable system theme detection"
            title={showTooltips ? "Switch to system theme" : undefined}
          >
            <Monitor className="w-2 h-2 m-0.5" />
          </button>
        )}
      </div>

      {/* Seasonal Theme Toggle */}
      {showSeasonalToggle && (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSeasonalMode}
            aria-label={getSeasonalLabel()}
            aria-pressed={isSeasonalModeEnabled}
            tabIndex={0}
            title={showTooltips ? getSeasonalLabel() : undefined}
            className={cn(
              getSizeClasses(),
              getMotionClasses(),
              getContrastClasses(),
              'hover:bg-primary/5 focus:bg-primary/5',
              isSeasonalModeEnabled && 'bg-primary/10 text-primary',
              isTransitioning && 'animate-pulse'
            )}
          >
            <span className="sr-only">{getSeasonalLabel()}</span>
            <span aria-hidden="true">
              {getSeasonalIcon()}
            </span>
          </Button>
          
          {/* Seasonal transition indicator */}
          {isTransitioning && (
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-3 h-3 text-primary animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Accessibility Announcements */}
      {announceChanges && announcement && (
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
      )}
      
      {/* Enhanced status information for screen readers */}
      <div className="sr-only" aria-live="polite">
        Current theme: {theme}. 
        {theme === 'system' && `System preference: ${systemTheme}. `}
        {isSeasonalModeEnabled && `Seasonal themes enabled for ${currentSeason}. `}
        {weatherCondition && `Weather condition: ${weatherCondition}. `}
        {lastThemeChange && `Last changed: ${lastThemeChange.toLocaleTimeString()}.`}
      </div>
    </div>
  );
}

// Export default for convenience
export default ThemeToggle;