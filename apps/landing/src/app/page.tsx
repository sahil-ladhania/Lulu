"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@lulu/ui/components";
import { WaitlistForm } from "@/components/WaitlistForm";
import { SplashScreen } from "@/components/SplashScreen";

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
  const [taglineText, setTaglineText] = useState("match deeper, reveal later.");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const hasTriggeredTagline = useRef(false);

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
      <SplashScreen onDone={() => setSplashDone(true)} />

      {/* Main content — fades in as splash fades out */}
      <motion.div
        id="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="relative bg-lulu-cream text-lulu-bg overflow-x-hidden lowercase"
      >
        <div className="lulu-voice annotation-1" style={{
          position: "fixed",
          top: "48px",
          left: "80px",
          "--lulu-voice-size": "20px",
          transform: "rotate(-3deg)",
          color: "#3D2E1E",
          opacity: 0.85,
          zIndex: 50,
          pointerEvents: "none",
          lineHeight: 1.5,
          textAlign: "left"
        } as any}>
          that's me,<br />
          by the way.<br />
          <span style={{ marginLeft: "14px" }}>Hi !</span>
          <svg style={{ position: "absolute", top: "8px", right: "-48px",
            width: "44px", height: "32px", overflow: "visible" }}>
            <path d="M 2 16 C 10 10 28 12 38 16" 
              stroke="#3D2E1E" strokeWidth="1.5" 
              fill="none" opacity="0.7"
              strokeLinecap="round"/>
            <path d="M 34 10 L 40 16 L 34 22" 
              stroke="#3D2E1E" strokeWidth="1.5" 
              fill="none" opacity="0.7"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg className="svg-circle" style={{ position: "absolute", top: "-8px", left: "-12px",
            width: "120px", height: "90px", overflow: "visible" }}>
            <path d="M 60 4 C 90 0 115 15 118 40 
              C 121 65 105 82 75 85 
              C 45 88 8 75 4 50 
              C 0 25 20 6 60 4 Z" 
              stroke="#3D2E1E" strokeWidth="1.5" 
              fill="none" opacity="0.35"
              strokeLinecap="round"/>
          </svg>
        </div>

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
        <section id="hero-section" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-[60px] z-[1]">

          {/* Hero content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-[700px] w-full gap-7">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.15 }}
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
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.35 }}
              id="hero-headline"
              className="font-display font-medium text-lulu-bg"
              style={{ fontSize: "clamp(36px, 5.5vw, 68px)", lineHeight: 1.00, letterSpacing: "-0.04em" }}
            >
              the most interesting thing about you<br /><span style={{ color: "inherit" }}>can't</span> be <span style={{ color: "#B8761A" }}>photographed.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.6 }}
              className="h-[24px]"
            >
            <AnimatePresence mode="wait">
                <motion.p
                  key={taglineText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="font-body text-[17px] text-lulu-bg tracking-[-0.01em]"
                >
                  {taglineText}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="lulu-voice annotation-2" style={{
            position: "absolute",
            top: "80px",
            right: "60px",
            "--lulu-voice-size": "19px",
            transform: "rotate(2deg)",
            color: "#3D2E1E",
            opacity: 0.8,
            pointerEvents: "none",
            lineHeight: 1.6,
            textAlign: "center"
          } as any}>
            there's a form<br />
            down there,<br />
            <span style={{ marginLeft: "8px" }}>
              don't be
            </span><br />
            scared.
            <svg style={{ position: "absolute", bottom: "-44px",
              left: "20px", width: "32px", height: "44px",
              overflow: "visible" }}>
              <path d="M 16 0 C 18 12 14 28 8 40" 
                stroke="#3D2E1E" strokeWidth="1.5" 
                fill="none" opacity="0.6"
                strokeLinecap="round"/>
              <path d="M 2 34 L 8 42 L 16 36" 
                stroke="#3D2E1E" strokeWidth="1.5" 
                fill="none" opacity="0.6"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg style={{ position: "absolute", top: "-12px", left: "-16px",
              width: "140px", height: "120px", overflow: "visible" }}>
              <path d="M 70 6 C 105 2 132 20 135 50 
                C 138 80 118 102 85 106 
                C 52 110 12 95 6 65 
                C 0 35 25 8 70 6 Z" 
                stroke="#3D2E1E" strokeWidth="1.5" 
                fill="none" opacity="0.3"
                strokeLinecap="round"/>
            </svg>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10"
          >
            <div className="relative flex items-center justify-center">
            </div>
            <div className="relative w-px h-11 overflow-hidden bg-lulu-bg/20">
              <motion.div
                className="absolute inset-0 bg-lulu-bg"
                animate={scrollLine.animate}
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
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
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
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 0.4, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                className="font-body"
                style={{ fontSize: 15, fontStyle: "italic", color: "var(--color-lulu-bg)" }}
              >
                that's all we're saying for now.
              </motion.p>
              
              <div className="lulu-voice annotation-3" style={{
                marginTop: "20px",
                "--lulu-voice-size": "22px",
                transform: "rotate(-1.5deg)",
                color: "#3D2E1E",
                opacity: 0.85,
                display: "inline-block",
                position: "relative",
                lineHeight: 1.7,
                textAlign: "left"
              } as any}>
                i know more.<br />
                <span style={{ marginLeft: "20px" }}>
                  i am not
                </span><br />
                <span style={{ marginLeft: "8px" }}>
                  allowed to
                </span><br />
                <span style={{ marginLeft: "24px" }}>
                  say yet.
                </span>
                <svg style={{ position: "absolute", top: "-16px", left: "-20px",
                  width: "200px", height: "160px", overflow: "visible" }}>
                  <path d="M 100 8 C 150 2 188 28 192 70 
                    C 196 112 168 148 120 154 
                    C 72 160 18 138 8 96 
                    C -2 54 28 12 100 8 Z" 
                    stroke="#3D2E1E" strokeWidth="1.8" 
                    fill="none" opacity="0.3"
                    strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* ── RIGHT — Glass card + form ────────────────────────────────── */}
            <div id="form-col" className="flex justify-center" style={{ flex: "0 0 45%", maxWidth: "45%" }}>
              <motion.div
                id="form-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.85, ease: "easeOut" }}
                className="relative w-full max-w-[460px] rounded-[24px]"
                style={{
                  padding: "32px 36px 36px",
                  backgroundColor: "rgba(15,13,11,0.04)",
                  backdropFilter: "blur(60px) saturate(120%)",
                  WebkitBackdropFilter: "blur(60px) saturate(120%)",
                  border: "1px solid rgba(15,13,11,0.08)",
                  boxShadow: "0 24px 48px rgba(15,13,11,0.08)",
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

                <WaitlistForm onSubmitted={() => setFormSubmitted(true)} />
              </motion.div>
            </div>
          </div>
        </section>


        {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
        <footer id="footer" className="relative z-10 px-12 py-7 flex flex-row items-center justify-between gap-6">
          {/* LEFT — Identity */}
          <div className="flex-1 flex items-center gap-2 justify-start">
            <Logo
              variant="mark"
              color="marigold"
              size={20}
              style={{ opacity: 0.5 }}
            />
            <div
              className="font-display font-medium flex items-baseline"
              style={{ fontSize: 15, letterSpacing: "-0.03em", color: "rgba(15, 13, 11, 0.4)" }}
            >
              lulu
              <span style={{
                display: "inline-block",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "rgba(15, 13, 11, 0.3)",
                marginLeft: "1px",
                verticalAlign: "middle",
                position: "relative",
                bottom: "1px"
              }} />
            </div>
          </div>

          {/* CENTER — Brand line */}
          <div className="flex-1 text-center">
            <p className="font-body" style={{ fontSize: 13, color: "rgba(15, 13, 11, 0.3)" }}>
              lulu stays. that's the whole story.
            </p>
          </div>

          {/* RIGHT — Social icons */}
          <div className="flex-1 flex items-center gap-[18px] justify-end">
            <a href="https://www.instagram.com/getluluapp/" target="_blank" rel="noopener noreferrer" aria-label="lulu on instagram" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://x.com/getluluapp" target="_blank" rel="noopener noreferrer" aria-label="lulu on twitter" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://www.linkedin.com/company/getluluapp/" target="_blank" rel="noopener noreferrer" aria-label="lulu on linkedin" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="mailto:getluluapp@gmail.com" aria-label="email lulu" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          </div>
        </footer>
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
          #footer {
            padding: 24px 32px !important;
          }
        }
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
            text-align: center !important; 
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
          #footer { 
            flex-direction: column !important; 
            gap: 20px !important; 
            padding: 24px 20px !important; 
            text-align: center !important; 
          }
          .annotation-1 {
            top: 16px !important;
            left: 16px !important;
            --lulu-voice-size: 16px !important;
          }
          .annotation-1 .svg-circle {
            display: none !important;
          }
          .annotation-2 {
            display: none !important;
          }
          .annotation-3 {
            --lulu-voice-size: 18px !important;
          }
          #footer > div {
            flex: none !important;
            width: 100% !important;
            justify-content: center !important;
          }
        }
        .social-icon {
          color: rgba(15, 13, 11, 0.3);
          transition: all 0.4s ease;
        }
        .social-icon:hover {
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
