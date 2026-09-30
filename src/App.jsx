import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './lib/gsap';
import Navbar from './components/Navbar';
import TimelineIndicator from './components/TimelineIndicator';
import Hero from './components/Hero';
import WordCascade from './components/WordCascade';
import MilestoneChapter from './components/MilestoneChapter';
import QuoteSection from './components/QuoteSection';
import DecisionTreeSection from './components/DecisionTreeSection';
import CampaignMapSection from './components/CampaignMapSection';
import PeriscopeSection from './components/PeriscopeSection';
import HistoricalCinemaSection from './components/HistoricalCinemaSection';
import ArtifactGallerySection from './components/ArtifactGallerySection';
import KnowledgeQuiz from './components/KnowledgeQuiz';
import Footer from './components/Footer';
import WarAtmosphereCanvas from './components/WarAtmosphereCanvas';
import { VNR_MILESTONES_DATA } from './data/vnrMilestonesData';

export default function App() {
  const [autoScrollActive, setAutoScrollActive] = useState(false);
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

  // 2. Smooth Auto-scroll logic (documentary continuous playback)
  const toggleAutoScroll = () => {
    setAutoScrollActive(prev => !prev);
  };

  useEffect(() => {
    let animId;
    if (autoScrollActive) {
      const scrollStep = () => {
        window.scrollBy(0, 1.5);
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20) {
          setAutoScrollActive(false);
          return;
        }
        animId = requestAnimationFrame(scrollStep);
      };
      animId = requestAnimationFrame(scrollStep);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [autoScrollActive]);

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
      <Navbar 
        autoScrollActive={autoScrollActive} 
        onToggleAutoScroll={toggleAutoScroll} 
      />

      {/* Vertical Timeline Indicator */}
      <TimelineIndicator />

      {/* Main Cinematic Scrollytelling Sequence */}
      <main>
        {/* 00. Hero Entrance (Pinned stage with Dong Son drum & star dive) */}
        <Hero />

        {/* 01. Mốc 1: 1930 - Thành lập Đảng & Cương lĩnh đầu tiên */}
        {m1930 && <MilestoneChapter milestone={m1930} reverse={false} />}

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

        {/* 08. Mốc 5: 1954 - Quyết định lịch sử "Đánh chắc, tiến chắc" */}
        {m1954QuyetDinh && <MilestoneChapter milestone={m1954QuyetDinh} reverse={false} />}

        {/* 09. TƯƠNG TÁC RA QUYẾT ĐỊNH (DECISION TREE): Sáng 26/01/1954 tại Mường Phăng */}
        <DecisionTreeSection />

        {/* 10. SA BÀN CHIẾN DỊCH TƯƠNG TÁC: 3 Đợt tiến công Mường Thanh */}
        <CampaignMapSection />

        {/* 11. TƯƠNG TÁC NHẬP VAI: Kính Tiềm Vọng Chiến Hào 1954 (Periscope Recon View) */}
        <PeriscopeSection />

        {/* 12. Mốc 6: 1954 - Toàn thắng 07/05/1954 trên nóc hầm De Castries */}
        {m1954ThangLoi && <MilestoneChapter milestone={m1954ThangLoi} reverse={true} />}

        {/* 13. Mốc 7: 1975 - Tuyến lửa Trường Sơn & Đại thắng Mùa Xuân 1975 */}
        {m1975 && <MilestoneChapter milestone={m1975} reverse={false} />}

        {/* 14. Mốc 8: 1986 - Đại hội VI: Đổi mới tư duy, kiến tạo kỷ nguyên phát triển */}
        {m1986 && <MilestoneChapter milestone={m1986} reverse={true} />}

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
