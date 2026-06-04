'use client'

import Image from 'next/image'
import { TESTIMONIALS } from '@/lib/data'
import { Reveal } from './motion'

function QuoteCard({ quote, name, company, photo, dark }: {
  quote: string; name: string; company: string; photo?: string; dark?: boolean
}) {
  const initials = name.split(' ').map(x => x[0]).join('').slice(0, 2)
  return (
    <div className={[
      'flex-shrink-0 w-[300px] rounded-2xl p-5 select-none',
      dark ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900 border border-neutral-100',
    ].join(' ')}>
      <div className="text-2xl leading-none mb-2 font-serif text-[#09A43E]">"</div>
      <p className={['text-[0.76rem] leading-[1.65] mb-4', dark ? 'text-white/75' : 'text-[#374151]'].join(' ')}>
        {quote.replace(/^"|"$/g, '')}
      </p>
      <div className="flex items-center gap-2">
        {photo
          ? <Image src={photo} alt={name} width={28} height={28} className="w-7 h-7 rounded-full object-cover flex-shrink-0" unoptimized />
          : <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[0.6rem] font-bold text-white bg-[#09A43E]">{initials}</div>
        }
        <div>
          <div className={['font-bold text-[0.75rem]', dark ? 'text-white' : 'text-neutral-900'].join(' ')}>{name}</div>
          <div className="text-[0.65rem] text-[#09A43E] tracking-wide">{company}</div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const row1 = [...TESTIMONIALS.slice(0, 4), ...TESTIMONIALS.slice(0, 4)]
  const row2 = [...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(4)]

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
        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {row1.map((t, i) => (
            <QuoteCard key={i} {...t} dark={i % 4 === 0 || i % 4 === 3} />
          ))}
        </div>
        <div className="flex gap-4 animate-marquee-reverse whitespace-nowrap">
          {row2.map((t, i) => (
            <QuoteCard key={i} {...t} dark={i % 4 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
