"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitWaitlist } from "@/lib/waitlist";
import { MarigoldDot } from "@lulu/ui/components";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [flashError, setFlashError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError(true);
      setFlashError(true);
      setEmail("");
      setTimeout(() => setFlashError(false), 200);
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitWaitlist(email.trim());
      if (result.success) {
        setDone(true);
      } else {
        setError(true);
        setEmail(""); // Clear to show error placeholder
        setFlashError(true);
        setTimeout(() => setFlashError(false), 200);
      }
    } catch (err) {
      setError(true);
      setEmail(""); // Clear to show error placeholder
      setFlashError(true);
      setTimeout(() => setFlashError(false), 200);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="font-body font-medium text-center text-lulu-peach"
        style={{
          fontSize: 18,
          textShadow: "0px 4px 12px rgba(26, 15, 8, 0.18)",
        }}
      >
        you're in. we'll find you when we launch
        <MarigoldDot fontSizePx={18} color="#FFB89E" />
      </motion.p>
    );
  }

  const placeholder = error ? "that's not an email." : "your email";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor="waitlist-email" className="sr-only">
        email address
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="waitlist-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(false);
          }}
          placeholder={placeholder}
          className="flex-1 font-body bg-lulu-surface text-lulu-cream rounded-lulu-md outline-none transition-shadow"
          style={{
            fontSize: 16,
            padding: "16px 18px",
            border: `1px solid ${flashError ? "#E24B4A" : "#2A2725"}`,
            color: error ? "#E24B4A" : "#F5F0E6",
          }}
          onFocus={(e) => {
            if (!flashError) {
              e.currentTarget.style.borderColor = "#E89B23";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232, 155, 35, 0.15)";
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = flashError ? "#E24B4A" : "#2A2725";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          className="font-body font-medium rounded-lulu-md transition-all active:scale-[0.98] disabled:opacity-70"
          style={{
            fontSize: 16,
            padding: "16px 24px",
            backgroundColor: "#E89B23",
            color: "#0F0D0B",
            transition: "background-color 200ms ease, transform 100ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFB89E")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E89B23")}
        >
          join the waitlist
        </button>
      </div>
      <AnimatePresence />
    </form>
  );
};
