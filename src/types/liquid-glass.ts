export interface LiquidGlassCardProps {
  variant: 'subtle' | 'medium' | 'intense';
  blur: number;
  opacity: number;
  saturation: number;
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  seasonalTheme?: boolean;
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy';
export type ParticleType = 'sakura' | 'waterdrops' | 'leaves' | 'snow';

export interface SeasonalTheme {
  season: Season;
  timeOfDay: TimeOfDay;
  weather?: Weather;
  glassMorphism: {
    backdropFilter: string;
    backgroundColor: string;
    borderColor: string;
    particleEffect?: ParticleType;
  };
}

export interface SeasonalThemeConfig {
  id: string;
  season: Season;
  timeOfDay: TimeOfDay;
  weather?: Weather;
  
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  
  glassMorphism: {
    backdropFilter: string;
    backgroundColor: string;
    borderColor: string;
    shadowColor: string;
  };
  
  particles: {
    type: ParticleType;
    count: number;
    size: [number, number];
    speed: number;
    opacity: number;
  };
  
  animations: {
    transition: string;
    easing: string;
    duration: number;
  };
}

export interface EffectParameters {
  blur?: number;
  opacity?: number;
  saturation?: number;
  brightness?: number;
  contrast?: number;
  hueRotate?: number;
  borderRadius?: number;
  backgroundColor?: string;
  borderColor?: string;
}

export interface EffectData {
  id: string;
  name: string;
  description: string;
  code: string;
  parameters: EffectParameters;
  previewImage: string;
  category: EffectCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  performance: PerformanceMetrics;
  compatibility: BrowserCompatibility;
  createdBy: string;
  createdAt: Date;
  downloads: number;
  likes: number;
}

export type EffectCategory = 'button' | 'card' | 'navigation' | 'overlay' | 'background' | 'text';

export interface BrowserCompatibility {
  chrome: number;
  firefox: number;
  safari: number;
  edge: number;
  hasPolyfill: boolean;
  fallbackAvailable: boolean;
}