import React from "react";

export function AtmosphereLayers() {
  return (
    <>
      <style>{`
        /* Layer A */
        .layer-a {
          top: -600px;
          right: -600px;
          width: 1800px;
          height: 1800px;
        }
        @media (max-width: 768px) {
          .layer-a {
            top: -400px;
            right: -400px;
            width: 1200px;
            height: 1200px;
          }
        }

        /* Layer B */
        .layer-b {
          bottom: -500px;
          left: -500px;
          width: 1400px;
          height: 1400px;
        }
        @media (max-width: 768px) {
          .layer-b {
            bottom: -300px;
            left: -300px;
            width: 900px;
            height: 900px;
          }
        }

        /* Layer E */
        .layer-e {
          height: 70vh;
        }
        @media (max-width: 768px) {
          .layer-e {
            height: 60vh;
          }
        }

        /* Layer C */
        .lulu-paper-noise { opacity: 0.45; }
        @media (max-width: 768px) {
          .lulu-paper-noise { opacity: 0.32; }
        }

        /* Layer F */
        .lulu-paper-crumple { opacity: 0.18; }
        @media (max-width: 768px) {
          .lulu-paper-crumple { opacity: 0.12; }
        }
      `}</style>

      {/* Layer A — Top-right warm bleed */}
      <div
        className="layer-a"
        style={{
          position: "fixed",
          background: "radial-gradient(circle, rgba(232, 155, 35, 0.32) 0%, rgba(232, 155, 35, 0.18) 25%, rgba(232, 155, 35, 0.08) 50%, rgba(232, 155, 35, 0) 75%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Layer B — Bottom-left warm-brown bleed */}
      <div
        className="layer-b"
        style={{
          position: "fixed",
          background: "radial-gradient(circle, rgba(61, 46, 30, 0.14) 0%, rgba(61, 46, 30, 0.08) 30%, rgba(61, 46, 30, 0.03) 55%, rgba(61, 46, 30, 0) 75%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Layer E — Top horizontal warm wash */}
      <div
        className="layer-e"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to bottom, rgba(232, 155, 35, 0.10) 0%, rgba(232, 155, 35, 0.04) 50%, rgba(232, 155, 35, 0) 100%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Layer C — Paper grain noise */}
      <div
        className="lulu-paper-noise"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      >
        <svg width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Layer F — Crumpled paper shadows */}
      <div
        className="lulu-paper-crumple"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="crumpleFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="4"
              seed="7"
              stitchTiles="stitch"
            />
            <feDiffuseLighting
              surfaceScale="3"
              diffuseConstant="1.2"
              lightingColor="#F5F0E6"
            >
              <feDistantLight azimuth="135" elevation="55" />
            </feDiffuseLighting>
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <rect width="100%" height="100%" filter="url(#crumpleFilter)" />
        </svg>
      </div>

      {/* Layer D — Edge vignette */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          boxShadow: "inset 0 0 400px 80px rgba(61, 46, 30, 0.16)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
