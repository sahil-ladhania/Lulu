"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@lulu/ui/components";

export const SplashScreen = ({ onDone }: { onDone: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // give the exit animation time to finish, then tell parent
      setTimeout(onDone, 700);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#0F0D0B",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Film grain */}
          <svg
            style={{
              position: "fixed",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.035,
              pointerEvents: "none",
              zIndex: 10000,
            }}
          >
            <filter id="splash-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#splash-grain)" />
          </svg>

          {/* Logo lockup — mark left, wordmark right, side by side */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* ROW 1: Mark + Wordmark */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
              {/* Mark */}
              <Logo variant="mark" color="marigold" size={64} />

              {/* Wordmark text */}
              <div
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: 52,
                  letterSpacing: "-0.04em",
                  color: "#F5F0E6",
                  display: "flex",
                  alignItems: "baseline",
                  lineHeight: 1,
                  marginTop: 0,
                }}
              >
                lulu
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "#E89B23",
                    marginLeft: "2px",
                    verticalAlign: "middle",
                    position: "relative",
                    bottom: "2px"
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
            style={{
              fontFamily: "'Switzer', sans-serif",
              fontWeight: 500,
              fontSize: 16,
              color: "#F5F0E6",
              letterSpacing: "0.04em",
              marginTop: 12,
            }}
          >
            match deeper, reveal later.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
