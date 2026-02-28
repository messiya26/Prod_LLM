"use client";

const notes = ["\u266A", "\u266B", "\u266C", "\u2669", "\ud83c\udfb5", "\ud83c\udfb6", "\ud83c\udfa4", "\ud83c\udfb9"];

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  note: notes[i % notes.length],
  left: (((i * 23 + 5) * 41) % 100),
  delay: (i * 1.1) % 8,
  duration: 8 + ((i * 4) % 12),
  size: 14 + ((i * 6) % 20),
}));

export function MusicParticles({ count = 10 }: { count?: number }) {
  const particles = PARTICLES.slice(0, count);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <span key={p.id} className="absolute bottom-0 animate-music-note opacity-0" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, fontSize: `${p.size}px` }}>
          {p.note}
        </span>
      ))}
    </div>
  );
}
