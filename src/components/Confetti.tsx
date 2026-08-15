import { useEffect, useRef } from 'react';

const COLORS = ['#e56a4e', '#c9a84c', '#e8c5d0', '#f4f0e8', '#c45c7c', '#e8a5a0', '#d4847a'];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  life: number;
};

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let particles: Particle[] = [];
    let raf = 0;

    const burst = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.32;
      for (let i = 0; i < 130; i++) {
        const angle = (Math.PI * 2 * i) / 130 + Math.random() * 0.4;
        const speed = 3 + Math.random() * 8;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: 4 + Math.random() * 7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * 360,
          vr: (Math.random() - 0.5) * 14,
          life: 1,
        });
      }
      animate();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.life > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.14;
        p.vx *= 0.99;
        p.rotation += p.vr;
        p.life -= 0.007;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
        ctx.restore();
      }
      if (particles.length > 0) {
        raf = requestAnimationFrame(animate);
      }
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered.current) {
          triggered.current = true;
          if (reduced) {
            ctx.fillStyle = COLORS[0];
            for (let i = 0; i < 40; i++) {
              ctx.globalAlpha = 0.3 + Math.random() * 0.4;
              ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height * 0.6, 5, 3);
            }
            ctx.globalAlpha = 1;
          } else {
            burst();
          }
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
