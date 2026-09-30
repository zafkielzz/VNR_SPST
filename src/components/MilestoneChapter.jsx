import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { FileText, Compass, Radio, Flag, Sparkles, Award } from 'lucide-react';

/**
 * MILESTONE CHAPTER (ĐA THỂ LOẠI SCENE THEO TỪNG THỜI KỲ)
 * Thay vì dùng chung 1 template nhàm chán cho cả 8 mốc, component này tự động
 * áp dụng Visual Grammar & Pacing riêng biệt cho từng thời khắc:
 * - 1930 (document): Hồ sơ mật, con dấu lưu trữ, giấy báo cũ Hương Cảng.
 * - 1941 (journey): Suối Lê-nin, núi rừng Pác Bó, hành trình cách mạng.
 * - 1945 (fullscreen-moment): Thời khắc lịch sử Ba Đình, typography cực lớn, cờ đỏ sao vàng toàn màn hình, không đóng card.
 * - 1946 (broadcast): Điện tín phát thanh nửa đêm, radio waves, tính khẩn cấp toàn quốc kháng chiến.
 * - 1954 (tactical/victory): Sắc thái quân sự Mường Phăng & chiến thắng rực lửa trên nóc hầm De Castries.
 * - 1975 (triumph): Đại thắng mùa xuân, ánh sáng thống nhất rạng ngời.
 * - 1986 (modern-transition): Thoát khỏi tone màu tối chiến tranh, sắc xanh navy hiện đại, ánh sáng kỷ nguyên Đổi mới.
 */
