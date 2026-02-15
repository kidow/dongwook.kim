import { memo } from 'react'

import { Button } from '@/components/ui/button'

function Footer() {
  return (
    <footer
      role="contentinfo"
      className="duration-400 fixed bottom-[52px] left-16 hidden select-none rounded-[12px] bg-white p-2 text-sm text-muted-foreground transition-colors delay-500 [view-transition-name:footer] xl:block"
    >
      <p>
        This project inspired by{' '}
        <Button variant="link" size="xs" className="h-auto p-0 text-sm text-muted-foreground" asChild>
          <a
            href="https://bento.me/?ref=dongwook.kim"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bento.me
          </a>
        </Button>
        .
      </p>
    </footer>
  )
}

export default memo(Footer)
