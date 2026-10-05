import React, { forwardRef } from 'react';

/**
 * CONTINUITY RED ELEMENT — VẬT THỂ SỐNG XUYÊN SCENE (OBJECT CONTINUITY PRIMITIVE)
 * Lấy cảm hứng từ Codrops OneElementScroll & Flip:
 * - Là 1 phần tử duy nhất định vị fixed trên viewport.
 * - Thay vì mỗi component có 1 vệt đỏ riêng, thực thể này biến ảo hình thái:
 *   Mode 1: 'nib' (Đầu ngòi bút lông & giọt mực son tại Hero)
 *   Mode 2: 'underline' (Dải ruy-băng thư pháp gạch dưới tiêu đề SỬ ĐẢNG)
 *   Mode 3: 'flood' (Hố mực camera dive nuốt trọn màn hình)
 *   Mode 4: 'seal' (Con dấu mộc son tròn 1930 đập xuống bản thảo)
 *   Mode 5: 'bleed' (Dòng máu/mực son chảy qua mép bàn)
 *   Mode 6: 'trench' (Mạng lưới chiến hào đỏ siết chặt thung lũng Mường Thanh)
 */
const ContinuityRedElement = forwardRef(({ mode = 'nib', progress = 0 }, ref) => {
  return (
    <div
      ref={ref}
      id="living-continuity-object"
      className="fixed pointer-events-none z-50 will-change-transform flex items-center justify-center"
      style={{
        transformOrigin: 'center center',
      }}
    >
      {/* Visual representation depending on dynamic morphology */}
      <div className="relative w-full h-full flex items-center justify-center transition-all duration-300">
        
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full bg-red-600/30 blur-xl pointer-events-none" />

        {/* 1. NIB / DROPLET MODE */}
        {mode === 'nib' && (
          <div className="relative flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-[#DA251D] shadow-[0_0_20px_#DA251D] border-2 border-[#FFCD00]" />
            <div className="absolute -top-6 w-3 h-8 bg-gradient-to-t from-[#B71918] to-transparent rounded-full opacity-70" />
          </div>
        )}

        {/* 2. UNDERLINE STROKE MODE */}
        {mode === 'underline' && (
          <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-[#8F1713] via-[#DA251D] to-[#B71918] shadow-[0_0_25px_#DA251D]" />
        )}

        {/* 3. INK FLOOD DIVE MODE */}
        {mode === 'flood' && (
          <div className="w-[140vw] h-[140vh] rounded-full bg-gradient-to-b from-[#8F1713] via-[#DA251D] to-[#120706] shadow-[0_0_100px_#8F1713]" />
        )}

        {/* 4. HISTORIC RED SEAL STAMP 1930 */}
        {mode === 'seal' && (
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-double border-[#FAF5ED] bg-[#8b1310] shadow-[0_0_35px_rgba(218,37,29,0.85)] flex flex-col items-center justify-center text-center p-2 text-[#FAF5ED] rotate-[-6deg]">
            <span className="text-amber-300 text-sm font-bold leading-none mb-0.5">★</span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase font-mono tracking-widest leading-tight">
              ĐẢNG CỘNG SẢN<br />VIỆT NAM
            </span>
            <div className="w-12 h-[1px] bg-amber-200/50 my-1" />
            <span className="text-[9px] font-mono font-bold text-amber-200 tracking-wider">
              03 · 02 · 1930
            </span>
          </div>
        )}

        {/* 5. BLEED STREAM */}
        {mode === 'bleed' && (
          <div className="w-4 h-36 rounded-full bg-gradient-to-b from-[#DA251D] via-[#B71918] to-transparent shadow-[0_0_15px_#DA251D]" />
        )}

        {/* 6. TACTICAL TRENCH & ASSAULT CONCENTRIC RINGS */}
        {mode === 'trench' && (
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Concentric rings pulsing into Mường Thanh */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#DA251D] opacity-90 shadow-[0_0_30px_#DA251D]" />
            <div className="absolute w-3/4 h-3/4 rounded-full border-2 border-red-500 opacity-80" />
            <div className="absolute w-1/2 h-1/2 rounded-full border-2 border-dashed border-red-400 opacity-70" />
            <div className="w-8 h-8 rounded-full bg-red-600/80 border border-amber-300 flex items-center justify-center shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFCD00]" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
});

export default ContinuityRedElement;
