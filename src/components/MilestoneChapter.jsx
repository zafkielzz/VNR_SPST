import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

export default function MilestoneChapter({ milestone: m, reverse = false }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // 1. Subtle photo frame parallax drift
      gsap.fromTo(
        q('.m-frame'),
        { y: 24, scale: 0.97 },
        {
          y: -16,
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      );

      // 2. Text entrance: Triggers smoothly when chapter enters viewport (top 80%)
      // Once revealed, text STAYS 100% VISIBLE!
      const textElements = q('.m-anim');
      gsap.fromTo(
        textElements,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section 
      id={m.id} 
      ref={root} 
      className="relative h-[140vh]" 
      style={{ background: m.background || '#090A0C' }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Subtle background atmospheric noise */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/stars.webp)' }}
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:gap-14 md:px-12 z-10">
          
          {/* Text column - Stays 100% visible once revealed */}
          <div className={`order-2 flex-1 text-center md:text-left z-20 ${reverse ? 'md:order-2' : 'md:order-1'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vn-charcoal border border-vn-gold/30 text-vn-gold text-[11px] uppercase tracking-widest mb-3 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-vn-gold animate-pulse" />
              <span>{m.eyebrow}</span>
            </div>

            <h2 className="m-anim font-display text-5xl sm:text-7xl md:text-8xl font-black leading-none text-white text-glow-gold tracking-tight">
              {m.year}
            </h2>

            <h3 className="m-anim mt-3 font-display text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-vn-gold-antique">
              {m.heading}
            </h3>

            <p className="m-anim mt-4 font-heading text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide text-vn-gold">
              {m.keyText}
            </p>

            <div className="m-anim mt-5 p-4 sm:p-5 rounded-2xl bg-vn-charcoal/70 border border-vn-gold/25 backdrop-blur-md max-w-xl shadow-xl">
              <p className="font-sans text-sm sm:text-base italic leading-relaxed text-vn-ivory/90">
                "{m.caption}"
              </p>
            </div>
          </div>

          {/* Framed archival photo - Contained museum card, never zoomed in or blurry */}
          <div className={`m-frame will-transform relative order-1 w-full max-w-sm md:w-[48%] md:max-w-lg z-20 ${reverse ? 'md:order-1' : 'md:order-2'}`}>
            <div className="relative aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center overflow-hidden rounded-2xl border-2 border-vn-gold/40 bg-[#0d0f13] shadow-[0_25px_65px_rgba(0,0,0,0.9)] p-2.5 sm:p-3.5">
              
              {/* Antique gold corner flourishes */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-vn-gold pointer-events-none" />
              <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-vn-gold pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-vn-gold pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-vn-gold pointer-events-none" />

              <img
                src={m.image}
                alt={m.heading}
                className="max-h-full max-w-full object-contain rounded-xl drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
                loading="lazy"
              />
            </div>

            <p className="mt-3 text-center text-[11px] uppercase tracking-widest text-vn-ivory/50 font-mono">
              Tư liệu lịch sử xác thực · {m.eyebrow}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
