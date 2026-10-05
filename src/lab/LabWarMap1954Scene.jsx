import React from 'react';
import { Map, Target } from 'lucide-react';

/**
 * LAB WAR MAP 1954 SCENE — SCENE 03 TRONG MOTION PROTOTYPE
 * Sa bàn chiến lược Điện Biên Phủ.
 * Điểm kết tụ của vật thể sống: Nét mực son từ 1930 vươn tới và nở rộ thành mạng lưới chiến hào đồng tâm bao vây De Castries!
 */
export default function LabWarMap1954Scene({ mapCameraRef }) {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#070b0e] text-white">
      
      {/* Top HUD */}
      <div className="absolute top-6 left-6 z-30 pointer-events-none space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-vn-gold/40 text-vn-gold text-xs font-mono">
          <Map className="w-3.5 h-3.5 text-vn-red" />
          <span>SA BÀN CHIẾN LƯỢC · ĐIỆN BIÊN PHỦ 1954</span>
        </div>
        <div className="text-left">
          <span className="font-display font-black text-3xl sm:text-5xl text-white block">
            1954
          </span>
          <span className="text-xs font-mono text-red-400 uppercase tracking-widest">
            CHIẾN HÀO SIẾT VÒNG VÂY LÒNG CHẢO MƯỜNG THANH
          </span>
        </div>
      </div>

      {/* Map Camera Container */}
      <div 
        ref={mapCameraRef}
        className="lab-map-camera will-transform relative w-full max-w-5xl aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center p-4"
      >
        <svg viewBox="0 0 1000 600" className="w-full h-full rounded-2xl bg-[#080d12] border border-vn-gold/30 shadow-2xl">
          <defs>
            <radialGradient id="labValley" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#141f19" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#080d12" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#030507" stopOpacity="1" />
            </radialGradient>
          </defs>

          <rect width="1000" height="600" fill="url(#labValley)" />

          {/* Topographic Contours */}
          <path d="M 40,60 Q 200,120 160,260 T 60,450" fill="none" stroke="#1f382a" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M 80,30 Q 240,90 200,240 T 100,480" fill="none" stroke="#1f382a" strokeWidth="1.2" />
          <path d="M 960,60 Q 780,180 840,340 T 920,540" fill="none" stroke="#1f382a" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M 920,30 Q 740,150 800,320 T 880,500" fill="none" stroke="#1f382a" strokeWidth="1.2" />

          {/* Mountain Silhouettes */}
          <path d="M 0,0 Q 250,150 120,380 T 0,600 L 0,0 Z" fill="#132018" opacity="0.75" />
          <path d="M 1000,0 Q 750,220 860,420 T 1000,600 L 1000,0 Z" fill="#132018" opacity="0.75" />

          {/* Defense Strongholds */}
          <rect x="670" y="110" width="100" height="70" rx="8" fill="#1e1010" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
          <text x="720" y="105" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily="monospace">BÉATRICE (HIM LAM)</text>

          <rect x="330" y="55" width="100" height="60" rx="8" fill="#1e1010" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
          <text x="380" y="50" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily="monospace">GABRIELLE (ĐỘC LẬP)</text>

          {/* Nam Rom River */}
          <path
            d="M 500,0 Q 460,180 520,300 T 480,480 T 470,600"
            fill="none"
            stroke="#1f364d"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Runway */}
          <line x1="480" y1="220" x2="480" y2="400" stroke="#4a5568" strokeWidth="12" strokeDasharray="16 8" />
          <text x="410" y="210" fill="#94a3b8" fontSize="13" fontFamily="monospace">SÂN BAY MƯỜNG THANH</text>

          {/* Center Stronghold De Castries */}
          <g>
            <circle cx="500" cy="360" r="10" fill="#dd6b20" stroke="#FFCD00" strokeWidth="1.5" />
            <text x="500" y="388" textAnchor="middle" fill="#fbd38d" fontSize="12" fontFamily="sans-serif">
              Hầm De Castries
            </text>
          </g>

          {/* Outpost A1 */}
          <g>
            <circle cx="560" cy="350" r="12" fill="none" stroke="#FFCD00" strokeWidth="1.2" opacity="0.7" />
            <circle cx="560" cy="350" r="7" fill="#DA251D" stroke="#FFCD00" strokeWidth="2" />
            <text x="560" y="330" textAnchor="middle" fill="#FFCD00" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
              ĐỒI A1
            </text>
          </g>
        </svg>

        {/* Waypoint 6: Siege Trench Concentric Waypoint Placeholder */}
        <div 
          data-step="map-trench-stream"
          className="absolute inset-0 m-auto w-64 h-64 rounded-full border-2 border-dashed border-red-500/50 flex items-center justify-center pointer-events-none"
        >
          <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded">
            Waypoint Chiến Hào Siết Vòng
          </span>
        </div>

      </div>
    </section>
  );
}
