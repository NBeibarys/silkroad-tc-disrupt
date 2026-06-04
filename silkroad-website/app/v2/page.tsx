'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GalleryCarousel } from '@/components/ui/gallery-carousel'
import { AdvantageSection } from '@/components/ui/advantage-section'
import { OfferSection } from '@/components/ui/offer-section'
import { TestimonialsSection } from '@/components/ui/testimonials-section'
import {
  SmoothScroll, ScrollProgress, AnimatedHeading, Reveal,
  ParallaxImage, Magnetic, CountUp,
} from '@/components/ui/motion'
import {
  BRAND, APPLY_URL, APPLY_DEADLINE, CONTACT_EMAIL, CONTACT_TELEGRAM,
  TC_DISRUPT_2025,
  SPEAKERS, TEAM, PARTNERS_LOGOS, PARTICIPANTS_IMAGE, FAQ,
  TRACK_RECORD, GALLERY, TC_ABOUT,
} from '@/lib/data'

/* ============================================================
   VARIANT 2 — EXAGGERATED MINIMAL  ·  signature: scroll-pinned
   oversized statements, word reveals, magnetic CTAs, tilt cards.
   Palette: paper #FAFAF8 · ink #0a0a0a · hairline #E5E5E2 · accent green.
   ============================================================ */

const hXL = 'font-archivo font-black tracking-[-0.045em] leading-[0.92] text-[clamp(2.6rem,7vw,6rem)]'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#09A43E] mb-5">{children}</p>
    </Reveal>
  )
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="border-t border-neutral-200">
      {FAQ.map((item, i) => (
        <div key={i} className="border-b border-neutral-200">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center gap-6 py-7 text-left cursor-pointer group">
            <span className="text-2xl md:text-4xl font-semibold tracking-tight text-neutral-900 group-hover:text-[#09A43E] transition-colors">{item.q}</span>
            <span className={`text-3xl text-neutral-400 transition-transform duration-300 ${open === i ? 'rotate-45 text-[#09A43E]' : ''}`}>+</span>
          </button>
          <motion.div initial={false} animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <p className="pb-7 -mt-2 max-w-2xl text-neutral-500 text-lg leading-relaxed">{item.a}</p>
          </motion.div>
        </div>
      ))}
    </div>
  )
}

