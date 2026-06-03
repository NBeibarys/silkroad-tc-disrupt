'use client'

import { cn } from '@/lib/utils'

interface LogoMarqueeProps {
  items: string[]
  reverse?: boolean
  className?: string
  itemClassName?: string
}

export function LogoMarquee({ items, reverse, className, itemClassName }: LogoMarqueeProps) {
  const doubled = [...items, ...items]
  return (
    <div className={cn('overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]', className)}>
      <div
        className={cn(
          'flex w-max gap-8 animate-marquee',
          reverse && 'animate-marquee-reverse',
        )}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={cn(
              'whitespace-nowrap px-4 py-2 text-sm font-medium',
              itemClassName,
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
