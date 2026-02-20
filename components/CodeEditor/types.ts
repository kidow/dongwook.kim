/** Supported Sandpack template identifiers */
export type SupportedTemplate = 'vanilla' | 'vanilla-ts' | 'react' | 'react-ts'

/** Editor theme setting */
export type EditorTheme = 'light' | 'dark'

/** Template configuration for the language selector */
export interface TemplateConfig {
  id: SupportedTemplate
  label: string
  /** Main entry file path within the Sandpack file system */
  entryFile: string
  /** Default code content for this template */
  defaultCode: string
}

/** Code preset (example snippet) */
export interface CodePreset {
  id: string
  label: string
  template: SupportedTemplate
  code: string
  description: string
}

/** Serializable state for URL sharing */
export interface ShareableState {
  template: SupportedTemplate
  code: string
}