export default function V2Minimal() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <SmoothScroll>
      <ScrollProgress />
      <div className="min-h-screen bg-[#FAFAF8] text-neutral-900 font-inter overflow-x-clip selection:bg-[#09A43E] selection:text-white">

        {/* ── NAV ── */}
        <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#FAFAF8]/90 backdrop-blur-md border-b border-neutral-200 shadow-sm' : 'bg-transparent'}`}>
          <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="https://silkroadinnovationhub.com/" target="_blank" rel="noopener noreferrer">
                <Image src={BRAND.logo} alt="Silkroad Innovation Hub" width={200} height={64} className="h-12 w-auto object-contain" unoptimized />
              </a>
              <span className="hidden sm:block text-neutral-300 text-xl font-light">×</span>
              <a href="https://techcrunch.com/events/techcrunch-disrupt/" target="_blank" rel="noopener noreferrer">
                <Image src={BRAND.tcLogo} alt="TechCrunch" width={160} height={56} className="hidden sm:block h-11 w-auto object-contain" unoptimized />
              </a>
            </div>
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-700">
              {[['About Disrupt', '#s-about'], ['The Offer', '#s-offer'], ['Previous Participants', '#s-participants'], ['Our Record', '#s-record'], ['Partners', '#s-partners'], ['Team', '#s-team']].map(([l, h]) => (
                <a key={l} href={h} className="hover:text-[#09A43E] transition-colors whitespace-nowrap">{l}</a>
              ))}
            </nav>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="pt-28 md:pt-36 pb-10 md:pb-14 px-4 md:px-8 flex flex-col items-center text-center">
          <AnimatedHeading as="h1" text={'Showcase your startup\nto the world'}
            className="font-archivo font-black tracking-[-0.045em] leading-[0.95] text-[clamp(2.6rem,5.5vw,5rem)] mb-5"
            highlight={['world']} accentClass="text-[#09A43E]" />

          <Reveal delay={0.1}>
            <p className="font-archivo font-bold text-[clamp(1rem,1.7vw,1.3rem)] text-[#1E293B] tracking-tight mb-3 px-4">
              Join the Silkroad Pavilion at TechCrunch Disrupt 2026.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-[16px] md:text-[17px] text-[#475569] max-w-[500px] leading-relaxed mb-8 px-4">
              The largest Central Asian startup pavilion at Disrupt. Investors, press, and global founders, all in one room.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mb-10">
            <Magnetic strength={0.4}>
              <a href={APPLY_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-base font-semibold bg-[#09A43E] text-white px-9 py-4 rounded-md hover:bg-[#077a2e] transition-colors cursor-pointer">
                Apply Now
              </a>
            </Magnetic>
          </Reveal>

          <Reveal delay={0.25} className="w-full max-w-[820px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex flex-col items-center gap-1 px-2 py-5">
                <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#64748b]">Apply before</span>
                <span className="font-archivo font-black text-[1.4rem] tracking-[-0.03em] text-neutral-900 leading-tight whitespace-nowrap">September 15, 2026</span>
                <span className="text-[14px] text-[#64748b] font-medium">rolling review</span>
              </div>
              <div className="flex flex-col items-center gap-1 px-2 py-5">
                <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#64748b]">Event duration</span>
                <span className="font-archivo font-black text-[1.4rem] tracking-[-0.03em] text-[#09A43E] leading-tight whitespace-nowrap">3 Days</span>
                <span className="text-[14px] text-[#64748b] font-medium">Oct 13, 14, 15 in San Francisco</span>
              </div>
              <div className="flex flex-col items-center gap-1 px-2 py-5">
                <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#64748b]">Price</span>
                <span className="font-archivo font-black text-[1.4rem] tracking-[-0.03em] text-neutral-900 leading-tight whitespace-nowrap">$7,000</span>
                <span className="text-[14px] text-[#64748b] font-medium">per startup, all-inclusive</span>
              </div>
            </div>
          </Reveal>
        </section>


        {/* ── ABOUT ── */}
        <section id="s-about" className="pt-10 md:pt-14 pb-24 md:pb-32 px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end">
              <div className="md:col-span-7">
                <AnimatedHeading text={'What is\nTechCrunch Disrupt?'} className={hXL} highlight={['Disrupt?']} accentClass="text-[#09A43E]" />
              </div>
              <Reveal delay={0.1} className="md:col-span-5">
                <div className="border-l-2 border-neutral-200 pl-6">
                  <p className="text-xl text-neutral-600 leading-relaxed">{TC_ABOUT.description}</p>
                  <a href="https://techcrunch.com/events/techcrunch-disrupt/" target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-6 text-[#09A43E] font-medium border-b border-[#09A43E] pb-0.5 hover:text-neutral-900 hover:border-neutral-900 transition-colors">
                    Learn more →
                  </a>
                </div>
              </Reveal>
            </div>
            <div className="mt-14 flex flex-col gap-4">
              {TC_DISRUPT_2025.images.map((img, i) => (<Reveal key={img.src} delay={i * 0.08}><ParallaxImage src={img.src} alt={img.alt} className="w-full h-72 md:h-[480px] rounded-2xl" amount={30} /></Reveal>))}
            </div>
          </div>
        </section>

        <AdvantageSection />

        <OfferSection />


        {/* ── RECORD ── */}
        <section id="s-record" className="py-24 md:py-32 px-8 border-t border-neutral-200">
          <div className="max-w-[1400px] mx-auto">
            <Reveal className="pb-16 border-b border-neutral-200 mb-0">
              <AnimatedHeading text={'A proven record\nat Disrupt'} className={`${hXL} mb-5`} highlight={['Disrupt']} accentClass="text-[#09A43E]" />
              <p className="text-lg text-neutral-500 font-medium max-w-[52ch]">We have a history of bringing the biggest and best cohorts to the conference.</p>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-5">
              {TRACK_RECORD.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.1}>
                  <div className={[
                    'group relative py-10 pr-6',
                    i === 0 ? 'pl-0' : 'pl-6',
                    i < TRACK_RECORD.length - 1 ? 'border-r border-neutral-200' : '',
                    'max-md:border-r-0 max-md:border-b max-md:border-neutral-200 max-md:px-0',
                  ].join(' ')}>
                    <div className="font-archivo font-black tracking-[-0.05em] leading-none mb-3 text-neutral-900 group-hover:text-[#09A43E] transition-colors duration-500"
                      style={{ fontSize: 'clamp(2.5rem,4.5vw,5rem)' }}>
                      {'value' in s
                        ? <CountUp value={s.value as number} />
                        : s.display === 'the Largest'
                          ? <><span className="text-neutral-900 group-hover:text-[#09A43E] transition-colors">the </span><span className="text-[#09A43E]">Largest</span></>
                          : s.display}
                    </div>
                    <span className="block h-[2px] bg-[#09A43E] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out mb-3 rounded-full" />
                    <p className="text-[1rem] text-neutral-500 font-medium leading-snug">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <div id="s-participants" className="mt-16">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-archivo font-black text-2xl md:text-3xl tracking-tight">Disrupt 2025 Startups</h3>
                  <span className="text-sm font-semibold text-[#09A43E] border border-[#09A43E] rounded-full px-4 py-1.5">20 companies · 4 countries</span>
                </div>
                <div className="rounded-3xl border border-neutral-200 bg-white overflow-hidden">
                  <Image src={PARTICIPANTS_IMAGE} alt="Disrupt 2025 Startup Alumni" width={1600} height={800} className="w-full h-auto" unoptimized />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="py-24 md:py-32 px-8 border-t border-neutral-200">
          <div className="max-w-[1400px] mx-auto">
            <Reveal>
              <h2 className="font-archivo font-black text-3xl md:text-4xl tracking-tight text-center mb-3">See the Action</h2>
              <p className="text-neutral-500 text-center mb-10 text-lg">Experience the energy of the pavilion and the conference floor.</p>
            </Reveal>
            <Reveal><GalleryCarousel slides={GALLERY} heightClass="h-[340px] md:h-[640px]" className="!rounded-3xl" /></Reveal>
          </div>
        </section>

        <TestimonialsSection />

        {/* ── TEAM ── */}
        <section id="s-team" className="py-24 md:py-32 px-8 border-t border-neutral-200">
          <div className="max-w-[1400px] mx-auto">
            <Label>The Team</Label>
            <AnimatedHeading text={'The team behind the pavilion'} className={`${hXL} mb-14`} highlight={['pavilion']} accentClass="text-[#09A43E]" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {TEAM.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.06}>
                  <ParallaxImage src={m.photo} alt={m.name} className="aspect-[4/5] rounded-2xl mb-4" amount={30} />
                  <h3 className="text-lg font-semibold tracking-tight">{m.name}</h3>
                  <p className="text-sm text-[#09A43E] mb-3">{m.role}</p>
                  {m.credentials.slice(0, 3).map((c) => (
                    <p key={c} className="text-xs text-neutral-400">{c}</p>
                  ))}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNERS ── */}
        <section id="s-partners" className="py-24 md:py-32 px-8 border-t border-neutral-200">
          <div className="max-w-[1400px] mx-auto">
            <Label>Our Partners in 2025</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-4">
              {PARTNERS_LOGOS.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.07}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center justify-center border border-neutral-200 rounded-2xl bg-white p-8 md:p-10 h-36 hover:border-[#09A43E] hover:shadow-[0_8px_32px_-8px_rgba(9,164,62,0.18)] transition-all">
                    {p.logo ? (
                      <Image src={p.logo} alt={p.name} width={160} height={64} className="max-h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300" unoptimized />
                    ) : (
                      <span className="text-sm font-semibold text-neutral-500 group-hover:text-neutral-900 transition-colors text-center">{p.name}</span>
                    )}
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPEAKERS ── */}
        <section className="py-24 md:py-32 px-8 border-t border-neutral-200">
          <div className="max-w-[1400px] mx-auto">
            <h2 className={`${hXL} mb-3`}>Featured Speakers</h2>
            <p className="text-lg text-[#374151] mb-14">Learn from brightest minds in tech.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {SPEAKERS.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.08}>
                  <div className="relative w-full h-0 pb-[100%] rounded-2xl overflow-hidden mb-4">
                    <img
                      src={s.photo} alt={s.name} loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                      style={{ objectPosition: s.photoPos ?? 'center 15%' }}
                    />
                  </div>
                  <div className="min-h-[6rem]">
                    <h3 className="font-bold text-[1rem] tracking-tight text-neutral-900 mb-1 leading-tight">{s.name}</h3>
                    <p className="text-[0.88rem] font-semibold text-[#09A43E] mb-1">{s.company}</p>
                    <p className="text-[0.78rem] text-neutral-400 leading-snug">{s.role}</p>
                  </div>
                  <a href={s.companyUrl} target="_blank" rel="noopener noreferrer" className="block mt-1 transition-opacity hover:opacity-65">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.logo} alt={s.company} className="h-9 w-auto" loading="lazy" />
                  </a>
                </Reveal>
              ))}
            </div>
            <div className="mt-14 pt-12 border-t border-neutral-200 flex justify-center">
              <a
                href="https://techcrunch.com/events/techcrunch-disrupt/speakers/"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center bg-neutral-900 text-white px-11 py-5 rounded-full text-base font-semibold hover:bg-[#09A43E] transition-colors"
              >
                See full speakers list
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24 md:py-32 px-8 border-t border-neutral-200">
          <div className="max-w-[1000px] mx-auto">
            <Label>Questions</Label>
            <AnimatedHeading text={'Frequently asked'} className={`${hXL} mb-12`} highlight={['asked']} accentClass="text-[#09A43E]" />
            <Faq />
          </div>
        </section>

        {/* ── CLOSING CTA ── */}
        <section className="py-28 md:py-40 px-8 border-t border-neutral-200">
          <div className="max-w-[1400px] mx-auto text-center">
            <Reveal><p className="text-sm text-[#09A43E] font-medium mb-10">Applications close {APPLY_DEADLINE}</p></Reveal>
            <AnimatedHeading text={'Take the\nglobal stage'} className="font-archivo font-black tracking-[-0.05em] leading-[0.88] text-[clamp(2.8rem,9vw,9rem)] mb-12" highlight={['global', 'stage']} accentClass="text-[#09A43E]" />
            <Magnetic strength={0.5}>
              <a href={APPLY_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-lg font-medium bg-neutral-900 text-white px-12 py-5 rounded-full hover:bg-[#09A43E] transition-colors cursor-pointer">
                Apply for the Pavilion
              </a>
            </Magnetic>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-neutral-950 py-16 px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
              <div>
                <Image src={BRAND.logo} alt="Silkroad" width={140} height={48} className="h-10 w-auto object-contain mb-5 brightness-0 invert" unoptimized />
                <p className="text-white/70 text-sm leading-relaxed">{BRAND.tagline}</p>
              </div>
              <div>
                <div className="inline-block border border-white/10 rounded-2xl p-6 space-y-4 hover:border-[#09A43E]/40 transition-colors">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 text-white/95 hover:text-[#09A43E] transition-colors text-sm group">
                    <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs group-hover:border-[#09A43E] transition-colors">@</span>
                    {CONTACT_EMAIL}
                  </a>
                  <a href={CONTACT_TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/95 hover:text-[#09A43E] transition-colors text-sm group">
                    <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs group-hover:border-[#09A43E] transition-colors">tg</span>
                    Telegram
                  </a>
                  <p className="text-white/55 text-xs pl-11">{BRAND.address}</p>
                </div>
              </div>
              <div className="md:flex md:flex-col md:items-end md:justify-between">
                <a href={APPLY_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#09A43E] text-black font-semibold px-6 py-3 rounded-full text-sm hover:bg-white transition-colors">
                  Apply Now
                </a>
                <p className="text-white/60 text-xs mt-6 md:mt-0">© 2026 Silkroad Innovation Hub. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  )
}
