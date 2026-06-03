'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ADVANTAGES, APPLY_URL } from '@/lib/data'
import { Magnetic } from './motion'

const EASE = [0.16, 1, 0.3, 1] as const

function AdvantageItem({
  title, description, index,
}: { title: string; description: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const visObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); visObs.disconnect() } },
      { rootMargin: '-60px' }
    )
    const activeObs = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { rootMargin: '-35% 0px -35% 0px' }
    )
    visObs.observe(el)
    activeObs.observe(el)
    return () => { visObs.disconnect(); activeObs.disconnect() }
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 36 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: EASE, delay: 0.05 }}
      className="py-12 border-b border-neutral-200 relative"
    >
      {/* watermark number */}
      <span
        className="absolute right-0 top-1/2 -translate-y-1/2 font-archivo font-black leading-none select-none pointer-events-none transition-colors duration-500"
        style={{
          fontSize: 'clamp(5rem,10vw,9rem)',
          color: active ? '#d8f5e3' : '#eae9e2',
          letterSpacing: '-0.05em',
        }}
      >
        0{index + 1}
      </span>

      <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#09A43E] mb-3 block">
        0{index + 1}
      </span>

      <h3
        className="font-archivo font-bold tracking-tight mb-0 relative"
        style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '-0.03em' }}
      >
        {title}
        {/* green underline draw */}
        <motion.span
          className="block h-[2.5px] bg-[#09A43E] rounded-full mt-[0.45rem] mb-3 origin-left"
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        />
      </h3>

      <p className="text-neutral-500 leading-relaxed text-lg relative max-w-[40ch]">
        {description}
      </p>
    </motion.div>
  )
}

export function AdvantageSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const rawProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const scaleY = useTransform(rawProgress, [0, 1], [0, 1])

  return (
    <section ref={sectionRef} className="px-8 relative">
      {/* left progress bar */}
      <div className="absolute left-0 top-0 w-[3px] h-full bg-neutral-200">
        <motion.div
          className="w-full bg-[#09A43E] origin-top"
          style={{ scaleY, height: '100%' }}
        />
      </div>

      <div className="max-w-[1300px] mx-auto grid md:grid-cols-2 gap-16 md:gap-24">

        {/* LEFT sticky */}
        <div className="py-24 md:py-32">
          <div className="md:sticky md:top-28">
            <h2
              className="font-archivo font-black tracking-[-0.05em] leading-[0.88] text-neutral-900"
              style={{ fontSize: 'clamp(2.8rem,8vw,7rem)' }}
            >
              Gain your<br />
              <span className="text-[#09A43E]">unfair<br />advantage</span>
            </h2>
            <Magnetic strength={0.4}>
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-10 items-center gap-3 text-lg font-medium bg-neutral-900 text-white px-9 py-4 rounded-full hover:bg-[#09A43E] transition-colors cursor-pointer"
              >
                Apply Now <span>→</span>
              </a>
            </Magnetic>
          </div>
        </div>

        {/* RIGHT scrollable list */}
        <div className="md:py-32 flex flex-col justify-center border-t border-neutral-200">
          {ADVANTAGES.map((a, i) => (
            <AdvantageItem key={a.title} title={a.title} description={a.description} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
