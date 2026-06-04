'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { TESTIMONIALS } from '@/lib/data'

const EASE = [0.16, 1, 0.3, 1] as const

// [leftPct, topPct, depth, phase, amp, dark?]
const LAYOUT: [number, number, number, number, number, boolean?][] = [
  [1,  2,  0.013, 0,   7, true],
  [24, 1,  0.019, 1.1, 6],
  [52, 0,  0.015, 2.2, 8],
  [74, 2,  0.017, 0.7, 6],
  [5,  50, 0.011, 1.8, 7],
  [28, 52, 0.021, 0.4, 5],
  [54, 49, 0.014, 2.8, 8],
  [76, 51, 0.018, 1.5, 6],
]

function ini(n: string) { return n.split(' ').map(x => x[0]).join('').slice(0, 2) }

interface CardProps {
  quote: string; name: string; company: string; photo?: string
  index: number; dark?: boolean; color?: string
  mx: number; my: number; revealed: boolean
}

function FloatCard({ quote, name, company, photo, index, dark, color = '#09A43E', mx, my, revealed }: CardProps) {
  const [l, tp, depth, phase, amp] = LAYOUT[index]
  const [tick, setTick] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    let start: number
    const loop = (ts: number) => {
      if (!start) start = ts
      setTick(ts)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  }, [])

  const t = tick * 0.001
  const d = depth * 300
  const px = mx * d
  const py = my * d * 0.5
  const fy = Math.sin(t + phase) * amp
  const fx = Math.cos(t * 0.6 + phase) * (amp * 0.4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={revealed ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className={[
        'absolute rounded-2xl p-4 shadow-md hover:shadow-xl hover:z-10 transition-shadow duration-300',
        dark ? 'bg-neutral-950 text-white w-[280px]' : 'bg-white text-neutral-900 w-[240px]',
      ].join(' ')}
      style={{
        left: `${l}%`, top: `${tp}%`,
        transform: `translate(${px + fx}px, ${py + fy}px)`,
      }}
    >
      <div className="text-2xl leading-none mb-2 font-serif" style={{ color: '#09A43E' }}>"</div>
      <p className={['text-[0.76rem] leading-[1.65] mb-3', dark ? 'text-neutral-300' : 'text-[#374151]'].join(' ')}>
        {quote}
      </p>
      <div className="flex items-center gap-2">
        {photo
          ? <Image src={photo} alt={name} width={28} height={28} className="w-7 h-7 rounded-full object-cover flex-shrink-0" unoptimized />
          : <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[0.6rem] font-bold text-white" style={{ background: color }}>{ini(name)}</div>
        }
        <div>
          <div className="font-bold text-[0.75rem]">{name}</div>
          <div className={['text-[0.65rem] font-mono tracking-wide', dark ? 'text-neutral-500' : 'text-[#374151]'].join(' ')}>{company}</div>
        </div>
      </div>
    </motion.div>
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [mx, setMx] = useState(0)
  const [my, setMy] = useState(0)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRevealed(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMx((e.clientX / window.innerWidth - 0.5) * 2)
    setMy((e.clientY / window.innerHeight - 0.5) * 2)
  }, [])

  const COLORS = ['#09A43E','#09A43E','#7C3AED','#2563EB','#DC2626','#D97706','#059669','#7C3AED']

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative min-h-screen px-8 py-14 border-t border-neutral-200 overflow-hidden"
    >
      {/* bg glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(9,164,62,0.04) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(9,164,62,0.04) 0%, transparent 70%)' }} />

      {/* heading */}
      <motion.div
        className="text-center mb-8 relative z-10 pointer-events-none"
        initial={{ opacity: 0, y: 16 }}
        animate={revealed ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <h2 className="font-inter font-black uppercase tracking-[0.02em] leading-[0.95] text-[clamp(2.2rem,5.5vw,5rem)]">
          From <span className="text-[#09A43E]">founders</span> like you
        </h2>
      </motion.div>

      {/* floating field */}
      <div className="relative" style={{ height: 'calc(100vh - 180px)', minHeight: 580 }}>
        {TESTIMONIALS.map((t, i) => (
          <FloatCard
            key={t.name}
            quote={t.quote}
            name={t.name}
            company={t.company}
            photo={t.photo}
            index={i}
            dark={i === 0}
            color={COLORS[i]}
            mx={mx}
            my={my}
            revealed={revealed}
          />
        ))}
      </div>
    </section>
  )
}
