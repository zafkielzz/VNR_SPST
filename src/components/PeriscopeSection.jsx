import React, { useState, useRef, useEffect } from 'react';
import { 
  Crosshair, 
  Target, 
  Compass, 
  Radio, 
  Sparkles,
  MoveHorizontal,
  Lock,
  Search
} from 'lucide-react';
import { soundSynth } from '../utils/soundSynth';

const PERISCOPE_TARGETS = [
  {
    id: "target-himlam",
    name: "Trung tâm Đề kháng Him Lam (Béatrice)",
    angle: 45,
    azimuth: "045° Đông Bắc",
    distance: "1.250m",
    status: "ĐÃ KHÓA TỌA ĐỘ HỎA LỰC",
    intel: "Phát hiện 3 tầng hỏa điểm ngầm bê tông cốt thép, hàng rào dây thép gai bùng nhùng nhiều lớp. Cần dùng trọng pháo 105mm chế áp trước khi mở cửa mở.",
    photo: "/images/exhibits/exhibit_5_1.jpg",
    action: "Chuẩn bị nổ súng mở màn Đợt 1 (13/03/1954)"
  },
  {
    id: "target-a1",
    name: "Cứ điểm Đồi A1 (Éliane 2)",
    angle: 120,
    azimuth: "120° Đông Nam",
    distance: "450m",
    status: "CHIẾN HÀO ĐÃ ĐÀO SÁT CHÂN ĐỒI",
    intel: "Cứ điểm kiên cố nhất phân khu trung tâm, hầm ngầm cố thủ sâu trong lòng núi. Bộ đội công binh đang đào đường hầm ngầm dài 49m để đưa khối bộc phá 960kg vào đáy hầm.",
    photo: "/images/exhibits/exhibit_6_1.jpg",
    action: "Hiệu lệnh tổng công kích đêm 06/05/1954"
  },
  {
    id: "target-decastries",
    name: "Sở Chỉ Huy De Castries (Mường Thanh)",
    angle: 180,
    azimuth: "180° Chính Nam",
    distance: "600m",
    status: "BAO VÂY 4 PHÍA, CÔ LẬP HOÀN TOÀN",
    intel: "Hầm vòm sắt gợn sóng bọc bao cát dày 3 mét. Quân Pháp đã kiệt quệ đạn dược, sân bay bị pháo cao xạ khống chế hoàn toàn. Quân ta chuẩn bị tổ xung kích ập vào.",
    photo: "/images/exhibits/exhibit_6_1.jpg",
    action: "17h30 ngày 07/05/1954 bắt sống tướng De Castries"
  },
  {
    id: "target-phao",
    name: "Trận Địa Trọng Pháo 105mm Của Ta",
    angle: 300,
    azimuth: "300° Tây Bắc",
    distance: "3.500m",
    status: "HOÀN TẤT CÔNG SỰ NGỤY TRANG KIÊN CỐ",
    intel: "Toàn bộ các khẩu đội pháo đã được đưa vào hầm kiên cố khoét sâu trong lòng núi sau khi thực hiện quyết định 'Đánh chắc, tiến chắc'. Sẵn sàng dập tắt mọi hỏa điểm pháo binh đối phương.",
    photo: "/images/exhibits/exhibit_5_1.jpg",
    action: "Chiến thuật pháo binh ngắm bắn trực tiếp của Đảng"
  }
];

