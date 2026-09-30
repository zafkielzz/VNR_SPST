import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Eye, 
  Clock, 
  Calendar,
  X
} from 'lucide-react';
import { HISTORICAL_VIDEOS_DATA } from '../data/historicalVideosData';

export default function HistoricalCinemaSection() {
  const [selectedVideo, setSelectedVideo] = useState(HISTORICAL_VIDEOS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSepiaMode, setIsSepiaMode] = useState(false);
  const [countdown, setCountdown] = useState(null); // 3, 2, 1 countdown animation
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    // Trigger 3-2-1 cinema leader countdown
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 500);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setIsPlaying(true);
    }
  }, [countdown]);

  return (
    <section id="rap-chieu-phim-tu-lieu" className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Background Projector Light Cone Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-vn-gold/15 via-vn-red/5 to-transparent blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vn-charcoal border border-vn-gold/40 text-vn-gold text-xs uppercase tracking-widest mb-4 shadow-xl">
          <Film className="w-3.5 h-3.5 text-vn-red animate-spin" style={{ animationDuration: '10s' }} />
          <span>Rạp Chiếu Phim Tài Liệu Lịch Sử 35mm</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 tracking-tight">
          Những Thước Phim Tư Liệu Vô Giá Của Lịch Sử
        </h2>
        <p className="text-sm sm:text-base text-vn-ivory/80 font-light leading-relaxed">
          Tái hiện chân thực khí thế hào hùng của cha ông qua các đoạn phim tài liệu gốc do 
          Điện ảnh Quân đội Nhân dân và các phóng viên chiến trường quốc tế ghi lại.
        </p>
      </div>

      {/* 35mm Vintage Filmstrip Horizontal Reel */}
      <div className="mb-10 relative overflow-hidden rounded-2xl bg-[#090b0e] border-y-4 border-vn-gold/40 shadow-2xl py-3 px-2">
        
        {/* Filmstrip sprocket holes (Răng cưa cuộn phim nhựa) */}
        <div className="flex items-center justify-between gap-3 px-4 mb-2 pointer-events-none opacity-40">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-3.5 h-2.5 rounded-sm bg-vn-ivory/30 border border-white/20 shrink-0" />
          ))}
        </div>

        {/* Film Cards Track */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-vn-gold/30">
          {HISTORICAL_VIDEOS_DATA.map((video) => {
            const isSelected = selectedVideo.id === video.id;
            return (
              <button
                key={video.id}
                onClick={() => handleSelectVideo(video)}
                className={`relative shrink-0 w-64 sm:w-72 p-2.5 rounded-xl border-2 text-left transition-all duration-300 group cursor-pointer ${
                  isSelected
                    ? 'bg-vn-red-deep/40 border-vn-gold shadow-[0_0_25px_rgba(255,205,0,0.5)] scale-105'
                    : 'bg-vn-charcoal/70 border-white/10 hover:border-vn-gold/60 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Thumbnail frame */}
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2 bg-black border border-white/10">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      isSepiaMode ? 'sepia grayscale contrast-125' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Play badge */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <div className="w-9 h-9 rounded-full bg-vn-red/90 border border-vn-gold flex items-center justify-center text-white shadow-lg shadow-black/80">
                      <Play className="w-4 h-4 fill-white translate-x-[1px]" />
                    </div>
                  </div>

                  <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-vn-gold border border-vn-gold/30">
                    {video.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-vn-ivory/60 mb-1">
                  <span className="text-vn-gold font-bold">{video.period}</span>
                  <span>{video.year}</span>
                </div>

                <h4 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-vn-gold transition-colors">
                  {video.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Bottom sprocket holes */}
        <div className="flex items-center justify-between gap-3 px-4 mt-2 pointer-events-none opacity-40">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-3.5 h-2.5 rounded-sm bg-vn-ivory/30 border border-white/20 shrink-0" />
          ))}
        </div>

      </div>

      {/* Main Cinema Projector Stage */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#11161d] via-vn-black to-[#090b0e] border-2 border-vn-gold/40 p-4 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Projector Controls Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-vn-ivory/15 text-xs font-mono">
          <div className="flex items-center gap-2 text-vn-gold">
            <span className="w-2.5 h-2.5 rounded-full bg-vn-red animate-ping" />
            <strong className="tracking-wider uppercase">ĐANG CHIẾU: {selectedVideo.title}</strong>
          </div>

          <div className="flex items-center gap-3">
            {/* Sepia vintage toggle button */}
            <button
              onClick={() => setIsSepiaMode(prev => !prev)}
              className={`px-3 py-1.5 rounded-full border text-[11px] font-sans font-medium transition-all ${
                isSepiaMode
                  ? 'bg-amber-900/60 border-amber-400 text-amber-200 shadow-md shadow-amber-900/40'
                  : 'bg-vn-charcoal border-vn-gold/30 text-vn-ivory/70 hover:border-vn-gold hover:text-white'
              }`}
            >
              🎞 {isSepiaMode ? 'Hiệu ứng: Phim Cổ Điển 1954' : 'Hiệu ứng: Chuẩn Màu Gốc'}
            </button>
          </div>
        </div>

        {/* Screen Frame with Vintage Film Borders */}
        <div className={`relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border-2 border-vn-gold/30 shadow-2xl flex items-center justify-center ${
          isSepiaMode ? 'sepia-[0.35] contrast-[1.15] brightness-95' : ''
        }`}>
          
          {/* Film Grain & Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          
          {/* 3-2-1 Countdown Animation Leader */}
          {countdown !== null ? (
            <div className="absolute inset-0 z-30 bg-[#080808] flex items-center justify-center">
              <div className="relative w-36 h-36 rounded-full border-4 border-vn-gold/50 flex items-center justify-center animate-spin" style={{ animationDuration: '1s' }}>
                <span className="font-display font-black text-6xl text-vn-gold">
                  {countdown}
                </span>
                <div className="absolute inset-0 border-t-4 border-vn-red rounded-full" />
              </div>
            </div>
          ) : isPlaying ? (
            /* Active Iframe Video Player */
            <iframe
              src={selectedVideo.fallbackEmbedUrl}
              title={selectedVideo.title}
              className="w-full h-full object-cover relative z-20"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            /* Idle Screen with Play Call-to-action */
            <div className="relative w-full h-full">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-vn-red to-vn-red-deep border-2 border-vn-gold flex items-center justify-center text-white shadow-[0_0_40px_rgba(218,37,29,0.8)] hover:scale-110 active:scale-95 transition-all cursor-pointer mb-4"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-[2px]" />
                </button>
                <p className="font-display font-bold text-lg sm:text-2xl text-white drop-shadow-md">
                  Nhấn để bắt đầu xem thước phim tư liệu
                </p>
                <span className="text-xs text-vn-gold font-mono mt-1">
                  Thời lượng: {selectedVideo.duration} · Tư liệu lịch sử nguyên bản
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Documentary Description & Historical Significance */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-vn-red/30 text-vn-gold border border-vn-gold/40">
                {selectedVideo.tag}
              </span>
              <span className="text-xs font-mono text-vn-ivory/60">
                Giai đoạn: {selectedVideo.period} ({selectedVideo.year})
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              {selectedVideo.subtitle}
            </h3>

            <p className="text-sm text-vn-ivory/85 leading-relaxed font-light">
              {selectedVideo.description}
            </p>

            {/* Historical quote banner */}
            <div className="p-4 rounded-xl bg-vn-black/60 border-l-4 border-vn-gold text-xs sm:text-sm text-vn-gold-antique font-heading italic">
              {selectedVideo.historicalQuote}
            </div>
          </div>

          <div className="md:col-span-4 p-5 rounded-2xl bg-vn-charcoal/80 border border-vn-gold/25 space-y-2.5">
            <span className="text-xs font-bold uppercase text-vn-gold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-vn-gold" />
              Ý Nghĩa Bài Học Lịch Sử:
            </span>
            <p className="text-xs text-vn-ivory/80 leading-relaxed font-sans">
              {selectedVideo.significance}
            </p>
            <div className="pt-3 border-t border-vn-ivory/10 text-[11px] text-vn-ivory/50 font-mono">
              Lưu trữ: Viện Phim Việt Nam & Ban Tuyên giáo TW
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
