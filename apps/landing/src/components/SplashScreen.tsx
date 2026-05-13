"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@lulu/ui/components";

export const SplashScreen = ({ onDone }: { onDone: () => void }) => {
  const [visible, setVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const startExitTimer = () => {
      timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDone, 700);
      }, 4000);
    };

    // Preload the image and wait for it
    const img = new Image();
    img.src = "/splash-bg.jpg";
    
    const handleLoad = () => {
      setImageLoaded(true);
      startExitTimer();
    };

    // If image loads or fails, start timer
    img.onload = handleLoad;
    img.onerror = handleLoad;

    // Fallback: start timer anyway after 6 seconds
    const fallbackTimer = setTimeout(() => {
      if (!imageLoaded) {
        handleLoad();
      }
    }, 6000);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      if (timer) clearTimeout(timer);
      clearTimeout(fallbackTimer);
      window.removeEventListener("resize", checkMobile);
    };
  }, [onDone, imageLoaded]);

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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            backgroundColor: "#0F0D0B",
            backgroundImage: "url('/splash-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          {/* Frosted Glass Overlay */}
          <div
            style={{
              background: "rgba(15, 13, 11, 0.30)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              position: "absolute",
              inset: 0,
              zIndex: 1,
            }}
          />

          {/* Content Layer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* ROW 1: Mark + Wordmark */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
              {/* Mark */}
              <Logo 
                variant="mark" 
                color="marigold" 
                format="png" 
                size={isMobile ? 48 : 72} 
                style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.3))" }}
              />

              {/* Wordmark text */}
              <div
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: isMobile ? 44 : 64,
                  letterSpacing: "-0.04em",
                  color: "#FFFFFF",
                  textShadow: "0 2px 20px rgba(0,0,0,0.4)",
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
                    width: isMobile ? "3px" : "4px",
                    height: isMobile ? "3px" : "4px",
                    borderRadius: "50%",
                    background: "#E89B23",
                    marginLeft: "2px",
                    verticalAlign: "middle",
                    position: "relative",
                    bottom: isMobile ? "1px" : "2px"
                  }}
                />
              </div>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              style={{
                fontFamily: "'Switzer', sans-serif",
                fontWeight: 500,
                fontSize: isMobile ? 15 : 18,
                color: "#FFFFFF",
                letterSpacing: "0.04em",
                textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                margin: 0,
              }}
            >
              match deeper, reveal later.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
