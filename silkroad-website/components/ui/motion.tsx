'use client'

import { useRef, useEffect, useState, useMemo, type ReactNode, type ElementType } from 'react'
import {
  motion, useScroll, useTransform, useSpring, useMotionValue,
  useReducedMotion, useAnimationFrame, type MotionValue,
} from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/* ────────────────────────────────────────────────────────────
   SMOOTH SCROLL — Lenis provider. Wrap each page root.
   ──────────────────────────────────────────────────────────── */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const lenisRef = useRef<{ raf: (t: number) => void; destroy: () => void } | null>(null)

  // Drive Lenis through framer-motion's RAF so both share the same tick order
  useAnimationFrame((time) => {
    lenisRef.current?.raf(time)
  })

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (reduce || isTouch) return
    let active = true
    import('lenis').then(({ default: Lenis }) => {
      if (!active) return
      lenisRef.current = new Lenis({ lerp: 0.12, smoothWheel: true })
    })
    return () => {
      active = false
      lenisRef.current?.destroy()
      lenisRef.current = null
    }
  }, [reduce])

  return <>{children}</>
}

/* ────────────────────────────────────────────────────────────
   ANIMATED HEADING — word-by-word reveal with rotateX lift.
   `text` may contain \n for hard line breaks.
   ──────────────────────────────────────────────────────────── */
interface HeadingProps {
  text: string
  className?: string
  as?: ElementType
  delay?: number
  highlight?: string[]        // words rendered in accent color
  accentClass?: string
}
export function AnimatedHeading({
  text, className, as = 'h2', delay = 0, highlight = [], accentClass = '',
}: HeadingProps) {
  const reduce = useReducedMotion()
  const Tag = useMemo(() => motion(as as ElementType), [as])
  const lines = text.split('\n')
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-8% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: delay } } }}
    >
      {lines.map((line, li) => (
        <motion.span
          key={li}
          className="block"
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : 18 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
          }}
        >
          {line.split(' ').map((word, wi) => {
            const clean = word.replace(/[.,!?]/g, '')
            const isHi = highlight.includes(clean)
            return (
              <span key={wi}>
                <span className={cn(isHi && accentClass)}>{word}</span>
                {' '}
              </span>
            )
          })}
        </motion.span>
      ))}
    </Tag>
  )
}

/* ────────────────────────────────────────────────────────────
   REVEAL — CSS-driven scroll-in. Zero JS per animation frame.
   ──────────────────────────────────────────────────────────── */
export function Reveal({
  children, className, delay = 0, blur = false, style,
}: { children: ReactNode; className?: string; delay?: number; y?: number; blur?: boolean; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.style.animationDelay = delay ? `${delay}s` : ''
        el.classList.add(blur ? 'reveal-animate-blur' : 'reveal-animate')
        obs.disconnect()
      },
      { rootMargin: '-70px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay, blur])
  return (
    <div ref={ref} className={cn('reveal-base', className)} style={style}>
      {children}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   PARALLAX IMAGE — image drifts within a clipped frame on scroll.
   Touch/reduced-motion: static image, zero scroll listeners.
   ──────────────────────────────────────────────────────────── */
function ParallaxImageAnimated({
  src, alt, className, imgClassName, amount, priority, zoom,
}: {
  src: string; alt: string; className?: string; imgClassName?: string
  amount: number; priority: boolean; zoom: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount])
  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div style={{ y, willChange: 'transform' }} className={cn('absolute inset-0', zoom && 'scale-[1.18]')}>
        <Image src={src} alt={alt} fill className={cn('object-cover', imgClassName)} unoptimized priority={priority} />
      </motion.div>
    </div>
  )
}

export function ParallaxImage({
  src, alt, className, imgClassName, amount = 80, priority = false, zoom = true,
}: {
  src: string; alt: string; className?: string; imgClassName?: string
  amount?: number; priority?: boolean; zoom?: boolean
}) {
  const reduce = useReducedMotion()
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches)
  }, [])
  if (reduce || isTouch) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <Image src={src} alt={alt} fill className={cn('object-cover', imgClassName)} unoptimized priority={priority} />
      </div>
    )
  }
  return <ParallaxImageAnimated src={src} alt={alt} className={className} imgClassName={imgClassName} amount={amount} priority={priority} zoom={zoom} />
}

/* ────────────────────────────────────────────────────────────
   PARALLAX — translate any child on scroll.
   ──────────────────────────────────────────────────────────── */
