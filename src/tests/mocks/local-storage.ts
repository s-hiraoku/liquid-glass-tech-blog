/**
 * LocalStorage Mock for Testing
 * 
 * Provides comprehensive localStorage mock implementation for testing
 * theme persistence, user preferences, and storage-related functionality.
 */

import { vi } from 'vitest';

// Types for localStorage data
export interface ThemePreferences {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  autoMode: boolean;
  glassIntensity: number;
  particlesEnabled: boolean;
  motionReduced: boolean;
}

export interface UserPreferences {
  theme: ThemePreferences;
  performance: {
    enableGPUAcceleration: boolean;
    maxParticleCount: number;
    qualityLevel: 'low' | 'medium' | 'high';
    enableAnimations: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
  analytics: {
    enableTracking: boolean;
    sharePerformanceData: boolean;
  };
}

// Storage simulation
class MockStorage implements Storage {
  private storage: Record<string, string> = {};
  private quotaExceeded = false;
  private maxSize = 5 * 1024 * 1024; // 5MB default quota
  private currentSize = 0;

  get length(): number {
    return Object.keys(this.storage).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.storage);
    return keys[index] || null;
  }

  getItem(key: string): string | null {
    // Simulate async behavior
    return this.storage[key] || null;
  }

  setItem(key: string, value: string): void {
    const newSize = this.calculateSize() + value.length + key.length;
    
    if (this.quotaExceeded || newSize > this.maxSize) {
      const error = new DOMException(
        'Failed to execute \'setItem\' on \'Storage\': Setting the value of \'' + 
        key + '\' exceeded the quota.',
        'QuotaExceededError'
      );
      throw error;
    }

    this.storage[key] = value;
    this.currentSize = newSize;
  }

  removeItem(key: string): void {
    delete this.storage[key];
    this.currentSize = this.calculateSize();
  }

  clear(): void {
    this.storage = {};
    this.currentSize = 0;
  }

  // Test utilities
  private calculateSize(): number {
    return Object.entries(this.storage).reduce(
      (total, [key, value]) => total + key.length + value.length,
      0
    );
  }

  // Mock-specific methods for testing
  public setQuotaExceeded(exceeded: boolean): void {
    this.quotaExceeded = exceeded;
  }

  public setMaxSize(size: number): void {
    this.maxSize = size;
  }

  public getCurrentSize(): number {
    return this.currentSize;
  }

  public getStorageContents(): Record<string, string> {
    return { ...this.storage };
  }

  public simulateStorageEvent(key: string, oldValue: string | null, newValue: string | null): void {
    const event = new StorageEvent('storage', {
      key,
      oldValue,
      newValue,
      url: window.location.href,
      storageArea: this,
    });
    window.dispatchEvent(event);
  }
}

// Create mock localStorage instance
const mockLocalStorageInstance = new MockStorage();

// Mock localStorage utility functions
export const mockLocalStorage = () => {
  const storage = mockLocalStorageInstance;
  
  // Mock localStorage on window object
  Object.defineProperty(window, 'localStorage', {
    value: storage,
    writable: true,
    configurable: true,
  });

  // Mock storage event handling
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = vi.fn((event: string, handler: EventListener) => {
    if (event === 'storage') {
      // Store storage event handlers for testing
      originalAddEventListener.call(window, event, handler);
    } else {
      originalAddEventListener.call(window, event, handler);
    }
  });

  return {
    storage,
    
    // Test utilities
    setQuotaExceeded: (exceeded: boolean) => storage.setQuotaExceeded(exceeded),
    setMaxSize: (size: number) => storage.setMaxSize(size),
    getCurrentSize: () => storage.getCurrentSize(),
    getStorageContents: () => storage.getStorageContents(),
    simulateStorageEvent: (key: string, oldValue: string | null, newValue: string | null) => 
      storage.simulateStorageEvent(key, oldValue, newValue),
    
    // Reset utility
    reset: () => {
      storage.clear();
      storage.setQuotaExceeded(false);
      storage.setMaxSize(5 * 1024 * 1024);
    },
  };
};

// Theme persistence utilities
export const mockThemePersistence = () => {
  const localStorageMock = mockLocalStorage();
  
  const defaultThemePreferences: ThemePreferences = {
    season: 'spring',
    timeOfDay: 'morning',
    autoMode: true,
    glassIntensity: 0.8,
    particlesEnabled: true,
    motionReduced: false,
  };

  const saveThemePreferences = (preferences: Partial<ThemePreferences>) => {
    const current = getThemePreferences();
    const updated = { ...current, ...preferences };
    localStorageMock.storage.setItem('theme-preferences', JSON.stringify(updated));
  };

  const getThemePreferences = (): ThemePreferences => {
    try {
      const stored = localStorageMock.storage.getItem('theme-preferences');
      return stored ? JSON.parse(stored) : defaultThemePreferences;
    } catch {
      return defaultThemePreferences;
    }
  };

  const clearThemePreferences = () => {
    localStorageMock.storage.removeItem('theme-preferences');
  };

  return {
    ...localStorageMock,
    saveThemePreferences,
    getThemePreferences,
    clearThemePreferences,
    defaultThemePreferences,
  };
};

