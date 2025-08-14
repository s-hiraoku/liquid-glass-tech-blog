/**
 * Effect Manager Implementation
 * Phase 5.8: Effect Save & Export System Implementation
 * 
 * Features:
 * - Effect metadata management and storage
 * - React, Vue.js, CSS code generation
 * - Effect package creation with all required files
 * - Multiple export formats (NPM, CDN, source code)
 * - Performance metrics and validation
 * - Integration with @developer-hub/liquid-glass library
 */

import { z } from 'zod'

// Type definitions
export interface EffectMetadata {
  id: string
  name: string
  description: string
  category: string
  author: string
  version: string
  tags: string[]
  performance: PerformanceMetrics
  settings: EffectSettings
  code: string
  createdAt: Date
  updatedAt: Date
  previewImage?: string
}

export interface EffectSettings {
  blur?: number
  opacity?: number
  saturation?: number
  brightness?: number
  contrast?: number
  hueRotate?: number
  interactive?: boolean
  seasonalTheme?: boolean
  animationDuration?: number
  [key: string]: any
}

export interface PerformanceMetrics {
  fpsTarget: number
  gpuAccelerated: boolean
  gpuAcceleration?: boolean
  memoryUsage: 'low' | 'medium' | 'high'
  complexity: 'low' | 'medium' | 'high'
  fpsEstimate?: number
  browserSupport?: string[]
  recommendations?: string[]
}

export interface GeneratedCode {
  framework: 'react' | 'vue' | 'css'
  code: string
  dependencies: string[]
  instructions: string
}

export interface EffectPackage {
  metadata: EffectMetadata
  files: { [filename: string]: string }
  previewImage?: string
  size: number
}

export interface ExportResult {
  format: ExportFormat
  files: { [filename: string]: string }
  downloadUrl: string
  cdnUrl?: string
  size: number
}

export type ExportFormat = 'npm' | 'cdn' | 'source'

// Validation schemas
const effectSettingsSchema = z.object({
  blur: z.number().min(0).max(100).optional(),
  opacity: z.number().min(0).max(1).optional(),
  saturation: z.number().min(0).max(3).optional(),
  brightness: z.number().min(0).max(3).optional(),
  contrast: z.number().min(0).max(3).optional(),
  hueRotate: z.number().min(0).max(360).optional(),
  interactive: z.boolean().optional(),
  seasonalTheme: z.boolean().optional(),
  animationDuration: z.number().min(0).max(5000).optional(),
})

const effectMetadataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  author: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  tags: z.array(z.string()),
  performance: z.object({
    fpsTarget: z.number().min(30).max(120),
    gpuAccelerated: z.boolean(),
    memoryUsage: z.enum(['low', 'medium', 'high']),
    complexity: z.enum(['low', 'medium', 'high']),
  }),
  settings: effectSettingsSchema,
  code: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export class EffectManager {
  private effects: Map<string, EffectMetadata> = new Map()
  private storageKey = 'effects'

  constructor() {
    this.loadFromStorage()
  }

  /**
   * Save effect with metadata
   */
  async saveEffect(metadata: EffectMetadata): Promise<{ success: boolean; effectId: string; error?: string }> {
    try {
      // Validate metadata
      this.validateEffectMetadata(metadata)
      this.validateEffectCode(metadata.code)
      this.validateEffectSettings(metadata.settings)

      // Update timestamps
      metadata.updatedAt = new Date()
      if (!metadata.createdAt) {
        metadata.createdAt = new Date()
      }

      // Store in memory and localStorage
      this.effects.set(metadata.id, metadata)
      this.saveToStorage()

      return {
        success: true,
        effectId: metadata.id
      }
    } catch (error) {
      return {
        success: false,
        effectId: metadata.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Load all saved effects
   */
  async loadEffects(): Promise<EffectMetadata[]> {
    this.loadFromStorage()
    return Array.from(this.effects.values()).sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    )
  }

  /**
   * Delete effect by ID
   */
  async deleteEffect(effectId: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.effects.delete(effectId)
      this.saveToStorage()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Generate code for different frameworks
   */
  async generateCode(metadata: EffectMetadata, framework: 'react' | 'vue' | 'css'): Promise<GeneratedCode> {
    switch (framework) {
      case 'react':
        return this.generateReactCode(metadata)
      case 'vue':
        return this.generateVueCode(metadata)
      case 'css':
        return this.generateCSSCode(metadata)
      default:
        throw new Error(`Unsupported framework: ${framework}`)
    }
  }

  /**
   * Generate React component code
   */
  private generateReactCode(metadata: EffectMetadata): GeneratedCode {
    const componentName = this.toPascalCase(metadata.name)
    const className = this.toKebabCase(metadata.name)

    const code = `import React from 'react'
import './styles.css'

interface ${componentName}Props {
  children?: React.ReactNode
  className?: string
  blur?: number
  opacity?: number
  saturation?: number
  interactive?: boolean
}

const ${componentName}: React.FC<${componentName}Props> = ({
  children,
  className = '',
  blur = ${metadata.settings.blur || 10},
  opacity = ${metadata.settings.opacity || 0.15},
  saturation = ${metadata.settings.saturation || 1},
  interactive = ${metadata.settings.interactive || false},
  ...props
}) => {
  const style = {
    '--blur': \`\${blur}px\`,
    '--opacity': opacity,
    '--saturation': saturation,
  } as React.CSSProperties

  return (
    <div
      className={\`${className} \${className} \${interactive ? '${className}--interactive' : ''}\`}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

/* CSS styles - ${metadata.code} */

export default ${componentName}`

    return {
      framework: 'react',
      code,
      dependencies: ['react', '@types/react'],
      instructions: `
Usage:
\`\`\`jsx
import ${componentName} from './${componentName}'

<${componentName} blur={15} opacity={0.2}>
  Your content here
</${componentName}>
\`\`\`
      `
    }
  }

  /**
   * Generate Vue component code
   */
  private generateVueCode(metadata: EffectMetadata): GeneratedCode {
    const componentName = this.toPascalCase(metadata.name)
    const className = this.toKebabCase(metadata.name)

    const code = `<template>
  <div
    :class="[
      '${className}',
      { '${className}--interactive': interactive }
    ]"
    :style="dynamicStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  blur?: number
  opacity?: number
  saturation?: number
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  blur: ${metadata.settings.blur || 10},
  opacity: ${metadata.settings.opacity || 0.15},
  saturation: ${metadata.settings.saturation || 1},
  interactive: ${metadata.settings.interactive || false},
})

const dynamicStyle = computed(() => ({
  '--blur': \`\${props.blur}px\`,
  '--opacity': props.opacity,
  '--saturation': props.saturation,
}))
</script>

<style scoped>
${metadata.code}
</style>`

    return {
      framework: 'vue',
      code,
      dependencies: ['vue'],
      instructions: `
Usage:
\`\`\`vue
<template>
  <${componentName} :blur="15" :opacity="0.2">
    Your content here
  </${componentName}>
</template>

<script setup>
import ${componentName} from './${componentName}.vue'
</script>
\`\`\`
      `
    }
  }

  /**
   * Generate pure CSS code
   */
  private generateCSSCode(metadata: EffectMetadata): GeneratedCode {
    const className = this.toKebabCase(metadata.name)
    
    const code = `/* ${metadata.name} - ${metadata.description} */
.${className} {
  /* Default settings */
  --blur: ${metadata.settings.blur || 10}px;
  --opacity: ${metadata.settings.opacity || 0.15};
  --saturation: ${metadata.settings.saturation || 1};
  
  /* Original effect code */
${metadata.code}
  
  /* Enhanced liquid glass effect */
  backdrop-filter: blur(var(--blur)) saturate(var(--saturation));
  background: rgba(255, 255, 255, var(--opacity));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  
  /* GPU acceleration */
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}

.${className}--interactive {
  transition: all 0.3s ease;
  cursor: pointer;
}

.${className}--interactive:hover {
  --opacity: calc(var(--opacity) + 0.05);
  transform: translateY(-2px) translateZ(0);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Custom properties for easy customization */
.${className}[data-blur="light"] { --blur: 5px; }
.${className}[data-blur="medium"] { --blur: 10px; }
.${className}[data-blur="heavy"] { --blur: 20px; }

.${className}[data-opacity="light"] { --opacity: 0.1; }
.${className}[data-opacity="medium"] { --opacity: 0.15; }
.${className}[data-opacity="heavy"] { --opacity: 0.25; }

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .${className} {
    background: rgba(0, 0, 0, var(--opacity));
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .${className}--interactive {
    transition: none;
  }
  
  .${className}--interactive:hover {
    transform: none;
  }
}`

    return {
      framework: 'css',
      code,
      dependencies: [],
      instructions: `
Usage:
\`\`\`html
<div class="${className}">Your content here</div>
<div class="${className} ${className}--interactive" data-blur="heavy">Interactive version</div>
\`\`\`

Customization:
- Use CSS custom properties: --blur, --opacity, --saturation
- Add data attributes: data-blur="light|medium|heavy", data-opacity="light|medium|heavy"
- Supports dark mode and reduced motion preferences
      `
    }
  }

  /**
   * Create complete effect package
   */
  async createEffectPackage(metadata: EffectMetadata): Promise<EffectPackage> {
    const reactCode = await this.generateCode(metadata, 'react')
    const vueCode = await this.generateCode(metadata, 'vue')
    const cssCode = await this.generateCode(metadata, 'css')
    
    const packageJson = this.generatePackageJson(metadata)
    const readme = this.generateReadme(metadata)

    const files = {
      'react': reactCode.code,
      'vue': vueCode.code,
      'css': cssCode.code,
      'package.json': JSON.stringify(packageJson, null, 2),
      'README.md': readme,
      'index.ts': this.generateIndexFile(metadata),
      'types.d.ts': this.generateTypeDefinitions(metadata),
    }

    // Calculate package size
    const size = Object.values(files).reduce((total, content) => total + content.length, 0)

    return {
      metadata,
      files,
      previewImage: metadata.previewImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5QcmV2aWV3PC90ZXh0Pjwvc3ZnPg==',
      size
    }
  }

  /**
   * Export effect in specified format
   */
  async exportEffect(metadata: EffectMetadata, format: ExportFormat): Promise<ExportResult> {
    const effectPackage = await this.createEffectPackage(metadata)
    
    switch (format) {
      case 'npm':
        return this.exportAsNPM(effectPackage)
      case 'cdn':
        return this.exportAsCDN(effectPackage)
      case 'source':
        return this.exportAsSource(effectPackage)
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  /**
   * Generate package.json for NPM export
   */
  generatePackageJson(metadata: EffectMetadata) {
    return {
      name: `@liquid-glass/${metadata.id}`,
      version: metadata.version,
      description: metadata.description,
      main: 'index.js',
      module: 'index.esm.js',
      types: 'index.d.ts',
      author: metadata.author,
      license: 'MIT',
      keywords: [
        'liquid-glass',
        'ui-component',
        'css-effects',
        'backdrop-filter',
        ...metadata.tags
      ],
      peerDependencies: {
        react: '>=18.0.0',
        vue: '>=3.0.0'
      },
      repository: {
        type: 'git',
        url: `https://github.com/liquid-glass-ui/${metadata.id}`
      },
      bugs: {
        url: `https://github.com/liquid-glass-ui/${metadata.id}/issues`
      },
      homepage: `https://liquid-glass-ui.com/effects/${metadata.id}`,
      files: [
        'dist/',
        'README.md',
        'package.json'
      ],
      scripts: {
        build: 'rollup -c',
        dev: 'rollup -c -w',
        test: 'vitest',
        'type-check': 'tsc --noEmit'
      }
    }
  }

  /**
   * Measure effect performance
   */
  async measurePerformance(code: string): Promise<PerformanceMetrics> {
    // Analyze CSS complexity
    const blurMatches = code.match(/blur\((\d+)px\)/g) || []
    const maxBlur = Math.max(...blurMatches.map(m => parseInt(m.match(/\d+/)?.[0] || '0', 10)), 0)
    
    const filterCount = (code.match(/backdrop-filter|filter:/g) || []).length
    const transformCount = (code.match(/transform:/g) || []).length
    const animationCount = (code.match(/@keyframes|animation:|transition:/g) || []).length
    
    // Calculate complexity score
    const complexityScore = (maxBlur / 10) + filterCount + (transformCount * 0.5) + (animationCount * 2)
    
    let complexity: 'low' | 'medium' | 'high'
    let fpsEstimate: number
    let memoryUsage: 'low' | 'medium' | 'high'
    
    if (complexityScore <= 3) {
      complexity = 'low'
      fpsEstimate = 60
      memoryUsage = 'low'
    } else if (complexityScore <= 7) {
      complexity = 'medium'
      fpsEstimate = 45
      memoryUsage = 'medium'
    } else {
      complexity = 'high'
      fpsEstimate = 30
      memoryUsage = 'high'
    }

    // Generate recommendations
    const recommendations: string[] = []
    if (maxBlur > 20) recommendations.push('reduce blur intensity')
    if (filterCount > 3) recommendations.push('combine filter effects')
    if (animationCount > 2) recommendations.push('optimize animation performance')
    if (!code.includes('transform: translateZ(0)')) recommendations.push('add GPU acceleration')

    const gpuAccelerated = code.includes('translateZ(0)') || code.includes('will-change')
    
    return {
      fpsTarget: 60,
      gpuAccelerated,
      gpuAcceleration: gpuAccelerated,
      memoryUsage,
      complexity,
      fpsEstimate,
      browserSupport: this.analyzeBrowserSupport(code),
      recommendations
    }
  }

  /**
   * Validation methods
   */
  validateEffectMetadata(metadata: EffectMetadata): void {
    try {
      effectMetadataSchema.parse(metadata)
    } catch (error) {
      throw new Error(`Invalid effect metadata: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  validateEffectCode(code: string): void {
    if (!code || code.trim().length === 0) {
      throw new Error('Effect code cannot be empty')
    }

    // Basic CSS syntax validation
    const braceCount = (code.match(/{/g) || []).length - (code.match(/}/g) || []).length
    if (braceCount !== 0) {
      throw new Error('Invalid CSS syntax: mismatched braces')
    }

    // Check for invalid CSS syntax
    if (code.includes('backdrop-filter blur(') && !code.includes('backdrop-filter: blur(')) {
      throw new Error('Invalid CSS syntax: missing colon')
    }

    // Check for dangerous content
    if (code.includes('javascript:') || code.includes('expression(')) {
      throw new Error('Invalid CSS: dangerous content detected')
    }
  }

  validateEffectSettings(settings: EffectSettings): void {
    try {
      effectSettingsSchema.parse(settings)
    } catch (error) {
      throw new Error(`Invalid effect settings: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Private utility methods
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        this.effects = new Map(Object.entries(parsed).map(([key, value]: [string, any]) => [
          key,
          {
            ...value,
            createdAt: new Date(value.createdAt),
            updatedAt: new Date(value.updatedAt)
          }
        ]))
      }
    } catch (error) {
      console.warn('Failed to load effects from storage:', error)
      this.effects = new Map()
    }
  }

  private saveToStorage(): void {
    try {
      const effectsObject = Object.fromEntries(this.effects)
      localStorage.setItem(this.storageKey, JSON.stringify(effectsObject))
    } catch (error) {
      console.warn('Failed to save effects to storage:', error)
    }
  }

  private toPascalCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return word.toUpperCase()
    }).replace(/\s+/g, '')
  }

  private toKebabCase(str: string): string {
    return str.replace(/\s+/g, '-').toLowerCase()
  }

  private generateReadme(metadata: EffectMetadata): string {
    return `# ${metadata.name}

${metadata.description}

## Installation

\`\`\`bash
npm install @liquid-glass/${metadata.id}
\`\`\`

## Usage

### React

\`\`\`jsx
import ${this.toPascalCase(metadata.name)} from '@liquid-glass/${metadata.id}/react'

function App() {
  return (
    <${this.toPascalCase(metadata.name)} blur={15} opacity={0.2}>
      Your content here
    </${this.toPascalCase(metadata.name)}>
  )
}
\`\`\`

### Vue

\`\`\`vue
<template>
  <${this.toPascalCase(metadata.name)} :blur="15" :opacity="0.2">
    Your content here
  </${this.toPascalCase(metadata.name)}>
</template>

<script setup>
import ${this.toPascalCase(metadata.name)} from '@liquid-glass/${metadata.id}/vue'
</script>
\`\`\`

### CSS Only

\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@liquid-glass/${metadata.id}/styles.css">

<div class="${this.toKebabCase(metadata.name)}">
  Your content here
</div>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| blur | number | ${metadata.settings.blur || 10} | Blur intensity in pixels |
| opacity | number | ${metadata.settings.opacity || 0.15} | Background opacity (0-1) |
| saturation | number | ${metadata.settings.saturation || 1} | Color saturation multiplier |
| interactive | boolean | ${metadata.settings.interactive || false} | Enable hover effects |

## Performance

- **Target FPS**: ${metadata.performance.fpsTarget}
- **GPU Accelerated**: ${metadata.performance.gpuAccelerated ? 'Yes' : 'No'}
- **Memory Usage**: ${metadata.performance.memoryUsage}
- **Complexity**: ${metadata.performance.complexity}

## Browser Support

This effect uses modern CSS features and requires browsers that support:
- backdrop-filter
- CSS custom properties
- transform3d

## License

MIT © ${metadata.author}
`
  }

  private generateIndexFile(metadata: EffectMetadata): string {
    const componentName = this.toPascalCase(metadata.name)
    return `export { default as React${componentName} } from './React'
export { default as Vue${componentName} } from './Vue.vue'
export type { EffectSettings } from './types'

// CSS-only version
import './styles.css'
`
  }

  private generateTypeDefinitions(metadata: EffectMetadata): string {
    return `export interface EffectSettings {
  blur?: number
  opacity?: number
  saturation?: number
  brightness?: number
  contrast?: number
  hueRotate?: number
  interactive?: boolean
  seasonalTheme?: boolean
  animationDuration?: number
}

export interface ${this.toPascalCase(metadata.name)}Props extends EffectSettings {
  children?: React.ReactNode
  className?: string
}
`
  }

  private async exportAsNPM(effectPackage: EffectPackage): Promise<ExportResult> {
    const files = {
      'package.json': effectPackage.files['package.json'],
      'index.js': this.generateCommonJSIndex(effectPackage.metadata),
      'index.esm.js': this.generateESMIndex(effectPackage.metadata),
      'index.d.ts': effectPackage.files['types.d.ts'],
      'README.md': effectPackage.files['README.md'],
      'react/index.js': this.wrapReactForNPM(effectPackage.files['react']),
      'vue/index.js': this.wrapVueForNPM(effectPackage.files['vue']),
      'styles.css': effectPackage.files['css'],
    }

    return {
      format: 'npm',
      files,
      downloadUrl: this.generateDownloadUrl(effectPackage.metadata.id, 'npm'),
      size: Object.values(files).reduce((sum, content) => sum + content.length, 0)
    }
  }

  private async exportAsCDN(effectPackage: EffectPackage): Promise<ExportResult> {
    const minifiedJS = this.minifyJS(effectPackage.files['react'])
    const minifiedCSS = this.minifyCSS(effectPackage.files['css'])
    
    const files = {
      [`liquid-glass-${effectPackage.metadata.id}.min.js`]: minifiedJS,
      [`liquid-glass-${effectPackage.metadata.id}.min.css`]: minifiedCSS,
    }

    return {
      format: 'cdn',
      files,
      downloadUrl: this.generateDownloadUrl(effectPackage.metadata.id, 'cdn'),
      cdnUrl: `https://cdn.jsdelivr.net/npm/@liquid-glass/${effectPackage.metadata.id}@latest/dist/`,
      size: Object.values(files).reduce((sum, content) => sum + content.length, 0)
    }
  }

  private async exportAsSource(effectPackage: EffectPackage): Promise<ExportResult> {
    const files = {
      'React.tsx': effectPackage.files['react'],
      'Vue.vue': effectPackage.files['vue'],
      'styles.css': effectPackage.files['css'],
      'types.d.ts': effectPackage.files['types.d.ts'],
      'README.md': effectPackage.files['README.md'],
    }

    return {
      format: 'source',
      files,
      downloadUrl: this.generateDownloadUrl(effectPackage.metadata.id, 'source'),
      size: Object.values(files).reduce((sum, content) => sum + content.length, 0)
    }
  }

  private analyzeBrowserSupport(code: string): string[] {
    const features = []
    if (code.includes('backdrop-filter')) features.push('backdrop-filter')
    if (code.includes('filter:')) features.push('filter')
    if (code.includes('transform:')) features.push('transform')
    if (code.includes('transition:')) features.push('transition')
    if (code.includes('animation:')) features.push('animation')
    
    // Based on feature support, determine browser compatibility
    const support = ['Chrome 76+', 'Firefox 103+', 'Safari 14+', 'Edge 79+']
    if (code.includes('backdrop-filter')) {
      return ['Chrome 76+', 'Firefox 103+', 'Safari 14+', 'Edge 79+']
    }
    return ['Chrome 1+', 'Firefox 1+', 'Safari 1+', 'Edge 12+']
  }

  private generateCommonJSIndex(metadata: EffectMetadata): string {
    return `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.React${this.toPascalCase(metadata.name)} = require('./react');
exports.Vue${this.toPascalCase(metadata.name)} = require('./vue');
`
  }

  private generateESMIndex(metadata: EffectMetadata): string {
    return `export { default as React${this.toPascalCase(metadata.name)} } from './react/index.js';
export { default as Vue${this.toPascalCase(metadata.name)} } from './vue/index.js';
`
  }

  private wrapReactForNPM(reactCode: string): string {
    return `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
${reactCode.replace('export default', 'module.exports =')}
`
  }

  private wrapVueForNPM(vueCode: string): string {
    return `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = ${JSON.stringify(vueCode)};
`
  }

  private minifyJS(code: string): string {
    // Basic minification - remove comments and extra whitespace
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private minifyCSS(code: string): string {
    // Basic CSS minification
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/\s*{\s*/g, '{')
      .replace(/;\s*/g, ';')
      .trim()
  }

  private generateDownloadUrl(effectId: string, format: string): string {
    return `https://api.liquid-glass-tech.com/effects/${effectId}/download/${format}`
  }
}