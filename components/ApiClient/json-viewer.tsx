interface JsonViewerProps {
  data: unknown
  depth?: number
}

function JsonValue({ data, depth = 0 }: JsonViewerProps) {
  const indent = '  '.repeat(depth)
  const childIndent = '  '.repeat(depth + 1)

  if (data === null) {
    return <span className="text-red-600">null</span>
  }

  if (typeof data === 'boolean') {
    return <span className="text-purple-600">{String(data)}</span>
  }

  if (typeof data === 'number') {
    return <span className="text-blue-600">{data}</span>
  }

  if (typeof data === 'string') {
    return <span className="text-green-700">&quot;{data}&quot;</span>
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span>{'[]'}</span>
    return (
      <>
        {'[\n'}
        {data.map((item, i) => (
          <span key={i}>
            {childIndent}
            <JsonValue data={item} depth={depth + 1} />
            {i < data.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {indent}
        {']'}
      </>
    )
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>)
    if (entries.length === 0) return <span>{'{}'}</span>
    return (
      <>
        {'{\n'}
        {entries.map(([key, val], i) => (
          <span key={key}>
            {childIndent}
            <span className="font-semibold text-foreground">
              &quot;{key}&quot;
            </span>
            {': '}
            <JsonValue data={val} depth={depth + 1} />
            {i < entries.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {indent}
        {'}'}
      </>
    )
  }

  return <span>{String(data)}</span>
}

export default function JsonViewer({ data }: { data: unknown }) {
  return (
    <pre className="overflow-auto rounded-lg bg-muted/50 p-4 font-mono text-sm">
      <JsonValue data={data} />
    </pre>
  )
}
