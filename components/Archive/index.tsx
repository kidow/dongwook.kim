'use client'

import { useMemo, useState } from 'react'
import { ArchiveIcon, ExternalLinkIcon, SearchIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type ArchiveCategory = 'React' | 'TypeScript' | 'CSS' | 'Utilities'

type ArchiveSnippet = {
  id: string
  title: string
  description: string
  category: ArchiveCategory
  tags: string[]
  code: string
  referenceUrl?: string
}

const SNIPPETS: ArchiveSnippet[] = [
  {
    id: 'react-debounce-input',
    title: 'Debounced Search Input',
    description:
      'use-debounce를 이용해 입력 즉시 렌더링 부담을 줄이는 패턴입니다.',
    category: 'React',
    tags: ['use-debounce', 'input', 'performance'],
    code: `const [query, setQuery] = useState('')\nconst [debouncedQuery] = useDebounce(query, 300)\n\nuseEffect(() => {\n  fetchPosts(debouncedQuery)\n}, [debouncedQuery])`
  },
  {
    id: 'ts-exhaustive-check',
    title: 'Exhaustive Switch Guard',
    description:
      '유니온 타입 분기 누락을 컴파일 단계에서 잡는 타입 안전 패턴입니다.',
    category: 'TypeScript',
    tags: ['union', 'never', 'strict'],
    code: `function assertNever(value: never): never {\n  throw new Error(\`Unexpected value: \${value}\`)\n}\n\nswitch (status) {\n  case 'idle':\n  case 'loading':\n  case 'success':\n    return status\n  default:\n    return assertNever(status)\n}`
  },
  {
    id: 'css-line-clamp',
    title: 'Multiline Clamp',
    description:
      '긴 텍스트를 2~3줄로 제한할 때 사용하는 Tailwind line-clamp 예시입니다.',
    category: 'CSS',
    tags: ['tailwind', 'line-clamp', 'ui'],
    code: `<p className="line-clamp-3 text-sm text-muted-foreground">\n  {description}\n</p>`
  },
  {
    id: 'fetch-json-safe',
    title: 'Safe JSON Fetch Wrapper',
    description:
      'API 실패 시 UI가 깨지지 않도록 fallback을 반환하는 유틸 함수입니다.',
    category: 'Utilities',
    tags: ['fetch', 'fallback', 'error-handling'],
    code: `export async function safeJson<T>(input: RequestInfo, init?: RequestInit) {\n  try {\n    const response = await fetch(input, init)\n    if (!response.ok) return null\n    return (await response.json()) as T\n  } catch {\n    return null\n  }\n}`,
    referenceUrl: 'https://developer.mozilla.org/docs/Web/API/Fetch_API'
  }
]

const CATEGORIES: Array<ArchiveCategory | 'All'> = [
  'All',
  'React',
  'TypeScript',
  'CSS',
  'Utilities'
]

export default function ArchivePage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ArchiveCategory | 'All'>('All')

  const filteredSnippets = useMemo(() => {
    return SNIPPETS.filter((snippet) => {
      const byCategory = category === 'All' || snippet.category === category
      const keyword = query.trim().toLowerCase()
      const byKeyword =
        keyword.length === 0 ||
        snippet.title.toLowerCase().includes(keyword) ||
        snippet.description.toLowerCase().includes(keyword) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(keyword))

      return byCategory && byKeyword
    })
  }, [category, query])

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <ArchiveIcon className="size-5" />
          <h1 className="text-3xl font-bold tracking-tight xl:text-4xl">
            Code Archive
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Fumadocs 연동 전까지 사용할 임시 아카이브입니다. 자주 사용하는
          스니펫을 빠르게 검색하고 확인할 수 있습니다.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="스니펫 검색"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                category === item
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:bg-muted'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-3 lg:grid-cols-2">
        {filteredSnippets.map((snippet) => (
          <li key={snippet.id}>
            <Card className="h-full border-border">
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{snippet.title}</CardTitle>
                  <Badge variant="secondary">{snippet.category}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {snippet.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[11px]">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs leading-relaxed">
                  <code>{snippet.code}</code>
                </pre>
                {snippet.referenceUrl && (
                  <a
                    href={snippet.referenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs"
                  >
                    참고 링크
                    <ExternalLinkIcon className="size-3.5" />
                  </a>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {filteredSnippets.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            조건에 맞는 스니펫이 없습니다.
          </CardContent>
        </Card>
      )}
    </section>
  )
}
