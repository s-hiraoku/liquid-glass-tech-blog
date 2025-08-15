/**
 * Playwright Global Teardown
 * Cleanup after E2E tests complete
 */

import { FullConfig } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting E2E test environment teardown...');
  
  try {
    // Clean up test artifacts
    const testResultsDir = path.join(process.cwd(), 'test-results');
    const playwrightReportDir = path.join(process.cwd(), 'playwright-report');
    
    // Generate test summary
    console.log('📊 Generating test summary...');
    
    const summary = {
      timestamp: new Date().toISOString(),
      testRun: 'E2E Tests Complete',
      environment: process.env.NODE_ENV || 'test',
      baseURL: config.projects[0].use.baseURL,
      browsers: config.projects.map(p => p.name),
      cleanup: {
        testResults: false,
        reports: false
      }
    };
    
    // Check if we should preserve test results
    const preserveResults = process.env.PRESERVE_TEST_RESULTS === 'true';
    
    if (!preserveResults) {
      // Clean up old test results (keep only latest 5 runs)
      try {
        const entries = await fs.readdir(testResultsDir, { withFileTypes: true });
        const dirs = entries
          .filter(entry => entry.isDirectory())
          .map(entry => entry.name)
          .sort()
          .reverse();
        
        if (dirs.length > 5) {
          const toDelete = dirs.slice(5);
          for (const dir of toDelete) {
            await fs.rmdir(path.join(testResultsDir, dir), { recursive: true });
          }
          console.log(`🗑️  Cleaned up ${toDelete.length} old test result directories`);
          summary.cleanup.testResults = true;
        }
      } catch (error) {
        console.warn('⚠️  Could not clean up test results:', error);
      }
      
      // Clean up old reports
      try {
        const reportExists = await fs.access(playwrightReportDir).then(() => true).catch(() => false);
        if (reportExists) {
          const stats = await fs.stat(playwrightReportDir);
          const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysSinceModified > 7) {
            await fs.rmdir(playwrightReportDir, { recursive: true });
            console.log('🗑️  Cleaned up old Playwright report');
            summary.cleanup.reports = true;
          }
        }
      } catch (error) {
        console.warn('⚠️  Could not clean up Playwright reports:', error);
      }
    }
    
    // Save test summary
    const summaryPath = path.join(process.cwd(), 'test-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log('📄 Test summary saved to test-summary.json');
    
    // Performance metrics cleanup
    console.log('📈 Processing performance metrics...');
    
    // Clean up performance tracking files if they exist
    const perfDir = path.join(process.cwd(), '.performance');
    try {
      const perfExists = await fs.access(perfDir).then(() => true).catch(() => false);
      if (perfExists) {
        const perfFiles = await fs.readdir(perfDir);
        const oldFiles = perfFiles.filter(file => {
          const match = file.match(/performance-(\d+)\.json/);
          if (match) {
            const timestamp = parseInt(match[1]);
            const daysSince = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
            return daysSince > 30; // Keep performance data for 30 days
          }
          return false;
        });
        
        for (const file of oldFiles) {
          await fs.unlink(path.join(perfDir, file));
        }
        
        if (oldFiles.length > 0) {
          console.log(`📊 Cleaned up ${oldFiles.length} old performance files`);
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not process performance metrics:', error);
    }
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - teardown failures shouldn't fail the entire test run
  }
  
  console.log('✅ E2E test environment teardown complete');
}

export default globalTeardown;