import React, { useRef, useState, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, Flip, useGSAP } from '../lib/gsap';
import { soundSynth } from '../utils/soundSynth';
import ContinuityRedElement from './ContinuityRedElement';
import LabHeroScene from './LabHeroScene';
import LabDesk1930Scene from './LabDesk1930Scene';
import LabWarMap1954Scene from './LabWarMap1954Scene';
import { ArrowLeft, Sparkles, Activity, Layers, Compass } from 'lucide-react';

/**
 * MOTION LAB PROTOTYPE (THE 3-SCENE WOW PROVING GROUND)
 * Thực nghiệm 3 nguyên lý tối thượng trích xuất từ publist_repo.md:
 * 1. ONE-ELEMENT-SCROLL (GSAP Flip): Một nét đỏ duy nhất sống xuyên 3 world (Hero -> Desk 1930 -> War Map 1954).
 * 2. CINEMATIC 3D & DEPTH: Camera dive và texture morph thực sự giữa các world.
 * 3. BASEMENT TIMELINE ARCHITECTURE: Toàn bộ trải nghiệm là 1 master timeline đồng bộ hóa.
 */
export default function MotionLabPrototype() {
  const containerRef = useRef(null);
  const continuityElementRef = useRef(null);
  const heroCameraRef = useRef(null);
  const deskCameraRef = useRef(null);
  const mapCameraRef = useRef(null);

  // Live HUD telemetry
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [activeSceneName, setActiveSceneName] = useState('01. HERO PARCHMENT');
  const [continuityMode, setContinuityMode] = useState('nib');

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const updateLenis = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  // Master GSAP Timeline across normalized [0, 1] scroll space
  useGSAP(
    () => {
      const q = gsap.utils.selector(containerRef);
      const livingObj = continuityElementRef.current;
      const heroCam = heroCameraRef.current;
      const deskCam = deskCameraRef.current;
      const mapCam = mapCameraRef.current;

      const sceneHero = q('.lab-scene-hero')[0];
      const sceneDesk = q('.lab-scene-desk')[0];
      const sceneMap = q('.lab-scene-map')[0];

      // Initial Scene Visibility
      gsap.set(sceneHero, { opacity: 1, pointerEvents: 'auto' });
      gsap.set(sceneDesk, { opacity: 0, pointerEvents: 'none' });
      gsap.set(sceneMap, { opacity: 0, pointerEvents: 'none' });

      // Gather waypoints
      const heroNibStep = q('[data-step="hero-nib"]')[0];
      const heroUnderlineStep = q('[data-step="hero-underline"]')[0];
      const heroPortalStep = q('[data-step="hero-portal"]')[0];
      const deskSealStep = q('[data-step="desk-seal-stamp"]')[0];
      const deskBleedStep = q('[data-step="desk-bleed-line"]')[0];
      const mapTrenchStep = q('[data-step="map-trench-stream"]')[0];

      // Initial placement of living continuity object onto hero nib waypoint
      if (heroNibStep && livingObj) {
        Flip.fit(livingObj, heroNibStep, { duration: 0 });
      }

      // Master Timeline: 550vh of continuous scroll
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
          onUpdate: (self) => {
            const p = self.progress;
            setTimelineProgress(Math.round(p * 100));

            // Dynamic Phase Management
            if (p < 0.33) {
              setActiveSceneName('01. KHỞI NGUYÊN NÉT MỰC (HERO)');
              if (p < 0.12) {
                setContinuityMode('nib');
              } else if (p >= 0.12 && p < 0.24) {
                setContinuityMode('underline');
              } else {
                setContinuityMode('flood');
              }
            } else if (p >= 0.33 && p < 0.66) {
              setActiveSceneName('02. BÀN LỊCH SỬ CỬU LONG (1930)');
              if (p < 0.52) {
                setContinuityMode('seal');
              } else {
                setContinuityMode('bleed');
              }

              // Sound thud trigger on stamp impact
              if (p > 0.40 && p < 0.46 && !self._labStampThud) {
                try { soundSynth.playStampThud(); } catch (e) {}
                self._labStampThud = true;
              } else if (p < 0.38) {
                self._labStampThud = false;
              }
            } else {
              setActiveSceneName('03. SA BÀN CHIẾN DỊCH (1954)');
              setContinuityMode('trench');
            }
          }
        }
      });

      // =======================================================================
      // PHASE 1: HERO SCENE (0.00 -> 0.33)
      // Living red element draws underline, then camera dives deeply into ink
      // =======================================================================
      if (heroUnderlineStep && livingObj) {
        master.to(
          {},
          {
            duration: 0.12,
            onStart: () => {
              Flip.fit(livingObj, heroUnderlineStep, {
                duration: 0.6,
                ease: 'power2.out',
              });
            }
          },
          0.05
        );
      }

      // Camera Dive: Hero stage zooms 4.8x and tilts in 3D
      master.to(
        heroCam,
        {
          scale: 4.8,
          rotateX: 25,
          z: 300,
          ease: 'power2.in',
          duration: 0.14,
        },
        0.18
      );

      // Ink Flood covers screen and transitions to Desk 1930
      master.to(sceneHero, { opacity: 0, pointerEvents: 'none', duration: 0.05 }, 0.30);
      master.to(sceneDesk, { opacity: 1, pointerEvents: 'auto', duration: 0.06 }, 0.30);

      // =======================================================================
      // PHASE 2: 1930 DESK SCENE (0.33 -> 0.66)
      // Living red element FLIPS directly onto manuscript as the Red Seal Stamp!
      // =======================================================================
      master.fromTo(
        deskCam,
        { scale: 0.88, y: 30 },
        { scale: 1.04, y: 0, ease: 'power1.out', duration: 0.18 },
        0.30
      );

      if (deskSealStep && livingObj) {
        master.to(
          {},
          {
            duration: 0.12,
            onStart: () => {
              Flip.fit(livingObj, deskSealStep, {
                duration: 0.5,
                ease: 'back.out(1.7)',
              });
            }
          },
          0.38
        );
      }

      // Screen shake on seal stamp impact
      master.to(deskCam, { y: -12, duration: 0.03, yoyo: true, repeat: 3 }, 0.41);

      // Red ink bleeds towards desk edge
      if (deskBleedStep && livingObj) {
        master.to(
          {},
          {
            duration: 0.10,
            onStart: () => {
              Flip.fit(livingObj, deskBleedStep, {
                duration: 0.6,
                ease: 'power2.inOut',
              });
            }
          },
          0.54
        );
      }

      // Camera glides off desk edge into darkness
      master.to(deskCam, { scale: 1.25, y: -80, opacity: 0, duration: 0.08 }, 0.60);
      master.to(sceneDesk, { opacity: 0, pointerEvents: 'none', duration: 0.04 }, 0.64);

      // =======================================================================
      // PHASE 3: 1954 WAR MAP SCENE (0.66 -> 1.00)
      // Living red element flows into the valley and morphs into concentric siege trenches!
      // =======================================================================
      master.to(sceneMap, { opacity: 1, pointerEvents: 'auto', duration: 0.06 }, 0.64);
      master.fromTo(
        mapCam,
        { scale: 0.85, opacity: 0 },
        { scale: 1.0, opacity: 1, ease: 'power2.out', duration: 0.15 },
        0.66
      );

      if (mapTrenchStep && livingObj) {
        master.to(
          {},
          {
            duration: 0.16,
            onStart: () => {
              Flip.fit(livingObj, mapTrenchStep, {
                duration: 0.8,
                ease: 'power3.out',
              });
            }
          },
          0.72
        );
      }

      // Final camera push into De Castries & A1
      master.to(
        mapCam,
        {
          scale: 1.35,
          transformOrigin: '50% 60%',
          ease: 'power1.inOut',
          duration: 0.16,
        },
        0.84
      );

      master.to({}, { duration: 1.0 }, 0);
    },
    { scope: containerRef }
  );

  return (
    <div className="relative bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* =====================================================================
          1. THE LIVING CONTINUITY RED ELEMENT (Fixed across entire prototype)
         ===================================================================== */}
      <ContinuityRedElement 
        ref={continuityElementRef} 
        mode={continuityMode} 
        progress={timelineProgress} 
      />

      {/* =====================================================================
          2. FLOATING MOTION LAB TELEMETRY HUD (Developer & Evaluator Panel)
         ===================================================================== */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        
        {/* Back to main production website */}
        <a
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/85 border border-white/20 text-xs font-mono text-white/90 hover:text-vn-gold hover:border-vn-gold transition-all shadow-2xl backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-vn-gold" />
          <span>Về Bản Chính Triển Lãm VNR</span>
        </a>

        {/* Live Telemetry Display */}
        <div className="hidden md:flex items-center gap-4 px-5 py-2 rounded-full bg-black/90 border border-vn-gold/50 shadow-2xl backdrop-blur-md pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-vn-gold font-bold">
            <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>MOTION LAB PROTOTYPE</span>
          </div>

          <div className="w-[1px] h-4 bg-white/20" />

          <div className="text-[11px] font-mono text-white/80">
            SCENE: <strong className="text-white">{activeSceneName}</strong>
          </div>

          <div className="w-[1px] h-4 bg-white/20" />

          <div className="text-[11px] font-mono text-white/80">
            OBJECT STATE: <span className="text-red-400 font-bold uppercase">[{continuityMode}]</span>
          </div>

          <div className="w-[1px] h-4 bg-white/20" />

          <div className="text-xs font-mono font-bold text-vn-gold">
            {timelineProgress}%
          </div>
        </div>

        {/* Badge */}
        <div className="px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-300 text-[11px] font-mono font-bold uppercase tracking-wider shadow-lg">
          3-SCENE CONTINUITY
        </div>
      </header>

      {/* Progress Bar at very top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-red-600 transition-all duration-75"
          style={{ width: `${timelineProgress}%` }}
        />
      </div>

      {/* =====================================================================
          3. MASTER SCROLL CONTAINER (550vh normalized scroll space)
         ===================================================================== */}
      <div ref={containerRef} className="relative h-[550vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* SCENE 01: HERO */}
          <div className="lab-scene-hero absolute inset-0 z-10">
            <LabHeroScene cameraRef={heroCameraRef} />
          </div>

          {/* SCENE 02: 1930 DESK */}
          <div className="lab-scene-desk absolute inset-0 z-20">
            <LabDesk1930Scene deskCameraRef={deskCameraRef} />
          </div>

          {/* SCENE 03: 1954 WAR MAP */}
          <div className="lab-scene-map absolute inset-0 z-30">
            <LabWarMap1954Scene mapCameraRef={mapCameraRef} />
          </div>

        </div>
      </div>

      {/* Footer Conclusion note */}
      <div className="relative z-40 bg-[#07090c] py-16 px-6 text-center border-t border-vn-gold/20">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-vn-charcoal border border-vn-gold/40 text-vn-gold text-[10px] font-mono font-bold uppercase tracking-widest">
            KẾT THÚC PROTOTYPE 3 SCENE
          </span>
          <h3 className="font-display font-black text-2xl sm:text-4xl text-white">
            Nghiệm Thu Tính Liên Tục Của Chuyển Động
          </h3>
          <p className="text-sm text-vn-ivory/70 leading-relaxed font-light">
            Bạn vừa trải nghiệm 1 thực thể đỏ sống xuyên suốt từ đầu cọ thư pháp của Hero, rơi xuống làm con dấu son trên bản Cương lĩnh 1930, rồi nở rộ thành mạng lưới chiến hào siết chặt Điện Biên Phủ 1954 trên một timeline duy nhất.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <a
              href="/"
              className="px-6 py-2.5 rounded-full bg-vn-gold text-black font-display font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl"
            >
              Về Lại Trải Nghiệm Toàn Diện VNR →
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
