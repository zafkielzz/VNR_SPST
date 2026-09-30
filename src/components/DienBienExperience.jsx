import React from 'react';
import DecisionTreeSection from './DecisionTreeSection';
import CampaignMapSection from './CampaignMapSection';
import PeriscopeSection from './PeriscopeSection';
import { Flag, Sparkles, Volume2, Shield } from 'lucide-react';

/**
 * DIEN BIEN EXPERIENCE (1954 "BOSS FIGHT" CỦA WEBSITE)
 * Xóa bỏ ranh giới rời rạc giữa Decision Tree, Sa bàn và Kính tiềm vọng.
 * Toàn bộ chương Điện Biên Phủ 1954 trở thành một chuỗi liên hoàn điện ảnh duy nhất:
 * 1. MƯỜNG PHĂNG BRIEFING & RA QUYẾT ĐỊNH CÂN NÃO (26/01/1954)
 * 2. SA BÀN CHIẾN DỊCH TƯƠNG TÁC 3 ĐỢT TIẾN CÔNG (13/03 - 07/05/1954)
 * 3. KÍNH TIỀM VỌNG QUANG HỌC CHIẾN HÀO 360°
 * 4. TOÀN THẮNG TRÊN NÓC HẦM DE CASTRIES (17H30 NGÀY 07/05/1954)
 * 5. ANTI-WOW SILENCE BEAT: Khoảng lặng thiêng liêng để lắng đọng cảm xúc
 */
