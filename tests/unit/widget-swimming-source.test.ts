/**
 * @jest-environment node
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('components/Widget/widget-swimming.tsx', () => {
  it('loads the latest swim sessions in a server component and renders them in the client chart', () => {
    const serverSource = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-swimming.tsx'),
      'utf8'
    )
    const clientSource = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-swimming-client.tsx'),
      'utf8'
    )
    const styleSource = readFileSync(
      path.join(process.cwd(), 'components/Widget/widget-swimming.module.css'),
      'utf8'
    )
    const swimmerAnimation = readFileSync(
      path.join(process.cwd(), 'public/swimmer.json'),
      'utf8'
    )

    expect(serverSource).not.toContain("'use client'")
    expect(serverSource).toContain('createSupabaseServiceRoleClient')
    expect(serverSource).toContain("import { unstable_cache } from 'next/cache'")
    expect(serverSource).toContain("from('swim_sessions')")
    expect(serverSource).toContain(".order('date', { ascending: false })")
    expect(serverSource).toContain('.limit(7)')
    expect(serverSource).toContain('unstable_cache(')
    expect(serverSource).toContain("['widget-swimming-sessions']")
    expect(serverSource).toContain('revalidate: 86400')
    expect(serverSource).toContain('WidgetSwimmingClient')
    expect(serverSource).toContain('async function WidgetSwimming()')
    expect(serverSource).toContain('return <WidgetSwimmingClient sessions={sessions} />')
    expect(serverSource).toContain('sessions.slice().reverse()')
    expect(clientSource).toContain("'use client'")
    expect(clientSource).toContain('LineChart')
    expect(clientSource).toContain("color: '#0284c7'")
    expect(clientSource).toContain("label: 'Distance (m)'")
    expect(clientSource).toContain('aria-hidden="true"')
    expect(clientSource).toContain('styles.waveSvg')
    expect(clientSource).toContain('group/widget-swimming')
    expect(clientSource).toContain('data-swimming-layer="chart"')
    expect(clientSource).toContain('data-swimming-layer="swimmer"')
    expect(clientSource).toContain('data-swimming-layer="wave"')
    expect(clientSource).toContain("import Lottie from 'lottie-react'")
    expect(clientSource).toContain("import swimmerAnimation from '@/public/swimmer.json'")
    expect(clientSource).toContain('animationData={swimmerAnimation}')
    expect(clientSource).toContain('styles.swimmerLottie')
    expect(clientSource).toContain('opacity-70')
    expect(clientSource).toContain('duration-300')
    expect(clientSource).toContain('group-hover/widget-swimming:opacity-100')
    expect(clientSource).toContain('group-hover/widget-swimming:opacity-70')
    expect(clientSource).toContain('group-hover/widget-swimming:z-20')
    expect(clientSource).toContain('dataKey="date"')
    expect(clientSource).toContain('padding={{ left: 18, right: 8 }}')
    expect(clientSource).toContain('{distance.toLocaleString()} m')
    expect(styleSource).toContain('pathAnim')
    expect(styleSource).toContain('lottieDrift')
    expect(styleSource).toContain('.swimmerLottie')
    expect(styleSource).not.toContain('animation-direction: reverse')
    expect(styleSource).toContain('animation-delay: 1s')
    expect(styleSource).not.toContain('animation-play-state: paused')
    expect(swimmerAnimation).toContain('"layers"')
  })
})
