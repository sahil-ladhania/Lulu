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
        className="relative bg-lulu-bg text-lulu-cream overflow-x-hidden lowercase"
      >

      {/* ── NAV ────────────────────────────────────────────────────────────── */}
      <nav id="nav" className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-7 pointer-events-none flex items-center">
        <div className="flex items-center gap-2">
          <Logo variant="mark" color="marigold" size={20} />
          <div
            className="font-display font-medium text-lulu-cream flex items-baseline"
            style={{ fontSize: 20, letterSpacing: "-0.04em", lineHeight: 1 }}
          >
            lulu
            <span
              style={{
                display: "inline-block",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#E89B23",
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
            <div className="pulse-dot w-[7px] h-[7px]" style={{ borderRadius: "50%", background: "#E89B23" }} />
            <span 
              className="font-body font-medium text-[11px] uppercase tracking-[0.18em] text-[#E89B23] opacity-[0.85]"
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
            className="font-display font-medium text-lulu-cream"
            style={{ fontSize: "clamp(36px, 5.5vw, 68px)", lineHeight: 1.00, letterSpacing: "-0.04em" }}
          >
            the most interesting thing about you<br /><span style={{ color: "#F5F0E6" }}>can't</span> be <span style={{ color: "#E89B23" }}>photographed.</span>
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
                className="font-body text-[17px] text-lulu-cream tracking-[-0.01em]"
              >
                {taglineText}
              </motion.p>
            </AnimatePresence>
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
              <span style={{ color: "#F5F0E6", display: "block" }}>
                you already know a photo tells you nothing.<br />
                you keep swiping anyway.
              </span>
              <span id="punchline" style={{ color: "#E89B23", display: "block", marginTop: 4, fontSize: "1.15em", whiteSpace: "nowrap" }}>
                lulu is for when you're done with that.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              className="font-body"
              style={{ fontSize: 15, fontStyle: "italic", color: "#F5F0E6" }}
            >
              that's all we're saying for now.
            </motion.p>
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
                backgroundColor: "rgba(245,240,230,0.03)",
                backdropFilter: "blur(60px) saturate(120%)",
                WebkitBackdropFilter: "blur(60px) saturate(120%)",
                border: "1px solid rgba(245,240,230,0.06)",
                boxShadow: "inset 0 1px 0 rgba(245,240,230,0.05), 0 32px 64px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Top-edge marigold glow */}
              <div
                className="absolute top-0 left-0 right-0 pointer-events-none rounded-t-[24px]"
                style={{
                  height: "1.5px",
                  background: "linear-gradient(90deg, transparent 15%, rgba(232,155,35,0.6) 50%, transparent 85%)",
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
            style={{ fontSize: 15, letterSpacing: "-0.03em", color: "rgba(245, 240, 230, 0.5)" }}
          >
            lulu
            <span style={{
              display: "inline-block",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#E89B23",
              marginLeft: "1px",
              verticalAlign: "middle",
              position: "relative",
              bottom: "1px"
            }} />
          </div>
        </div>

        {/* CENTER — Brand line */}
        <div className="flex-1 text-center">
          <p className="font-body" style={{ fontSize: 13, color: "rgba(245, 240, 230, 0.35)" }}>
            lulu stays. that's the whole story.
          </p>
        </div>

        {/* RIGHT — Social icons */}
        <div className="flex-1 flex items-center gap-[18px] justify-end">
          <a href="https://www.instagram.com/getluluapp/" target="_blank" rel="noopener noreferrer" aria-label="lulu on instagram" className="social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://x.com/getluluapp" target="_blank" rel="noopener noreferrer" aria-label="lulu on twitter" className="social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://www.linkedin.com/company/getluluapp/" target="_blank" rel="noopener noreferrer" aria-label="lulu on linkedin" className="social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="mailto:getluluapp@gmail.com" aria-label="email lulu" className="social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </footer>
      <style dangerouslySetInnerHTML={{ __html: `
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
          #footer > div {
            flex: none !important;
            width: 100% !important;
            justify-content: center !important;
          }
        }
        .social-icon {
          color: #F5F0E6;
          opacity: 0.3;
          transition: all 0.4s ease;
        }
        .social-icon:hover {
          opacity: 1;
          color: #E89B23;
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(232, 155, 35, 0.5); }
          70%  { box-shadow: 0 0 0 8px rgba(232, 155, 35, 0); }
          100% { box-shadow: 0 0 0 0 rgba(232, 155, 35, 0); }
        }
        .pulse-dot {
          animation: pulse-ring 2s infinite;
        }
      `}} />
    </motion.div>
    </>
  );
}
