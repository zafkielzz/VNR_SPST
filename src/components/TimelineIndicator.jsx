import React, { useState, useEffect, useRef } from 'react';
import { useExperience } from '../context/ExperienceContext';

const SECTIONS = [
  { id: "hero", label: "Khởi Nguyên Nét Mực", numeral: "0" },
  { id: "m-1930", label: "Thành lập Đảng 1930", numeral: "I" },
  { id: "m-1941", label: "Mặt trận Việt Minh 1941", numeral: "II" },
  { id: "m-1945", label: "Tuyên ngôn Độc lập 1945", numeral: "III" },
  { id: "m-1946", label: "Toàn quốc Kháng chiến 1946", numeral: "IV" },
  { id: "dien-bien-1954", label: "Điện Biên Phủ 1954", numeral: "V" },
  { id: "m-1975", label: "Đại thắng Mùa Xuân 1975", numeral: "VI" },
  { id: "m-1986", label: "Kỷ nguyên Đổi mới 1986", numeral: "VII" },
  { id: "khong-gian-khao-cuu", label: "Bảo Tàng & Khảo Cứu", numeral: "🏛️" },
];


export default function TimelineIndicator() {
  const { isImmersionMode } = useExperience();
  const [activeSection, setActiveSection] = useState("hero");
  const activeSectionRef = useRef("hero");
  const progressBarRef = useRef(null);

  useEffect(() => {
    let rafId = null;

    const updatePosition = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)) : 0;
      
      if (progressBarRef.current) {
        progressBarRef.current.style.height = `${progress}%`;
      }

      // Check which section is in view
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      let newActive = SECTIONS[0].id;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          newActive = SECTIONS[i].id;
          break;
        }
      }

      if (newActive !== activeSectionRef.current) {
        activeSectionRef.current = newActive;
        setActiveSection(newActive);
      }
      rafId = null;
    };

    const handleScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updatePosition();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <aside className={`fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center transition-all duration-500 ${
      isImmersionMode ? 'opacity-0 pointer-events-none translate-x-6' : 'opacity-100 translate-x-0'
    }`}>
      <div className="relative flex flex-col items-center gap-3 py-4 px-2 rounded-full bg-[#121214]/95 border border-vn-gold-antique/25 shadow-2xl">
        
        {/* Track */}
        <div className="absolute top-4 bottom-4 w-[2px] -z-10 rounded-full overflow-hidden bg-vn-gold-antique/20">
          <div 
            ref={progressBarRef}
            className="w-full bg-gradient-to-b from-vn-gold via-vn-red to-vn-gold rounded-full"
            style={{ height: '0%' }}
          />
        </div>

        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="group relative flex items-center justify-center"
              title={sec.label}
            >
              {/* Tooltip on hover */}
              <span className="absolute right-8 px-2.5 py-1 rounded text-[11px] font-medium tracking-wide bg-vn-charcoal border border-vn-gold/40 text-vn-gold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl">
                {sec.numeral}. {sec.label}
              </span>

              {/* Marker dot */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-vn-red text-vn-gold border border-vn-gold scale-125 shadow-lg shadow-vn-gold/30'
                  : 'bg-vn-black/80 text-vn-ivory/60 border border-vn-ivory/20 hover:border-vn-gold hover:text-vn-gold hover:scale-110'
              }`}>
                {sec.numeral}
              </div>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
