'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { OFFER, APPLY_URL } from '@/lib/data'
import { Magnetic } from './motion'

const EASE = [0.16, 1, 0.3, 1] as const

function OfferCol({ title, description, index, wm }: {
  title: string; description: string; index: number; wm: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setTimeout(() => setVisible(true), index * 110)
      obs.disconnect()
    }, { rootMargin: '-60px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: EASE }}
      className="relative py-10 pr-8 pl-0 border-r border-neutral-200 last:border-r-0 last:pr-0 last:pl-8 [&:not(:first-child):not(:last-child)]:px-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* vertical green line on left edge */}
      <motion.div
        className="absolute left-0 top-0 w-[2px] bg-[#09A43E] origin-top"
        style={{ height: '100%' }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      />

      {/* watermark number */}
      <motion.div
        className="font-archivo font-black leading-none select-none pointer-events-none mb-6"
        style={{ fontSize: 'clamp(4rem,6vw,7rem)', letterSpacing: '-0.05em' }}
        animate={{ color: hovered ? '#b8f0cc' : '#e2e1db' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {wm}
      </motion.div>

      {/* title */}
      <h3 className="font-archivo font-bold tracking-tight leading-[1.2] text-[1.05rem] mb-0 relative">
        {title}
        {/* underline draw */}
        <motion.span
          className="block h-[2px] bg-[#09A43E] rounded-full mt-[0.4rem] mb-3 origin-left"
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </h3>

      <p className="text-neutral-500 text-[0.9rem] leading-[1.7]">{description}</p>
    </motion.div>
  )
}

export function OfferSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const [topVisible, setTopVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setTopVisible(true)
      setTimeout(() => setCtaVisible(true), 600 + OFFER.items.length * 110)
      obs.disconnect()
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="s-offer" className="py-24 md:py-32 px-8 border-t border-neutral-200">
      <div className="max-w-[1400px] mx-auto">

        {/* top: heading + price */}
        <div ref={headingRef} className="flex items-end justify-between gap-8 flex-wrap pb-12 border-b border-neutral-200 mb-0">
          <motion.h2
            className="font-archivo font-black tracking-[-0.05em] leading-[0.88] text-neutral-900 text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={topVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
          >
            One Pass.<br />
            <span className="text-[#09A43E]">Total Global<br />Exposure.</span>
          </motion.h2>

          <motion.div
            className="text-right flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={topVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          >
            <div
              className="font-archivo font-black text-[#09A43E] leading-none tracking-[-0.05em]"
              style={{ fontSize: 'clamp(3rem,5vw,5.5rem)' }}
            >
              {OFFER.price}
            </div>
            <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-neutral-400 mt-2">
              per startup - all inclusive
            </p>
          </motion.div>
        </div>

        {/* 4 editorial columns */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          {OFFER.items.map((item, i) => (
            <OfferCol
              key={item.title}
              title={item.title}
              description={item.description}
              index={i}
              wm={`0${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="border-t border-neutral-200 pt-10 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Magnetic strength={0.4}>
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-lg font-medium bg-neutral-900 text-white px-10 py-5 rounded-full hover:bg-[#09A43E] transition-colors cursor-pointer"
            >
              Secure Your Spot
            </a>
          </Magnetic>
        </motion.div>

      </div>
    </section>
  )
}
