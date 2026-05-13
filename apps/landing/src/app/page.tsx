"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Logo } from "@lulu/ui/components";
import { WaitlistForm } from "@/components/WaitlistForm";
import { SplashScreen } from "@/components/SplashScreen";
import { AtmosphereLayers } from "@/components/AtmosphereLayers";
import { HandwrittenAnnotation } from "@/components/HandwrittenAnnotation";

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
  const [splashDone, setSplashDone] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const [section2InView, setSection2InView] = useState(false);
  const [formCardAnimationComplete, setFormCardAnimationComplete] = useState(false);
  const [taglineText, setTaglineText] = useState("match deeper, reveal later.");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);
  const hasTriggeredTagline = useRef(false);
  
  const prefersReducedMotion = useReducedMotion();

  // Easter Egg 1: Tab Title
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "come back. lulu misses you.";
      } else {
        document.title = "lulu. — match deeper, reveal later.";
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Scroll Cue Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50 && !scrolledPast) {
        setScrolledPast(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolledPast]);

  // Easter Egg 2: Idle Tagline
  useEffect(() => {
    if (formSubmitted) return;

    let idleTimeout: NodeJS.Timeout;
    const startTime = Date.now();

    const resetTimer = () => {
      clearTimeout(idleTimeout);
      // Only start timing if 5s have passed since mount
      if (Date.now() - startTime < 5000) return;
      if (hasTriggeredTagline.current) return;

      idleTimeout = setTimeout(() => {
        if (hasTriggeredTagline.current || formSubmitted) return;
        hasTriggeredTagline.current = true;
        setTaglineText("still here? good. so are we.");

        setTimeout(() => {
          setTaglineText("match deeper, reveal later.");
        }, 5000);
      }, 30000);
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach(ev => window.addEventListener(ev, resetTimer));

    // Initial start after 5s
    const initialStart = setTimeout(resetTimer, 5000);

    return () => {
      clearTimeout(idleTimeout);
      clearTimeout(initialStart);
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
    };
  }, [formSubmitted]);

  return (
    <>
      <SplashScreen onDone={() => { setSplashDone(true); setSplashComplete(true); }} />

      {/* Main content — fades in as splash fades out */}
      <motion.div
        id="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="relative bg-lulu-cream text-lulu-bg overflow-x-hidden lowercase"
      >
        <AtmosphereLayers />
        <div className="relative z-10">
          <HandwrittenAnnotation
            isActive={splashComplete}
            baseDelay={0.65}
            className="lulu-voice annotation-1"
            style={{
              position: "fixed",
              top: "90px",
              left: "45px",
              "--lulu-voice-size": "22px",
              transform: "rotate(-2deg)",
              color: "#3D2E1E",
              display: "inline-block",
              zIndex: 50,
              pointerEvents: "none",
              lineHeight: 1.6,
              padding: "16px 20px",
              textAlign: "left",
              opacity: 0.9,
            } as any}
            textChunks={[
              { content: "that's me,", breakAfter: true },
              { content: "by the way.", breakAfter: true },
              { content: "hi !", marginLeft: "12px" }
            ]}
            svgs={[
              {
                props: {
                  className: "annotation-1-circle",
                  style: { position: "absolute", top: "-8px", left: "-12px", width: "160px", height: "110px", overflow: "visible" },
                  viewBox: "0 0 160 110"
                },
                paths: [
                  { d: "M 80 6 C 115 2 148 18 152 45 C 156 72 138 96 105 102 C 72 108 24 98 10 72 C -4 46 12 10 80 6 Z", strokeWidth: "1.8", opacity: "0.3" }
                ]
              },
              {
                props: {
                  className: "annotation-1-arrow",
                  style: { position: "absolute", top: "-64px", left: "20px", width: "40px", height: "64px", overflow: "visible" },
                  viewBox: "0 0 40 64"
                },
                paths: [
                  { d: "M 32 18 C 30 28 25 40 12 56", strokeWidth: "1.5", opacity: "0.6" },
                  { d: "M 4 48 L 10 60 L 22 52", strokeWidth: "1.5", opacity: "0.6" }
                ]
              }
            ]}
          />

        {/* ── NAV ────────────────────────────────────────────────────────────── */}
        <nav id="nav" className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-7 pointer-events-none flex items-center">
          <div className="flex items-center gap-2">
            <Logo variant="mark" color="marigold" size={20} style={{ filter: "brightness(0.8)" }} />
            <div
              className="font-display font-medium text-lulu-bg flex items-baseline"
              style={{ fontSize: 20, letterSpacing: "-0.04em", lineHeight: 1 }}
            >
              lulu
              <span
                style={{
                  display: "inline-block",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "var(--color-lulu-marigold-light)",
                  marginLeft: "1px",
                  verticalAlign: "middle",
                  position: "relative",
                  bottom: "1px"
                }}
              />
            </div>
          </div>
        </nav>

        {/* ── SECTION 1 — HERO ────────────────────────────────────────────────── */}
        <section id="hero-section" className="relative min-h-screen flex flex-col items-center justify-center px-6 md:pt-28 pb-[60px] z-[1]">

          {/* Hero content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-[700px] w-full gap-7">
            {/* Eyebrow */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              animate={prefersReducedMotion || splashComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease, delay: 0 }}
              className="inline-flex items-center gap-2"
            >
              <div className="pulse-dot w-[7px] h-[7px]" style={{ borderRadius: "50%", background: "var(--color-lulu-marigold-light)" }} />
              <span
                className="font-body font-medium text-[11px] uppercase tracking-[0.18em] text-lulu-marigold-light"
                style={{ fontFamily: "'Switzer', sans-serif" }}
              >
                waitlist is open.
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={prefersReducedMotion || splashComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.6, ease, delay: 0.15 }}
              id="hero-headline"
              className="font-display font-medium text-lulu-bg"
              style={{ fontSize: "clamp(36px, 5.5vw, 68px)", lineHeight: 1.00, letterSpacing: "-0.04em" }}
            >
              the most interesting thing about you<br /><span style={{ color: "inherit" }}>can't</span> be <span style={{ color: "#B8761A" }}>photographed.</span>
            </motion.h1>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion || splashComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease, delay: 0.4 }}
              className="h-[24px]"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={taglineText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-body text-[17px] text-lulu-bg tracking-[-0.01em]"
                >
                  {taglineText}
                </motion.p>
              </AnimatePresence>

              {/* Mobile annotation outside AnimatePresence to fix warning */}
              <HandwrittenAnnotation
                isActive={splashComplete}
                baseDelay={0.8}
                className="lulu-voice lulu-mobile-only"
                style={{
                  fontSize: "17px",
                  transform: "rotate(-1.5deg)",
                  color: "#3D2E1E",
                  marginTop: "16px",
                  textAlign: "center",
                  lineHeight: 1.6,
                  position: "relative",
                  padding: "16px 28px",
                  display: "inline-block",
                  opacity: 0.8,
                }}
                textChunks={[
                  { content: "there's a form", breakAfter: true },
                  { content: "down there,", breakAfter: true },
                  { content: "don't be scared." }
                ]}
                svgs={[
                  {
                    props: {
                      style: { position: "absolute", top: "0px", left: "50%", transform: "translateX(-50%)", width: "200px", height: "100px", overflow: "visible" },
                      viewBox: "0 0 200 100"
                    },
                    paths: [
                      { d: "M 100 5 C 150 2 195 20 192 50 C 189 80 150 95 100 95 C 50 95 10 80 8 50 C 6 20 50 8 100 5 Z", strokeWidth: "1.5", opacity: "0.3" }
                    ]
                  },
                  {
                    props: {
                      style: { position: "absolute", bottom: "-55px", left: "50%", transform: "translateX(-50%)", width: "40px", height: "50px", overflow: "visible" }
                    },
                    paths: [
                      { d: "M 20 0 C 25 15 25 35 20 48", strokeWidth: "1.5", opacity: "0.6" },
                      { d: "M 12 38 L 20 48 L 28 38", strokeWidth: "1.5", opacity: "0.6" }
                    ]
                  }
                ]}
              />
            </motion.div>
          </div>

          <HandwrittenAnnotation
            isActive={splashComplete}
            baseDelay={0.8}
            className="lulu-voice annotation-2"
            style={{
              position: "absolute",
              top: "80px",
              right: "60px",
              "--lulu-voice-size": "19px",
              transform: "rotate(2deg)",
              color: "#3D2E1E",
              pointerEvents: "none",
              lineHeight: 1.6,
              textAlign: "center",
              opacity: 0.8,
            } as any}
            textChunks={[
              { content: "there's a form", breakAfter: true },
              { content: "down there,", breakAfter: true },
              { content: "don't be", marginLeft: "8px", breakAfter: true },
              { content: "scared." }
            ]}
            svgs={[
              {
                props: {
                  style: { position: "absolute", bottom: "-44px", left: "20px", width: "32px", height: "44px", overflow: "visible" }
                },
                paths: [
                  { d: "M 16 0 C 18 12 14 28 8 40", strokeWidth: "1.5", opacity: "0.6" },
                  { d: "M 2 34 L 8 42 L 16 36", strokeWidth: "1.5", opacity: "0.6" }
                ]
              },
              {
                props: {
                  style: { position: "absolute", top: "-12px", left: "-16px", width: "140px", height: "120px", overflow: "visible" }
                },
                paths: [
                  { d: "M 70 6 C 105 2 132 20 135 50 C 138 80 118 102 85 106 C 52 110 12 95 6 65 C 0 35 25 8 70 6 Z", strokeWidth: "1.5", opacity: "0.3" }
                ]
              }
            ]}
          />

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: !splashComplete ? 0 : (scrolledPast ? 0 : 0.22) }}
            transition={{ duration: scrolledPast ? 0.3 : 1, delay: scrolledPast ? 0 : 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10 pointer-events-none"
          >
            <div className="relative w-px h-11 overflow-hidden bg-lulu-bg/20">
              <motion.div
                className="absolute inset-0 bg-lulu-bg"
                animate={prefersReducedMotion || scrolledPast || !splashComplete ? { scaleY: 0 } : scrollLine.animate}
                transition={scrollLine.transition as any}
                style={{ transformOrigin: "top" }}
              />
            </div>
          </motion.div>
        </section>

        {/* ── SECTION 2 — INTRIGUE + FORM (two-column) ────────────────────────── */}
        <section id="split-section" className="relative z-[1] flex items-center justify-center" style={{
          minHeight: "calc(100vh - 56px)",
          background: "radial-gradient(ellipse at 70% 50%, rgba(255, 255, 255, 0.015) 0%, transparent 65%)"
        }}>
          <div
            id="split-container"
            className="w-full max-w-[1200px] mx-auto flex items-center gap-16
                     flex-col md:flex-row"
            style={{ padding: "40px 48px" }}
          >
            {/* ── LEFT — Intrigue copy ─────────────────────────────────────── */}
            <div id="intrigue-col" className="flex flex-col gap-6 text-left" style={{ flex: "0 0 55%", maxWidth: "55%" }}>
              <motion.h2
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                onViewportEnter={() => setSection2InView(true)}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
                className="font-display font-medium leading-[1.1] tracking-[-0.025em]"
                style={{ fontSize: "clamp(24px, 3.2vw, 38px)", color: "#F5F0E6" }}
              >
                <span style={{ color: "var(--color-lulu-bg)", display: "block" }}>
                  you already know a photo tells you nothing.<br />
                  you keep swiping anyway.
                </span>
                <span id="punchline" style={{ color: "#B8761A", display: "block", marginTop: 4, fontSize: "1.15em" }}>
                  lulu is for when you're done with that.
                </span>
              </motion.h2>

              <motion.p
                initial={prefersReducedMotion ? { opacity: 0.4, y: 0 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 0.4, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="font-body"
                style={{ fontSize: 15, fontStyle: "italic", color: "var(--color-lulu-bg)" }}
              >
                that's all we're saying for now.
              </motion.p>

              <HandwrittenAnnotation
                isActive={section2InView}
                baseDelay={3.0} // Wait for text and circle below (text ~1.7s, circle 0.7s, delay 0.55s)
                textChunks={[]}
                svgs={[
                  {
                    props: {
                      className: "annotation-3-arrow",
                      style: { display: "block", width: "60px", height: "40px", overflow: "visible", marginLeft: "20px", opacity: 0.5 },
                      viewBox: "0 0 60 40"
                    },
                    paths: [
                      { d: "M 4 4 C 20 4 40 20 52 34", strokeWidth: "1.5", opacity: "1" },
                      { d: "M 44 32 L 54 36 L 50 26", strokeWidth: "1.5", opacity: "1" }
                    ]
                  }
                ]}
              />
              
              <HandwrittenAnnotation
                isActive={section2InView}
                baseDelay={0.55}
                className="lulu-voice annotation-3"
                style={{
                  marginTop: "20px",
                  "--lulu-voice-size": "22px",
                  transform: "rotate(-1.5deg)",
                  color: "#3D2E1E",
                  display: "inline-block",
                  position: "relative",
                  lineHeight: 1.7,
                  textAlign: "left",
                  opacity: 0.85,
                } as any}
                textChunks={[
                  { content: "i know more.", breakAfter: true },
                  { content: "i am not allowed", marginLeft: "8px", breakAfter: true },
                  { content: "to say yet.", marginLeft: "24px" }
                ]}
                svgs={[
                  {
                    props: {
                      className: "annotation-3-circle",
                      style: { position: "absolute", top: "-16px", left: "-20px", width: "200px", height: "160px", overflow: "visible" },
                      viewBox: "0 0 200 160"
                    },
                    paths: [
                      { d: "M 100 8 C 150 2 188 28 192 70 C 196 112 168 148 120 154 C 72 160 18 138 8 96 C -2 54 28 12 100 8 Z", strokeWidth: "1.8", opacity: "0.3" }
                    ]
                  }
                ]}
              />
            </div>

            {/* ── RIGHT — Glass card + form ────────────────────────────────── */}
            <div id="form-col" className="flex justify-center" style={{ flex: "0 0 45%", maxWidth: "45%" }}>
              <motion.div
                id="form-card"
                initial={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                onAnimationComplete={() => setFormCardAnimationComplete(true)}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                className="relative w-full max-w-[460px] rounded-[24px]"
                style={{
                  willChange: "transform, opacity",
                  padding: "36px 40px 40px",
                  backgroundColor: "rgba(245, 240, 230, 0.45)",
                  backdropFilter: "blur(24px) saturate(140%)",
                  WebkitBackdropFilter: "blur(24px) saturate(140%)",
                  border: "1px solid rgba(184, 118, 26, 0.18)",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 24px 60px rgba(61, 46, 30, 0.10), 0 4px 12px rgba(61, 46, 30, 0.06)",
                }}
              >
                {/* Top-edge marigold glow */}
                <div
                  className="absolute top-0 left-0 right-0 pointer-events-none rounded-t-[24px]"
                  style={{
                    height: "1.5px",
                    background: "linear-gradient(90deg, transparent 15%, rgba(184,118,26,0.25) 50%, transparent 85%)",
                  }}
                />

                <WaitlistForm onSubmitted={() => setFormSubmitted(true)} isFormCardComplete={formCardAnimationComplete} />
              </motion.div>
            </div>
          </div>
        </section>


        {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
        <footer id="footer" className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col px-[20px] md:px-[24px] lg:px-[48px] pt-[24px] md:pt-[48px] pb-[24px] lg:pb-[40px]">
          {/* Row 2 — Three small columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] md:gap-[32px] w-full items-start">
            
            {/* Left column — brand mark + tagline */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-[8px]">
                <Logo variant="mark" color="marigold" size={20} style={{ opacity: 0.7 }} />
                <div className="font-display font-medium flex items-baseline lowercase" style={{ fontSize: 16, letterSpacing: "-0.03em", color: "rgba(15, 13, 11, 0.5)" }}>
                  lulu
                  <span style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "var(--color-lulu-marigold-light)",
                    marginLeft: "1px",
                    verticalAlign: "middle",
                    position: "relative",
                    bottom: "1px"
                  }} />
                </div>
              </div>
              <div className="font-body mt-[8px] hidden md:block" style={{ fontSize: 13, color: "rgba(15, 13, 11, 0.4)" }}>match deeper, reveal later.</div>
            </div>

            {/* Center column — three trust lines */}
            <div className="hidden md:flex flex-col items-center">
              <div className="flex flex-col gap-[10px] md:gap-[12px]">
                {[
                  "we don't sell your data.",
                  "we don't send spam.",
                  "we don't make you wait long."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-[8px]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B8761A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="font-body" style={{ fontSize: 13, color: "rgba(15, 13, 11, 0.5)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — social + email */}
            <div className="flex flex-row md:flex-col justify-center md:justify-end items-center md:items-end gap-[20px] md:gap-[10px]">
              {[
                { label: "instagram", href: "https://www.instagram.com/getluluapp/", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon-svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                { label: "twitter", href: "https://x.com/getluluapp", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="social-icon-svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
                { label: "linkedin", href: "https://www.linkedin.com/company/getluluapp/", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon-svg"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
                { label: "getluluapp@gmail.com", href: "mailto:getluluapp@gmail.com", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon-svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> }
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="social-row flex items-center gap-[10px]">
                  {item.icon}
                  <span className="social-label font-body text-[13px] hidden md:inline">{item.label}</span>
                </a>
              ))}
            </div>
            
          </div>

          {/* Final hairline + copyright */}
          <div className="w-full mt-[32px] md:mt-[48px]">
            <div className="w-full h-px hidden md:block" style={{ background: "rgba(15, 13, 11, 0.08)" }} />
            <div className="text-center font-body mt-0 md:mt-[24px]" style={{ fontSize: 11, color: "rgba(15, 13, 11, 0.3)", letterSpacing: "0.02em" }}>
              © 2026 lulu. all rights reserved.
            </div>
          </div>

        </footer>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
        @media (min-width: 769px) and (max-width: 1024px) {
          #split-section {
            min-height: auto !important;
            padding-top: 60px !important;
            padding-bottom: 60px !important;
          }
          #split-container {
            padding: 40px 32px !important;
            gap: 24px !important;
          }
          #intrigue-col {
            flex: 0 0 45% !important;
            max-width: 45% !important;
          }
          #intrigue-col h2 {
            font-size: clamp(20px, 2.8vw, 28px) !important;
            line-height: 1.25 !important;
          }
          #punchline {
            white-space: normal !important;
          }
          #form-col {
            flex: 0 0 55% !important;
            max-width: 55% !important;
          }
          #form-card {
            padding: 32px 28px !important;
            width: 100% !important;
          }
        }
        .lulu-mobile-only { display: none; }
        @media (max-width: 768px) {
          #nav { padding: 20px !important; }
          #hero-section { 
            padding: 120px 20px 80px !important; 
            text-align: center !important; 
          }
          #hero-headline { 
            font-size: clamp(32px, 8vw, 52px) !important; 
          }
          #split-section { 
            min-height: auto !important; 
            padding: 40px 20px !important; 
          }
          #split-container { 
            flex-direction: column !important; 
            gap: 48px !important;
            padding: 40px 20px !important;
          }
          #intrigue-col { 
            flex: 0 0 100% !important; 
            max-width: 100% !important; 
            text-align: left !important; 
          }
          #punchline { 
            white-space: normal !important; 
          }
          #form-col { 
            flex: 0 0 100% !important; 
            max-width: 100% !important; 
          }
          #form-card { 
            padding: 32px 20px !important; 
            width: 100% !important; 
          }
          .annotation-1 {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            margin: 80px 0 0 16px !important;
            --lulu-voice-size: 16px !important;
            padding: 10px !important;
            transform: rotate(-2deg) !important;
            display: inline-block !important;
            width: fit-content !important;
          }
          .annotation-1-circle {
            width: 120px !important;
            height: 85px !important;
            top: -4px !important;
            left: -6px !important;
          }
          .annotation-1-arrow {
            width: 30px !important;
            height: 48px !important;
            top: -48px !important;
            left: 15px !important;
          }
          .annotation-1 .hide-mobile {
            display: none !important;
          }
          .annotation-3 {
            --lulu-voice-size: 22px !important;
            margin-left: 40px !important;
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .annotation-3 {
              margin-left: 20px !important;
            }
          }
          @media (max-width: 768px) {
            .annotation-2 {
              display: none !important;
            }
            .annotation-3 {
              margin-left: 20px !important;
              --lulu-voice-size: 18px !important;
            }
            .annotation-3-circle {
              width: 180px !important;
              height: 130px !important;
              top: -12px !important;
              left: -16px !important;
            }
            .annotation-3-arrow {
              width: 40px !important;
              height: 28px !important;
              margin-left: 30px !important;
              opacity: 0.6 !important;
            }
            #hero-section {
              min-height: calc(100vh - 150px) !important;
              padding-top: 0 !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
          }
          @media (min-width: 769px) and (max-width: 900px) {
            #split-container {
              padding: 40px 32px !important;
              gap: 40px !important;
            }
            #intrigue-col {
              flex: 0 0 52% !important;
              max-width: 52% !important;
            }
            #form-col {
              flex: 0 0 44% !important;
              max-width: 44% !important;
            }
          }
          .lulu-voice:not(.annotation-1) {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            transform: rotate(-1.5deg) !important;
          }
        }
        .lulu-mobile-only {
          display: none !important;
        }
        @media (max-width: 768px) {
          .lulu-mobile-only {
            display: inline-block !important;
          }
          .social-icon-svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
        .social-row {
          color: rgba(15, 13, 11, 0.4);
          cursor: pointer;
        }
        .social-row .social-label {
          color: rgba(15, 13, 11, 0.5);
          transition: color 0.2s ease;
        }
        .social-row .social-icon-svg {
          transition: color 0.2s ease;
        }
        .social-row:hover .social-label, .social-row:hover .social-icon-svg {
          color: var(--color-lulu-marigold-light);
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(184, 118, 26, 0.4); }
          70%  { box-shadow: 0 0 0 8px rgba(184, 118, 26, 0); }
          100% { box-shadow: 0 0 0 0 rgba(184, 118, 26, 0); }
        }
        .pulse-dot {
          animation: pulse-ring 2s infinite;
        }
      `}} />
      </motion.div>
    </>
  );
}
