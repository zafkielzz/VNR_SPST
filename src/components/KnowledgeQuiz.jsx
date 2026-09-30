import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight, 
  Sparkles,
  Download,
  User,
  GraduationCap
} from 'lucide-react';
import { VNR_QUIZ_QUESTIONS } from '../data/vnrQuizData';

export default function KnowledgeQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Certificate State
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const canvasRef = useRef(null);

  const currentQ = VNR_QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < VNR_QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setCertificateGenerated(false);
  };

  // Render Certificate on HTML5 Canvas
  const handleGenerateCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    // Background Vintage Parchment
    ctx.fillStyle = '#0F1216';
    ctx.fillRect(0, 0, width, height);

    // Decorative Red & Gold Gradient border
    const borderGrad = ctx.createLinearGradient(0, 0, width, height);
    borderGrad.addColorStop(0, '#DA251D');
    borderGrad.addColorStop(0.5, '#FFCD00');
    borderGrad.addColorStop(1, '#8F1713');

    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#DA251D';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // Inner background gradient
    const innerGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 500);
    innerGrad.addColorStop(0, '#1c1514');
    innerGrad.addColorStop(1, '#0e0f12');
    ctx.fillStyle = innerGrad;
    ctx.fillRect(50, 50, width - 100, height - 100);

    // Header Top Text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFCD00';
    ctx.font = 'bold 22px "Times New Roman", serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('HỌC PHẦN LỊCH SỬ ĐẢNG CỘNG SẢN VIỆT NAM (VNR)', width / 2, 110);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'italic 16px "Times New Roman", serif';
    ctx.fillText('Chương trình đào tạo lý luận chính trị chuẩn Bộ Giáo dục & Đào tạo', width / 2, 140);

    // Star Divider
    ctx.fillStyle = '#DA251D';
    ctx.font = '28px serif';
    ctx.fillText('★  ★  ★', width / 2, 180);

    // Certificate Main Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px "Times New Roman", serif';
    ctx.fillText('GIẤY CHỨNG NHẬN CHIẾN SĨ LỊCH SỬ ĐẢNG', width / 2, 245);

    ctx.fillStyle = '#FFCD00';
    ctx.font = 'bold 22px "Times New Roman", serif';
    ctx.fillText('CHUYÊN ĐỀ: BẢN HÙNG CA ĐIỆN BIÊN PHỦ 1954', width / 2, 285);

    // Trao tặng cho
    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'italic 20px "Times New Roman", serif';
    ctx.fillText('Chứng nhận đồng chí:', width / 2, 345);

    // Student Name
    const nameDisplay = studentName.trim() || 'HỌ VÀ TÊN SINH VIÊN';
    ctx.fillStyle = '#FFCD00';
    ctx.font = 'bold 38px "Times New Roman", serif';
    ctx.fillText(nameDisplay.toUpperCase(), width / 2, 400);

    // Underline
    ctx.strokeStyle = '#DA251D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 250, 415);
    ctx.lineTo(width / 2 + 250, 415);
    ctx.stroke();

    // Student ID if provided
    if (studentId.trim()) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'mono 18px monospace';
      ctx.fillText(`Mã số sinh viên: ${studentId.trim()}`, width / 2, 445);
    }

    // Achievement text
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '20px "Times New Roman", serif';
    ctx.fillText(`Đã xuất sắc hoàn thành bài khảo thí Lịch sử Đảng với kết quả: ${score} / ${VNR_QUIZ_QUESTIONS.length} điểm`, width / 2, 495);

    const rankText = score >= 9 ? 'XẾP LOẠI: XUẤT SẮC' : score >= 7 ? 'XẾP LOẠI: KHÁ GIỎI' : 'XẾP LOẠI: ĐẠT TIÊU CHUẨN';
    ctx.fillStyle = '#DA251D';
    ctx.font = 'bold 22px "Times New Roman", serif';
    ctx.fillText(rankText, width / 2, 535);

    // Date & Seal
    const today = new Date();
    const dateString = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'italic 18px "Times New Roman", serif';
    ctx.fillText(dateString, width / 2 + 300, 620);

    ctx.fillStyle = '#FFCD00';
    ctx.font = 'bold 18px "Times New Roman", serif';
    ctx.fillText('BAN TỔ CHỨC TRIỂN LÃM SỐ VNR', width / 2 + 300, 650);

    // Decorative Seal Circle on Left
    ctx.strokeStyle = '#DA251D';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(width / 2 - 300, 650, 50, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#DA251D';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('VNR 1954 - 2024', width / 2 - 300, 645);
    ctx.fillText('★ CHỨNG NHẬN ★', width / 2 - 300, 665);

    setCertificateGenerated(true);
  };

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Chung-nhan-Lich-su-Dang-${studentName.trim() || 'Sinh-vien'}.png`;
    link.href = imageURI;
    link.click();
  };

  return (
    <section id="trac-nghiem-on-tap" className="relative py-24 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-vn-black via-vn-charcoal/50 to-vn-black border-t border-vn-gold-antique/20 scroll-mt-20">
      
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vn-charcoal border border-vn-gold/30 text-vn-gold text-xs uppercase tracking-widest mb-4">
            <Award className="w-3.5 h-3.5 text-vn-gold" />
            <span>Phòng Khảo Thí & Cấp Chứng Nhận Lịch Sử Đảng</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 tracking-tight">
            Khảo Thí Trắc Nghiệm Trọng Tâm Môn VNR
          </h2>
          <p className="text-sm sm:text-base text-vn-ivory/75 font-light leading-relaxed">
            10 câu hỏi chuẩn đề thi học phần Lịch sử Đảng Cộng sản Việt Nam. 
            Cung cấp lời giải thích học thuật chuẩn giáo trình và cấp Giấy Chứng Nhận Tuyên Dương tải về!
          </p>
        </div>

        {/* Quiz Container */}
        {!quizCompleted ? (
          <div className="p-6 sm:p-10 rounded-3xl bg-vn-charcoal/90 border border-vn-gold-antique/30 shadow-2xl backdrop-blur-md relative">
            
            {/* Progress Header */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-vn-ivory/10 text-xs text-vn-ivory/70">
              <span className="font-semibold text-vn-gold uppercase tracking-wider">
                Câu hỏi {currentIdx + 1} / {VNR_QUIZ_QUESTIONS.length}
              </span>
              <span>
                Điểm số hiện tại: <strong className="text-vn-gold text-sm">{score}</strong> / {VNR_QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-8 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt, optIdx) => {
                let btnStyle = "bg-vn-black/70 border-vn-ivory/15 text-vn-ivory hover:border-vn-gold/50";
                
                if (isAnswered) {
                  if (optIdx === currentQ.correctAnswer) {
                    btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/20";
                  } else if (optIdx === selectedOption) {
                    btnStyle = "bg-red-950/70 border-red-500 text-red-200";
                  } else {
                    btnStyle = "bg-vn-black/40 border-vn-ivory/5 text-vn-ivory/40 opacity-50";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && optIdx === currentQ.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Academic Explanation */}
            {isAnswered && (
              <div className="p-4 sm:p-5 rounded-xl bg-vn-black/80 border border-vn-gold/30 mb-8 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-semibold text-vn-gold uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-4 h-4 text-vn-gold" />
                  <span>Giải Thích Học Thuật Chuẩn Giáo Trình Lịch Sử Đảng:</span>
                </div>
                <p className="text-xs sm:text-sm text-vn-ivory/90 leading-relaxed font-sans">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-vn-red to-vn-red-deep border border-vn-gold text-white font-medium text-xs sm:text-sm tracking-wider uppercase hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-vn-red/40"
                >
                  <span>{currentIdx < VNR_QUIZ_QUESTIONS.length - 1 ? "Câu hỏi tiếp theo" : "Xem kết quả & Nhận Giấy Chứng Nhận"}</span>
                  <ArrowRight className="w-4 h-4 text-vn-gold" />
                </button>
              </div>
            )}

          </div>
        ) : (
          /* Completion Certificate Card */
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-vn-charcoal via-vn-black to-vn-charcoal border-2 border-vn-gold shadow-2xl text-center relative overflow-hidden">
            
            {/* Top decorative badge */}
            <div className="w-20 h-20 mx-auto rounded-full bg-vn-red-deep border-2 border-vn-gold flex items-center justify-center text-vn-gold mb-6 shadow-xl shadow-vn-gold/20">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <span className="text-xs uppercase font-semibold tracking-cinematic text-vn-gold block mb-2">
              Chứng Nhận Hoàn Thành Khảo Thí
            </span>

            <h3 className="font-display font-black text-2xl sm:text-4xl text-white mb-2">
              KẾT QUẢ KHẢO THÍ LỊCH SỬ ĐẢNG (VNR)
            </h3>

            <p className="text-xs sm:text-sm text-vn-ivory/70 mb-8 font-serif italic">
              "Ký họa Sử Đảng: Bước ngoặt Điện Biên Phủ & Lịch sử Độc lập Dân tộc"
            </p>

            {/* Score Ring */}
            <div className="inline-flex flex-col items-center justify-center p-6 rounded-2xl bg-vn-black/70 border border-vn-gold/30 mb-8 min-w-[220px]">
              <div className="font-display font-bold text-5xl sm:text-6xl text-vn-gold">
                {score} <span className="text-2xl text-vn-ivory/50">/ {VNR_QUIZ_QUESTIONS.length}</span>
              </div>
              <div className="text-xs uppercase font-semibold tracking-wider text-vn-red mt-2">
                {score >= 9 ? "Xếp loại: Xuất Sắc" : score >= 7 ? "Xếp loại: Khá Giỏi" : score >= 5 ? "Xếp loại: Đạt Tiêu Chuẩn" : "Cần Ôn Tập Lại"}
              </div>
            </div>

            {/* Certificate Form Inputs */}
            <div className="max-w-md mx-auto mb-8 p-6 rounded-2xl bg-vn-black/80 border border-vn-gold/30 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-vn-gold mb-4 text-center">
                Nhập Thông Tin Để Xuất Giấy Chứng Nhận:
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-vn-ivory/70 block mb-1">Họ và tên sinh viên:</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full px-4 py-2 rounded-xl bg-vn-charcoal border border-vn-gold/30 text-white text-sm focus:outline-none focus:border-vn-gold"
                  />
                </div>
                <div>
                  <label className="text-xs text-vn-ivory/70 block mb-1">Mã số sinh viên (MSSV):</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Ví dụ: SE123456"
                    className="w-full px-4 py-2 rounded-xl bg-vn-charcoal border border-vn-gold/30 text-white text-sm focus:outline-none focus:border-vn-gold"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateCertificate}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-vn-gold-antique to-vn-gold text-vn-black font-display font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tạo Giấy Chứng Nhận Ngay</span>
              </button>
            </div>

            {/* Hidden Canvas & Preview */}
            <div className="mb-6 flex flex-col items-center">
              <canvas
                ref={canvasRef}
                className={`max-w-full rounded-2xl border-2 border-vn-gold shadow-2xl ${
                  certificateGenerated ? 'block' : 'hidden'
                }`}
                style={{ maxHeight: '420px' }}
              />
              
              {certificateGenerated && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleDownloadPNG}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-vn-red to-vn-red-deep border border-vn-gold text-white font-bold text-xs tracking-wider uppercase hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-vn-red/40"
                  >
                    <Download className="w-4 h-4 text-vn-gold" />
                    <span>Tải Giấy Chứng Nhận (PNG Sắc Nét)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <button
                onClick={handleRestartQuiz}
                className="px-6 py-3 rounded-full bg-vn-charcoal border border-vn-gold text-vn-gold hover:bg-vn-gold hover:text-vn-black font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại bài thi</span>
              </button>
              <a
                href="#hero"
                className="px-6 py-3 rounded-full bg-vn-red hover:bg-vn-red-deep border border-vn-gold/50 text-white font-semibold text-xs tracking-wider uppercase transition-all"
              >
                Về đầu trang triển lãm
              </a>
            </div>

          </div>
        )}

      </div>

    </section>
  );
}
