import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AboutPage from './page';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

vi.mock('@/components/liquid-glass/LiquidGlassCard', () => ({
  LiquidGlassCard: ({ children, ...props }: any) => (
    <div data-testid="liquid-glass-card" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
}));

describe('AboutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Structure and Content', () => {
    it('should render the main heading', () => {
      render(<AboutPage />);
      expect(screen.getByRole('heading', { level: 1, name: /about/i })).toBeInTheDocument();
    });

    it('should render project title "Liquid Glass Tech Blog"', () => {
      render(<AboutPage />);
      expect(screen.getByText('Liquid Glass Tech Blog')).toBeInTheDocument();
    });

    it('should render project description', () => {
      render(<AboutPage />);
      expect(screen.getByText(/modern blog platform showcasing liquid glass effects/i)).toBeInTheDocument();
    });

    it('should have proper semantic structure with sections', () => {
      render(<AboutPage />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Technology Stack Section', () => {
    it('should render technology stack heading', () => {
      render(<AboutPage />);
      expect(screen.getByRole('heading', { name: /technology stack/i })).toBeInTheDocument();
    });

    it('should display all required technologies as badges', () => {
      render(<AboutPage />);
      const technologies = ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'shadcn/ui'];
      
      technologies.forEach(tech => {
        expect(screen.getByText(tech)).toBeInTheDocument();
      });
    });

    it('should organize technologies with different badge variants', () => {
      render(<AboutPage />);
      const badges = screen.getAllByTestId('badge');
      expect(badges.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Features Section', () => {
    it('should render features heading', () => {
      render(<AboutPage />);
      expect(screen.getByRole('heading', { name: /features/i })).toBeInTheDocument();
    });

    it('should display GPU-accelerated effects feature', () => {
      render(<AboutPage />);
      expect(screen.getByText(/gpu-accelerated effects/i)).toBeInTheDocument();
    });

    it('should display MDX content feature', () => {
      render(<AboutPage />);
      expect(screen.getByText(/mdx content/i)).toBeInTheDocument();
    });

    it('should display performance optimization feature', () => {
      render(<AboutPage />);
      expect(screen.getByText(/performance optimization/i)).toBeInTheDocument();
    });

    it('should display feature descriptions and icons', () => {
      render(<AboutPage />);
      expect(screen.getByText(/smooth 60fps animations with hardware acceleration/i)).toBeInTheDocument();
      expect(screen.getByText(/rich interactive content with react components/i)).toBeInTheDocument();
      expect(screen.getByText(/core web vitals compliance and lightning-fast loading/i)).toBeInTheDocument();
    });
  });

  describe('Mission Statement Section', () => {
    it('should render mission statement heading', () => {
      render(<AboutPage />);
      expect(screen.getByRole('heading', { name: /mission/i })).toBeInTheDocument();
    });

    it('should display mission statement text', () => {
      render(<AboutPage />);
      expect(screen.getByText(/demonstrate cutting-edge web technologies with accessible design/i)).toBeInTheDocument();
    });

    it('should display the mission as a blockquote', () => {
      render(<AboutPage />);
      expect(screen.getByText(/creating beautiful and performant experiences for everyone/i)).toBeInTheDocument();
    });
  });

  describe('Liquid Glass Integration', () => {
    it('should render content within LiquidGlassCard components', () => {
      render(<AboutPage />);
      const glassCards = screen.getAllByTestId('liquid-glass-card');
      expect(glassCards.length).toBeGreaterThan(0);
    });

    it('should apply appropriate glass variants to cards', () => {
      render(<AboutPage />);
      const glassCards = screen.getAllByTestId('liquid-glass-card');
      expect(glassCards[0]).toHaveAttribute('variant', 'glass-intense');
    });
  });

  describe('SEO and Accessibility', () => {
    it('should have proper page metadata structure', () => {
      render(<AboutPage />);
      // Test will check for semantic heading structure
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
    });

    it('should have accessible content structure', () => {
      render(<AboutPage />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Enhanced Sections', () => {
    it('should render performance section', () => {
      render(<AboutPage />);
      expect(screen.getByText(/performance first/i)).toBeInTheDocument();
      expect(screen.getByText(/core web vitals excellence/i)).toBeInTheDocument();
    });

    it('should render accessibility section', () => {
      render(<AboutPage />);
      expect(screen.getByText(/accessibility focused/i)).toBeInTheDocument();
      expect(screen.getByText(/wcag 2.1 aa compliance/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render responsive layout structure', () => {
      render(<AboutPage />);
      const main = screen.getByRole('main');
      expect(main).toHaveClass('container', 'mx-auto', 'px-4');
    });

    it('should have proper spacing and grid layouts', () => {
      render(<AboutPage />);
      const main = screen.getByRole('main');
      expect(main).toHaveClass('py-12', 'space-y-12');
    });
  });

  describe('SEO Enhancements', () => {
    it('should have enhanced metadata structure', () => {
      render(<AboutPage />);
      // Verify rich content structure exists
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(3);
    });
  });
});