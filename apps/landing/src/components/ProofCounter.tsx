'use client';

import { useEffect, useRef, useState } from 'react';

// Hardcoded mock data to seed social proof
const MOCK_DATA = {
  total: 847,
  topCities: [
    { city: 'bangalore', count: 247 },
    { city: 'mumbai', count: 181 }
  ]
};

export function ProofCounter() {
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedCities, setAnimatedCities] = useState<number[]>([0, 0]);
  const hasAnimated = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Animate tick-up when component enters viewport
  useEffect(() => {
    if (hasAnimated.current) return;
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateTickUp();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  function animateTickUp() {
    const duration = 1200;
    const startTime = performance.now();
    const targetTotal = MOCK_DATA.total;
    const targetCities = MOCK_DATA.topCities.map((c) => c.count);

    function frame(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic

      setAnimatedTotal(Math.round(targetTotal * eased));
      setAnimatedCities(targetCities.map((c) => Math.round(c * eased)));

      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  return (
    <>
      <style>{`
        @keyframes proof-pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; box-shadow: 0 0 0 0 rgba(184, 118, 26, 0.4); }
          70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 4px rgba(184, 118, 26, 0); }
          100% { transform: scale(0.8); opacity: 0.8; box-shadow: 0 0 0 0 rgba(184, 118, 26, 0); }
        }
      `}</style>
      <div
        ref={wrapperRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '12px',
          marginBottom: '4px',
          fontFamily: "'Switzer', sans-serif",
          fontSize: '13px',
          color: 'rgba(15, 13, 11, 0.55)',
          letterSpacing: '0.01em',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#B8761A',
            flexShrink: 0,
            animation: 'proof-pulse-ring 2s infinite',
          }}
          aria-hidden
        />
        <span>
          <span style={{ color: '#B8761A', fontWeight: 600 }}>
            {animatedCities[0]?.toLocaleString()}
          </span>{' '}
          in {MOCK_DATA.topCities[0].city}.{' '}
          <span style={{ color: '#B8761A', fontWeight: 600 }}>
            {animatedCities[1]?.toLocaleString()}
          </span>{' '}
          in {MOCK_DATA.topCities[1].city}.{' '}
          <span style={{ fontStyle: 'italic', opacity: 0.7 }}>and counting.</span>
        </span>
      </div>
    </>
  );
}
