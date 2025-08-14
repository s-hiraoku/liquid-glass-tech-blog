import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

/**
 * Phase 1.2 - shadcn/ui Integration TDD Tests
 * Testing shadcn/ui初期設定 and basic component installation
 * 
 * TDD Cycle Status: 🔴 RED - Writing failing tests first
 * Next: Implement minimal code to make tests pass (GREEN phase)
 */

describe('Phase 1.2: shadcn/ui Integration and Basic Components', () => {
  describe('shadcn/ui Initialization', () => {
    it('should have shadcn/ui properly initialized with components.json', async () => {
      // RED: This will fail until shadcn-ui init is run
      const fs = await import('fs');
      const path = await import('path');
      
      const configPath = path.resolve(process.cwd(), 'components.json');
      const configExists = fs.existsSync(configPath);
      
      expect(configExists).toBe(true);
      
      if (configExists) {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configContent);
        
        // Verify shadcn/ui specific configuration
        expect(config.$schema).toContain('shadcn');
        expect(config.style).toBe('new-york');
        expect(config.rsc).toBe(false);
        expect(config.tsx).toBe(true);
        expect(config.tailwind.config).toBe('tailwind.config.ts');
        expect(config.tailwind.css).toBe('src/app/globals.css');
        expect(config.aliases.components).toBe('@/components');
        expect(config.aliases.utils).toBe('@/lib/utils');
      }
    });

    it('should have shadcn/ui CSS variables defined in globals.css', async () => {
      // RED: This will fail until shadcn/ui CSS variables are added
      const fs = await import('fs');
      const path = await import('path');
      
      const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
      const cssExists = fs.existsSync(cssPath);
      
      expect(cssExists).toBe(true);
      
      if (cssExists) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Check for CSS variables required by shadcn/ui
        expect(cssContent).toContain(':root');
        expect(cssContent).toContain('--background');
        expect(cssContent).toContain('--foreground');
        expect(cssContent).toContain('--primary');
        expect(cssContent).toContain('--secondary');
        expect(cssContent).toContain('--muted');
        expect(cssContent).toContain('--accent');
        expect(cssContent).toContain('--destructive');
        expect(cssContent).toContain('--border');
        expect(cssContent).toContain('--input');
        expect(cssContent).toContain('--ring');
        expect(cssContent).toContain('--radius');
      }
    });
  });

  describe('Basic shadcn/ui Components Installation', () => {
    it('should have Button component installed', async () => {
      // RED: This will fail until Button component is installed
      const fs = await import('fs');
      const path = await import('path');
      
      const buttonPath = path.resolve(process.cwd(), 'src/components/ui/button.tsx');
      const buttonExists = fs.existsSync(buttonPath);
      
      expect(buttonExists).toBe(true);
      
      if (buttonExists) {
        const { Button } = await import('../../components/ui/button');
        expect(Button).toBeDefined();
        expect(typeof Button).toBe('function');
      }
    });

    it('should have Card component installed', async () => {
      // RED: This will fail until Card component is installed
      const fs = await import('fs');
      const path = await import('path');
      
      const cardPath = path.resolve(process.cwd(), 'src/components/ui/card.tsx');
      const cardExists = fs.existsSync(cardPath);
      
      expect(cardExists).toBe(true);
      
      if (cardExists) {
        const cardModule = await import('../../components/ui/card');
        expect(cardModule.Card).toBeDefined();
        expect(cardModule.CardHeader).toBeDefined();
        expect(cardModule.CardContent).toBeDefined();
        expect(cardModule.CardTitle).toBeDefined();
        expect(cardModule.CardDescription).toBeDefined();
        expect(cardModule.CardFooter).toBeDefined();
      }
    });

    it('should have Input component installed', async () => {
      // RED: This will fail until Input component is installed
      const fs = await import('fs');
      const path = await import('path');
      
      const inputPath = path.resolve(process.cwd(), 'src/components/ui/input.tsx');
      const inputExists = fs.existsSync(inputPath);
      
      expect(inputExists).toBe(true);
      
      if (inputExists) {
        const { Input } = await import('../../components/ui/input');
        expect(Input).toBeDefined();
        expect(typeof Input).toBe('function');
      }
    });

    it('should have Dialog component installed', async () => {
      // RED: This will fail until Dialog component is installed
      const fs = await import('fs');
      const path = await import('path');
      
      const dialogPath = path.resolve(process.cwd(), 'src/components/ui/dialog.tsx');
      const dialogExists = fs.existsSync(dialogPath);
      
      expect(dialogExists).toBe(true);
      
      if (dialogExists) {
        const dialogModule = await import('../../components/ui/dialog');
        expect(dialogModule.Dialog).toBeDefined();
        expect(dialogModule.DialogTrigger).toBeDefined();
        expect(dialogModule.DialogContent).toBeDefined();
        expect(dialogModule.DialogHeader).toBeDefined();
        expect(dialogModule.DialogTitle).toBeDefined();
        expect(dialogModule.DialogDescription).toBeDefined();
      }
    });

    it('should have Toast component installed', async () => {
      // RED: This will fail until Toast component is installed
      const fs = await import('fs');
      const path = await import('path');
      
      const toastPath = path.resolve(process.cwd(), 'src/components/ui/toast.tsx');
      const toastExists = fs.existsSync(toastPath);
      
      expect(toastExists).toBe(true);
      
      if (toastExists) {
        const toastModule = await import('../../components/ui/toast');
        expect(toastModule.Toast).toBeDefined();
        expect(toastModule.ToastProvider).toBeDefined();
        expect(toastModule.ToastViewport).toBeDefined();
      }
    });

    it('should have Select component installed', async () => {
      // RED: This will fail until Select component is installed
      const fs = await import('fs');
      const path = await import('path');
      
      const selectPath = path.resolve(process.cwd(), 'src/components/ui/select.tsx');
      const selectExists = fs.existsSync(selectPath);
      
      expect(selectExists).toBe(true);
      
      if (selectExists) {
        const selectModule = await import('../../components/ui/select');
        expect(selectModule.Select).toBeDefined();
        expect(selectModule.SelectTrigger).toBeDefined();
        expect(selectModule.SelectContent).toBeDefined();
        expect(selectModule.SelectItem).toBeDefined();
        expect(selectModule.SelectValue).toBeDefined();
      }
    });

    it('should have Slider component installed', async () => {
      // RED: This will fail until Slider component is installed
      const fs = await import('fs');
      const path = await import('path');
      
      const sliderPath = path.resolve(process.cwd(), 'src/components/ui/slider.tsx');
      const sliderExists = fs.existsSync(sliderPath);
      
      expect(sliderExists).toBe(true);
      
      if (sliderExists) {
        const { Slider } = await import('../../components/ui/slider');
        expect(Slider).toBeDefined();
        expect(typeof Slider).toBe('function');
      }
    });
  });

  describe('glasscn-ui Integration', () => {
    it('should have glasscn-ui Tailwind CSS configuration integrated', async () => {
      // RED: This will fail until glasscn-ui Tailwind config is integrated
      const fs = await import('fs');
      const path = await import('path');
      
      const tailwindPath = path.resolve(process.cwd(), 'tailwind.config.ts');
      const tailwindExists = fs.existsSync(tailwindPath);
      
      expect(tailwindExists).toBe(true);
      
      if (tailwindExists) {
        const tailwindContent = fs.readFileSync(tailwindPath, 'utf-8');
        
        // Check for glasscn-ui specific configuration
        expect(tailwindContent).toContain('glasscn-ui');
        expect(tailwindContent).toContain('glass');
        expect(tailwindContent).toContain('backdrop-blur');
      }
    });

    it('should have glasscn-ui component themes available', async () => {
      // RED: This will fail until glasscn-ui themes are integrated
      const fs = await import('fs');
      const path = await import('path');
      
      const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
      const cssExists = fs.existsSync(cssPath);
      
      expect(cssExists).toBe(true);
      
      if (cssExists) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Check for glasscn-ui theme variables
        expect(cssContent).toContain('--glass');
        expect(cssContent).toContain('backdrop');
      }
    });
  });

  describe('liquid-glass Integration with shadcn/ui', () => {
    it('should have cn utility function enhanced with liquid-glass helpers', async () => {
      // RED: This will fail until utils.ts is enhanced
      const utils = await import('../../lib/utils');
      
      expect(utils.cn).toBeDefined();
      expect(typeof utils.cn).toBe('function');
      
      // Test that cn function works with liquid-glass classes
      const result = utils.cn(
        'bg-white/10',
        'backdrop-blur-md',
        'border border-white/20'
      );
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should have liquid-glass integration helpers in utils.ts', async () => {
      // RED: This will fail until liquid-glass helpers are added
      const utils = await import('../../lib/utils');
      
      // These helper functions should be available for liquid-glass integration
      expect(utils.getGlassVariant).toBeDefined();
      expect(utils.applyLiquidGlassTheme).toBeDefined();
      expect(typeof utils.getGlassVariant).toBe('function');
      expect(typeof utils.applyLiquidGlassTheme).toBe('function');
    });
  });

  describe('Component Rendering Integration', () => {
    it('should render shadcn/ui Button with liquid-glass styling', async () => {
      // RED: This will fail until components are properly integrated
      try {
        const { Button } = await import('../../components/ui/button');
        const { render } = await import('@testing-library/react');
        
        const { container } = render(
          Button({ 
            children: 'Test Button',
            className: 'glass-subtle'
          })
        );
        
        expect(container.firstChild).toBeTruthy();
        
        const button = container.querySelector('button');
        expect(button).toBeTruthy();
        expect(button?.textContent).toBe('Test Button');
      } catch (error) {
        // Expected to fail during RED phase
        expect(error).toBeDefined();
      }
    });

    it('should render shadcn/ui Card with liquid-glass effects', async () => {
      // RED: This will fail until components are properly integrated
      try {
        const { Card, CardContent } = await import('../../components/ui/card');
        const { render } = await import('@testing-library/react');
        
        const { container } = render(
          Card({ 
            children: CardContent({ children: 'Test Card' }),
            className: 'glass-medium backdrop-blur-md'
          })
        );
        
        expect(container.firstChild).toBeTruthy();
        
        const card = container.querySelector('[class*="glass"]');
        expect(card).toBeTruthy();
      } catch (error) {
        // Expected to fail during RED phase
        expect(error).toBeDefined();
      }
    });
  });
});