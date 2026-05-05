// dot is rendered as a real CSS element (not a font period or unicode bullet)
// per brand spec — sized at ~9% of font-size for hero, ~14% for wordmark
export const LuluWordmark = ({ sizePx = 20, className = "" }: { sizePx?: number; className?: string }) => {
  const dotSize = Math.max(3, Math.round(sizePx * 0.14));
  return (
    <span
      className={`inline-flex items-baseline font-display text-lulu-cream lowercase ${className}`}
      style={{ fontSize: `${sizePx}px`, letterSpacing: "-2px", lineHeight: 1 }}
    >
      lulu
      <span
        aria-hidden="true"
        className="inline-block rounded-full bg-lulu-marigold"
        style={{ width: dotSize, height: dotSize, marginLeft: "2px" }}
      />
    </span>
  );
};
