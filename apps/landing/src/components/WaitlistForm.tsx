"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toast, ToastType } from "@/components/Toast";

// ─── Constants ────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CITIES = ["Bangalore", "Pune", "Delhi / NCR", "Mumbai", "Hyderabad", "Other"];

const CITY_HINTS: Record<string, string> = {
  Bangalore: "awww ! how can i forget bengaluru ???",
  Pune: "pune's turn is coming. sit tight.",
  "Delhi / NCR": "delhi's on the list. eventually.",
  Mumbai: "lulu's 2nd fav city.",
  Hyderabad: "hyderabad, you're closer than you think.",
  Other: "lulu travels. eventually.",
};

// ─── Input styles ─────────────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  padding: "12px 4px 12px 4px",
  width: "100%",
  fontFamily: "'Switzer', sans-serif",
  fontSize: 15,
  color: "var(--color-lulu-bg)",
  outline: "none",
  boxShadow: "none",
};
const inputFocus: React.CSSProperties = {};
// inputError removed — validation uses quirky placeholders instead
const placeholderColor = "rgba(15, 13, 11, 0.25)";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Chevron icon */
const Chevron = ({ open }: { open: boolean }) => (
  <motion.svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
  >
    <path
      d="M3 4.5L6 7.5L9 4.5"
      stroke="#B8761A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

/** Custom city dropdown */
const CityDropdown = ({
  value,
  onChange,
  quirkyPlaceholder,
}: {
  value: string;
  onChange: (v: string) => void;
  quirkyPlaceholder?: boolean;
}) => {
  const showQuirky = quirkyPlaceholder && !value;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between font-body cursor-pointer lulu-input ${open ? 'is-open' : ''}`}
        style={{
          ...inputBase,
          textAlign: "left",
        }}
      >
        <span
          style={{
            color: value
              ? "var(--color-lulu-bg)"
              : showQuirky
              ? "rgba(184,118,26,0.7)"
              : "rgba(15, 13, 11, 0.35)",
            textTransform: "lowercase",
          }}
        >
          {value ? value.toLowerCase() : (showQuirky ? "pick a city. any city." : "select your city")}
        </span>
        <Chevron open={open} />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 z-50 overflow-hidden"
            style={{
              transformOrigin: "top",
              top: "calc(100% + 8px)",
              width: "100%",
              maxWidth: "100%",
              background: "rgba(245, 240, 230, 0.95)",
              backdropFilter: "blur(20px) saturate(140%)",
              WebkitBackdropFilter: "blur(20px) saturate(140%)",
              border: "1px solid rgba(184, 118, 26, 0.18)",
              borderRadius: "12px",
              boxShadow: "0 12px 32px rgba(61, 46, 30, 0.12), 0 4px 12px rgba(61, 46, 30, 0.06)",
              padding: "6px",
            } as React.CSSProperties}
          >
            {CITIES.map((city) => {
              const isSelected = city === value;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    onChange(city);
                    setOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 12px",
                    background: isSelected ? "rgba(184, 118, 26, 0.12)" : "transparent",
                    border: "none",
                    borderRadius: "8px",
                    textAlign: "left",
                    fontFamily: "'Switzer', sans-serif",
                    fontSize: "14px",
                    color: isSelected ? "#B8761A" : "var(--color-lulu-bg)",
                    cursor: "pointer",
                    transition: "background-color 150ms ease",
                    textTransform: "lowercase",
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    if (!isSelected) target.style.backgroundColor = "rgba(184, 118, 26, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    if (!isSelected) target.style.backgroundColor = "transparent";
                  }}
                >
                  {city.toLowerCase()}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Field wrapper with label */
const Field = ({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-[4px]">
    <label
      htmlFor={id}
      className="font-body font-medium uppercase"
      style={{
        fontSize: 11,
        letterSpacing: "0.18em",
        color: "rgba(184, 118, 26, 0.7)",
        padding: 0,
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

// ─── Main Form ────────────────────────────────────────────────────────────────
export const WaitlistForm = ({ onSubmitted }: { onSubmitted?: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  const [quirky, setQuirky] = useState({ name: false, email: false, city: false });
  const [focused, setFocused] = useState({ name: false, email: false });
  const [blurred, setBlurred] = useState({ name: false, email: false });
  const [hovering, setHovering] = useState(false);
  const [locking, setLocking] = useState(false);
  const [cityTouched, setCityTouched] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: ToastType; id: number } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [idleMessage, setIdleMessage] = useState<string | null>(null);
  const hasTriggeredCTA = useRef(false);

  useEffect(() => {
    if (done) return;

    let idleTimeout: NodeJS.Timeout;
    const startTime = Date.now();

    const resetTimer = () => {
      clearTimeout(idleTimeout);
      setIdleMessage(null);
      
      // Only start timing if 5s have passed since mount
      if (Date.now() - startTime < 5000) return;
      if (hasTriggeredCTA.current) return;

      idleTimeout = setTimeout(() => {
        if (hasTriggeredCTA.current || done || submitting || locking) return;
        hasTriggeredCTA.current = true;
        setIdleMessage("still thinking? it's okay.");
      }, 45000);
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
  }, [done, submitting, locking]);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, id: Date.now() });
  };

  const dismissToast = () => setToast(null);



  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Front-end validation
    const needsName = !name.trim();
    const needsEmail = !EMAIL_RE.test(email.trim());
    if (needsName || needsEmail) {
      setQuirky((p) => ({ ...p, name: needsName, email: needsEmail }));
      return;
    }
    if (!city) {
      setQuirky((p) => ({ ...p, city: true }));
      showToast("please select your city.", "warning");
      return;
    }

    // Lock UI
    setLocking(true);
    setSubmitting(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), city }),
      });

      const data = await res.json();

      // Duplicate email
      if (res.status === 409) {
        showToast("you’re already on the list. we haven’t forgotten you.", "warning");
        setLocking(false);
        return;
      }

      // Disposable email blocked by API
      if (res.status === 400 && data.error?.includes("real email")) {
        showToast("that email won’t work. use a real one.", "error");
        setLocking(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "something went wrong.");
      }

      // Success — in-card success state handles UI, no toast needed
      setDone(true);
      if (onSubmitted) onSubmitted();

    } catch {
      showToast("something went wrong. try again in a bit.", "error");
      setLocking(false);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success state ───────────────────────────────────────────────────────────
  if (done) {
    const raw = name.trim().split(" ")[0];
    const firstName = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="flex flex-col items-center text-center w-full py-4"
      >
        <img 
          src="/branding/png/lulu-mark-marigold.png" 
          alt="lulu" 
          style={{ width: "52px", height: "52px", objectFit: "contain", marginBottom: "24px" }} 
        />
        <h3
          className="font-display font-medium text-lulu-bg mb-3"
          style={{ fontSize: 28, letterSpacing: "-0.03em", lineHeight: 1.25 }}
        >
          lulu, meet {firstName}.<br />
          {firstName}, meet lulu.
        </h3>
        <p className="font-body text-[14px]" style={{ color: "rgba(15, 13, 11, 0.45)" }}>
          until then — tell someone interesting about us.
        </p>
      </motion.div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Placeholder color via a global style tag */}
      <style>{`
        .lulu-input::placeholder { color: ${placeholderColor}; }
        .lulu-input-quirky::placeholder { color: rgba(184, 118, 26, 0.7) !important; }
        .lulu-input {
          caret-color: var(--color-lulu-marigold-light);
          background-color: transparent !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: 1.5px solid rgba(15, 13, 11, 0.15) !important;
          border-radius: 0 !important;
          transition: border-bottom-color 250ms ease !important;
        }
        .lulu-input.is-open,
        .lulu-input:focus,
        .lulu-input:focus-visible,
        .lulu-input:focus-within {
          outline: none !important;
          box-shadow: none !important;
          border-bottom-color: #B8761A !important;
        }
        .lulu-input:not(:placeholder-shown),
        .lulu-input:valid {
          outline: none !important;
          box-shadow: none !important;
        }
        .lulu-cta {
          padding: 16px;
          background: linear-gradient(to bottom, #C4811F 0%, #B8761A 50%, #A86A14 100%);
          color: #F5F0E6;
          border-radius: 12px;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.02em;
          border: none;
          cursor: pointer;
          position: relative;
          box-shadow:
            inset 0 1px 0 rgba(255, 220, 150, 0.35),
            0 1px 2px rgba(0, 0, 0, 0.06),
            0 8px 24px rgba(184, 118, 26, 0.28),
            0 12px 40px rgba(184, 118, 26, 0.15);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .lulu-cta:hover {
          transform: translateY(-2px);
          box-shadow:
            inset 0 1px 0 rgba(255, 220, 150, 0.4),
            0 1px 2px rgba(0, 0, 0, 0.06),
            0 12px 32px rgba(184, 118, 26, 0.34),
            0 16px 48px rgba(184, 118, 26, 0.2);
        }
        .lulu-cta:active {
          transform: translateY(0);
          box-shadow:
            inset 0 1px 0 rgba(255, 220, 150, 0.3),
            0 1px 2px rgba(0, 0, 0, 0.08),
            0 4px 12px rgba(184, 118, 26, 0.24);
        }
        .lulu-cta:hover .cta-arrow {
          transform: translateX(4px);
        }
        .cta-arrow {
          display: inline-block;
          transition: transform 250ms ease;
        }
      `}</style>

      {/* Card header */}
      <div className="flex flex-col items-center text-center mb-5">
        <span className="font-body font-medium text-[11px] uppercase tracking-[0.20em] text-lulu-marigold-light mb-4">
          you're early.
        </span>
        <h2
          className="font-display font-medium text-lulu-bg leading-tight mb-3"
          style={{ fontSize: 34, letterSpacing: "-0.03em" }}
        >
          be first.
        </h2>
        <p
          className="font-body text-[14px] leading-relaxed"
          style={{ color: "rgba(15, 13, 11, 0.45)" }}
        >
          we're launching city by city. be the first to know when lulu hits yours.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="w-full flex flex-col gap-[10px]">
        {/* Name */}
        <Field id="name" label="name">
          <input
            id="name"
            type="text"
            value={name}
            placeholder={quirky.name ? "we need something to call you." : "your name"}
            autoComplete="name"
            onChange={(e) => {
              setName(e.target.value);
              if (quirky.name) setQuirky((p) => ({ ...p, name: false }));
            }}
            onFocus={() => setFocused((p) => ({ ...p, name: true }))}
            onBlur={() => {
              setFocused((p) => ({ ...p, name: false }));
              setBlurred((p) => ({ ...p, name: true }));
            }}
            className={`lulu-input font-body${quirky.name ? " lulu-input-quirky" : ""}`}
            style={inputBase}
          />
          {/* Name microcopy */}
          <AnimatePresence>
            {blurred.name && name.trim() && (
              <motion.p
                key="name-micro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-body"
                style={{ fontSize: 12, fontStyle: "italic", color: "var(--color-lulu-marigold-light)", opacity: 0.7, paddingLeft: 2 }}
              >
                what your future match will know you as.
              </motion.p>
            )}
          </AnimatePresence>
        </Field>

        {/* Email */}
        <Field id="email" label="email">
          <input
            id="email"
            type="email"
            value={email}
            placeholder={quirky.email ? "how else will we find you?" : "your email"}
            autoComplete="email"
            onChange={(e) => {
              setEmail(e.target.value);
              if (quirky.email) setQuirky((p) => ({ ...p, email: false }));
            }}
            onFocus={() => setFocused((p) => ({ ...p, email: true }))}
            onBlur={() => {
              setFocused((p) => ({ ...p, email: false }));
              setBlurred((p) => ({ ...p, email: true }));
            }}
            className={`lulu-input font-body${quirky.email ? " lulu-input-quirky" : ""}`}
            style={inputBase}
          />
          {/* Email microcopy */}
          <AnimatePresence>
            {blurred.email && email.trim() && (
              <motion.p
                key="email-micro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-body"
                style={{ fontSize: 12, fontStyle: "italic", color: "var(--color-lulu-marigold-light)", opacity: 0.7, paddingLeft: 2 }}
              >
                got it. this stays between us.
              </motion.p>
            )}
          </AnimatePresence>
        </Field>

        {/* City */}
        <Field id="city" label="city">
          <CityDropdown
            value={city}
            quirkyPlaceholder={quirky.city}
            onChange={(v) => {
              setCity(v);
              setCityTouched(true);
              if (quirky.city) setQuirky((p) => ({ ...p, city: false }));
            }}
          />
          {/* City microcopy */}
          <AnimatePresence>
            {cityTouched && CITY_HINTS[city] && (
              <motion.p
                key={city}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-body"
                style={{ fontSize: 12, fontStyle: "italic", color: "var(--color-lulu-marigold-light)", opacity: 0.7, paddingLeft: 2 }}
              >
                {CITY_HINTS[city]}
              </motion.p>
            )}
          </AnimatePresence>
        </Field>

        {/* CTA */}
        <button
          type="submit"
          disabled={submitting || locking}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="lulu-cta w-full mt-2 font-display disabled:opacity-60"
          style={{
            cursor: submitting || locking ? "not-allowed" : "pointer",
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2 h-[24px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={locking || submitting ? "loading" : hovering ? "hover" : "default"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center gap-2 w-full"
              >
                {locking || submitting
                  ? "obviously locking you in..."
                  : idleMessage
                  ? idleMessage
                  : hovering
                  ? <>go on — you know you want to. <span className="cta-arrow">→</span></>
                  : <>i'm in. obviously. <span className="cta-arrow">→</span></>}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>

        {/* Legal */}
        <div 
          className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mt-1"
        >
          <p
            className="font-body text-center"
            style={{ fontSize: 12, color: "rgba(15, 13, 11, 0.3)" }}
          >
            one email. when your city goes live. that's it.
          </p>
          <span className="lulu-voice" style={{
            "--lulu-voice-size": "24px",
            transform: "rotate(-2deg)",
            color: "#3D2E1E",
            opacity: 0.85,
            display: "inline-block",
            flexShrink: 0,
          } as any}>
            promise.
          </span>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          id={toast.id}
          onDismiss={dismissToast}
        />
      )}
    </>
  );
};
