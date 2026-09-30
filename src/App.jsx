import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './lib/gsap';
import Navbar from './components/Navbar';
import TimelineIndicator from './components/TimelineIndicator';
import InkHero from './components/InkHero';
import DocumentDesk1930 from './components/DocumentDesk1930';
import WordCascade from './components/WordCascade';
import MilestoneChapter from './components/MilestoneChapter';
import QuoteSection from './components/QuoteSection';
import DienBienExperience from './components/DienBienExperience';
import HistoricalCinemaSection from './components/HistoricalCinemaSection';
import ArtifactGallerySection from './components/ArtifactGallerySection';
import KnowledgeQuiz from './components/KnowledgeQuiz';
import Footer from './components/Footer';
import WarAtmosphereCanvas from './components/WarAtmosphereCanvas';
import { VNR_MILESTONES_DATA } from './data/vnrMilestonesData';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return undefined;

    const timer = window.setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  // 1. Lenis Smooth Scroll synchronised with GSAP ScrollTrigger ticker
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger calculations when images and fonts settle
    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    const settleTimer = setTimeout(refresh, 500);

    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        refresh();
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', onResize);
      clearTimeout(settleTimer);
    };
  }, []);

  // Find milestones by ID
  const m1930 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1930');
  const m1941 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1941');
  const m1945 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1945');
  const m1946 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1946');
  const m1954QuyetDinh = VNR_MILESTONES_DATA.find(m => m.id === 'm-1954-quyet-dinh');
  const m1954ThangLoi = VNR_MILESTONES_DATA.find(m => m.id === 'm-1954-thang-loi');
  const m1975 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1975');
  const m1986 = VNR_MILESTONES_DATA.find(m => m.id === 'm-1986');

  return (
    <div className="relative min-h-screen bg-vn-black text-vn-ivory selection:bg-vn-red selection:text-vn-gold">
      
      {/* Cinematic Overlays: Film Grain, Vignette & War Embers Glow */}
      <div className="film-grain" />
      <div className="film-vignette" />
      <WarAtmosphereCanvas />

      {/* Top Navbar */}
      <Navbar />

      {/* Vertical Timeline Indicator */}
      <TimelineIndicator />

      {/* Main Cinematic Scrollytelling Sequence */}
      <main>
        {/* 00. Khởi Nguyên Nét Mực: InkHero (Mặt giấy ngà & nét bút lông đỏ Ký Họa Sử Đảng) */}
        <InkHero />

        {/* 01. Mốc 1930: Bàn tài liệu lịch sử Cửu Long (Document Desk & Dấu ấn Cương lĩnh) */}
        <DocumentDesk1930 />

        {/* 02. Chuyển đoạn 1: Mục tiêu cốt lõi của Đảng */}
        <WordCascade
          id="cascade-cuong-linh"
          eyebrow="Ngọn Cờ Tư Tưởng Cương Lĩnh Đầu Tiên (1930)"
          items={[
            {
              word: 'ĐỘC LẬP',
              tag: 'MỤC TIÊU THIÊNG LIÊNG',
              quote: 'Đánh đổ đế quốc chủ nghĩa và bọn phong kiến',
              desc: 'Làm cho nước Nam hoàn toàn độc lập, giành lại chủ quyền toàn vẹn lãnh thổ thiêng liêng của Tổ quốc.'
            },
            {
              word: 'TỰ DO',
              tag: 'QUYỀN CƠ BẢN CỦA DÂN',
              quote: 'Dân chúng được tự do tổ chức, nam nữ bình quyền',
              desc: 'Thực hiện quyền tự do dân chủ, giải phóng giai cấp công nông khỏi ách xiềng xích nô lệ và áp bức bất công.'
            },
            {
              word: 'HẠNH PHÚC',
              tag: 'LỢI ÍCH NHÂN DÂN',
              quote: 'Thâu hết ruộng đất chia cho dân cày nghèo',
              desc: 'Xóa bỏ bóc lột, mở mang công thương nghiệp, nâng cao đời sống ấm no, hạnh phúc cho toàn thể nhân dân.'
            },
            {
              word: 'CHỦ NGHĨA XÃ HỘI',
              tag: 'CON ĐƯỜNG PHÁT TRIỂN',
              quote: 'Đi tới xã hội cộng sản văn minh',
              desc: 'Gắn liền độc lập dân tộc với chủ nghĩa xã hội là sợi chỉ đỏ xuyên suốt đường lối cách mạng Việt Nam.'
            }
          ]}
        />

        {/* 03. Mốc 2: 1941 - Pác Bó: Hội nghị TW 8 & Thành lập Mặt trận Việt Minh */}
        {m1941 && <MilestoneChapter milestone={m1941} reverse={true} />}

        {/* 04. Mốc 3: 1945 - Cách mạng Tháng Tám & Tuyên ngôn Độc lập */}
        {m1945 && <MilestoneChapter milestone={m1945} reverse={false} />}

        {/* 05. Mốc 4: 1946 - Lời kêu gọi Toàn quốc Kháng chiến & Chiến khu Việt Bắc */}
        {m1946 && <MilestoneChapter milestone={m1946} reverse={true} />}

        {/* 06. Trích dẫn kinh điển: Lời hiệu triệu của Chủ tịch Hồ Chí Minh & Đại tướng */}
        <QuoteSection />

        {/* 07. Chuyển đoạn 2: Khúc tráng ca Điện Biên Phủ */}
        <WordCascade
          id="cascade-dien-bien"
          eyebrow="Bản Hùng Ca Điện Biên Phủ (1954)"
          items={[
            {
              word: 'KHOÉT NÚI',
              tag: 'Ý CHÍ GANG THÉP',
              quote: 'Xẻ núi, bạt đèo mở đường kéo pháo',
              desc: 'Hàng vạn chiến sĩ và dân công đào hàng trăm kilômét đường xuyên qua rừng thẳm Tây Bắc hiểm trở.'
            },
            {
              word: 'NGỦ HẦM',
              tag: 'TRẬN ĐỊA VÂY LẤN',
              quote: 'Đào chiến hào siết chặt lòng chảo Mường Thanh',
              desc: 'Biến lòng đất thành pháo đài tấn công, vây hãm từng tấc đất, bóp nghẹt mọi nguồn tiếp tế của đối phương.'
            },
            {
              word: 'MƯA DẦM',
              tag: 'THỬ THÁCH NGHIỆT NGÃ',
              quote: '56 ngày đêm máu trộn bùn non',
              desc: 'Kiên cường bám trụ trận địa dưới mưa bom bão đạn và thời tiết khắc nghiệt để giành từng điểm cao chiến lược.'
            },
            {
              word: 'LỪNG LẪY',
              tag: 'THIÊN SỬ VÀNG DÂN TỘC',
              quote: 'Nên vành hoa đỏ, nên thiên sử vàng',
              desc: 'Chiến thắng vang dội năm châu, chấn động địa cầu, báo hiệu sự sụp đổ không thể tránh khỏi của chủ nghĩa thực dân cũ.'
            }
          ]}
        />

        {/* 08. ĐẠI CẢNH LIÊN HOÀN ĐIỆN BIÊN PHỦ 1954 (Unified Boss Fight Sequence) */}
        <DienBienExperience />

        {/* 13. Mốc 7: 1975 - Tuyến lửa Trường Sơn & Đại thắng Mùa Xuân 1975 */}
        {m1975 && <MilestoneChapter milestone={m1975} reverse={false} />}

        {/* 14. Mốc 8: 1986 - Đại hội VI: Đổi mới tư duy, kiến tạo kỷ nguyên phát triển */}
        {m1986 && <MilestoneChapter milestone={m1986} reverse={true} />}

        {/* ================================================================
            KẾT THÚC HÀNH TRÌNH CHÍNH (CINEMATIC FINALE & LIGHT TRANSITION)
            Khoảnh khắc lắng đọng cảm xúc: Quá khứ khép lại, tương lai mở ra
           ================================================================ */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-[#0a0d12] via-[#0f1724] to-vn-black overflow-hidden border-t border-vn-gold/20">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-radial-gradient from-vn-gold/20 via-vn-red/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-vn-charcoal border border-vn-gold/50 text-vn-gold text-xs font-mono font-bold uppercase tracking-widest shadow-xl">
              ★ KHÁT VỌNG VIỆT NAM HÙNG CƯỜNG
            </span>

            <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
              Độc Lập · Tự Do · Hòa Bình · Phát Triển
            </h2>

            {/* The Infinite Timeline Loop: Nét mực đỏ nối trọn vẹn lịch sử */}
            <div className="py-3 max-w-xl mx-auto flex items-center justify-between text-[11px] font-mono text-vn-gold/80 gap-1.5 sm:gap-3">
              <span className="shrink-0 font-bold">1930</span>
              <span className="flex-1 h-[2px] bg-gradient-to-r from-amber-700 to-vn-red" />
              <span className="shrink-0 font-bold">1945</span>
              <span className="flex-1 h-[2px] bg-gradient-to-r from-vn-red to-amber-500" />
              <span className="shrink-0 font-bold text-vn-red">1954</span>
              <span className="flex-1 h-[2px] bg-gradient-to-r from-vn-red to-amber-500" />
              <span className="shrink-0 font-bold">1975</span>
              <span className="flex-1 h-[2px] bg-gradient-to-r from-amber-500 to-blue-400" />
              <span className="shrink-0 font-bold text-blue-300">1986</span>
              <span className="flex-1 h-[2px] bg-blue-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-vn-red shadow-[0_0_15px_#DA251D] animate-pulse shrink-0" title="Hiện tại & Tương lai" />
            </div>

            <p className="font-heading italic text-base sm:text-xl text-vn-ivory/80 leading-relaxed font-normal max-w-2xl mx-auto">
              "Từ bùn đen nô lệ rũ bùn đứng dậy sáng lòa. Dưới ngọn cờ quang vinh của Đảng, toàn thể nhân dân ta đã làm nên những mốc son chấn động địa cầu, kiến tạo kỷ nguyên độc lập, tự chủ và thịnh vượng."
            </p>

            {/* Red Ink Underline flourishing underneath quote */}
            <div className="w-48 sm:w-72 h-[3px] mx-auto rounded-full bg-gradient-to-r from-transparent via-vn-red to-transparent shadow-[0_0_12px_rgba(218,37,29,0.8)]" />

            <div className="pt-6">
              <a
                href="#khong-gian-khao-cuu"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-vn-gold to-amber-500 text-vn-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider shadow-2xl hover:scale-105 transition-transform"
              >
                <span>Bước Vào Không Gian Khảo Cứu & Bảo Tàng Số ↓</span>
              </a>
              <p className="mt-3 text-xs font-mono text-vn-ivory/50">
                (Phim tư liệu 35mm · Giám định hiện vật kháng chiến · Khảo thí trắc nghiệm)
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================
            KHÔNG GIAN KHẢO CỨU & TRẢI NGHIỆM MỞ RỘNG (EXPLORATION & ARCHIVE HUB)
            Tách biệt khỏi mạch kể chính để giữ trọn vẹn cảm xúc điện ảnh
           ================================================================ */}
        <section id="khong-gian-khao-cuu" className="relative pt-20 border-t border-vn-gold/20 bg-gradient-to-b from-vn-black via-[#0d0f14] to-vn-black">
          <div className="max-w-4xl mx-auto text-center px-4 mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-vn-charcoal border border-vn-gold/40 text-vn-gold text-xs font-mono font-bold uppercase tracking-widest mb-3">
              KHÔNG GIAN BẢO TÀNG SỐ & KHẢO THÍ HỌC LIỆU
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
              Khám Phá Chuyên Sâu Tư Liệu & Hiện Vật
            </h2>
            <p className="mt-3 text-sm sm:text-base text-vn-ivory/70 max-w-2xl mx-auto font-light">
              Nơi lưu trữ các thước phim 35mm quý hiếm, giám định hiện vật lịch sử và khảo sát kiến thức môn học Lịch sử Đảng Cộng sản Việt Nam.
            </p>
          </div>

          {/* 15. RẠP CHIẾU PHIM TƯ LIỆU 35MM: Video clip tư liệu lịch sử có âm thanh */}
          <HistoricalCinemaSection />

          {/* 16. PHÒNG GIÁM ĐỊNH HIỆN VẬT & BẢO VẬT KHÁNG CHIẾN (Interactive Artifacts) */}
          <ArtifactGallerySection />

          {/* 17. PHÒNG KHẢO THÍ TRẮC NGHIỆM VNR & CẤP GIẤY CHỨNG NHẬN CANVAS */}
          <KnowledgeQuiz />
        </section>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
