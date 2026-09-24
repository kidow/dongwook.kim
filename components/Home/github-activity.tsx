'use client'

// Ported from https://github.com/senorhitesh/hiteshdev.com
// (components/ui/github-activity.tsx) — grid only, data comes from the server.
import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface Contribution {
  date: string
  count: number
  level: ContributionLevel
}

const DEFAULT_ACCENT = '#39d353'
const DEFAULT_CELL_SIZE = 11
const DEFAULT_MONTHS = 12
const WEEKS_PER_MONTH = 365.25 / 12 / 7
const MIN_CARD_WIDTH = 320
const MIN_LABEL_WEEKS = 3
const CARD_PADDING = 32

const gapFor = (cellSize: number) => Math.max(2, Math.round(cellSize / 4))
// never zero: weeks.slice(-0) would hand back the whole history instead of nothing
const weeksFor = (months: number) =>
  Math.max(1, Math.ceil(months * WEEKS_PER_MONTH))

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const CELL_FADE = { duration: 0.2, ease: EASE_OUT } as const
const TOOLTIP_FADE = { duration: 0.14, ease: EASE_OUT } as const
const TOOLTIP_EDGE = 8
const COLUMN_STAGGER = 0.012
const LABEL_BLUR = 6
const LABEL_REVEAL = { duration: 0.45, ease: EASE_OUT } as const

const LEVELS = [0, 1, 2, 3, 4] as const

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const LEVEL_OPACITY: Record<ContributionLevel, number> = {
  0: 0,
  1: 0.3,
  2: 0.52,
  3: 0.76,
  4: 1
}

type LevelStyle = { backgroundColor: string; opacity: number }

type HoveredDay = { day: Contribution; x: number; y: number }

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

function describeDay({ count, date }: Contribution) {
  const noun = count === 1 ? 'contribution' : 'contributions'
  return `${count} ${noun} on ${DATE_FORMAT.format(new Date(`${date}T00:00:00`))}`
}

function toMonthLabels(weeks: Contribution[][]) {
  const labels: (string | null)[] = weeks.map(() => null)
  const monthAt = (index: number) => weeks[index]?.[0]?.date.slice(5, 7)

  let start = 0
  for (let i = 1; i <= weeks.length; i++) {
    if (i < weeks.length && monthAt(i) === monthAt(start)) continue
    // a shorter run is narrower than the label itself, so it would sit under the next month
    if (i - start >= MIN_LABEL_WEEKS) {
      labels[start] = MONTH_NAMES[Number(monthAt(start)) - 1] ?? null
    }
    start = i
  }

  return labels
}

function toScale(accent: string | string[]): LevelStyle[] {
  if (typeof accent === 'string') {
    return LEVELS.map((level) => ({
      backgroundColor: accent,
      opacity: LEVEL_OPACITY[level]
    }))
  }

  const colors = accent.length > 4 ? accent : ['transparent', ...accent]
  return LEVELS.map((level) => {
    const color = colors[level] ?? colors.at(-1) ?? 'transparent'
    return { backgroundColor: color, opacity: color === 'transparent' ? 0 : 1 }
  })
}

function toWeeks(contributions: Contribution[]) {
  const weeks: Contribution[][] = []
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7))
  }
  return weeks
}

function useFittedColumns(cellSize: number, gap: number) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [columns, setColumns] = React.useState<number>()

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () =>
      setColumns(
        Math.max(1, Math.floor((el.clientWidth + gap) / (cellSize + gap)))
      )

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [cellSize, gap])

  return [ref, columns] as const
}

