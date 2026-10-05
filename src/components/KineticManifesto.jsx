import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/**
 * KINETIC MANIFESTO — NGHỆ THUẬT TYPOGRAPHY ĐIỆN ẢNH
 * Đập bỏ hoàn toàn WordCascade card/dots/badge của repo clone.
 * Dùng chuyển động chữ thuần khiết (Kinetic Typography) để truyền tải sức nặng tư tưởng:
 * 
 * Mode 1: "cuong-linh" (1930: Độc Lập - Tự Do - Hạnh Phúc)
 * - ĐỘC LẬP scale 1 -> 8, camera xuyên qua khoảng âm của chữ "Ộ"
 * - TỰ và DO từ 2 mép màn hình lao vào với vận tốc cao
 * - Chúng tách ra để HẠNH PHÚC giải phóng từ độ nhòe (blur) sang sắc nét
 * - Tất cả co lại thành 1 dòng: ĐỘC LẬP ─ TỰ DO ─ HẠNH PHÚC
 * - Nét son đỏ quét bên dưới, tiếp tục chảy sang 1941.
 * 
 * Mode 2: "dien-bien" (1954: Khoét Núi - Ngủ Hầm - Mưa Dầm - Lừng Lẫy)
 * - Từng cụm từ trong thơ Tố Hữu giáng xuống với xung lực chiến trường
 * - Dẫn trực tiếp vào Đại Cảnh Liên Hoàn Điện Biên Phủ.
 */
