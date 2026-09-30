import React, { useRef, useEffect } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { soundSynth } from '../utils/soundSynth';
import { useExperience } from '../context/ExperienceContext';
import { FileText, Stamp, Sparkles } from 'lucide-react';

/**
 * DOCUMENT DESK 1930 — BÀN TÀI LIỆU LỊCH SỬ CỬU LONG (HƯƠNG CẢNG)
 * Phiên bản V3 World Space (Loại bỏ hoàn toàn layout flex-row 2 cột dạng web):
 * - Toàn bộ scene là một "World" bàn làm việc bí mật nhìn từ trên xuống (Top-down physical desk).
 * - Mọi vật thể (Tài liệu Cương lĩnh, Ảnh tư liệu Cửu Long, Bì thư mật, Bút chấm mực) định vị không gian tuyệt đối.
 * - Camera ban đầu nhìn bao quát (scale 0.8 -> 1.05), pan dần vào trọng tâm bản thảo.
 * - Con dấu đỏ đập xuống "THỤP" với back.out(2) + rung màn hình + tiếng thud chân thực.
 * - Nét mực son từ con dấu chảy lan ra mép bàn và thoát xuống đáy viewport kết nối sang Tuyên ngôn Độc lập.
 */
export default function DocumentDesk1930() {
  const root = useRef(null);
  const { setAtmosphereMode } = useExperience();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const deskCamera = q('.desk-camera')[0];
      const stampMark = q('.desk-stamp')[0];
      const inkBleedLine = q('.desk-ink-bleed')[0];
      const strokeLen = inkBleedLine ? inkBleedLine.getTotalLength() : 900;

      if (inkBleedLine) {
        gsap.set(inkBleedLine, { strokeDasharray: strokeLen, strokeDashoffset: strokeLen });
      }

      // Initial camera and stamp
      gsap.set(deskCamera, { scale: 0.82, y: 30, transformOrigin: '50% 45%' });
      gsap.set(stampMark, { scale: 3.2, opacity: 0, rotate: -35, y: -80 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.9,
          onUpdate: (self) => {
            if (self.progress > 0.52 && self.progress < 0.60 && !self._stampPlayed) {
              soundSynth.playStampThud();
              self._stampPlayed = true;
            } else if (self.progress < 0.45) {
              self._stampPlayed = false;
            }

            if (self.progress > 0.85) {
              setAtmosphereMode('dust');
            }
          },
        },
      });

      // 0.0 -> 0.45: Camera glides down over secret desk space, panning subtly into manuscript
      tl.to(
        deskCamera,
        {
          scale: 1.06,
          y: -10,
          ease: 'power1.out',
          duration: 0.45,
        },
        0
      )
        // Subtle perspective shifts of desk props
        .to(q('.desk-photo-pin'), { rotate: 3, y: -5, duration: 0.4 }, 0.05)
        .to(q('.desk-document-sheet'), { rotate: -1, y: -8, duration: 0.4 }, 0.02)

        // 0.48 -> 0.60: The Red Seal Stamp plunges down with high-impact back.out(2)
        .to(
          stampMark,
          {
            scale: 1.0,
            opacity: 1,
            rotate: -8,
            y: 0,
            ease: 'back.out(2)',
            duration: 0.14,
          },
          0.50
        )
        // Screen & Desk shake reaction on impact
        .to(deskCamera, { y: -16, duration: 0.04, yoyo: true, repeat: 3, ease: 'none' }, 0.54)

        // 0.60 -> 1.0: Living red ink line bleeds out from the stamp across the desk toward bottom
        .to(inkBleedLine, { strokeDashoffset: 0, ease: 'none', duration: 0.4 }, 0.58)
        .fromTo(q('.desk-academic-cite'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25 }, 0.65);

      tl.to({}, { duration: 1.0 }, 0);
    },
    { scope: root }
  );

  return (
    <section id="m-1930" ref={root} className="relative h-[200vh] bg-[#090706]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4">
        
        {/* Top-down kerosene spotlight warm glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, #241912 0%, #0c0907 60%, #040303 100%)'
          }}
        />

        {/* Ambient Dossier Header Badge */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b140f]/90 border border-amber-800/40 text-amber-200 text-xs font-mono uppercase tracking-widest shadow-2xl backdrop-blur-md">
            <FileText className="w-3.5 h-3.5 text-vn-gold" />
            <span>Hồ Sơ Mật Số 01 · Bàn Làm Việc Bí Mật Cửu Long (03/02/1930)</span>
          </div>
        </div>

        {/* The Desk Camera Stage (Scales and pans dynamically) */}
        <div className="desk-camera will-transform relative z-10 w-full max-w-5xl h-[80vh] sm:h-[84vh] rounded-3xl bg-[#140e0a] border-2 border-amber-950/70 shadow-[0_35px_100px_rgba(0,0,0,0.95)] overflow-hidden">
          
          {/* Desk Wood Texture & Vignette */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 2px, transparent 2px, transparent 12px),
                                radial-gradient(circle at 50% 50%, rgba(255, 205, 0, 0.1) 0%, transparent 65%)`
            }}
          />

          {/* =========================================================================
              PROP 1: TOP-LEFT DOSSIER LABEL & YEAR HEADING (SPATIAL POSITION)
             ========================================================================= */}
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20 pointer-events-none">
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-vn-gold/80 block">
              MỐC SON THÀNH LẬP ĐẢNG
            </span>
            <h2 className="font-display font-black text-6xl sm:text-8xl text-white tracking-tighter leading-none text-glow-gold drop-shadow-xl mt-1">
              1930
            </h2>
            <p className="font-display font-bold text-sm sm:text-lg text-amber-200/90 uppercase tracking-wide mt-1">
              Hội Nghị Hợp Nhất & Cương Lĩnh Đầu Tiên
            </p>
          </div>

          {/* =========================================================================
              PROP 2: TOP-RIGHT PINNED ARCHIVAL PHOTOGRAPH (SPATIAL POSITION)
             ========================================================================= */}
          <div className="desk-photo-pin will-transform absolute top-6 right-6 sm:top-8 sm:right-10 w-44 sm:w-60 z-20 rotate-[4deg] rounded-lg bg-[#FAF5EB] p-2 sm:p-2.5 shadow-[0_20px_45px_rgba(0,0,0,0.85)] border border-amber-900/30">
            {/* Antique photo corners */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-950 pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-950 pointer-events-none" />
            
            <div className="relative aspect-[4/3] overflow-hidden rounded bg-black">
              <img
                src="/images/exhibits/exhibit_1_2.jpg"
                alt="Hội nghị thành lập Đảng 1930 tại Hương Cảng"
                className="w-full h-full object-cover filter contrast-125 sepia-[0.35]"
                loading="lazy"
              />
            </div>
            <p className="mt-1.5 text-center text-[9px] sm:text-[10px] font-mono text-amber-950 uppercase tracking-wider font-semibold">
              Cửu Long (Hương Cảng) · 03/02/1930
            </p>
          </div>

          {/* =========================================================================
              PROP 3: CENTER HISTORICAL MANUSCRIPT (SPATIAL POSITION)
             ========================================================================= */}
          <div className="desk-document-sheet will-transform absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] sm:-translate-y-[42%] w-[92%] sm:w-[500px] md:w-[560px] p-6 sm:p-8 rounded-xl bg-[#EBE2D0] text-[#1A1410] shadow-[0_30px_70px_rgba(0,0,0,0.9)] border border-amber-900/40 rotate-[-1.5deg] z-15">
            
            {/* Paper Corner fold */}
            <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-amber-800/40 bg-[#D8CFBD] -rotate-45 translate-x-4 -translate-y-4" />

            <div className="flex items-center justify-between border-b border-amber-900/30 pb-2 mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900">
                BẢN THẢO VĂN KIỆN LỊCH SỬ
              </span>
              <span className="text-[10px] font-mono text-amber-900/60 font-semibold">
                Lưu trữ mật
              </span>
            </div>

            <h3 className="font-serif font-black text-base sm:text-xl text-[#8F1713] uppercase tracking-wide mb-2 text-center">
              Chánh Cương Vắn Tắt Của Đảng
            </h3>

            <p className="font-serif italic text-xs sm:text-sm text-[#2A1F18] leading-relaxed text-justify">
              “Chủ trương làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản... Đánh đổ đế quốc chủ nghĩa Pháp và bọn phong kiến, làm cho nước Nam hoàn toàn độc lập.”
            </p>

            <div className="mt-4 pt-3 border-t border-amber-900/25 flex items-center justify-between text-[11px] font-mono text-amber-950/70">
              <span>Chủ trì: Nguyễn Ái Quốc</span>
              <span>Địa điểm: Hương Cảng</span>
            </div>

            {/* Target imprint circle where stamp lands */}
            <div className="absolute -bottom-4 right-6 sm:right-10 w-24 h-24 rounded-full border border-dashed border-[#B71918]/30 pointer-events-none" />
          </div>

          {/* =========================================================================
              PROP 4: BOTTOM-LEFT ANTIQUE PEN & DOSSIER TAB
             ========================================================================= */}
          <div className="absolute bottom-5 left-6 sm:bottom-8 sm:left-10 z-20 hidden sm:flex items-center gap-3 pointer-events-none opacity-80">
            {/* Antique dipping pen SVG */}
            <svg viewBox="0 0 160 30" className="w-36 h-8 rotate-[-12deg]">
              <polygon points="10,15 140,12 140,18" fill="#5A3D28" />
              <polygon points="140,11 150,11 150,19 140,19" fill="#C5A059" />
              <polygon points="150,12 160,15 150,18" fill="#1A1410" />
            </svg>
            <span className="text-[10px] font-mono uppercase text-amber-200/50">
              Bút ký Cương lĩnh 1930
            </span>
          </div>

          {/* =========================================================================
              PROP 5: PHYSICAL RED WAX STAMP (IMPACTS DOWN ON SCROLL)
             ========================================================================= */}
          <div className="desk-stamp will-transform absolute bottom-12 sm:bottom-14 right-10 sm:right-28 pointer-events-none z-30">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-dashed border-[#DA251D] bg-[#750e0a]/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-2 shadow-[0_0_50px_rgba(218,37,29,0.85)] text-vn-red">
              <Stamp className="w-6 h-6 mb-1 text-vn-gold" />
              <span className="text-[10px] font-black uppercase font-mono tracking-widest text-white leading-tight">
                ĐẢNG CỘNG SẢN<br />VIỆT NAM
              </span>
              <span className="text-[9px] font-mono font-bold text-vn-gold mt-0.5">
                03 · 02 · 1930
              </span>
            </div>
          </div>

          {/* =========================================================================
              PROP 6: LIVING RED INK LINE BLEEDING FROM STAMP ACROSS THE DESK
             ========================================================================= */}
          <svg 
            viewBox="0 0 500 400" 
            className="absolute bottom-0 right-0 w-96 h-80 pointer-events-none z-35 overflow-visible"
          >
            <path
              d="M 380,180 Q 420,270 360,340 T 260,440"
              fill="none"
              stroke="#DA251D"
              strokeWidth="5"
              strokeLinecap="round"
              className="desk-ink-bleed drop-shadow-[0_0_15px_rgba(218,37,29,0.9)]"
            />
          </svg>

          {/* Academic citation anchor */}
          <div className="desk-academic-cite absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-center w-full px-4 pointer-events-none">
            <p className="text-[10px] sm:text-[11px] font-mono text-amber-200/50 italic">
              [Tư liệu chuẩn]: NXB Chính trị Quốc gia Sự thật (2021), Giáo trình Lịch sử Đảng Cộng sản Việt Nam, tr. 45–50.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
