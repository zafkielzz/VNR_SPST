import React, { useState } from 'react';
import { 
  Map, 
  ChevronRight, 
  Crosshair, 
  Flag, 
  Shield, 
  Radio, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  Calendar,
  Compass
} from 'lucide-react';
import { CAMPAIGN_MAP_DATA } from '../data/campaignMapData';

export default function CampaignMapSection() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [selectedOutpost, setSelectedOutpost] = useState(null);

  const currentPhase = CAMPAIGN_MAP_DATA.phases[activePhaseIndex];

  return (
    <section id="sa-ban-chien-dich" className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vn-red/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vn-charcoal border border-vn-gold/30 text-vn-gold text-xs uppercase tracking-widest mb-4 shadow-lg">
          <Map className="w-3.5 h-3.5 text-vn-red" />
          <span>Sa Bàn Chiến Lược Tương Tác 2D</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 tracking-tight">
          {CAMPAIGN_MAP_DATA.title}
        </h2>
        <p className="text-sm sm:text-base text-vn-ivory/80 font-serif italic">
          "{CAMPAIGN_MAP_DATA.subtitle}"
        </p>
      </div>

      {/* Phase Selector Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {CAMPAIGN_MAP_DATA.phases.map((phase, idx) => {
          const isActive = activePhaseIndex === idx;
          return (
            <button
              key={phase.id}
              onClick={() => {
                setActivePhaseIndex(idx);
                setSelectedOutpost(null);
              }}
              className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-vn-red-deep/90 to-vn-red/80 border-vn-gold shadow-xl shadow-vn-red/30 scale-[1.02]'
                  : 'bg-vn-charcoal/70 border-vn-gold/20 hover:border-vn-gold/50 hover:bg-vn-charcoal/90 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className={`font-mono font-bold tracking-widest ${isActive ? 'text-vn-gold' : 'text-vn-ivory/60'}`}>
                  {phase.number}
                </span>
                <span className="text-[11px] font-mono text-vn-ivory/70 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-vn-gold" />
                  {phase.timeframe}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-1">
                {phase.title}
              </h3>
              <p className="text-xs text-vn-ivory/80 line-clamp-2 font-light">
                {phase.summary}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Campaign Visual Grid: SVG Tactical Map on Left, Battle Log on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Tactical SVG Map (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-vn-charcoal/90 border-2 border-vn-gold/30 p-4 sm:p-6 relative overflow-hidden shadow-2xl backdrop-blur-md">
          
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-vn-ivory/10 text-xs font-mono">
            <span className="text-vn-gold flex items-center gap-1.5 font-bold">
              <Crosshair className="w-4 h-4 text-vn-red animate-spin" style={{ animationDuration: '8s' }} />
              SA BÀN LÒNG CHẢO MƯỜNG THANH
            </span>
            <span className="text-vn-ivory/60">
              Đang chọn: <strong className="text-white">{currentPhase.number}</strong>
            </span>
          </div>

          {/* SVG Canvas for Battlefield */}
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#0d1217] border border-vn-gold/20 overflow-hidden shadow-inner flex items-center justify-center">
            
            {/* Topographic Contour Background */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="valleyGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1a251e" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#0d1419" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#080c10" stopOpacity="1" />
                </radialGradient>
                <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="4"
                  markerHeight="4"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#DA251D" />
                </marker>
                <marker
                  id="arrow-gold"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="4"
                  markerHeight="4"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#FFCD00" />
                </marker>
              </defs>

              {/* Valley floor */}
              <rect width="100" height="100" fill="url(#valleyGlow)" />

              {/* Mountain ranges surrounding the valley */}
              <path d="M 0,0 Q 25,20 15,45 T 0,100 L 0,0 Z" fill="#151e18" opacity="0.6" />
              <path d="M 100,0 Q 75,30 85,60 T 100,100 L 100,0 Z" fill="#151e18" opacity="0.6" />

              {/* Nam Rom River meandering through valley */}
              <path
                d="M 50,0 Q 45,25 52,45 T 48,75 T 45,100"
                fill="none"
                stroke="#2b4c6f"
                strokeWidth="2.5"
                strokeDasharray="1 0"
                opacity="0.7"
              />

              {/* Sân bay Mường Thanh Runway */}
              <line x1="48" y1="36" x2="48" y2="60" stroke="#718096" strokeWidth="3" strokeDasharray="3 2" />
              <text x="40" y="34" fill="#a0aec0" fontSize="3" fontFamily="monospace">SÂN BAY MƯỜNG THANH</text>

              {/* Attack Arrows according to current phase */}
              {activePhaseIndex === 0 && (
                <g stroke="#DA251D" strokeWidth="1.2" fill="none" opacity="0.85">
                  {/* Arrow toward Him Lam */}
                  <path d="M 85,15 Q 78,20 72,24" markerEnd="url(#arrow)" />
                  {/* Arrow toward Doc Lap */}
                  <path d="M 20,8 Q 30,12 36,17" markerEnd="url(#arrow)" />
                  {/* Arrow toward Ban Keo */}
                  <path d="M 15,35 Q 22,34 26,33" markerEnd="url(#arrow)" />
                </g>
              )}

              {activePhaseIndex === 1 && (
                <g stroke="#DA251D" strokeWidth="1.2" fill="none" opacity="0.85">
                  {/* Pincer movements around central hills */}
                  <path d="M 85,45 Q 75,48 67,49" markerEnd="url(#arrow)" />
                  <path d="M 85,60 Q 73,58 64,56" markerEnd="url(#arrow)" />
                  {/* Trench system constriction */}
                  <circle cx="50" cy="54" r="18" stroke="#f6ad55" strokeWidth="0.8" strokeDasharray="2 2" fill="none" opacity="0.6" />
                </g>
              )}

              {activePhaseIndex === 2 && (
                <g stroke="#FFCD00" strokeWidth="1.5" fill="none" opacity="0.9">
                  {/* Total concentric assault towards HQ */}
                  <path d="M 30,55 L 46,57" markerEnd="url(#arrow-gold)" />
                  <path d="M 70,55 L 54,57" markerEnd="url(#arrow-gold)" />
                  <path d="M 50,42 L 50,54" markerEnd="url(#arrow-gold)" />
                  <path d="M 50,75 L 50,62" markerEnd="url(#arrow-gold)" />
                  <circle cx="50" cy="58" r="8" stroke="#DA251D" strokeWidth="1" fill="#DA251D" fillOpacity="0.2" />
                </g>
              )}

              {/* Outpost Nodes */}
              {CAMPAIGN_MAP_DATA.outposts.map((outpost) => {
                const isTarget = currentPhase.activeOutposts?.includes(outpost.id);
                const isSelected = selectedOutpost?.id === outpost.id;

                let nodeFill = "#4a5568";
                if (outpost.type === 'hotspot') nodeFill = "#e53e3e";
                if (outpost.type === 'hq') nodeFill = "#dd6b20";
                if (isTarget) nodeFill = "#ecc94b";

                return (
                  <g 
                    key={outpost.id} 
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedOutpost(outpost)}
                  >
                    {/* Pulsing ring if targeted in this phase */}
                    {isTarget && (
                      <circle
                        cx={outpost.x}
                        cy={outpost.y}
                        r="3.5"
                        fill="none"
                        stroke="#FFCD00"
                        strokeWidth="0.6"
                        className="animate-ping"
                        style={{ transformOrigin: `${outpost.x}px ${outpost.y}px`, animationDuration: '2s' }}
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      cx={outpost.x}
                      cy={outpost.y}
                      r={isSelected ? "3" : isTarget ? "2.5" : "2"}
                      fill={nodeFill}
                      stroke={isSelected ? "#FFFFFF" : isTarget ? "#DA251D" : "#2d3748"}
                      strokeWidth={isSelected ? "1" : "0.5"}
                      filter={isTarget ? "url(#glowGold)" : undefined}
                    />

                    {/* Outpost Label */}
                    <text
                      x={outpost.x}
                      y={outpost.y - 3.5}
                      textAnchor="middle"
                      fill={isSelected ? "#FFCD00" : isTarget ? "#FFFFFF" : "#a0aec0"}
                      fontSize="2.6"
                      fontWeight={isTarget ? "bold" : "normal"}
                      fontFamily="sans-serif"
                    >
                      {outpost.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Overlay hint */}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-vn-gold/20 text-[10px] text-vn-ivory/70 font-mono">
              💡 Bấm vào điểm cứ điểm trên sa bàn để xem chi tiết
            </div>
          </div>

        </div>

        {/* Battle Log & Historical Intel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Phase Key Battles List */}
          <div className="p-6 rounded-3xl bg-vn-charcoal/80 border border-vn-gold/30 shadow-xl backdrop-blur-md">
            <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Flag className="w-4 h-4 text-vn-gold" />
              Diễn Biến Then Chốt Trong {currentPhase.number}:
            </h3>

            <div className="space-y-3">
              {currentPhase.keyBattles.map((battle, bIdx) => (
                <div 
                  key={bIdx}
                  className="p-3.5 rounded-xl bg-vn-black/60 border border-vn-gold/20 hover:border-vn-gold/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <strong className="text-vn-gold font-sans">{battle.name}</strong>
                    <span className="text-[11px] font-mono text-vn-ivory/60">{battle.date}</span>
                  </div>
                  <p className="text-xs text-vn-ivory/80 leading-relaxed font-sans font-light">
                    {battle.result}
                  </p>
                </div>
              ))}
            </div>

            {/* Strategic Impact */}
            <div className="mt-4 p-3.5 rounded-xl bg-vn-red-deep/30 border border-vn-red/40">
              <span className="text-[11px] font-bold uppercase text-vn-gold block mb-1">
                Ý nghĩa chiến lược đợt tiến công:
              </span>
              <p className="text-xs text-white leading-relaxed font-medium">
                {currentPhase.impact}
              </p>
            </div>
          </div>

          {/* Outpost Selected Detail Card */}
          {selectedOutpost && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-vn-charcoal to-vn-black border border-vn-gold shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-vn-red/30 text-vn-gold border border-vn-gold/30">
                  Mã định danh Pháp: {selectedOutpost.code}
                </span>
                <span className="text-xs text-vn-ivory/50 font-mono">Thuộc đợt {selectedOutpost.phase}</span>
              </div>
              <h4 className="font-display font-bold text-xl text-white mb-2">
                {selectedOutpost.name}
              </h4>
              <p className="text-xs text-vn-ivory/80 leading-relaxed">
                {selectedOutpost.id === 'a1' && "Đồi A1 (Éliane 2) là cứ điểm cao nhất phân khu trung tâm, nơi quân ta đào hầm ngầm đặt khối bộc phá 960kg làm hiệu lệnh tổng công kích."}
                {selectedOutpost.id === 'himlam' && "Him Lam là trung tâm đề kháng kiên cố nhất phân khu Bắc. Nơi anh hùng Phan Đình Giót lấy thân mình lấp lỗ châu mai mở đường xung phong."}
                {selectedOutpost.id === 'hamdecastries' && "Sở chỉ huy ngầm của tướng Christian de Castries, nơi lá cờ Quyết chiến Quyết thắng tung bay vào hồi 17h30 chiều 07/05/1954."}
                {selectedOutpost.id === 'doclap' && "Cứ điểm Độc Lập bị san phẳng sau một đêm chiến đấu dũng cảm, mở thông đường tiến từ phía Bắc."}
                {selectedOutpost.id === 'bankeo' && "Bản Kéo là nơi toàn bộ lính đối phương đào ngũ, mở cánh cửa Tây Bắc cho quân ta tiến vào."}
                {selectedOutpost.id === 'sanbay' && "Sân bay dã chiến dài 1,4km bị chiến hào quân ta cắt đứt đôi, bóp nghẹt toàn bộ tiếp tế đường không của Pháp."}
                {selectedOutpost.id === 'hongcum' && "Phân khu Nam bị cô lập hoàn toàn, không thể cứu viện cho Mường Thanh và đầu hàng cùng ngày."}
              </p>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}
