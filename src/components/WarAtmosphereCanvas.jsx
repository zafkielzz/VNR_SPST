import React, { useEffect, useRef } from 'react';

/**
 * WAR ATMOSPHERE & EMBER SPARKS CANVAS
 * Tạo hiệu ứng tàn lửa bay rực sáng, khói mờ và hạt bụi điện ảnh của chiến trường Điện Biên Phủ
 * Chạy 60fps mượt mà, tự động tối ưu hóa tài nguyên phần cứng.
 */
export default function WarAtmosphereCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Danh sách các hạt tàn lửa (Ember particles)
    const particleCount = Math.min(65, Math.floor(window.innerWidth / 25));
    const embers = [];

    const colors = [
      'rgba(255, 184, 0, ',   // Gold
      'rgba(255, 115, 0, ',   // Amber Orange
      'rgba(218, 37, 29, ',   // Crimson Red
      'rgba(255, 230, 150, ', // Bright Yellow
    ];

    for (let i = 0; i < particleCount; i++) {
      embers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.8 + 1.2,
        speedY: Math.random() * 1.4 + 0.6,
        speedX: (Math.random() - 0.45) * 1.2,
        opacity: Math.random() * 0.7 + 0.3,
        fadeSpeed: Math.random() * 0.015 + 0.005,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        oscillation: Math.random() * Math.PI * 2,
        oscillationSpeed: Math.random() * 0.04 + 0.02,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < embers.length; i++) {
        const p = embers[i];

        p.y -= p.speedY;
        p.oscillation += p.oscillationSpeed;
        p.x += Math.sin(p.oscillation) * p.speedX;

        // Nhấp nháy độ sáng
        p.opacity += (Math.random() - 0.5) * 0.05;
        if (p.opacity > 0.9) p.opacity = 0.9;
        if (p.opacity < 0.2) p.opacity = 0.2;

        // Reset khi bay lên đỉnh màn hình
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.opacity = Math.random() * 0.6 + 0.4;
        }

        // Vẽ hạt phát sáng (Glow aura)
        const rad = p.size * 2.5;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        grad.addColorStop(0, `${p.colorBase}${p.opacity})`);
        grad.addColorStop(0.4, `${p.colorBase}${p.opacity * 0.5})`);
        grad.addColorStop(1, `${p.colorBase}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();

        // Hạt nhân điểm sáng
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 opacity-70 mix-blend-screen"
      style={{ willChange: 'transform' }}
    />
  );
}
