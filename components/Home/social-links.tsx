'use client'

import { useRef } from 'react'
import {
  BrainIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon
} from '@animateicons/react/lucide'
import { AtSignIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

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

export default function SocialLinks() {
  const { ref, handlers } = useIconAnimation()

  return (
    <>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="pointer-coarse:h-11"
      >
        <a href="mailto:wcgo2ling@gmail.com" {...handlers}>
          <MailIcon ref={ref} size={ICON_SIZE} aria-hidden />
          Contact
        </a>
      </Button>
      <TooltipProvider>
        {SOCIAL_LINKS.map((link) => (
          <SocialLink key={link.href} {...link} />
        ))}
      </TooltipProvider>
    </>
  )
}
