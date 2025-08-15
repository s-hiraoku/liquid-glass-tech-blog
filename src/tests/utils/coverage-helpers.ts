/**
 * Test Coverage Helpers
 * Utilities for measuring and improving test coverage
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

export interface CoverageReport {
  lines: {
    total: number;
    covered: number;
    percentage: number;
  };
  branches: {
    total: number;
    covered: number;
    percentage: number;
  };
  functions: {
    total: number;
    covered: number;
    percentage: number;
  };
  statements: {
    total: number;
    covered: number;
    percentage: number;
  };
}

export interface CoverageThresholds {
  lines: number;
  branches: number;
  functions: number;
  statements: number;
}

export const DEFAULT_COVERAGE_THRESHOLDS: CoverageThresholds = {
  lines: 95,
  branches: 90,
  functions: 95,
  statements: 95
};

/**
 * Analyze test coverage from V8 coverage data
 */
export async function analyzeCoverage(coverageDir: string = './coverage'): Promise<CoverageReport> {
  try {
    const lcovPath = path.join(coverageDir, 'lcov-report', 'index.html');
    const jsonPath = path.join(coverageDir, 'coverage-final.json');
    
    let report: CoverageReport = {
      lines: { total: 0, covered: 0, percentage: 0 },
      branches: { total: 0, covered: 0, percentage: 0 },
      functions: { total: 0, covered: 0, percentage: 0 },
      statements: { total: 0, covered: 0, percentage: 0 }
    };

    // Try to read from JSON report first
    try {
      const jsonData = await fs.readFile(jsonPath, 'utf-8');
      const coverage = JSON.parse(jsonData);
      
      let totalLines = 0, coveredLines = 0;
      let totalBranches = 0, coveredBranches = 0;
      let totalFunctions = 0, coveredFunctions = 0;
      let totalStatements = 0, coveredStatements = 0;

      Object.values(coverage).forEach((file: any) => {
        // Lines
        const lines = Object.values(file.s || {}) as number[];
        totalStatements += lines.length;
        coveredStatements += lines.filter(count => count > 0).length;

        // Branches
        const branches = Object.values(file.b || {}) as number[][];
        branches.forEach(branch => {
          totalBranches += branch.length;
          coveredBranches += branch.filter(count => count > 0).length;
        });

        // Functions
        const functions = Object.values(file.f || {}) as number[];
        totalFunctions += functions.length;
        coveredFunctions += functions.filter(count => count > 0).length;

        // Line coverage (from line map)
        if (file.l) {
          const lineMap = Object.values(file.l) as number[];
          totalLines += lineMap.length;
          coveredLines += lineMap.filter(count => count > 0).length;
        } else {
          // Fallback to statement coverage for lines
          totalLines += totalStatements;
          coveredLines += coveredStatements;
        }
      });

      report = {
        lines: {
          total: totalLines,
          covered: coveredLines,
          percentage: totalLines > 0 ? (coveredLines / totalLines) * 100 : 0
        },
        branches: {
          total: totalBranches,
          covered: coveredBranches,
          percentage: totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0
        },
        functions: {
          total: totalFunctions,
          covered: coveredFunctions,
          percentage: totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0
        },
        statements: {
          total: totalStatements,
          covered: coveredStatements,
          percentage: totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0
        }
      };
    } catch (jsonError) {
      console.warn('Could not read JSON coverage report, trying HTML report...');
      
      // Fallback to parsing HTML report
      try {
        const htmlData = await fs.readFile(lcovPath, 'utf-8');
        report = parseHTMLCoverageReport(htmlData);
      } catch (htmlError) {
        console.warn('Could not read HTML coverage report either');
      }
    }

    return report;
  } catch (error) {
    console.error('Error analyzing coverage:', error);
    return {
      lines: { total: 0, covered: 0, percentage: 0 },
      branches: { total: 0, covered: 0, percentage: 0 },
      functions: { total: 0, covered: 0, percentage: 0 },
      statements: { total: 0, covered: 0, percentage: 0 }
    };
  }
}

/**
 * Parse HTML coverage report (fallback method)
 */
