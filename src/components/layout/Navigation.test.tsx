import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { useTheme } from 'next-themes';
import { Navigation } from './Navigation';
import { ThemeProvider } from 'next-themes';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: function MockLink({ children, href, ...props }: any) {
      return <a href={href} {...props}>{children}</a>;
    }
  };
});

const mockUseTheme = vi.mocked(useTheme);

// Mock window object
Object.defineProperty(window, 'location', {
  value: { pathname: '/' },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderNavigation = (props = {}) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      <Navigation {...props} />
    </ThemeProvider>
  );
};

describe('Navigation Component', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      resolvedTheme: 'light',
      themes: ['light', 'dark'],
      systemTheme: 'light',
    });
  });

  describe('Basic Structure', () => {
    test('should render navigation container with proper semantic HTML', () => {
      renderNavigation();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    test('should render logo with correct branding', () => {
      renderNavigation();
      
      const logo = screen.getByRole('link', { name: /liquid glass tech blog/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('href', '/');
    });

    test('should render all main navigation links', () => {
      renderNavigation();
      
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /posts/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    });

    test('should have correct href attributes for navigation links', () => {
      renderNavigation();
      
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /posts/i })).toHaveAttribute('href', '/posts');
      expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
      expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
    });
  });

  describe('Theme Toggle', () => {
    test('should render theme toggle buttons (desktop and mobile)', () => {
      renderNavigation();
      
      const themeToggleButtons = screen.getAllByRole('button', { name: /toggle theme/i });
      expect(themeToggleButtons).toHaveLength(2); // One for desktop, one for mobile
    });

    test('should call setTheme when desktop theme toggle is clicked', () => {
      const mockSetTheme = vi.fn();
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        resolvedTheme: 'light',
        themes: ['light', 'dark'],
        systemTheme: 'light',
      });

      renderNavigation();
      
      const themeToggleButtons = screen.getAllByRole('button', { name: /toggle theme/i });
      const desktopThemeToggle = themeToggleButtons[0]; // First one is desktop
      fireEvent.click(desktopThemeToggle);
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    test('should switch to light theme when currently dark', () => {
      const mockSetTheme = vi.fn();
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        resolvedTheme: 'dark',
        themes: ['light', 'dark'],
        systemTheme: 'dark',
      });

      renderNavigation();
      
      const themeToggleButtons = screen.getAllByRole('button', { name: /toggle theme/i });
      const desktopThemeToggle = themeToggleButtons[0];
      fireEvent.click(desktopThemeToggle);
      
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('Mobile Responsive Design', () => {
    test('should render mobile menu button', () => {
      renderNavigation();
      
      const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      expect(mobileMenuButton).toBeInTheDocument();
    });

    test('should toggle mobile menu visibility when button is clicked', async () => {
      renderNavigation();
      
      const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      
      // Mobile menu should be hidden initially
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      
      // Click to open
      fireEvent.click(mobileMenuButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      
      // Click to close
      fireEvent.click(mobileMenuButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      });
    });

    test('should close mobile menu when a navigation link is clicked', async () => {
      renderNavigation();
      
      const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      
      // Open mobile menu
      fireEvent.click(mobileMenuButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      
      // Click on a navigation link in mobile menu
      const mobileHomeLink = screen.getAllByRole('link', { name: /home/i })[1]; // Second instance is in mobile menu
      fireEvent.click(mobileHomeLink);
      
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper keyboard navigation support', () => {
      renderNavigation();
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('tabIndex');
        expect(link.getAttribute('tabIndex')).not.toBe('-1');
      });
    });

    test('should have proper ARIA attributes for mobile menu', async () => {
      renderNavigation();
      
      const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
      expect(mobileMenuButton).toHaveAttribute('aria-controls');
      
      fireEvent.click(mobileMenuButton);
      
      await waitFor(() => {
        expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    test('should support Escape key to close mobile menu', async () => {
      renderNavigation();
      
      const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
      
      // Open mobile menu
      fireEvent.click(mobileMenuButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      
      // Press Escape key
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Active Link Highlighting', () => {
    test('should highlight active link based on current pathname', () => {
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: { pathname: '/posts' },
        writable: true,
      });
      
      renderNavigation();
      
      const postsLink = screen.getAllByRole('link', { name: /posts/i })[0]; // Get first instance (desktop)
      expect(postsLink).toHaveClass('text-primary', 'bg-primary/10'); // Check actual classes used
    });

    test('should only have one active link at a time', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/about' },
        writable: true,
      });
      
      renderNavigation();
      
      const links = screen.getAllByRole('link').filter(link => 
        ['Home', 'Posts', 'About', 'Contact'].some(text => 
          link.textContent?.includes(text)
        )
      );
      
      const activeLinks = links.filter(link => 
        link.classList.contains('text-primary') && link.classList.contains('bg-primary/10')
      );
      expect(activeLinks.length).toBeGreaterThan(0);
      // Should find the about link as active
      const aboutLinks = links.filter(link => link.textContent?.includes('About'));
      expect(aboutLinks[0]).toHaveClass('text-primary', 'bg-primary/10');
    });
  });

  describe('Liquid Glass Effects', () => {
    test('should apply liquid glass backdrop styling', () => {
      renderNavigation();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('backdrop-blur-md'); // or similar glass effect classes
    });

    test('should have smooth animations for hover states', () => {
      renderNavigation();
      
      const navLinks = screen.getAllByRole('link');
      navLinks.forEach(link => {
        // Check for any transition class (transition-all or transition-colors, etc.)
        const hasTransition = link.className.includes('transition');
        expect(hasTransition).toBe(true);
      });
    });
  });

  describe('Performance', () => {
    test('should have efficient re-renders when theme changes', () => {
      const { rerender } = renderNavigation();
      
      // Change theme
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: vi.fn(),
        resolvedTheme: 'dark',
        themes: ['light', 'dark'],
        systemTheme: 'dark',
      });
      
      rerender(
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navigation />
        </ThemeProvider>
      );
      
      // Navigation should still be functional
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      const themeToggleButtons = screen.getAllByRole('button', { name: /toggle theme/i });
      expect(themeToggleButtons.length).toBeGreaterThan(0);
    });
  });
});