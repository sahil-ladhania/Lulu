"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CITIES = ["Bangalore", "Mumbai", "Pune", "Hyderabad", "Delhi / NCR", "Other"];

// ─── Input styles ─────────────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  padding: "13px 15px",
  backgroundColor: "rgba(245,240,230,0.045)",
  border: "1px solid rgba(245,240,230,0.07)",
  borderRadius: 10,
  fontSize: 15,
  color: "#F5F0E6",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s, background-color 0.2s",
  fontFamily: "inherit",
};
const inputFocus: React.CSSProperties = {
  borderColor: "rgba(232,155,35,0.38)",
  backgroundColor: "rgba(245,240,230,0.065)",
};
const inputError: React.CSSProperties = {
  borderColor: "rgba(226,75,74,0.5)",
};
const placeholderColor = "rgba(245,240,230,0.25)";

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
      stroke="rgba(245,240,230,0.3)"
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
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
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
          borderColor: open ? "rgba(232,155,35,0.38)" : "rgba(245,240,230,0.07)",
          backgroundColor: open
            ? "rgba(245,240,230,0.065)"
            : "rgba(245,240,230,0.045)",
        }}
      >
        <span>{value}</span>
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
            className="absolute left-0 right-0 top-[calc(100%+6px)] rounded-[12px] z-50 py-1"
            style={{
              transformOrigin: "top",
              backgroundColor: "rgba(28,25,22,0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(245,240,230,0.1)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
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
                  className="w-full flex items-center justify-between font-body text-[15px] px-4 py-3 transition-colors duration-150 cursor-pointer"
                  style={{
                    color: isSelected ? "#E89B23" : "rgba(245,240,230,0.75)",
                    backgroundColor: "transparent",
                    border: "none",
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "rgba(245,240,230,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  <span>{city}</span>
                  {isSelected && (
                    <div className="w-[5px] h-[5px] rounded-full bg-lulu-marigold" />
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
  hasError,
  shaking,
  children,
}: {
  id: string;
  label: string;
  hasError?: boolean;
  shaking?: boolean;
  children: React.ReactNode;
}) => (
  <div className={`flex flex-col gap-1.5 ${shaking ? "animate-shake" : ""}`}>
    <label
      htmlFor={id}
      className="font-body font-medium text-[11px] uppercase tracking-[0.14em] px-1"
      style={{ color: hasError ? "rgba(226,75,74,0.7)" : "rgba(245,240,230,0.35)" }}
    >
      {label}
    </label>
    {children}
  </div>
);

// ─── Main Form ────────────────────────────────────────────────────────────────
export const WaitlistForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Bangalore");

  const [errors, setErrors] = useState({ name: false, email: false });
  const [shaking, setShaking] = useState({ name: false, email: false });
  const [focused, setFocused] = useState({ name: false, email: false });

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const triggerShake = (fields: { name?: boolean; email?: boolean }) => {
    setShaking((p) => ({ ...p, ...fields }));
    setTimeout(
      () => setShaking((p) => ({ ...p, name: false, email: false })),
      300
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: !name.trim(),
      email: !EMAIL_RE.test(email.trim()),
    };
    if (newErrors.name || newErrors.email) {
      setErrors(newErrors);
      triggerShake(newErrors);
      return;
    }
    setSubmitting(true);
    try {
      await fetch("https://api.getluluapp.in/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), city }),
      });
      setDone(true);
    } catch {
      setErrors({ name: false, email: true });
      triggerShake({ email: true });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success state ───────────────────────────────────────────────────────────
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="flex flex-col items-center text-center w-full py-4"
      >
        <div
          className="flex items-center justify-center w-[52px] h-[52px] rounded-full mb-6"
          style={{ border: "1px solid rgba(232,155,35,0.35)" }}
        >
          <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
            <path
              d="M2 7.5L7.5 13L18 2"
              stroke="#E89B23"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3
          className="font-display font-medium text-lulu-cream mb-2"
          style={{ fontSize: 28, letterSpacing: "-0.03em" }}
        >
          you're on the list.
        </h3>
        <p className="font-body text-[14px]" style={{ color: "rgba(245,240,230,0.38)" }}>
          we'll reach out when lulu goes live in your city.
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
        .lulu-input { caret-color: #E89B23; }
      `}</style>

      <form onSubmit={onSubmit} noValidate className="w-full flex flex-col gap-[14px]">
        {/* Name */}
        <Field id="name" label="name" hasError={errors.name} shaking={shaking.name}>
          <input
            id="name"
            type="text"
            value={name}
            placeholder="your name"
            autoComplete="name"
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: false }));
            }}
            onFocus={() => setFocused((p) => ({ ...p, name: true }))}
            onBlur={() => setFocused((p) => ({ ...p, name: false }))}
            className="lulu-input font-body"
            style={{
              ...inputBase,
              ...(focused.name && !errors.name ? inputFocus : {}),
              ...(errors.name ? inputError : {}),
            }}
          />
        </Field>

        {/* Email */}
        <Field id="email" label="email" hasError={errors.email} shaking={shaking.email}>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="your email"
            autoComplete="email"
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: false }));
            }}
            onFocus={() => setFocused((p) => ({ ...p, email: true }))}
            onBlur={() => setFocused((p) => ({ ...p, email: false }))}
            className="lulu-input font-body"
            style={{
              ...inputBase,
              ...(focused.email && !errors.email ? inputFocus : {}),
              ...(errors.email ? inputError : {}),
            }}
          />
        </Field>

        {/* City */}
        <Field id="city" label="city">
          <CityDropdown value={city} onChange={setCity} />
        </Field>

        {/* CTA */}
        <button
          type="submit"
          disabled={submitting}
          className="relative w-full mt-2 overflow-hidden font-display font-medium rounded-[10px] transition-transform active:scale-[0.985] disabled:opacity-60 group"
          style={{
            fontSize: 16,
            padding: "15px",
            backgroundColor: "#E89B23",
            color: "#0F0D0B",
            letterSpacing: "-0.02em",
            border: "none",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {submitting ? "sending…" : <>i'm in <span>→</span></>}
          </span>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.08] transition-opacity z-0" />
        </button>

        {/* Legal */}
        <p
          className="font-body text-center mt-1"
          style={{ fontSize: 12, color: "rgba(245,240,230,0.22)" }}
        >
          no spam. ever. we'll only write when your city goes live.
        </p>
      </form>
    </>
  );
};
