import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/**
 * INK HERO — KHỞI NGUYÊN NÉT MỰC ĐỎ (KÝ HỌA SỬ ĐẢNG)
 * Đập bỏ hoàn toàn Hero quay trống đồng của repo clone.
 * Trải nghiệm bắt đầu trên nền giấy ngà cổ kính.
 * Scroll của người dùng điều khiển đầu bút lông kéo dài một nét mực son đỏ sống.
 * Nét mực vẽ ra tiêu đề KÝ HỌA SỬ ĐẢNG qua ink mask, rồi camera chui xuyên vào
 * chiều sâu hạt mực dẫn thẳng tới chiếc Bàn Tài Liệu 1930 không qua fade cut.
 */
export default function InkHero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stroke = q('.ink-brush-path')[0];
      const strokeLen = stroke ? stroke.getTotalLength() : 1200;

      // Initial state
      if (stroke) {
        gsap.set(stroke, { strokeDasharray: strokeLen, strokeDashoffset: strokeLen });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // 0.0 -> 0.40: Ink line draws out across screen & nib tracks tip
      tl.to(stroke, { strokeDashoffset: 0, ease: 'none', duration: 0.45 }, 0)
        .to(q('.brush-nib'), { opacity: 1, ease: 'power1.out', duration: 0.05 }, 0)
        .to(q('.hero-scrollhint'), { opacity: 0, duration: 0.1 }, 0.05)

        // Title 1 "KÝ HỌA" reveals via mask
        .fromTo(
          q('.title-kyhoa'),
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, ease: 'power2.out', duration: 0.25 },
          0.12
        )

        // Title 2 "SỬ ĐẢNG" reveals in giant crimson/gold
        .fromTo(
          q('.title-sudang'),
          { clipPath: 'inset(0 100% 0 0)', opacity: 0, scale: 0.92 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, scale: 1, ease: 'power2.out', duration: 0.28 },
          0.26
        )

        // Subtitle & Tagline emerge
        .fromTo(
          q('.hero-meta'),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, ease: 'power1.out', duration: 0.2 },
          0.42
        )

        // 0.60 -> 1.0: Camera dive into the heart of the red ink ("SỬ")
        .to(q('.hero-stage'), {
          scale: 4.8,
          transformOrigin: '52% 48%',
          ease: 'power2.in',
          duration: 0.38,
        }, 0.62)
        .to(q('.hero-meta, .brush-nib'), { opacity: 0, duration: 0.15 }, 0.65)
        .to(q('.ink-dive-fade'), { opacity: 1, ease: 'power3.in', duration: 0.25 }, 0.75);

      tl.to({}, { duration: 1.0 }, 0);
    },
    { scope: root }
  );

  return (
    <section id="hero" ref={root} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#0d0b0a]">
        
        {/* Paper Parchment Textured Backdrop */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen bg-cover bg-center"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, #2a1f18 0%, #150f0c 55%, #080605 100%)'
          }}
        />

        {/* Paper Fiber Texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(218, 37, 29, 0.15) 0%, transparent 40%),
                              radial-gradient(circle at 80% 70%, rgba(255, 205, 0, 0.12) 0%, transparent 45%)`
          }}
        />

        {/* Main Stage (Scales during Camera Dive) */}
        <div className="hero-stage will-transform relative z-10 w-full max-w-5xl flex flex-col items-center justify-center text-center px-6">
          
          {/* Living Red Ink Brush Line SVG */}
          <svg 
            viewBox="0 0 1000 320" 
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          >
            <defs>
              <linearGradient id="inkRedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8F1713" stopOpacity="0.4" />
                <stop offset="30%" stopColor="#DA251D" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#FF3B30" stopOpacity="1" />
                <stop offset="100%" stopColor="#FFCD00" stopOpacity="0.9" />
              </linearGradient>
              <filter id="inkBleed" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" />
              </filter>
            </defs>

            {/* Dynamic calligraphic ribbon stroke */}
            <path
              d="M 50,220 Q 220,130 450,170 T 800,140 Q 920,120 950,210 Q 750,260 500,240 T 80,260"
              fill="none"
              stroke="url(#inkRedGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#inkBleed)"
              className="ink-brush-path opacity-90 drop-shadow-[0_0_15px_rgba(218,37,29,0.7)]"
            />
          </svg>

          {/* Calligraphic Brush Nib Marker */}
          <div className="brush-nib will-transform pointer-events-none absolute w-3 h-3 rounded-full bg-vn-gold shadow-[0_0_20px_#FFCD00] opacity-0 z-20" />

          {/* Category Eyebrow */}
          <div className="hero-meta inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/60 border border-vn-gold/40 text-vn-gold text-[11px] font-mono font-bold uppercase tracking-widest mb-4 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-vn-red animate-ping" />
            <span>Ký Họa Sử Đảng · Một Nét Đỏ Xuyên Lịch Sử</span>
          </div>

          {/* Title Line 1: KÝ HỌA */}
          <h2 className="title-kyhoa font-display font-light text-4xl sm:text-6xl md:text-7xl uppercase tracking-widest text-amber-100/90 leading-none">
            KÝ HỌA
          </h2>

          {/* Title Line 2: SỬ ĐẢNG */}
          <h1 className="title-sudang font-display font-black text-6xl sm:text-8xl md:text-[130px] uppercase tracking-tight leading-none text-white text-glow-gold drop-shadow-2xl mt-1">
            SỬ ĐẢNG
          </h1>

          {/* Subtitle & Concept Description */}
          <div className="hero-meta mt-6 max-w-2xl mx-auto space-y-2">
            <p className="font-heading italic text-lg sm:text-2xl text-vn-gold font-normal">
              Bản Hùng Ca Điện Biên Phủ & Kỷ Nguyên Độc Lập
            </p>
            <p className="font-mono text-xs sm:text-sm text-vn-ivory/70 uppercase tracking-widest font-light">
              Cuộn để đầu cọ lông dẫn dắt bạn qua những mốc son lịch sử dân tộc
            </p>
          </div>

        </div>

        {/* Scroll Hint */}
        <div className="hero-scrollhint pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30">
          <span className="text-[10px] font-mono uppercase tracking-widest text-vn-gold/70">
            Cuộn để vẽ nét mực
          </span>
          <span className="scroll-hint-line" />
        </div>

        {/* Deep Ink Dive Backdrop (Emerges into 1930) */}
        <div className="ink-dive-fade pointer-events-none absolute inset-0 z-40 bg-[#090706] opacity-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-vn-gold/70 block">
              BƯỚC VÀO NĂM
            </span>
            <span className="font-display font-black text-5xl sm:text-7xl text-white tracking-widest text-glow-gold">
              03 · 02 · 1930
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
