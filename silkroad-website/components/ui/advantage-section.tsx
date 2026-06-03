'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { ADVANTAGES } from '@/lib/data'

const EASE = [0.16, 1, 0.3, 1] as const

const GREEN_STEPS  = ['#09A43E', '#0aaf44', '#0bbf4a', '#0dd452']
const GLOW_STEPS   = [
  'rgba(9,164,62,0.12)', 'rgba(9,164,62,0.18)',
  'rgba(9,164,62,0.24)', 'rgba(9,164,62,0.36)',
]
const SCALE_STEPS  = [1.0, 1.01, 1.02, 1.03]

/* ── single advantage row ── */
function AdvantageItem({
  title, description, index, totalCount,
  onActive, onInactive, hasActiveItem,
}: {
  title: string; description: string
  index: number; totalCount: number
  onActive: (i: number) => void
  onInactive: (i: number) => void
  hasActiveItem: boolean
}) {
  const ref       = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [active,  setActive]  = useState(false)
  const [pulsed,  setPulsed]  = useState(false)
  const [drawn,   setDrawn]   = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // slide-in — fires once
    const slideObs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setTimeout(() => setVisible(true), index * 100)
      slideObs.disconnect()
    }, { rootMargin: '-40px' })

    // active zone — center 36 % of viewport
    const activeObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setActive(true)
        onActive(index)
        setPulsed(true)
        setTimeout(() => setPulsed(false), 500)
        if (index < totalCount - 1)
          setTimeout(() => setDrawn(true), 500)
      } else {
        setActive(false)
        onInactive(index)
      }
    }, { rootMargin: '-32% 0px -32% 0px' })

    slideObs.observe(el)
    activeObs.observe(el)
    return () => { slideObs.disconnect(); activeObs.disconnect() }
  }, [index, totalCount, onActive, onInactive])

  const targetOpacity = !visible ? 0 : hasActiveItem ? (active ? 1 : 0.38) : 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 44 }}
      animate={{
        opacity: targetOpacity,
        x: visible ? 0 : 44,
        paddingTop:    active ? '5rem' : '3.5rem',
        paddingBottom: active ? '5rem' : '3.5rem',
      }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative"
    >
      {/* border draw */}
      {index < totalCount - 1 && (
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-neutral-300 origin-left"
          style={{ width: '100%' }}
          animate={{ scaleX: drawn ? 1 : 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      )}

      {/* watermark */}
      <motion.span
        className="absolute right-0 top-1/2 -translate-y-1/2 font-archivo font-black leading-none select-none pointer-events-none"
        style={{ fontSize: 'clamp(5rem,9vw,9rem)', letterSpacing: '-0.05em' }}
        animate={{ color: active ? '#d0f2dc' : '#eae9e2' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        0{index + 1}
      </motion.span>

      {/* num — pulses on activate */}
      <motion.span
        className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#09A43E] mb-3 block origin-left"
        animate={{ scale: pulsed ? 1.35 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
      >
        0{index + 1}
      </motion.span>

      {/* title */}
      <h3
        className="font-archivo font-bold tracking-tight leading-[1.1] relative"
        style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '-0.03em' }}
      >
        {title}
        {/* underline draw */}
        <motion.span
          className="block h-[2.5px] bg-[#09A43E] rounded-full mt-[0.4rem] mb-3 origin-left"
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 0.75, ease: EASE }}
        />
      </h3>

      {/* desc — sequential reveal after underline */}
      <motion.p
        className="text-neutral-500 leading-relaxed text-lg relative max-w-[40ch]"
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 6 }}
        transition={{ duration: 0.35, delay: active ? 0.4 : 0, ease: EASE }}
      >
        {description}
      </motion.p>
    </motion.div>
  )
}

/* ── section ── */
export function AdvantageSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState(-1)
  const maxSeenRef  = useRef(-1)

  const hasActiveItem = activeIdx >= 0

  // heading state — lock after 3rd fact (index 2)
  const effectiveIdx = activeIdx >= 0
    ? activeIdx
    : maxSeenRef.current >= 2 ? maxSeenRef.current : -1

  const clampedIdx   = Math.min(Math.max(effectiveIdx, 0), GREEN_STEPS.length - 1)
  const headingColor = effectiveIdx >= 0 ? GREEN_STEPS[clampedIdx] : '#09A43E'
  const headingGlow  = effectiveIdx >= 0 ? `0 0 60px ${GLOW_STEPS[clampedIdx]}` : 'none'
  const headingScale = effectiveIdx >= 0 ? SCALE_STEPS[clampedIdx] : 1

  const onActive = useCallback((idx: number) => {
    if (idx === 0) maxSeenRef.current = 0   // scrolled back up — unlock
    if (idx > maxSeenRef.current) maxSeenRef.current = idx
    setActiveIdx(idx)
  }, [])

  const onInactive = useCallback((idx: number) => {
    setActiveIdx(prev => prev === idx ? -1 : prev)
  }, [])

  // scroll progress bar
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const springY = useSpring(scrollYProgress, { stiffness: 100, damping: 28, mass: 0.4 })
  const scaleY  = useTransform(springY, [0, 1], [0, 1])

  const counterLabel = activeIdx >= 0
    ? `${String(activeIdx + 1).padStart(2, '0')} / ${String(ADVANTAGES.length).padStart(2, '0')}`
    : ' '

  return (
    <section ref={sectionRef} className="px-8 relative">
      {/* green progress bar */}
      <div className="absolute left-0 top-0 w-[3px] h-full bg-neutral-200">
        <motion.div className="w-full bg-[#09A43E] origin-top" style={{ scaleY, height: '100%' }} />
      </div>

      <div className="max-w-[1300px] mx-auto grid md:grid-cols-2 gap-16 md:gap-24">

        {/* LEFT — sticky */}
        <div className="py-24 md:py-32">
          <div className="md:sticky md:top-28">

            {/* counter */}
            <div className="h-5 overflow-hidden mb-6">
              <AnimatePresence mode="wait">
                <motion.span
                  key={counterLabel}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#09A43E] block"
                >
                  {counterLabel}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* heading */}
            <motion.h2
              className="font-archivo font-black tracking-[-0.05em] leading-[0.88] text-neutral-900 text-5xl md:text-6xl lg:text-7xl"
              animate={{ scale: headingScale }}
              transition={{ duration: 1, ease: EASE }}
              style={{ transformOrigin: 'left top' }}
            >
              Gain your<br />
              <motion.span
                className="inline-block"
                animate={{ color: headingColor, textShadow: headingGlow }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                unfair<br />advantage
              </motion.span>
            </motion.h2>

          </div>
        </div>

        {/* RIGHT — scrollable */}
        <div className="md:py-32 flex flex-col justify-center border-t border-neutral-200">
          {ADVANTAGES.map((a, i) => (
            <AdvantageItem
              key={a.title}
              title={a.title}
              description={a.description}
              index={i}
              totalCount={ADVANTAGES.length}
              onActive={onActive}
              onInactive={onInactive}
              hasActiveItem={hasActiveItem}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
