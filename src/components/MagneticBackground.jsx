import React, { useEffect, useRef } from 'react';

export default function MagneticBackground({ currentStage = 1, scrollProgress = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = (canvas.width = window.innerWidth || 1280);
      let height = (canvas.height = window.innerHeight || 800);

      const handleResize = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth || 1280;
        height = canvas.height = window.innerHeight || 800;
      };
      window.addEventListener('resize', handleResize);

      const mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5, isHovering: false };
      const handleMouseMove = (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        mouse.isHovering = true;
      };
      const handleMouseLeave = () => {
        mouse.isHovering = false;
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);

      const PARTICLE_COUNT = 60;
      const particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          length: 15 + Math.random() * 20,
          phase: Math.random() * Math.PI * 2,
          speed: 0.015 + Math.random() * 0.02,
          seed: Math.random(),
        });
      }

      let time = 0;

      const stageColors = [
        { primary: 'rgba(0, 242, 254, 0.4)', secondary: 'rgba(16, 185, 129, 0.2)', glow: '#00f2fe' },
        { primary: 'rgba(244, 63, 94, 0.4)', secondary: 'rgba(245, 158, 11, 0.2)', glow: '#f43f5e' },
        { primary: 'rgba(56, 189, 248, 0.4)', secondary: 'rgba(129, 140, 248, 0.2)', glow: '#38bdf8' },
        { primary: 'rgba(139, 92, 246, 0.4)', secondary: 'rgba(59, 130, 246, 0.2)', glow: '#8b5cf6' },
        { primary: 'rgba(236, 72, 153, 0.4)', secondary: 'rgba(0, 242, 254, 0.2)', glow: '#ec4899' },
      ];

      const render = () => {
        try {
          time += 0.015;
          mouse.x += (mouse.targetX - mouse.x) * 0.05;
          mouse.y += (mouse.targetY - mouse.y) * 0.05;

          ctx.fillStyle = 'rgba(6, 8, 13, 0.3)';
          ctx.fillRect(0, 0, width, height);

          const stageIdx = Math.max(0, Math.min(4, Math.floor(scrollProgress * 5)));
          const palette = stageColors[stageIdx] || stageColors[0];

          particles.forEach((p) => {
            p.phase += p.speed;

            let angle = 0;
            const cx = width * 0.5;
            const cy = height * 0.5;
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (stageIdx === 0) {
              angle = Math.atan2(dy, dx) + Math.PI / 2 + Math.sin(dist * 0.008 - time) * 0.5;
            } else if (stageIdx === 1) {
              angle = Math.sin(p.x * 0.005 + time) * 2 + Math.cos(p.y * 0.005 - time) * 2;
            } else if (stageIdx === 2) {
              angle = Math.cos(p.y * 0.01 + time * 1.5) * 1.2 + Math.sin(p.x * 0.008) * 0.8;
            } else if (stageIdx === 3) {
              angle = Math.atan2(dy, dx) + (dist < 260 ? Math.PI * 0.7 : Math.PI * 0.1);
            } else {
              const gridCell = (Math.floor(p.x / 80) + Math.floor(p.y / 80)) % 2;
              angle = gridCell === 0 ? Math.PI * 0.25 + time * 0.5 : Math.PI * 1.25 - time * 0.5;
            }

            if (mouse.isHovering) {
              const mdx = p.x - mouse.x;
              const mdy = p.y - mouse.y;
              const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mDist < 220) {
                const mForce = (1 - mDist / 220) * 1.5;
                angle += Math.atan2(mdy, mdx) * mForce;
              }
            }

            p.x += Math.cos(angle) * 1.2;
            p.y += Math.sin(angle) * 1.2;

            if (p.x < -30) p.x = width + 20;
            if (p.x > width + 30) p.x = -20;
            if (p.y < -30) p.y = height + 20;
            if (p.y > height + 30) p.y = -20;

            const tailX = p.x - Math.cos(angle) * p.length;
            const tailY = p.y - Math.sin(angle) * p.length;

            const grad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.7, p.seed > 0.4 ? palette.primary : palette.secondary);
            grad.addColorStop(1, '#ffffff');

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          });

          animationFrameId = requestAnimationFrame(render);
        } catch (rErr) {
          console.warn('Canvas render error:', rErr);
        }
      };

      render();

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        cancelAnimationFrame(animationFrameId);
      };
    } catch (err) {
      console.warn('MagneticBackground initialization failed:', err);
    }
  }, [scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
