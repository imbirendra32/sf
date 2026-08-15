import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Phone } from 'lucide-react';

export function PhoneReveal({
  number,
  onRevealStart,
}: {
  number: string;
  onRevealStart?: () => void;
}) {
  const [revealed, setRevealed] = useState(0);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cbRef = useRef(onRevealStart);
  cbRef.current = onRevealStart;
  const chars = number.split('');
  const telNumber = number.replace(/[^+\d]/g, '');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setRevealed(number.length);
      cbRef.current?.();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          cbRef.current?.();
          number.split('').forEach((_, i) => {
            setTimeout(() => setRevealed(i + 1), i * 95);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [number]);

  const copy = () => {
    navigator.clipboard.writeText(telNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="phone-reveal-content" ref={ref}>
      <div className="phone-number-display">
        {chars.map((char, i) => (
          <span
            key={i}
            className={`phone-char ${i < revealed ? 'is-revealed' : ''}`}
          >
            {char}
          </span>
        ))}
      </div>
      <div className={`phone-actions ${revealed >= chars.length ? 'is-visible' : ''}`}>
        <a href={`tel:${telNumber}`} className="phone-action">
          <Phone size={15} /> <span>Call</span>
        </a>
        <button onClick={copy} className="phone-action">
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}
