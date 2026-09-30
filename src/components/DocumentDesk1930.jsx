import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { soundSynth } from '../utils/soundSynth';
import { FileText, Stamp, Sparkles } from 'lucide-react';

/**
 * DOCUMENT DESK 1930 — BÀN TÀI LIỆU LỊCH SỬ HƯƠNG CẢNG
 * Thay thế hoàn toàn MilestoneChapter template cũ cho năm 1930.
 * Không gian nhìn từ trên xuống: Bàn làm việc bí mật tại Cửu Long (Hương Cảng).
 * Tờ Cương lĩnh chính trị đầu tiên xoay phẳng, ảnh tư liệu ghim trên bàn,
 * con dấu đỏ của Đảng đóng xuống "THỤP" với hiệu ứng rung chấn, nét mực son
 * từ con dấu chảy ra ngoài mép bàn tiếp tục hành trình sang 1941!
 */
export default function DocumentDesk1930() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const deskTable = q('.desk-surface');
      const docSheet = q('.desk-document');
      const photoFrame = q('.desk-photo');
      const stampMark = q('.desk-stamp');
      const inkBleedLine = q('.desk-ink-bleed');
      const strokeLen = inkBleedLine[0] ? inkBleedLine[0].getTotalLength() : 800;

      if (inkBleedLine[0]) {
        gsap.set(inkBleedLine[0], { strokeDasharray: strokeLen, strokeDashoffset: strokeLen });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            // Trigger stamp sound right at impact point ~0.55
            if (self.progress > 0.52 && self.progress < 0.58 && !self._stampPlayed) {
              soundSynth.playStampThud();
              self._stampPlayed = true;
            } else if (self.progress < 0.45) {
              self._stampPlayed = false;
            }
          }
        },
      });

      // 0.0 -> 0.40: Camera glides down over the desk, papers align from tilted to flat
      tl.fromTo(deskTable, { scale: 0.94, opacity: 0.5 }, { scale: 1.0, opacity: 1, ease: 'none', duration: 0.4 }, 0)
        .fromTo(docSheet, { rotateZ: -6, y: 30 }, { rotateZ: 0, y: 0, ease: 'power1.out', duration: 0.4 }, 0)
        .fromTo(photoFrame, { rotateZ: 4, y: 20 }, { rotateZ: -1, y: 0, ease: 'power1.out', duration: 0.4 }, 0.05)

        // 0.45 -> 0.60: The Red Seal Stamp plunges down with impact
        .fromTo(stampMark, 
          { scale: 2.4, opacity: 0, rotate: -25 }, 
          { scale: 1.0, opacity: 1, rotate: -8, ease: 'back.out(2)', duration: 0.15 }, 
          0.48
        )
        // Screen shake effect on impact
        .to(deskTable, { y: -5, duration: 0.04, yoyo: true, repeat: 3, ease: 'none' }, 0.53)

        // 0.60 -> 1.0: Red ink line bleeds out from the stamp across the desk toward 1941
        .to(inkBleedLine, { strokeDashoffset: 0, ease: 'none', duration: 0.4 }, 0.58)
        .fromTo(q('.desk-quote-reveal'), { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.25 }, 0.62);

      tl.to({}, { duration: 1.0 }, 0);
    },
    { scope: root }
  );

  return (
    <section id="m-1930" ref={root} className="relative h-[180vh] bg-[#090706]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4 sm:px-8">
        
        {/* Top-Down Desk Spotlight & Grain */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background: 'radial-gradient(circle at 45% 40%, #1f1712 0%, #0c0907 60%, #050403 100%)'
          }}
        />

        {/* Vintage Desk Surface */}
        <div className="desk-surface will-transform relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Column: Historical Platform Document */}
          <div className="flex-1 w-full max-w-xl text-left">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#1c140f] border border-amber-800/40 text-amber-200 text-xs font-mono uppercase tracking-widest mb-3 shadow-lg">
              <FileText className="w-3.5 h-3.5 text-vn-gold" />
              <span>Hồ Sơ Mật Số 01 · Cửu Long 03/02/1930</span>
            </div>

            <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl text-white tracking-tight leading-none">
              1930
            </h2>

            <h3 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-amber-200 uppercase tracking-wide mt-2">
              Thành Lập Đảng & Cương Lĩnh Đầu Tiên
            </h3>

            {/* Document Sheet simulating manuscript on desk */}
            <div className="desk-document will-transform mt-5 p-6 rounded-xl bg-[#17120e] border border-amber-900/50 shadow-2xl relative overflow-hidden">
              
              {/* Folded paper corner flourish */}
              <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-amber-800/40 bg-[#251d16] -rotate-45 translate-x-4 -translate-y-4" />

              <span className="text-[11px] font-mono font-bold text-vn-gold uppercase tracking-wider block mb-2">
                Trích Bản Thảo Cương Lĩnh Chính Trị Đầu Tiên:
              </span>

              <p className="font-serif italic text-sm sm:text-base text-amber-100/90 leading-relaxed">
                “Chủ trương làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản... Đánh đổ đế quốc chủ nghĩa Pháp và bọn phong kiến, làm cho nước Nam hoàn toàn độc lập.”
              </p>

              <div className="mt-4 pt-3 border-t border-amber-900/30 flex items-center justify-between text-xs text-amber-200/60 font-mono">
                <span>Nguyễn Ái Quốc chủ trì</span>
                <span>Hương Cảng, Trung Quốc</span>
              </div>
            </div>

            {/* Academic citation */}
            <p className="desk-quote-reveal mt-3 text-[11px] font-mono text-vn-ivory/50 italic">
              [Tư liệu chuẩn]: NXB Chính trị Quốc gia Sự thật (2021), Giáo trình Lịch sử Đảng, tr. 45–50.
            </p>

          </div>

          {/* Right Column: Archival Photograph & Red Wax Stamp */}
          <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/3] flex items-center justify-center">
            
            {/* The Archival Photograph with antique mounts */}
            <div className="desk-photo will-transform relative w-full h-full rounded-xl bg-[#120e0c] border-2 border-amber-900/60 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-3 overflow-hidden">
              <img
                src="/images/exhibits/exhibit_1_2.jpg"
                alt="Hội nghị thành lập Đảng 1930"
                className="w-full h-full object-contain rounded-lg filter contrast-125 sepia-[0.3]"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-4 right-4 text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-200/70">
                  Tư liệu gốc: Hội nghị hợp nhất tại Cửu Long (Hương Cảng)
                </span>
              </div>
            </div>

            {/* Red Wax Stamp (Impacts down on scroll) */}
            <div className="desk-stamp will-transform absolute -bottom-5 -right-4 pointer-events-none z-20">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-dashed border-vn-red bg-red-950/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-2 shadow-[0_0_40px_rgba(218,37,29,0.7)] text-vn-red">
                <Stamp className="w-6 h-6 mb-1 text-vn-gold" />
                <span className="text-[10px] font-black uppercase font-mono tracking-widest text-white leading-tight">
                  ĐẢNG CỘNG SẢN<br />VIỆT NAM
                </span>
                <span className="text-[9px] font-mono font-bold text-vn-gold mt-0.5">
                  03 · 02 · 1930
                </span>
              </div>
            </div>

            {/* Living Red Ink Line Bleeding out from the Stamp towards 1941 */}
            <svg 
              viewBox="0 0 400 300" 
              className="absolute -bottom-24 -right-16 w-80 h-60 pointer-events-none z-30 overflow-visible"
            >
              <path
                d="M 330,120 Q 360,200 320,260 T 260,340"
                fill="none"
                stroke="#DA251D"
                strokeWidth="5"
                strokeLinecap="round"
                className="desk-ink-bleed drop-shadow-[0_0_12px_rgba(218,37,29,0.8)]"
              />
            </svg>

          </div>

        </div>

      </div>
    </section>
  );
}