export default function DienBienExperience() {
  return (
    <div id="dien-bien-1954" className="relative w-full bg-[#080a0d] text-vn-ivory">
      
      {/* ================================================================
          1. PROLOGUE: BÌNH MINH MƯỜNG PHĂNG & QUYẾT ĐỊNH LỊCH SỬ
         ================================================================ */}
      <div className="relative pt-16 pb-8 border-t border-vn-red/40 bg-gradient-to-b from-[#140807] via-[#0b0c10] to-[#080a0d]">
        <div className="max-w-4xl mx-auto text-center px-4 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-mono font-bold uppercase tracking-widest mb-3 shadow-[0_0_25px_rgba(218,37,29,0.5)]">
            <span className="w-2 h-2 rounded-full bg-vn-red animate-ping" />
            <span>ĐỈNH CAO CHIẾN DỊCH ĐIỆN BIÊN PHỦ (1954)</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight">
            56 Ngày Đêm Chấn Động Địa Cầu
          </h2>

          <p className="mt-3 text-sm sm:text-base text-vn-ivory/80 max-w-2xl mx-auto font-light leading-relaxed">
            Từ quyết định cân não nhất cuộc đời Đại tướng Võ Nguyên Giáp đến chiến hào siết chặt lòng chảo Mường Thanh và lá cờ Quyết chiến Quyết thắng trên nóc hầm De Castries.
          </p>
        </div>

        {/* 1. Decision Tree Scene */}
        <DecisionTreeSection />
      </div>

      {/* ================================================================
          TRANSITION: NÉT CHIẾN HÀO ĐỎ BIẾN THÀNH SA BÀN TÁC CHIẾN
         ================================================================ */}
      <div className="relative py-12 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glowing trench line SVG running down the center */}
        <svg viewBox="0 0 100 80" className="w-20 h-16 pointer-events-none">
          <path d="M 50,0 Q 30,40 50,80" fill="none" stroke="#DA251D" strokeWidth="4" strokeDasharray="3 3" />
          <circle cx="50" cy="80" r="4" fill="#FFCD00" className="animate-ping" />
        </svg>
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-vn-gold/70 mt-2">
          CHUYỂN PHƯƠNG CHÂM: "ĐÁNH CHẮC, TIẾN CHẮC" → MỞ MÀN TIẾN CÔNG
        </span>
      </div>

      {/* ================================================================
          2. CAMPAIGN MAP: SA BÀN 3 ĐỢT TIẾN CÔNG MƯỜNG THANH
         ================================================================ */}
      <div className="relative bg-[#070b0e]">
        <CampaignMapSection />
      </div>

      {/* ================================================================
          TRANSITION: TỪ SA BÀN ZOOM THẲNG VÀO THẤU KÍNH TRINH SÁT
         ================================================================ */}
      <div className="relative py-12 flex flex-col items-center justify-center text-center overflow-hidden">
        <svg viewBox="0 0 100 80" className="w-20 h-16 pointer-events-none">
          <circle cx="50" cy="40" r="28" fill="none" stroke="#DA251D" strokeWidth="2" strokeDasharray="2 2" className="animate-spin" style={{ animationDuration: '10s' }} />
          <line x1="50" y1="5" x2="50" y2="75" stroke="#FFCD00" strokeWidth="1" />
          <line x1="15" y1="40" x2="85" y2="40" stroke="#FFCD00" strokeWidth="1" />
        </svg>
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400/80 mt-2">
          GIAO THÔNG HÀO VÂY LẤN → QUAN SÁT QUA KÍNH TIỀM VỌNG
        </span>
      </div>

      {/* ================================================================
          3. PERISCOPE: KÍNH TIỀM VỌNG QUANG HỌC CHIẾN HÀO 360°
         ================================================================ */}
      <div className="relative bg-[#06090c]">
        <PeriscopeSection />
      </div>

      {/* ================================================================
          4. VICTORY CLIMAX: 17H30 NGÀY 07/05/1954 TRÊN NÓC HẦM DE CASTRIES
         ================================================================ */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-8 py-20 bg-gradient-to-b from-[#080c10] via-[#1a0808] to-black overflow-hidden border-t border-vn-red/40">
        
        {/* Golden Victory Radial Aura */}
        <div className="absolute w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-radial-gradient from-vn-red/30 via-vn-gold/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Victory Text */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-vn-gold/50 text-vn-gold text-xs font-mono font-bold uppercase tracking-widest shadow-xl">
              <Flag className="w-3.5 h-3.5 text-vn-red" />
              <span>17H30 NGÀY 07/05/1954 · TOÀN THẮNG</span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-none text-glow-gold">
              Cờ Thắng Lợi Bay Trên Nóc Hầm De Castries
            </h2>

            <p className="font-heading font-black text-lg sm:text-2xl text-vn-gold uppercase tracking-wider">
              "Nên vành hoa đỏ, nên thiên sử vàng"
            </p>

            <p className="font-sans text-sm sm:text-base text-vn-ivory/85 leading-relaxed font-light">
              Tổ xung kích của Đại đội trưởng Tạ Quốc Luật đã dũng mãnh bắt sống toàn bộ Bộ chỉ huy tập đoàn cứ điểm Pháp. Lá cờ <strong>"Quyết chiến Quyết thắng"</strong> tung bay trên nóc hầm De Castries báo hiệu chiến dịch Điện Biên Phủ đã toàn thắng vẻ vang.
            </p>

            <p className="text-xs font-mono text-vn-ivory/50 italic pt-2 border-t border-white/10">
              [Trích dẫn]: NXB Chính trị Quốc gia Sự thật (2021), Giáo trình Lịch sử Đảng Cộng sản Việt Nam, tr. 83–85.
            </p>
          </div>

          {/* Archival Photo of Bunker Victory */}
          <div className="w-full max-w-md lg:max-w-lg aspect-[4/3] rounded-2xl border-2 border-vn-gold/70 bg-black shadow-[0_0_80px_rgba(218,37,29,0.5)] p-3 relative overflow-hidden group">
            <img
              src="/images/exhibits/exhibit_6_1.jpg"
              alt="Cờ Quyết chiến Quyết thắng tung bay nóc hầm De Castries"
              className="w-full h-full object-contain rounded-xl contrast-125 sepia-[0.15]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 text-center">
              <span className="text-[11px] font-mono text-vn-gold font-bold uppercase tracking-wider">
                Khoảnh khắc bắt sống tướng De Castries · Chiều 07/05/1954
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================
          5. ANTI-WOW SILENCE BEAT (KHOẢNG LẶNG THIÊNG LIÊNG)
          Sau cao trào bão lửa: màn hình đen tĩnh lặng để cảm xúc lắng đọng
         ================================================================ */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-black">
        <div className="max-w-xl mx-auto space-y-4">
          <span className="text-xs font-mono tracking-[0.5em] text-vn-gold/60 uppercase block">
            KHOẢNG LẶNG LỊCH SỬ
          </span>
          <h3 className="font-display font-black text-5xl sm:text-7xl text-white tracking-widest text-glow-gold">
            07 · 05 · 1954
          </h3>
          <p className="text-xs sm:text-sm text-vn-ivory/60 font-serif italic max-w-md mx-auto leading-relaxed">
            "56 ngày đêm khoét núi, ngủ hầm, mưa dầm, cơm vắt, máu trộn bùn non... để làm nên bản anh hùng ca bất diệt của thế kỷ XX."
          </p>
          <div className="pt-6">
            <svg viewBox="0 0 40 40" className="w-8 h-8 mx-auto text-vn-gold/40 animate-bounce">
              <path d="M 20,5 L 20,35 M 10,25 L 20,35 L 30,25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

    </div>
  );
}
