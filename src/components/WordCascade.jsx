import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

export default function WordCascade({
  items = [],
  words = [],
  background = '#080808',
  id,
  eyebrow,
  className = '',
}) {
  const root = useRef(null);

  // Normalize data: support either array of objects { word, tag, quote, desc } or array of strings
  const normalizedItems = (items && items.length > 0)
    ? items
    : words.map((w, i) => ({
        word: typeof w === 'string' ? w : w.word,
        tag: `NGUYÊN TẮC 0${i + 1}`,
        quote: typeof w === 'object' && w.quote ? w.quote : '',
        desc: typeof w === 'object' && w.desc ? w.desc : '',
      }));

  const total = normalizedItems.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q('.phrase-card');
      const dots = q('.phrase-dot');
      const numCards = cards.length;

      if (numCards === 0) return;

      // Initial state: Card 0 is 100% visible, cards 1..N-1 are hidden below
      gsap.set(cards, { opacity: 0, y: 35, scale: 0.95, pointerEvents: 'none' });
      gsap.set(cards[0], { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' });

      // Initial state of dots
      gsap.set(dots, { width: '8px', opacity: 0.35, backgroundColor: '#ffffff' });
      gsap.set(dots[0], { width: '36px', opacity: 1, backgroundColor: '#FFCD00' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
        },
      });

      // Divide the 0.0 -> 1.0 scroll range equally among items
      // Each item gets an equal window of time in the center
      const slice = 1.0 / numCards;
      const transTime = slice * 0.22; // 22% of slice for crossfade transition

      for (let i = 0; i < numCards - 1; i++) {
        const transStart = (i + 1) * slice - transTime;
        const currentCard = cards[i];
        const nextCard = cards[i + 1];
        const currentDot = dots[i];
        const nextDot = dots[i + 1];

        // Current card transitions out (slides up & fades)
        tl.to(
          currentCard,
          {
            opacity: 0,
            y: -35,
            scale: 0.95,
            duration: transTime,
            ease: 'power2.inOut',
            pointerEvents: 'none',
          },
          transStart
        );

        // Next card transitions in (slides in from bottom & illuminates)
        tl.to(
          nextCard,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: transTime,
            ease: 'power2.inOut',
            pointerEvents: 'auto',
          },
          transStart
        );

        // Update progress dots
        tl.to(
          currentDot,
          {
            width: '8px',
            opacity: 0.35,
            backgroundColor: '#ffffff',
            duration: transTime,
            ease: 'power1.out',
          },
          transStart
        );

        tl.to(
          nextDot,
          {
            width: '36px',
            opacity: 1,
            backgroundColor: '#FFCD00',
            duration: transTime,
            ease: 'power1.out',
          },
          transStart
        );
      }

      // Anchor timeline to exact 1.0 duration so scrub maps 1:1 with scroll distance
      tl.to({}, { duration: 1.0 }, 0);
    },
    { scope: root, dependencies: [total] }
  );

  return (
    <section
      id={id}
      ref={root}
      className={`relative ${className}`}
      style={{ height: `${total * 65 + 35}vh`, background }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-between overflow-hidden px-6 py-12 sm:py-16">
        
        {/* Top Header & Chapter Indicator */}
        <div className="relative z-20 text-center max-w-2xl mt-4 sm:mt-6">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-vn-charcoal/90 border border-vn-gold/30 text-vn-gold text-[11px] uppercase tracking-cinematic font-semibold shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-vn-gold animate-pulse" />
              <span>{eyebrow}</span>
            </div>
          )}
        </div>

        {/* Center Stage: Sequential Full-Screen Phrases */}
        <div className="relative z-20 flex-1 w-full max-w-4xl flex items-center justify-center">
          {normalizedItems.map((item, i) => (
            <div
              key={`${item.word}-${i}`}
              className="phrase-card will-transform absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8"
            >
              {/* Step Badge */}
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-vn-red-deep/30 border border-vn-gold/30 text-vn-gold text-xs font-mono font-bold tracking-widest">
                <span>0{i + 1} / 0{total}</span>
                {item.tag && <span className="opacity-80">· {item.tag}</span>}
              </div>

              {/* Main Golden Word */}
              <h2 className="select-none font-display font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tight uppercase leading-none gold-gradient-text text-glow-gold drop-shadow-2xl">
                {item.word}
              </h2>

              {/* Subtitle / Core proposition */}
              {item.quote && (
                <p className="mt-4 font-heading text-lg sm:text-2xl md:text-3xl text-vn-ivory font-bold italic tracking-wide text-glow-gold/40">
                  "{item.quote}"
                </p>
              )}

              {/* Detailed Textbook Context */}
              {item.desc && (
                <div className="mt-4 max-w-xl p-3.5 sm:p-4 rounded-xl bg-[#121214]/90 border border-vn-gold/20 shadow-lg">
                  <p className="font-sans text-xs sm:text-sm md:text-base text-vn-ivory/85 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Step Pills Indicator */}
        <div className="relative z-20 flex flex-col items-center gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            {normalizedItems.map((item, i) => (
              <div
                key={`dot-${i}`}
                className="phrase-dot will-transform h-2 rounded-full transition-all duration-200"
              />
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-vn-ivory/40 font-mono">
            Cuộn chuột để tiếp tục theo dõi
          </span>
        </div>

        {/* Atmospheric radial ambient light */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full bg-vn-gold/5 blur-[120px]" />
          <div className="w-[300px] h-[300px] rounded-full bg-vn-red/5 blur-[100px]" />
        </div>

      </div>
    </section>
  );
}
