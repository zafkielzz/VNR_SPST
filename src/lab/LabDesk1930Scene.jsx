import React from 'react';
import { FileText } from 'lucide-react';

/**
 * LAB DESK 1930 SCENE — SCENE 02 TRONG MOTION PROTOTYPE
 * Bàn làm việc lịch sử Cửu Long (Hương Cảng).
 * Chứa điểm waypoint để Continuity Element đáp xuống làm con dấu son đập mạnh lên văn kiện!
 */
export default function LabDesk1930Scene({ deskCameraRef }) {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#0A0706] text-white">
      
      {/* Kerosene warm glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, #2a1c13 0%, #0d0907 65%, #030202 100%)'
        }}
      />

      {/* Desk Camera Stage (Full bleed world space) */}
      <div 
        ref={deskCameraRef}
        className="lab-desk-camera will-transform relative z-10 w-full h-full bg-[#140e0a] overflow-hidden"
      >
        {/* Wood Texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 14px),
                              radial-gradient(circle at 50% 50%, rgba(255, 205, 0, 0.12) 0%, transparent 68%)`
          }}
        />

        {/* Ambient Top Tag */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b140f]/95 border border-amber-800/40 text-amber-200 text-xs font-mono uppercase tracking-[0.25em] shadow-2xl">
            <FileText className="w-3.5 h-3.5 text-vn-gold" />
            <span>HỘI NGHỊ HỢP NHẤT ĐẢNG · 03/02/1930</span>
          </div>
        </div>

        {/* Top-Left Heading */}
        <div className="absolute top-10 left-10 sm:top-16 sm:left-16 z-20 pointer-events-none">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-vn-gold/80 block">
            MỐC SON THÀNH LẬP
          </span>
          <h2 className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter leading-none text-glow-gold drop-shadow-xl mt-1">
            1930
          </h2>
          <p className="font-display font-bold text-sm sm:text-lg text-amber-200/90 uppercase tracking-wide mt-1">
            Cương Lĩnh Chính Trị Đầu Tiên
          </p>
        </div>

        {/* Top-Right Pinned Archival Photo */}
        <div className="absolute top-10 right-10 sm:top-14 sm:right-16 w-48 sm:w-64 z-20 rotate-[4deg] rounded-lg bg-[#FAF5EB] p-2.5 shadow-[0_20px_45px_rgba(0,0,0,0.85)] border border-amber-900/30">
          <div className="relative aspect-[4/3] overflow-hidden rounded bg-black">
            <img
              src="/images/exhibits/exhibit_1_2.jpg"
              alt="Hội nghị thành lập Đảng 1930"
              className="w-full h-full object-cover filter contrast-125 sepia-[0.35]"
            />
          </div>
          <p className="mt-1.5 text-center text-[10px] font-mono text-amber-950 uppercase tracking-wider font-semibold">
            Cửu Long (Hương Cảng) · 03/02/1930
          </p>
        </div>

        {/* Center Historical Manuscript */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[520px] md:w-[580px] p-6 sm:p-8 rounded-xl bg-[#EBE2D0] text-[#1A1410] shadow-[0_30px_70px_rgba(0,0,0,0.9)] border border-amber-900/40 rotate-[-1deg] z-15">
          <div className="flex items-center justify-between border-b border-amber-900/30 pb-2 mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900">
              VĂN KIỆN LỊCH SỬ GỐC
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
            <span>Địa điểm: Cửu Long</span>
          </div>

          {/* Waypoint 4: Target Seal Imprint Position */}
          <div 
            data-step="desk-seal-stamp"
            className="absolute -bottom-6 right-8 sm:right-12 w-32 h-32 rounded-full border-2 border-dashed border-[#DA251D]/60 flex items-center justify-center pointer-events-none"
          >
            <span className="text-[9px] font-mono text-red-600/70 uppercase">Waypoint Con Dấu</span>
          </div>
        </div>

        {/* Waypoint 5: Bleed Stream at bottom edge */}
        <div 
          data-step="desk-bleed-line"
          className="absolute bottom-0 right-1/4 w-8 h-40 border-2 border-dashed border-red-500/50 pointer-events-none flex items-center justify-center"
        >
          <span className="text-[8px] font-mono text-red-400 rotate-90 whitespace-nowrap">Waypoint Vệt Mực</span>
        </div>

      </div>
    </section>
  );
}
