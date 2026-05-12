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
  padding: "13px 15px",
  backgroundColor: "rgba(15, 13, 11, 0.04)",
  border: "none",
  borderRadius: 10,
  fontSize: 15,
  color: "var(--color-lulu-bg)",
  outline: "none",
  boxShadow: "none",
  width: "100%",
  transition: "background-color 0.2s ease",
  fontFamily: "'Switzer', sans-serif",
};
const inputFocus: React.CSSProperties = {
  backgroundColor: "rgba(15, 13, 11, 0.07)",
};
// inputError removed — validation uses quirky placeholders instead
const placeholderColor = "rgba(15, 13, 11, 0.25)";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Chevron icon */
const Chevron = ({ open }: { open: boolean }) => (
  <motion.svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.2 }}
  >
    <path
      d="M1 1L5 5L9 1"
      stroke="rgba(15, 13, 11, 0.3)"
      strokeWidth="1.5"
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
        className="w-full flex items-center justify-between font-body rounded-[10px] cursor-pointer"
        style={{
          ...inputBase,
          textAlign: "left",
          color: "#F5F0E6",
          backgroundColor: "rgba(245,240,230,0.06)",
        }}
      >
        <span
          style={{
            color: value
              ? "var(--color-lulu-bg)"
              : showQuirky
              ? "rgba(184,118,26,0.7)"
              : "rgba(15, 13, 11, 0.25)",
          }}
        >
          {value || (showQuirky ? "pick a city. any city." : "select your city")}
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
            className="absolute left-0 right-0 top-[calc(100%+6px)] rounded-[10px] z-50 py-1 overflow-hidden"
            style={{
              transformOrigin: "top",
              backgroundColor: "#F5F0E6",
              border: "1px solid rgba(15, 13, 11, 0.08)",
              boxShadow: "0 16px 40px rgba(15, 13, 11, 0.08)",
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
                  className="w-full flex items-center justify-between font-body text-[15px] px-4 py-[13px] transition-all duration-150 cursor-pointer"
                  style={{
                    color: isSelected ? "var(--color-lulu-marigold-light)" : "rgba(15, 13, 11, 0.75)",
                    backgroundColor: "transparent",
                    border: "none",
                    textAlign: "left",
                    fontFamily: "'Switzer', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.backgroundColor = "rgba(15, 13, 11, 0.06)";
                    target.style.color = "var(--color-lulu-marigold-light)";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.backgroundColor = "transparent";
                    target.style.color = isSelected ? "var(--color-lulu-marigold-light)" : "rgba(15, 13, 11, 0.75)";
                  }}
                >
                  <span>{city}</span>
                  {isSelected && (
                    <div className="w-[5px] h-[5px]" style={{ borderRadius: "50%", background: "#B8761A" }} />
                  )}
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
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="font-body font-medium text-[11px] uppercase tracking-[0.14em] px-1"
      style={{ color: "rgba(15, 13, 11, 0.35)" }}
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
        .lulu-input { caret-color: var(--color-lulu-marigold-light); }
        .lulu-input:focus,
        .lulu-input:focus-visible,
        .lulu-input:focus-within {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        .lulu-input:not(:placeholder-shown),
        .lulu-input:valid {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
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
            style={{
              ...inputBase,
              ...(focused.name ? inputFocus : {}),
            }}
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
            style={{
              ...inputBase,
              ...(focused.email ? inputFocus : {}),
            }}
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
        <motion.button
          type="submit"
          disabled={submitting || locking}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          whileHover={{ y: -1, boxShadow: "0 6px 24px rgba(184,118,26,0.4)" }}
          whileTap={{ y: 1, boxShadow: "0 2px 8px rgba(184,118,26,0.2)" }}
          className="relative w-full mt-2 overflow-hidden font-display font-medium rounded-[10px] disabled:opacity-60"
          style={{
            fontSize: 17,
            padding: "15px",
            background: "#B8761A",
            color: "#F5F0E6",
            letterSpacing: "-0.03em",
            border: "none",
            cursor: submitting || locking ? "not-allowed" : "pointer",
            boxShadow: "0 4px 16px rgba(184,118,26,0.3)",
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
                  ? "go on — you know you want to."
                  : <>i'm in. obviously. <span>→</span></>}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>

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
