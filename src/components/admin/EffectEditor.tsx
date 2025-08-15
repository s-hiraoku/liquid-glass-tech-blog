/**
 * Effect Editor Component
 * Phase 5.4: Code Editor Component (Library Integration) Implementation
 * 
 * Features:
 * - Monaco Editor + shadcn/ui + @developer-hub/liquid-glass integration
 * - shadcn/ui Layout: Resizable panels, Tabs, Tooltip, etc.
 * - @developer-hub/liquid-glass: Editor background and preview effects
 * - glasscn-ui theme: Custom Liquid Glass theme (dark/light mode)
 * - TypeScript, CSS, JavaScript syntax highlighting
 */

'use client'

import React, { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { debounce } from 'lodash'

// shadcn/ui components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable'

// Liquid glass components (mocked for development)
// In production, this would import from @developer-hub/liquid-glass
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard'

// Dynamic import for Monaco Editor (client-side only)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div data-testid="monaco-loading">Loading editor...</div>
})

// Types
type LanguageType = 'typescript' | 'css' | 'javascript'
type ThemeType = 'light' | 'dark'

export interface EffectEditorProps {
  initialCode?: string
  initialLanguage?: LanguageType
  theme?: ThemeType
  onCodeChange?: (code: string) => void
  hasErrors?: boolean
}

// Constants
const DEFAULT_CODE = '// Welcome to the Effect Editor\nconsole.log("Hello, Liquid Glass!");'
const DEBOUNCE_DELAY = 300

const MONACO_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on' as const,
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'on' as const,
  contextmenu: true,
  quickSuggestions: true,
  folding: true,
  foldingHighlight: true,
  showFoldingControls: 'always' as const,
  matchBrackets: 'always' as const,
  renderLineHighlight: 'all' as const,
  smoothScrolling: true,
  cursorBlinking: 'smooth' as const,
  cursorSmoothCaretAnimation: 'on' as const,
}

