import React from 'react';

/**
 * LAB HERO SCENE — SCENE 01 TRONG MOTION PROTOTYPE
 * Trang trí giấy ngà cổ truyền, tiêu đề Ký Họa Sử Đảng.
 * Chứa các điểm dừng waypoint [data-step] để Continuity Element Flip vào.
 */
export default function LabHeroScene({ cameraRef }) {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#FAF5ED]">
      {/* Texture giấy ngà cổ truyền */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #FAF5ED 50%, #DDD1BF 100%)'
        }}
      />
      
      {/* Fiber grain */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 4px)`
        }}
      />

      {/* 3D Camera Stage */}
      <div 
        ref={cameraRef}
        className="lab-hero-camera will-transform relative z-10 w-full max-w-4xl flex flex-col items-center justify-center text-center px-6"
        style={{ perspective: '1200px' }}
      >
        
        {/* Eyebrow marker */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#241711] text-amber-100 text-xs font-mono uppercase tracking-[0.3em] mb-4 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#DA251D]" />
          <span>PHÒNG THÍ NGHIỆM CHUYỂN ĐỘNG · SCENE 01</span>
        </div>

        {/* Title */}
        <h2 className="font-display font-light text-5xl sm:text-7xl md:text-8xl uppercase tracking-[0.25em] text-[#17100C] leading-none">
          KÝ HỌA
        </h2>

        <h1 className="font-display font-black text-6xl sm:text-8xl md:text-[130px] uppercase tracking-tight leading-none text-[#B71918] drop-shadow-[0_4px_24px_rgba(183,25,24,0.35)] mt-3">
          SỬ ĐẢNG
        </h1>

        {/* Waypoint 1: Initial Nib Pos */}
        <div 
          data-step="hero-nib"
          className="w-6 h-6 rounded-full border border-dashed border-red-500/40 pointer-events-none my-2 flex items-center justify-center"
        />

        {/* Waypoint 2: Calligraphic Underline */}
        <div 
          data-step="hero-underline"
          className="w-full max-w-lg h-3 rounded-full border border-dashed border-red-500/40 pointer-events-none my-4"
        />

        <p className="font-heading italic text-lg sm:text-2xl text-[#3A2A20] font-semibold mt-4">
          Một Nét Mực Xuyên Suốt Ba Thời Khắc Lịch Sử
        </p>

        <p className="text-xs font-mono text-[#785d4d] uppercase tracking-widest mt-2">
          [Cuộn để kích hoạt cú dive camera & chuyển cảnh vật thể sống ↓]
        </p>

        {/* Waypoint 3: Dive Portal at center */}
        <div 
          data-step="hero-portal"
          className="absolute inset-0 m-auto w-16 h-16 rounded-full border-2 border-dashed border-red-600/30 pointer-events-none"
        />

      </div>
    </section>
  );
}
