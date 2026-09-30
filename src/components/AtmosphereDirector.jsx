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
        ctx.globalAlpha = currentAlpha;

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
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
            grad.addColorStop(0, `rgba(255, 120, 0, ${p.opacity})`);
            grad.addColorStop(0.5, `rgba(218, 37, 29, ${p.opacity * 0.5})`);
            grad.addColorStop(1, 'rgba(218, 37, 29, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
            ctx.fill();

            // Bright core
            ctx.fillStyle = `rgba(255, 235, 180, ${p.opacity * 0.9})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
          } else if (mode === 'paperDust') {
            // Ancient ivory paper fibers
            p.y += p.speedY * 0.4;
            p.x += Math.sin(p.oscillation) * 0.5;

            if (p.y > canvas.height + 15) {
              p.y = -15;
              p.x = Math.random() * canvas.width;
            }

            ctx.fillStyle = `rgba(180, 160, 130, ${p.opacity * 0.35})`;
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
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
            grad.addColorStop(0, `rgba(56, 189, 248, ${p.opacity * 0.8})`);
            grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
            ctx.fill();
          } else if (mode === 'smoke') {
            // 1946 Night Telegram Smoke (soft, larger, drifting slowly)
            p.y -= p.speedY * 0.35;
            p.x += Math.sin(p.oscillation) * 0.8;

            if (p.y < -25) {
              p.y = canvas.height + 25;
              p.x = Math.random() * canvas.width;
            }

            const smokeRadius = p.size * 4;
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, smokeRadius);
            grad.addColorStop(0, `rgba(200, 100, 80, ${p.opacity * 0.18})`);
            grad.addColorStop(0.6, `rgba(120, 60, 50, ${p.opacity * 0.08})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, smokeRadius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Soft archival dust (mode: dust, mist, filmDust)
            p.y -= p.speedY * 0.6;
            p.x += Math.sin(p.oscillation) * p.speedX * 0.8;

            if (p.y < -15) {
              p.y = canvas.height + 15;
              p.x = Math.random() * canvas.width;
            }

            ctx.fillStyle = `rgba(230, 200, 150, ${p.opacity * 0.25})`;
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
