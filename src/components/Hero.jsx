import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // Phase 1: depth & rotation - title and drum stay clear
      tl.to(q('.hero-drum'), { scale: 1.15, rotation: 35, ease: 'none', duration: 0.5 }, 0)
        .to(q('.hero-star'), { scale: 1.25, ease: 'none', duration: 0.5 }, 0)
        .to(q('.hero-scrollhint'), { opacity: 0, ease: 'none', duration: 0.12 }, 0.08);

      // Phase 2: title stays comfortably visible throughout initial scroll, then recedes
      tl.to(q('.hero-title'), { scale: 1.05, opacity: 0, y: -35, ease: 'none', duration: 0.18 }, 0.35);

      // Phase 3: dive through the star into crimson red
      tl.to(q('.hero-star'), { scale: 12, ease: 'power1.in', duration: 0.32 }, 0.54)
        .to(
          q('.hero-bg'),
          {
            background: 'radial-gradient(ellipse at center, #DA251D 0%, #8F1713 55%, #080808 100%)',
            ease: 'none',
            duration: 0.32,
          },
          0.58
        )
        .to(q('.hero-redwash'), { opacity: 1, ease: 'power2.in', duration: 0.16 }, 0.84);

      // Pad timeline to 1.0 so scroll percentages map 1:1
      tl.to({}, { duration: 1.0 }, 0);
    },
    { scope: root }
  );

  return (
    <section id="hero" ref={root} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        
        {/* Dynamic Background */}
        <div
          className="hero-bg will-transform absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, #1c0a08 0%, #0d0605 55%, #080808 100%)',
          }}
        />

        {/* Stars texture backdrop */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/stars.webp)' }}
        />

        {/* Spinning Dong Son drum motif (Authentic high-res asset & SVG) */}
        <div className="hero-drum will-transform pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[920px] h-[700px] sm:h-[920px] opacity-30 flex items-center justify-center">
          <img 
            src="/images/thiet-ke-3d-trong-dong.png" 
            alt="Trống đồng Đông Sơn" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(255,205,0,0.3)]"
          />
        </div>

        {/* Central Dong Son Golden Sun Star (Animated Zoom Target) */}
        <div className="hero-star will-transform pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 z-10 flex items-center justify-center opacity-70">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-vn-gold drop-shadow-[0_0_50px_rgba(255,205,0,0.7)]">
            <polygon points="50,15 53,42 68,26 59,48 85,50 59,52 68,74 53,58 50,85 47,58 32,74 41,52 15,50 41,48 32,26 47,42" />
            <circle cx="50" cy="50" r="7" fill="#8F1713" />
          </svg>
        </div>

        {/* Bottom Scrim for Title Legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[56vh] bg-gradient-to-t from-vn-black via-vn-black/85 to-transparent" />

        {/* Title Block anchored at bottom */}
        <div className="hero-title will-transform pointer-events-none absolute inset-x-0 bottom-[14vh] z-30 flex flex-col items-center text-center px-4">
          <div className="inline-block px-3.5 py-1 rounded-full bg-vn-red-deep/40 border border-vn-gold/40 text-[11px] uppercase tracking-cinematic text-vn-gold mb-3 shadow-lg">
            Học phần Lịch sử Đảng Cộng sản Việt Nam (VNR)
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-8xl tracking-tight leading-none text-white text-glow-gold">
            KÝ HỌA SỬ ĐẢNG
          </h1>

          <p className="mt-3 font-heading italic text-lg sm:text-2xl tracking-wide text-vn-gold">
            Những Mốc Son Lịch Sử & Đỉnh Cao Điện Biên Phủ 1954
          </p>

          <p className="mt-2 max-w-xl text-xs sm:text-sm uppercase tracking-[0.25em] text-vn-ivory/70 font-light">
            Triển lãm Cuộn Điện Ảnh Tương Tác 2D · Giáo trình Ban Tuyên Giáo TW
          </p>
        </div>

        {/* Scroll hint line */}
        <div className="hero-scrollhint pointer-events-none absolute bottom-6 left-1/2 z-40 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-cinematic text-vn-gold/70">Cuộn để bắt đầu</span>
          <span className="scroll-hint-line" />
        </div>

        {/* Final crimson wash that transitions into next scene */}
        <div className="hero-redwash pointer-events-none absolute inset-0 z-50 bg-vn-red opacity-0" />

      </div>
    </section>
  );
}