export default function PeriscopeSection() {
  const [currentAngle, setCurrentAngle] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, angle: 45 });
  const reticleRef = useRef(null);

  // Find target within lock tolerance (±20 degrees)
  let lockedTarget = null;
  let minDiff = 999;

  for (const t of PERISCOPE_TARGETS) {
    let diff = Math.abs(currentAngle - t.angle);
    if (diff > 180) diff = 360 - diff;
    if (diff < minDiff) {
      minDiff = diff;
      if (diff <= 22) {
        lockedTarget = t;
      }
    }
  }

  const isExactLock = minDiff <= 8;

  // Pointer drag logic
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      angle: currentAngle,
    };
    if (reticleRef.current) {
      reticleRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    let newAngle = Math.round(dragStartRef.current.angle + deltaX * 0.4);
    newAngle = ((newAngle % 360) + 360) % 360;
    setCurrentAngle(newAngle);
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        if (reticleRef.current) {
          reticleRef.current.releasePointerCapture(e.pointerId);
        }
      } catch (err) {
        // Safe fallback
      }
    }
  };

  const snapToTarget = (targetAngle) => {
    setCurrentAngle(targetAngle);
    try {
      soundSynth.playGong(0.15);
    } catch (e) {}
  };

  return (
    <section id="kinh-tiem-vong-chien-hao" className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vn-charcoal border border-vn-gold/40 text-vn-gold text-xs uppercase tracking-widest mb-4 shadow-xl">
          <Target className="w-3.5 h-3.5 text-vn-red animate-pulse" />
          <span>Tương Tác Nhập Vai: Kính Tiềm Vọng Trinh Sát 1954</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 tracking-tight">
          Góc Nhìn Qua Kính Tiềm Vọng Chiến Hào
        </h2>
        <p className="text-sm sm:text-base text-vn-ivory/80 font-light leading-relaxed">
          <strong>Rê chuột hoặc vuốt ống kính</strong> để xoay góc quan sát 360° quanh lòng chảo Điện Biên. 
          Khi thước ngắm tiếp cận cứ điểm, hệ thống quang học sẽ tự động khóa mục tiêu trinh sát.
        </p>
      </div>

      {/* Interactive Periscope Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
        
        {/* Left: Circular Optical Reticle (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center select-none">
          
          <div 
            ref={reticleRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`relative w-full max-w-[440px] sm:max-w-[480px] aspect-square rounded-full border-8 border-[#151a21] bg-black shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden p-2 flex items-center justify-center ring-4 transition-all duration-300 cursor-grab active:cursor-grabbing ${
              lockedTarget 
                ? 'ring-vn-red/80 shadow-[0_0_60px_rgba(218,37,29,0.4)]' 
                : 'ring-vn-gold/30'
            }`}
          >
            {/* Drifting Archival Landscape Photo */}
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <img
                src={lockedTarget ? lockedTarget.photo : "/images/exhibits/exhibit_5_1.jpg"}
                alt="Khung cảnh trinh sát"
                className={`w-full h-full object-cover filter transition-all duration-500 scale-125 ${
                  lockedTarget ? 'contrast-125 sepia-[0.3]' : 'contrast-90 blur-[1.5px] sepia-[0.5] opacity-50'
                }`}
                style={{
                  transform: `scale(1.2) translateX(${-((currentAngle % 90) - 45) * 1.5}px)`
                }}
              />

              {/* Optical Glass / Trench Vignette Tint */}
              <div className="absolute inset-0 bg-emerald-950/25 mix-blend-color pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
            </div>

            {/* Military Reticle SVG Overlay */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Outer compass ring */}
              <circle cx="100" cy="100" r="95" fill="none" stroke={lockedTarget ? "#DA251D" : "#FFCD00"} strokeWidth="0.8" opacity="0.7" />
              <circle cx="100" cy="100" r="85" fill="none" stroke="#FFCD00" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.4" />
              
              {/* Crosshair Lines */}
              <line x1="100" y1="12" x2="100" y2="188" stroke={lockedTarget ? "#DA251D" : "#FFCD00"} strokeWidth="0.8" opacity="0.75" />
              <line x1="12" y1="100" x2="188" y2="100" stroke={lockedTarget ? "#DA251D" : "#FFCD00"} strokeWidth="0.8" opacity="0.75" />

              {/* Reticle milliradian ticks */}
              {[-30, -20, -10, 10, 20, 30].map((offset) => (
                <React.Fragment key={offset}>
                  <line x1={100 + offset} y1="96" x2={100 + offset} y2="104" stroke="#FFCD00" strokeWidth="0.6" opacity="0.8" />
                  <line x1="96" y1={100 + offset} x2="104" y2={100 + offset} stroke="#FFCD00" strokeWidth="0.6" opacity="0.8" />
                </React.Fragment>
              ))}

              {/* Center Lock Reticle */}
              {lockedTarget ? (
                <g>
                  <circle cx="100" cy="100" r="14" fill="none" stroke="#DA251D" strokeWidth="1.2" className="animate-ping" style={{ transformOrigin: '100px 100px', animationDuration: '2s' }} />
                  <circle cx="100" cy="100" r="10" fill="none" stroke="#DA251D" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="3.5" fill="#DA251D" />
                </g>
              ) : (
                <circle cx="100" cy="100" r="6" fill="none" stroke="#FFCD00" strokeWidth="0.8" strokeDasharray="2 2" />
              )}

              {/* Azimuth Readout at top */}
              <text x="100" y="24" textAnchor="middle" fill={lockedTarget ? "#DA251D" : "#FFCD00"} fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                {currentAngle.toString().padStart(3, '0')}° AZIMUTH
              </text>
            </svg>

            {/* Floating Status Pill on lens */}
            <div className={`absolute bottom-6 px-4 py-1.5 rounded-full border text-[11px] font-mono flex items-center gap-2 shadow-xl backdrop-blur-md transition-all ${
              lockedTarget 
                ? 'bg-red-950/90 border-red-500 text-red-200 shadow-red-950/50' 
                : 'bg-black/80 border-vn-gold/40 text-vn-gold'
            }`}>
              {lockedTarget ? (
                <>
                  <Lock className="w-3 h-3 text-red-400 animate-pulse" />
                  <span className="font-bold tracking-wider">{lockedTarget.status}</span>
                </>
              ) : (
                <>
                  <Search className="w-3 h-3 text-vn-gold animate-spin" />
                  <span className="text-vn-ivory/80 tracking-wide">QUÉT QUAN SÁT (XOAY 360°)</span>
                </>
              )}
            </div>

            {/* Drag hint overlay for touch/mouse */}
            <div className="absolute top-6 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-vn-ivory/60 flex items-center gap-1.5 pointer-events-none">
              <MoveHorizontal className="w-3 h-3 text-vn-gold" />
              <span>Kéo rê để quét góc</span>
            </div>

          </div>

          {/* Azimuth Slider / Scrubber */}
          <div className="w-full max-w-md mt-6 px-4">
            <div className="flex items-center justify-between text-xs font-mono text-vn-gold mb-2">
              <span>000° BẮC</span>
              <span className="font-bold text-sm bg-vn-charcoal border border-vn-gold/40 px-3 py-0.5 rounded-full">
                GÓC QUAN SÁT: {currentAngle}°
              </span>
              <span>360°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="359" 
              value={currentAngle}
              onChange={(e) => setCurrentAngle(parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-lg accent-vn-gold bg-vn-charcoal border border-vn-gold/30 cursor-pointer"
            />
          </div>

        </div>

        {/* Right: Tactical Reconnaissance Briefing Card (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-vn-charcoal/90 border-2 border-vn-gold/30 shadow-2xl backdrop-blur-md space-y-5 relative overflow-hidden">
          
          <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-vn-ivory/15">
            <span className="text-vn-gold font-bold flex items-center gap-1.5">
              <Radio className={`w-3.5 h-3.5 ${lockedTarget ? 'text-vn-red animate-pulse' : 'text-vn-ivory/50'}`} />
              ĐIỆN BÁO TRINH SÁT GIAO THÔNG HÀO
            </span>
            <span className="text-vn-ivory/60 font-bold">
              {lockedTarget ? lockedTarget.azimuth : `${currentAngle}°`}
            </span>
          </div>

          {lockedTarget ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40 inline-block mb-2">
                  {isExactLock ? '★ KHÓA TỌA ĐỘ CHÍNH XÁC 100%' : 'MỤC TIÊU TRONG TẦM NGẮM'}
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                  {lockedTarget.name}
                </h3>
                <p className="text-xs font-mono text-vn-gold mt-1">
                  Khoảng cách trinh sát: <strong>{lockedTarget.distance}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-vn-black/60 border border-vn-gold/20 text-xs sm:text-sm text-vn-ivory/90 leading-relaxed font-sans">
                <strong className="text-vn-gold block mb-1 font-mono uppercase text-[11px]">
                  Báo cáo tình báo thực địa:
                </strong>
                {lockedTarget.intel}
              </div>

              <div className="p-3.5 rounded-xl bg-vn-red-deep/20 border border-vn-red/40 text-xs text-vn-ivory/90">
                <strong className="text-vn-red block mb-1 font-mono uppercase text-[11px]">
                  Hành động chiến thuật của ta:
                </strong>
                {lockedTarget.action}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center space-y-3">
              <Search className="w-10 h-10 text-vn-gold/40 mx-auto animate-pulse" />
              <h4 className="font-display font-bold text-lg text-white">
                Đang quét lòng chảo Điện Biên
              </h4>
              <p className="text-xs text-vn-ivory/60 max-w-sm mx-auto font-light leading-relaxed">
                Rê chuột lên thấu kính hoặc kéo thanh thước đo góc ở bên trái để điều chỉnh hướng kính tới các vị trí trọng điểm: 
                <strong> 045° Him Lam</strong>, <strong>120° Đồi A1</strong>, <strong>180° Hầm De Castries</strong>, hoặc <strong>300° Trận địa Pháo</strong>.
              </p>
            </div>
          )}

          {/* Quick-Snap Shortcut Badges */}
          <div className="pt-4 border-t border-vn-ivory/10">
            <span className="text-[10px] font-mono text-vn-ivory/60 uppercase tracking-wider block mb-2">
              Khóa nhanh mục tiêu trọng điểm:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PERISCOPE_TARGETS.map((t) => {
                const isSelected = lockedTarget?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => snapToTarget(t.angle)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono text-left transition-all truncate flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-vn-red text-white border-vn-gold font-bold shadow-md shadow-vn-red/30'
                        : 'bg-black/40 border-white/10 text-vn-ivory/70 hover:border-vn-gold/60 hover:text-white'
                    }`}
                  >
                    <Compass className="w-3 h-3 text-vn-gold shrink-0" />
                    <span className="truncate">{t.azimuth.split(' ')[0]}: {t.name.split('(')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