export default function MilestoneChapter({ milestone: m, reverse = false }) {
  const root = useRef(null);
  const sceneType = m.sceneType || 'default';

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Subtle photo frame parallax drift
      gsap.fromTo(
        q('.m-frame'),
        { y: 20, scale: 0.98 },
        {
          y: -15,
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

      // Text entrance
      const textElements = q('.m-anim');
      gsap.fromTo(
        textElements,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
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

  // =========================================================================
  // SCENE TYPE 1: FULLSCREEN MOMENT (1945 Ba Đình - Tuyên ngôn Độc lập)
  // =========================================================================
  if (sceneType === 'fullscreen-moment') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[150vh]" 
        style={{ background: m.background }}
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 sm:px-8">
          
          {/* Huge National Star Glow in Background */}
          <div className="absolute w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-radial-gradient from-vn-red/35 via-vn-red-deep/15 to-transparent blur-3xl pointer-events-none animate-pulse duration-1000" />
          
          <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
            
            {/* National Badge */}
            <div className="m-anim inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vn-red/30 border border-vn-gold/60 text-vn-gold text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-2xl">
              <Sparkles className="w-3.5 h-3.5 text-vn-gold" />
              <span>{m.eyebrow}</span>
            </div>

            {/* Giant 1945 Typography */}
            <h2 className="m-anim font-display font-black text-7xl sm:text-9xl md:text-[140px] leading-none text-white text-glow-gold tracking-tighter">
              {m.year}
            </h2>

            {/* Heading */}
            <h3 className="m-anim mt-2 font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase text-vn-gold tracking-wide max-w-4xl">
              {m.heading}
            </h3>

            {/* Centered Archival Visual with borderless halo */}
            <div className="m-frame relative my-6 w-full max-w-md sm:max-w-lg aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(218,37,29,0.5)] border-2 border-vn-gold/60 bg-black">
              <img
                src={m.image}
                alt={m.heading}
                className="w-full h-full object-cover filter contrast-125 sepia-[0.2]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-4 right-4 text-center">
                <span className="text-[11px] font-mono text-vn-gold tracking-widest uppercase">
                  Quảng trường Ba Đình · 02/09/1945
                </span>
              </div>
            </div>

            {/* Key Declaration Text - Borderless, Majestic */}
            <p className="m-anim font-heading text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-white max-w-3xl">
              "{m.keyText}"
            </p>

            <p className="m-anim mt-3 text-xs sm:text-sm italic text-vn-ivory/80 max-w-2xl font-light leading-relaxed">
              {m.caption}
            </p>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENE TYPE: JOURNEY & TOPOGRAPHIC ROUTE (1941 Pác Bó - Cội nguồn cách mạng)
  // =========================================================================
  if (sceneType === 'journey') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[150vh]" 
        style={{ background: m.background }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          
          {/* Mountain Topographic Map Contours Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg viewBox="0 0 1000 600" className="w-full h-full">
              <path d="M 0,200 Q 250,120 500,240 T 1000,180" fill="none" stroke="#2a4532" strokeWidth="1.5" />
              <path d="M 0,350 Q 300,280 600,400 T 1000,320" fill="none" stroke="#2a4532" strokeWidth="1" />
              <path d="M 0,480 Q 200,420 500,500 T 1000,440" fill="none" stroke="#2a4532" strokeWidth="1.5" />
              {/* Mountain peaks */}
              <polygon points="280,180 320,120 360,180" fill="none" stroke="#3b6146" strokeWidth="1" />
              <polygon points="680,240 730,160 780,240" fill="none" stroke="#3b6146" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:gap-14 md:px-12 z-10">
            
            {/* Text column: Expedition / Field Route aesthetic */}
            <div className="order-2 flex-1 text-center md:text-left z-20 md:order-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-[11px] font-mono uppercase tracking-widest mb-3">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>HÀNH TRÌNH PÁC BÓ · 30 NĂM BÔN BA TRỞ VỀ</span>
              </div>

              <h2 className="m-anim font-display text-6xl sm:text-8xl md:text-9xl font-black leading-none text-white tracking-tight">
                {m.year}
              </h2>

              <h3 className="m-anim mt-2 font-display text-xl sm:text-3xl font-bold uppercase text-emerald-200">
                {m.heading}
              </h3>

              <p className="m-anim mt-4 font-mono text-sm sm:text-base text-vn-gold font-bold uppercase tracking-wide">
                {m.keyText}
              </p>

              <div className="m-anim mt-5 p-5 rounded-2xl bg-emerald-950/30 border border-emerald-700/30 backdrop-blur-md">
                <p className="font-sans text-sm sm:text-base italic leading-relaxed text-emerald-100/90 font-light">
                  "{m.caption}"
                </p>
              </div>
            </div>

            {/* Map Pinned Field Photograph */}
            <div className="m-frame relative order-1 w-full max-w-sm md:w-[48%] md:max-w-lg z-20 md:order-1">
              
              {/* Red waypoint connecting line */}
              <svg className="absolute -top-10 -left-6 w-32 h-32 pointer-events-none z-30 overflow-visible">
                <path d="M 0,0 Q 40,60 80,40" fill="none" stroke="#DA251D" strokeWidth="3" strokeDasharray="4 4" />
                <circle cx="80" cy="40" r="5" fill="#DA251D" className="animate-ping" />
                <circle cx="80" cy="40" r="3" fill="#FFCD00" />
              </svg>

              <div className="relative aspect-[4/3] rounded-2xl border-2 border-emerald-600/40 bg-[#08110b] shadow-[0_25px_65px_rgba(0,30,15,0.7)] p-3">
                <img
                  src={m.image}
                  alt={m.heading}
                  className="w-full h-full object-contain rounded-xl contrast-125 sepia-[0.25]"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-center text-[10px] font-mono uppercase tracking-widest text-emerald-300/60">
                Cột mốc 108 biên giới Việt - Trung & Lán Khuổi Nặm, Pác Bó
              </p>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENE TYPE 2: DOCUMENT DOSSIER (1930 Hương Cảng)
  // =========================================================================
  if (sceneType === 'document') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[140vh]" 
        style={{ background: m.background }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:gap-14 md:px-12 z-10">
            
            {/* Text column: Archival folder feel */}
            <div className="order-2 flex-1 text-center md:text-left z-20 md:order-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#1c1815] border border-amber-900/60 text-amber-200 text-[11px] font-mono uppercase tracking-widest mb-3">
                <FileText className="w-3.5 h-3.5 text-vn-gold" />
                <span>HỒ SƠ MẬT SỐ 01 · CỬU LONG 1930</span>
              </div>

              <h2 className="m-anim font-display text-6xl sm:text-8xl md:text-9xl font-black leading-none text-white tracking-tight">
                {m.year}
              </h2>

              <h3 className="m-anim mt-2 font-display text-xl sm:text-3xl font-bold uppercase text-vn-gold-antique">
                {m.heading}
              </h3>

              <p className="m-anim mt-4 font-mono text-sm sm:text-base text-amber-300/90 font-bold uppercase tracking-wide">
                {m.keyText}
              </p>

              {/* Typewriter quote box with wax stamp accent */}
              <div className="m-anim mt-5 p-5 rounded-xl bg-[#161210] border-l-4 border-l-vn-red border-y border-r border-amber-950 text-vn-ivory/90 relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono text-vn-gold/50 border border-vn-gold/30 px-2 py-0.5 rounded">
                  DOC-1930-VNCP
                </div>
                <p className="font-serif text-sm sm:text-base italic leading-relaxed text-amber-100/90">
                  "{m.caption}"
                </p>
              </div>
            </div>

            {/* Framed document photo */}
            <div className="m-frame relative order-1 w-full max-w-sm md:w-[46%] md:max-w-lg z-20 md:order-2">
              <div className="relative aspect-[4/3] rounded-xl border-2 border-amber-800/50 bg-[#120e0c] shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-3">
                <img
                  src={m.image}
                  alt={m.heading}
                  className="w-full h-full object-contain rounded-lg sepia-[0.35] contrast-110"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-center text-[10px] uppercase font-mono tracking-widest text-amber-200/50">
                Bản thảo Cương lĩnh chính trị đầu tiên của Đảng
              </p>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENE TYPE 3: BROADCAST / RESISTANCE CALL (1946 Toàn quốc Kháng chiến)
  // =========================================================================
  if (sceneType === 'broadcast') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[140vh]" 
        style={{ background: m.background }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:gap-14 md:px-12 z-10">
            
            <div className="order-2 flex-1 text-center md:text-left z-20 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-[11px] font-mono uppercase tracking-widest mb-3 animate-pulse">
                <Radio className="w-3.5 h-3.5 text-red-400" />
                <span>PHÁT THANH ĐÊM 19/12/1946 · CHIẾN KHU VIỆT BẮC</span>
              </div>

              <h2 className="m-anim font-display text-6xl sm:text-8xl md:text-9xl font-black leading-none text-white tracking-tight">
                {m.year}
              </h2>

              <h3 className="m-anim mt-2 font-display text-xl sm:text-3xl font-bold uppercase text-red-400">
                {m.heading}
              </h3>

              <div className="m-anim mt-4 p-4 rounded-xl bg-red-950/40 border border-red-500/30">
                <p className="font-heading font-black text-lg sm:text-xl text-white uppercase tracking-wider text-glow-red">
                  "{m.keyText}"
                </p>
              </div>

              <p className="m-anim mt-4 text-xs sm:text-sm text-vn-ivory/80 leading-relaxed font-light">
                {m.caption}
              </p>
            </div>

            {/* Archival Photo with radio static glow */}
            <div className="m-frame relative order-1 w-full max-w-sm md:w-[48%] md:max-w-lg z-20 md:order-1">
              <div className="relative aspect-[4/3] rounded-2xl border-2 border-red-500/40 bg-[#090b0e] shadow-[0_20px_60px_rgba(218,37,29,0.3)] p-3">
                <img
                  src={m.image}
                  alt={m.heading}
                  className="w-full h-full object-contain rounded-xl contrast-125 grayscale-[0.3]"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-center text-[10px] font-mono uppercase tracking-widest text-vn-ivory/40">
                Đài Tiếng nói Việt Nam phát đi Lời kêu gọi Toàn quốc kháng chiến
              </p>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENE TYPE 4: MODERN TRANSITION (1986 Đổi mới - Vươn tầm phát triển)
  // =========================================================================
  if (sceneType === 'modern-transition') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[140vh]" 
        style={{ background: m.background }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          {/* Modern sapphire ambient radial light */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a2d48_0%,transparent_70%)] opacity-40 pointer-events-none" />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:gap-14 md:px-12 z-10">
            
            <div className="order-2 flex-1 text-center md:text-left z-20 md:order-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/60 border border-blue-400/40 text-blue-300 text-[11px] font-mono uppercase tracking-widest mb-3">
                <Award className="w-3.5 h-3.5 text-blue-300" />
                <span>KỶ NGUYÊN ĐỔI MỚI & HỘI NHẬP PHÁT TRIỂN</span>
              </div>

              <h2 className="m-anim font-display text-6xl sm:text-8xl md:text-9xl font-black leading-none text-white tracking-tight">
                {m.year}
              </h2>

              <h3 className="m-anim mt-2 font-display text-xl sm:text-3xl font-bold uppercase text-blue-200">
                {m.heading}
              </h3>

              <p className="m-anim mt-4 font-sans text-base sm:text-lg font-bold text-white tracking-wide">
                {m.keyText}
              </p>

              <div className="m-anim mt-5 p-5 rounded-2xl bg-blue-950/30 border border-blue-400/30 backdrop-blur-md">
                <p className="font-sans text-sm sm:text-base leading-relaxed text-blue-50/90 font-light">
                  {m.caption}
                </p>
              </div>
            </div>

            <div className="m-frame relative order-1 w-full max-w-sm md:w-[48%] md:max-w-lg z-20 md:order-2">
              <div className="relative aspect-[4/3] rounded-2xl border-2 border-blue-400/40 bg-[#09121d] shadow-[0_25px_65px_rgba(0,30,60,0.6)] p-3">
                <img
                  src={m.image}
                  alt={m.heading}
                  className="w-full h-full object-contain rounded-xl drop-shadow-xl"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-center text-[10px] font-mono uppercase tracking-widest text-blue-200/60">
                Đại hội đại biểu toàn quốc lần thứ VI · Tháng 12/1986
              </p>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // DEFAULT / TACTICAL / TRIUMPH SCENE (1941, 1954, 1975)
  // =========================================================================
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
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/stars.webp)' }}
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:gap-14 md:px-12 z-10">
          
          {/* Text column */}
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

          {/* Framed photo */}
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
