import React, { useEffect, useRef } from 'react';
import { useExperience } from '../context/ExperienceContext';

/**
 * ATMOSPHERE DIRECTOR (V3 HIGH-PERFORMANCE ENGINE)
 * Điều phối bầu không khí thị giác theo từng thời kỳ lịch sử:
 * - paperDust: Bụi sợi giấy ngà cổ kính cho InkHero
 * - dust: Hạt bụi lưu trữ ấm màu hổ phách cho Bàn tài liệu 1930
 * - mist: Làn sương mờ núi rừng Pác Bó 1941
 * - filmDust: Hạt phim tài liệu 35mm Ba Đình 1945
 * - smoke: Làn khói lan tỏa đêm Toàn quốc kháng chiến 1946
 * - ember: Tàn lửa bùng cháy dữ dội duy nhất ở chiến trường Điện Biên 1954
 * - clean: Không gian trong trẻo, ánh sáng xanh hiện đại cho Đổi mới 1986
 * - none: Tắt hoàn toàn 0% opacity VÀ PAUSE RAF LOOP (tiết kiệm 100% CPU/GPU)
 * 
 * Tối ưu hóa:
 * 1. Tự động tạm dừng RAF khi tab chạy ngầm (document.hidden)
 * 2. Tự động dừng RAF khi mode === 'none' và alpha < 0.005
 */
export default function AtmosphereDirector() {
  const canvasRef = useRef(null);
  const { atmosphereMode } = useExperience();

  // Accessibility: In prefers-reduced-motion mode, completely disable canvas particle simulation
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let isLoopRunning = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Dynamic particles pool
    const count = Math.min(50, Math.floor(window.innerWidth / 35));
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1.0,
        speedY: Math.random() * 1.2 + 0.4,
        speedX: (Math.random() - 0.5) * 1.0,
        opacity: Math.random() * 0.7 + 0.3,
        oscillation: Math.random() * Math.PI * 2,
        oscillationSpeed: Math.random() * 0.03 + 0.015,
      });
    }

    // Pre-rendered offscreen sprites to eliminate runtime createRadialGradient per frame
    const createOffscreenSprite = (size, drawFn) => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = size;
      offCanvas.height = size;
      const offCtx = offCanvas.getContext('2d');
      drawFn(offCtx, size);
      return offCanvas;
    };

    const emberSprite = createOffscreenSprite(32, (c, s) => {
      const half = s / 2;
      const g = c.createRadialGradient(half, half, 0, half, half, half);
      g.addColorStop(0, 'rgba(255, 235, 180, 1.0)');
      g.addColorStop(0.35, 'rgba(255, 120, 0, 0.85)');
      g.addColorStop(0.7, 'rgba(218, 37, 29, 0.4)');
      g.addColorStop(1, 'rgba(218, 37, 29, 0)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(half, half, half, 0, Math.PI * 2);
      c.fill();
    });

    const cleanSprite = createOffscreenSprite(32, (c, s) => {
      const half = s / 2;
      const g = c.createRadialGradient(half, half, 0, half, half, half);
      g.addColorStop(0, 'rgba(224, 242, 254, 1.0)');
      g.addColorStop(0.4, 'rgba(56, 189, 248, 0.75)');
      g.addColorStop(1, 'rgba(14, 165, 233, 0)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(half, half, half, 0, Math.PI * 2);
      c.fill();
    });

    const smokeSprite = createOffscreenSprite(64, (c, s) => {
      const half = s / 2;
      const g = c.createRadialGradient(half, half, 0, half, half, half);
      g.addColorStop(0, 'rgba(200, 100, 80, 0.25)');
      g.addColorStop(0.55, 'rgba(120, 60, 50, 0.10)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(half, half, half, 0, Math.PI * 2);
      c.fill();
    });

    let currentAlpha = 0;

    const startLoop = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        render();
      }
    };

    const stopLoop = () => {
      if (isLoopRunning) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        isLoopRunning = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const render = () => {
      // If tab is in background, do nothing
      if (document.hidden) {
        stopLoop();
        return;
      }

      const mode = atmosphereMode || 'none';
      const targetAlpha = mode === 'none' ? 0 : 0.85;
      currentAlpha += (targetAlpha - currentAlpha) * 0.06;

      // If mode is none and alpha has decayed near 0, halt RAF to save 100% CPU/GPU!
      if (mode === 'none' && currentAlpha < 0.005) {
        currentAlpha = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stopLoop();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentAlpha > 0.005) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.oscillation += p.oscillationSpeed;

          // Render based on mode
          if (mode === 'ember') {
            // Dien Bien 1954 War Ember Sparks (flying upward)
            p.y -= p.speedY * 1.4;
            p.x += Math.sin(p.oscillation) * p.speedX * 1.2;

            if (p.y < -15) {
              p.y = canvas.height + 15;
              p.x = Math.random() * canvas.width;
            }

            const rad = p.size * 2.5;
            ctx.globalAlpha = currentAlpha * p.opacity;
            ctx.drawImage(emberSprite, p.x - rad, p.y - rad, rad * 2, rad * 2);
          } else if (mode === 'paperDust') {
            // Ancient ivory paper fibers
            p.y += p.speedY * 0.4;
            p.x += Math.sin(p.oscillation) * 0.5;

            if (p.y > canvas.height + 15) {
              p.y = -15;
              p.x = Math.random() * canvas.width;
            }

            ctx.globalAlpha = currentAlpha * p.opacity * 0.35;
            ctx.fillStyle = '#b4a082';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
          } else if (mode === 'clean') {
            // Modern azure sparkles for 1986 Đổi mới
            p.y -= p.speedY * 0.5;
            p.x += Math.cos(p.oscillation) * 0.6;

            if (p.y < -15) {
              p.y = canvas.height + 15;
              p.x = Math.random() * canvas.width;
            }

            const rad = p.size * 2;
            ctx.globalAlpha = currentAlpha * p.opacity * 0.8;
            ctx.drawImage(cleanSprite, p.x - rad, p.y - rad, rad * 2, rad * 2);
          } else if (mode === 'smoke') {
            // 1946 Night Telegram Smoke (soft, larger, drifting slowly)
            p.y -= p.speedY * 0.35;
            p.x += Math.sin(p.oscillation) * 0.8;

            if (p.y < -25) {
              p.y = canvas.height + 25;
              p.x = Math.random() * canvas.width;
            }

            const smokeRadius = p.size * 4;
            ctx.globalAlpha = currentAlpha * p.opacity;
            ctx.drawImage(smokeSprite, p.x - smokeRadius, p.y - smokeRadius, smokeRadius * 2, smokeRadius * 2);
          } else {
            // Soft archival dust (mode: dust, mist, filmDust)
            p.y -= p.speedY * 0.6;
            p.x += Math.sin(p.oscillation) * p.speedX * 0.8;

            if (p.y < -15) {
              p.y = canvas.height + 15;
              p.x = Math.random() * canvas.width;
            }

            ctx.globalAlpha = currentAlpha * p.opacity * 0.25;
            ctx.fillStyle = '#e6c896';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Tab visibility handling
    const handleVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Initial trigger
    startLoop();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      stopLoop();
    };
  }, [atmosphereMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 mix-blend-screen transition-opacity duration-700"
      style={{ willChange: 'transform' }}
    />
  );
}
