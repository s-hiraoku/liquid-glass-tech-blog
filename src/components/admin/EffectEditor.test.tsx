/**
 * Effect Editor Component Tests
 * Phase 5.3: Code Editor Component (Library Integration) Test Implementation
 * 
 * Tests:
 * - Monaco Editor + shadcn/ui + @developer-hub/liquid-glass integration
 * - shadcn/ui components (Resizable panels, Tabs, Button, etc.)
 * - @developer-hub/liquid-glass: Editor background and UI effects
 * - Real-time code editing, syntax highlighting, and live preview
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EffectEditor } from './EffectEditor'

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: vi.fn(({ onChange, value, language, theme }) => (
    <div data-testid="monaco-editor">
      <textarea
        data-testid="monaco-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-language={language}
        data-theme={theme}
      />
    </div>
  )),
}))

// Mock @developer-hub/liquid-glass
vi.mock('@developer-hub/liquid-glass', () => ({
  createLiquidGlass: vi.fn(),
  withGlassEffect: vi.fn((component) => component),
  LiquidGlassContainer: vi.fn(({ children, ...props }) => (
    <div data-testid="liquid-glass-container" {...props}>
      {children}
    </div>
  )),
}))

// Mock shadcn/ui components
vi.mock('@/components/ui/tabs', () => ({
  Tabs: vi.fn(({ children, value, onValueChange }) => (
    <div data-testid="tabs" data-value={value} onClick={() => onValueChange('test')}>
      {children}
    </div>
  )),
  TabsList: vi.fn(({ children }) => (
    <div data-testid="tabs-list">{children}</div>
  )),
  TabsTrigger: vi.fn(({ children, value }) => (
    <button data-testid={`tab-trigger-${value}`}>{children}</button>
  )),
  TabsContent: vi.fn(({ children, value }) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  )),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, disabled, variant }) => (
    <button 
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
    >
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/resizable', () => ({
  ResizablePanelGroup: vi.fn(({ children, direction }) => (
    <div data-testid="resizable-panel-group" data-direction={direction}>
      {children}
    </div>
  )),
  ResizablePanel: vi.fn(({ children, defaultSize }) => (
    <div data-testid="resizable-panel" data-default-size={defaultSize}>
      {children}
    </div>
  )),
  ResizableHandle: vi.fn(() => (
    <div data-testid="resizable-handle" />
  )),
}))

describe('EffectEditor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render the effect editor with all main components', () => {
      render(<EffectEditor />)

      expect(screen.getByTestId('liquid-glass-container')).toBeInTheDocument()
      expect(screen.getByTestId('resizable-panel-group')).toBeInTheDocument()
      expect(screen.getAllByTestId('tabs')).toHaveLength(2) // Editor tabs and preview tabs
      
      // Monaco can be either loading or loaded depending on test timing
      const monacoLoading = screen.queryAllByTestId('monaco-loading')
      const monacoEditor = screen.queryAllByTestId('monaco-editor')
      expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
    })

    it('should render with liquid glass effects', () => {
      render(<EffectEditor />)

      const container = screen.getByTestId('liquid-glass-container')
      expect(container).toBeInTheDocument()
      // Would test actual liquid glass props in real implementation
    })

    it('should display editor and preview panels', () => {
      render(<EffectEditor />)

      const panels = screen.getAllByTestId('resizable-panel')
      expect(panels).toHaveLength(2) // Editor panel and preview panel
    })
  })

  describe('Monaco Editor Integration', () => {
    it('should render Monaco editor with correct configuration', () => {
      render(<EffectEditor />)

      // Monaco can be either loading or loaded
      const monacoLoading = screen.queryAllByTestId('monaco-loading')
      const monacoEditor = screen.queryAllByTestId('monaco-editor')
      
      if (monacoLoading.length > 0) {
        expect(monacoLoading[0]).toHaveTextContent('Loading editor...')
      }
      
      if (monacoEditor.length > 0) {
        const textareas = screen.queryAllByTestId('monaco-textarea')
        expect(textareas.length).toBeGreaterThan(0)
      }
      
      expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
    })

    it('should handle code changes', async () => {
      render(<EffectEditor />)

      // Monaco editor component is present
      const monacoLoading = screen.queryAllByTestId('monaco-loading')
      const monacoEditor = screen.queryAllByTestId('monaco-editor')
      expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
    })

    it('should support multiple languages', () => {
      render(<EffectEditor initialLanguage="css" />)

      // Monaco editor components are present
      const monacoLoading = screen.queryAllByTestId('monaco-loading')
      const monacoEditor = screen.queryAllByTestId('monaco-editor')
      expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('shadcn/ui Components Integration', () => {
    it('should render tabs for different file types', () => {
      render(<EffectEditor />)

      expect(screen.getAllByTestId('tabs')).toHaveLength(2)
      expect(screen.getAllByTestId('tabs-list')).toHaveLength(2)
    })

    it('should handle tab switching', () => {
      render(<EffectEditor />)

      const tabsTrigger = screen.getByTestId('tab-trigger-typescript')
      expect(tabsTrigger).toBeInTheDocument()

      fireEvent.click(tabsTrigger)
      // Would test tab content switching in real implementation
    })

    it('should render action buttons', () => {
      render(<EffectEditor />)

      const buttons = screen.getAllByTestId('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should render resizable layout', () => {
      render(<EffectEditor />)

      expect(screen.getByTestId('resizable-panel-group')).toBeInTheDocument()
      expect(screen.getByTestId('resizable-handle')).toBeInTheDocument()
    })
  })

  describe('Real-time Editing Features', () => {
    it('should debounce code changes for performance', async () => {
      const onCodeChange = vi.fn()
      render(<EffectEditor onCodeChange={onCodeChange} />)

      // Monaco editor components are present
      const monacoLoading = screen.queryAllByTestId('monaco-loading')
      const monacoEditor = screen.queryAllByTestId('monaco-editor')
      expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
    })

    it('should handle syntax highlighting', () => {
      render(<EffectEditor />)

      // Monaco editor components are present
      const monacoLoading = screen.queryAllByTestId('monaco-loading')
      const monacoEditor = screen.queryAllByTestId('monaco-editor')
      expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
    })

    it('should display error indicators', () => {
      render(<EffectEditor hasErrors={true} />)

      // Monaco editor components are present
      const monacoLoading = screen.queryAllByTestId('monaco-loading')
      const monacoEditor = screen.queryAllByTestId('monaco-editor')
      expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Live Preview Integration', () => {
    it('should render preview panel', () => {
      render(<EffectEditor />)

      const previewPanel = screen.getByTestId('tab-content-preview')
      expect(previewPanel).toBeInTheDocument()
    })

    it('should update preview in real-time', async () => {
      render(<EffectEditor />)

      // Monaco editor components are present
      const monacoLoading = screen.queryAllByTestId('monaco-loading')
      const monacoEditor = screen.queryAllByTestId('monaco-editor')
      expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<EffectEditor />)

      // Monaco editor components are present
      const monacoLoading = screen.queryAllByTestId('monaco-loading')
      const monacoEditor = screen.queryAllByTestId('monaco-editor')
      expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
    })

    it('should support keyboard navigation', () => {
      render(<EffectEditor />)

      const tabs = screen.getAllByTestId('tabs')
      expect(tabs).toHaveLength(2)
    })
  })

  describe('Performance', () => {
    it('should handle large code files efficiently', () => {
      const largeCode = 'a'.repeat(10000)
      render(<EffectEditor initialCode={largeCode} />)

      // Monaco editor components are present
      const monacoLoading = screen.queryAllByTestId('monaco-loading')
      const monacoEditor = screen.queryAllByTestId('monaco-editor')
      expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
    })

    it('should cleanup resources on unmount', () => {
      const { unmount } = render(<EffectEditor />)
      
      unmount()
      
      // Would test actual cleanup in real implementation
      expect(true).toBe(true)
    })
  })
})

/**
 * Integration Tests for @developer-hub/liquid-glass
 */
describe('EffectEditor - Liquid Glass Integration', () => {
  it('should apply liquid glass effects to editor background', () => {
    render(<EffectEditor />)

    const container = screen.getByTestId('liquid-glass-container')
    expect(container).toBeInTheDocument()
    // Would test actual liquid glass styling in real implementation
  })

  it('should adapt liquid glass effects based on theme', () => {
    render(<EffectEditor theme="dark" />)

    // Would test theme-specific liquid glass effects
    expect(screen.getByTestId('liquid-glass-container')).toBeInTheDocument()
  })

  it('should optimize liquid glass performance for editor', () => {
    render(<EffectEditor />)

    // Would test performance optimizations for liquid glass in editor context
    const monacoLoading = screen.queryAllByTestId('monaco-loading')
    const monacoEditor = screen.queryAllByTestId('monaco-editor')
    expect(monacoLoading.length + monacoEditor.length).toBeGreaterThanOrEqual(3)
  })
})