import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { VNR_QUOTES_DATA } from '../data/vnrQuotesData';

export default function QuoteSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev === 0 ? VNR_QUOTES_DATA.length - 1 : prev - 1));
  };

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev === VNR_QUOTES_DATA.length - 1 ? 0 : prev + 1));
  };

  const current = VNR_QUOTES_DATA[currentIndex];

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-vn-black overflow-hidden">
      {/* Decorative top and bottom gold lines */}
      <div className="gold-line max-w-5xl mx-auto mb-16 opacity-40" />

      <div className="max-w-4xl mx-auto text-center relative">
        
        {/* Large watermark quote icon */}
        <Quote className="w-20 h-20 text-vn-gold/10 absolute -top-10 left-1/2 -translate-x-1/2 -z-10 pointer-events-none" />

        {/* Section title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vn-charcoal border border-vn-gold/30 text-vn-gold text-xs uppercase tracking-widest mb-6">
          <CheckCircle2 className="w-3.5 h-3.5 text-vn-gold" />
          <span>Văn Kiện Lịch Sử & Lời Hiệu Triệu Kinh Điển</span>
        </div>

        {/* Quote Card (Stable min-height prevents layout shifting on Next/Prev) */}
        <div className="min-h-[440px] sm:min-h-[480px] p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-vn-charcoal/90 to-vn-black border border-vn-gold-antique/30 shadow-2xl relative flex flex-col justify-between">
          
          <div key={currentIndex} className="flex-1 flex flex-col justify-center animate-in fade-in duration-300">
            {/* Quote Body (Dedicated stable min-height slot) */}
            <div className="min-h-[170px] sm:min-h-[190px] flex items-center justify-center px-2">
              <blockquote className="font-heading italic text-xl sm:text-2xl md:text-3xl text-vn-ivory leading-relaxed text-center">
                "{current.quote}"
              </blockquote>
            </div>

            {/* Author & Source (Dedicated stable min-height slot) */}
            <div className="min-h-[95px] flex flex-col items-center justify-start mt-4">
              <cite className="font-display font-bold text-lg sm:text-xl text-vn-gold not-italic">
                {current.author}
              </cite>
              <p className="text-xs sm:text-sm text-vn-ivory/80 mt-1 font-medium">
                {current.title} · {current.context}
              </p>
              <p className="text-[11px] text-vn-ivory/50 mt-1 font-mono">
                Nguồn trích: {current.source}
              </p>
            </div>
          </div>

          {/* Navigation Arrows (Anchored to card bottom) */}
          <div className="mt-auto pt-6 border-t border-vn-gold-antique/15 flex items-center justify-center gap-4">
            <button
              onClick={prevQuote}
              className="p-2 rounded-full bg-vn-black/60 border border-vn-gold-antique/30 text-vn-gold hover:bg-vn-red hover:text-white transition-all cursor-pointer"
              title="Trích dẫn trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {VNR_QUOTES_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex 
                      ? 'w-7 bg-vn-gold shadow-md shadow-vn-gold/50' 
                      : 'bg-vn-ivory/20 hover:bg-vn-gold/50'
                  }`}
                  title={`Trích dẫn ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextQuote}
              className="p-2 rounded-full bg-vn-black/60 border border-vn-gold-antique/30 text-vn-gold hover:bg-vn-red hover:text-white transition-all cursor-pointer"
              title="Trích dẫn tiếp"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      <div className="gold-line max-w-5xl mx-auto mt-16 opacity-40" />
    </section>
  );
}