export default function KineticManifesto({
  id = 'kinetic-manifesto',
  mode = 'cuong-linh', // 'cuong-linh' | 'dien-bien'
}) {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (mode === 'cuong-linh') {
        const wordDocLap = q('.km-doc-lap')[0];
        const wordTu = q('.km-tu')[0];
        const wordDo = q('.km-do')[0];
        const wordHanhPhuc = q('.km-hanh-phuc')[0];
        const unifiedLine = q('.km-unified-line')[0];
        const underline = q('.km-red-underline')[0];
        const underLen = underline ? underline.getTotalLength() : 800;

        if (underline) {
          gsap.set(underline, { strokeDasharray: underLen, strokeDashoffset: underLen });
        }

        // Initial setup
        gsap.set(wordDocLap, { opacity: 0, y: -20, scale: 0.95 });
        gsap.set(wordTu, { x: '-60vw', opacity: 0 });
        gsap.set(wordDo, { x: '60vw', opacity: 0 });
        gsap.set(wordHanhPhuc, { opacity: 0, scale: 0.8, filter: 'blur(15px)' });
        gsap.set(unifiedLine, { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.35,
          },
        });

        // 0.0 -> 0.25: ĐỘC LẬP is imprinted clearly from the 1930 thesis
        tl.to(
          wordDocLap,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power2.out',
            duration: 0.22,
          },
          0
        )

        // 0.20 -> 0.45: TỰ and DO glide in smoothly
        .to(wordTu, { x: '-18vw', opacity: 1, ease: 'power2.out', duration: 0.2 }, 0.20)
        .to(wordDo, { x: '18vw', opacity: 1, ease: 'power2.out', duration: 0.2 }, 0.20)

        // 0.35 -> 0.55: HẠNH PHÚC de-blurs in center
        .to(wordTu, { x: '-26vw', ease: 'power2.inOut', duration: 0.18 }, 0.35)
        .to(wordDo, { x: '26vw', ease: 'power2.inOut', duration: 0.18 }, 0.35)
        .to(
          wordHanhPhuc,
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            ease: 'power2.out',
            duration: 0.2,
          },
          0.38
        )

        // 0.55 -> 0.75: Words converge seamlessly into the monumental unified motto
        .to([wordDocLap, wordTu, wordDo, wordHanhPhuc], { opacity: 0, scale: 0.95, duration: 0.15 }, 0.55)
        .to(unifiedLine, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.18 }, 0.60)

        // 0.70 -> 1.0: Living red calligraphic line sweeps across underneath into 1941
        .to(underline, { strokeDashoffset: 0, ease: 'none', duration: 0.25 }, 0.68)
        .fromTo(q('.km-footnote'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.15 }, 0.75);

        tl.to({}, { duration: 1.0 }, 0);
      } else {
        // Mode: 'dien-bien' (Khoét Núi - Ngủ Hầm - Mưa Dầm - Lừng Lẫy)
        const words = q('.km-db-word');
        gsap.set(words, { opacity: 0, scale: 1.6, filter: 'blur(10px)' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.45,
          },
        });

        // Staggered rhythmic kinetic typographic impacts
        words.forEach((w, i) => {
          const start = i * 0.24;
          tl.to(
            w,
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.18,
              ease: 'power3.out',
            },
            start
          );

          if (i < words.length - 1) {
            tl.to(
              w,
              {
                opacity: 0.15,
                scale: 0.85,
                duration: 0.15,
                ease: 'power1.in',
              },
              start + 0.2
            );
          }
        });

        tl.fromTo(
          q('.km-db-summary'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.2 },
          0.82
        );

        tl.to({}, { duration: 1.0 }, 0);
      }
    },
    { scope: root, dependencies: [mode] }
  );

  if (mode === 'cuong-linh') {
    return (
      <section id={id} ref={root} className="relative h-[140vh] bg-[#090706] text-white">
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4">
          
          {/* Subtle Radial Glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-radial-gradient from-vn-red/15 via-vn-gold/5 to-transparent blur-3xl pointer-events-none" />

          {/* Phase A: ĐỘC LẬP (Scales 1 -> 8) */}
          <div className="km-doc-lap will-transform absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <h2 className="font-display font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter uppercase text-white text-glow-gold drop-shadow-2xl">
              ĐỘC LẬP
            </h2>
          </div>

          {/* Phase B & C: TỰ - HẠNH PHÚC - DO (Moving inward & de-blurring) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-15">
            <span className="km-tu will-transform font-display font-black text-5xl sm:text-7xl md:text-8xl uppercase tracking-tight text-white drop-shadow-2xl">
              TỰ
            </span>
            <span className="km-hanh-phuc will-transform font-display font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-vn-gold text-glow-gold drop-shadow-2xl mx-4">
              HẠNH PHÚC
            </span>
            <span className="km-do will-transform font-display font-black text-5xl sm:text-7xl md:text-8xl uppercase tracking-tight text-white drop-shadow-2xl">
              DO
            </span>
          </div>

          {/* Phase D: Unified Monumental Line */}
          <div className="km-unified-line will-transform relative z-30 flex flex-col items-center justify-center text-center px-4 max-w-5xl">
            <h2 className="font-display font-black text-3xl sm:text-5xl md:text-7xl text-white tracking-wide uppercase leading-tight drop-shadow-2xl">
              ĐỘC LẬP <span className="text-vn-red font-light">─</span> TỰ DO <span className="text-vn-red font-light">─</span> HẠNH PHÚC
            </h2>

            {/* Living Red Calligraphic Underline SVG */}
            <svg viewBox="0 0 700 30" className="w-full max-w-2xl h-8 mt-3 pointer-events-none overflow-visible">
              <path
                d="M 10,15 Q 350,2 690,18"
                fill="none"
                stroke="#DA251D"
                strokeWidth="4"
                strokeLinecap="round"
                className="km-red-underline drop-shadow-[0_0_12px_#DA251D]"
              />
            </svg>

            {/* Discreet Academic Citation Footnote */}
            <div className="km-footnote mt-6 space-y-1 text-center pointer-events-none">
              <p className="font-heading italic text-sm sm:text-lg text-amber-200/90 font-medium">
                "Ngọn cờ tư tưởng bách chiến bách thắng của Đảng Cộng sản Việt Nam"
              </p>
              <p className="text-[11px] font-mono text-vn-ivory/50">
                [Cương lĩnh chính trị đầu tiên 1930] · Xác lập đường lối độc lập dân tộc gắn liền với chủ nghĩa xã hội
              </p>
            </div>
          </div>

        </div>
      </section>
    );
  }

  // Mode: 'dien-bien'
  return (
    <section id={id} ref={root} className="relative h-[220vh] bg-[#07090c] text-white">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4">
        
        {/* Battlefield Red Radial Glow */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-radial-gradient from-vn-red/25 via-red-950/15 to-transparent blur-3xl pointer-events-none" />

        {/* Sequential Kinetic Typographic Impacts */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-4 max-w-4xl">
          <div className="km-db-word will-transform font-display font-black text-5xl sm:text-7xl md:text-8xl text-white tracking-tight leading-none uppercase">
            KHOÉT NÚI
          </div>
          <div className="km-db-word will-transform font-display font-black text-5xl sm:text-7xl md:text-8xl text-amber-200 tracking-tight leading-none uppercase">
            NGỦ HẦM
          </div>
          <div className="km-db-word will-transform font-display font-black text-5xl sm:text-7xl md:text-8xl text-red-400 tracking-tight leading-none uppercase">
            MƯA DẦM
          </div>
          <div className="km-db-word will-transform font-display font-black text-6xl sm:text-8xl md:text-9xl text-vn-gold text-glow-gold tracking-tight leading-none uppercase">
            LỪNG LẪY
          </div>

          <div className="km-db-summary will-transform pt-6 text-center space-y-2 pointer-events-none">
            <p className="font-heading italic text-base sm:text-xl text-vn-ivory/90">
              "56 ngày đêm bão lửa bóp nghẹt lòng chảo Mường Thanh"
            </p>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-red-400/80">
              Mở màn chiến dịch Điện Biên Phủ 1954 ↓
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
