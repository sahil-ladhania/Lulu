// renders the brand-signature dot inline, baseline-aligned, sized to font-size
export const MarigoldDot = ({ fontSizePx, color = "var(--color-lulu-marigold, #E89B23)", className = "" }: { fontSizePx: number; color?: string; className?: string }) => {
  const size = Math.max(4, Math.round(fontSizePx * 0.09));
  return (
    <span
      aria-hidden="true"
      className={`inline-block rounded-full align-baseline ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        marginLeft: Math.round(size * 0.4),
      }}
    />
  );
};
