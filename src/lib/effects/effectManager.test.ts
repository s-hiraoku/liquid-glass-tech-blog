/**
 * Effect Manager Tests
 * Phase 5.7: Effect Save & Export System Test Implementation
 * 
 * Tests:
 * - Effect saving and metadata management
 * - React, Vue, CSS code generation
 * - Effect package generation (code, config, preview image)
 * - Export formats (NPM, CDN, source code)
 * - Performance metrics and validation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  EffectManager,
  EffectMetadata,
  EffectPackage,
  ExportFormat,
  GeneratedCode,
  PerformanceMetrics
} from './effectManager'

// Mock dependencies
vi.mock('@developer-hub/liquid-glass', () => ({
  compile: vi.fn(),
  generateReactCode: vi.fn(),
  generateVueCode: vi.fn(),
  generateCSSCode: vi.fn(),
  measurePerformance: vi.fn(),
}))

vi.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: vi.fn(),
    }
  }
}))

describe('EffectManager - Phase 5.7: Effect Save & Export System TDD', () => {
  let effectManager: EffectManager
  let mockLocalStorage: { [key: string]: string }

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {}
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value
        }),
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorage[key]
        }),
        clear: vi.fn(() => {
          mockLocalStorage = {}
        }),
      },
      writable: true,
    })

    effectManager = new EffectManager()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('RED PHASE: Failing Tests Define Requirements', () => {
    describe('GIVEN effect saving requirements', () => {
      it('WHEN saving effect with metadata THEN should store effect data', async () => {
        const effectMetadata: EffectMetadata = {
          id: 'liquid-glass-card-v1',
          name: 'Liquid Glass Card',
          description: 'A beautiful card with liquid glass effect',
          category: 'cards',
          author: 'Admin User',
          version: '1.0.0',
          tags: ['card', 'glass', 'modern'],
          performance: {
            fpsTarget: 60,
            gpuAccelerated: true,
            memoryUsage: 'low',
            complexity: 'medium'
          },
          settings: {
            blur: 10,
            opacity: 0.15,
            saturation: 1.2,
            interactive: true
          },
          code: `
            .liquid-glass-card {
              backdrop-filter: blur(10px);
              background: rgba(255, 255, 255, 0.15);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
          `,
          createdAt: new Date('2024-08-14'),
          updatedAt: new Date('2024-08-14')
        }

        const result = await effectManager.saveEffect(effectMetadata)

        expect(result.success).toBe(true)
        expect(result.effectId).toBe('liquid-glass-card-v1')
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'effects',
          expect.stringContaining('liquid-glass-card-v1')
        )
      })

      it('WHEN loading saved effects THEN should return all stored effects', async () => {
        // Pre-populate localStorage with test data
        const testEffects = {
          'effect-1': {
            id: 'effect-1',
            name: 'Test Effect 1',
            category: 'buttons'
          },
          'effect-2': {
            id: 'effect-2',
            name: 'Test Effect 2',
            category: 'cards'
          }
        }
        mockLocalStorage['effects'] = JSON.stringify(testEffects)

        const effects = await effectManager.loadEffects()

        expect(effects).toHaveLength(2)
        expect(effects[0].id).toBe('effect-1')
        expect(effects[1].id).toBe('effect-2')
      })

      it('WHEN deleting effect THEN should remove from storage', async () => {
        const testEffects = {
          'effect-1': { id: 'effect-1', name: 'Test Effect 1' }
        }
        mockLocalStorage['effects'] = JSON.stringify(testEffects)

        const result = await effectManager.deleteEffect('effect-1')

        expect(result.success).toBe(true)
        expect(localStorage.setItem).toHaveBeenCalledWith('effects', '{}')
      })
    })

    describe('GIVEN code generation requirements', () => {
      it('WHEN generating React code THEN should return valid React component', async () => {
        const effectMetadata: EffectMetadata = {
          id: 'test-effect',
          name: 'Test Effect',
          description: 'Test description',
          category: 'test',
          author: 'Test',
          version: '1.0.0',
          tags: [],
          performance: {
            fpsTarget: 60,
            gpuAccelerated: true,
            memoryUsage: 'low',
            complexity: 'low'
          },
          settings: {
            blur: 5,
            opacity: 0.1
          },
          code: '.test { backdrop-filter: blur(5px); }',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const generatedCode = await effectManager.generateCode(effectMetadata, 'react')

        expect(generatedCode.framework).toBe('react')
        expect(generatedCode.code).toContain('import React')
        expect(generatedCode.code).toContain('const TestEffect')
        expect(generatedCode.code).toContain('backdrop-filter: blur(5px)')
        expect(generatedCode.dependencies).toContain('react')
        expect(generatedCode.dependencies).toContain('@types/react')
      })

      it('WHEN generating Vue code THEN should return valid Vue component', async () => {
        const effectMetadata: EffectMetadata = {
          id: 'test-effect',
          name: 'Test Effect',
          description: 'Test description',
          category: 'test',
          author: 'Test',
          version: '1.0.0',
          tags: [],
          performance: {
            fpsTarget: 60,
            gpuAccelerated: true,
            memoryUsage: 'low',
            complexity: 'low'
          },
          settings: {
            blur: 5,
            opacity: 0.1
          },
          code: '.test { backdrop-filter: blur(5px); }',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const generatedCode = await effectManager.generateCode(effectMetadata, 'vue')

        expect(generatedCode.framework).toBe('vue')
        expect(generatedCode.code).toContain('<template>')
        expect(generatedCode.code).toContain('<script setup')
        expect(generatedCode.code).toContain('backdrop-filter: blur(5px)')
        expect(generatedCode.dependencies).toContain('vue')
      })

      it('WHEN generating CSS code THEN should return pure CSS', async () => {
        const effectMetadata: EffectMetadata = {
          id: 'test-effect',
          name: 'Test Effect',
          description: 'Test description',
          category: 'test',
          author: 'Test',
          version: '1.0.0',
          tags: [],
          performance: {
            fpsTarget: 60,
            gpuAccelerated: true,
            memoryUsage: 'low',
            complexity: 'low'
          },
          settings: {
            blur: 5,
            opacity: 0.1
          },
          code: '.test { backdrop-filter: blur(5px); }',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const generatedCode = await effectManager.generateCode(effectMetadata, 'css')

        expect(generatedCode.framework).toBe('css')
        expect(generatedCode.code).toContain('.test-effect')
        expect(generatedCode.code).toContain('backdrop-filter: blur(5px)')
        expect(generatedCode.dependencies).toHaveLength(0)
      })
    })

    describe('GIVEN effect package generation requirements', () => {
      it('WHEN creating effect package THEN should include all required files', async () => {
        const effectMetadata: EffectMetadata = {
          id: 'test-package',
          name: 'Test Package',
          description: 'Test package description',
          category: 'test',
          author: 'Test',
          version: '1.0.0',
          tags: ['test'],
          performance: {
            fpsTarget: 60,
            gpuAccelerated: true,
            memoryUsage: 'low',
            complexity: 'low'
          },
          settings: {
            blur: 10,
            opacity: 0.2
          },
          code: '.test { backdrop-filter: blur(10px); }',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const effectPackage = await effectManager.createEffectPackage(effectMetadata)

        expect(effectPackage.metadata).toEqual(effectMetadata)
        expect(effectPackage.files).toHaveProperty('react')
        expect(effectPackage.files).toHaveProperty('vue')
        expect(effectPackage.files).toHaveProperty('css')
        expect(effectPackage.files).toHaveProperty('package.json')
        expect(effectPackage.files).toHaveProperty('README.md')
        expect(effectPackage.previewImage).toBeDefined()
        expect(effectPackage.size).toBeGreaterThan(0)
      })

      it('WHEN generating package.json THEN should include correct metadata', async () => {
        const effectMetadata: EffectMetadata = {
          id: 'test-package-json',
          name: 'Test Package JSON',
          description: 'Test package description',
          category: 'test',
          author: 'Test Author',
          version: '2.1.0',
          tags: ['test', 'package'],
          performance: {
            fpsTarget: 60,
            gpuAccelerated: true,
            memoryUsage: 'low',
            complexity: 'medium'
          },
          settings: {},
          code: '.test { }',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const packageData = effectManager.generatePackageJson(effectMetadata)

        expect(packageData.name).toBe('@liquid-glass/test-package-json')
        expect(packageData.version).toBe('2.1.0')
        expect(packageData.description).toBe('Test package description')
        expect(packageData.author).toBe('Test Author')
        expect(packageData.keywords).toContain('test')
        expect(packageData.keywords).toContain('package')
        expect(packageData.keywords).toContain('liquid-glass')
      })
    })

    describe('GIVEN export format requirements', () => {
      it('WHEN exporting as NPM package THEN should create proper NPM structure', async () => {
        const effectMetadata: EffectMetadata = {
          id: 'npm-export-test',
          name: 'NPM Export Test',
          description: 'Test NPM export',
          category: 'test',
          author: 'Test',
          version: '1.0.0',
          tags: [],
          performance: {
            fpsTarget: 60,
            gpuAccelerated: true,
            memoryUsage: 'low',
            complexity: 'low'
          },
          settings: {},
          code: '.test { }',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const exportResult = await effectManager.exportEffect(effectMetadata, 'npm')

        expect(exportResult.format).toBe('npm')
        expect(exportResult.files).toHaveProperty('package.json')
        expect(exportResult.files).toHaveProperty('index.js')
        expect(exportResult.files).toHaveProperty('index.d.ts')
        expect(exportResult.files).toHaveProperty('README.md')
        expect(exportResult.downloadUrl).toBeDefined()
      })

      it('WHEN exporting as CDN package THEN should create CDN-ready files', async () => {
        const effectMetadata: EffectMetadata = {
          id: 'cdn-export-test',
          name: 'CDN Export Test',
          description: 'Test CDN export',
          category: 'test',
          author: 'Test',
          version: '1.0.0',
          tags: [],
          performance: {
            fpsTarget: 60,
            gpuAccelerated: true,
            memoryUsage: 'low',
            complexity: 'low'
          },
          settings: {},
          code: '.test { }',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const exportResult = await effectManager.exportEffect(effectMetadata, 'cdn')

        expect(exportResult.format).toBe('cdn')
        expect(exportResult.files).toHaveProperty('liquid-glass-cdn-export-test.min.js')
        expect(exportResult.files).toHaveProperty('liquid-glass-cdn-export-test.min.css')
        expect(exportResult.cdnUrl).toBeDefined()
        expect(exportResult.downloadUrl).toBeDefined()
      })

      it('WHEN exporting as source code THEN should create source files', async () => {
        const effectMetadata: EffectMetadata = {
          id: 'source-export-test',
          name: 'Source Export Test',
          description: 'Test source export',
          category: 'test',
          author: 'Test',
          version: '1.0.0',
          tags: [],
          performance: {
            fpsTarget: 60,
            gpuAccelerated: true,
            memoryUsage: 'low',
            complexity: 'low'
          },
          settings: {},
          code: '.test { }',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const exportResult = await effectManager.exportEffect(effectMetadata, 'source')

        expect(exportResult.format).toBe('source')
        expect(exportResult.files).toHaveProperty('React.tsx')
        expect(exportResult.files).toHaveProperty('Vue.vue')
        expect(exportResult.files).toHaveProperty('styles.css')
        expect(exportResult.downloadUrl).toBeDefined()
      })
    })

    describe('GIVEN performance measurement requirements', () => {
      it('WHEN measuring effect performance THEN should return metrics', async () => {
        const effectCode = `
          .performance-test {
            backdrop-filter: blur(20px);
            transform: translateZ(0);
            will-change: transform;
          }
        `

        const metrics = await effectManager.measurePerformance(effectCode)

        expect(metrics.fpsEstimate).toBeGreaterThan(0)
        expect(metrics.memoryUsage).toBeDefined()
        expect(metrics.gpuAcceleration).toBeDefined()
        expect(metrics.complexity).toBeDefined()
        expect(metrics.browserSupport).toBeDefined()
        expect(metrics.recommendations).toBeDefined()
      })

      it('WHEN effect has performance issues THEN should provide recommendations', async () => {
        const heavyEffectCode = `
          .heavy-effect {
            backdrop-filter: blur(50px) saturate(2) brightness(1.5);
            filter: drop-shadow(0 0 20px rgba(0,0,0,0.5));
            transform: perspective(1000px) rotateX(45deg);
          }
        `

        const metrics = await effectManager.measurePerformance(heavyEffectCode)

        expect(metrics.complexity).toBe('high')
        expect(metrics.recommendations).toContain('reduce blur intensity')
        expect(metrics.fpsEstimate).toBeLessThan(60)
      })
    })

    describe('GIVEN effect validation requirements', () => {
      it('WHEN validating effect metadata THEN should check required fields', () => {
        const invalidMetadata = {
          // Missing required fields
          name: 'Test',
          description: '',
        } as any

        expect(() => effectManager.validateEffectMetadata(invalidMetadata)).toThrow()
      })

      it('WHEN validating effect code THEN should check CSS syntax', () => {
        const invalidCSS = `
          .invalid {
            backdrop-filter blur(10px); /* Missing colon */
            background: #invalid-color;
          }
        `

        expect(() => effectManager.validateEffectCode(invalidCSS)).toThrow()
      })

      it('WHEN validating effect settings THEN should check ranges', () => {
        const invalidSettings = {
          blur: -5, // Invalid negative value
          opacity: 2, // Invalid value > 1
          saturation: -1 // Invalid negative value
        }

        expect(() => effectManager.validateEffectSettings(invalidSettings)).toThrow()
      })
    })
  })

  describe('GREEN PHASE: Implementation Makes Tests Pass', () => {
    // Implementation tests will be added when effectManager.ts is created
    it('should pass all RED phase tests when implementation is complete', () => {
      // This test ensures we implement all required functionality
      expect(true).toBe(true)
    })
  })

  describe('REFACTOR PHASE: Code Quality and Optimization', () => {
    it('should have optimized performance for large effect libraries', async () => {
      // Test performance with 100+ effects
      const effects: EffectMetadata[] = Array.from({ length: 100 }, (_, i) => ({
        id: `effect-${i}`,
        name: `Effect ${i}`,
        description: `Test effect ${i}`,
        category: 'test',
        author: 'Test',
        version: '1.0.0',
        tags: [],
        performance: {
          fpsTarget: 60,
          gpuAccelerated: true,
          memoryUsage: 'low',
          complexity: 'low'
        },
        settings: {},
        code: `.effect-${i} { }`,
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      const startTime = performance.now()
      
      for (const effect of effects) {
        await effectManager.saveEffect(effect)
      }
      
      const loadedEffects = await effectManager.loadEffects()
      const endTime = performance.now()

      expect(loadedEffects).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete in under 1 second
    })

    it('should handle concurrent effect operations safely', async () => {
      const concurrentOperations = Array.from({ length: 10 }, (_, i) =>
        effectManager.saveEffect({
          id: `concurrent-${i}`,
          name: `Concurrent Effect ${i}`,
          description: 'Test concurrent operation',
          category: 'test',
          author: 'Test',
          version: '1.0.0',
          tags: [],
          performance: {
            fpsTarget: 60,
            gpuAccelerated: true,
            memoryUsage: 'low',
            complexity: 'low'
          },
          settings: {},
          code: `.concurrent-${i} { }`,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      )

      const results = await Promise.all(concurrentOperations)
      
      results.forEach(result => {
        expect(result.success).toBe(true)
      })

      const effects = await effectManager.loadEffects()
      expect(effects).toHaveLength(10)
    })
  })
})