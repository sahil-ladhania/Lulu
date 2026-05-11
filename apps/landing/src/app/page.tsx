"use client";

import { motion } from "framer-motion";
import { GrainOverlay, Logo } from "@lulu/ui/components";
import { WaitlistForm } from "@/components/WaitlistForm";

// ─── Animation constants ──────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

const pulseGlow = {
  animate: {
    opacity: [1, 0.6, 1],
    boxShadow: [
      "0 0 6px rgba(232,155,35,0.4)",
      "0 0 20px rgba(232,155,35,0.9)",
      "0 0 6px rgba(232,155,35,0.4)",
    ],
  },
  transition: { duration: 3.5, ease: "easeInOut", repeat: Infinity },
};

const scrollLine = {
  animate: { scaleY: [0, 1, 1, 0] },
  transition: {
    duration: 2.2,
    ease: "easeInOut",
    repeat: Infinity,
    times: [0, 0.4, 0.7, 1],
  },
};

const staggerParent = {
  visible: { transition: { staggerChildren: 0.12 } },
};
const revealChild = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="relative bg-lulu-bg text-lulu-cream overflow-x-hidden lowercase">
      <GrainOverlay />

      {/* ── NAV ────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-7 pointer-events-none flex items-center">
        <div className="flex items-center gap-2">
          <Logo variant="mark" color="marigold" size={20} />
          <div
            className="font-display font-medium text-lulu-cream flex items-baseline"
            style={{ fontSize: 20, letterSpacing: "-0.04em", lineHeight: 1 }}
          >
            lulu
            <motion.span
              className="inline-block w-[4px] h-[4px] rounded-full bg-lulu-marigold ml-[2px]"
              animate={pulseGlow.animate}
              transition={pulseGlow.transition}
            />
          </div>
        </div>
      </nav>

      {/* ── SECTION 1 — HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-24">
        {/* Background: sunflower mark only — no colour orbs */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          {/* Large sunflower mark — centred, very faint, pure texture */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "min(640px, 90vw)",
              height: "min(640px, 90vw)",
              opacity: 0.06,
            }}
          >
            <Logo variant="mark" color="marigold" className="w-full h-full" />
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-[700px] w-full gap-7">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.75, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            className="font-body font-medium text-[11px] uppercase tracking-[0.22em] text-lulu-marigold"
          >
            coming soon
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.35 }}
            className="font-display font-medium text-lulu-cream leading-[1.06] tracking-[-0.03em]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            you've been matching with the wrong thing.
          </motion.h1>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="w-7 h-px bg-lulu-cream/20" />
            <p className="font-body text-[17px] text-lulu-cream/45 tracking-[-0.01em]">
              match deeper, reveal later.
            </p>
            <div className="w-7 h-px bg-lulu-cream/20" />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10"
        >
          <span className="font-body text-[10px] uppercase tracking-[0.18em]">scroll</span>
          <div className="relative w-px h-11 overflow-hidden bg-lulu-cream/20">
            <motion.div
              className="absolute inset-0 bg-lulu-cream"
              animate={scrollLine.animate}
              transition={scrollLine.transition as any}
              style={{ transformOrigin: "top" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── SECTION 2 — INTRIGUE ────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 z-10">
        <motion.div
          className="flex flex-col items-center text-center max-w-[600px] gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerParent}
        >
          <motion.div
            variants={revealChild}
            className="w-9 h-px bg-lulu-marigold opacity-50"
          />
          <motion.h2
            variants={revealChild}
            className="font-display font-medium leading-[1.1] tracking-[-0.025em]"
            style={{ fontSize: "clamp(26px, 4vw, 42px)" }}
          >
            <span className="text-lulu-cream block">
              most apps ask you to lead with your face.
            </span>
            <span className="text-lulu-marigold block mt-1">lulu doesn't.</span>
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: {
                opacity: 0.3,
                y: 0,
                transition: { duration: 0.75, ease: "easeOut" },
              },
            }}
            className="font-body text-[14px] text-lulu-cream"
          >
            that's all we're saying for now.
          </motion.p>
        </motion.div>
      </section>

      {/* ── SECTION 3 — FORM ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-32 pt-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="relative w-full max-w-[460px] rounded-[20px]"
          style={{
            /* NO overflow:hidden — lets the custom dropdown escape the card */
            padding: "52px 44px 44px",
            backgroundColor: "rgba(245,240,230,0.032)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(245,240,230,0.075)",
          }}
        >
          {/* Top-edge marigold glow */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none rounded-t-[20px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 15%, rgba(232,155,35,0.38) 50%, transparent 85%)",
            }}
          />

          {/* Card header */}
          <div className="flex flex-col items-center text-center mb-9">
            <span className="font-body font-medium text-[11px] uppercase tracking-[0.20em] text-lulu-marigold/75 mb-4">
              early access
            </span>
            <h2
              className="font-display font-medium text-lulu-cream leading-tight mb-3"
              style={{ fontSize: 34, letterSpacing: "-0.03em" }}
            >
              be first.
            </h2>
            <p
              className="font-body text-[14px] leading-relaxed"
              style={{ color: "rgba(245,240,230,0.38)" }}
            >
              we're launching city by city. we'll reach out when lulu goes live near you.
            </p>
          </div>

          <WaitlistForm />
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 px-6 md:px-12 py-16 flex flex-col items-center gap-3">
        {/* Logo + wordmark — same row */}
        <div className="flex items-center gap-2">
          <Logo
            variant="mark"
            color="marigold"
            size={16}
            style={{ opacity: 0.22 }}
          />
          <div
            className="font-display font-medium flex items-baseline text-lulu-cream/25"
            style={{ fontSize: 15, letterSpacing: "-0.03em" }}
          >
            lulu
            <div className="w-[3px] h-[3px] rounded-full bg-lulu-marigold/30 ml-[1.5px]" />
          </div>
        </div>
        {/* Copyright */}
        <p
          className="font-body text-lulu-cream/[0.15]"
          style={{ fontSize: 11 }}
        >
          © 2025 lulu. all rights reserved.
        </p>
      </footer>
    </div>
  );
}
