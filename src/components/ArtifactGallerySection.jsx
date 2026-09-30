import React, { useState } from 'react';
import { 
  Archive, 
  Layers, 
  X, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Sparkles, 
  Award,
  BookOpen,
  FileCheck
} from 'lucide-react';
import { ARTIFACTS_DATA } from '../data/artifactsData';

export default function ArtifactGallerySection() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categories = ["Tất cả", "Hậu Cần Toàn Dân", "Vũ Khí & Chiến Đấu", "Văn Kiện & Chỉ Đạo", "Âm Vang Lịch Sử"];

  const filteredArtifacts = activeCategory === "Tất cả"
    ? ARTIFACTS_DATA
    : ARTIFACTS_DATA.filter(item => item.category === activeCategory);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const closeModal = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedArtifact(null);
  };

  return (
    <section id="bao-vat-khang-chien" className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vn-charcoal border border-vn-gold/30 text-vn-gold text-xs uppercase tracking-widest mb-4 shadow-lg">
          <Archive className="w-3.5 h-3.5 text-vn-gold" />
          <span>Kho Tư Liệu Hiện Vật Lịch Sử Số 2D</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 tracking-tight">
          Phòng Giám Định Hiện Vật & Bảo Vật Kháng Chiến
        </h2>
        <p className="text-sm sm:text-base text-vn-ivory/80 font-light leading-relaxed">
          Khám phá những hiện vật vô giá từng góp phần làm nên chiến thắng lịch sử Điện Biên Phủ, 
          gắn liền với văn kiện chỉ đạo của Đảng và ký ức của thế hệ cha anh.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-vn-red to-vn-red-deep text-vn-gold border border-vn-gold shadow-lg shadow-vn-red/40 font-semibold scale-105'
                : 'bg-vn-charcoal/80 text-vn-ivory/70 border border-vn-gold-antique/20 hover:border-vn-gold hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Artifacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtifacts.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedArtifact(item)}
            className="group p-5 rounded-2xl bg-vn-charcoal/80 border border-vn-gold-antique/25 hover:border-vn-gold hover:shadow-2xl hover:shadow-vn-red/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Image Preview Thumbnail */}
              {item.image && (
                <div className="relative aspect-[16/10] mb-4 overflow-hidden rounded-xl border border-vn-gold/25 bg-vn-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-vn-red/80 text-white border border-vn-gold/40">
                    {item.tag}
                  </span>
                </div>
              )}

              {/* Header tags */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold text-vn-gold px-2.5 py-0.5 rounded-full bg-vn-black/60 border border-vn-gold/30">
                  {item.category}
                </span>
                <span className="text-xs font-mono text-vn-ivory/50">
                  {item.year}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-xl text-white group-hover:text-vn-gold transition-colors mb-2">
                {item.title}
              </h3>

              {/* Specs snippet */}
              <p className="text-xs text-vn-gold-antique/90 font-mono mb-2 line-clamp-1">
                ⚙ {item.specs}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-vn-ivory/70 line-clamp-3 leading-relaxed mb-4 font-light">
                {item.description}
              </p>
            </div>

            {/* Footer Significance */}
            <div className="pt-3 border-t border-vn-ivory/10 flex items-center justify-between text-xs text-vn-gold group-hover:text-white">
              <span className="font-medium">Mở Hồ sơ Giám định & Nghe Thuyết minh</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Artifact Modal (Hồ sơ Hiện vật Lịch sử) */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-vn-charcoal border-2 border-vn-gold shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 z-10 p-2 rounded-full bg-vn-black/70 text-vn-ivory/70 hover:text-white hover:bg-vn-red transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image banner inside modal */}
            {selectedArtifact.image && (
              <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-2xl border border-vn-gold/40 bg-vn-black shadow-lg">
                <img
                  src={selectedArtifact.image}
                  alt={selectedArtifact.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-vn-red text-white border border-vn-gold">
                    {selectedArtifact.tag}
                  </span>
                  <span className="text-xs font-mono text-vn-gold bg-black/60 px-3 py-1 rounded-full border border-vn-gold/30">
                    Thời kỳ: {selectedArtifact.year}
                  </span>
                </div>
              </div>
            )}

            {/* Title & Speech Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-vn-gold">
                  HỒ SƠ HIỆN VẬT SỐ: #{selectedArtifact.id.toUpperCase()}
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                  {selectedArtifact.title}
                </h3>
              </div>

              {/* Audio Narrator Button */}
              <button
                onClick={() => handleSpeak(`${selectedArtifact.title}. ${selectedArtifact.description}. ${selectedArtifact.documentExcerpt}`)}
                className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 text-xs font-semibold shrink-0 ${
                  isSpeaking
                    ? 'bg-vn-red text-white border-vn-gold animate-pulse'
                    : 'bg-vn-black/60 text-vn-gold border-vn-gold/40 hover:bg-vn-gold hover:text-vn-black'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'Dừng giọng đọc' : 'Nghe thuyết minh audio'}</span>
              </button>
            </div>

            {/* Specs Bar */}
            <div className="p-3.5 rounded-xl bg-vn-black/60 border border-vn-gold/20 mb-6 text-xs font-mono space-y-1">
              <div>
                <span className="text-vn-gold font-bold">Quy cách kỹ thuật: </span>
                <span className="text-vn-ivory/80">{selectedArtifact.specs}</span>
              </div>
              <div>
                <span className="text-vn-red font-bold">Kỳ tích / Dấu ấn: </span>
                <span className="text-vn-ivory/80">{selectedArtifact.record}</span>
              </div>
            </div>

            {/* Modal Body Contents */}
            <div className="space-y-4 text-sm text-vn-ivory/85 leading-relaxed font-sans">
              <div className="p-4 rounded-xl bg-vn-black/50 border border-vn-ivory/10">
                <span className="text-xs font-bold uppercase text-vn-gold block mb-1">
                  Bối cảnh lịch sử của hiện vật:
                </span>
                <p>{selectedArtifact.description}</p>
              </div>

              {/* Document quote */}
              <div className="p-4 rounded-xl bg-vn-red-deep/20 border border-vn-gold/40">
                <span className="text-xs font-bold uppercase text-vn-gold block mb-1 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-vn-gold" />
                  Trích dẫn Văn kiện & Ký ức Lịch sử:
                </span>
                <p className="font-heading italic text-white font-medium">
                  {selectedArtifact.documentExcerpt}
                </p>
              </div>

              {/* Significance */}
              <div className="p-4 rounded-xl bg-vn-charcoal border border-emerald-500/30">
                <span className="text-xs font-bold uppercase text-emerald-400 block mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  Ý nghĩa lý luận trong Lịch sử Đảng:
                </span>
                <p className="font-sans text-vn-ivory/90">
                  {selectedArtifact.significance}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-vn-ivory/10 flex items-center justify-between">
              <span className="text-xs text-vn-ivory/50 font-mono">
                Bảo tàng Lịch sử Quân sự Việt Nam
              </span>
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-full bg-vn-gold text-vn-black font-semibold text-xs tracking-wider uppercase hover:bg-white transition-colors"
              >
                Đóng cửa sổ
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
