import React, { useState } from 'react';
import { 
  Crosshair, 
  Target, 
  Eye, 
  Compass, 
  AlertCircle, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  Maximize2
} from 'lucide-react';

const PERISCOPE_TARGETS = [
  {
    id: "target-himlam",
    name: "Trung tâm Đề kháng Him Lam (Béatrice)",
    angle: 45,
    azimuth: "045° ĐB",
    distance: "1.250m",
    status: "Đã khóa mục tiêu hỏa lực",
    intel: "Phát hiện 3 tầng hỏa điểm ngầm bê tông cốt thép, hàng rào dây thép gai bùng nhùng nhiều lớp. Cần dùng trọng pháo 105mm chế áp trước khi mở cửa mở.",
    photo: "/images/exhibits/exhibit_5_1.jpg",
    action: "Chuẩn bị nổ súng mở màn Đợt 1 (13/03/1954)"
  },
  {
    id: "target-a1",
    name: "Cứ điểm Đồi A1 (Éliane 2)",
    angle: 120,
    azimuth: "120° ĐN",
    distance: "450m",
    status: "Chiến hào đã đào sát chân đồi",
    intel: "Cứ điểm kiên cố nhất phân khu trung tâm, hầm ngầm cố thủ sâu trong lòng núi. Bộ đội công binh đang đào đường hầm ngầm dài 49m để đưa khối bộc phá 960kg vào đáy hầm.",
    photo: "/images/exhibits/exhibit_6_1.jpg",
    action: "Hiệu lệnh tổng công kích đêm 06/05/1954"
  },
  {
    id: "target-decastries",
    name: "Sở Chỉ Huy De Castries (Mường Thanh)",
    angle: 180,
    azimuth: "180° Nam",
    distance: "600m",
    status: "Bao vây 4 phía, cô lập hoàn toàn",
    intel: "Hầm vòm sắt gợn sóng bọc bao cát dày 3 mét. Quân Pháp đã kiệt quệ đạn dược, sân bay bị pháo cao xạ khống chế hoàn toàn. Quân ta chuẩn bị tổ xung kích ập vào.",
    photo: "/images/exhibits/exhibit_6_1.jpg",
    action: "17h30 ngày 07/05/1954 bắt sống tướng De Castries"
  },
  {
    id: "target-phao",
    name: "Trận Địa Trọng Pháo 105mm Của Ta",
    angle: 300,
    azimuth: "300° TB",
    distance: "3.500m",
    status: "Đã hoàn thành công sự ngụy trang vững chắc",
    intel: "Toàn bộ các khẩu đội pháo đã được đưa vào hầm kiên cố khoét sâu trong lòng núi sau khi thực hiện quyết định 'Đánh chắc, tiến chắc'. Sẵn sàng dập tắt mọi hỏa điểm pháo binh đối phương.",
    photo: "/images/exhibits/exhibit_5_1.jpg",
    action: "Chiến thuật pháo binh ngắm bắn trực tiếp của Đảng"
  }
];

