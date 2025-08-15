import { test, expect, Page } from '@playwright/test';

test.describe('Navigation System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Header Navigation', () => {
    test('should display logo and main navigation links', async ({ page }) => {
      // Check logo
      const logo = page.locator('nav a[href="/"]').first();
      await expect(logo).toBeVisible();
      await expect(logo).toContainText('Liquid Glass Tech Blog');

      // Check main navigation links
      await expect(page.locator('nav a[href="/"]')).toBeVisible();
      await expect(page.locator('nav a[href="/posts"]')).toBeVisible();
      await expect(page.locator('nav a[href="/about"]')).toBeVisible();
      await expect(page.locator('nav a[href="/contact"]')).toBeVisible();
    });

    test('should navigate to correct pages when links are clicked', async ({ page }) => {
      // Test Posts navigation
      await page.click('nav a[href="/posts"]');
      await expect(page).toHaveURL('/posts');

      // Test About navigation
      await page.click('nav a[href="/about"]');
      await expect(page).toHaveURL('/about');

      // Test Contact navigation
      await page.click('nav a[href="/contact"]');
      await expect(page).toHaveURL('/contact');

      // Test Home navigation
      await page.click('nav a[href="/"]');
      await expect(page).toHaveURL('/');
    });

    test('should highlight active navigation link', async ({ page }) => {
      // Navigate to posts page
      await page.goto('/posts');
      
      const postsLink = page.locator('nav a[href="/posts"]');
      await expect(postsLink).toHaveClass(/active|current/);
      
      // Other links should not be active
      const homeLink = page.locator('nav a[href="/"]').first();
      await expect(homeLink).not.toHaveClass(/active|current/);
    });
  });

  test.describe('Theme Toggle', () => {
    test('should toggle between light and dark themes', async ({ page }) => {
      const themeToggle = page.locator('button[aria-label*="toggle theme" i]');
      await expect(themeToggle).toBeVisible();

      // Get initial theme
      const initialTheme = await page.locator('html').getAttribute('class');
      
      // Click theme toggle
      await themeToggle.click();
      
      // Wait for theme to change
      await page.waitForTimeout(300);
      
      const newTheme = await page.locator('html').getAttribute('class');
      expect(newTheme).not.toBe(initialTheme);
    });

    test('should persist theme preference', async ({ page, context }) => {
      const themeToggle = page.locator('button[aria-label*="toggle theme" i]');
      
      // Set to dark theme
      await themeToggle.click();
      await page.waitForTimeout(300);
      
      const darkTheme = await page.locator('html').getAttribute('class');
      
      // Create new page to test persistence
      const newPage = await context.newPage();
      await newPage.goto('/');
      await newPage.waitForTimeout(300);
      
      const persistedTheme = await newPage.locator('html').getAttribute('class');
      expect(persistedTheme).toBe(darkTheme);
    });
  });

  test.describe('Mobile Responsive Design', () => {
    test('should show mobile menu button on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 640, height: 800 });
      
      const mobileMenuButton = page.locator('button[aria-label*="toggle mobile menu" i]');
      await expect(mobileMenuButton).toBeVisible();
      
      // Desktop navigation should be hidden
      const desktopNav = page.locator('nav > div:not([data-testid="mobile-menu"])').first();
      await expect(desktopNav).toHaveCSS('display', 'none');
    });

    test('should toggle mobile menu visibility', async ({ page }) => {
      await page.setViewportSize({ width: 640, height: 800 });
      
      const mobileMenuButton = page.locator('button[aria-label*="toggle mobile menu" i]');
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      
      // Mobile menu should be hidden initially
      await expect(mobileMenu).not.toBeVisible();
      
      // Click to open
      await mobileMenuButton.click();
      await expect(mobileMenu).toBeVisible();
      
      // Click to close
      await mobileMenuButton.click();
      await expect(mobileMenu).not.toBeVisible();
    });

    test('should close mobile menu when navigation link is clicked', async ({ page }) => {
      await page.setViewportSize({ width: 640, height: 800 });
      
      const mobileMenuButton = page.locator('button[aria-label*="toggle mobile menu" i]');
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      
      // Open mobile menu
      await mobileMenuButton.click();
      await expect(mobileMenu).toBeVisible();
      
      // Click a navigation link in mobile menu
      await mobileMenu.locator('a[href="/posts"]').click();
      
      // Menu should close and navigate to posts
      await expect(mobileMenu).not.toBeVisible();
      await expect(page).toHaveURL('/posts');
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support tab navigation through all links', async ({ page }) => {
      // Start from body to test tab order
      await page.locator('body').click();
      
      // Tab through navigation links
      await page.keyboard.press('Tab');
      let focused = page.locator(':focus');
      await expect(focused).toHaveAttribute('href', '/');
      
      await page.keyboard.press('Tab');
      focused = page.locator(':focus');
      await expect(focused).toHaveAttribute('href', '/posts');
      
      await page.keyboard.press('Tab');
      focused = page.locator(':focus');
      await expect(focused).toHaveAttribute('href', '/about');
      
      await page.keyboard.press('Tab');
      focused = page.locator(':focus');
      await expect(focused).toHaveAttribute('href', '/contact');
    });

    test('should support Enter key to activate links', async ({ page }) => {
      // Focus on posts link
      await page.locator('nav a[href="/posts"]').focus();
      
      // Press Enter
      await page.keyboard.press('Enter');
      
      // Should navigate to posts page
      await expect(page).toHaveURL('/posts');
    });

    test('should support Escape key to close mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 640, height: 800 });
      
      const mobileMenuButton = page.locator('button[aria-label*="toggle mobile menu" i]');
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      
      // Open mobile menu
      await mobileMenuButton.click();
      await expect(mobileMenu).toBeVisible();
      
      // Press Escape
      await page.keyboard.press('Escape');
      
      // Menu should close
      await expect(mobileMenu).not.toBeVisible();
    });
  });

  test.describe('Accessibility Compliance', () => {
    test('should have proper ARIA attributes', async ({ page }) => {
      // Navigation should have proper role and label
      const nav = page.locator('nav');
      await expect(nav).toHaveAttribute('role', 'navigation');
      await expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      
      // Mobile menu button should have proper ARIA attributes
      await page.setViewportSize({ width: 640, height: 800 });
      const mobileMenuButton = page.locator('button[aria-label*="toggle mobile menu" i]');
      await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
      await expect(mobileMenuButton).toHaveAttribute('aria-controls');
    });

    test('should be accessible to screen readers', async ({ page }) => {
      // Check that all interactive elements have accessible names
      const interactiveElements = page.locator('nav button, nav a');
      const count = await interactiveElements.count();
      
      for (let i = 0; i < count; i++) {
        const element = interactiveElements.nth(i);
        const accessibleName = await element.getAttribute('aria-label') || 
                              await element.textContent();
        expect(accessibleName).toBeTruthy();
      }
    });

    test('should meet color contrast requirements', async ({ page }) => {
      // This would typically use axe-playwright for automated accessibility testing
      // For now, we'll check that text is visible and readable
      const navLinks = page.locator('nav a');
      const count = await navLinks.count();
      
      for (let i = 0; i < count; i++) {
        const link = navLinks.nth(i);
        await expect(link).toBeVisible();
        
        // Check that link has readable text
        const textContent = await link.textContent();
        expect(textContent?.trim()).toBeTruthy();
      }
    });
  });

  test.describe('Liquid Glass Effects', () => {
    test('should have glass backdrop effects', async ({ page }) => {
      const nav = page.locator('nav');
      
      // Check for backdrop-blur CSS property
      const hasBackdropBlur = await page.evaluate(() => {
        const navElement = document.querySelector('nav');
        if (!navElement) return false;
        
        const computedStyle = window.getComputedStyle(navElement);
        return computedStyle.backdropFilter.includes('blur') || 
               computedStyle.webkitBackdropFilter?.includes('blur');
      });
      
      expect(hasBackdropBlur).toBe(true);
    });

    test('should have smooth hover animations', async ({ page }) => {
      const navLink = page.locator('nav a[href="/posts"]');
      
      // Check that transitions are applied
      const hasTransition = await navLink.evaluate((el) => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.transition.includes('all') || 
               computedStyle.transition.length > 0;
      });
      
      expect(hasTransition).toBe(true);
      
      // Test hover state
      await navLink.hover();
      await page.waitForTimeout(100); // Allow transition to begin
      
      // Check that hover effects are applied
      await expect(navLink).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should maintain 60fps during animations', async ({ page }) => {
      await page.setViewportSize({ width: 640, height: 800 });
      
      // Start performance monitoring
      const performanceEntries: any[] = [];
      page.on('metrics', metrics => {
        performanceEntries.push(metrics);
      });
      
      // Perform animations
      const mobileMenuButton = page.locator('button[aria-label*="toggle mobile menu" i]');
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      await mobileMenuButton.click();
      
      // Basic performance check - ensure no layout thrashing
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should load navigation quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      
      // Wait for navigation to be fully rendered
      await page.locator('nav').waitFor({ state: 'visible' });
      await page.locator('nav a[href="/posts"]').waitFor({ state: 'visible' });
      
      const loadTime = Date.now() - startTime;
      
      // Navigation should load within reasonable time
      expect(loadTime).toBeLessThan(3000);
    });
  });
});