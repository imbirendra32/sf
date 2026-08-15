import { useRef, useState, type ReactNode } from 'react';

export function TiltCard({
  children,
  className = '',
  max = 10,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateZ(10px)`
    );
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ transform }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTransform('')}
    >
      {children}
    </div>
  );
}
