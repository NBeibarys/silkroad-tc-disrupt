'use client'

import { TESTIMONIALS } from '@/lib/data'
import { Reveal } from './motion'

function QuoteCard({ quote, name, company, dark }: {
  quote: string; name: string; company: string; dark?: boolean
}) {
  const initials = name.split(' ').map(x => x[0]).join('').slice(0, 2)
  return (
    <div className={[
      'flex-shrink-0 w-[320px] rounded-xl p-6 whitespace-normal select-none',
      dark
        ? 'bg-neutral-950 border border-neutral-800'
        : 'bg-white border border-neutral-200',
    ].join(' ')}>
      <div className="w-6 h-[2px] bg-[#09A43E] mb-4" />
      <p className={['text-sm leading-relaxed mb-5', dark ? 'text-white/70' : 'text-[#374151]'].join(' ')}>
        {quote.replace(/^"|"$/g, '')}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[0.65rem] font-black text-white bg-[#09A43E]">
          {initials}
        </div>
        <div>
          <p className={['text-xs font-bold', dark ? 'text-white' : 'text-neutral-900'].join(' ')}>{name}</p>
          <p className="text-[11px] text-[#09A43E] tracking-wide">{company}</p>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ items, reverse, darkPattern }: {
  items: typeof TESTIMONIALS; reverse?: boolean; darkPattern: (i: number) => boolean
}) {
  const doubled = [...items, ...items]
  return (
    <div className="flex gap-4" style={{
      animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${items.length * 8}s linear infinite`,
      willChange: 'transform',
      width: 'max-content',
    }}>
      {doubled.map((t, i) => (
        <QuoteCard key={i} quote={t.quote} name={t.name} company={t.company} dark={darkPattern(i % items.length)} />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 border-t border-neutral-200 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 mb-14">
        <Reveal>
          <h2 className="font-inter font-black uppercase tracking-[0.02em] leading-[0.95] text-[clamp(2.2rem,5.5vw,5rem)]">
            From <span className="text-[#09A43E]">founders</span> like you
          </h2>
        </Reveal>
      </div>
      <div className="space-y-4">
        <MarqueeRow items={TESTIMONIALS.slice(0, 4)} darkPattern={i => i === 0 || i === 3} />
        <MarqueeRow items={TESTIMONIALS.slice(4)} reverse darkPattern={i => i === 1} />
      </div>
    </section>
  )
}