// User preferences utilities
export const mockUserPreferences = () => {
  const localStorageMock = mockLocalStorage();
  
  const defaultUserPreferences: UserPreferences = {
    theme: {
      season: 'spring',
      timeOfDay: 'morning',
      autoMode: true,
      glassIntensity: 0.8,
      particlesEnabled: true,
      motionReduced: false,
    },
    performance: {
      enableGPUAcceleration: true,
      maxParticleCount: 100,
      qualityLevel: 'high',
      enableAnimations: true,
    },
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      screenReader: false,
    },
    analytics: {
      enableTracking: true,
      sharePerformanceData: false,
    },
  };

  const saveUserPreferences = (preferences: Partial<UserPreferences>) => {
    const current = getUserPreferences();
    const updated = { ...current, ...preferences };
    localStorageMock.storage.setItem('user-preferences', JSON.stringify(updated));
  };

  const getUserPreferences = (): UserPreferences => {
    try {
      const stored = localStorageMock.storage.getItem('user-preferences');
      return stored ? JSON.parse(stored) : defaultUserPreferences;
    } catch {
      return defaultUserPreferences;
    }
  };

  const clearUserPreferences = () => {
    localStorageMock.storage.removeItem('user-preferences');
  };

  return {
    ...localStorageMock,
    saveUserPreferences,
    getUserPreferences,
    clearUserPreferences,
    defaultUserPreferences,
  };
};

// Performance data persistence
export const mockPerformancePersistence = () => {
  const localStorageMock = mockLocalStorage();
  
  interface PerformanceData {
    sessionId: string;
    timestamp: number;
    metrics: {
      lcp: number;
      inp: number;
      cls: number;
      glasRenderTime: number;
      frameRate: number;
      memoryUsage: number;
    };
    deviceInfo: {
      userAgent: string;
      viewport: { width: number; height: number };
      devicePixelRatio: number;
      hardwareConcurrency: number;
    };
  }

  const savePerformanceData = (data: PerformanceData) => {
    const key = `performance-${data.sessionId}`;
    localStorageMock.storage.setItem(key, JSON.stringify(data));
  };

  const getPerformanceData = (sessionId: string): PerformanceData | null => {
    try {
      const stored = localStorageMock.storage.getItem(`performance-${sessionId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const getAllPerformanceData = (): PerformanceData[] => {
    const keys = Object.keys(localStorageMock.storage.getStorageContents())
      .filter(key => key.startsWith('performance-'));
    
    return keys.map(key => {
      try {
        const data = localStorageMock.storage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    }).filter(Boolean);
  };

  const clearPerformanceData = () => {
    const keys = Object.keys(localStorageMock.storage.getStorageContents())
      .filter(key => key.startsWith('performance-'));
    
    keys.forEach(key => localStorageMock.storage.removeItem(key));
  };

  return {
    ...localStorageMock,
    savePerformanceData,
    getPerformanceData,
    getAllPerformanceData,
    clearPerformanceData,
  };
};

// Storage event simulation utilities
export const mockStorageEvents = () => {
  const listeners: ((event: StorageEvent) => void)[] = [];
  
  const addEventListener = vi.fn((event: string, handler: EventListener) => {
    if (event === 'storage') {
      listeners.push(handler as (event: StorageEvent) => void);
    }
  });

  const removeEventListener = vi.fn((event: string, handler: EventListener) => {
    if (event === 'storage') {
      const index = listeners.indexOf(handler as (event: StorageEvent) => void);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  });

  const triggerStorageEvent = (key: string, oldValue: string | null, newValue: string | null) => {
    const event = new StorageEvent('storage', {
      key,
      oldValue,
      newValue,
      url: window.location.href,
      storageArea: window.localStorage,
    });
    
    listeners.forEach(listener => listener(event));
  };

  // Mock window event methods
  window.addEventListener = addEventListener;
  window.removeEventListener = removeEventListener;

  return {
    addEventListener,
    removeEventListener,
    triggerStorageEvent,
    getListenerCount: () => listeners.length,
  };
};

// Export storage mock utilities
export { MockStorage, mockLocalStorageInstance };

// Default export for convenience
export default mockLocalStorage;