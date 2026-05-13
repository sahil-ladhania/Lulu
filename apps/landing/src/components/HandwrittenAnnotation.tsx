"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

export type TextChunk = {
  content: string;
  marginLeft?: string;
  breakAfter?: boolean;
};

export type SvgPathDef = {
  d: string;
  strokeWidth?: string | number;
  opacity?: string | number;
  strokeLinecap?: "butt" | "round" | "square" | "inherit";
  strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
  duration?: number; // Defaults to 0.7 for normal paths, 0.2 for arrowheads
};

export type SvgDef = {
  props: React.SVGProps<SVGSVGElement>;
  paths: SvgPathDef[];
};

export interface HandwrittenAnnotationProps {
  isActive: boolean;
  baseDelay?: number;
  textChunks: TextChunk[];
  svgs?: SvgDef[];
  className?: string;
  style?: React.CSSProperties;
}

export const HandwrittenAnnotation = ({
  isActive,
  baseDelay = 0,
  textChunks,
  svgs = [],
  className = "",
  style = {},
}: HandwrittenAnnotationProps) => {
  const prefersReducedMotion = useReducedMotion();
  const CHAR_DELAY = 0.045; // 45ms per character

  const totalChars = textChunks.reduce((acc, chunk) => acc + chunk.content.length, 0);
  const textCompleteTime = baseDelay + totalChars * CHAR_DELAY;

  // Pre-calculate path delays so they draw sequentially
  let currentDelay = textCompleteTime;
  const processedSvgs = svgs.map((svg) => {
    const paths = svg.paths.map((path) => {
      const isArrowhead = path.d.length < 30; // Heuristic to detect short arrowheads
      const duration = path.duration || (isArrowhead ? 0.2 : 0.7);
      const pathStartDelay = currentDelay;
      currentDelay += duration; // Next path starts after this one finishes
      return { ...path, delay: pathStartDelay, duration };
    });
    return { ...svg, paths };
  });

  return (
    <div className={className} style={style}>
      {textChunks.map((chunk, chunkIdx) => {
        const prevChars = textChunks.slice(0, chunkIdx).reduce((acc, c) => acc + c.content.length, 0);
        return (
          <React.Fragment key={chunkIdx}>
            <span style={{ marginLeft: chunk.marginLeft, display: "inline-block" }}>
              {chunk.content.split("").map((char, charIdx) => {
                const charDelay = baseDelay + (prevChars + charIdx) * CHAR_DELAY;
                return (
                  <motion.span
                    key={charIdx}
                    initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
                    animate={{ opacity: prefersReducedMotion || isActive ? 1 : 0 }}
                    transition={{ duration: 0.1, delay: prefersReducedMotion ? 0 : (isActive ? charDelay : 0) }}
                    style={{ display: "inline" }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {chunk.breakAfter && <br />}
          </React.Fragment>
        );
      })}

      {processedSvgs.map((svg, svgIdx) => (
        <svg key={svgIdx} {...svg.props}>
          {svg.paths.map((path, pathIdx) => (
            <motion.path
              key={pathIdx}
              d={path.d}
              stroke="#3D2E1E"
              strokeWidth={path.strokeWidth || "1.5"}
              fill="none"
              opacity={path.opacity || "0.6"}
              strokeLinecap={path.strokeLinecap || "round"}
              strokeLinejoin={path.strokeLinejoin || "round"}
              initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
              animate={{ pathLength: prefersReducedMotion || isActive ? 1 : 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : path.duration,
                delay: prefersReducedMotion ? 0 : (isActive ? path.delay : 0),
                ease: "easeOut",
              }}
            />
          ))}
        </svg>
      ))}
    </div>
  );
};
