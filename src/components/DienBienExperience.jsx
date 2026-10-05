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
      // 400% track width. Travel across 3 spans (300% / 400%) = 75% total track width.
      const percent = (angle / 360) * 75;
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
                    <span className="w-2 h-2 rounded-full bg-vn-gold shadow-[0_0_8px_#FFCD00]" />
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
                    <span className="w-2 h-2 rounded-full bg-vn-gold shadow-[0_0_8px_#FFCD00]" />
                  )}
                </div>
                <h4 className="font-display font-bold text-base text-white">Đánh Chắc, Tiến Chắc</h4>
                <p className="text-xs text-vn-ivory/70 mt-1 font-light leading-relaxed">
                  Kéo pháo ra, hoãn nổ súng, chuẩn bị chu đáo, đào chiến hào bao vây siết chặt theo nguyên tắc chắc thắng.
                </p>
              </div>

            </div>

            {/* Branch 1: Option A Visual Tactical Hazard Consequence */}
            {chosenOption === 'danh-nhanh-thang-nhanh' && !showVerdict && (
              <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#1a0808] border-2 border-red-500/80 text-center space-y-3 animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
                <div className="flex items-center justify-between border-b border-red-500/30 pb-2">
                  <span className="px-3 py-0.5 rounded-full bg-red-950 border border-red-500 text-red-300 text-[10px] font-mono font-bold uppercase tracking-widest">
                    MÔ PHỎNG CHIẾN THUẬT: PHƯƠNG ÁN 1 (ĐÁNH NHANH)
                  </span>
                  <span className="text-[10px] font-mono text-red-400 font-bold">RỦI RO CHIẾN LƯỢC</span>
                </div>

                {/* Tactical Miniature Map: Attack arrows charge into deadly crossfire */}
                <div className="relative w-full h-36 sm:h-40 rounded-xl bg-[#090b0e] border border-red-500/40 overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 500 160" className="w-full h-full">
                    {/* Basin background */}
                    <rect width="500" height="160" fill="#080c10" />
                    {/* French Stronghold Cluster at Center */}
                    <circle cx="250" cy="80" r="32" fill="#2d1515" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                    <text x="250" y="84" textAnchor="middle" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      CỤM CỨ ĐIỂM ĐỊCH (49 VỊ TRÍ)
                    </text>
                    {/* Crossfire Hazard Zone */}
                    <circle cx="250" cy="80" r="54" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />

                    {/* Mũi tiến công thọc sâu lao thẳng vào hỏa lực */}
                    <g stroke="#ef4444" strokeWidth="3" markerEnd="url(#redArrow)">
                      <line x1="80" y1="40" x2="215" y2="72" />
                      <line x1="80" y1="120" x2="215" y2="88" />
                      <line x1="420" y1="80" x2="285" y2="80" />
                    </g>
                    {/* Warning icons */}
                    <text x="140" y="32" fill="#fca5a5" fontSize="9" fontFamily="monospace">Pháo ta lộ thiên sườn núi</text>
                    <text x="140" y="145" fill="#fca5a5" fontSize="9" fontFamily="monospace">Bộ đội chưa quen công sự kiên cố</text>
                    <text x="310" y="55" fill="#fca5a5" fontSize="9" fontFamily="monospace">Không quân địch áp đảo</text>
                  </svg>
                </div>

                <p className="text-xs sm:text-sm text-red-200 font-sans leading-relaxed max-w-xl mx-auto">
                  <strong className="text-white font-mono uppercase text-xs block mb-0.5">Hậu quả quân sự:</strong>
                  Bộ đội sẽ đột phá ban ngày trên cánh đồng Mường Thanh trống trải trước 49 cứ điểm bê tông liên hoàn. Pháo ta phơi mình trên sườn núi dễ bị phản pháo tiêu diệt.
                </p>

                <div className="pt-1 flex items-center justify-center">
                  <button
                    onClick={handleProceedToVerdict}
                    className="px-6 py-2.5 rounded-full bg-vn-gold text-vn-black font-display font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-xl flex items-center gap-2"
                  >
                    <span>Xem Quyết Định Của Đại Tướng: Kéo Pháo Ra →</span>
                  </button>
                </div>
              </div>
            )}

            {/* Branch 2: Option B Visual Tactical Siege Consequence */}
            {chosenOption === 'danh-chac-tien-chac' && !showVerdict && (
              <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#081810] border-2 border-emerald-400/80 text-center space-y-3 animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                  <span className="px-3 py-0.5 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-widest">
                    MÔ PHỎNG CHIẾN THUẬT: PHƯƠNG ÁN 2 (ĐÁNH CHẮC TIẾN CHẮC)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">QUYẾT ĐỊNH LỊCH SỬ</span>
                </div>

                {/* Tactical Miniature Map: Artillery pulled back to caves, trenches encircle */}
                <div className="relative w-full h-36 sm:h-40 rounded-xl bg-[#080d12] border border-emerald-500/40 overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 500 160" className="w-full h-full">
                    {/* Basin background */}
                    <rect width="500" height="160" fill="#080c10" />
                    {/* French Stronghold Cluster Isolated */}
                    <circle cx="250" cy="80" r="26" fill="#1e1814" stroke="#d97706" strokeWidth="1.5" />
                    <text x="250" y="84" textAnchor="middle" fill="#d97706" fontSize="10" fontFamily="monospace">
                      ĐỊCH BỊ CÔ LẬP
                    </text>

                    {/* Concentric Encircling Siege Trenches */}
                    <circle cx="250" cy="80" r="48" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="6 3" />
                    <circle cx="250" cy="80" r="66" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="8 4" opacity="0.7" />

                    {/* Artillery pulling back into mountain tunnels */}
                    <path d="M 180,50 L 100,25" fill="none" stroke="#eab308" strokeWidth="2.5" strokeDasharray="4 2" />
                    <path d="M 320,50 L 400,25" fill="none" stroke="#eab308" strokeWidth="2.5" strokeDasharray="4 2" />
                    <text x="95" y="45" fill="#fef08a" fontSize="9" fontFamily="monospace">Kéo pháo vào hầm núi</text>
                    <text x="310" y="45" fill="#fef08a" fontSize="9" fontFamily="monospace">Đào chiến hào siết chặt</text>
                  </svg>
                </div>

                <p className="text-xs sm:text-sm text-emerald-100 font-sans leading-relaxed max-w-xl mx-auto">
                  <strong className="text-white font-mono uppercase text-xs block mb-0.5">Bản lĩnh người chỉ huy:</strong>
                  Kiên quyết hoãn nổ súng, lui quân về tập kết an toàn, kéo pháo vào hầm kiên cố và xây dựng trận địa vây lấn từng bước — Chắc thắng mới đánh!
                </p>

                <div className="pt-1 flex items-center justify-center">
                  <button
                    onClick={handleProceedToVerdict}
                    className="px-6 py-2.5 rounded-full bg-emerald-400 text-black font-display font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-300 transition-all cursor-pointer shadow-xl flex items-center gap-2"
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
            
            <svg viewBox="0 0 1000 600" className="w-full h-full rounded-2xl bg-[#080d12] border border-vn-gold/30 shadow-2xl">
              <defs>
                <radialGradient id="valleyNight" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#141f19" stopOpacity="0.9" />
                  <stop offset="65%" stopColor="#080d12" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#030507" stopOpacity="1" />
                </radialGradient>
              </defs>

              <rect width="1000" height="600" fill="url(#valleyNight)" />

              {/* Topographic Contour Elevation Rings */}
              <path d="M 40,60 Q 200,120 160,260 T 60,450" fill="none" stroke="#1f382a" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 80,30 Q 240,90 200,240 T 100,480" fill="none" stroke="#1f382a" strokeWidth="1.2" />
              <path d="M 960,60 Q 780,180 840,340 T 920,540" fill="none" stroke="#1f382a" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 920,30 Q 740,150 800,320 T 880,500" fill="none" stroke="#1f382a" strokeWidth="1.2" />
              <path d="M 280,70 Q 420,110 580,100 T 720,70" fill="none" stroke="#1f382a" strokeWidth="1" strokeDasharray="3 3" />

              {/* Mountain Silhouettes */}
              <path d="M 0,0 Q 250,150 120,380 T 0,600 L 0,0 Z" fill="#132018" opacity="0.75" />
              <path d="M 1000,0 Q 750,220 860,420 T 1000,600 L 1000,0 Z" fill="#132018" opacity="0.75" />

              {/* French Defense Sub-sectors (Outlines) */}
              <rect x="670" y="110" width="100" height="70" rx="8" fill="#1e1010" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
              <text x="720" y="105" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily="monospace">BÉATRICE</text>

              <rect x="330" y="55" width="100" height="60" rx="8" fill="#1e1010" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
              <text x="380" y="50" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily="monospace">GABRIELLE</text>

              <rect x="420" y="310" width="160" height="110" rx="10" fill="#20130d" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
              <text x="500" y="305" textAnchor="middle" fill="#fde68a" fontSize="10" fontFamily="monospace">PHÂN KHU TRUNG TÂM</text>

              {/* Nam Rom River */}
              <path
                d="M 500,0 Q 460,180 520,300 T 480,480 T 470,600"
                fill="none"
                stroke="#1f364d"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Mường Thanh Airfield Runway */}
              <line x1="480" y1="220" x2="480" y2="400" stroke="#4a5568" strokeWidth="12" strokeDasharray="16 8" />
              <text x="410" y="210" fill="#94a3b8" fontSize="13" fontFamily="monospace">SÂN BAY MƯỜNG THANH</text>

              {/* Living Trench Network SVG (Draws on scroll) */}
              <path
                d="M 220,120 Q 340,160 440,240 T 520,290 T 560,380 M 760,140 Q 640,200 550,260 T 490,340 M 420,440 Q 480,420 540,430"
                fill="none"
                stroke="#DA251D"
                strokeWidth="4"
                strokeDasharray="6 4"
                className="map-trench-draw drop-shadow-[0_0_8px_#DA251D]"
              />

              {/* Outpost A1 Point (Clean tactical crosshair, NO animate-ping) */}
              <g className="map-target-a1">
                <circle cx="560" cy="350" r="14" fill="none" stroke="#FFCD00" strokeWidth="1.2" opacity="0.6" />
                <circle cx="560" cy="350" r="8" fill="#DA251D" stroke="#FFCD00" strokeWidth="2" />
                <text x="560" y="330" textAnchor="middle" fill="#FFCD00" fontSize="15" fontWeight="bold" fontFamily="sans-serif">
                  ĐỒI A1
                </text>
              </g>

              {/* Outpost Him Lam */}
              <g>
                <circle cx="720" cy="150" r="7" fill="#e53e3e" stroke="#2d3748" strokeWidth="2" />
                <text x="720" y="135" textAnchor="middle" fill="#cbd5e0" fontSize="12" fontFamily="sans-serif">
                  Him Lam
                </text>
              </g>

              {/* Outpost De Castries HQ */}
              <g>
                <circle cx="500" cy="360" r="9" fill="#dd6b20" stroke="#FFCD00" strokeWidth="1.5" />
                <text x="500" y="388" textAnchor="middle" fill="#fbd38d" fontSize="12" fontFamily="sans-serif">
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
            Unified Battlefield Landscape with Reconnaissance Intel Dossiers
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
            {/* Unified 360° Battlefield Terrain Landscape (Single continuous world track) */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div 
                ref={periscopeTrackRef}
                className="h-full flex will-change-transform relative"
                style={{ width: '400%' }}
              >
                {/* Continuous Wide Battlefield Landscape Image */}
                <div className="w-1/2 h-full relative shrink-0">
                  <img
                    src="/images/exhibits/exhibit_5_1.jpg"
                    alt="Toàn cảnh chiến trường Điện Biên Phủ"
                    className="w-full h-full object-cover filter contrast-125 sepia-[0.35] brightness-[0.55]"
                    draggable={false}
                  />
                  {/* Subtle terrain atmospheric haze */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
                </div>
                <div className="w-1/2 h-full relative shrink-0">
                  <img
                    src="/images/exhibits/exhibit_5_1.jpg"
                    alt="Toàn cảnh chiến trường Điện Biên Phủ"
                    className="w-full h-full object-cover filter contrast-125 sepia-[0.35] brightness-[0.55] scale-x-[-1]"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
                </div>

                {/* Spatial Outpost Beacons Positioned Along The Landscape at exact azimuths */}
                {/* 045° Him Lam: 12.5% + (45/360)*75% = 21.875% */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none" style={{ left: '21.875%' }}>
                  <div className="w-4 h-4 rounded-full border border-red-500 bg-red-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-black/90 border border-red-500/70 text-[9px] font-mono font-bold text-red-300 mt-1 whitespace-nowrap">
                    045° HIM LAM
                  </span>
                </div>

                {/* 120° Đồi A1: 12.5% + (120/360)*75% = 37.5% */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none" style={{ left: '37.5%' }}>
                  <div className="w-4 h-4 rounded-full border border-amber-400 bg-amber-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-black/90 border border-amber-400/70 text-[9px] font-mono font-bold text-amber-300 mt-1 whitespace-nowrap">
                    120° ĐỒI A1
                  </span>
                </div>

                {/* 180° De Castries: 12.5% + (180/360)*75% = 50% */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none" style={{ left: '50%' }}>
                  <div className="w-4 h-4 rounded-full border border-red-500 bg-red-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-black/90 border border-red-500/70 text-[9px] font-mono font-bold text-red-300 mt-1 whitespace-nowrap">
                    180° HẦM DE CASTRIES
                  </span>
                </div>

                {/* 300° Trận Địa Pháo: 12.5% + (300/360)*75% = 75% */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none" style={{ left: '75%' }}>
                  <div className="w-4 h-4 rounded-full border border-emerald-400 bg-emerald-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-black/90 border border-emerald-400/70 text-[9px] font-mono font-bold text-emerald-300 mt-1 whitespace-nowrap">
                    300° TRẬN ĐỊA PHÁO
                  </span>
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
                  <circle cx="100" cy="100" r="12" fill="none" stroke="#DA251D" strokeWidth="1.2" />
                  <circle cx="100" cy="100" r="4" fill="#DA251D" />
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

            {/* Target Reconnaissance Intel Dossier Overlay directly in Lens */}
            {lockedTarget ? (
              <div 
                onClick={() => setActiveIntelTarget(lockedTarget)}
                className="absolute bottom-6 sm:bottom-8 z-30 flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#080b0f]/95 border-2 border-red-500/80 shadow-[0_0_35px_rgba(0,0,0,0.95)] max-w-sm cursor-pointer hover:scale-105 transition-transform"
              >
                {/* Archival Surveillance Photo Thumbnail */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/20">
                  <img
                    src={lockedTarget.photo}
                    alt={lockedTarget.name}
                    className="w-full h-full object-cover filter contrast-125 sepia-[0.2]"
                  />
                </div>
                <div className="text-left space-y-0.5 pr-2">
                  <div className="flex items-center gap-1.5 text-red-400 text-[9px] font-mono font-bold uppercase tracking-wider">
                    <Lock className="w-2.5 h-2.5 text-red-400" />
                    <span>KHÓA TỌA ĐỘ · {lockedTarget.azimuth}</span>
                  </div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-1">
                    {lockedTarget.name}
                  </h4>
                  <p className="text-[10px] font-mono text-vn-gold/80">
                    Khoảng cách: {lockedTarget.distance} · [Bấm xem báo cáo]
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute top-6 px-3.5 py-1 rounded-full bg-black/75 border border-white/15 text-[11px] font-mono text-vn-ivory/80 flex items-center gap-2 pointer-events-none z-30 shadow-lg">
                <MoveHorizontal className="w-3.5 h-3.5 text-vn-gold" />
                <span>← KÉO NGANG ĐỂ QUAN SÁT 360° →</span>
              </div>
            )}

          </div>

          {/* Tactical Reconnaissance Status & Outpost Quick Selector */}
          <div className="flex flex-col items-center gap-2 mt-3 z-40 max-w-xl px-2 text-center">
            <span className="text-[11px] font-mono text-vn-gold/80 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-vn-gold" />
              <span>TRINH SÁT TÁC CHIẾN · KÉO HOẶC CHỌN TỌA ĐỘ ĐỂ KHÓA MỤC TIÊU</span>
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
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
          </div>

          {/* Interaction Plateau Controls: Guided transition straight into Climax */}
          <div className="mt-3 flex flex-col sm:flex-row items-center gap-3 z-40 animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={scrollToVictory}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-vn-gold via-amber-400 to-amber-500 text-vn-black font-display font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,205,0,0.45)] hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
            >
              <span>Phát Lệnh Tổng Công Kích (17:30 · 07/05/1954) ↓</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={scrollToVictory}
              className="text-[11px] font-mono text-vn-ivory/50 hover:text-vn-gold underline transition-colors cursor-pointer"
            >
              Bỏ qua trinh sát →
            </button>
          </div>

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
