import React, { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { useExperience } from '../context/ExperienceContext';
import { FileText, Compass, Radio, Flag, Sparkles, Award, ArrowRight, Sun, Layers } from 'lucide-react';

/**
 * MILESTONE CHAPTER (V3 MASTER BESPOKE EXPERIENCE)
 * - 1941 (journey): Suối Lê-nin, núi rừng Pác Bó, bản đồ địa hình hành trình 30 năm trở về.
 * - 1945 (fullscreen-moment): Full-bleed Ba Đình toàn màn hình, typography 02 -> 02·09 -> 02·09·1945, không card, không border.
 * - 1946 (broadcast): Điện tín nửa đêm từ chiến khu Việt Bắc, tín hiệu phát thanh khẩn cấp + khói smoke.
 * - 1975 (triumph): Real Multi-Plane Horizontal Travel 280vw, xe tăng 390 húc đổ cổng Dinh Độc Lập.
 * - 1986 (modern-transition): Visual Reset toàn diện: sans-serif, kiến trúc mở, nét đỏ duỗi thẳng từ sóng sang thẳng.
 */
export default function MilestoneChapter({ milestone: m, reverse = false }) {
  const root = useRef(null);
  const sceneType = m.sceneType || 'default';
  const { setAtmosphereMode, prefersReducedMotion } = useExperience();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Contextual Atmosphere Trigger (Fix mount-time race condition)
      const modeMap = {
        journey: 'mist',
        'fullscreen-moment': 'filmDust',
        broadcast: 'smoke',
        triumph: 'dust',
        'modern-transition': 'clean',
      };
      const targetMode = modeMap[sceneType] || 'dust';

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setAtmosphereMode(targetMode),
        onEnterBack: () => setAtmosphereMode(targetMode),
      });

      // 1945 Fullscreen Moment Scrollytelling Sequence
      if (sceneType === 'fullscreen-moment') {
        const tl45 = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        });

        // 0.0 -> 0.35: Typography transforms: 02 -> 02 · 09 -> 02 · 09 · 1945
        tl45.to(q('.ba-dinh-day'), { opacity: 1, scale: 1, duration: 0.2 }, 0)
          .to(q('.ba-dinh-month'), { opacity: 1, scale: 1, duration: 0.2 }, 0.15)
          .to(q('.ba-dinh-year'), { opacity: 1, scale: 1, duration: 0.2 }, 0.30)
          .fromTo(
            q('.ba-dinh-bg-photo'),
            { scale: 1.0 },
            { scale: 1.1, ease: 'none', duration: 1.0 },
            0
          )
          .fromTo(
            q('.ba-dinh-declaration'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: 0.3 },
            0.50
          );
      }

      // 1975 Multi-Plane Horizontal Travel Sequence (280vw)
      if (sceneType === 'triumph') {
        const track = q('.triumph-track-280vw')[0];
        const hLine = q('.triumph-horizontal-line')[0];
        const lineLen = hLine ? hLine.getTotalLength() : 2400;

        if (hLine) {
          gsap.set(hLine, { strokeDasharray: lineLen, strokeDashoffset: lineLen });
        }

        const tl75 = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        });

        // Horizontal camera glide from 0vw to -180vw across 250vh scroll distance
        tl75.to(
          track,
          {
            x: '-180vw',
            ease: 'none',
            duration: 1.0,
          },
          0
        )
        // Living red line draws continuously across the horizontal path
        .to(hLine, { strokeDashoffset: 0, ease: 'none', duration: 1.0 }, 0);
      }

      // 1986 Modern Transition: Red wave straightens into razor-sharp vector
      if (sceneType === 'modern-transition') {
        const straightLine = q('.straight-vector')[0];
        const waveLine = q('.wave-vector')[0];

        const tl86 = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.45,
          },
        });

        tl86.fromTo(
          waveLine,
          { opacity: 1, strokeDashoffset: 0 },
          { opacity: 0, duration: 0.4 },
          0.1
        )
        .fromTo(
          straightLine,
          { opacity: 0, scaleX: 0 },
          { opacity: 1, scaleX: 1, transformOrigin: '0% 50%', duration: 0.4 },
          0.3
        )
        .fromTo(
          q('.modern-principle-card'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.35 },
          0.4
        );
      }

      // 1946 Broadcast Radio Bridge: Fades into deep darkness leading directly into 1954
      if (sceneType === 'broadcast') {
        const blackout = q('.broadcast-blackout')[0];
        if (blackout) {
          gsap.to(blackout, {
            opacity: 0.95,
            ease: 'power2.in',
            scrollTrigger: {
              trigger: root.current,
              start: '60% top',
              end: 'bottom bottom',
              scrub: 0.25,
            },
          });
        }
      }

      // Default subtle parallax for standard photos
      const frame = q('.m-frame');
      if (frame.length > 0) {
        gsap.fromTo(
          frame,
          { y: 20, scale: 0.98 },
          {
            y: -15,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
            },
          }
        );
      }
    },
    { scope: root, dependencies: [sceneType] }
  );

  // =========================================================================
  // SCENE 1945: PURE CINEMATIC FULLSCREEN MOMENT (No cards, no borders, no badges)
  // =========================================================================
  if (sceneType === 'fullscreen-moment') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[200vh] bg-black text-white" 
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* Full-Bleed Archival Photograph Covering Entire Viewport */}
          <div className="ba-dinh-bg-photo will-transform absolute inset-0">
            <img
              src={m.image}
              alt="Quảng trường Ba Đình 02/09/1945"
              className="w-full h-full object-cover filter contrast-125 sepia-[0.25]"
            />
            {/* Soft Cinematic Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/45 to-black/90 pointer-events-none" />
          </div>

          {/* Golden Star Radiance from Center (Pre-feathered gradient without GPU blur-3xl) */}
          <div className="absolute w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-[radial-gradient(circle,rgba(255,205,0,0.18)_0%,rgba(218,37,29,0.08)_40%,transparent_70%)] pointer-events-none" />

          {/* Pure Cinematic Typography Layer */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-5xl space-y-6">
            
            {/* Stepwise Date Emergence: 02 -> 02 · 09 -> 02 · 09 · 1945 */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 font-display font-black text-5xl sm:text-8xl md:text-9xl text-white text-glow-gold tracking-tighter leading-none select-none">
              <span className="ba-dinh-day opacity-0 will-transform">02</span>
              <span className="ba-dinh-month opacity-0 will-transform text-vn-red font-light">· 09</span>
              <span className="ba-dinh-year opacity-0 will-transform text-vn-gold">· 1945</span>
            </div>

            {/* Sub-heading */}
            <h3 className="font-display font-black text-xl sm:text-3xl md:text-4xl uppercase text-amber-200 tracking-wider drop-shadow-xl max-w-4xl">
              Tuyên Ngôn Độc Lập & Khai Sinh Nước Việt Nam Dân Chủ Cộng Hòa
            </h3>

            {/* Monumental Words of Uncle Ho: Borderless & Full Depth */}
            <div className="ba-dinh-declaration will-transform max-w-3xl mx-auto space-y-3 pt-2">
              <p className="font-serif italic font-bold text-lg sm:text-2xl md:text-3xl text-white leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                “Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do, độc lập.”
              </p>
              <p className="font-mono text-xs sm:text-sm text-vn-gold uppercase tracking-[0.25em]">
                Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình
              </p>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENE 1975: REAL MULTI-PLANE HORIZONTAL TRAVEL (Track width: 280vw)
  // =========================================================================
  if (sceneType === 'triumph') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[250vh] bg-[#080a0e] text-white" 
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
          
          {/* The Multi-Plane Track (280vw) */}
          <div className="triumph-track-280vw will-transform relative flex items-center w-[280vw] h-full px-12 sm:px-24">
            
            {/* Continuous Red Ink Line Running Horizontally Across Entire 280vw (Translates synchronously with archival planes) */}
            <svg viewBox="0 0 2800 60" className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-12 pointer-events-none z-10 overflow-visible">
              <path
                d="M 50,30 L 2750,30"
                fill="none"
                stroke="#DA251D"
                strokeWidth="4"
                strokeLinecap="round"
                className="triumph-horizontal-line drop-shadow-[0_0_15px_#DA251D]"
              />
            </svg>
            
            {/* Plane 1 (0 -> 70vw): Cung đường Trường Sơn & Lời hiệu triệu 1975 */}
            <div className="w-[70vw] shrink-0 flex flex-col items-start justify-center pr-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-vn-gold/50 text-vn-gold text-xs font-mono font-bold uppercase tracking-widest">
                <Flag className="w-3.5 h-3.5 text-vn-red" />
                <span>MỐC LỊCH SỬ THẦN TỐC 1975</span>
              </div>
              <h2 className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter leading-none text-glow-gold">
                1975
              </h2>
              <h3 className="font-display font-bold text-2xl sm:text-4xl text-vn-gold uppercase">
                Đại Thắng Mùa Xuân & Chiến Dịch Hồ Chí Minh
              </h3>
              <p className="font-heading italic text-base sm:text-xl text-vn-ivory/80 max-w-lg">
                "Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng phút, từng giờ; xốc tới mặt trận giải phóng miền Nam!"
              </p>
            </div>

            {/* Plane 2 (70 -> 140vw): Tuyến lửa & Đoàn quân tiến về Sài Gòn - Archival Contact Sheet */}
            <div className="w-[70vw] shrink-0 flex items-center justify-center px-8">
              <div className="relative w-full max-w-xl rounded-sm border border-white/20 bg-[#07080a] p-3 sm:p-4 shadow-2xl">
                {/* Film Edge Registration Marks & Annotations */}
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/50 pb-2 border-b border-white/10 uppercase select-none">
                  <span className="flex items-center gap-1.5 font-bold text-vn-gold/80">▶ 04A</span>
                  <span>KODAK SAFETY FILM · TRI-X PAN</span>
                  <span>1975-04</span>
                </div>

                {/* Archival Crop Crosshairs */}
                <span className="absolute top-1.5 left-2 font-mono text-[9px] text-white/30 select-none">+</span>
                <span className="absolute top-1.5 right-2 font-mono text-[9px] text-white/30 select-none">+</span>
                <span className="absolute bottom-1.5 left-2 font-mono text-[9px] text-white/30 select-none">+</span>
                <span className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/30 select-none">+</span>

                {/* Archival Photo */}
                <div className="relative aspect-[16/10] overflow-hidden my-2 border border-white/10 bg-black">
                  <img
                    src="/images/exhibits/exhibit_10_2.jpg"
                    alt="Tuyến lửa Trường Sơn - Huyết mạch chi viện miền Nam"
                    className="w-full h-full object-cover filter contrast-125 sepia-[0.15]"
                    loading="lazy"
                  />
                </div>

                {/* Bottom Contact Sheet Legend */}
                <div className="flex items-center justify-between text-[10px] font-mono text-vn-gold/75 pt-1.5 border-t border-white/10 tracking-wider">
                  <span className="uppercase">TƯ LIỆU SỐ 75-TS</span>
                  <span className="uppercase font-semibold">Tuyến Lửa Trường Sơn · Tiến Về Sài Gòn</span>
                </div>
              </div>
            </div>

            {/* Plane 3 (140 -> 210vw): Xe tăng 390 Dinh Độc Lập - Archival Contact Sheet */}
            <div className="w-[70vw] shrink-0 flex flex-col items-center justify-center text-center px-8 space-y-4">
              <div className="relative w-full max-w-xl rounded-sm border border-red-500/30 bg-[#07080a] p-3 sm:p-4 shadow-[0_0_50px_rgba(218,37,29,0.3)]">
                {/* Film Edge Registration Marks & Annotations */}
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/50 pb-2 border-b border-white/10 uppercase select-none">
                  <span className="flex items-center gap-1.5 font-bold text-red-400">▶ 04B</span>
                  <span>ARCHIVAL NEGATIVE · HISTORIC MOMENT</span>
                  <span>11:30 AM</span>
                </div>

                {/* Archival Crop Crosshairs */}
                <span className="absolute top-1.5 left-2 font-mono text-[9px] text-white/30 select-none">+</span>
                <span className="absolute top-1.5 right-2 font-mono text-[9px] text-white/30 select-none">+</span>
                <span className="absolute bottom-1.5 left-2 font-mono text-[9px] text-white/30 select-none">+</span>
                <span className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/30 select-none">+</span>

                {/* Archival Photo */}
                <div className="relative aspect-[16/10] overflow-hidden my-2 border border-red-500/20 bg-black">
                  <img
                    src="/images/exhibits/tank390_dinh_doc_lap.jpg"
                    alt="Xe tăng 390 húc đổ cổng Dinh Độc Lập"
                    className="w-full h-full object-cover filter contrast-125"
                    loading="lazy"
                  />
                </div>

                {/* Bottom Contact Sheet Legend */}
                <div className="flex items-center justify-between text-[10px] font-mono text-red-400/90 pt-1.5 border-t border-white/10 tracking-wider">
                  <span className="uppercase">DINH ĐỘC LẬP</span>
                  <span className="uppercase font-semibold">CHIẾN DỊCH HỒ CHÍ MINH TOÀN THẮNG</span>
                </div>
              </div>

              <h4 className="font-mono font-black text-3xl sm:text-5xl text-vn-gold tracking-tight">
                11H30 · 30 / 04 / 1975
              </h4>
              <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-red-400">
                Xe tăng 390 húc tung cổng Dinh Độc Lập · Cờ giải phóng tung bay
              </p>
            </div>

            {/* Plane 4 (210 -> 280vw): Non Sông Thu Về Một Mối */}
            <div className="w-[70vw] shrink-0 flex flex-col items-start justify-center pl-8 pr-16 space-y-4">
              <span className="text-xs font-mono uppercase tracking-[0.4em] text-emerald-400 font-bold">
                HOÀN TOÀN THỐNG NHẤT
              </span>
              <h3 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase leading-tight">
                Non Sông Liền Một Dải · Bắc Nam Sum Họp
              </h3>
              <p className="font-sans text-sm sm:text-base text-vn-ivory/80 leading-relaxed font-light max-w-md">
                Chấm dứt vĩnh viễn 21 năm kháng chiến chống Mỹ và hơn một thế kỷ đô hộ của chủ nghĩa thực dân, non sông Việt Nam trọn vẹn độc lập, tự do.
              </p>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENE 1986: MODERN TRANSITION (Real Visual Reset: Modern Sans, Architectural Grid, Straight Vector)
  // =========================================================================
  if (sceneType === 'modern-transition') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[190vh] bg-gradient-to-b from-[#0A192F] via-[#0E2442] to-[#081524] text-white" 
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center px-4 sm:px-8">
          
          {/* Modern Architectural Grid & Dawn Sky Ambient Light (NO war grain, NO vignette) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0284c7_0%,transparent_70%)] opacity-30 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none opacity-15 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

          <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center space-y-6">
            
            {/* Modern Clean Sans Header */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-sky-950/80 border border-sky-400/60 text-sky-300 text-xs font-mono font-bold uppercase tracking-widest shadow-xl">
              <Award className="w-3.5 h-3.5 text-sky-400" />
              <span>ĐẠI HỘI VI · BƯỚC NGOẶT ĐỔI MỚI TOÀN DIỆN (12/1986)</span>
            </div>

            <h2 className="font-sans font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tight leading-none">
              1986
            </h2>

            {/* Red Vector Transformation: Wavy Wartime Line Straightens into Precision Vector */}
            <div className="relative w-full max-w-2xl h-8 flex items-center justify-center">
              {/* Turbulent wavy stroke from war era */}
              <svg viewBox="0 0 600 30" className="wave-vector will-transform absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <path d="M 0,15 Q 150,0 300,28 T 600,15" fill="none" stroke="#DA251D" strokeWidth="3" />
              </svg>
              {/* Modern Laser-Straight Vector Line */}
              <div className="straight-vector will-transform w-full h-[3px] bg-gradient-to-r from-vn-red via-sky-400 to-cyan-300 shadow-[0_0_15px_#38bdf8]" />
            </div>

            {/* The 3 Core Pillars of Đổi Mới in Modern Architectural Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl pt-2">
              
              <div className="modern-principle-card will-transform p-5 rounded-sm bg-sky-950/75 border-l-2 border-l-cyan-400 border-t border-r border-b border-sky-400/25 text-left relative shadow-lg">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  NGUYÊN TẮC 01
                </span>
                <h4 className="font-sans font-bold text-lg text-white">Nhìn Thẳng Vào Sự Thật</h4>
                <p className="text-xs text-sky-100/75 mt-2 leading-relaxed">
                  Dũng cảm thừa nhận sai lầm chủ quan, xóa bỏ cơ chế tập trung quan liêu bao cấp kìm hãm phát triển.
                </p>
              </div>

              <div className="modern-principle-card will-transform p-5 rounded-sm bg-sky-950/75 border-l-2 border-l-cyan-400 border-t border-r border-b border-sky-400/25 text-left relative shadow-lg">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  NGUYÊN TẮC 02
                </span>
                <h4 className="font-sans font-bold text-lg text-white">Đánh Giá Đúng Sự Thật</h4>
                <p className="text-xs text-sky-100/75 mt-2 leading-relaxed">
                  Nhận diện đúng quy luật khách quan, tôn trọng kinh tế nhiều thành phần định hướng xã hội chủ nghĩa.
                </p>
              </div>

              <div className="modern-principle-card will-transform p-5 rounded-sm bg-sky-950/75 border-l-2 border-l-cyan-400 border-t border-r border-b border-sky-400/25 text-left relative shadow-lg">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  NGUYÊN TẮC 03
                </span>
                <h4 className="font-sans font-bold text-lg text-white">Nói Rõ Sự Thật</h4>
                <p className="text-xs text-sky-100/75 mt-2 leading-relaxed">
                  Công khai đường lối đổi mới toàn diện, kiến tạo động lực phát triển mới và mở rộng hội nhập quốc tế.
                </p>
              </div>

            </div>

            <p className="font-sans text-xs sm:text-sm text-sky-200/80 max-w-xl mx-auto font-light pt-2">
              Khởi đầu kỷ nguyên hội nhập kinh tế, công nghiệp hóa và hiện đại hóa đất nước.
            </p>

          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENE 1941: JOURNEY (Pác Bó - Cội nguồn cách mạng - Nén montage 20-30s)
  // =========================================================================
  if (sceneType === 'journey') {
    return (
      <section 
        id={m.id} 
        ref={root} 
        className="relative h-[130vh]" 
        style={{ background: m.background }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg viewBox="0 0 1000 600" className="w-full h-full">
              <path d="M 0,200 Q 250,120 500,240 T 1000,180" fill="none" stroke="#2a4532" strokeWidth="1.5" />
              <path d="M 0,350 Q 300,280 600,400 T 1000,320" fill="none" stroke="#2a4532" strokeWidth="1" />
              <polygon points="280,180 320,120 360,180" fill="none" stroke="#3b6146" strokeWidth="1" />
              <polygon points="680,240 730,160 780,240" fill="none" stroke="#3b6146" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row md:gap-12 md:px-12 z-10">
            
            <div className="order-2 flex-1 text-center md:text-left z-20 md:order-2 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-[11px] font-mono uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>HÀNH TRÌNH PÁC BÓ · 30 NĂM BÔN BA TRỞ VỀ</span>
              </div>

              <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-black leading-none text-white tracking-tight">
                {m.year}
              </h2>

              <h3 className="font-display text-lg sm:text-2xl font-bold uppercase text-emerald-200">
                {m.heading}
              </h3>

              <p className="font-heading italic text-base sm:text-xl text-vn-gold">
                "{m.keyText}"
              </p>

              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-light max-w-md">
                Chủ tịch Hồ Chí Minh về nước sau 30 năm bôn ba tìm đường cứu nước, triệu tập Hội nghị Trung ương 8, đặt nhiệm vụ giải phóng dân tộc lên hàng đầu.
              </p>
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
  // SCENE 1946: BROADCAST (Radio Bridge dẫn thẳng vào bóng tối trước 1954)
  // =========================================================================
  return (
    <section 
      id={m.id} 
      ref={root} 
      className="relative h-[140vh]" 
      style={{ background: m.background }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Deep Blackout Vignette that engulfs the screen towards 1954 */}
        <div className="broadcast-blackout pointer-events-none absolute inset-0 bg-black opacity-0 z-30 transition-opacity" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row md:gap-12 md:px-12 z-10">
          
          <div className="order-2 flex-1 text-center md:text-left z-20 md:order-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-[11px] font-mono uppercase tracking-widest animate-pulse">
              <Radio className="w-3.5 h-3.5 text-red-400" />
              <span>PHÁT THANH ĐÊM 19/12/1946 · CHIẾN KHU VIỆT BẮC</span>
            </div>

            <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-black leading-none text-white tracking-tight">
              {m.year}
            </h2>

            <h3 className="font-display text-lg sm:text-2xl font-bold uppercase text-red-400">
              {m.heading}
            </h3>

            <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 shadow-xl">
              <p className="font-heading font-black text-base sm:text-xl text-white uppercase tracking-wider text-glow-red">
                "{m.keyText}"
              </p>
            </div>

            <p className="text-xs sm:text-sm text-vn-ivory/80 leading-relaxed font-light max-w-md">
              Lời kêu gọi vang vọng non sông qua sóng Đài Tiếng nói Việt Nam, hiệu triệu toàn dân tộc bước vào cuộc kháng chiến trường kỳ 9 năm vì độc lập tự do.
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
