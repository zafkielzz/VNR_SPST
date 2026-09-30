import React, { useState, useEffect } from 'react';

const SECTIONS = [
  { id: "hero", label: "Mở đầu Điện ảnh", numeral: "0" },
  { id: "m-1930", label: "Thành lập Đảng 1930", numeral: "I" },
  { id: "m-1941", label: "Mặt trận Việt Minh 1941", numeral: "II" },
  { id: "m-1945", label: "Cách mạng Tháng Tám 1945", numeral: "III" },
  { id: "m-1946", label: "Toàn quốc Kháng chiến 1946", numeral: "IV" },
  { id: "m-1954-quyet-dinh", label: "Bước ngoặt Điện Biên Phủ", numeral: "V" },
  { id: "decision-tree", label: "Cân Não: Quyết Định 1954", numeral: "⚖️" },
  { id: "sa-ban-chien-dich", label: "Sa Bàn Chiến Dịch 3 Đợt", numeral: "🗺️" },
  { id: "kinh-tiem-vong-chien-hao", label: "Kính Tiềm Vọng Chiến Hào", numeral: "🔭" },
  { id: "m-1954-thang-loi", label: "Toàn Thắng 07/05/1954", numeral: "VI" },
  { id: "rap-chieu-phim-tu-lieu", label: "Rạp Phim Tư Liệu 35mm", numeral: "🎬" },
  { id: "m-1975", label: "Đại thắng Mùa Xuân 1975", numeral: "VII" },
  { id: "m-1986", label: "Bình minh Đổi mới 1986", numeral: "VIII" },
  { id: "bao-vat-khang-chien", label: "Bảo Vật & Hiện Vật", numeral: "🏛️" },
  { id: "trac-nghiem-on-tap", label: "Khảo Thí & Chứng Nhận", numeral: "✍️" },
];

export default function TimelineIndicator() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Check which section is in view
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center">
      <div className="relative flex flex-col items-center gap-3 py-4 px-2 rounded-full bg-vn-charcoal/70 backdrop-blur-md border border-vn-gold-antique/25 shadow-2xl">
        
        {/* Track */}
        <div className="absolute top-4 bottom-4 w-[2px] bg-vn-gold-antique/20 -z-10 rounded-full" />
        <div 
          className="absolute top-4 w-[2px] bg-gradient-to-b from-vn-gold via-vn-red to-vn-gold -z-10 rounded-full transition-all duration-150"
          style={{ height: `${Math.min(100, Math.max(0, scrollProgress * 0.9))}%` }}
        />

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