export function EffectEditor({
  initialCode = DEFAULT_CODE,
  initialLanguage = 'typescript',
  theme = 'dark',
  onCodeChange,
  hasErrors = false
}: EffectEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [activeTab, setActiveTab] = useState(initialLanguage)
  const [language, setLanguage] = useState(initialLanguage)

  // Memoized debounced code change handler
  const debouncedOnCodeChange = useMemo(
    () => debounce((newCode: string) => {
      onCodeChange?.(newCode)
    }, DEBOUNCE_DELAY),
    [onCodeChange]
  )

  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    debouncedOnCodeChange(newCode)
  }, [debouncedOnCodeChange])

  const handleTabChange = useCallback((value: string) => {
    if (value === 'typescript' || value === 'css' || value === 'javascript') {
      setActiveTab(value as LanguageType)
      setLanguage(value as LanguageType)
    }
  }, [])

  // Memoized Monaco editor theme
  const editorTheme = useMemo(() => 
    theme === 'dark' ? 'liquid-glass-dark' : 'liquid-glass-light',
    [theme]
  )

  // Memoized common Monaco options
  const monacoOptionsWithTheme = useMemo(() => ({
    ...MONACO_OPTIONS,
    theme: editorTheme,
  }), [editorTheme])

  return (
    <LiquidGlassCard
      data-testid="liquid-glass-container"
      blur={8}
      opacity={0.1}
      className="h-full w-full"
      variant="glass-medium"
    >
      <div className="h-full flex flex-col bg-gradient-to-br from-transparent to-white/5">
        <ResizablePanelGroup
          data-testid="resizable-panel-group"
          direction="horizontal"
          className="h-full"
        >
          {/* Editor Panel */}
          <ResizablePanel data-testid="resizable-panel" defaultSize={60}>
            <div className="h-full flex flex-col">
              <Tabs
                data-testid="tabs"
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList data-testid="tabs-list" className="grid w-full grid-cols-3">
                  <TabsTrigger data-testid="tab-trigger-typescript" value="typescript">
                    TypeScript
                  </TabsTrigger>
                  <TabsTrigger data-testid="tab-trigger-css" value="css">
                    CSS
                  </TabsTrigger>
                  <TabsTrigger data-testid="tab-trigger-javascript" value="javascript">
                    JavaScript
                  </TabsTrigger>
                </TabsList>

                <TabsContent data-testid="tab-content-typescript" value="typescript" className="flex-1">
                  <EditorPanel 
                    language="typescript" 
                    code={code} 
                    onChange={handleCodeChange}
                    options={monacoOptionsWithTheme}
                  />
                </TabsContent>

                <TabsContent data-testid="tab-content-css" value="css" className="flex-1">
                  <EditorPanel 
                    language="css" 
                    code={code} 
                    onChange={handleCodeChange}
                    options={monacoOptionsWithTheme}
                  />
                </TabsContent>

                <TabsContent data-testid="tab-content-javascript" value="javascript" className="flex-1">
                  <EditorPanel 
                    language="javascript" 
                    code={code} 
                    onChange={handleCodeChange}
                    options={monacoOptionsWithTheme}
                  />
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
                <div className="flex gap-2">
                  <Button data-testid="button" variant="default" size="sm">
                    Save
                  </Button>
                  <Button data-testid="button" variant="outline" size="sm">
                    Reset
                  </Button>
                  <Button data-testid="button" variant="ghost" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle data-testid="resizable-handle" />

          {/* Preview Panel */}
          <ResizablePanel data-testid="resizable-panel" defaultSize={40}>
            <div className="h-full flex flex-col">
              <Tabs defaultValue="preview" className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Live Preview</TabsTrigger>
                  <TabsTrigger value="output">Console</TabsTrigger>
                </TabsList>

                <TabsContent data-testid="tab-content-preview" value="preview" className="flex-1">
                  <div className="h-full border rounded-md bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <div className="text-lg font-medium mb-2">Live Preview</div>
                        <div className="text-sm">Effect preview will appear here</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="output" className="flex-1">
                  <div className="h-full border rounded-md bg-black/5 p-4 font-mono text-sm">
                    <div className="text-muted-foreground">
                      Console output will appear here...
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </LiquidGlassCard>
  )
}

// EditorPanel component - Enhanced implementation with accessibility and error handling
interface EditorPanelProps {
  language: LanguageType
  code: string
  onChange: (value: string | undefined) => void
  options: Record<string, any>
  className?: string
}

const EditorPanel = React.memo(function EditorPanel({ 
  language, 
  code, 
  onChange, 
  options,
  className = ""
}: EditorPanelProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleEditorDidMount = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
  }, [])

  const handleEditorChange = useCallback((value: string | undefined) => {
    try {
      onChange(value)
      setHasError(false)
    } catch (error) {
      console.error('Editor change error:', error)
      setHasError(true)
    }
  }, [onChange])

  const editorClassName = useMemo(() => 
    `h-full border rounded-md overflow-hidden ${className} ${hasError ? 'border-red-500' : 'border-border'}`.trim(),
    [className, hasError]
  )

  return (
    <div 
      className={editorClassName}
      data-testid="editor-panel"
      role="region"
      aria-label={`${language} code editor`}
      aria-live="polite"
      aria-busy={isLoading}
    >
      {hasError && (
        <div 
          className="p-2 bg-red-50 border-b border-red-200 text-red-600 text-sm"
          role="alert"
          aria-live="assertive"
        >
          Editor error detected. Please check your code syntax.
        </div>
      )}
      
      <MonacoEditor
        height={hasError ? "calc(100% - 36px)" : "100%"}
        language={language}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          ...options,
          'aria-label': `${language} code editor`,
          'aria-multiline': true,
          'aria-expanded': true,
        }}
        theme={options.theme}
        loading={
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-muted-foreground text-sm">Loading {language} editor...</div>
          </div>
        }
      />
    </div>
  )
})

export default EffectEditor