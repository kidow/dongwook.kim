'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export interface SwimSession {
  date: string
  distance: number
}

interface SwimmingChartProps {
  sessions: SwimSession[]
}

// Chart box in percent of the stage: the water line sits between these.
const TOP = 30
const BOTTOM = 16
const SIDE = 6
const LABEL_EVERY = 3
// Half the swimmer's width plus its drift, so it never clips at the edges.
const SWIMMER_INSET_PX = 100
const TOOLTIP_INSET_PX = 64

/** Smooth path through points (Catmull-Rom converted to cubic Bezier). */
function smoothPath(points: [number, number][]) {
  let d = `M${points[0][0]},${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`
  }
  return d
}

const insetLeft = (percent: number, inset: number) =>
  `clamp(${inset}px, ${percent}%, calc(100% - ${inset}px))`

const shortDate = (date: string) => date.slice(5).replace('-', '.')

const longDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

export default function SwimmingChart({ sessions }: SwimmingChartProps) {
  const reduceMotion = useReducedMotion()
  const lastIndex = sessions.length - 1
  const [active, setActive] = useState(lastIndex)
  const [hovering, setHovering] = useState(false)

  const max = Math.max(...sessions.map((s) => s.distance), 1)
  const step = (100 - SIDE * 2) / Math.max(lastIndex, 1)
  const points = sessions.map((s, i): [number, number] => [
    SIDE + i * step,
    TOP + (1 - s.distance / max) * (100 - TOP - BOTTOM)
  ])
  const line = smoothPath(points)
  // Water fills the whole width, flat from the edges to the first/last swim.
  const water = `M0,${points[0][1]} L${line.slice(1)} L100,${points[lastIndex][1]} L100,100 L0,100 Z`

  const [x, y] = points[active]
  const session = sessions[active]

  return (
    <div
      className="relative h-[220px] overflow-hidden rounded-2xl border border-border bg-[#0c0c0f]"
      onPointerLeave={() => {
        setActive(lastIndex)
        setHovering(false)
      }}
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <defs>
          <linearGradient id="swim-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b82f6" stopOpacity=".55" />
            <stop offset="1" stopColor="#1d4ed8" stopOpacity=".08" />
          </linearGradient>
        </defs>
        <path d={water} fill="url(#swim-water)" />
        <path
          d={line}
          fill="none"
          stroke="#60a5fa"
          strokeWidth={2.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <Swimmer x={x} y={y} reduceMotion={Boolean(reduceMotion)} />

      <div
        aria-hidden
        className="pointer-events-none absolute top-3 z-20 -translate-x-1/2 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs tabular-nums transition-[left,opacity] duration-300"
        style={{
          left: insetLeft(x, TOOLTIP_INSET_PX),
          opacity: hovering ? 1 : 0
        }}
      >
        <span className="font-medium">
          {session.distance.toLocaleString('en-US')} m
        </span>
        <span className="ml-1.5 text-muted-foreground">
          {longDate(session.date)}
        </span>
      </div>

      <ul className="absolute inset-0 z-10">
        {sessions.map((s, i) => (
          <li key={s.date}>
            <button
              type="button"
              aria-label={`${s.distance.toLocaleString('en-US')} meters on ${longDate(s.date)}`}
              className="group absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none"
              style={{ left: `${points[i][0]}%`, top: `${points[i][1]}%` }}
              onPointerEnter={() => {
                setActive(i)
                setHovering(true)
              }}
              onFocus={() => {
                setActive(i)
                setHovering(true)
              }}
              onBlur={() => setHovering(false)}
            >
              <span
                className={`absolute inset-1.5 rounded-full border-2 border-background bg-[#60a5fa] transition-opacity group-focus-visible:opacity-100 ${hovering && active === i ? 'opacity-100' : 'opacity-0'}`}
              />
            </button>
          </li>
        ))}
      </ul>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-2 h-3.5 text-[11px] tabular-nums text-muted-foreground"
      >
        {points.map(([px], i) =>
          (lastIndex - i) % LABEL_EVERY === 0 ? (
            <span
              key={sessions[i].date}
              className="absolute -translate-x-1/2"
              style={{ left: `${px}%` }}
            >
              {shortDate(sessions[i].date)}
            </span>
          ) : null
        )}
      </div>
    </div>
  )
}

interface SwimmerProps {
  x: number
  y: number
  reduceMotion: boolean
}

/** The old Swimming Diary Lottie, swimming on the water line. */
function Swimmer({ x, y, reduceMotion }: SwimmerProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let destroy: (() => void) | undefined

    // Light SVG-only player, loaded after hydration so it stays out of the
    // initial bundle. The animation JSON is fetched from /public.
    import('lottie-web/build/player/lottie_light').then(
      ({ default: lottie }) => {
        if (cancelled || !container.current) return
        const animation = lottie.loadAnimation({
          container: container.current,
          renderer: 'svg',
          loop: true,
          autoplay: !reduceMotion,
          path: '/swimmer.json'
        })
        destroy = () => animation.destroy()
      }
    )

    return () => {
      cancelled = true
      destroy?.()
    }
  }, [reduceMotion])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-[5] -ml-[90px] -mt-[104px] size-[180px] drop-shadow-[0_8px_18px_rgb(37_99_235/0.25)] transition-[left,top] duration-500 ease-out"
      style={{ left: insetLeft(x, SWIMMER_INSET_PX), top: `${y}%` }}
    >
      <motion.div
        ref={container}
        className="size-full"
        animate={
          reduceMotion
            ? undefined
            : { x: [14, -12, 14], y: [3, -4, 3], scale: [1, 1.02, 1] }
        }
        transition={{ duration: 5.6, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
  )
}
