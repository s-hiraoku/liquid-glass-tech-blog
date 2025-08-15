/**
 * Playwright Global Setup
 * Configures testing environment for E2E tests
 */

import { chromium, FullConfig } from '@playwright/test';
import path from 'path';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  
  console.log('🚀 Starting E2E test environment setup...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the development server to be ready
    if (baseURL) {
      console.log(`📡 Waiting for server at ${baseURL}...`);
      
      let retries = 30; // 30 seconds timeout
      while (retries > 0) {
        try {
          const response = await page.goto(baseURL, { 
            waitUntil: 'domcontentloaded',
            timeout: 2000 
          });
          
          if (response?.ok()) {
            console.log('✅ Server is ready');
            break;
          }
        } catch (error) {
          retries--;
          if (retries === 0) {
            throw new Error(`Server not ready after 30 seconds: ${error}`);
          }
          await page.waitForTimeout(1000);
        }
      }
    }
    
    // Initialize application state
    console.log('🔧 Initializing application state...');
    
    // Navigate to homepage to trigger initial setup
    await page.goto(baseURL || 'http://localhost:3000');
    
    // Wait for liquid glass effects to initialize
    await page.waitForSelector('[data-testid="liquid-glass-card"]', { 
      timeout: 10000 
    });
    
    // Check for accessibility tools initialization
    await page.evaluate(() => {
      // Initialize axe-core if available
      if (typeof window !== 'undefined' && (window as any).axe) {
        return (window as any).axe.configure({
          rules: {
            'color-contrast': { enabled: true },
            'focus-order-semantics': { enabled: true },
            'keyboard': { enabled: true }
          }
        });
      }
    });
    
    console.log('✅ Application state initialized');
    
    // Save authentication state if needed
    if (storageState) {
      await page.context().storageState({ path: storageState as string });
      console.log('💾 Authentication state saved');
    }
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('🎉 E2E test environment setup complete');
}

export default globalSetup;