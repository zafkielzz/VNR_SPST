import React, { useState } from 'react';
import { 
  GitBranch, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  ShieldAlert, 
  Compass, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  FileText
} from 'lucide-react';
import { DECISION_TREE_DATA } from '../data/decisionTreeData';

export default function DecisionTreeSection() {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const selectedOpt = DECISION_TREE_DATA.options.find(o => o.id === selectedOptionId);

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

  const handleReset = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedOptionId(null);
  };

  return (
    <section id="decision-tree" className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Background Military Grid Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#DA251D_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vn-charcoal border border-vn-gold/40 text-vn-gold text-xs uppercase tracking-widest mb-4 shadow-lg">
          <GitBranch className="w-3.5 h-3.5 text-vn-red" />
          <span>Tái Hiện Góc Nhìn Lịch Sử · Choose Your Adventure</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 tracking-tight">
          {DECISION_TREE_DATA.title}
        </h2>
        <p className="text-sm sm:text-base text-vn-ivory/80 font-light leading-relaxed">
          {DECISION_TREE_DATA.subtitle}
        </p>
      </div>

      {/* Military Briefing Room Panel */}
      <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-vn-charcoal/90 via-vn-black to-vn-charcoal/90 border border-vn-gold/30 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Radar / HUD watermark */}
        <div className="absolute -top-12 -right-12 w-64 h-64 border border-vn-gold/10 rounded-full pointer-events-none animate-pulse" />

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-vn-ivory/10 text-xs font-mono">
          <div className="flex items-center gap-2 text-vn-gold">
            <Compass className="w-4 h-4 text-vn-red" />
            <span>Địa điểm: {DECISION_TREE_DATA.location}</span>
          </div>
          <div className="text-vn-ivory/60">
            Thời khắc: <strong className="text-vn-gold">{DECISION_TREE_DATA.timestamp}</strong>
          </div>
        </div>

        {/* Uncle Ho's mandate highlight */}
        <div className="p-4 sm:p-5 rounded-2xl bg-vn-red-deep/30 border border-vn-gold/50 mb-8 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-vn-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-vn-gold" />
              Lời dặn dò thiêng liêng của Chủ tịch Hồ Chí Minh:
            </span>
            <button
              onClick={() => handleSpeak(DECISION_TREE_DATA.briefing.mandateFromUncleHo)}
              className="p-1.5 rounded-lg bg-vn-black/40 hover:bg-vn-gold/20 text-vn-gold transition-colors text-xs flex items-center gap-1"
              title="Nghe lời dặn dò"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Dừng đọc' : 'Nghe đọc'}</span>
            </button>
          </div>
          <p className="font-heading italic text-base sm:text-lg text-white font-medium leading-relaxed">
            "{DECISION_TREE_DATA.briefing.mandateFromUncleHo}"
          </p>
        </div>

        {/* 3 Intelligence Reports Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-vn-gold-antique mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-vn-gold" />
            3 Báo Cáo Tình Báo Mặt Trận Trước Giờ Quyết Định:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DECISION_TREE_DATA.briefing.intelligenceReports.map((report, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-vn-black/60 border border-vn-gold/20 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono font-bold text-vn-red uppercase block mb-1.5">
                    [Tư liệu {idx + 1}] {report.source}
                  </span>
                  <p className="text-xs text-vn-ivory/80 leading-relaxed font-sans">
                    {report.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Decision Choice Stage: 2 Large Cards */}
      <div className="mb-10">
        <h3 className="text-center font-display font-bold text-xl sm:text-2xl text-vn-gold mb-6 tracking-wide">
          BẠN LÀ CHỈ HUY TRƯỞNG: BẠN SẼ ĐƯA RA QUYẾT ĐỊNH NÀO?
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {DECISION_TREE_DATA.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`relative p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-vn-charcoal border-vn-gold shadow-[0_0_35px_rgba(255,205,0,0.25)] ring-1 ring-vn-gold/50'
                    : 'bg-vn-charcoal/70 border-vn-gold/25 hover:border-vn-gold/70 hover:bg-vn-charcoal/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-vn-black/60 border border-vn-gold/40 text-vn-gold">
                      {idx === 0 ? 'DỰ THẢO CHIẾN ĐẤU A' : 'DỰ THẢO CHIẾN ĐẤU B'}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-mono font-bold text-vn-gold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-vn-gold animate-ping" />
                        ĐÃ RA MỆNH LỆNH
                      </span>
                    )}
                  </div>

                  <h4 className="font-display font-bold text-xl sm:text-2xl text-white mb-3">
                    {opt.title}
                  </h4>

                  <p className="text-sm text-vn-ivory/85 leading-relaxed mb-6 font-light">
                    {opt.summary}
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-vn-black/50 border border-vn-gold/15">
                      <strong className="text-vn-gold block mb-1">Mặt thuận lợi dự kiến:</strong>
                      <span className="text-vn-ivory/80">{opt.pros}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-vn-black/50 border border-white/10">
                      <strong className="text-vn-ivory/90 block mb-1">Mặt nguy cơ cân nhắc:</strong>
                      <span className="text-vn-ivory/70">{opt.cons}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-vn-ivory/10 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-vn-gold font-bold' : 'text-vn-ivory/60 hover:text-white'}>
                    {isSelected ? '✓ Mệnh lệnh đã chọn — Xem đối chiếu lịch sử bên dưới ↓' : 'Bấm để lựa chọn phương án này →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consequence Simulator Box (Displays when an option is selected) */}
      {selectedOpt && (
        <div className={`p-6 sm:p-10 rounded-3xl border-2 transition-all duration-500 animate-in fade-in zoom-in-95 ${
          selectedOpt.isHistoricalCorrect
            ? 'bg-gradient-to-b from-emerald-950/60 via-vn-black to-emerald-950/60 border-emerald-500 shadow-2xl shadow-emerald-500/20'
            : 'bg-gradient-to-b from-red-950/60 via-vn-black to-red-950/60 border-red-500 shadow-2xl shadow-red-500/20'
        }`}>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              {selectedOpt.isHistoricalCorrect ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-vn-gold">
                  {selectedOpt.isHistoricalCorrect ? 'Quyết định lịch sử chính xác' : 'Kịch bản giả định (What-If)'}
                </span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-white">
                  {selectedOpt.consequence.headline}
                </h4>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-vn-charcoal border border-vn-gold/40 text-vn-gold hover:bg-vn-gold hover:text-vn-black transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Thử chọn lại</span>
            </button>
          </div>

          {/* Assessment body */}
          <div className="space-y-4 text-sm text-vn-ivory/90 leading-relaxed mb-6 font-sans">
            <div className="p-4 rounded-2xl bg-vn-black/70 border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-vn-gold block mb-1.5">
                Đánh giá diễn biến & Hệ quả chiến trường:
              </span>
              <p>{selectedOpt.consequence.assessment}</p>
            </div>

            <div className="p-4 rounded-2xl bg-vn-red-deep/20 border border-vn-gold/40">
              <span className="text-xs font-bold uppercase tracking-wider text-vn-gold block mb-1.5">
                Bài học lý luận & Nghệ thuật Quân sự của Đảng:
              </span>
              <p className="font-medium text-white">{selectedOpt.consequence.historicalLesson}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <p className="text-xs text-vn-ivory/60 italic">
              Nguồn học liệu: Giáo trình Lịch sử Đảng Cộng sản Việt Nam (Ban Tuyên giáo TW, tr. 82 - 84)
            </p>
            <a
              href="#sa-ban-chien-dich"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-vn-gold-antique to-vn-gold text-vn-black font-display font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform flex items-center gap-2"
            >
              <span>Xem Sa bàn Chiến dịch 3 đợt</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      )}

    </section>
  );
}