export function Parallax({ children, amount = 60, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [amount, -amount])
  return <motion.div ref={ref} style={{ y, willChange: 'transform' }} className={className}>{children}</motion.div>
}

/* ────────────────────────────────────────────────────────────
   MAGNETIC — element pulls toward cursor; for CTA buttons.
   ──────────────────────────────────────────────────────────── */
export function Magnetic({ children, className, strength = 0.35 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 250, damping: 18 })
  const y = useSpring(my, { stiffness: 250, damping: 18 })
  function move(e: React.MouseEvent) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  function leave() { mx.set(0); my.set(0) }
  return (
    <motion.div ref={ref} onMouseMove={move} onMouseLeave={leave} style={{ x, y }} className={cn('inline-block', className)}>
      {children}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   TILT CARD — 3D tilt toward cursor with sheen.
   ──────────────────────────────────────────────────────────── */
export function Tilt({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 16 })
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 16 })
  function move(e: React.MouseEvent) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max)
    rx.set(-py * max)
  }
  function leave() { rx.set(0); ry.set(0) }
  return (
    <motion.div
      ref={ref} onMouseMove={move} onMouseLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      className={cn('[perspective:900px]', className)}
    >
      {children}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR — top-of-page accent line.
   ──────────────────────────────────────────────────────────── */
export function ScrollProgress({ color = '#09A43E' }: { color?: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 })
  return <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60]" style={{ scaleX, backgroundColor: color, willChange: 'transform' }} />
}

/* ────────────────────────────────────────────────────────────
   COUNT-UP — number animates when scrolled into view.
   ──────────────────────────────────────────────────────────── */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) { setN(value); return }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const dur = 1400, t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setN(Math.round(value * eased))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, reduce])
  return <span ref={ref} className={className}>{n}</span>
}

/* ────────────────────────────────────────────────────────────
   CUSTOM CURSOR — green dot, expands on hover, desktop only.
   ──────────────────────────────────────────────────────────── */
export function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 400, damping: 28 })
  const sy = useSpring(y, { stiffness: 400, damping: 28 })
  const scale = useMotionValue(1)
  const ss = useSpring(scale, { stiffness: 300, damping: 20 })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    const enter = (e: MouseEvent) => {
      const t = e.target as Element
      if (t.closest('a,button,[role="button"]')) scale.set(2.8)
    }
    const leave = () => scale.set(1)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', enter)
    window.addEventListener('mouseout', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', enter)
      window.removeEventListener('mouseout', leave)
    }
  }, [x, y, scale, reduce])

  if (reduce) return null
  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%', willChange: 'transform' }}
    >
      <motion.div className="w-4 h-4 rounded-full bg-[#09A43E]" style={{ scale: ss }} />
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────
   HORIZONTAL SCROLL GALLERY — scroll-driven horizontal drift.
   ──────────────────────────────────────────────────────────── */
export function HorizontalScrollGallery({ slides }: { slides: { src: string; alt: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['4%', `-${slides.length * 14}%`])
  return (
    <div ref={ref} className="relative h-[75vh] flex items-center overflow-hidden">
      <motion.div style={{ x }} className="flex gap-5 absolute will-change-transform">
        {slides.map((s, i) => (
          <div key={i} className="relative shrink-0 h-[55vh] w-[42vw] md:w-[30vw] rounded-2xl overflow-hidden shadow-xl">
            <Image src={s.src} alt={s.alt} fill className="object-cover" unoptimized />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   PARTICIPANT MARQUEE — dual-row scrolling company names.
   ──────────────────────────────────────────────────────────── */
export function ParticipantMarquee({ row1, row2, accent = '#09A43E' }: {
  row1: string[]; row2: string[]; accent?: string
}) {
  const items1 = [...row1, ...row1]
  const items2 = [...row2, ...row2]
  return (
    <div className="space-y-3 overflow-hidden select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {items1.map((name, i) => (
          <span key={i} className="flex items-center gap-4 px-5 text-lg md:text-xl font-semibold">
            {name}
            <span style={{ color: accent }} className="text-sm">✦</span>
          </span>
        ))}
      </div>
      <div className="flex animate-marquee-reverse whitespace-nowrap">
        {items2.map((name, i) => (
          <span key={i} className="flex items-center gap-4 px-5 text-lg md:text-xl font-semibold opacity-60">
            {name}
            <span style={{ color: accent }} className="text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* parallax helper for spring values consumed elsewhere */
export type { MotionValue }
