import React, { useRef, useEffect } from 'react';
import { gsap, useGSAP, MotionPathPlugin } from '../lib/gsap';
import { useExperience } from '../context/ExperienceContext';

/**
 * INK HERO — KHỞI NGUYÊN NÉT MỰC ĐỎ (KÝ HỌA SỬ ĐẢNG)
 * Phiên bản V3 Master:
 * - Nền giấy ngà sáng cổ truyền (#EFE8DC) tương phản mạnh mẽ với mực đen nho (#17100C) và nét son đỏ (#B71918).
 * - Đầu bút lông / ngòi bút thư pháp SVG thực thụ lướt theo quỹ đạo đường cong (MotionPathPlugin + autoRotate).
 * - Giọt mực son rơi lag nhẹ sau đầu bút tạo tính vật lý tự nhiên.
 * - Camera dive phóng sâu vào tâm nét mực: Giấy ngà -> Mực son đỏ tràn ngập màn hình -> Đỏ sẫm -> Đen huyền bí dẫn sang Bàn 1930.
 * - Nét mực tiếp tục chảy qua đáy viewport dẫn thẳng tới Bàn tài liệu 1930 (Object Continuity).
 */
export default function InkHero() {
  const root = useRef(null);
  const { setAtmosphereMode, prefersReducedMotion } = useExperience();

  useEffect(() => {
    setAtmosphereMode('paperDust');
  }, [setAtmosphereMode]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stroke = q('.ink-brush-path')[0];
      const strokeLen = stroke ? stroke.getTotalLength() : 1800;

      if (stroke) {
        gsap.set(stroke, { strokeDasharray: strokeLen, strokeDashoffset: strokeLen });
      }

      // Initial positions
      gsap.set(q('.brush-nib'), { opacity: 0 });
      gsap.set(q('.ink-droplet'), { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.25,
          onUpdate: (self) => {
            if (self.progress > 0.6) {
              setAtmosphereMode('dust');
            } else {
              setAtmosphereMode('paperDust');
            }
          }
        },
      });

      // 0.0 -> 0.48: Stroke draws out & Nib follows path via MotionPathPlugin
      tl.to(stroke, { strokeDashoffset: 0, ease: 'none', duration: 0.48 }, 0)
        .to(q('.brush-nib'), { opacity: 1, duration: 0.04, ease: 'power1.out' }, 0)
        .to(q('.ink-droplet'), { opacity: 0.8, duration: 0.06 }, 0.02)
        .to(
          q('.brush-nib'),
          {
            motionPath: {
              path: stroke,
              align: stroke,
              alignOrigin: [0.2, 0.8],
              autoRotate: true,
            },
            duration: 0.48,
            ease: 'none',
          },
          0
        )
        // Droplet trails slightly behind the nib
        .to(
          q('.ink-droplet'),
          {
            motionPath: {
              path: stroke,
              align: stroke,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration: 0.48,
            ease: 'none',
          },
          0.02
        )
        .to(q('.hero-scrollhint'), { opacity: 0, duration: 0.1 }, 0.05)

        // Title 1 "KÝ HỌA" reveals via calligraphic mask
        .fromTo(
          q('.title-kyhoa'),
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, ease: 'power2.out', duration: 0.22 },
          0.12
        )

        // Title 2 "SỬ ĐẢNG" reveals in monumental vermilion / gold
        .fromTo(
          q('.title-sudang'),
          { clipPath: 'inset(0 100% 0 0)', opacity: 0, scale: 0.94 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, scale: 1, ease: 'power2.out', duration: 0.26 },
          0.24
        )

        // Subtitle & Meta details emerge
        .fromTo(
          q('.hero-meta'),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, ease: 'power1.out', duration: 0.18 },
          0.40
        )

        // 0.58 -> 1.0: Camera dive into the heart of the red ink
        .to(
          q('.hero-stage'),
          {
            scale: prefersReducedMotion ? 1.05 : 5.6,
            transformOrigin: '50% 50%',
            ease: 'power2.in',
            duration: 0.40,
          },
          0.60
        )
        // Nib fades away into the ink
        .to(q('.brush-nib, .ink-droplet, .hero-meta'), { opacity: 0, duration: 0.12 }, 0.62)

        // World Transformation: Parchment -> Red Vermilion Flood -> Dark Crimson -> 1930 Lacquer
        .to(q('.ink-flood-red'), { opacity: 0.95, ease: 'power1.in', duration: 0.2 }, 0.66)
        .to(q('.ink-flood-dark'), { opacity: 1, ease: 'power2.in', duration: 0.2 }, 0.78)

        // The survival thread line: Continues towards bottom viewport
        .to(q('.continuity-thread'), { strokeDashoffset: 0, duration: 0.25, ease: 'none' }, 0.75);

      tl.to({}, { duration: 1.0 }, 0);
    },
    { scope: root }
  );

  return (
    <section id="hero" ref={root} className="relative h-[230vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#EFE8DC]">
        
        {/* Authentic Antique Parchment Paper Texture Backdrop */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-80 mix-blend-multiply"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, #FAF5ED 0%, #EFE8DC 55%, #DDD1BF 100%)'
          }}
        />

        {/* Paper Grain & Tactile Fiber Watermark */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(183, 25, 24, 0.08) 0%, transparent 40%),
                              radial-gradient(circle at 75% 75%, rgba(255, 205, 0, 0.1) 0%, transparent 45%),
                              repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 4px)`
          }}
        />

        {/* Main Historical Calligraphy Stage */}
        <div className="hero-stage will-transform relative z-10 w-full max-w-5xl flex flex-col items-center justify-center text-center px-6">
          
          {/* Living Vermilion Brush Stroke SVG with Motion Path (Placed behind typography z-0) */}
          <svg 
            viewBox="0 0 1000 360" 
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          >
            <defs>
              <linearGradient id="parchmentInkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8F1713" stopOpacity="0.7" />
                <stop offset="35%" stopColor="#B71918" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#DA251D" stopOpacity="1" />
                <stop offset="100%" stopColor="#C81D17" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Continuous dynamic calligraphic stroke path */}
            <path
              d="M 60,240 Q 240,110 480,180 T 820,130 Q 940,120 950,220 Q 720,280 490,245 T 100,270 Q 300,340 500,350 T 850,330"
              fill="none"
              stroke="url(#parchmentInkGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              className="ink-brush-path opacity-95 drop-shadow-[0_4px_12px_rgba(183,25,24,0.35)]"
            />
          </svg>

          {/* SVG Brush Nib (Quill / Brush Tip with directional orientation - glides on top z-30) */}
          <div className="brush-nib will-transform pointer-events-none absolute w-8 h-8 z-30 -translate-x-1/2 -translate-y-1/2">
            <svg viewBox="0 0 40 40" className="w-full h-full filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              {/* Wooden shaft / brass ferrule */}
              <polygon points="12,4 28,4 24,18 16,18" fill="#4A3423" />
              <polygon points="15,18 25,18 23,26 17,26" fill="#C5A059" />
              {/* Sharp calligraphic pointed nib */}
              <polygon points="17,26 23,26 20,38" fill="#1E1612" stroke="#8F1713" strokeWidth="0.8" />
              {/* Fresh red ink droplet on the tip */}
              <circle cx="20" cy="37" r="2.5" fill="#DA251D" />
            </svg>
          </div>

          {/* Lagging trailing ink droplet */}
          <div className="ink-droplet will-transform pointer-events-none absolute w-2 h-2 rounded-full bg-[#B71918] blur-[0.3px] shadow-[0_0_8px_#DA251D] z-25" />

          {/* Eyebrow Label: Act I Marker */}
          <div className="hero-meta relative z-20 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#241711] text-amber-100 text-xs font-mono font-bold uppercase tracking-[0.3em] mb-4 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#DA251D] animate-ping" />
            <span>HỒI I · KHỞI NGUYÊN NÉT MỰC ĐỘC LẬP</span>
          </div>

          {/* Title Line 1: KÝ HỌA (Archival Sumi Black Ink) */}
          <h2 className="title-kyhoa relative z-20 font-display font-light text-5xl sm:text-7xl md:text-8xl uppercase tracking-[0.3em] text-[#17100C] leading-none">
            KÝ HỌA
          </h2>

          {/* Title Line 2: SỬ ĐẢNG (Deep Lacquer Vermilion) */}
          <h1 className="title-sudang relative z-20 font-display font-black text-6xl sm:text-8xl md:text-[140px] uppercase tracking-tight leading-none text-[#B71918] drop-shadow-[0_4px_24px_rgba(183,25,24,0.35)] mt-3">
            SỬ ĐẢNG
          </h1>

          {/* Subtitle & Single Hook Sentence */}
          <div className="hero-meta relative z-20 mt-6 max-w-xl mx-auto space-y-2">
            <p className="font-heading italic text-lg sm:text-2xl text-[#3A2A20] font-semibold">
              Bản Hùng Ca Điện Biên Phủ & Kỷ Nguyên Độc Lập
            </p>
          </div>

        </div>

        {/* Scroll Hint */}
        <div className="hero-scrollhint pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#5C4537] font-bold">
            Cuộn để bắt đầu câu chuyện
          </span>
          <div className="w-4 h-7 rounded-full border-2 border-[#5C4537]/50 flex items-start justify-center p-1">
            <span className="w-1 h-2 bg-[#B71918] rounded-full animate-bounce" />
          </div>
        </div>

        {/* =========================================================================
            CROSS-SCENE CONTINUITY: CAMERA DIVE INTO RED INK & TRANSITION TO 1930
           ========================================================================= */}
        {/* Layer 1: Red Vermilion Ink Floods Screen */}
        <div className="ink-flood-red pointer-events-none absolute inset-0 z-35 bg-[#B71918] opacity-0 mix-blend-multiply transition-opacity duration-300" />

        {/* Layer 2: Deep Crimson to Archival Lacquer Black Transition */}
        <div className="ink-flood-dark pointer-events-none absolute inset-0 z-40 bg-[#090706] opacity-0 flex flex-col items-center justify-center">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.5em] text-amber-200/70 block">
              BƯỚC VÀO KHÔNG GIAN BÍ MẬT NĂM
            </span>
            <span className="font-display font-black text-6xl sm:text-8xl text-white tracking-widest text-glow-gold">
              1930
            </span>
            <p className="text-xs font-serif italic text-amber-100/60 max-w-sm mx-auto">
              Hương Cảng · Hội nghị thành lập Đảng & Cương lĩnh chính trị đầu tiên
            </p>
          </div>

          {/* Connecting Red Ink Thread plunging out of bottom viewport towards 1930 */}
          <svg viewBox="0 0 100 120" className="w-12 h-20 absolute bottom-0 pointer-events-none">
            <path
              d="M 50,0 Q 40,60 50,120"
              fill="none"
              stroke="#DA251D"
              strokeWidth="4"
              strokeLinecap="round"
              className="continuity-thread drop-shadow-[0_0_10px_#DA251D]"
            />
          </svg>
        </div>

      </div>
    </section>
  );
}
