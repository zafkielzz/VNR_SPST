import React, { useState, useRef, useEffect } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { soundSynth } from '../utils/soundSynth';
import { useExperience } from '../context/ExperienceContext';
import { 
  GitBranch, 
  Target, 
  Map, 
  Flag, 
  ShieldAlert, 
  CheckCircle, 
  Compass, 
  MoveHorizontal, 
  Lock, 
  Search, 
  Volume2, 
  VolumeX, 
  Radio, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  X,
  ArrowDown
} from 'lucide-react';
import { DECISION_TREE_DATA } from '../data/decisionTreeData';

const PERISCOPE_TARGETS = [
  {
    id: "target-himlam",
    name: "Trung tâm Đề kháng Him Lam (Béatrice)",
    angle: 45,
    azimuth: "045° Đông Bắc",
    distance: "1.250m",
    status: "ĐÃ KHÓA TỌA ĐỘ HỎA LỰC",
    intel: "Phát hiện 3 tầng hỏa điểm ngầm bê tông cốt thép. Cần dùng trọng pháo 105mm bắn ngắm trực tiếp chế áp trước khi mở cửa mở.",
    photo: "/images/exhibits/him_lam_beatrice.jpg",
    action: "Nổ súng mở màn Đợt 1 (13/03/1954)"
  },
  {
    id: "target-a1",
    name: "Cứ điểm Đồi A1 (Éliane 2)",
    angle: 120,
    azimuth: "120° Đông Nam",
    distance: "450m",
    status: "CHIẾN HÀO ĐÃ ĐÀO SÁT CHÂN ĐỒI",
    intel: "Cứ điểm kiên cố nhất phân khu trung tâm, hầm cố thủ ngầm sâu trong lòng núi. Công binh ta đang đào đường hầm ngầm 49m để đưa khối bộc phá 960kg vào đáy hầm.",
    photo: "/images/exhibits/doi_a1_eliane2.jpg",
    action: "Hiệu lệnh tổng công kích đêm 06/05/1954"
  },
  {
    id: "target-decastries",
    name: "Sở Chỉ Huy De Castries (Mường Thanh)",
    angle: 180,
    azimuth: "180° Chính Nam",
    distance: "600m",
    status: "BAO VÂY 4 PHÍA, CÔ LẬP HOÀN TOÀN",
    intel: "Hầm vòm sắt gợn sóng bọc bao cát dày 3 mét. Quân Pháp kiệt quệ lương thảo, sân bay bị pháo cao xạ khống chế hoàn toàn.",
    photo: "/images/exhibits/ham_de_castries.jpg",
    action: "17h30 ngày 07/05/1954: Bắt sống toàn bộ Bộ chỉ huy"
  },
  {
    id: "target-phao",
    name: "Trận Địa Trọng Pháo 105mm Của Ta",
    angle: 300,
    azimuth: "300° Tây Bắc",
    distance: "3.500m",
    status: "HOÀN TẤT CÔNG SỰ NGỤY TRANG KIÊN CỐ",
    intel: "Toàn bộ các khẩu đội pháo đã được kéo vào hầm khoét sâu trong lòng núi sau quyết định lịch sử 'Đánh chắc, tiến chắc'. Sẵn sàng dập tắt pháo binh địch.",
    photo: "/images/exhibits/phao_binh_dien_bien.jpg",
    action: "Chiến thuật pháo binh ngắm bắn trực tiếp"
  }
];

