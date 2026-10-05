import React, { useEffect, useRef } from 'react';

/**
 * WAR ATMOSPHERE & EMBER SPARKS CANVAS
 * Tạo hiệu ứng tàn lửa bay rực sáng, khói mờ và hạt bụi điện ảnh của chiến trường Điện Biên Phủ
 * ĐÃ TỐI ƯU HÓA THEO CHƯƠNG (SCENE-CONTEXTUAL ATMOSPHERE):
 * - Chỉ bùng cháy rực rỡ khi bước vào chương Điện Biên Phủ 1954 (#cascade-dien-bien -> #m-1954-thang-loi)
 * - Tự động tan biến êm dịu khi bước sang các thời kỳ hòa bình (1975, 1986, Khu khảo cứu & Bảo tàng)
 * - Tự động tắt vẽ khi độ mờ = 0 để tiết kiệm 100% tài nguyên CPU/GPU.
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

    // Danh sách các hạt tàn lửa chiến trường
    const particleCount = Math.min(55, Math.floor(window.innerWidth / 30));
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
        speedY: Math.random() * 1.5 + 0.6,
        speedX: (Math.random() - 0.45) * 1.2,
        opacity: Math.random() * 0.7 + 0.3,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        oscillation: Math.random() * Math.PI * 2,
        oscillationSpeed: Math.random() * 0.04 + 0.02,
      });
    }

    // Contextual Alpha tracking
    let currentGlobalAlpha = 0;
    let targetGlobalAlpha = 0;

    const warSectionIds = [
      'dien-bien-1954',
      'cascade-dien-bien',
      'm-1954-quyet-dinh',
      'decision-tree',
      'sa-ban-chien-dich',
      'kinh-tiem-vong-chien-hao',
      'm-1954-thang-loi'
    ];

    const checkAtmosphere = () => {
      let inWarZone = false;
      const vh = window.innerHeight;
      for (const id of warSectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < vh * 0.9 && rect.bottom > vh * 0.1) {
            inWarZone = true;
            break;
          }
        }
      }
      targetGlobalAlpha = inWarZone ? 0.85 : 0;
    };

    window.addEventListener('scroll', checkAtmosphere, { passive: true });
    checkAtmosphere();

    const render = () => {
      // Smooth alpha transition between peace and war
      currentGlobalAlpha += (targetGlobalAlpha - currentGlobalAlpha) * 0.06;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentGlobalAlpha > 0.01) {
        ctx.globalAlpha = currentGlobalAlpha;

        for (let i = 0; i < embers.length; i++) {
          const p = embers[i];

          p.y -= p.speedY;
          p.oscillation += p.oscillationSpeed;
          p.x += Math.sin(p.oscillation) * p.speedX;

          // Flicker
          p.opacity += (Math.random() - 0.5) * 0.05;
          if (p.opacity > 0.95) p.opacity = 0.95;
          if (p.opacity < 0.2) p.opacity = 0.2;

          // Reset to bottom
          if (p.y < -15) {
            p.y = canvas.height + 15;
            p.x = Math.random() * canvas.width;
            p.opacity = Math.random() * 0.6 + 0.4;
          }

          // Glow aura
          const rad = p.size * 2.6;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
          grad.addColorStop(0, `${p.colorBase}${p.opacity})`);
          grad.addColorStop(0.4, `${p.colorBase}${p.opacity * 0.5})`);
          grad.addColorStop(1, `${p.colorBase}0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          ctx.fill();

          // Core spark
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.9})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', checkAtmosphere);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 mix-blend-screen transition-opacity duration-700"
      style={{ willChange: 'transform' }}
    />
  );
}
