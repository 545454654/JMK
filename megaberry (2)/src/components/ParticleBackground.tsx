import React, { useMemo } from 'react';

export const ParticleBackground: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const left = Math.random() * 95;
      const size = 1.5 + Math.random() * 2.8;
      const opacity = 0.2 + Math.random() * 0.45;
      const duration = 18 + Math.random() * 18;
      const delay = -Math.random() * 25;
      const blur = Math.random() * 0.6;
      return { id: i, left, size, opacity, duration, delay, blur };
    });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-[-20px] rounded-full animate-float-up"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'rgb(199, 125, 255)',
            boxShadow: `0 0 ${p.size * 2 + 3}px rgba(199, 125, 255, 0.6)`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: `blur(${p.blur}px)`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
};
