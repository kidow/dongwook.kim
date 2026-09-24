'use client'

import { useEffect, useRef, useState } from 'react'
import {
  BrainIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon
} from '@animateicons/react/lucide'
import { AtSignIcon, CheckIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import type {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react'

interface IconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

type AnimatedIcon = ForwardRefExoticComponent<
  { size?: number; 'aria-hidden'?: boolean } & RefAttributes<IconHandle>
>

const ICON_SIZE = 16

// ponytail: animateicons has no Threads/AtSign glyph; swap in if it lands
function ThreadsIcon() {
  return (
    <AtSignIcon
      aria-hidden
      className="size-4 transition-transform duration-500 ease-out group-hover:rotate-[360deg] group-focus-visible:rotate-[360deg] motion-reduce:transition-none"
    />
  )
}

const SOCIAL_LINKS: {
  href: string
  label: string
  icon: AnimatedIcon | ComponentType
}[] = [
  { href: 'https://github.com/kidow', label: 'GitHub', icon: GithubIcon },
  {
    href: 'https://www.linkedin.com/in/kidow/',
    label: 'LinkedIn',
    icon: LinkedinIcon
  },
  {
    href: 'https://www.instagram.com/__kidow__/',
    label: 'Instagram',
    icon: InstagramIcon
  },
  {
    href: 'https://www.threads.com/@__kidow__',
    label: 'Threads',
    icon: ThreadsIcon
  },
  { href: 'https://brain.dongwook.kim', label: 'Brain', icon: BrainIcon }
]

function isAnimated(icon: AnimatedIcon | ComponentType): icon is AnimatedIcon {
  return icon !== ThreadsIcon
}

/** Starts the icon animation while the surrounding control is hovered or focused. */
function useIconAnimation() {
  const ref = useRef<IconHandle>(null)
  const start = () => ref.current?.startAnimation()
  const stop = () => ref.current?.stopAnimation()
  return {
    ref,
    handlers: {
      onMouseEnter: start,
      onMouseLeave: stop,
      onFocus: start,
      onBlur: stop
    }
  }
}

function SocialLink({
  href,
  label,
  icon: Icon
}: (typeof SOCIAL_LINKS)[number]) {
  const { ref, handlers } = useIconAnimation()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          variant="outline"
          size="icon-sm"
          className="group pointer-coarse:size-11"
        >
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            {...handlers}
          >
            {isAnimated(Icon) ? (
              <Icon ref={ref} size={ICON_SIZE} aria-hidden />
            ) : (
              <Icon />
            )}
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={4}>{label}</TooltipContent>
    </Tooltip>
  )
}

const EMAIL = 'wcgo2ling@gmail.com'
const COPIED_MS = 1600
const SWAP =
  'transition-[translate,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

/** Copies the email address and briefly swaps the label to "Copied". */
function ContactButton() {
  const { ref, handlers } = useIconAnimation()
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      // Clipboard blocked (e.g. insecure context): fall back to the mail app.
      window.location.href = `mailto:${EMAIL}`
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_MS)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          'relative overflow-hidden pointer-coarse:h-11',
          copied && 'border-green-400/40'
        )}
        aria-label={`Contact: copy email address ${EMAIL}`}
        onClick={copy}
        {...handlers}
      >
        <span
          className={cn(
            'inline-flex items-center gap-1.5',
            SWAP,
            copied && '-translate-y-full opacity-0'
          )}
        >
          <MailIcon ref={ref} size={ICON_SIZE} aria-hidden />
          Contact
        </span>
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 flex items-center justify-center gap-1.5 text-green-400',
            SWAP,
            copied ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          )}
        >
          <CheckIcon className="size-4" />
          Copied
        </span>
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Email address copied' : ''}
      </span>
    </>
  )
}

export default function SocialLinks() {
  return (
    <>
      <ContactButton />
      <TooltipProvider>
        {SOCIAL_LINKS.map((link) => (
          <SocialLink key={link.href} {...link} />
        ))}
      </TooltipProvider>
    </>
  )
}
