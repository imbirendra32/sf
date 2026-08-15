import { useMemo } from 'react';

const PETAL_COLORS = ['#e56a4e', '#e8a5a0', '#d4847a', '#c45c7c', '#e8c5d0', '#f0b8a8'];

type PetalData = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  sway: number;
  rotate: number;
};

export function Petals({ count = 14 }: { count?: number }) {
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const petals = useMemo<PetalData[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 7 + Math.random() * 12,
        delay: Math.random() * 14,
        duration: 9 + Math.random() * 12,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        sway: (Math.random() - 0.5) * 180,
        rotate: Math.random() * 360,
      })),
    [count]
  );

  if (reduced) return null;

  return (
    <div className="petals-layer" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--sway': `${p.sway}px`,
              '--rotate': `${p.rotate}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