function parseHTMLCoverageReport(html: string): CoverageReport {
  const extractPercentage = (regex: RegExp): number => {
    const match = html.match(regex);
    return match ? parseFloat(match[1]) : 0;
  };

  return {
    lines: {
      total: 0,
      covered: 0,
      percentage: extractPercentage(/Lines.*?(\d+(?:\.\d+)?)%/)
    },
    branches: {
      total: 0,
      covered: 0,
      percentage: extractPercentage(/Branches.*?(\d+(?:\.\d+)?)%/)
    },
    functions: {
      total: 0,
      covered: 0,
      percentage: extractPercentage(/Functions.*?(\d+(?:\.\d+)?)%/)
    },
    statements: {
      total: 0,
      covered: 0,
      percentage: extractPercentage(/Statements.*?(\d+(?:\.\d+)?)%/)
    }
  };
}

/**
 * Validate coverage against thresholds
 */
export function validateCoverage(
  report: CoverageReport,
  thresholds: CoverageThresholds = DEFAULT_COVERAGE_THRESHOLDS
): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  if (report.lines.percentage < thresholds.lines) {
    failures.push(`Line coverage (${report.lines.percentage.toFixed(1)}%) below threshold (${thresholds.lines}%)`);
  }

  if (report.branches.percentage < thresholds.branches) {
    failures.push(`Branch coverage (${report.branches.percentage.toFixed(1)}%) below threshold (${thresholds.branches}%)`);
  }

  if (report.functions.percentage < thresholds.functions) {
    failures.push(`Function coverage (${report.functions.percentage.toFixed(1)}%) below threshold (${thresholds.functions}%)`);
  }

  if (report.statements.percentage < thresholds.statements) {
    failures.push(`Statement coverage (${report.statements.percentage.toFixed(1)}%) below threshold (${thresholds.statements}%)`);
  }

  return {
    passed: failures.length === 0,
    failures
  };
}

/**
 * Find uncovered files that need tests
 */
export async function findUncoveredFiles(srcDir: string = './src'): Promise<string[]> {
  try {
    // Find all source files
    const sourceFiles = await glob('**/*.{ts,tsx}', {
      cwd: srcDir,
      ignore: [
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.d.ts',
        '**/tests/**',
        '**/node_modules/**'
      ]
    });

    // Find all test files
    const testFiles = await glob('**/*.{test,spec}.{ts,tsx}', {
      cwd: srcDir
    });

    // Extract base names of tested files
    const testedFiles = new Set(
      testFiles.map(testFile => {
        const baseName = testFile
          .replace(/\.(test|spec)\.(ts|tsx)$/, '')
          .replace(/\.test$/, '')
          .replace(/\.spec$/, '');
        return baseName + '.ts';
      })
    );

    // Find files without corresponding tests
    const uncoveredFiles = sourceFiles.filter(sourceFile => {
      const withoutExt = sourceFile.replace(/\.(ts|tsx)$/, '');
      const tsVersion = withoutExt + '.ts';
      const tsxVersion = withoutExt + '.tsx';
      
      return !testedFiles.has(tsVersion) && !testedFiles.has(tsxVersion);
    });

    return uncoveredFiles;
  } catch (error) {
    console.error('Error finding uncovered files:', error);
    return [];
  }
}

/**
 * Generate coverage report
 */
export function generateCoverageReport(
  report: CoverageReport,
  uncoveredFiles: string[] = []
): string {
  const validation = validateCoverage(report);
  
  let reportText = '# Test Coverage Report\n\n';
  
  reportText += '## Coverage Summary\n\n';
  reportText += `| Metric | Coverage | Status |\n`;
  reportText += `|--------|----------|--------|\n`;
  reportText += `| Lines | ${report.lines.percentage.toFixed(1)}% (${report.lines.covered}/${report.lines.total}) | ${report.lines.percentage >= DEFAULT_COVERAGE_THRESHOLDS.lines ? '✅' : '❌'} |\n`;
  reportText += `| Branches | ${report.branches.percentage.toFixed(1)}% (${report.branches.covered}/${report.branches.total}) | ${report.branches.percentage >= DEFAULT_COVERAGE_THRESHOLDS.branches ? '✅' : '❌'} |\n`;
  reportText += `| Functions | ${report.functions.percentage.toFixed(1)}% (${report.functions.covered}/${report.functions.total}) | ${report.functions.percentage >= DEFAULT_COVERAGE_THRESHOLDS.functions ? '✅' : '❌'} |\n`;
  reportText += `| Statements | ${report.statements.percentage.toFixed(1)}% (${report.statements.covered}/${report.statements.total}) | ${report.statements.percentage >= DEFAULT_COVERAGE_THRESHOLDS.statements ? '✅' : '❌'} |\n\n`;
  
  reportText += '## Overall Status\n\n';
  if (validation.passed) {
    reportText += '✅ **All coverage thresholds met!**\n\n';
  } else {
    reportText += '❌ **Coverage thresholds not met**\n\n';
    reportText += '### Issues:\n';
    validation.failures.forEach(failure => {
      reportText += `- ${failure}\n`;
    });
    reportText += '\n';
  }
  
  if (uncoveredFiles.length > 0) {
    reportText += '## Files Missing Tests\n\n';
    reportText += `Found ${uncoveredFiles.length} files without corresponding tests:\n\n`;
    uncoveredFiles.forEach(file => {
      reportText += `- \`${file}\`\n`;
    });
    reportText += '\n';
    reportText += '### Recommendations:\n';
    reportText += '1. Create test files for uncovered components\n';
    reportText += '2. Focus on files with complex logic first\n';
    reportText += '3. Add integration tests for user workflows\n';
    reportText += '4. Consider snapshot tests for UI components\n\n';
  }
  
  reportText += '## Coverage Goals\n\n';
  reportText += `- **Target**: 95% line coverage, 90% branch coverage\n`;
  reportText += `- **Current**: ${report.lines.percentage.toFixed(1)}% line coverage, ${report.branches.percentage.toFixed(1)}% branch coverage\n`;
  reportText += `- **Gap**: ${Math.max(0, DEFAULT_COVERAGE_THRESHOLDS.lines - report.lines.percentage).toFixed(1)}% lines, ${Math.max(0, DEFAULT_COVERAGE_THRESHOLDS.branches - report.branches.percentage).toFixed(1)}% branches\n\n`;
  
  return reportText;
}

