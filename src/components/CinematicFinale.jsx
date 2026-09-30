import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useExperience } from '../context/ExperienceContext';

/**
 * CINEMATIC FINALE — HỒI KẾT & CALLBACK NÉT MỰC SON
 * Thực hiện ý tưởng của review.md #14:
 * Thay vì timeline tĩnh, toàn bộ dòng thời gian là một nét mực son được vẽ lại:
 * 1. Ban đầu camera zoom cận cảnh vào điểm son đỏ hiện tại ● (Khát vọng tương lai)
 * 2. Scroll: Camera zoom out dần (scale 3.2 -> 1.0)
 * 3. Nét son đỏ quét lùi lại qua từng mốc son:
 *    ● ───── 1986 ───── 1975 ───── 1954 ───── 1945 ───── 1930
 * 4. Người xem nhận ra: Nét mực ở giây đầu tiên của InkHero chính là hành trình lịch sử hào hùng họ vừa đi qua!
 */
export default function CinematicFinale() {
  const root = useRef(null);
  const { prefersReducedMotion } = useExperience();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const timelineLine = q('.finale-stroke')[0];
      const strokeLen = timelineLine ? timelineLine.getTotalLength() : 1000;

      if (timelineLine) {
        gsap.set(timelineLine, { strokeDasharray: strokeLen, strokeDashoffset: strokeLen });
      }

      // Initial zoom on current point ● (bypass extreme zoom in reduced motion mode)
      gsap.set(q('.finale-camera'), { 
        scale: prefersReducedMotion ? 1.0 : 2.8, 
        x: prefersReducedMotion ? 0 : 180, 
        transformOrigin: '75% 50%' 
      });
      gsap.set(q('.fn-node-1930, .fn-node-1945, .fn-node-1954, .fn-node-1975, .fn-node-1986'), { opacity: 0, scale: 0.5 });
      gsap.set(q('.finale-quote'), { opacity: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.85,
        },
      });

      // 0.0 -> 0.65: Camera zooms out and red stroke draws from present backward to 1930
      tl.to(
        q('.finale-camera'),
        {
          scale: 1.0,
          x: 0,
          ease: 'power2.inOut',
          duration: 0.65,
        },
        0
      )
      // Stroke draws across timeline
      .to(timelineLine, { strokeDashoffset: 0, ease: 'none', duration: 0.65 }, 0)

      // Sequentially reveals nodes from right to left
      .to(q('.fn-node-1986'), { opacity: 1, scale: 1, duration: 0.1 }, 0.12)
      .to(q('.fn-node-1975'), { opacity: 1, scale: 1, duration: 0.1 }, 0.25)
      .to(q('.fn-node-1954'), { opacity: 1, scale: 1, duration: 0.1 }, 0.38)
      .to(q('.fn-node-1945'), { opacity: 1, scale: 1, duration: 0.1 }, 0.50)
      .to(q('.fn-node-1930'), { opacity: 1, scale: 1, duration: 0.1 }, 0.62)

      // Closure quote & CTA reveal
      .to(q('.finale-quote'), { opacity: 1, y: 0, ease: 'power2.out', duration: 0.25 }, 0.70);

      tl.to({}, { duration: 1.0 }, 0);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-[220vh] bg-gradient-to-b from-[#0a0d12] via-[#0f1724] to-vn-black overflow-hidden border-t border-vn-gold/20">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4 text-center">
        
        {/* Golden Radial Glow */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-radial-gradient from-vn-gold/20 via-vn-red/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6">
          
          <span className="inline-block px-4 py-1.5 rounded-full bg-vn-charcoal border border-vn-gold/50 text-vn-gold text-xs font-mono font-bold uppercase tracking-widest shadow-xl">
            ★ KHÁT VỌNG VIỆT NAM HÙNG CƯỜNG
          </span>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
            Độc Lập · Tự Do · Hòa Bình · Phát Triển
          </h2>

          {/* Animated Timeline Camera & Living Red Ink Vector */}
          <div className="finale-camera will-transform relative my-8 py-6 w-full max-w-3xl mx-auto">
            
            <svg viewBox="0 0 800 60" className="w-full h-12 overflow-visible">
              <defs>
                <linearGradient id="finaleRedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8F1713" />
                  <stop offset="50%" stopColor="#DA251D" />
                  <stop offset="100%" stopColor="#FFCD00" />
                </linearGradient>
              </defs>

              {/* The living unbroken red timeline stroke */}
              <path
                d="M 50,30 L 750,30"
                fill="none"
                stroke="url(#finaleRedGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                className="finale-stroke drop-shadow-[0_0_12px_#DA251D]"
              />
            </svg>

            {/* Timeline nodes overlay */}
            <div className="absolute inset-0 flex items-center justify-between px-6 text-xs font-mono font-bold">
              
              <div className="fn-node-1930 will-transform flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-black shadow-[0_0_10px_#f59e0b]" />
                <span className="mt-2 text-amber-300">1930</span>
              </div>

              <div className="fn-node-1945 will-transform flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-vn-red border-2 border-black shadow-[0_0_10px_#DA251D]" />
                <span className="mt-2 text-red-300">1945</span>
              </div>

              <div className="fn-node-1954 will-transform flex flex-col items-center">
                <span className="w-4 h-4 rounded-full bg-vn-gold border-2 border-black shadow-[0_0_15px_#FFCD00]" />
                <span className="mt-2 text-vn-gold font-black">1954</span>
              </div>

              <div className="fn-node-1975 will-transform flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400 border-2 border-black shadow-[0_0_10px_#ef4444]" />
                <span className="mt-2 text-red-300">1975</span>
              </div>

              <div className="fn-node-1986 will-transform flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-sky-400 border-2 border-black shadow-[0_0_10px_#38bdf8]" />
                <span className="mt-2 text-sky-300">1986</span>
              </div>

              {/* Present / Future Node ● */}
              <div className="flex flex-col items-center">
                <span className="w-4 h-4 rounded-full bg-vn-red shadow-[0_0_20px_#DA251D] animate-ping" />
                <span className="mt-2 text-vn-gold font-black">NAY</span>
              </div>

            </div>
          </div>

          {/* Closure Poetic Thought */}
          <div className="finale-quote will-transform space-y-4 max-w-2xl mx-auto">
            <p className="font-heading italic text-base sm:text-xl text-vn-ivory/90 leading-relaxed font-normal">
              "Toàn bộ lịch sử vẻ vang của dân tộc ta là một nét ký họa son sắt không bao giờ đứt đoạn — từ ngọn cờ lãnh đạo của Đảng đến khát vọng độc lập, tự do và trường tồn của Tổ quốc."
            </p>

            <div className="pt-4">
              <a
                href="#khong-gian-khao-cuu"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-vn-gold to-amber-500 text-vn-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider shadow-2xl hover:scale-105 transition-transform"
              >
                <span>Bước Vào Không Gian Khảo Cứu & Bảo Tàng Số ↓</span>
              </a>
              <p className="mt-2 text-xs font-mono text-vn-ivory/50">
                (Phim tư liệu 35mm · Giám định hiện vật kháng chiến · Khảo thí trắc nghiệm)
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
