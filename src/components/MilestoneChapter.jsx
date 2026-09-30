import React, { useRef, useEffect } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useExperience } from '../context/ExperienceContext';
import { FileText, Compass, Radio, Flag, Sparkles, Award, ArrowRight, Sun } from 'lucide-react';

/**
 * MILESTONE CHAPTER (ĐA THỂ LOẠI SCENE THEO TỪNG THỜI KỲ - V3 BESPOKE)
 * - 1941 (journey): Suối Lê-nin, núi rừng Pác Bó, bản đồ địa hình hành trình 30 năm trở về.
 * - 1945 (fullscreen-moment): Quảng trường Ba Đình toàn màn hình, hào quang Sao Vàng, sóng âm Lời Tuyên Ngôn Độc Lập.
 * - 1946 (broadcast): Điện tín nửa đêm từ chiến khu Việt Bắc, tín hiệu phát thanh khẩn cấp.
 * - 1975 (triumph): Chuyển động ngang (Horizontal Travel) thu non sông về một mối, xe tăng 390 Dinh Độc Lập.
 * - 1986 (modern-transition): Visual Reset hoàn toàn: thoát khỏi grit chiến tranh, sắc xanh sapphire & bình minh Đổi mới.
 */
export default function MilestoneChapter({ milestone: m, reverse = false }) {
  const root = useRef(null);
  const sceneType = m.sceneType || 'default';
  const { setAtmosphereMode } = useExperience();

  useEffect(() => {
    if (sceneType === 'modern-transition') {
      setAtmosphereMode('clean');
    } else if (sceneType === 'fullscreen-moment') {
      setAtmosphereMode('filmDust');
    } else if (sceneType === 'journey') {
      setAtmosphereMode('mist');
    }
  }, [sceneType, setAtmosphereMode]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Subtle photo frame parallax drift
      gsap.fromTo(
        q('.m-frame'),
        { y: 25, scale: 0.97 },
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

      // 1975 Horizontal Travel Animation
      if (sceneType === 'triumph') {
        const hTrack = q('.triumph-horizontal-track')[0];
        if (hTrack) {
          gsap.fromTo(
            hTrack,
            { x: '15vw' },
            {
              x: '-15vw',
              ease: 'none',
              scrollTrigger: {
                trigger: root.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
              },
            }
          );
        }
      }
    },
    { scope: root, dependencies: [sceneType] }
  );

  // =========================================================================
  // SCENE 1945: FULLSCREEN HISTORICAL MOMENT (Ba Đình - Tuyên ngôn Độc lập)
  // =========================================================================
  if (sceneType === 'fullscreen-moment') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[170vh] bg-[#0c0908]" 
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 sm:px-8">
          
          {/* Majestic Golden Star Rays Aura */}
          <div className="absolute w-[700px] sm:w-[1000px] h-[700px] sm:h-[1000px] rounded-full bg-radial-gradient from-vn-red/35 via-vn-gold/15 to-transparent blur-3xl pointer-events-none animate-pulse duration-1000" />
          
          <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
            
            {/* National Badge */}
            <div className="m-anim inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vn-red/30 border border-vn-gold/60 text-vn-gold text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-2xl">
              <Sparkles className="w-3.5 h-3.5 text-vn-gold" />
              <span>{m.eyebrow}</span>
            </div>

            {/* Giant 1945 Typography */}
            <h2 className="m-anim font-display font-black text-7xl sm:text-9xl md:text-[145px] leading-none text-white text-glow-gold tracking-tighter">
              {m.year}
            </h2>

            {/* Heading */}
            <h3 className="m-anim mt-2 font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase text-vn-gold tracking-wide max-w-4xl">
              {m.heading}
            </h3>

            {/* Fullscreen Photo Depth with borderless halo */}
            <div className="m-frame relative my-6 w-full max-w-lg sm:max-w-xl aspect-[16/10] rounded-3xl overflow-hidden shadow-[0_0_90px_rgba(218,37,29,0.55)] border-2 border-vn-gold/70 bg-black">
              <img
                src={m.image}
                alt={m.heading}
                className="w-full h-full object-cover filter contrast-125 sepia-[0.2]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
              
              {/* Voice Resonance Waveform overlay */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                <span className="text-[11px] font-mono text-vn-gold tracking-widest uppercase font-bold">
                  Quảng trường Ba Đình · 02/09/1945
                </span>
                <div className="flex items-center gap-1">
                  {[12, 24, 16, 32, 20, 28, 14].map((h, i) => (
                    <span 
                      key={i} 
                      className="w-1 bg-vn-gold rounded-full animate-pulse" 
                      style={{ height: `${h}px`, animationDelay: `${i * 0.15}s` }} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Historic Declaration Quote */}
            <p className="m-anim font-heading text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-white max-w-3xl leading-snug">
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
  // SCENE 1975: TRIUMPH & HORIZONTAL TRAVEL (Đại thắng mùa xuân 1975)
  // =========================================================================
  if (sceneType === 'triumph') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[180vh] bg-gradient-to-b from-[#0e0808] via-[#150a0a] to-[#0a0d12]" 
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4">
          
          {/* Golden Dawn Aura of National Reunification */}
          <div className="absolute w-[800px] h-[800px] rounded-full bg-radial-gradient from-vn-gold/20 via-vn-red/10 to-transparent blur-3xl pointer-events-none" />

          {/* Horizontal Travel Track */}
          <div className="triumph-horizontal-track will-transform relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
            
            {/* Left Column: Historical Momentum */}
            <div className="flex-1 text-center lg:text-left space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-vn-gold/50 text-vn-gold text-xs font-mono font-bold uppercase tracking-widest shadow-xl">
                <Flag className="w-3.5 h-3.5 text-vn-red" />
                <span>11H30 NGÀY 30/04/1975 · THỐNG NHẤT NON SÔNG</span>
              </div>

              <h2 className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter leading-none text-glow-gold">
                1975
              </h2>

              <h3 className="font-display font-bold text-xl sm:text-3xl text-vn-gold uppercase tracking-wide">
                Đại Thắng Mùa Xuân & Chiến Dịch Hồ Chí Minh
              </h3>

              <div className="p-4 rounded-2xl bg-red-950/30 border border-vn-red/40">
                <p className="font-heading font-black text-base sm:text-xl text-white uppercase tracking-wider">
                  "Xẻ dọc Trường Sơn đi cứu nước · Non sông thu về một mối"
                </p>
              </div>

              <p className="font-sans text-xs sm:text-sm text-vn-ivory/85 leading-relaxed font-light">
                {m.caption}
              </p>
            </div>

            {/* Right: Archival Photo of Tank 390 at Independence Palace */}
            <div className="w-full max-w-md lg:max-w-xl aspect-[16/11] rounded-3xl overflow-hidden border-2 border-vn-gold/60 shadow-[0_25px_80px_rgba(218,37,29,0.5)] bg-black p-3 relative">
              <img
                src={m.image}
                alt="Xe tăng 390 húc đổ cổng Dinh Độc Lập"
                className="w-full h-full object-cover rounded-2xl filter contrast-125 sepia-[0.1]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6 right-6 text-center">
                <span className="text-[11px] font-mono text-vn-gold uppercase font-bold tracking-wider">
                  Thời khắc lịch sử 11h30 trưa 30/04/1975 tại Sài Gòn
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENE 1986: MODERN TRANSITION (Visual Reset từ chiến tranh sang Đổi mới)
  // =========================================================================
  if (sceneType === 'modern-transition') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[170vh] bg-gradient-to-b from-[#081524] via-[#0b1f36] to-[#0a1829]" 
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 sm:px-8">
          
          {/* Modern Sapphire & Sky Blue Ambient Light (Exit from War Grit) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0284c7_0%,transparent_65%)] opacity-25 pointer-events-none" />
          
          {/* Architectural modern grid lines */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:4rem_4rem]" />

          <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
            
            {/* Left Column: Modernist Reform Presentation */}
            <div className="flex-1 text-center lg:text-left space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/80 border border-sky-400/50 text-sky-300 text-xs font-mono font-bold uppercase tracking-widest shadow-xl">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                <span>BƯỚC NGOẶT ĐỔI MỚI & HỘI NHẬP PHÁT TRIỂN</span>
              </div>

              <h2 className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tight leading-none drop-shadow-2xl">
                1986
              </h2>

              <h3 className="font-display font-bold text-2xl sm:text-4xl text-sky-200 uppercase tracking-wide">
                Đại Hội VI — Khởi Xướng Đổi Mới Toàn Diện
              </h3>

              <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-400/30 backdrop-blur-md">
                <p className="font-sans font-bold text-sm sm:text-base text-white tracking-wide">
                  "Nhìn thẳng vào sự thật, đánh giá đúng sự thật, nói rõ sự thật"
                </p>
              </div>

              <p className="font-sans text-xs sm:text-sm text-sky-100/80 leading-relaxed font-light">
                {m.caption}
              </p>
            </div>

            {/* Right: Archival Photo of VIth Party Congress */}
            <div className="w-full max-w-md lg:max-w-xl aspect-[16/11] rounded-3xl overflow-hidden border-2 border-sky-400/40 shadow-[0_25px_70px_rgba(2,132,199,0.35)] bg-[#071320] p-3 relative">
              <img
                src={m.image}
                alt="Đại hội đại biểu toàn quốc lần thứ VI của Đảng"
                className="w-full h-full object-cover rounded-2xl filter contrast-110 drop-shadow-xl"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071320]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6 right-6 text-center">
                <span className="text-[11px] font-mono text-sky-300 uppercase tracking-wider font-semibold">
                  Hội trường Ba Đình · Tháng 12/1986
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENE 1941: JOURNEY (Pác Bó - Cội nguồn cách mạng)
  // =========================================================================
  if (sceneType === 'journey') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[160vh]" 
        style={{ background: m.background }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          
          {/* Mountain Topographic Contours */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <svg viewBox="0 0 1000 600" className="w-full h-full">
              <path d="M 0,200 Q 250,120 500,240 T 1000,180" fill="none" stroke="#2a4532" strokeWidth="1.5" />
              <path d="M 0,350 Q 300,280 600,400 T 1000,320" fill="none" stroke="#2a4532" strokeWidth="1" />
              <polygon points="280,180 320,120 360,180" fill="none" stroke="#3b6146" strokeWidth="1" />
              <polygon points="680,240 730,160 780,240" fill="none" stroke="#3b6146" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:gap-14 md:px-12 z-10">
            
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

            <div className="m-frame relative order-1 w-full max-w-sm md:w-[48%] md:max-w-lg z-20 md:order-1">
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
  // SCENE 1946: BROADCAST (Toàn quốc Kháng chiến)
  // =========================================================================
  return (
    <section 
      id={m.id} 
      ref={root} 
      className="relative h-[150vh]" 
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
