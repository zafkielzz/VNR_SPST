import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Compass } from 'lucide-react';
import { soundSynth } from '../utils/soundSynth';

export default function Navbar({ autoScrollActive, onToggleAutoScroll }) {
  const [scrolled, setScrolled] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Sync with global background music state
    const handleMusicState = (e) => {
      if (typeof e.detail?.isPlaying === 'boolean') {
        setIsAudioPlaying(e.detail.isPlaying);
      }
      if (typeof e.detail?.volume === 'number') {
        setVolume(e.detail.volume / 100);
      }
    };
    window.addEventListener('bg-music-state', handleMusicState);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('bg-music-state', handleMusicState);
    };
  }, []);

  const handleToggleAudio = () => {
    window.dispatchEvent(new CustomEvent('toggle-bg-music'));
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    window.dispatchEvent(new CustomEvent('set-bg-volume', { detail: { volume: Math.round(val * 100) } }));
  };

  const navItems = [
    { label: "1930 — 1946", href: "#m-1930" },
    { label: "Điện Biên Phủ 1954", href: "#cascade-dien-bien" },
    { label: "1975 — 1986", href: "#m-1975" },
    { label: "Phim Tư Liệu 35mm", href: "#rap-chieu-phim-tu-lieu" },
    { label: "Bảo Vật", href: "#bao-vat-khang-chien" },
    { label: "Khảo Thí VNR", href: "#trac-nghiem-on-tap" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-vn-black/85 backdrop-blur-md border-b border-vn-gold-antique/20 py-2.5 shadow-2xl' 
        : 'bg-gradient-to-b from-vn-black/90 to-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo & Subject Info */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-vn-red-deep border border-vn-gold flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-vn-gold">
              <polygon points="16,2 19,11 28,11 21,17 24,26 16,21 8,26 11,17 4,11 13,11"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base sm:text-lg tracking-wide text-vn-gold">
                VNR · LỊCH SỬ ĐẢNG
              </span>
            </div>
            <p className="text-[11px] text-vn-ivory/70 hidden sm:block">
              Bản hùng ca Điện Biên Phủ 1954
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-medium">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-2.5 py-1.5 rounded-md text-vn-ivory/80 hover:text-vn-gold hover:bg-white/5 transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Controls: Audio + Auto-Scroll */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Audio Synthesizer Controller */}
          <div className="flex items-center gap-1.5 bg-vn-charcoal/80 border border-vn-gold-antique/30 px-2.5 py-1 rounded-full shadow-inner">
            <button
              onClick={handleToggleAudio}
              title={isAudioPlaying ? "Tắt âm hưởng cồng chiêng" : "Bật âm hưởng cồng chiêng ngũ cung"}
              className={`p-1 rounded-full transition-colors ${
                isAudioPlaying ? 'text-vn-gold hover:text-white' : 'text-vn-ivory/50 hover:text-vn-gold'
              }`}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {isAudioPlaying && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-16 h-1 accent-vn-gold bg-vn-ivory/20 rounded cursor-pointer"
                title={`Âm lượng: ${Math.round(volume * 100)}%`}
              />
            )}
          </div>

          {/* Auto Scroll Button */}
          <button
            onClick={onToggleAutoScroll}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              autoScrollActive
                ? 'bg-vn-red text-white border-vn-gold shadow-lg shadow-vn-red/40 animate-pulse'
                : 'bg-vn-charcoal/80 text-vn-ivory/80 border-vn-gold-antique/30 hover:border-vn-gold hover:text-vn-gold'
            }`}
            title={autoScrollActive ? "Dừng cuộn tự động" : "Bắt đầu tự cuộn điện ảnh"}
          >
            {autoScrollActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoScrollActive ? "Dừng" : "Tự cuộn"}</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 text-vn-ivory hover:text-vn-gold"
          >
            <Compass className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-vn-charcoal/95 border-b border-vn-gold/30 px-4 py-3 mt-2 space-y-2 backdrop-blur-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded bg-black/40 text-vn-ivory/80 hover:text-vn-gold hover:bg-vn-red-deep/30"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
