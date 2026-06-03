'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Slide { src: string; alt: string }

interface GalleryCarouselProps {
  slides: Slide[]
  heightClass?: string
  className?: string
}

export function GalleryCarousel({ slides, heightClass = 'h-[400px] md:h-[600px]', className }: GalleryCarouselProps) {
  const [current, setCurrent] = useState(0)
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  const prev = () => setCurrent(i => (i - 1 + slides.length) % slides.length)
  const next = () => setCurrent(i => (i + 1) % slides.length)

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart.current === null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStart.current = null
  }

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl shadow-2xl', heightClass, className)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((s, i) => {
        const active = i === current
        const adjacent = i === (current + 1) % slides.length || i === (current - 1 + slides.length) % slides.length
        return (
          <div
            key={i}
            className={cn(
              'absolute inset-0 transition-opacity duration-700 will-change-[opacity]',
              active ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
          >
            {(active || adjacent) && (
              <Image src={s.src} alt={s.alt} fill className="object-cover" unoptimized priority={active} />
            )}
          </div>
        )
      })}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Next"
      >
        ›
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn('w-2 h-2 rounded-full transition-all cursor-pointer', i === current ? 'bg-white w-6' : 'bg-white/50')}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