export default function DienBienExperience() {
  const root = useRef(null);
  const { setAtmosphereMode, setIsImmersionMode, prefersReducedMotion } = useExperience();

  // 1. Decision State: Pure suspense, NO pre-selected option, NO spoiler
  const [chosenOption, setChosenOption] = useState(null);
  const [showVerdict, setShowVerdict] = useState(false);
  const showVerdictRef = useRef(false);
  const decisionHeadlineRef = useRef(null);

  useEffect(() => {
    showVerdictRef.current = showVerdict;
  }, [showVerdict]);

  // Fix Bug 2: GSAP exclusively manages decision headline entrance
  useEffect(() => {
    if (!showVerdict || !decisionHeadlineRef.current) return;

    gsap.fromTo(
      decisionHeadlineRef.current,
      {
        opacity: 0,
        scale: 0.82,
      },
      {
        opacity: 1,
        scale: 1.0,
        duration: 0.75,
        ease: 'expo.out',
      }
    );
  }, [showVerdict]);
  
  // 2. Periscope interactive state & plateau (Continuous Panorama Strip & Zero-Lag Ref-driven)
  const currentAngleRef = useRef(120);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lockedTarget, setLockedTarget] = useState(null);
  const lockedTargetRef = useRef(null);
  const [activeIntelTarget, setActiveIntelTarget] = useState(null);
  const [hasInteractedPeriscope, setHasInteractedPeriscope] = useState(false);
  const dragStartRef = useRef({ x: 0, angle: 120 });
  const reticleRef = useRef(null);
  const periscopeTrackRef = useRef(null);
  const angleLabelRef = useRef(null);

  // Continuous translation of 5-panel panoramic track across 0° -> 360° (no modulo jump)
  const updateTrackPosition = (angle, smooth = false) => {
    if (periscopeTrackRef.current) {
      if (smooth) {
        periscopeTrackRef.current.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      } else {
        periscopeTrackRef.current.style.transition = 'none';
      }
      // 5 panels total (each 100% lens width = 20% of track). Travel across 4 spans = 80% total track width.
      const percent = (angle / 360) * 80;
      periscopeTrackRef.current.style.transform = `translate3d(-${percent}%, 0, 0)`;
    }

    if (angleLabelRef.current) {
      angleLabelRef.current.textContent = `${angle.toString().padStart(3, '0')}° AZIMUTH`;
    }
  };

  useEffect(() => {
    updateTrackPosition(currentAngleRef.current, false);
    const initialTarget = PERISCOPE_TARGETS.find(t => t.angle === 120);
    if (initialTarget) {
      lockedTargetRef.current = initialTarget;
      setLockedTarget(initialTarget);
    }
  }, []);

  // Pointer drag logic for Periscope: DOM transforms directly, React only updates on target lock
  const handlePointerDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, angle: currentAngleRef.current };
    if (reticleRef.current) {
      reticleRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    if (Math.abs(deltaX) > 8 && !hasInteractedPeriscope) {
      setHasInteractedPeriscope(true);
    }
    // Smooth angle update: dragging right rotates clockwise, dragging left rotates counter-clockwise
    let newAngle = Math.round(dragStartRef.current.angle + deltaX * 0.35);
    newAngle = ((newAngle % 360) + 360) % 360;
    currentAngleRef.current = newAngle;

    // Instant direct DOM transform bypasses React re-render of component during mouse move!
    updateTrackPosition(newAngle, false);

    // Target lock detection within +/- 22 degrees
    let nextLocked = null;
    let minDiff = 999;
    for (const t of PERISCOPE_TARGETS) {
      let diff = Math.abs(newAngle - t.angle);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        if (diff <= 22) {
          nextLocked = t;
        }
      }
    }

    if ((nextLocked?.id || null) !== (lockedTargetRef.current?.id || null)) {
      lockedTargetRef.current = nextLocked;
      setLockedTarget(nextLocked);
      if (nextLocked) {
        try { soundSynth.playGong(0.12); } catch (err) {}
      }
    }
  };

  const handlePointerUp = (e) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      try {
        if (reticleRef.current) reticleRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const snapToTarget = (targetAngle) => {
    currentAngleRef.current = targetAngle;
    dragStartRef.current.angle = targetAngle;
    updateTrackPosition(targetAngle, true);

    let nextLocked = null;
    let minDiff = 999;
    for (const t of PERISCOPE_TARGETS) {
      let diff = Math.abs(targetAngle - t.angle);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        if (diff <= 22) {
          nextLocked = t;
        }
      }
    }
    lockedTargetRef.current = nextLocked;
    setLockedTarget(nextLocked);
    setHasInteractedPeriscope(true);
    try {
      soundSynth.playGong(0.15);
    } catch (e) {}
  };

  const handleSelectOption = (optId) => {
    setChosenOption(optId);
    try {
      soundSynth.playGong(0.15);
    } catch (e) {}
  };

  const handleProceedToVerdict = () => {
    setShowVerdict(true);
    showVerdictRef.current = true;
    try {
      soundSynth.playGong(0.2);
    } catch (e) {}
  };

  const handleSkipDecision = () => {
    setChosenOption('danh-chac-tien-chac');
    setShowVerdict(true);
    showVerdictRef.current = true;
    try {
      soundSynth.playGong(0.2);
    } catch (e) {}
  };

  const scrollToMap = () => {
    if (!root.current) return;
    const rect = root.current.getBoundingClientRect();
    const rootTop = window.scrollY + rect.top;
    const scrollDistance = root.current.offsetHeight - window.innerHeight;
    const targetY = rootTop + scrollDistance * 0.22;
    if (typeof window !== 'undefined') {
      if (window.__lenis) {
        window.__lenis.scrollTo(targetY, { duration: 0.9 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  const scrollToVictory = () => {
    if (!root.current) return;

    const rect = root.current.getBoundingClientRect();
    const rootTop = window.scrollY + rect.top;
    const scrollDistance = root.current.offsetHeight - window.innerHeight;
    const targetY = rootTop + scrollDistance * 0.705;

    if (typeof window !== 'undefined') {
      if (window.__lenis) {
        window.__lenis.scrollTo(targetY, { duration: 1.0 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  // Master GSAP Timeline across the 780vh scroll space
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      const layerDecision = q('.layer-decision')[0];
      const decisionHeadline = q('.decision-headline')[0];
      const layerMap = q('.layer-map')[0];
      const mapTrenchLines = q('.map-trench-draw')[0];
      const mapToPeriscopeRing = q('.map-morph-ring')[0];
      const layerPeriscope = q('.layer-periscope')[0];
      const layerVictory = q('.layer-victory')[0];
      const layerSilence = q('.layer-silence')[0];

      // Initial States: Headline starts invisible (NO spoiler!)
      gsap.set(layerDecision, { opacity: 1, pointerEvents: 'auto' });
      gsap.set(decisionHeadline, { scale: 0.8, opacity: 0 });
      gsap.set(layerMap, { opacity: 0, pointerEvents: 'none' });
      gsap.set(mapToPeriscopeRing, { scale: 0.1, opacity: 0 });
      gsap.set(layerPeriscope, { opacity: 0, pointerEvents: 'none' });
      gsap.set(layerVictory, { opacity: 0, pointerEvents: 'none' });
      gsap.set(layerSilence, { opacity: 0, pointerEvents: 'none' });

      const trenchLen = mapTrenchLines ? mapTrenchLines.getTotalLength() : 1200;
      if (mapTrenchLines) {
        gsap.set(mapTrenchLines, { strokeDasharray: trenchLen, strokeDashoffset: trenchLen });
      }

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.25,
          onUpdate: (self) => {
            const p = self.progress;

            // Fix Bug 1: Behavioral Gate at Decision Plateau (p = 0.11)
            // Hold user on the decision plateau until they choose an option or click Skip
            if (!showVerdictRef.current && p > 0.11) {
              if (self.direction > 0) {
                const gateY = self.start + (self.end - self.start) * 0.11;
                if (typeof window !== 'undefined') {
                  if (window.__lenis) {
                    window.__lenis.scrollTo(gateY, { immediate: true });
                  } else {
                    window.scrollTo({ top: gateY });
                  }
                }
                return;
              }
            }

            // Contextual Atmosphere & Immersion handling
            if (p < 0.22) {
              setAtmosphereMode('dust');
              setIsImmersionMode(false);
            } else if (p >= 0.22 && p < 0.72) {
              setAtmosphereMode('ember');
              // Fullscreen immersion during periscope
              if (p >= 0.48 && p < 0.72) {
                setIsImmersionMode(true);
              } else {
                setIsImmersionMode(false);
              }
            } else if (p >= 0.72 && p < 0.86) {
              setAtmosphereMode('none');
              setIsImmersionMode(true);
            } else {
              // Anti-Wow Silence: Complete stillness
              setAtmosphereMode('none');
              setIsImmersionMode(true);
            }
          }
        },
      });

      // =======================================================================
      // PHASE 1: DECISION AT MƯỜNG PHĂNG (0.00 -> 0.22)
      // =======================================================================
      master.to(q('.decision-briefing-box'), { opacity: 0, y: -40, duration: 0.06 }, 0.12)
        // At ~0.14 -> 0.22: "ĐÁNH CHẮC, TIẾN CHẮC" scales to 8.5x (or gentle fade in reduced motion), camera plunges into negative space
        .fromTo(
          decisionHeadline,
          {
            scale: 1.0,
            opacity: 1,
          },
          {
            scale: prefersReducedMotion ? 1.05 : 8.5,
            opacity: 0,
            ease: 'power2.in',
            duration: 0.08,
            immediateRender: false,
          },
          0.14
        )
        .to(layerDecision, { opacity: 0, pointerEvents: 'none', duration: 0.04 }, 0.22);

      // =======================================================================
      // PHASE 2: TACTICAL CAMPAIGN MAP SEQUENCE (0.20 -> 0.50)
      // Map is revealed inside the typography negative space!
      // =======================================================================
      master.to(layerMap, { opacity: 1, pointerEvents: 'auto', duration: 0.08 }, 0.20)
        // Scroll drives trench lines drawing across the valley
        .to(mapTrenchLines, { strokeDashoffset: 0, ease: 'none', duration: 0.24 }, 0.22)
        // HUD date indicator transforms across the 3 phases
        .to(q('.map-hud-phase1'), { opacity: 0, duration: 0.05 }, 0.30)
        .fromTo(q('.map-hud-phase2'), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.30)
        .to(q('.map-hud-phase2'), { opacity: 0, duration: 0.05 }, 0.40)
        .fromTo(q('.map-hud-phase3'), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.40)

        // 0.44 -> 0.50: Map zooms into Target A1 (● expands into reticle rings -> viewport periscope)
        .to(
          q('.map-camera-container'),
          {
            scale: prefersReducedMotion ? 1.1 : 3.5,
            x: prefersReducedMotion ? 0 : -80,
            y: prefersReducedMotion ? 0 : -40,
            transformOrigin: '55% 58%',
            ease: 'power2.in',
            duration: 0.06,
          },
          0.44
        )
        .to(
          mapToPeriscopeRing,
          {
            scale: 8.0,
            opacity: 1,
            ease: 'power2.in',
            duration: 0.08,
          },
          0.44
        )
        .to(layerMap, { opacity: 0, pointerEvents: 'none', duration: 0.04 }, 0.50);

      // =======================================================================
      // PHASE 3: FULLSCREEN OPTICAL PERISCOPE (0.48 -> 0.72)
      // Interaction plateau allows user to explore before Victory triggers
      // =======================================================================
      master.to(layerPeriscope, { opacity: 1, pointerEvents: 'auto', duration: 0.06 }, 0.48)
        .fromTo(
          q('.periscope-lens-frame'),
          { scale: 0.85, opacity: 0 },
          { scale: 1.0, opacity: 1, ease: 'power2.out', duration: 0.06 },
          0.50
        )
        // Interaction Plateau window
        .to({}, { duration: 0.16 }, 0.52)
        .to(layerPeriscope, { opacity: 0, scale: 1.15, pointerEvents: 'none', duration: 0.05 }, 0.70);

      // =======================================================================
      // PHASE 4: CLIMAX OF VICTORY ON DE CASTRIES BUNKER (0.70 -> 0.86)
      // Sudden flash -> Fullscreen Archival Photo -> 17:30 -> 07/05/1954 -> Toàn Thắng
      // =======================================================================
      master.to(q('.victory-flash'), { opacity: 1, duration: 0.03, yoyo: true, repeat: 1 }, 0.70)
        .to(layerVictory, { opacity: 1, pointerEvents: 'auto', duration: 0.06 }, 0.71)
        .fromTo(
          q('.victory-photo-bg'),
          { scale: 1.0 },
          { scale: 1.08, ease: 'none', duration: 0.15 },
          0.71
        )
        .fromTo(
          q('.victory-time-1730'),
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1.0, duration: 0.04 },
          0.72
        )
        .to(q('.victory-time-1730'), { opacity: 0, y: -20, duration: 0.04 }, 0.77)
        .fromTo(
          q('.victory-date-banner'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.05 },
          0.77
        )
        .to(layerVictory, { opacity: 0, duration: 0.04 }, 0.86);

      // =======================================================================
      // PHASE 5: ANTI-WOW SILENCE (0.86 -> 1.00)
      // Absolute pitch black. No animation. Silence.
      // =======================================================================
      master.to(layerSilence, { opacity: 1, pointerEvents: 'auto', duration: 0.04 }, 0.86)
        .fromTo(
          q('.silence-thought'),
          { opacity: 0 },
          { opacity: 1, ease: 'power1.in', duration: 0.08 },
          0.92
        );

      master.to({}, { duration: 1.0 }, 0);
    },
    { scope: root }
  );

  return (
    <div id="dien-bien-1954" ref={root} className="relative h-[780vh] bg-black text-white">
      
      {/* Sticky Single Master Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center">

        {/* ===================================================================
            LAYER 1: MƯỜNG PHĂNG BRIEFING & NEUTRAL DECISION (0.00 -> 0.22)
           =================================================================== */}
        <div className="layer-decision absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-8 py-10 bg-[#080a0d]">
          <div className="decision-briefing-box max-w-4xl w-full mx-auto text-center space-y-4">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-mono font-bold uppercase tracking-widest shadow-xl">
              <GitBranch className="w-3.5 h-3.5 text-vn-red" />
              <span>Sở Chỉ Huy Mường Phăng · Sáng 26/01/1954</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
              Thời Khắc Quyết Định Cân Não
            </h2>

            <p className="font-heading italic text-base sm:text-lg text-vn-gold max-w-2xl mx-auto">
              "{DECISION_TREE_DATA.briefing.mandateFromUncleHo}"
            </p>

            <p className="text-xs sm:text-sm text-vn-ivory/70 max-w-xl mx-auto font-light">
              Mọi công tác đã sẵn sàng theo phương án ban đầu. Đứng trước tình hình đối phương tăng viện công sự kiên cố, bạn sẽ quyết định như thế nào?
            </p>

            {/* 2 Neutral Options: No giveaway spoiler colors! */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2 text-left">
              
              {/* Option A */}
              <div 
                onClick={() => handleSelectOption('danh-nhanh-thang-nhanh')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  chosenOption === 'danh-nhanh-thang-nhanh'
                    ? 'bg-amber-950/40 border-vn-gold ring-1 ring-vn-gold shadow-[0_0_20px_rgba(255,205,0,0.2)]'
                    : 'bg-[#12161f] border-white/15 hover:border-vn-gold/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-vn-gold font-bold uppercase">
                    DỰ THẢO TÁC CHIẾN A
                  </span>
                  {chosenOption === 'danh-nhanh-thang-nhanh' && (
                    <span className="w-2 h-2 rounded-full bg-vn-gold animate-ping" />
                  )}
                </div>
                <h4 className="font-display font-bold text-base text-white">Đánh Nhanh, Thắng Nhanh</h4>
                <p className="text-xs text-vn-ivory/70 mt-1 font-light leading-relaxed">
                  Tập trung hỏa lực công kích thọc sâu trong 3 ngày 2 đêm khi đối phương chưa kịp củng cố cụm cứ điểm.
                </p>
              </div>

              {/* Option B */}
              <div 
                onClick={() => handleSelectOption('danh-chac-tien-chac')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  chosenOption === 'danh-chac-tien-chac'
                    ? 'bg-amber-950/40 border-vn-gold ring-1 ring-vn-gold shadow-[0_0_20px_rgba(255,205,0,0.2)]'
                    : 'bg-[#12161f] border-white/15 hover:border-vn-gold/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-vn-gold font-bold uppercase">
                    DỰ THẢO TÁC CHIẾN B
                  </span>
                  {chosenOption === 'danh-chac-tien-chac' && (
                    <span className="w-2 h-2 rounded-full bg-vn-gold animate-ping" />
                  )}
                </div>
                <h4 className="font-display font-bold text-base text-white">Đánh Chắc, Tiến Chắc</h4>
                <p className="text-xs text-vn-ivory/70 mt-1 font-light leading-relaxed">
                  Kéo pháo ra, hoãn nổ súng, chuẩn bị chu đáo, đào chiến hào bao vây siết chặt theo nguyên tắc chắc thắng.
                </p>
              </div>

            </div>

            {/* Branch 1: Option A What-If Simulation */}
            {chosenOption === 'danh-nhanh-thang-nhanh' && !showVerdict && (
              <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-red-950/80 border-2 border-red-500/70 text-left space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-900 border border-red-400 text-red-100 text-[10px] font-mono font-bold uppercase tracking-wider">
                    {DECISION_TREE_DATA.options[0].consequence.headline}
                  </span>
                  <span className="text-[10px] font-mono text-red-300/70">Mô phỏng giả định</span>
                </div>
                <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed font-sans">
                  {DECISION_TREE_DATA.options[0].consequence.assessment}
                </p>
                <div className="p-3 rounded-xl bg-black/60 border border-red-400/30 text-[11px] sm:text-xs text-vn-ivory/90 font-serif">
                  <strong className="text-vn-gold not-italic font-mono uppercase text-[10px] block mb-1">
                    Bài học Lịch sử Đảng & Nghệ thuật Quân sự:
                  </strong>
                  "{DECISION_TREE_DATA.options[0].consequence.historicalLesson}"
                </div>
                <div className="pt-1 flex items-center justify-end">
                  <button
                    onClick={handleProceedToVerdict}
                    className="px-5 py-2 rounded-full bg-vn-gold text-vn-black font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <span>Xem Quyết Định Lịch Sử Thực Tế Của Đại Tướng →</span>
                  </button>
                </div>
              </div>
            )}

            {/* Branch 2: Option B Historical Alignment */}
            {chosenOption === 'danh-chac-tien-chac' && !showVerdict && (
              <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400/70 text-left space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-900 border border-emerald-400 text-emerald-100 text-[10px] font-mono font-bold uppercase tracking-wider">
                    {DECISION_TREE_DATA.options[1].consequence.headline}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300/70">Quyết định chuẩn xác</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans">
                  {DECISION_TREE_DATA.options[1].consequence.assessment}
                </p>
                <div className="p-3 rounded-xl bg-black/60 border border-emerald-400/30 text-[11px] sm:text-xs text-vn-ivory/90 font-serif">
                  <strong className="text-vn-gold not-italic font-mono uppercase text-[10px] block mb-1">
                    Ý nghĩa bước ngoặt chiến lược:
                  </strong>
                  "{DECISION_TREE_DATA.options[1].consequence.historicalLesson}"
                </div>
                <div className="pt-1 flex items-center justify-end">
                  <button
                    onClick={handleProceedToVerdict}
                    className="px-5 py-2 rounded-full bg-emerald-400 text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-emerald-300 transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <span>Tiếp Tục Hành Trình Tác Chiến →</span>
                  </button>
                </div>
              </div>
            )}

            {/* Converged Historical Verdict */}
            {showVerdict ? (
              <div className="pt-3 animate-in fade-in zoom-in-95 duration-500 space-y-3">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-200 text-xs sm:text-sm font-mono shadow-2xl">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>
                    {chosenOption === 'danh-nhanh-thang-nhanh'
                      ? 'Lịch sử chuyển hướng: Đại tướng quyết định hoãn nổ súng, ĐÁNH CHẮC TIẾN CHẮC'
                      : 'Đại tướng quyết định: Lịch sử đã chọn phương châm ĐÁNH CHẮC, TIẾN CHẮC'}
                  </span>
                </div>
                <div>
                  <button
                    onClick={scrollToMap}
                    className="px-6 py-2.5 rounded-full bg-vn-gold text-vn-black font-display font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-[0_0_20px_rgba(255,205,0,0.3)] cursor-pointer"
                  >
                    <span>Mở Màn Sa Bàn Tác Chiến ↓</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              !chosenOption && (
                <div className="pt-2">
                  <button
                    onClick={handleSkipDecision}
                    className="text-xs font-mono text-vn-ivory/50 hover:text-vn-gold underline transition-colors cursor-pointer"
                  >
                    Bỏ qua lựa chọn · tiếp tục theo dòng lịch sử →
                  </button>
                </div>
              )
            )}

            <p className="text-[11px] font-mono text-vn-ivory/50 pt-1">
              {showVerdict ? 'Cuộn tiếp hoặc bấm nút trên để mở màn tiến công trên sa bàn ↓' : 'Chọn 1 phương án tác chiến để kiểm tra giả định lịch sử ↓'}
            </p>
          </div>

          {/* Monumental Scaling Headline: "ĐÁNH CHẮC, TIẾN CHẮC" */}
          <div 
            ref={decisionHeadlineRef}
            className="decision-headline will-transform absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-vn-gold text-glow-gold text-center px-4">
              ĐÁNH CHẮC<br />TIẾN CHẮC
            </h1>
          </div>
        </div>

        {/* ===================================================================
            LAYER 2: BATTLEFIELD CAMPAIGN MAP (0.20 -> 0.50)
           =================================================================== */}
        <div className="layer-map absolute inset-0 z-20 flex items-center justify-center bg-[#070b0e]">
          
          {/* Top-Left Live HUD Battle Timeline */}
          <div className="absolute top-6 left-6 z-30 pointer-events-none space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-vn-gold/40 text-vn-gold text-xs font-mono">
              <Map className="w-3.5 h-3.5 text-vn-red" />
              <span>SA BÀN CHIẾN LƯỢC ĐIỆN BIÊN PHỦ</span>
            </div>

            {/* Changing Phase & Date */}
            <div className="map-hud-phase1 text-left">
              <span className="font-display font-black text-3xl sm:text-4xl text-white block">
                13 · 03 · 1954
              </span>
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider">
                ĐỢT 1: ĐỘT PHÁ CÁNH CỬA PHÍA BẮC (HIM LAM, ĐỘC LẬP)
              </span>
            </div>

            <div className="map-hud-phase2 text-left opacity-0 absolute top-8 left-0">
              <span className="font-display font-black text-3xl sm:text-4xl text-white block">
                30 · 03 · 1954
              </span>
              <span className="text-xs font-mono text-vn-gold uppercase tracking-wider">
                ĐỢT 2: SIẾT VÒNG VÂY CAO ĐIỂM PHÍA ĐÔNG (ĐỒI A1, C1)
              </span>
            </div>

            <div className="map-hud-phase3 text-left opacity-0 absolute top-8 left-0">
              <span className="font-display font-black text-3xl sm:text-4xl text-white block">
                06 · 05 · 1954
              </span>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                ĐỢT 3: BỘC PHÁ 960KG NỔ · TỔNG CÔNG KÍCH TOÀN MẶT TRẬN
              </span>
            </div>
          </div>

          {/* Scalable Map Camera Container */}
          <div className="map-camera-container will-transform relative w-full max-w-5xl aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center p-4">
            
            <svg viewBox="0 0 1000 600" className="w-full h-full rounded-2xl bg-[#090e13] border border-vn-gold/20 shadow-2xl">
              <defs>
                <radialGradient id="valleyNight" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#121a16" stopOpacity="0.9" />
                  <stop offset="65%" stopColor="#080c10" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#040608" stopOpacity="1" />
                </radialGradient>
              </defs>

              <rect width="1000" height="600" fill="url(#valleyNight)" />

              {/* Mountains */}
              <path d="M 0,0 Q 250,150 120,380 T 0,600 L 0,0 Z" fill="#152019" opacity="0.6" />
              <path d="M 1000,0 Q 750,220 860,420 T 1000,600 L 1000,0 Z" fill="#152019" opacity="0.6" />

              {/* Nam Rom River */}
              <path
                d="M 500,0 Q 460,180 520,300 T 480,480 T 470,600"
                fill="none"
                stroke="#1f364d"
                strokeWidth="16"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Mường Thanh Airfield Runway */}
              <line x1="480" y1="220" x2="480" y2="400" stroke="#4a5568" strokeWidth="12" strokeDasharray="16 8" />
              <text x="410" y="210" fill="#718096" fontSize="14" fontFamily="monospace">SÂN BAY MƯỜNG THANH</text>

              {/* Living Trench Network SVG (Draws on scroll) */}
              <path
                d="M 220,120 Q 340,160 440,240 T 520,290 T 560,380 M 760,140 Q 640,200 550,260 T 490,340 M 420,440 Q 480,420 540,430"
                fill="none"
                stroke="#DA251D"
                strokeWidth="4"
                strokeDasharray="6 4"
                className="map-trench-draw drop-shadow-[0_0_8px_#DA251D]"
              />

              {/* Outpost A1 Point */}
              <g className="map-target-a1">
                <circle cx="560" cy="350" r="12" fill="none" stroke="#FFCD00" strokeWidth="2" className="animate-ping" style={{ transformOrigin: '560px 350px' }} />
                <circle cx="560" cy="350" r="8" fill="#DA251D" stroke="#FFCD00" strokeWidth="2" />
                <text x="560" y="330" textAnchor="middle" fill="#FFCD00" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                  ĐỒI A1
                </text>
              </g>

              {/* Outpost Him Lam */}
              <g>
                <circle cx="720" cy="150" r="7" fill="#e53e3e" stroke="#2d3748" strokeWidth="2" />
                <text x="720" y="135" textAnchor="middle" fill="#cbd5e0" fontSize="13" fontFamily="sans-serif">
                  Him Lam
                </text>
              </g>

              {/* Outpost De Castries HQ */}
              <g>
                <circle cx="500" cy="360" r="9" fill="#dd6b20" stroke="#FFCD00" strokeWidth="1.5" />
                <text x="500" y="390" textAnchor="middle" fill="#fbd38d" fontSize="13" fontFamily="sans-serif">
                  Hầm De Castries
                </text>
              </g>
            </svg>

            {/* Expanding Morphing Ring (Transforms A1 into Periscope Optic Lens) */}
            <div className="map-morph-ring will-transform absolute w-32 h-32 rounded-full border-4 border-vn-gold pointer-events-none z-40" />

          </div>
        </div>

        {/* ===================================================================
            LAYER 3: FULLSCREEN 360° OPTICAL PERISCOPE (0.48 -> 0.72)
            With Interaction Plateau & Smooth Progression Action
           =================================================================== */}
        <div className="layer-periscope absolute inset-0 z-30 flex flex-col items-center justify-center bg-black select-none">
          
          {/* Full-Screen Circular Optical Lens Frame */}
          <div 
            ref={reticleRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="periscope-lens-frame relative w-[88vw] sm:w-[74vh] h-[88vw] sm:h-[74vh] max-w-[640px] max-h-[640px] rounded-full border-[12px] sm:border-[18px] border-[#12161b] bg-black shadow-[0_0_120px_rgba(0,0,0,1)] ring-4 ring-vn-gold/40 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
          >
            {/* Continuous 360° Horizontal Panorama Track (5 Panels seamless continuous scroll, NO modulo jump) */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div 
                ref={periscopeTrackRef}
                className="h-full flex will-change-transform"
                style={{ width: '500%' }}
              >
                {/* Panel 0: Him Lam (045° Đông Bắc) */}
                <div className="relative w-1/5 h-full flex-shrink-0">
                  <img
                    src="/images/exhibits/him_lam_beatrice.jpg"
                    alt="Trung tâm đề kháng Him Lam"
                    className="w-full h-full object-cover filter contrast-125 sepia-[0.3]"
                    draggable={false}
                  />
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/80 border border-red-500/60 text-[10px] font-mono text-red-300">
                    045° HIM LAM
                  </div>
                </div>

                {/* Panel 1: Đồi A1 (120° Đông Nam) */}
                <div className="relative w-1/5 h-full flex-shrink-0">
                  <img
                    src="/images/exhibits/doi_a1_eliane2.jpg"
                    alt="Cứ điểm Đồi A1"
                    className="w-full h-full object-cover filter contrast-125 sepia-[0.3]"
                    draggable={false}
                  />
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/80 border border-red-500/60 text-[10px] font-mono text-red-300">
                    120° ĐỒI A1
                  </div>
                </div>

                {/* Panel 2: Sở Chỉ Huy De Castries (180° Chính Nam) */}
                <div className="relative w-1/5 h-full flex-shrink-0">
                  <img
                    src="/images/exhibits/ham_de_castries.jpg"
                    alt="Sở Chỉ Huy De Castries"
                    className="w-full h-full object-cover filter contrast-125 sepia-[0.3]"
                    draggable={false}
                  />
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/80 border border-red-500/60 text-[10px] font-mono text-red-300">
                    180° DE CASTRIES
                  </div>
                </div>

                {/* Panel 3: Trận Địa Pháo (300° Tây Bắc) */}
                <div className="relative w-1/5 h-full flex-shrink-0">
                  <img
                    src="/images/exhibits/phao_binh_dien_bien.jpg"
                    alt="Trận địa pháo 105mm"
                    className="w-full h-full object-cover filter contrast-125 sepia-[0.3]"
                    draggable={false}
                  />
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/80 border border-red-500/60 text-[10px] font-mono text-red-300">
                    300° TRẬN ĐỊA PHÁO
                  </div>
                </div>

                {/* Panel 4: Him Lam wrap-around seamless repeat */}
                <div className="relative w-1/5 h-full flex-shrink-0">
                  <img
                    src="/images/exhibits/him_lam_beatrice.jpg"
                    alt="Trung tâm đề kháng Him Lam"
                    className="w-full h-full object-cover filter contrast-125 sepia-[0.3]"
                    draggable={false}
                  />
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/80 border border-red-500/60 text-[10px] font-mono text-red-300">
                    045° HIM LAM
                  </div>
                </div>
              </div>

              {/* Optical Tint and Radial Vignette */}
              <div className="absolute inset-0 bg-emerald-950/20 mix-blend-color pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.92)_100%)] pointer-events-none" />
            </div>

            {/* Tactical Military Reticle HUD directly inside lens */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none z-20">
              <circle cx="100" cy="100" r="92" fill="none" stroke={lockedTarget ? "#DA251D" : "#FFCD00"} strokeWidth="0.8" opacity="0.8" />
              <circle cx="100" cy="100" r="82" fill="none" stroke="#FFCD00" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.4" />
              
              <line x1="100" y1="10" x2="100" y2="190" stroke={lockedTarget ? "#DA251D" : "#FFCD00"} strokeWidth="0.8" opacity="0.8" />
              <line x1="10" y1="100" x2="190" y2="100" stroke={lockedTarget ? "#DA251D" : "#FFCD00"} strokeWidth="0.8" opacity="0.8" />

              {[-30, -20, -10, 10, 20, 30].map((offset) => (
                <React.Fragment key={offset}>
                  <line x1={100 + offset} y1="96" x2={100 + offset} y2="104" stroke="#FFCD00" strokeWidth="0.5" opacity="0.8" />
                  <line x1="96" y1={100 + offset} x2="104" y2={100 + offset} stroke="#FFCD00" strokeWidth="0.5" opacity="0.8" />
                </React.Fragment>
              ))}

              {lockedTarget ? (
                <g>
                  <circle cx="100" cy="100" r="14" fill="none" stroke="#DA251D" strokeWidth="1.2" className="animate-ping" style={{ transformOrigin: '100px 100px', animationDuration: '2s' }} />
                  <circle cx="100" cy="100" r="9" fill="none" stroke="#DA251D" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="3" fill="#DA251D" />
                </g>
              ) : (
                <circle cx="100" cy="100" r="5" fill="none" stroke="#FFCD00" strokeWidth="0.8" strokeDasharray="2 2" />
              )}

              <text 
                ref={angleLabelRef}
                x="100" y="24" textAnchor="middle" fill={lockedTarget ? "#DA251D" : "#FFCD00"} fontSize="7" fontFamily="monospace" fontWeight="bold"
              >
                {currentAngleRef.current.toString().padStart(3, '0')}° AZIMUTH
              </text>
            </svg>

            {/* Target Annotation Directly in Lens */}
            {lockedTarget ? (
              <div 
                onClick={() => setActiveIntelTarget(lockedTarget)}
                className="absolute bottom-10 sm:bottom-12 z-30 px-4 py-2 rounded-2xl bg-red-950/95 border border-red-500 text-center shadow-2xl cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-1.5 justify-center text-red-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
                  <Lock className="w-3 h-3 text-red-400 animate-pulse" />
                  <span>MỤC TIÊU: {lockedTarget.azimuth.split(' ')[0]} · {lockedTarget.distance}</span>
                </div>
                <h4 className="font-display font-black text-sm sm:text-base text-white">
                  {lockedTarget.name}
                </h4>
                <span className="text-[10px] font-mono text-vn-gold underline mt-0.5 block">
                  Bấm để xem điện báo tình báo →
                </span>
              </div>
            ) : (
              <div className="absolute top-6 px-3.5 py-1 rounded-full bg-black/75 border border-white/15 text-[11px] font-mono text-vn-ivory/80 flex items-center gap-2 pointer-events-none z-30 shadow-lg">
                <MoveHorizontal className="w-3.5 h-3.5 text-vn-gold" />
                <span>← KÉO NGANG ĐỂ QUAN SÁT 360° →</span>
              </div>
            )}

          </div>

          {/* Tactical Outpost Quick Snap Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 z-40 max-w-xl px-2">
            {PERISCOPE_TARGETS.map((t) => {
              const isTargetActive = lockedTarget?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => snapToTarget(t.angle)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                    isTargetActive
                      ? 'bg-vn-red text-white border border-red-400 shadow-[0_0_15px_rgba(218,37,29,0.7)] scale-105'
                      : 'bg-[#161a22] text-vn-ivory/70 border border-white/15 hover:border-vn-gold/60 hover:text-vn-gold'
                  }`}
                  title={`Xoay kính ngắm tới ${t.name}`}
                >
                  <Target className="w-3 h-3 text-vn-gold" />
                  <span>{t.azimuth.split(' ')[0]} {t.name.split(' (')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Interaction Plateau Controls: Reward user for interacting */}
          {hasInteractedPeriscope ? (
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 z-40 animate-in fade-in zoom-in-95 duration-300">
              <button 
                onClick={scrollToVictory}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-vn-gold to-amber-500 text-vn-black font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,205,0,0.4)] hover:scale-105 transition-transform flex items-center gap-2"
              >
                <span>Tiếp Tục Hành Trình Tới Chiến Thắng ↓</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={scrollToVictory}
                className="text-[11px] font-mono text-vn-ivory/50 hover:text-vn-gold underline transition-colors"
              >
                Bỏ qua trinh sát →
              </button>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center z-40">
              <button
                onClick={scrollToVictory}
                className="text-xs font-mono text-vn-ivory/50 hover:text-vn-gold underline transition-colors"
              >
                Bỏ qua trinh sát →
              </button>
            </div>
          )}

          {/* Tactical Intel Modal Drawer inside Periscope */}
          {activeIntelTarget && (
            <div className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-vn-charcoal border-2 border-vn-gold shadow-2xl relative space-y-4">
                <button
                  onClick={() => setActiveIntelTarget(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-vn-ivory hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-vn-gold">
                  <Radio className="w-4 h-4 text-vn-red animate-pulse" />
                  <span>BÁO CÁO TRINH SÁT MẶT TRẬN</span>
                </div>

                <h3 className="font-display font-black text-2xl text-white">
                  {activeIntelTarget.name}
                </h3>

                <div className="p-4 rounded-2xl bg-black/60 border border-vn-gold/20 text-xs sm:text-sm text-vn-ivory/90 leading-relaxed font-sans">
                  <strong className="text-vn-gold block mb-1 font-mono uppercase text-[11px]">
                    Chi tiết tình báo công sự:
                  </strong>
                  {activeIntelTarget.intel}
                </div>

                <div className="p-3.5 rounded-xl bg-vn-red-deep/30 border border-vn-red/40 text-xs text-vn-ivory/90">
                  <strong className="text-vn-red block mb-1 font-mono uppercase text-[11px]">
                    Hành động chiến thuật của ta:
                  </strong>
                  {activeIntelTarget.action}
                </div>

                <button
                  onClick={() => setActiveIntelTarget(null)}
                  className="w-full py-2.5 rounded-full bg-vn-gold text-vn-black font-display font-bold text-xs uppercase tracking-wider"
                >
                  Đóng điện báo · Tiếp tục quan sát qua kính
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ===================================================================
            LAYER 4: CLIMAX OF VICTORY (17:30 - 07/05/1954) (0.70 -> 0.86)
           =================================================================== */}
        <div className="layer-victory absolute inset-0 z-35 flex items-center justify-center bg-black overflow-hidden pointer-events-none">
          
          {/* Fullscreen Historic Photograph with Ken Burns scale */}
          <div className="victory-photo-bg will-transform absolute inset-0">
            <img
              src="/images/exhibits/exhibit_6_1.jpg"
              alt="Cờ Quyết chiến Quyết thắng tung bay nóc hầm De Castries"
              className="w-full h-full object-cover filter contrast-125 sepia-[0.15]"
            />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90 pointer-events-none" />
          </div>

          <div className="victory-flash absolute inset-0 bg-white opacity-0 pointer-events-none z-40" />

          {/* Typographic Momentum in Center */}
          <div className="relative z-30 flex flex-col items-center justify-center text-center px-6 max-w-4xl space-y-4">
            
            <div className="victory-time-1730 will-transform font-mono font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-widest text-glow-gold drop-shadow-2xl">
              17:30
            </div>

            <div className="victory-date-banner will-transform space-y-3">
              <span className="text-xs sm:text-sm font-mono tracking-[0.5em] text-vn-gold uppercase block">
                CHIỀU NGÀY LỊCH SỬ
              </span>
              <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl text-white tracking-tight leading-none text-glow-gold drop-shadow-2xl">
                07 · 05 · 1954
              </h2>
              <h3 className="font-display font-bold text-xl sm:text-3xl text-vn-gold uppercase tracking-wider mt-2">
                TOÀN THẮNG TRÊN NÓC HẦM DE CASTRIES
              </h3>
            </div>

          </div>
        </div>

        {/* ===================================================================
            LAYER 5: ANTI-WOW SILENCE (KHOẢNG LẶNG THIÊNG LIÊNG) (0.86 -> 1.00)
           =================================================================== */}
        <div className="layer-silence absolute inset-0 z-40 flex flex-col items-center justify-center bg-black text-center px-6">
          <div className="max-w-xl mx-auto space-y-6">
            
            <span className="font-display font-black text-4xl sm:text-6xl text-white/90 tracking-widest block">
              07 · 05 · 1954
            </span>

            <p className="silence-thought font-serif italic text-sm sm:text-base text-white/60 leading-relaxed max-w-md mx-auto">
              "56 ngày đêm khoét núi, ngủ hầm, mưa dầm, cơm vắt, máu trộn bùn non... để làm nên bản anh hùng ca bất diệt của thế kỷ XX."
            </p>

          </div>
        </div>

      </div>

    </div>
  );
}
