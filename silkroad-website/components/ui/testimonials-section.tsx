'use client'

import { TESTIMONIALS } from '@/lib/data'
import { Reveal } from './motion'

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 border-t border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-8">
        <Reveal>
          <h2 className="font-inter font-black uppercase tracking-[0.02em] leading-[0.95] text-[clamp(2.2rem,5.5vw,5rem)] mb-14">
            From <span className="text-[#09A43E]">founders</span> like you
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => {
            const initials = t.name.split(' ').map(x => x[0]).join('').slice(0, 2)
            const dark = i === 0
            return (
              <Reveal key={t.name} delay={i * 0.05}>
                <div className={[
                  'rounded-xl p-6 h-full flex flex-col',
                  dark ? 'bg-neutral-950 border border-neutral-800' : 'bg-white border border-neutral-200',
                ].join(' ')}>
                  <div className="w-6 h-[2px] bg-[#09A43E] mb-4 flex-shrink-0" />
                  <p className={['text-sm leading-relaxed flex-1 mb-6', dark ? 'text-white/70' : 'text-[#374151]'].join(' ')}>
                    {t.quote.replace(/^"|"$/g, '')}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[0.65rem] font-black text-white bg-[#09A43E]">
                      {initials}
                    </div>
                    <div>
                      <p className={['text-xs font-bold', dark ? 'text-white' : 'text-neutral-900'].join(' ')}>{t.name}</p>
                      <p className="text-[11px] text-[#09A43E]">{t.company}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
