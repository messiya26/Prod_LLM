"use client";

const symbols = ["\u2727", "\u2726", "\u2605", "\u2736", "\u00B7"];

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  symbol: symbols[i % symbols.length],
  x: (((i * 17 + 3) * 37) % 100),
  y: (((i * 31 + 7) * 53) % 100),
  delay: (i * 0.7) % 5,
  duration: 8 + ((i * 3) % 12),
  size: 8 + ((i * 5) % 14),
}));

export function FloatingParticles({ count = 8 }: { count?: number }) {
  const particles = PARTICLES.slice(0, count);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-gold/15 animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
