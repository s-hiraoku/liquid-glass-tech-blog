import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock SeasonalThemeProvider for testing
const MockSeasonalThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockTheme = {
    season: 'spring' as const,
    timeOfDay: 'day' as const,
    colors: {
      primary: '#FFB7C5',
      secondary: '#FFC0CB',
      accent: '#FF69B4',
      background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE4E1 100%)',
      surface: 'rgba(255, 183, 197, 0.1)',
    },
    glassMorphism: {
      backdropFilter: 'blur(15px) saturate(180%) brightness(110%)',
      backgroundColor: 'rgba(255, 183, 197, 0.1)',
      borderColor: 'rgba(255, 105, 180, 0.2)',
      shadowColor: 'rgba(255, 105, 180, 0.15)',
    },
  };

  // Create a mock context value
  const ThemeContext = React.createContext(mockTheme);

  return (
    <ThemeContext.Provider value={mockTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create providers wrapper
const createTestProviders = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <MockSeasonalThemeProvider>
          {children}
        </MockSeasonalThemeProvider>
      </QueryClientProvider>
    );
  };

  return { AllTheProviders, queryClient };
};

// Custom render function with providers
export const renderWithTheme = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const { AllTheProviders } = createTestProviders();
  
  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
};

// Export a custom render with query client access
export const renderWithThemeAndClient = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const { AllTheProviders, queryClient } = createTestProviders();
  
  const result = render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });

  return {
    ...result,
    queryClient,
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithTheme as render };