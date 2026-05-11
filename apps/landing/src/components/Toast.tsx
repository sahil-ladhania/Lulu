"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@lulu/ui/components";

export type ToastType = "warning" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  id: number;
  onDismiss: () => void;
}

export const Toast = ({ message, type, id, onDismiss }: ToastProps) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [id, onDismiss]);

  const isError = type === "error";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          bottom: 32,
          left: "50%",
          x: "-50%",
          zIndex: 99999,
          pointerEvents: "none",
          maxWidth: 420,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 20px",
          backgroundColor: "rgba(15,13,11,0.95)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: isError
            ? "1px solid rgba(226,75,74,0.25)"
            : "1px solid rgba(245,240,230,0.10)",
          borderRadius: 100,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          fontFamily: "'Switzer', sans-serif",
          fontWeight: 400,
          fontSize: 13,
          color: "rgba(245,240,230,0.85)",
          letterSpacing: "0.01em",
        } as React.CSSProperties}
      >
        <Logo variant="mark" color="marigold" size={14} />
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};
