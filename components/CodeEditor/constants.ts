import type { CodePreset, SupportedTemplate, TemplateConfig } from './types'

export const DEFAULT_TEMPLATE: SupportedTemplate = 'vanilla'

export const SUPPORTED_TEMPLATES: TemplateConfig[] = [
  {
    id: 'vanilla',
    label: 'JavaScript',
    entryFile: '/index.js',
    defaultCode: 'console.log("Hello, World!")\n'
  },
  {
    id: 'vanilla-ts',
    label: 'TypeScript',
    entryFile: '/index.ts',
    defaultCode: [
      'const greeting: string = "Hello, TypeScript!"',
      'console.log(greeting)',
      ''
    ].join('\n')
  },
  {
    id: 'react',
    label: 'React (JSX)',
    entryFile: '/App.js',
    defaultCode: [
      'export default function App() {',
      '  return <h1>Hello, React!</h1>',
      '}',
      ''
    ].join('\n')
  },
  {
    id: 'react-ts',
    label: 'React (TSX)',
    entryFile: '/App.tsx',
    defaultCode: [
      'export default function App() {',
      '  return <h1>Hello, React + TypeScript!</h1>',
      '}',
      ''
    ].join('\n')
  }
]

export const CODE_PRESETS: CodePreset[] = [
  {
    id: 'hello-js',
    label: 'Hello World',
    template: 'vanilla',
    code: 'console.log("Hello, World!")\n',
    description: '기본 JavaScript 예제'
  },
  {
    id: 'fetch-api',
    label: 'Fetch API',
    template: 'vanilla',
    code: [
      'const res = await fetch(',
      '  "https://jsonplaceholder.typicode.com/todos/1"',
      ')',
      'const data = await res.json()',
      'console.log(data)',
      ''
    ].join('\n'),
    description: 'Fetch API로 데이터 가져오기'
  },
  {
    id: 'ts-generics',
    label: 'TypeScript Generics',
    template: 'vanilla-ts',
    code: [
      'function identity<T>(arg: T): T {',
      '  return arg',
      '}',
      '',
      'console.log(identity<string>("hello"))',
      'console.log(identity<number>(42))',
      ''
    ].join('\n'),
    description: 'TypeScript 제네릭 예제'
  },
  {
    id: 'react-counter',
    label: 'React Counter',
    template: 'react',
    code: [
      'import { useState } from "react"',
      '',
      'export default function App() {',
      '  const [count, setCount] = useState(0)',
      '  return (',
      '    <div style={{ padding: 20 }}>',
      '      <p>Count: {count}</p>',
      '      <button onClick={() => setCount((c) => c + 1)}>',
      '        Increment',
      '      </button>',
      '    </div>',
      '  )',
      '}',
      ''
    ].join('\n'),
    description: 'React 상태 관리 예제'
  }
]