export default function PeriscopeSection() {
  const [selectedTarget, setSelectedTarget] = useState(PERISCOPE_TARGETS[0]);

  return (
    <section id="kinh-tiem-vong-chien-hao" className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vn-charcoal border border-vn-gold/40 text-vn-gold text-xs uppercase tracking-widest mb-4 shadow-xl">
          <Target className="w-3.5 h-3.5 text-vn-red" />
          <span>Tương Tác Nhập Vai Độc Đáo: Kính Tiềm Vọng Chiến Hào</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 tracking-tight">
          Góc Nhìn Qua Kính Tiềm Vọng Chiến Hào 1954
        </h2>
        <p className="text-sm sm:text-base text-vn-ivory/80 font-light leading-relaxed">
          Đóng vai người chiến sĩ trinh sát trong giao thông hào Điện Biên, xoay chuyển kính tiềm vọng quang học 
          để quan sát các cứ điểm đối phương và thấu hiểu nghệ thuật vây lấn từng tấc đất của quân ta.
        </p>
      </div>

      {/* Target Angle Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {PERISCOPE_TARGETS.map((t) => {
          const isSelected = selectedTarget.id === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTarget(t)}
              className={`px-5 py-2.5 rounded-full border-2 text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-vn-red to-vn-red-deep border-vn-gold text-white shadow-[0_0_20px_rgba(218,37,29,0.6)] scale-105'
                  : 'bg-vn-charcoal/80 border-white/10 text-vn-ivory/70 hover:border-vn-gold/60 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-vn-gold" />
              <span>Góc {t.azimuth}: {t.name.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Periscope Dual-Panel Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Circular Periscope Optical Reticle (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div className="relative w-full max-w-[480px] aspect-square rounded-full border-8 border-[#1a202c] bg-black shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden p-2 flex items-center justify-center ring-4 ring-vn-gold/40">
            
            {/* Target image with vintage lens filter */}
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <img
                src={selectedTarget.photo}
                alt={selectedTarget.name}
                className="w-full h-full object-cover sepia-[0.25] contrast-125 filter transition-all duration-700 scale-110"
              />
              {/* Green night-vision/optical glass tint */}
              <div className="absolute inset-0 bg-emerald-950/20 mix-blend-color pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
            </div>

            {/* Military Optical Reticle Overlay (Thước ngắm quang học) */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Outer compass ring */}
              <circle cx="100" cy="100" r="95" fill="none" stroke="#FFCD00" strokeWidth="0.75" opacity="0.6" />
              <circle cx="100" cy="100" r="85" fill="none" stroke="#FFCD00" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.5" />
              
              {/* Milliradian Crosshair */}
              <line x1="100" y1="10" x2="100" y2="190" stroke="#FFCD00" strokeWidth="0.8" opacity="0.7" />
              <line x1="10" y1="100" x2="190" y2="100" stroke="#FFCD00" strokeWidth="0.8" opacity="0.7" />

              {/* Tick marks on crosshair */}
              {[-30, -20, -10, 10, 20, 30].map((offset) => (
                <React.Fragment key={offset}>
                  <line x1={100 + offset} y1="97" x2={100 + offset} y2="103" stroke="#FFCD00" strokeWidth="0.6" opacity="0.8" />
                  <line x1="97" y1={100 + offset} x2="103" y2={100 + offset} stroke="#FFCD00" strokeWidth="0.6" opacity="0.8" />
                </React.Fragment>
              ))}

              {/* Central Target Circle */}
              <circle cx="100" cy="100" r="8" fill="none" stroke="#DA251D" strokeWidth="1" className="animate-ping" style={{ transformOrigin: '100px 100px', animationDuration: '3s' }} />
              <circle cx="100" cy="100" r="4" fill="#DA251D" />

              {/* Azimuth text */}
              <text x="100" y="24" textAnchor="middle" fill="#FFCD00" fontSize="6" fontFamily="monospace" fontWeight="bold">
                {selectedTarget.azimuth}
              </text>
              <text x="100" y="180" textAnchor="middle" fill="#FFCD00" fontSize="5" fontFamily="monospace">
                CỰ LY: {selectedTarget.distance}
              </text>
            </svg>

            {/* Bottom Status Ticker */}
            <div className="absolute bottom-6 px-4 py-1 rounded-full bg-black/80 border border-vn-gold/40 text-[10px] font-mono text-vn-gold flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{selectedTarget.status}</span>
            </div>

          </div>

          <span className="text-xs text-vn-ivory/50 font-mono mt-3">
            Ống kính trinh sát quang học bộ binh Quân đội nhân dân Việt Nam
          </span>

        </div>

        {/* Right: Tactical Reconnaissance Briefing (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-vn-charcoal/90 border-2 border-vn-gold/40 shadow-2xl backdrop-blur-md space-y-4">
          
          <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-vn-ivory/15">
            <span className="text-vn-gold font-bold flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-vn-red animate-pulse" />
              ĐIỆN BÁO TRINH SÁT MẶT TRẬN
            </span>
            <span className="text-vn-ivory/60">TỌA ĐỘ: {selectedTarget.azimuth}</span>
          </div>

          <h3 className="font-display font-black text-2xl text-white">
            {selectedTarget.name}
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-vn-black/60 border border-vn-gold/20">
              <span className="text-vn-ivory/60 block mb-0.5">Khoảng cách:</span>
              <strong className="text-vn-gold text-sm">{selectedTarget.distance}</strong>
            </div>
            <div className="p-3 rounded-xl bg-vn-black/60 border border-vn-gold/20">
              <span className="text-vn-ivory/60 block mb-0.5">Trạng thái:</span>
              <strong className="text-emerald-400 text-xs">{selectedTarget.status}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-vn-black/60 border border-white/10 space-y-1.5">
            <span className="text-xs font-bold uppercase text-vn-gold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-vn-gold" />
              Tình Báo Trinh Sát Thực Địa:
            </span>
            <p className="text-xs sm:text-sm text-vn-ivory/85 leading-relaxed font-sans font-light">
              {selectedTarget.intel}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-vn-red-deep/30 border border-vn-red/40 space-y-1">
            <span className="text-[11px] font-bold uppercase text-vn-gold block">
              Hành Động Chiến Lược Của Quân Ta:
            </span>
            <p className="text-xs text-white font-medium">
              {selectedTarget.action}
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
