'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { OFFER, APPLY_URL } from '@/lib/data'
import { Magnetic } from './motion'

const EASE     = [0.16, 1, 0.3, 1] as const
const CHARGE_INTERVAL = 650   // ms between each number charging up

function OfferCol({ title, description, index, wm, active, hovered, onHover }: {
  title: string; description: string
  index: number; wm: string
  active: boolean
  hovered: boolean
  onHover: (h: boolean) => void
}) {
  const borderClasses = [
    'relative px-4 py-6 md:py-12',
    index % 2 === 0 ? 'border-r border-neutral-200' : '',
    index < 2      ? 'border-b border-neutral-200' : '',
    'md:border-b-0',
    index < 3      ? 'md:border-r md:border-neutral-200' : 'md:border-r-0',
    index === 0 ? 'md:pl-0 md:pr-8' : '',
    index === 3 ? 'md:pl-8 md:pr-0' : '',
    index === 1 || index === 2 ? 'md:px-8' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={borderClasses}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* vertical line — grows when charged, brighter on hover */}
      <motion.div
        className="absolute left-0 top-0 w-[2px] bg-[#09A43E] origin-top hidden md:block"
        style={{ height: '100%' }}
        animate={{ scaleY: active ? 1 : 0, opacity: hovered ? 1 : 0.6 }}
        transition={{ duration: 1.4, ease: EASE }}
      />

      {/* number — charges to green */}
      <motion.div
        className="font-archivo font-black leading-none select-none pointer-events-none mb-4 md:mb-6"
        style={{ fontSize: 'clamp(2.5rem,5vw,7rem)', letterSpacing: '-0.05em' }}
        animate={{ color: active ? '#09A43E' : '#e2e1db' }}
        transition={{ duration: 1.3, ease: EASE }}
      >
        {wm}
      </motion.div>

      {/* title + underline draws after number charges */}
      <h3 className="font-archivo font-bold tracking-tight leading-[1.2] text-[0.9rem] md:text-[1.05rem] mb-0 relative">
        {title}
        <motion.span
          className="block h-[2px] bg-[#09A43E] rounded-full mt-[0.4rem] mb-2 md:mb-3 origin-left"
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 1.0, ease: EASE, delay: active ? 0.35 : 0 }}
        />
      </h3>

      <p className="text-neutral-500 text-[0.9rem] leading-[1.7]">{description}</p>
    </div>
  )
}

export function OfferSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const [topVisible, setTopVisible]     = useState(false)
  const [activeCount, setActiveCount]   = useState(0)   // 0-4, drives charge
  const [ctaVisible,  setCtaVisible]    = useState(false)
  const [hoveredIdx,  setHoveredIdx]    = useState(-1)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()

      // heading
      setTopVisible(true)

      // sequential charge: 01 → 02 → 03 → 04
      OFFER.items.forEach((_, i) => {
        setTimeout(() => setActiveCount(i + 1), 500 + i * CHARGE_INTERVAL)
      })

      // CTA after all charged
      setTimeout(
        () => setCtaVisible(true),
        300 + OFFER.items.length * CHARGE_INTERVAL + 300
      )
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="s-offer" className="py-24 md:py-32 px-8 border-t border-neutral-200">
      <div className="max-w-[1400px] mx-auto">

        {/* heading + price */}
        <div className="flex items-end justify-between gap-8 flex-wrap pb-10 border-b border-neutral-200">
          <motion.h2
            className="font-archivo font-black tracking-[-0.05em] leading-[0.88] text-neutral-900 text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={topVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
          >
            One Pass<br />
            <span className="text-[#09A43E]">Total Global<br />Exposure</span>
          </motion.h2>

          <motion.div
            className="text-right flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={topVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
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

        {/* 4 editorial columns — charge sequentially */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {OFFER.items.map((item, i) => (
            <OfferCol
              key={item.title}
              title={item.title}
              description={item.description}
              index={i}
              wm={`0${i + 1}`}
              active={i < activeCount}
              hovered={hoveredIdx === i}
              onHover={(h) => setHoveredIdx(h ? i : -1)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="border-t border-neutral-200 pt-10 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
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
