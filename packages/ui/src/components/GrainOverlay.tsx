// SVG turbulence grain at z-index 1, blend overlay — warmth layer over the dark bg
export const GrainOverlay = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0"
    style={{ zIndex: 1, opacity: 0.07, mixBlendMode: "overlay" }}
  >
    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="lulu-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#lulu-grain)" />
    </svg>
  </div>
);
