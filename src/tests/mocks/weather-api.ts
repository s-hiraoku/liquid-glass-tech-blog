/**
 * WeatherAPI Mock for Testing
 * 
 * Provides mock implementations for weather API calls used in seasonal theme detection
 * and environmental glass effect adjustments.
 */

import { vi } from 'vitest';

// Weather data types
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  weather: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  location: string;
  description: string;
  icon: string;
  timestamp: number;
}

export interface WeatherForecast {
  date: string;
  weather: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  windSpeed: number;
}

export interface WeatherAPIResponse {
  current: CurrentWeather;
  forecast: WeatherForecast[];
  location: {
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
}

// Mock weather data
const mockWeatherData: WeatherAPIResponse = {
  current: {
    weather: 'sunny',
    temperature: 22,
    humidity: 60,
    windSpeed: 5.2,
    visibility: 10000,
    location: 'Tokyo',
    description: 'Clear sky',
    icon: '01d',
    timestamp: Date.now(),
  },
  forecast: [
    {
      date: '2024-01-15',
      weather: 'partly-cloudy',
      temperature: { min: 18, max: 25 },
      humidity: 65,
      windSpeed: 4.8,
    },
    {
      date: '2024-01-16',
      weather: 'rainy',
      temperature: { min: 15, max: 20 },
      humidity: 85,
      windSpeed: 7.2,
    },
    {
      date: '2024-01-17',
      weather: 'sunny',
      temperature: { min: 20, max: 27 },
      humidity: 55,
      windSpeed: 3.5,
    },
  ],
  location: {
    city: 'Tokyo',
    country: 'Japan',
    coordinates: {
      lat: 35.6762,
      lon: 139.6503,
    },
  },
};

// Mock API endpoints
export class WeatherAPI {
  private static mockData = mockWeatherData;
  private static shouldThrowError = false;
  private static errorType: 'network' | 'auth' | 'rate-limit' | 'not-found' = 'network';

  // Mock method for getting current weather
  static async getCurrentWeather(location?: string): Promise<CurrentWeather> {
    await this.simulateNetworkDelay();
    
    if (this.shouldThrowError) {
      this.throwMockError();
    }

    return {
      ...this.mockData.current,
      location: location || this.mockData.current.location,
    };
  }

  // Mock method for getting weather forecast
  static async getWeatherForecast(location?: string, days: number = 3): Promise<WeatherForecast[]> {
    await this.simulateNetworkDelay();
    
    if (this.shouldThrowError) {
      this.throwMockError();
    }

    return this.mockData.forecast.slice(0, days);
  }

  // Mock method for getting complete weather data
  static async getWeatherData(location?: string): Promise<WeatherAPIResponse> {
    await this.simulateNetworkDelay();
    
    if (this.shouldThrowError) {
      this.throwMockError();
    }

    return {
      ...this.mockData,
      current: {
        ...this.mockData.current,
        location: location || this.mockData.current.location,
      },
    };
  }

  // Mock weather-based theme suggestions
  static async getThemeSuggestion(weather: CurrentWeather): Promise<{
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    timeOfDay: 'morning' | 'day' | 'evening' | 'night';
    glassMorphismIntensity: number;
    particleEffect: string;
  }> {
    await this.simulateNetworkDelay();
    
    if (this.shouldThrowError) {
      this.throwMockError();
    }

    // Mock theme suggestion logic based on weather
    const temp = weather.temperature;
    const weatherType = weather.weather;

    let season: 'spring' | 'summer' | 'autumn' | 'winter' = 'spring';
    let glassMorphismIntensity = 0.8;
    let particleEffect = 'none';

    if (temp >= 25) {
      season = 'summer';
      glassMorphismIntensity = 0.9;
      particleEffect = 'waterdrops';
    } else if (temp >= 15) {
      season = 'spring';
      glassMorphismIntensity = 0.7;
      particleEffect = 'sakura';
    } else if (temp >= 5) {
      season = 'autumn';
      glassMorphismIntensity = 0.6;
      particleEffect = 'leaves';
    } else {
      season = 'winter';
      glassMorphismIntensity = 1.0;
      particleEffect = 'snow';
    }

    if (weatherType === 'rainy') {
      glassMorphismIntensity += 0.2;
      particleEffect = 'rain';
    }

    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'day' | 'evening' | 'night' = 'day';
    
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'day';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    return {
      season,
      timeOfDay,
      glassMorphismIntensity: Math.min(glassMorphismIntensity, 1.0),
      particleEffect,
    };
  }

  // Test utilities for controlling mock behavior
  static setMockData(data: Partial<WeatherAPIResponse>) {
    this.mockData = { ...this.mockData, ...data };
  }

  static enableError(errorType: 'network' | 'auth' | 'rate-limit' | 'not-found' = 'network') {
    this.shouldThrowError = true;
    this.errorType = errorType;
  }

  static disableError() {
    this.shouldThrowError = false;
  }

  static resetMockData() {
    this.mockData = mockWeatherData;
    this.shouldThrowError = false;
  }

  // Private helper methods
  private static async simulateNetworkDelay(min: number = 100, max: number = 500) {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private static throwMockError(): never {
    switch (this.errorType) {
      case 'network':
        throw new Error('Network error: Unable to connect to weather service');
      case 'auth':
        throw new Error('Authentication error: Invalid API key');
      case 'rate-limit':
        throw new Error('Rate limit exceeded: Too many requests');
      case 'not-found':
        throw new Error('Location not found: Invalid location specified');
      default:
        throw new Error('Unknown weather API error');
    }
  }
}

// Mock fetch implementation for weather API
export const mockWeatherAPIFetch = () => {
  const originalFetch = global.fetch;
  
  global.fetch = vi.fn().mockImplementation(async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
    
    if (WeatherAPI['shouldThrowError']) {
      throw new Error('Mock network error');
    }

    // Mock different endpoints
    if (url.includes('/current')) {
      return {
        ok: true,
        status: 200,
        json: async () => WeatherAPI['mockData'].current,
      };
    }

    if (url.includes('/forecast')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ forecast: WeatherAPI['mockData'].forecast }),
      };
    }

    return {
      ok: true,
      status: 200,
      json: async () => WeatherAPI['mockData'],
    };
  });

  return {
    restore: () => {
      global.fetch = originalFetch;
    },
  };
};

// Mock geolocation for weather API
export const mockGeolocationForWeather = () => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn((success, error) => {
      // Simulate successful geolocation
      setTimeout(() => {
        success({
          coords: {
            latitude: 35.6762,
            longitude: 139.6503,
            accuracy: 100,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
      }, 100);
    }),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  };

  Object.defineProperty(navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true,
  });

  return mockGeolocation;
};

// Export mock weather conditions for testing
export const mockWeatherConditions = {
  sunny: { weather: 'sunny', temperature: 25, description: 'Clear sky' },
  rainy: { weather: 'rainy', temperature: 18, description: 'Light rain' },
  cloudy: { weather: 'cloudy', temperature: 20, description: 'Partly cloudy' },
  snowy: { weather: 'snowy', temperature: -2, description: 'Snow' },
  stormy: { weather: 'stormy', temperature: 15, description: 'Thunderstorm' },
} as const;