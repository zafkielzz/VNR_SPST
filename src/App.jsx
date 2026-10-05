import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './lib/gsap';
import { ExperienceProvider, useExperience } from './context/ExperienceContext';
import Navbar from './components/Navbar';
import TimelineIndicator from './components/TimelineIndicator';
import AtmosphereDirector from './components/AtmosphereDirector';
import InkHero from './components/InkHero';
import DocumentDesk1930 from './components/DocumentDesk1930';
import KineticManifesto from './components/KineticManifesto';
import MilestoneChapter from './components/MilestoneChapter';
import QuoteSection from './components/QuoteSection';
import DienBienExperience from './components/DienBienExperience';
import CinematicFinale from './components/CinematicFinale';
import HistoricalCinemaSection from './components/HistoricalCinemaSection';
import ArtifactGallerySection from './components/ArtifactGallerySection';
import KnowledgeQuiz from './components/KnowledgeQuiz';
import Footer from './components/Footer';
import { VNR_MILESTONES_DATA } from './data/vnrMilestonesData';

function AppContent() {
  const location = useLocation();
  const { atmosphereMode, setAtmosphereMode } = useExperience();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#khong-gian-khao-cuu',
      start: 'top 70%',
      onEnter: () => setAtmosphereMode('none'),
      onLeaveBack: () => setAtmosphereMode('paperDust'),
    });
    return () => trigger.kill();
  }, [setAtmosphereMode]);

  useEffect(() => {
    if (!location.hash) return undefined;

    const timer = window.setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  // Lenis Smooth Scroll synchronised with GSAP ScrollTrigger ticker
  useEffect(() => {
    // Accessibility: Honor prefers-reduced-motion at JS level
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      window.__lenis = null;
      return undefined;
    }

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    const settleTimer = setTimeout(refresh, 500);

    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        refresh();
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      window.__lenis = null;
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', onResize);
      clearTimeout(settleTimer);
    };
  }, []);

  // Milestones data
  const m1941 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1941');
  const m1945 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1945');
  const m1946 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1946');
  const m1975 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1975');
  const m1986 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1986');

  return (
    <div className="relative min-h-screen bg-vn-black text-vn-ivory selection:bg-vn-red selection:text-vn-gold">
      
      {/* Cinematic Overlays: Film Grain, Vignette & Dynamic Atmosphere Director */}
      <div 
        className={`film-grain transition-opacity duration-700 ${
          atmosphereMode === 'clean' || atmosphereMode === 'none' ? 'opacity-0' : 'opacity-[0.025]'
        }`} 
      />
      <div className="film-vignette" />
      <AtmosphereDirector />

      {/* Top Navbar & Vertical Timeline Indicator (Immersion Responsive) */}
      <Navbar />
      <TimelineIndicator />

      {/* Main Cinematic Scrollytelling Sequence */}
      <main>
        {/* 00. Khởi Nguyên Nét Mực: InkHero (Mặt giấy ngà, đầu bút lông MotionPath & camera dive) */}
        <InkHero />

        {/* 01. Mốc 1930: Bàn tài liệu lịch sử Cửu Long (World Space Desk & Dấu ấn Cương lĩnh) */}
        <DocumentDesk1930 />

        {/* 02. Kinetic Manifesto 1: Ngọn cờ tư tưởng (Độc Lập - Tự Do - Hạnh Phúc) */}
        <KineticManifesto id="cascade-cuong-linh" mode="cuong-linh" />

        {/* 03. Mốc 1941: Pác Bó - Cội nguồn cách mạng & Mặt trận Việt Minh */}
        {m1941 && <MilestoneChapter milestone={m1941} reverse={true} />}

        {/* 04. Mốc 1945: Quảng trường Ba Đình & Tuyên ngôn Độc lập (Bespoke Fullscreen Moment) */}
        {m1945 && <MilestoneChapter milestone={m1945} reverse={false} />}

        {/* 05. Mốc 1946: Lời kêu gọi Toàn quốc Kháng chiến (Chiến khu Việt Bắc) */}
        {m1946 && <MilestoneChapter milestone={m1946} reverse={true} />}

        {/* 06. Kinetic Manifesto 2: Khúc tráng ca Điện Biên (Khoét Núi - Ngủ Hầm - Mưa Dầm - Lừng Lẫy) */}
        <KineticManifesto id="cascade-dien-bien" mode="dien-bien" />

        {/* 07. ĐẠI CẢNH LIÊN HOÀN ĐIỆN BIÊN PHỦ 1954 (Pinned Master Stage 5 Phases) */}
        <DienBienExperience />

        {/* 08. Mốc 1975: Đại thắng Mùa Xuân 1975 (Bespoke Horizontal Travel Triumph) */}
        {m1975 && <MilestoneChapter milestone={m1975} reverse={false} />}

        {/* 09. Mốc 1986: Khởi xướng Đổi mới (Bespoke Modern Sapphire Transition) */}
        {m1986 && <MilestoneChapter milestone={m1986} reverse={true} />}

        {/* 10. Hồi Kết Điện Ảnh: Animated Timeline Callback (Một Nét Mực Xuyên Suốt Lịch Sử) */}
        <CinematicFinale />

        {/* ================================================================
            KHÔNG GIAN KHẢO CỨU & TRẢI NGHIỆM MỞ RỘNG (EXPLORATION & ARCHIVE HUB)
            Tách biệt khỏi mạch kể chính để giữ trọn vẹn cảm xúc điện ảnh
           ================================================================ */}
        <section id="khong-gian-khao-cuu" className="relative pt-20 border-t border-vn-gold/20 bg-gradient-to-b from-vn-black via-[#0d0f14] to-vn-black">
          <div className="max-w-4xl mx-auto text-center px-4 mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-vn-charcoal border border-vn-gold/40 text-vn-gold text-xs font-mono font-bold uppercase tracking-widest mb-3">
              KHÔNG GIAN BẢO TÀNG SỐ & KHẢO THÍ HỌC LIỆU
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
              Khám Phá Chuyên Sâu Tư Liệu & Hiện Vật
            </h2>
            <p className="mt-3 text-sm sm:text-base text-vn-ivory/70 max-w-2xl mx-auto font-light">
              Nơi lưu trữ các thước phim 35mm quý hiếm, giám định hiện vật lịch sử và khảo sát kiến thức môn học Lịch sử Đảng Cộng sản Việt Nam.
            </p>
          </div>

          {/* RẠP CHIẾU PHIM TƯ LIỆU 35MM: Video clip tư liệu lịch sử có âm thanh */}
          <HistoricalCinemaSection />

          {/* PHÒNG GIÁM ĐỊNH HIỆN VẬT & BẢO VẬT KHÁNG CHIẾN (Interactive Artifacts) */}
          <ArtifactGallerySection />

          {/* PHÒNG TRÍCH DẪN VĂN KIỆN LỊCH SỬ & LỜI HIỆU TRIỆU KINH ĐIỂN */}
          <QuoteSection />

          {/* PHÒNG KHẢO THÍ TRẮC NGHIỆM VNR & CẤP GIẤY CHỨNG NHẬN CANVAS */}
          <KnowledgeQuiz />
        </section>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <ExperienceProvider>
      <AppContent />
    </ExperienceProvider>
  );
}
