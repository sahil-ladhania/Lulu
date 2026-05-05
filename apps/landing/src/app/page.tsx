"use client";

import { motion } from "framer-motion";
import { GrainOverlay, LuluWordmark } from "@lulu/ui/components";
import { WaitlistForm } from "@/components/WaitlistForm";

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export default function Home() {
  return (
    <div className="relative min-h-screen lowercase overflow-x-hidden">
      <GrainOverlay />

      <div className="relative z-[2]">
        {/* wordmark — top left */}
        <header className="px-6 pt-6 md:px-10 md:pt-10">
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0 }}>
            <LuluWordmark sizePx={20} />
          </motion.div>
        </header>

        {/* SECTION 1 — HERO */}
        <section className="relative px-6 md:px-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
          {/* ambient marigold flower silhouette — subliminal, static */}
          <AmbientFlower />

          <div className="relative w-full max-w-[640px] mx-auto flex flex-col items-center text-center z-[2]">
            <h1
              className="font-display text-lulu-cream"
              style={{
                fontSize: "clamp(40px, 8vw, 64px)",
                letterSpacing: "-2px",
                lineHeight: 1.05,
              }}
            >
              <motion.span
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="block"
              >
                match deeper
                <HeadlineDot />
              </motion.span>
              <motion.span
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className="block"
              >
                reveal later
                <HeadlineDot />
              </motion.span>
            </h1>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.3 }}
              className="font-body text-lulu-text-secondary mx-auto mt-8"
              style={{
                fontSize: 18,
                lineHeight: 1.5,
                maxWidth: 480,
              }}
            >
              a dating app where you swipe on what people actually think — not the angle of their selfie. bangalore first. coming soon.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.4 }}
              className="mt-10 w-full"
              style={{ maxWidth: 480 }}
            >
              <WaitlistForm />
            </motion.div>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.5 }}
              className="font-body text-lulu-text-tertiary text-center mt-4 text-[12px]"
            >
              no spam. one email when we launch.
            </motion.p>
          </div>
        </section>

        {/* SECTION 2 — MANIFESTO */}
        <section className="px-6 md:px-10 py-20 md:py-[120px]">
          <div className="w-full max-w-[640px] mx-auto flex flex-col items-center text-center gap-[60px]">
            <ManifestoLine>no faces. not yet.</ManifestoLine>
            <ManifestoLine>swipe on what someone says — not how they look saying it.</ManifestoLine>
            <ManifestoLine endDot>photos come later. only when you both want them to</ManifestoLine>
          </div>
        </section>

        {/* SECTION 3 — FOOTER */}
        <footer className="px-6 md:px-10 pt-[80px] pb-[40px]">
          <div className="w-full max-w-[640px] mx-auto">
            <div
              className="text-center font-body text-lulu-text-tertiary text-[14px] leading-relaxed"
            >
              <p>lulu is launching in bangalore, 2026.</p>
              <p>
                questions?{" "}
                <a
                  href="mailto:hi@getlulu.in"
                  className="text-lulu-text-tertiary no-underline transition-colors hover:text-lulu-marigold hover:underline"
                  style={{ textDecorationColor: "#E89B23" }}
                >
                  hi@getlulu.in
                </a>
              </p>
            </div>

            <div
              className="flex justify-between font-body text-lulu-text-tertiary text-[11px] mt-8"
            >
              <span>© lulu, 2026</span>
              <span>made in india</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// headline dot — custom CSS marigold circle, scaled to font-size via em units (~9%)
const HeadlineDot = () => (
  <span
    aria-hidden="true"
    className="inline-block rounded-full bg-lulu-marigold align-baseline ml-[0.04em]"
    style={{ width: "0.09em", height: "0.09em" }}
  />
);

// manifesto line — centered, optional trailing marigold dot scaled via em
const ManifestoLine = ({
  children,
  endDot = false,
}: {
  children: React.ReactNode;
  endDot?: boolean;
}) => (
  <p
    className="font-display text-lulu-cream text-center leading-tight tracking-[-0.5px]"
    style={{
      fontSize: "clamp(22px, 4vw, 28px)",
    }}
  >
    {children}
    {endDot && (
      <span
        aria-hidden="true"
        className="inline-block rounded-full bg-lulu-marigold align-baseline ml-[0.04em]"
        style={{ width: "0.09em", height: "0.09em" }}
      />
    )}
  </p>
);

// ambient marigold flower — single static silhouette behind hero, slightly right-offset
// opacity kept at 0.05 per brand spec: subliminal texture, never decoration
const AmbientFlower = () => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute opacity-5 z-[1]"
    style={{
      width: "min(600px, 90vw)",
      height: "min(600px, 90vw)",
      top: "50%",
      left: "50%",
      transform: "translate(-40%, -50%)",
    }}
    viewBox="0 0 200 200"
    fill="#E89B23"
  >
    {/* simple radial marigold silhouette — 8 petals around a center */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 360) / 8;
      return (
        <ellipse
          key={i}
          cx="100"
          cy="55"
          rx="22"
          ry="42"
          transform={`rotate(${angle} 100 100)`}
        />
      );
    })}
    <circle cx="100" cy="100" r="22" />
  </svg>
);