function Tooltip({
  hovered,
  reduceMotion
}: {
  hovered: HoveredDay
  reduceMotion: boolean | null
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [left, setLeft] = React.useState(hovered.x)

  useIsoLayoutEffect(() => {
    const half = (ref.current?.offsetWidth ?? 0) / 2
    const edge = TOOLTIP_EDGE + half
    setLeft(Math.min(Math.max(hovered.x, edge), window.innerWidth - edge))
  }, [hovered])

  return createPortal(
    <div
      className="pointer-events-none fixed z-50"
      style={{
        left,
        top: hovered.y,
        transform: 'translate(-50%, calc(-100% - 8px))'
      }}
    >
      <motion.div
        ref={ref}
        className="whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
        transition={reduceMotion ? { duration: 0 } : TOOLTIP_FADE}
      >
        {describeDay(hovered.day)}
      </motion.div>
    </div>,
    document.body
  )
}

interface ContributionGridProps {
  contributions: Contribution[]
  scale: LevelStyle[]
  cellSize: number
  months: number
  showMonths: boolean
  label: string
  reduceMotion: boolean | null
}

function ContributionGrid({
  contributions,
  scale,
  cellSize,
  months,
  showMonths,
  label,
  reduceMotion
}: ContributionGridProps) {
  const weeks = React.useMemo(() => toWeeks(contributions), [contributions])
  const gap = gapFor(cellSize)
  const [ref, columns] = useFittedColumns(cellSize, gap)
  const [hovered, setHovered] = React.useState<HoveredDay>()

  const cap = Math.min(weeks.length, weeksFor(months))
  const visible = weeks.slice(-Math.min(cap, columns ?? cap))
  const sweepEnd = (visible.length - 1) * COLUMN_STAGGER + CELL_FADE.duration

  const hover = (day: Contribution) => (event: React.PointerEvent) => {
    const cell = event.currentTarget.getBoundingClientRect()
    setHovered({ day, x: cell.left + cell.width / 2, y: cell.top })
  }

  return (
    <div ref={ref} role="img" aria-label={label} className="relative">
      {showMonths && (
        <motion.div
          className="flex justify-center"
          style={{ gap, marginBottom: gap }}
          initial={
            reduceMotion
              ? false
              : { opacity: 0, filter: `blur(${LABEL_BLUR}px)` }
          }
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ ...LABEL_REVEAL, delay: reduceMotion ? 0 : sweepEnd }}
        >
          {toMonthLabels(visible).map((month, index) => (
            <div
              key={index}
              className="relative h-3 shrink-0"
              style={{ width: cellSize }}
            >
              {month && (
                <span className="absolute left-0 top-0 text-[10px] leading-none text-muted-foreground">
                  {month}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      )}

      <div
        className="flex justify-center overflow-hidden"
        style={{ gap }}
        onPointerLeave={() => setHovered(undefined)}
      >
        {visible.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col" style={{ gap }}>
            {week.map((day) => (
              <motion.div
                key={day.date}
                onPointerEnter={hover(day)}
                className="shrink-0 rounded-[3px] bg-foreground/[0.08]"
                style={{ width: cellSize, height: cellSize }}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  ...CELL_FADE,
                  delay: reduceMotion ? 0 : weekIndex * COLUMN_STAGGER
                }}
              >
                <div
                  className="h-full w-full rounded-[3px]"
                  style={scale[day.level] ?? scale[0]}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {hovered && (
          <Tooltip
            key="tooltip"
            hovered={hovered}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

interface Props {
  contributions: Contribution[]
  accent?: string | string[]
  cellSize?: number
  months?: number
  showMonths?: boolean
  className?: string
}

export default function GithubActivity({
  contributions,
  accent = DEFAULT_ACCENT,
  cellSize = DEFAULT_CELL_SIZE,
  months = DEFAULT_MONTHS,
  showMonths = false,
  className
}: Props) {
  const reduceMotion = useReducedMotion()
  const scale = React.useMemo(() => toScale(accent), [accent])

  const total = React.useMemo(
    () => contributions.reduce((sum, day) => sum + day.count, 0),
    [contributions]
  )
  const year = contributions.at(-1)?.date.slice(0, 4)
  const heading = `${total} contributions${year ? ` in ${year}` : ''}`

  const gap = gapFor(cellSize)
  const columns = Math.min(
    Math.ceil(contributions.length / 7),
    weeksFor(months)
  )
  const width = Math.max(
    MIN_CARD_WIDTH,
    columns * (cellSize + gap) - gap + CARD_PADDING
  )

  return (
    <div className={cn('relative max-w-full', className)} style={{ width }}>
      <ContributionGrid
        contributions={contributions}
        scale={scale}
        cellSize={cellSize}
        months={months}
        showMonths={showMonths}
        label={heading}
        reduceMotion={reduceMotion}
      />
    </div>
  )
}