/**
 * Generate test file template for uncovered file
 */
export function generateTestTemplate(filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  const isComponent = filePath.includes('components') || fileName[0].toUpperCase() === fileName[0];
  
  let template = `/**\n * Tests for ${fileName}\n */\n\n`;
  
  if (isComponent) {
    template += `import { describe, it, expect, vi, beforeEach } from 'vitest';\n`;
    template += `import { render, screen } from '@testing-library/react';\n`;
    template += `import { renderWithTheme } from '@/tests/utils/test-utils';\n`;
    template += `import { ${fileName} } from './${fileName}';\n\n`;
    
    template += `// Mock dependencies if needed\n`;
    template += `// vi.mock('dependency', () => ({ ... }));\n\n`;
    
    template += `describe('${fileName}', () => {\n`;
    template += `  beforeEach(() => {\n`;
    template += `    vi.clearAllMocks();\n`;
    template += `  });\n\n`;
    
    template += `  it('should render successfully', () => {\n`;
    template += `    renderWithTheme(<${fileName} />);\n`;
    template += `    \n`;
    template += `    // Add assertions here\n`;
    template += `    expect(screen.getByRole('button')).toBeInTheDocument();\n`;
    template += `  });\n\n`;
    
    template += `  it('should handle props correctly', () => {\n`;
    template += `    const props = {\n`;
    template += `      // Add relevant props\n`;
    template += `    };\n`;
    template += `    \n`;
    template += `    renderWithTheme(<${fileName} {...props} />);\n`;
    template += `    \n`;
    template += `    // Add assertions here\n`;
    template += `  });\n\n`;
    
    template += `  it('should handle user interactions', async () => {\n`;
    template += `    const user = userEvent.setup();\n`;
    template += `    renderWithTheme(<${fileName} />);\n`;
    template += `    \n`;
    template += `    // Add interaction tests\n`;
    template += `    // await user.click(screen.getByRole('button'));\n`;
    template += `  });\n`;
    template += `});\n`;
  } else {
    // Utility/hook/service tests
    template += `import { describe, it, expect, vi, beforeEach } from 'vitest';\n`;
    template += `import { ${fileName} } from './${fileName}';\n\n`;
    
    template += `describe('${fileName}', () => {\n`;
    template += `  beforeEach(() => {\n`;
    template += `    vi.clearAllMocks();\n`;
    template += `  });\n\n`;
    
    template += `  it('should work correctly with valid input', () => {\n`;
    template += `    // Add test implementation\n`;
    template += `    const result = ${fileName}(/* parameters */);\n`;
    template += `    \n`;
    template += `    expect(result).toBeDefined();\n`;
    template += `  });\n\n`;
    
    template += `  it('should handle edge cases', () => {\n`;
    template += `    // Add edge case tests\n`;
    template += `  });\n\n`;
    
    template += `  it('should handle error conditions', () => {\n`;
    template += `    // Add error handling tests\n`;
    template += `  });\n`;
    template += `});\n`;
  }
  
  return template;
}